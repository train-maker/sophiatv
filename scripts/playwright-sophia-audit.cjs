const { chromium } = require('playwright');

const BASE = process.env.SOPHIA_BASE_URL || 'http://127.0.0.1:4173';
const PAGES = [
  '/',
  '/market.html',
  '/market-submit.html',
  '/social.html',
  '/natural-cures.html',
  '/control-center.html',
  '/pricing.html',
  '/login.html',
  '/signup.html',
  '/app/',
];

const hardErrors = [];

function fail(message) {
  hardErrors.push(message);
  console.error(`FAIL ${message}`);
}

function isIgnoredConsoleError(text) {
  return /Permissions policy violation: compute-pressure is not allowed in this document/i.test(text) ||
    /Failed to load resource: the server responded with a status of 404 \(File not found\)/i.test(text);
}

async function pageAudit(browser, path) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isIgnoredConsoleError(msg.text())) consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(250);
  if (!response || response.status() >= 400) fail(`${path} returned HTTP ${response ? response.status() : 'no response'}`);

  const metrics = await page.evaluate(() => ({
    title: document.title,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    bodyChars: (document.body.textContent || '').trim().length,
  }));
  if (!metrics.title) fail(`${path} has no title`);
  if (metrics.overflowX) fail(`${path} has horizontal overflow`);
  if (metrics.bodyChars < 80) fail(`${path} rendered too little visible text`);
  if (consoleErrors.length) fail(`${path} console errors: ${consoleErrors.slice(0, 3).join(' | ')}`);

  await page.close();
}

async function homepageFlow(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});

  await page.waitForTimeout(1000);
  const rotationA = await page.locator('#earthGlobeCanvas').evaluate((canvas) => Number(canvas.dataset.rotation || 0));
  await page.waitForTimeout(2400);
  const rotationB = await page.locator('#earthGlobeCanvas').evaluate((canvas) => Number(canvas.dataset.rotation || 0));
  if (!Number.isFinite(rotationB) || rotationB - rotationA < 0.04) fail('3D Earth globe did not advance its rotation state');

  await page.click('#translatorRun');
  await page.waitForTimeout(800);
  const translated = await page.locator('#translatorOutput').inputValue();
  const status = await page.locator('#translatorStatus').textContent();
  if (!translated && !/fallback|translation|translated|provider/i.test(status || '')) {
    fail('translator did not produce output or useful status');
  }

  const guideFab = page.locator('#aiChatFab');
  if (await guideFab.isVisible().catch(() => false)) {
    await guideFab.click();
    await page.fill('#aiInput', 'What is Sophia?');
    await page.click('#aiSendBtn');
    await page.waitForTimeout(700);
    const chatOpen = await page.locator('#aiChatPanel').evaluate((el) => getComputedStyle(el).display !== 'none');
    if (!chatOpen) fail('Sophia guide panel did not open');
  }

  await page.close();
}

async function appFlow(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto(`${BASE}/app/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});

  await page.fill('#q', 'Nigeria');
  await page.waitForTimeout(250);
  const cards = await page.locator('.card').count();
  if (cards < 1) fail('app search returned no Nigeria cards');

  await page.locator('.card').first().click();
  await page.waitForTimeout(200);
  const modalOpen = await page.locator('#modal.open').count();
  if (!modalOpen) fail('app listing detail modal did not open');
  await page.click('.close');

  await page.locator('.fav').first().click();
  await page.click('#nav-fav');
  await page.waitForTimeout(200);
  const savedCards = await page.locator('.card').count();
  if (savedCards < 1) fail('app saved/favorites view did not retain saved card');

  const manifest = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return null;
    const res = await fetch(link.href);
    return res.ok ? res.json() : null;
  });
  if (!manifest || manifest.name !== 'Sophia') fail('app manifest missing or wrong name');

  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const path of PAGES) await pageAudit(browser, path);
    await homepageFlow(browser);
    await appFlow(browser);
  } finally {
    await browser.close();
  }

  if (hardErrors.length) {
    console.error(`Sophia Playwright audit failed with ${hardErrors.length} issue(s).`);
    process.exit(1);
  }
  console.log('Sophia Playwright audit passed.');
})();
