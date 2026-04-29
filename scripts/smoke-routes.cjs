#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const BASE = process.env.SOPHIA_BASE_URL || 'http://127.0.0.1:4173';
const DESKTOP = { width: 1440, height: 1000 };
const MOBILE = { width: 390, height: 844 };
const failures = [];
const artifactDir = path.resolve(process.cwd(), 'test-results', 'smoke-routes');

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function isIgnoredConsoleError(text) {
  return /Permissions policy violation: compute-pressure is not allowed in this document/i.test(text) ||
    /Failed to load resource: the server responded with a status of 404 \(File not found\)/i.test(text);
}

function isPortInUse(error) {
  return error && typeof error === 'object' && (error.code === 'EADDRINUSE' || error.code === 'EACCES');
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.xml': return 'application/xml; charset=utf-8';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.ico': return 'image/x-icon';
    case '.webmanifest': return 'application/manifest+json; charset=utf-8';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    default: return 'application/octet-stream';
  }
}

async function canReachBase(baseUrl) {
  if (!globalThis.fetch) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    const response = await fetch(`${baseUrl}/`, { method: 'HEAD', signal: controller.signal });
    return !!response;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function startStaticServer(baseUrl) {
  const url = new URL(baseUrl);
  const host = url.hostname || '127.0.0.1';
  const port = Number(url.port || '4173');
  const root = path.resolve(__dirname, '..');

  const server = http.createServer((req, res) => {
    try {
      if (!req.url) {
        res.writeHead(400);
        res.end('Bad Request');
        return;
      }

      const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname === '/api/public-config') {
        res.writeHead(200, {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-store, max-age=0',
        });
        res.end(`window.SOPHIA_CONFIG = ${JSON.stringify({
          SUPABASE_URL: 'https://wftxhojlvrymtdtekhdx.supabase.co',
          SUPABASE_ANON_KEY: '',
        })};
window.SOPHIA_SUPABASE_ANON_KEY = window.SOPHIA_CONFIG.SUPABASE_ANON_KEY;
`);
        return;
      }

      const safePath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
      let filePath = path.join(root, safePath);

      if (pathname === '/' || pathname === '') filePath = path.join(root, 'index.html');
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'content-type': contentType(filePath) });
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      fs.createReadStream(filePath).pipe(res);
	    } catch (error) {
	      if (process.env.SOPHIA_SMOKE_SERVER_DEBUG) {
	        console.error('[smoke-routes] static server error', error);
	      }
	      if (!res.headersSent) {
	        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
	      }
	      res.end('Not found');
	    }
	  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve());
  });

  return { server, baseUrl: `${url.protocol}//${host}:${port}` };
}

async function checkOverflow(page, routeName, viewportName) {
  const sample = async () => page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollEl = document.scrollingElement || doc;
    const cssOverflowX = [getComputedStyle(doc).overflowX, body ? getComputedStyle(body).overflowX : 'visible'];
    return {
      clipped: cssOverflowX.some((value) => value === 'hidden' || value === 'clip'),
      geometryOverflow: scrollEl.scrollWidth > scrollEl.clientWidth + 1,
    };
  });

  let reading = await sample();
  if (reading.geometryOverflow && reading.clipped) {
    await page.waitForTimeout(350);
    reading = await sample();
  }

  const hasOverflow = reading.clipped ? false : reading.geometryOverflow;
  if (hasOverflow) fail(`${routeName} (${viewportName}) has horizontal overflow`);
}

async function routeAudit(browser, route, viewport, viewportName) {
  const page = await browser.newPage({ viewport });
  const failureCountAtStart = failures.length;
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isIgnoredConsoleError(msg.text())) consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  const response = await page.goto(`${route.baseUrl}${route.path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(250);

  if (!response || response.status() >= 400) {
    fail(`${route.name} (${viewportName}) returned HTTP ${response ? response.status() : 'no response'}`);
  }

  if (route.validate) {
    await route.validate(page, viewportName);
  } else if (route.selector) {
    const count = await page.locator(route.selector).count();
    if (!count) fail(`${route.name} (${viewportName}) missing selector ${route.selector}`);
  }

  await checkOverflow(page, route.name, viewportName);
  if (consoleErrors.length) {
    fail(`${route.name} (${viewportName}) console errors: ${consoleErrors.slice(0, 3).join(' | ')}`);
  }

  if (failures.length > failureCountAtStart) {
    fs.mkdirSync(artifactDir, { recursive: true });
    const safeRoute = route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const targetPath = path.join(artifactDir, `${safeRoute}-${viewportName}.png`);
    await page.screenshot({ path: targetPath, fullPage: true }).catch(() => {});
  }

  await page.close();
}

async function validateTranslator(page, viewportName) {
  const runButton = page.locator('#translatorRun');
  const input = page.locator('#translatorInput');
  const output = page.locator('#translatorOutput');
  const status = page.locator('#translatorStatus');

  if (!(await runButton.count())) {
    fail(`Translator (${viewportName}) missing #translatorRun`);
    return;
  }

  const initialStatus = (await status.textContent()) || '';
  await input.fill('Hello from Sophia smoke test.');
  await runButton.click();
  await page.waitForTimeout(1000);

  const resultText = (await output.inputValue()).trim();
  const nextStatus = ((await status.textContent()) || '').trim();
  if (!resultText && nextStatus === initialStatus) {
    fail(`Translator (${viewportName}) did not update output or status after translate`);
  }
}

async function validateLogin(page, viewportName) {
  const form = page.locator('#loginForm');
  if (!(await form.count())) {
    fail(`Login (${viewportName}) missing #loginForm`);
    return;
  }

  await page.fill('#email', 'smoke@example.com');
  await page.fill('#password', 'not-a-real-password');
  await page.click('#loginBtn');
  await page.waitForTimeout(800);

  const authErrorVisible = await page.locator('#authError').evaluate((el) => {
    return window.getComputedStyle(el).display !== 'none' && el.textContent.trim().length > 0;
  }).catch(() => false);
  const path = await page.evaluate(() => window.location.pathname);
  if (!authErrorVisible && path !== '/dashboard.html') {
    fail(`Login (${viewportName}) submit did not show feedback or redirect`);
  }
}

async function validateDashboard(page, viewportName) {
  const path = await page.evaluate(() => window.location.pathname);
  if (!['/dashboard.html', '/login.html'].includes(path)) {
    fail(`Dashboard (${viewportName}) navigated to unexpected path ${path}`);
    return;
  }

  if (path === '/dashboard.html') {
    const loading = await page.locator('#loadingState').count();
    if (!loading) fail(`Dashboard (${viewportName}) missing loading state`);
    return;
  }

  const loginForm = await page.locator('#loginForm').count();
  if (!loginForm) fail(`Dashboard (${viewportName}) redirected but login form missing`);
}

const routes = [
  { name: 'Home', path: '/', selector: '#main-content' },
  { name: 'Market', path: '/market.html', selector: '#main-content' },
  { name: 'Social', path: '/social.html', selector: '#socialFeed' },
  { name: 'Translator', path: '/#translate', validate: validateTranslator },
  { name: 'Login', path: '/login.html', validate: validateLogin },
  { name: 'Dashboard', path: '/dashboard.html', validate: validateDashboard },
  { name: 'Control Center', path: '/control-center.html', selector: '#main-content' },
  { name: 'Session', path: '/session.html?room=sophia-smoke', selector: '#videoArea' },
  { name: 'Settings', path: '/settings.html', selector: '.control-shell' },
];

(async () => {
  let baseUrl = BASE;
  let serverToClose = null;

  if (!process.env.SOPHIA_BASE_URL) {
    const reachable = await canReachBase(baseUrl);
    if (!reachable) {
      try {
        const { server, baseUrl: startedBase } = await startStaticServer(baseUrl);
        serverToClose = server;
        baseUrl = startedBase;
      } catch (error) {
        if (!isPortInUse(error)) {
          fail(`Could not start local static server for route smoke: ${error && error.message ? error.message : String(error)}`);
        }
      }
    }

    const nowReachable = await canReachBase(baseUrl);
    if (!nowReachable) {
      fail(`Route smoke could not reach ${baseUrl}. Set SOPHIA_BASE_URL to a running preview server.`);
    }
  }

  if (failures.length) process.exit(1);

  const browser = await chromium.launch({ headless: true });
  try {
    for (const route of routes) {
      await routeAudit(browser, { ...route, baseUrl }, DESKTOP, 'desktop');
      await routeAudit(browser, { ...route, baseUrl }, MOBILE, 'mobile');
    }
  } finally {
    await browser.close();
    if (serverToClose) {
      await new Promise((resolve) => serverToClose.close(() => resolve()));
    }
  }

  if (failures.length) {
    console.error(`Route smoke failed with ${failures.length} issue(s).`);
    process.exit(1);
  }
  console.log(`Route smoke passed for ${routes.length} routes on desktop and mobile.`);
})();
