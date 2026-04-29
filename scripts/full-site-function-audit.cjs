#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const BASE = process.env.SOPHIA_BASE_URL || 'http://127.0.0.1:4173';
const ROOT = path.resolve(__dirname, '..');
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function isIgnoredConsoleError(text) {
  return /Permissions policy violation: compute-pressure is not allowed in this document/i.test(text) ||
    /Failed to load resource: the server responded with a status of 404 \(File not found\)/i.test(text);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.xml': return 'application/xml; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.webmanifest': return 'application/manifest+json; charset=utf-8';
    default: return 'application/octet-stream';
  }
}

async function canReachBase(baseUrl) {
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
  const server = http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
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

      let filePath = path.join(ROOT, path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, ''));
      if (pathname === '/' || pathname === '') filePath = path.join(ROOT, 'index.html');
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'content-type': contentType(filePath) });
      if (req.method === 'HEAD') res.end();
      else fs.createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Internal error');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  return { server, baseUrl: `${url.protocol}//${host}:${port}` };
}

async function withPage(browser, baseUrl, route, fn, viewport = { width: 1365, height: 950 }) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isIgnoredConsoleError(msg.text())) consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(350);
    if (!response || response.status() >= 400) fail(`${route} returned HTTP ${response ? response.status() : 'no response'}`);
    await fn(page);
    if (consoleErrors.length) fail(`${route} console errors: ${consoleErrors.slice(0, 3).join(' | ')}`);
  } finally {
    await page.close();
  }
}

async function assertText(locator, pattern, message) {
  const text = (await locator.textContent().catch(() => '')) || '';
  if (!pattern.test(text)) fail(message);
}

async function homeFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/', async (page) => {
    await page.click('#langBtn');
    const languageOptions = await page.locator('.lang-option').count();
    if (languageOptions < 20) fail(`homepage language menu only has ${languageOptions} options`);
    await page.locator('.lang-option', { hasText: 'Italiano' }).click();
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (lang !== 'it') fail('homepage language selector did not switch document language');

    await page.fill('#translatorInput', 'Hello, how are you?');
    await page.selectOption('#translatorTarget', 'fr');
    await page.click('#translatorRun');
    await page.waitForTimeout(700);
    const translated = (await page.inputValue('#translatorOutput')).trim();
    if (!translated) fail('homepage translator produced no output');
    await page.click('#translatorSwap');
    const swappedInput = (await page.inputValue('#translatorInput')).trim();
    if (!swappedInput) fail('homepage translator swap did not preserve text');

    const guideFab = page.locator('#aiChatFab');
    if (await guideFab.isVisible().catch(() => false)) {
      await guideFab.click();
      await page.fill('#aiInput', 'Give me one Sophia launch action.');
      await page.click('#aiSendBtn');
      await page.waitForTimeout(800);
      const chatVisible = await page.locator('#aiChatPanel').evaluate((el) => getComputedStyle(el).display !== 'none');
      if (!chatVisible) fail('homepage Sophia guide did not open');
    }

    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    const commandOpen = await page.locator('#futureCommand.open').count();
    if (!commandOpen) fail('command palette did not open from keyboard shortcut');
  });
}

async function socialFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/social.html', async (page) => {
    await page.click('button[data-filter="market"]');
    const marketPosts = await page.locator('.post').count();
    if (marketPosts < 1) fail('social market filter returned no posts');

    await page.click('button[data-action="reply"]');
    const replyText = await page.inputValue('#socialComposer');
    if (!/^Replying to /.test(replyText)) fail('social reply action did not start a composer reply');

    await page.fill('#socialComposer', 'Functional audit signal from Sophia.');
    await page.click('#postSignal');
    await page.waitForTimeout(250);
    const posted = await page.locator('.post-body', { hasText: 'Functional audit signal from Sophia.' }).count();
    if (!posted) fail('social composer did not add a local post');

    await page.locator('button[data-action="like"]').first().click();
    await page.locator('button[data-action="repost"]').first().click();
    await page.locator('button[data-action="bookmark"]').first().click();
    const activeActions = await page.locator('.post-actions button.active').count();
    if (activeActions < 3) fail('social like/repost/bookmark actions did not persist active state');
  });
}

async function marketSubmitFlow(browser, baseUrl) {
  const fillListing = async (page, suffix) => {
    await page.fill('#bizName', `Sophia Audit ${suffix}`);
    await page.selectOption('#bizCountry', { label: 'United States' });
    await page.fill('#bizCity', 'Atlanta');
    await page.selectOption('#bizCategory', { label: 'Tech & Software' });
    await page.fill('#bizDesc', 'A practical local-first business workflow prototype for Sophia launch testing.');
    await page.fill('#bizEmail', 'audit@example.com');
  };

  await withPage(browser, baseUrl, '/market-submit.html', async (page) => {
    await fillListing(page, 'Free');
    await page.click('#submitBtn');
    await assertText(page.locator('#successMsg'), /free listing/i, 'market free listing did not show free success copy');
  });

  await withPage(browser, baseUrl, '/market-submit.html', async (page) => {
    await page.click('#tierFeatured');
    await fillListing(page, 'Featured');
    await page.click('#submitBtn');
    await assertText(page.locator('#successMsg'), /featured placement request/i, 'market featured listing did not show featured success copy');
  });
}

async function everydayToolsFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/everyday-tools.html', async (page) => {
    await page.fill('#groceryInput', 'rice');
    await page.click('#addGrocery');
    if (!(await page.locator('#groceryList', { hasText: 'rice' }).count())) fail('grocery tool did not add item');

    await page.click('#genPassword');
    const password = ((await page.locator('#pwResult').textContent().catch(() => '')) || '').trim();
    if (password.length < 10) fail('password generator did not produce a useful password');

    await page.click('#generateIdeas');
    await page.waitForTimeout(200);
    const ideas = await page.locator('#ideaResults .list-row').count();
    if (ideas < 1) fail('opportunity idea generator returned no ideas');
  });
}

async function naturalCuresFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/natural-cures.html', async (page) => {
    await page.fill('#wellnessSearch', 'sleep');
    await page.waitForTimeout(150);
    const cards = await page.locator('.wellness-card').count();
    if (cards < 1) fail('wellness search returned no cards');
    await page.locator('button[data-add]').first().click();
    const routineItems = await page.locator('#routineList .routine-item').count();
    if (routineItems < 1) fail('wellness add-to-routine did not save an item');
    await page.click('#clearRoutine');
    await assertText(page.locator('#routineList'), /Add cards from the library/i, 'wellness clear routine did not reset list');
  });
}

async function sessionFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/session.html?room=sophia-audit', async (page) => {
    await page.click('#micBtn');
    await assertText(page.locator('#sidebarMessages'), /Join the session before changing microphone/i, 'session mic guard did not explain join requirement');
    await page.fill('#chatInput', 'Hello room');
    await page.keyboard.press('Enter');
    await assertText(page.locator('#sidebarMessages'), /Hello room/i, 'session chat did not add local message');
    await page.click('button[title="Share session link"]');
    await page.waitForTimeout(250);
    await assertText(page.locator('#sidebarMessages'), /Session link/i, 'session share did not produce copy feedback');
  });
}

async function pricingFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/pricing.html', async (page) => {
    const links = await page.locator('.pricing-card a[href*="signup.html?plan="]').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
    for (const plan of ['fan', 'creator_basic', 'creator_pro', 'founder']) {
      if (!links.some((href) => href && href.includes(`plan=${plan}`))) fail(`pricing missing request link for ${plan}`);
    }
  });
}

async function controlCenterFlow(browser, baseUrl) {
  await withPage(browser, baseUrl, '/control-center.html', async (page) => {
    const copyButton = page.locator('#copyMissionBrief');
    if (await copyButton.count()) {
      await copyButton.click();
      await page.waitForTimeout(250);
      const text = await page.locator('body').textContent();
      if (!/Mission|Sophia/i.test(text || '')) fail('control center mission brief surface looked empty');
    }
    const resetButton = page.locator('#resetChecklist');
    if (await resetButton.count()) await resetButton.click();
  });
}

(async () => {
  let baseUrl = BASE;
  let serverToClose = null;

  if (!process.env.SOPHIA_BASE_URL && !(await canReachBase(baseUrl))) {
    try {
      const started = await startStaticServer(baseUrl);
      serverToClose = started.server;
      baseUrl = started.baseUrl;
    } catch (error) {
      fail(`Could not start local server: ${error && error.message ? error.message : String(error)}`);
    }
  }

  const browser = await chromium.launch({ headless: true });
  try {
    await homeFlow(browser, baseUrl);
    await socialFlow(browser, baseUrl);
    await marketSubmitFlow(browser, baseUrl);
    await everydayToolsFlow(browser, baseUrl);
    await naturalCuresFlow(browser, baseUrl);
    await sessionFlow(browser, baseUrl);
    await pricingFlow(browser, baseUrl);
    await controlCenterFlow(browser, baseUrl);
  } finally {
    await browser.close();
    if (serverToClose) await new Promise((resolve) => serverToClose.close(resolve));
  }

  if (failures.length) {
    console.error(`Sophia full-site function audit failed with ${failures.length} issue(s).`);
    process.exit(1);
  }
  console.log('Sophia full-site function audit passed.');
})();
