const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.SOPHIA_BASE_URL || 'http://127.0.0.1:4173';
const OUT_DIR = path.join(process.cwd(), 'test-results', 'visual-audit');
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/market.html', name: 'market' },
  { path: '/pricing.html', name: 'pricing' },
  { path: '/signup.html', name: 'signup' },
  { path: '/login.html', name: 'login' },
  { path: '/market-submit.html', name: 'market-submit' },
  { path: '/market-listing.html?id=1', name: 'market-listing' },
  { path: '/social.html', name: 'social' },
  { path: '/control-center.html', name: 'control-center' },
  { path: '/session.html', name: 'session' },
  { path: '/dashboard.html', name: 'dashboard' },
  { path: '/settings.html', name: 'settings' },
  { path: '/404.html', name: '404' },
  { path: '/natural-cures.html', name: 'natural-cures' },
  { path: '/everyday-tools.html', name: 'everyday-tools' },
  { path: '/app/', name: 'app' },
];

const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 1100 },
  { label: 'mobile', width: 390, height: 900 },
];

const BANNED_TEXT = [
  /revolutionary/i,
  /game[- ]changing/i,
  /cutting[- ]edge/i,
  /next[- ]generation/i,
  /world[- ]class/i,
  /industry[- ]leading/i,
  /best[- ]in[- ]class/i,
  /unparalleled/i,
  /global directory\s*·\s*launch preview/i,
  /sophia market\s*—\s*preview/i,
  /59 countries/i,
  /12 categories/i,
  /120 listings/i,
];

const BANNED_CLASS = [
  /live-pill/i,
  /vcard-live/i,
  /vcard-viewers/i,
  /scanlines/i,
  /ma-purple/i,
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slug(input) {
  return input.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'page';
}

function severity(issue) {
  if (/horizontal overflow|overlap|console error|missing image|banned/i.test(issue.type)) return 'high';
  if (/tiny|tap target|contrast|weak|heading/i.test(issue.type)) return 'medium';
  return 'low';
}

async function auditPage(browser, item, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/compute-pressure|404 \(File not found\)/i.test(msg.text())) {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  const url = `${BASE}${item.path}`;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);

  const screenshot = path.join(OUT_DIR, `${item.name}-${viewport.label}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });

  const data = await page.evaluate(({ bannedTextSources, bannedClassSources }) => {
    const bannedText = bannedTextSources.map((source) => new RegExp(source, 'i'));
    const bannedClass = bannedClassSources.map((source) => new RegExp(source, 'i'));
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const bodyText = document.body.innerText || '';
    const issues = [];

    const add = (type, detail, selector = '') => issues.push({ type, detail, selector });
    const cssPath = (el) => {
      if (!el || el.nodeType !== 1) return '';
      if (el.id) return `#${el.id}`;
      const parts = [];
      let node = el;
      while (node && node.nodeType === 1 && parts.length < 4) {
        let part = node.tagName.toLowerCase();
        if (node.className && typeof node.className === 'string') {
          const cls = node.className.trim().split(/\s+/).slice(0, 2).join('.');
          if (cls) part += `.${cls}`;
        }
        parts.unshift(part);
        node = node.parentElement;
      }
      return parts.join(' > ');
    };

    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
      add('horizontal overflow', `scrollWidth ${document.documentElement.scrollWidth}, viewport ${document.documentElement.clientWidth}`);
    }

    if (!document.querySelector('h1')) add('missing h1', 'No h1 found');
    const h1 = document.querySelector('h1');
    if (h1) {
      const r = h1.getBoundingClientRect();
      if (r.top < -2 || r.left < -2 || r.right > vw + 2) add('heading clipped/offscreen', `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`, cssPath(h1));
    }

    bannedText.forEach((re) => {
      const match = bodyText.match(re);
      if (match) add('banned/weak copy', match[0]);
    });

    Array.from(document.querySelectorAll('[class]')).forEach((el) => {
      const cls = String(el.getAttribute('class') || '');
      if (bannedClass.some((re) => re.test(cls))) add('banned visual class', cls, cssPath(el));
    });

    Array.from(document.images).forEach((img) => {
      const r = img.getBoundingClientRect();
      if (r.width > 24 && r.height > 24 && (!img.complete || img.naturalWidth < 1)) {
        add('missing image', img.getAttribute('src') || img.currentSrc || 'unknown', cssPath(img));
      }
      if (r.width > vw + 8) add('image wider than viewport', `${Math.round(r.width)}px`, cssPath(img));
      if (r.width > 24 && r.height > 24 && !img.getAttribute('alt')) add('missing alt text', img.getAttribute('src') || '', cssPath(img));
    });

    const visibleElements = Array.from(document.querySelectorAll('body *')).filter((el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < document.documentElement.scrollHeight;
    });

    visibleElements.forEach((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const text = (el.innerText || '').trim();
      const isTextLeaf = text && !Array.from(el.children).some((child) => (child.innerText || '').trim());
      if (isTextLeaf) {
        const fontSize = Number.parseFloat(style.fontSize || '16');
        if (fontSize < 11 && r.width > 40) add('tiny text', `${fontSize}px: ${text.slice(0, 60)}`, cssPath(el));
        if (r.left < -2 || r.right > vw + 2) add('text offscreen', text.slice(0, 80), cssPath(el));
        if (style.textTransform !== 'uppercase' && r.height < fontSize * 0.85) add('text possibly clipped', text.slice(0, 80), cssPath(el));
      }
      const isTapTarget = el.matches('a, button, input, select, textarea, [role="button"]');
      if (isTapTarget && r.width > 0 && r.height > 0 && (r.width < 32 || r.height < 32)) {
        add('small tap target', `${Math.round(r.width)}x${Math.round(r.height)}`, cssPath(el));
      }
    });

    const overlapCandidates = visibleElements
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return r.top < vh * 1.4 && r.width > 24 && r.height > 12 && style.position !== 'fixed';
      })
      .slice(0, 260)
      .map((el) => ({ el, r: el.getBoundingClientRect(), text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 70), selector: cssPath(el) }));

    for (let i = 0; i < overlapCandidates.length; i += 1) {
      for (let j = i + 1; j < overlapCandidates.length; j += 1) {
        const a = overlapCandidates[i];
        const b = overlapCandidates[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const x = Math.max(0, Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left));
        const y = Math.max(0, Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top));
        const area = x * y;
        const minArea = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
        if (area > 120 && area / Math.max(1, minArea) > 0.22) {
          add('possible overlap', `${a.selector} <-> ${b.selector}`, `${a.text} | ${b.text}`);
          if (issues.filter((issue) => issue.type === 'possible overlap').length >= 8) break;
        }
      }
      if (issues.filter((issue) => issue.type === 'possible overlap').length >= 8) break;
    }

    const aboveFoldText = visibleElements
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.top < vh && (el.innerText || '').trim().length > 0;
      })
      .map((el) => (el.innerText || '').trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .slice(0, 500);

    return {
      title: document.title,
      url: location.href,
      viewport: { width: vw, height: vh },
      scroll: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      aboveFoldText,
      issueCount: issues.length,
      issues,
    };
  }, {
    bannedTextSources: BANNED_TEXT.map((re) => re.source),
    bannedClassSources: BANNED_CLASS.map((re) => re.source),
  });

  if (!response || response.status() >= 400) {
    data.issues.unshift({ type: 'http error', detail: response ? String(response.status()) : 'no response', selector: '' });
  }
  if (consoleErrors.length) {
    data.issues.unshift({ type: 'console error', detail: consoleErrors.slice(0, 4).join(' | '), selector: '' });
  }
  data.screenshot = screenshot;
  data.path = item.path;
  data.name = item.name;
  data.viewportLabel = viewport.label;
  await page.close();
  return data;
}

function writeReports(results) {
  const jsonPath = path.join(OUT_DIR, 'visual-audit.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  const ranked = results
    .map((result) => ({
      ...result,
      high: result.issues.filter((issue) => severity(issue) === 'high').length,
      medium: result.issues.filter((issue) => severity(issue) === 'medium').length,
    }))
    .sort((a, b) => (b.high - a.high) || (b.medium - a.medium) || (b.issues.length - a.issues.length));

  const lines = [];
  lines.push('# Sophia Visual Audit');
  lines.push('');
  lines.push(`Base: ${BASE}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Worst Screens First');
  lines.push('');
  ranked.slice(0, 20).forEach((result) => {
    lines.push(`### ${result.name} ${result.viewportLabel}`);
    lines.push('');
    lines.push(`- Path: \`${result.path}\``);
    lines.push(`- Screenshot: \`${path.relative(process.cwd(), result.screenshot)}\``);
    lines.push(`- Issues: ${result.issues.length} (${result.high} high, ${result.medium} medium)`);
    if (result.aboveFoldText) lines.push(`- Above fold: ${result.aboveFoldText.slice(0, 220)}`);
    if (!result.issues.length) {
      lines.push('- No objective issues detected.');
    } else {
      result.issues.slice(0, 12).forEach((issue) => {
        lines.push(`- [${severity(issue)}] ${issue.type}: ${issue.detail}${issue.selector ? ` (${issue.selector})` : ''}`);
      });
    }
    lines.push('');
  });

  const mdPath = path.join(OUT_DIR, 'visual-audit.md');
  fs.writeFileSync(mdPath, `${lines.join('\n')}\n`);
  return { jsonPath, mdPath, ranked };
}

(async () => {
  ensureDir(OUT_DIR);
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const item of PAGES) {
      for (const viewport of VIEWPORTS) {
        console.log(`Visual audit ${item.path} ${viewport.label}`);
        results.push(await auditPage(browser, item, viewport));
      }
    }
  } finally {
    await browser.close();
  }

  const { mdPath, ranked } = writeReports(results);
  const issueTotal = results.reduce((sum, result) => sum + result.issues.length, 0);
  const highTotal = results.reduce((sum, result) => sum + result.issues.filter((issue) => severity(issue) === 'high').length, 0);
  console.log(`Visual audit complete: ${results.length} screenshots, ${issueTotal} issues (${highTotal} high).`);
  console.log(`Report: ${mdPath}`);
  if (ranked[0]) console.log(`Worst: ${ranked[0].name} ${ranked[0].viewportLabel} (${ranked[0].issues.length} issues)`);
})();
