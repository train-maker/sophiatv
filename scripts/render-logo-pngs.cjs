#!/usr/bin/env node
// Render the Sophia mark SVG to transparent PNGs at multiple sizes using Playwright.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/tarencea.rainey/outputs/sophiatv';
const SVG_PATH = path.join(ROOT, 'assets/brand/sophia-mark.svg');
const OUT_DIR = path.join(ROOT, 'assets/brand');
const SIZES = [64, 128, 192, 256, 512, 1024];

(async () => {
  if (!fs.existsSync(SVG_PATH)) { console.error('SVG missing at', SVG_PATH); process.exit(1); }
  const svg = fs.readFileSync(SVG_PATH, 'utf8');
  const browser = await chromium.launch({ headless: true });

  for (const size of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>html,body{margin:0;padding:0;background:transparent;width:${size}px;height:${size}px;overflow:hidden}svg{display:block;width:${size}px;height:${size}px}</style></head><body>${svg}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(120);
    const out = path.join(OUT_DIR, `sophia-mark-${size}.png`);
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    console.log('rendered', out);
    await ctx.close();
  }
  await browser.close();
  console.log('Done');
})();
