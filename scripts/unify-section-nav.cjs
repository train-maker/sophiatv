#!/usr/bin/env node
// Unifies the top nav across every major SophiaTV page so it feels like one coherent multi-page app.
// Sections: Home, Video, Social, Market, Wellness, Tools, Pricing, Dashboard.
// Also creates /video.html and /wellness.html if missing.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Canonical section list — single source of truth for what sections exist.
const SECTIONS = [
  { key: 'home',      label: 'Home',      href: '/',                     match: ['index.html'] },
  { key: 'video',     label: 'Video',     href: '/video.html',           match: ['video.html'] },
  { key: 'social',    label: 'Social',    href: '/social.html',          match: ['social.html'] },
  { key: 'market',    label: 'Market',    href: '/market.html',          match: ['market.html', 'market-listing.html', 'market-submit.html'] },
  { key: 'wellness',  label: 'Wellness',  href: '/wellness.html',        match: ['wellness.html', 'natural-cures.html'] },
  { key: 'tools',     label: 'Tools',     href: '/everyday-tools.html',  match: ['everyday-tools.html', 'budget-planner.html'] },
  { key: 'pricing',   label: 'Pricing',   href: '/pricing.html',         match: ['pricing.html'] },
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard.html',       match: ['dashboard.html', 'session.html', 'settings.html', 'control-center.html', 'admin.html', 'admin-center.html'] },
];

// Files to touch. Skip legal/utility (privacy, terms, copyright, 404) — those keep their existing nav.
const TARGETS = [
  'social.html', 'market.html', 'market-listing.html', 'market-submit.html',
  'natural-cures.html', 'everyday-tools.html', 'budget-planner.html',
  'pricing.html', 'dashboard.html', 'session.html', 'settings.html',
  'control-center.html', 'admin.html', 'admin-center.html',
  'login.html', 'signup.html', 'listing-guidelines.html', '404.html',
];

function activeKeyFor(filename) {
  for (const s of SECTIONS) {
    if (s.match.includes(filename)) return s.key;
  }
  return null;
}

function buildNavLinksHtml(activeKey) {
  const items = SECTIONS.map(s => {
    const isActive = s.key === activeKey;
    const style = isActive ? ' style="color:var(--gold);"' : '';
    const aria = isActive ? ' aria-current="page"' : '';
    return `        <a href="${s.href}" class="nav-link"${style}${aria}>${s.label}</a>`;
  }).join('\n');
  return `      <div class="nav-links">\n${items}\n      </div>`;
}

let touched = 0, skipped = 0;

for (const filename of TARGETS) {
  const full = path.join(ROOT, filename);
  if (!fs.existsSync(full)) { console.log('skip (missing):', filename); skipped++; continue; }
  let html = fs.readFileSync(full, 'utf8');
  const activeKey = activeKeyFor(filename);
  const newBlock = buildNavLinksHtml(activeKey);

  // Replace the first `<div class="nav-links">...</div>` block (top nav).
  // Match minimally, dot-all.
  const re = /<div class="nav-links">[\s\S]*?<\/div>/;
  if (!re.test(html)) {
    console.log('no nav-links found, skipped:', filename);
    skipped++;
    continue;
  }
  const before = html;
  html = html.replace(re, newBlock);
  if (html !== before) {
    fs.writeFileSync(full, html);
    console.log('updated nav:', filename);
    touched++;
  }
}

console.log('\n--- nav unify ---');
console.log('updated:', touched, 'skipped:', skipped);

// =================== CREATE /video.html ===================
const videoPath = path.join(ROOT, 'video.html');
if (!fs.existsSync(videoPath)) {
  const videoHtml = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Video — SophiaTV</title>
<meta name="description" content="Vertical video feed on SophiaTV — operator updates, market signals, creator content. TikTok-style scroll, global reach." />
<link rel="canonical" href="https://sophiatv.vercel.app/video.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Video — SophiaTV" />
<meta property="og:description" content="Vertical video feed on SophiaTV. TikTok-style scroll." />
<meta property="og:url" content="https://sophiatv.vercel.app/video.html" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" href="/assets/css/sovereign.css" />
<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="/future.css" />
<link rel="icon" href="/assets/brand/sophia-logo-premium.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
  body { background: #06070a; color: #f5f1e6; font-family: Inter, system-ui, sans-serif; margin: 0; }
  .video-shell { padding-top: 64px; min-height: 100vh; }
  .video-feed { max-width: 480px; margin: 0 auto; padding: 24px 0 80px; display: flex; flex-direction: column; gap: 16px; scroll-snap-type: y mandatory; }
  .video-card { position: relative; aspect-ratio: 9 / 16; max-height: calc(100vh - 96px); width: 100%; background: #111217; border: 1px solid rgba(200,162,74,0.18); border-radius: 8px; overflow: hidden; scroll-snap-align: start; box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
  .video-card video, .video-card .video-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .video-thumb { background: linear-gradient(135deg, #1a1a24, #0a0b10); display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 1.4rem; color: rgba(200,162,74,0.5); }
  .video-overlay { position: absolute; left: 16px; right: 60px; bottom: 16px; pointer-events: none; }
  .video-creator { font-weight: 700; font-size: 0.95rem; color: #f5f1e6; margin-bottom: 4px; }
  .video-caption { font-size: 0.85rem; color: rgba(245,241,230,0.85); line-height: 1.4; }
  .video-actions { position: absolute; right: 12px; bottom: 24px; display: flex; flex-direction: column; gap: 16px; }
  .vid-btn { width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(200,162,74,0.2); color: #f5f1e6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(8px); }
  .vid-btn:hover { border-color: var(--gold, #d8b34f); }
  .video-page-head { max-width: 480px; margin: 96px auto 16px; padding: 0 16px; }
  .video-page-head h1 { font-family: Georgia, serif; font-size: clamp(28px, 4vw, 36px); font-weight: 500; margin: 0 0 6px; }
  .video-page-head p { color: rgba(245,241,230,0.6); font-size: 0.9rem; margin: 0; }
  .video-empty { padding: 80px 24px; text-align: center; color: rgba(245,241,230,0.5); border: 1px dashed rgba(200,162,74,0.2); border-radius: 8px; }
  @media (max-width: 480px) { .video-feed { padding: 16px 0 60px; } .video-card { border-radius: 0; max-height: calc(100vh - 80px); } }
</style>
</head><body>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="logo">
      <img src="/assets/brand/sophia-logo-premium.png" alt="" class="logo-img logo-premium-img" width="32" height="32" />
      <span class="logo-text">Sophia<em>TV</em></span>
    </a>
${buildNavLinksHtml('video')}
  </div>
</nav>

<div class="video-shell">
  <header class="video-page-head">
    <h1>Video</h1>
    <p>Vertical scroll · operator updates, market signals, creator drops.</p>
  </header>

  <main class="video-feed" id="videoFeed" aria-label="Vertical video feed">
    <article class="video-card">
      <div class="video-thumb">SophiaTV · clip 1</div>
      <div class="video-overlay">
        <div class="video-creator">@sophia_operator</div>
        <div class="video-caption">SophiaMarket is live in 105 countries. Free listings, $29.99 Featured.</div>
      </div>
      <div class="video-actions">
        <button class="vid-btn" title="Like">+</button>
        <button class="vid-btn" title="Comment">~</button>
        <button class="vid-btn" title="Share">→</button>
      </div>
    </article>

    <article class="video-card">
      <div class="video-thumb">Creator drop · clip 2</div>
      <div class="video-overlay">
        <div class="video-creator">@global_signals</div>
        <div class="video-caption">How African markets are shifting in 2026 — what operators need to know.</div>
      </div>
      <div class="video-actions">
        <button class="vid-btn">+</button>
        <button class="vid-btn">~</button>
        <button class="vid-btn">→</button>
      </div>
    </article>

    <article class="video-card">
      <div class="video-thumb">Wellness · clip 3</div>
      <div class="video-overlay">
        <div class="video-creator">@natural_cures</div>
        <div class="video-caption">Three foods that change everything. Watch full breakdown on /wellness.</div>
      </div>
      <div class="video-actions">
        <button class="vid-btn">+</button>
        <button class="vid-btn">~</button>
        <button class="vid-btn">→</button>
      </div>
    </article>

    <div class="video-empty">More clips coming. Follow creators on <a href="/social.html" style="color:var(--gold,#d8b34f);">Social</a>.</div>
  </main>
</div>
</body></html>`;
  fs.writeFileSync(videoPath, videoHtml);
  console.log('created: video.html');
}

// =================== CREATE /wellness.html ===================
const wellnessPath = path.join(ROOT, 'wellness.html');
if (!fs.existsSync(wellnessPath)) {
  const wellnessHtml = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Wellness — SophiaTV</title>
<meta name="description" content="Wellness on SophiaTV — natural cures, longevity protocols, and operator-curated health resources." />
<link rel="canonical" href="https://sophiatv.vercel.app/wellness.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Wellness — SophiaTV" />
<meta property="og:description" content="Natural cures, longevity protocols, and operator-curated health resources." />
<meta property="og:url" content="https://sophiatv.vercel.app/wellness.html" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" href="/assets/css/sovereign.css" />
<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="/future.css" />
<link rel="icon" href="/assets/brand/sophia-logo-premium.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
  body { background: #06070a; color: #f5f1e6; font-family: Inter, system-ui, sans-serif; margin: 0; }
  .wellness-shell { padding: 96px 24px 80px; max-width: 1080px; margin: 0 auto; }
  .wellness-hero { text-align: center; padding: 32px 0 48px; }
  .wellness-hero h1 { font-family: Georgia, serif; font-size: clamp(36px, 6vw, 64px); font-weight: 500; margin: 0 0 12px; line-height: 1.05; }
  .wellness-hero p { color: rgba(245,241,230,0.7); font-size: 1rem; max-width: 620px; margin: 0 auto; line-height: 1.6; }
  .pillar-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 36px; }
  .pillar { background: linear-gradient(180deg, rgba(255,255,255,0.035), transparent 34%), linear-gradient(145deg, rgba(17,18,23,0.94), rgba(7,8,12,0.99)); border: 1px solid rgba(200,162,74,0.18); border-radius: 4px; padding: 28px 24px; box-shadow: 0 20px 44px rgba(0,0,0,0.32); }
  .pillar h3 { font-size: 1.1rem; margin: 0 0 6px; font-weight: 600; }
  .pillar p { color: rgba(245,241,230,0.7); font-size: 0.9rem; line-height: 1.55; margin: 0 0 16px; }
  .pillar a { display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #fff0a6, #d8b34f 44%, #8a5a13); color: #000; border-radius: 2px; font-size: 0.85rem; font-weight: 600; text-decoration: none; }
  .pillar a:hover { opacity: 0.85; }
  .pillar-icon { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #fff0a6, #d8b34f 44%, #7a4a10); color: #06070a; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; }
  .deep-dive { margin-top: 56px; padding: 32px; background: rgba(255,255,255,0.03); border: 1px solid rgba(200,162,74,0.16); border-radius: 4px; text-align: center; }
  .deep-dive h2 { font-family: Georgia, serif; font-size: clamp(24px, 3vw, 32px); margin: 0 0 8px; font-weight: 500; }
  .deep-dive p { color: rgba(245,241,230,0.65); margin: 0 0 18px; }
  .deep-dive a { display: inline-block; padding: 10px 24px; background: transparent; border: 1px solid rgba(200,162,74,0.32); color: var(--gold, #d8b34f); border-radius: 2px; text-decoration: none; font-weight: 600; }
</style>
</head><body>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="logo">
      <img src="/assets/brand/sophia-logo-premium.png" alt="" class="logo-img logo-premium-img" width="32" height="32" />
      <span class="logo-text">Sophia<em>TV</em></span>
    </a>
${buildNavLinksHtml('wellness')}
  </div>
</nav>

<main class="wellness-shell">
  <section class="wellness-hero">
    <h1>Wellness</h1>
    <p>Natural cures, longevity protocols, and operator-curated health resources — built for people who want to take charge of their own outcomes.</p>
  </section>

  <section class="pillar-grid">
    <article class="pillar">
      <div class="pillar-icon">NC</div>
      <h3>Natural Cures Library</h3>
      <p>Plants, minerals, and historical protocols compiled from open research. Use as a reference, not as medical advice.</p>
      <a href="/natural-cures.html">Open Library</a>
    </article>
    <article class="pillar">
      <div class="pillar-icon">FN</div>
      <h3>Foundations: Food</h3>
      <p>Whole-food eating frameworks, fasting protocols, and what works across cultures from Africa to Asia.</p>
      <a href="/natural-cures.html#food">Read Guide</a>
    </article>
    <article class="pillar">
      <div class="pillar-icon">MV</div>
      <h3>Movement &amp; Sleep</h3>
      <p>Why low-effort consistency beats peak intensity. Strategies for energy, focus, and aging well.</p>
      <a href="/natural-cures.html#movement">Read Guide</a>
    </article>
    <article class="pillar">
      <div class="pillar-icon">MN</div>
      <h3>Mind &amp; Stress</h3>
      <p>Decision-making under pressure, breath protocols, and tactics for operators who carry weight.</p>
      <a href="/natural-cures.html#mind">Read Guide</a>
    </article>
  </section>

  <section class="deep-dive">
    <h2>Operator wellness, no fluff</h2>
    <p>Want personalized recommendations? Open the Sophia AI assistant from your dashboard.</p>
    <a href="/dashboard.html">Open Dashboard</a>
  </section>
</main>
</body></html>`;
  fs.writeFileSync(wellnessPath, wellnessHtml);
  console.log('created: wellness.html');
}

console.log('\nDone.');
