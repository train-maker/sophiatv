#!/usr/bin/env node
/**
 * generate-seo-country-category-pages.cjs
 * Produces 1,890 SEO landing pages (105 countries × 18 categories) under
 *   /market/country/<country-slug>/<category-slug>/index.html
 *
 * Each page: unique <title>, unique <h1>, location+category meta description,
 * filtered listings, JSON-LD ItemList, sibling links to other categories
 * in the same country and same category in other countries, dark gold theme,
 * canonical URL.
 *
 * Run: node scripts/generate-seo-country-category-pages.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'market', 'country');
const LISTINGS = JSON.parse(fs.readFileSync(path.join(ROOT, 'sample-listings.json'), 'utf8'));

const marketHtml = fs.readFileSync(path.join(ROOT, 'market.html'), 'utf8');

// --- Parse country list from market.html ---
const countryRe = /\{\s*code:\s*"([A-Z]{2})",\s*name:\s*"([^"]+)",\s*flag:\s*"([^"]+)",\s*region:\s*"([^"]+)"\s*\}/g;
const COUNTRIES = [];
let m;
while ((m = countryRe.exec(marketHtml)) !== null) {
  COUNTRIES.push({ code: m[1], name: m[2], flag: m[3], region: m[4] });
}
console.log(`Parsed ${COUNTRIES.length} countries from market.html`);

// --- Parse categories from market.html (CATEGORIES array) ---
const catBlockMatch = marketHtml.match(/const CATEGORIES = \[([\s\S]*?)\];/);
const CATEGORIES = [];
if (catBlockMatch) {
  const labelRe = /label:\s*"([^"]+)"/g;
  let cm;
  while ((cm = labelRe.exec(catBlockMatch[1])) !== null) {
    CATEGORIES.push({ label: cm[1] });
  }
}
console.log(`Parsed ${CATEGORIES.length} categories from market.html`);

if (COUNTRIES.length === 0 || CATEGORIES.length === 0) {
  console.error('Aborting: missing country or category list.');
  process.exit(1);
}

// --- Helpers ---
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function businessLabel(count, capitalized = false) {
  const word = count === 1 ? 'business' : 'businesses';
  if (!capitalized) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Inline shared CSS (same dark gold premium theme as country generator)
const SHARED_CSS = `
    body.seo-country-page { background: var(--sv-page); color: var(--sv-bone); }
    .seo-nav-shell { border-bottom: var(--sv-hairline); background: rgba(6, 7, 10, 0.92); backdrop-filter: blur(18px); }
    .seo-nav { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; gap: 18px; }
    .seo-nav-links { display: flex; gap: 6px; flex: 1; flex-wrap: wrap; }
    .seo-nav-link { color: var(--sv-bone-2); text-decoration: none; font-size: 13px; font-weight: 700; padding: 7px 12px; border-radius: 999px; border: 1px solid transparent; }
    .seo-nav-link:hover, .seo-nav-link.is-active { color: var(--sv-bone); border-color: var(--sv-gold-rule); background: rgba(255,255,255,0.03); }
    .seo-wrap { max-width: 1180px; margin: 0 auto; padding: 32px 24px 72px; }
    .seo-breadcrumb { font-size: var(--sv-fs-body-sm); color: var(--sv-bone-3); margin-bottom: 18px; }
    .seo-breadcrumb a { color: inherit; text-decoration: none; }
    .seo-breadcrumb strong { color: var(--sv-bone); }
    .seo-panel { border: var(--sv-hairline); background: linear-gradient(180deg, rgba(11, 13, 18, 0.96), rgba(6, 7, 10, 0.98)); box-shadow: var(--sv-shadow-card); }
    .seo-hero-panel { border-radius: 8px; padding: 34px 30px; margin-bottom: 24px; position: relative; overflow: hidden; }
    .seo-kicker { color: var(--sv-gold); font-size: var(--sv-fs-label); font-weight: 850; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 16px; }
    .seo-hero { display: grid; grid-template-columns: auto 1fr; gap: 18px; align-items: start; margin-bottom: 14px; }
    .seo-hero .flag { font-size: clamp(44px, 8vw, 72px); line-height: 1; filter: drop-shadow(0 10px 22px rgba(0,0,0,0.42)); }
    .seo-hero h1 { margin: 0; font-size: clamp(28px, 4.4vw, 48px); font-weight: 600; line-height: 1.06; }
    .seo-intro { font-size: 17px; color: var(--sv-bone-2); max-width: 760px; margin: 0 0 24px; }
    .seo-cta-row { display: flex; gap: 12px; margin: 18px 0 0; flex-wrap: wrap; }
    .btn-gold { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 20px; background: var(--sv-gold); color: #07070e; font-weight: 800; border-radius: 2px; text-decoration: none; border: 1px solid var(--sv-gold); }
    .btn-outline { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 20px; background: transparent; border: 1px solid var(--sv-gold-rule); border-radius: 2px; text-decoration: none; color: var(--sv-bone); }
    .seo-meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 26px; }
    .seo-stat { border: var(--sv-hairline); background: rgba(11, 13, 18, 0.84); border-radius: 4px; padding: 16px 14px; }
    .seo-stat strong { display: block; color: var(--sv-gold); font-family: var(--sv-mono); font-size: 18px; margin-bottom: 6px; }
    .seo-stat span { color: var(--sv-bone-2); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
    .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-bottom: 40px; }
    .listing-card { border: var(--sv-hairline); background: linear-gradient(180deg, rgba(11, 13, 18, 0.94), rgba(6, 7, 10, 0.98)); border-radius: 6px; padding: 18px; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; box-shadow: var(--sv-shadow-card); }
    .listing-card:hover { border-color: var(--sv-gold-strong); transform: translateY(-2px); box-shadow: var(--sv-shadow-card-hover); }
    .listing-card.featured { border-color: var(--sv-gold-strong); box-shadow: 0 0 0 1px var(--sv-gold-soft), var(--sv-shadow-card-hover); }
    .listing-top { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; align-items: start; }
    .listing-name { font-size: 18px; font-weight: 700; line-height: 1.25; }
    .listing-flag { font-size: 22px; }
    .badge-row { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
    .badge { font-size: 11px; padding: 5px 8px; border-radius: 999px; border: 1px solid var(--sv-gold-soft); background: rgba(255,255,255,0.03); color: var(--sv-bone-2); }
    .badge-featured { background: var(--sv-gold); color: #07070e; border-color: var(--sv-gold); font-weight: 800; }
    .listing-desc { font-size: 14px; color: var(--sv-bone-2); margin: 8px 0 10px; line-height: 1.55; }
    .listing-location { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--sv-bone-3); margin-bottom: 12px; }
    .listing-location-label { display: inline-flex; align-items: center; justify-content: center; min-width: 34px; min-height: 20px; padding: 0 7px; border: 1px solid var(--sv-gold-soft); border-radius: 999px; color: var(--sv-gold); font-family: var(--sv-mono); font-size: 10px; font-weight: 800; letter-spacing: 0.08em; }
    .listing-actions { display: flex; gap: 8px; }
    .btn-profile { font-size: 13px; padding: 9px 12px; border: 1px solid var(--sv-gold-rule); border-radius: 2px; text-decoration: none; color: var(--sv-bone); }
    .empty-state { text-align: center; padding: 56px 18px; border: 1px dashed var(--sv-gold-rule); border-radius: 8px; grid-column: 1 / -1; background: rgba(255,255,255,0.02); }
    .empty-state h2 { margin: 0 0 10px; font-size: clamp(26px, 3.6vw, 34px); }
    .empty-state p { color: var(--sv-bone-2); max-width: 600px; margin: 0 auto 18px; }
    .region-section { margin-bottom: 32px; }
    .region-section h2 { font-size: 20px; margin-bottom: 12px; }
    .region-links { display: flex; flex-wrap: wrap; gap: 8px; }
    .region-sibling { display: inline-flex; align-items: center; gap: 8px; padding: 9px 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--sv-gold-soft); border-radius: 999px; font-size: 13px; text-decoration: none; color: var(--sv-bone-2); }
    .region-sibling:hover { border-color: var(--sv-gold-strong); color: var(--sv-bone); }
    .final-cta { text-align: center; padding: 44px 16px; border-radius: 8px; border: var(--sv-hairline-strong); background: linear-gradient(180deg, rgba(6, 7, 10, 0.98), rgba(11, 13, 18, 0.96)); }
    .final-cta h2 { font-size: clamp(26px, 3.6vw, 36px); margin: 0 0 10px; }
    .final-cta p { color: var(--sv-bone-2); margin: 0 0 20px; }
    .seo-footer { max-width: 1180px; margin: 0 auto; padding: 0 24px 32px; color: var(--sv-bone-3); font-size: 13px; text-align: center; }
    @media (max-width: 900px) {
      .seo-nav { flex-wrap: wrap; }
      .seo-nav-links { order: 2; width: 100%; }
      .seo-meta { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 640px) {
      .seo-wrap { padding-inline: 16px; }
      .seo-nav { padding-inline: 16px; }
      .seo-hero { grid-template-columns: 1fr; }
      .seo-hero-panel { padding: 26px 18px; }
      .seo-meta { grid-template-columns: 1fr; }
      .btn-gold, .btn-outline { width: 100%; }
    }
`;

function navShell() {
  return `<nav class="seo-nav-shell">
    <div class="seo-nav">
      <a href="/" class="logo">
        <img src="/assets/brand/sophia-logo-premium.png" alt="" class="logo-img logo-premium-img" width="32" height="32" />
        <span style="font-weight:800;font-size:18px;letter-spacing:-0.3px;">Sophia<span style="color:var(--sv-gold)">TV</span></span>
      </a>
      <div class="seo-nav-links">
        <a href="/#live" class="seo-nav-link">Signals</a>
        <a href="/#feed" class="seo-nav-link">Library</a>
        <a href="/social.html" class="seo-nav-link">Social</a>
        <a href="/#creators" class="seo-nav-link">Builders</a>
        <a href="/market.html" class="seo-nav-link is-active">Market</a>
        <a href="/#sessions" class="seo-nav-link">Access</a>
        <a href="/control-center.html" class="seo-nav-link">Control</a>
        <a href="/pricing.html" class="seo-nav-link">Pricing</a>
      </div>
      <a href="/market-submit.html" class="btn-gold">Start Listing</a>
    </div>
  </nav>`;
}

// Pick N stable, pseudo-random siblings from a list, avoiding a given key.
function pickN(list, n, avoidKey, keyFn) {
  const out = [];
  for (const item of list) {
    if (keyFn(item) === avoidKey) continue;
    out.push(item);
    if (out.length >= n) break;
  }
  return out;
}

function pageFor(country, category) {
  const countrySlug = slugify(country.name);
  const catSlug = slugify(category.label);

  const listings = LISTINGS.filter(l => l.country === country.name && l.category === category.label);
  const featured = listings.filter(l => l.featured);
  const free = listings.filter(l => !l.featured);
  const sorted = [...featured, ...free];

  // Sibling categories in this country (offset rotation so different pages show different siblings)
  const otherCats = CATEGORIES.filter(c => c.label !== category.label);
  const catIdx = CATEGORIES.findIndex(c => c.label === category.label);
  const rotatedCats = otherCats.slice(catIdx % otherCats.length).concat(otherCats.slice(0, catIdx % otherCats.length));
  const siblingCats = rotatedCats.slice(0, 7);

  // Sibling countries with this same category
  const otherCountries = COUNTRIES.filter(c => c.code !== country.code);
  const ctyIdx = COUNTRIES.findIndex(c => c.code === country.code);
  // Prefer same-region siblings first, then fill with rotated others
  const sameRegion = otherCountries.filter(c => c.region === country.region);
  const others = otherCountries.filter(c => c.region !== country.region);
  const rotatedOthers = others.slice(ctyIdx % Math.max(1, others.length)).concat(others.slice(0, ctyIdx % Math.max(1, others.length)));
  const siblingCountries = sameRegion.concat(rotatedOthers).slice(0, 7);

  const listingJsonLd = sorted.slice(0, 20).map(l => ({
    "@type": "LocalBusiness",
    "name": l.name,
    "address": { "@type": "PostalAddress", "addressLocality": l.city, "addressCountry": country.name },
    "description": l.description,
    "url": l.website || `https://sophiatv.vercel.app/market-listing.html?id=${l.id}`,
    ...(l.featured ? { "additionalType": "https://schema.org/Featured" } : {}),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category.label} businesses in ${country.name}`,
    "itemListElement": listingJsonLd.map((biz, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": biz,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sophiatv.vercel.app/" },
      { "@type": "ListItem", "position": 2, "name": "Market", "item": "https://sophiatv.vercel.app/market.html" },
      { "@type": "ListItem", "position": 3, "name": "Countries", "item": "https://sophiatv.vercel.app/market/country/" },
      { "@type": "ListItem", "position": 4, "name": country.name, "item": `https://sophiatv.vercel.app/market/country/${countrySlug}/` },
      { "@type": "ListItem", "position": 5, "name": category.label, "item": `https://sophiatv.vercel.app/market/country/${countrySlug}/${catSlug}/` },
    ],
  };

  const title = `${category.label} in ${country.name} ${country.flag} — SophiaMarket`;
  const h1 = `${category.label} businesses in ${country.name}`;
  const description = listings.length > 0
    ? `Discover ${listings.length} ${businessLabel(listings.length)} in the ${category.label.toLowerCase()} sector in ${country.name}. Direct contact, verified profiles, and free launch listings on SophiaMarket — the global business directory across 105 countries.`
    : `Be the first ${category.label.toLowerCase()} business in ${country.name} on SophiaMarket. Free during launch — get found by buyers across 105 countries searching for ${category.label.toLowerCase()} in ${country.name}.`;

  const canonical = `https://sophiatv.vercel.app/market/country/${countrySlug}/${catSlug}/`;

  const submitHref = `/market-submit.html?country=${encodeURIComponent(country.code)}&category=${encodeURIComponent(catSlug)}`;

  const listingCards = sorted.length === 0
    ? `<div class="empty-state">
         <h2>Be the first ${escapeHtml(category.label.toLowerCase())} business in ${escapeHtml(country.name)}</h2>
         <p>List for free during launch. Your business will be the first result visitors see when they search for ${escapeHtml(category.label.toLowerCase())} in ${escapeHtml(country.name)} on SophiaMarket.</p>
         <a href="${submitHref}" class="btn-gold">List Your Business — Free During Launch</a>
       </div>`
    : sorted.map(l => `
         <article class="listing-card ${l.featured ? 'featured' : ''}">
           <header class="listing-top">
             <div class="listing-name">${escapeHtml(l.name)}</div>
             <div class="listing-flag">${l.flag}</div>
           </header>
           <div class="badge-row">
             <span class="badge badge-cat">${escapeHtml(l.category)}</span>
             ${l.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
           </div>
           <p class="listing-desc">${escapeHtml(l.description)}</p>
           <div class="listing-location"><span class="listing-location-label">LOC</span> ${escapeHtml(l.city)}, ${escapeHtml(country.name)}</div>
           <div class="listing-actions">
             <a class="btn-profile" href="/market-listing.html?id=${l.id}">View Profile</a>
           </div>
         </article>`).join('\n');

  const otherCatLinks = siblingCats.map(c =>
    `<a class="region-sibling" href="/market/country/${countrySlug}/${slugify(c.label)}/">${escapeHtml(c.label)}</a>`
  ).join(' ');

  const otherCountryLinks = siblingCountries.map(s =>
    `<a class="region-sibling" href="/market/country/${slugify(s.name)}/${catSlug}/">${s.flag} ${escapeHtml(s.name)}</a>`
  ).join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/assets/brand/sophia-logo-premium.png" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="https://sophiatv.vercel.app/public/og-image.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />

  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>

  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/assets/css/sovereign.css" />
  <style>${SHARED_CSS}</style>
</head>
<body class="seo-country-page">
  ${navShell()}
  <header class="seo-wrap" style="padding-bottom: 0;">
    <nav class="seo-breadcrumb">
      <a href="/">Home</a> › <a href="/market.html">Market</a> › <a href="/market/country/">Countries</a> › <a href="/market/country/${countrySlug}/">${escapeHtml(country.name)}</a> › <strong>${escapeHtml(category.label)}</strong>
    </nav>
  </header>

  <main class="seo-wrap">
    <section class="seo-panel seo-hero-panel">
      <div class="seo-kicker">${escapeHtml(category.label)} · ${escapeHtml(country.region)}</div>
      <div class="seo-hero">
        <div class="flag">${country.flag}</div>
        <h1>${escapeHtml(h1)}</h1>
      </div>
      <p class="seo-intro">${escapeHtml(description)}</p>
      <div class="seo-cta-row">
        <a href="${submitHref}" class="btn-gold">List Your ${escapeHtml(category.label)} Business</a>
        <a href="/market/country/${countrySlug}/" class="btn-outline">All categories in ${escapeHtml(country.name)}</a>
      </div>
    </section>

    <div class="seo-meta">
      <div class="seo-stat"><strong>${listings.length}</strong><span>${escapeHtml(category.label)} ${businessLabel(listings.length)}</span></div>
      <div class="seo-stat"><strong>${featured.length}</strong><span>Featured signals</span></div>
      <div class="seo-stat"><strong>${escapeHtml(country.region)}</strong><span>Operating region</span></div>
      <div class="seo-stat"><strong>105 × 18</strong><span>Country × category floors</span></div>
    </div>

    <section class="listings-grid">
      ${listingCards}
    </section>

    ${siblingCats.length ? `
    <section class="region-section">
      <h2>Other categories in ${escapeHtml(country.name)}</h2>
      <div class="region-links">${otherCatLinks}</div>
    </section>` : ''}

    ${siblingCountries.length ? `
    <section class="region-section">
      <h2>${escapeHtml(category.label)} in other countries</h2>
      <div class="region-links">${otherCountryLinks}</div>
    </section>` : ''}

    <section class="final-cta">
      <h2>Ready to list your ${escapeHtml(category.label.toLowerCase())} business in ${escapeHtml(country.name)}?</h2>
      <p>Get seen in front of buyers in 105 countries. Launch listings are free while SophiaMarket is opening.</p>
      <a href="${submitHref}" class="btn-gold">List Your Business</a>
    </section>
  </main>

  <footer class="seo-footer">
    <p>&copy; 2026 SophiaTV · The Global Marketplace for 105 Countries × 18 Categories</p>
  </footer>
</body>
</html>
`;
}

// --- Emit pages ---
fs.mkdirSync(OUT, { recursive: true });
let generated = 0;
let withListings = 0;
let empty = 0;
const startedAt = Date.now();

for (const country of COUNTRIES) {
  const countrySlug = slugify(country.name);
  const countryDir = path.join(OUT, countrySlug);
  fs.mkdirSync(countryDir, { recursive: true });
  for (const category of CATEGORIES) {
    const catSlug = slugify(category.label);
    const catDir = path.join(countryDir, catSlug);
    fs.mkdirSync(catDir, { recursive: true });
    const html = pageFor(country, category);
    fs.writeFileSync(path.join(catDir, 'index.html'), html);
    generated++;
    const hasListings = LISTINGS.some(l => l.country === country.name && l.category === category.label);
    if (hasListings) withListings++; else empty++;
  }
}

const ms = Date.now() - startedAt;
console.log(`✓ Generated ${generated} country×category SEO pages in ${ms} ms`);
console.log(`  ${withListings} pages with at least one listing, ${empty} empty pages with CTA`);
console.log(`  Live URLs: /market/country/<country>/<category>/`);
