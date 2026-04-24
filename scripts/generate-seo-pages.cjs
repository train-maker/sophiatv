#!/usr/bin/env node
/**
 * generate-seo-pages.js
 * Produces one SEO landing page per country under /market/country/<slug>/index.html.
 * Each page: unique H1, filtered listings, JSON-LD, regional sibling links, CTA.
 *
 * Run: node scripts/generate-seo-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'market', 'country');
const LISTINGS = JSON.parse(fs.readFileSync(path.join(ROOT, 'sample-listings.json'), 'utf8'));

// Country list scraped from market.html
const marketHtml = fs.readFileSync(path.join(ROOT, 'market.html'), 'utf8');
const countryRe = /\{\s*code:\s*"([A-Z]{2})",\s*name:\s*"([^"]+)",\s*flag:\s*"([^"]+)",\s*region:\s*"([^"]+)"\s*\}/g;
const COUNTRIES = [];
let m;
while ((m = countryRe.exec(marketHtml)) !== null) {
  COUNTRIES.push({ code: m[1], name: m[2], flag: m[3], region: m[4] });
}
console.log(`Parsed ${COUNTRIES.length} countries from market.html`);

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function pageFor(country) {
  const slug = slugify(country.name);
  const listings = LISTINGS.filter(l => l.country === country.name);
  const featured = listings.filter(l => l.featured);
  const free = listings.filter(l => !l.featured);
  const sorted = [...featured, ...free];

  const siblings = COUNTRIES.filter(c => c.region === country.region && c.code !== country.code).slice(0, 12);

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
    "name": `Business Directory in ${country.name}`,
    "itemListElement": listingJsonLd.map((biz, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": biz,
    })),
  };

  const title = `${listings.length > 0 ? `${listings.length} Businesses` : 'Business Directory'} in ${country.name} ${country.flag} — SophiaMarket`;
  const description = listings.length > 0
    ? `Discover ${listings.length} businesses in ${country.name} across import/export, wholesale, real estate, services, and more. Contact directly on SophiaMarket — part of SophiaTV's global directory in 105 countries.`
    : `Be the first business listed in ${country.name} on SophiaMarket — the global business directory across 105 countries. List your business for free or get Featured placement for $29.99/month.`;

  const canonical = `https://sophiatv.vercel.app/market/country/${slug}/`;

  const listingCards = sorted.length === 0
    ? `<div class="empty-state">
         <h2>Be the first business in ${escapeHtml(country.name)}</h2>
         <p>SophiaMarket is live in 105 countries and growing. Your listing here will be the first result visitors see when they search for businesses in ${escapeHtml(country.name)}.</p>
         <a href="/market-submit" class="btn-gold btn-lg">List Your Business — $29.99/mo</a>
       </div>`
    : sorted.map(l => `
         <article class="listing-card ${l.featured ? 'featured' : ''}">
           <header class="listing-top">
             <div class="listing-name">${escapeHtml(l.name)}</div>
             <div class="listing-flag">${l.flag}</div>
           </header>
           <div class="badge-row">
             <span class="badge badge-cat">${escapeHtml(l.category)}</span>
             ${l.featured ? '<span class="badge badge-featured">★ Featured</span>' : ''}
           </div>
           <p class="listing-desc">${escapeHtml(l.description)}</p>
           <div class="listing-location">📍 ${escapeHtml(l.city)}, ${escapeHtml(country.name)}</div>
           <div class="listing-actions">
             <a class="btn-profile" href="/market-listing.html?id=${l.id}">View Profile</a>
           </div>
         </article>`).join('\n');

  const regionLinks = siblings.map(s =>
    `<a class="region-sibling" href="/market/country/${slugify(s.name)}/">${s.flag} ${escapeHtml(s.name)}</a>`
  ).join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="https://sophiatv.vercel.app/public/og-image.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />

  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

  <link rel="stylesheet" href="/style.css" />
  <style>
    .seo-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
    .seo-breadcrumb { font-size: 13px; color: var(--muted, #888); margin-bottom: 16px; }
    .seo-breadcrumb a { color: inherit; text-decoration: none; border-bottom: 1px dotted; }
    .seo-hero { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
    .seo-hero .flag { font-size: 64px; line-height: 1; }
    .seo-hero h1 { margin: 0; font-size: 40px; font-weight: 800; }
    .seo-intro { font-size: 17px; color: var(--muted, #888); max-width: 720px; margin: 8px 0 24px; }
    .seo-cta-row { display: flex; gap: 12px; margin: 16px 0 32px; flex-wrap: wrap; }
    .btn-gold { display: inline-block; padding: 12px 22px; background: var(--gold, #d4af37); color: #0a0a0a; font-weight: 700; border-radius: 8px; text-decoration: none; }
    .btn-outline { display: inline-block; padding: 12px 22px; background: transparent; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; color: inherit; }
    .seo-meta { display: flex; gap: 32px; padding: 16px 0; border-top: 1px solid #222; border-bottom: 1px solid #222; margin-bottom: 32px; font-size: 14px; flex-wrap: wrap; }
    .seo-meta strong { color: var(--gold, #d4af37); }
    .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-bottom: 48px; }
    .listing-card { background: #121212; border: 1px solid #222; border-radius: 10px; padding: 16px; transition: all .2s; }
    .listing-card:hover { border-color: var(--gold, #d4af37); transform: translateY(-2px); }
    .listing-card.featured { border-color: var(--gold, #d4af37); box-shadow: 0 0 0 1px rgba(212,175,55,.2); }
    .listing-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .listing-name { font-weight: 700; font-size: 16px; }
    .listing-flag { font-size: 22px; }
    .badge-row { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
    .badge { font-size: 11px; padding: 3px 8px; border-radius: 999px; background: #222; }
    .badge-featured { background: var(--gold, #d4af37); color: #0a0a0a; font-weight: 700; }
    .listing-desc { font-size: 13px; color: #bbb; margin: 6px 0 8px; line-height: 1.5; }
    .listing-location { font-size: 12px; color: #888; margin-bottom: 10px; }
    .listing-actions { display: flex; gap: 8px; }
    .btn-profile { font-size: 13px; padding: 6px 12px; border: 1px solid #333; border-radius: 6px; text-decoration: none; color: inherit; }
    .empty-state { text-align: center; padding: 48px 16px; border: 1px dashed #333; border-radius: 12px; grid-column: 1 / -1; }
    .empty-state h2 { margin: 0 0 8px; }
    .empty-state p { color: var(--muted, #888); max-width: 520px; margin: 0 auto 16px; }
    .region-section h2 { font-size: 20px; margin-bottom: 12px; }
    .region-section { margin-bottom: 40px; }
    .region-sibling { display: inline-block; padding: 6px 12px; margin: 4px 4px 4px 0; background: #121212; border: 1px solid #222; border-radius: 6px; font-size: 13px; text-decoration: none; color: inherit; }
    .region-sibling:hover { border-color: var(--gold, #d4af37); }
    .final-cta { text-align: center; padding: 48px 16px; background: linear-gradient(135deg, #1a1400 0%, #0a0a0a 100%); border-radius: 16px; border: 1px solid #2a2000; }
    .final-cta h2 { font-size: 28px; margin: 0 0 8px; }
    .final-cta p { color: var(--muted, #888); margin: 0 0 20px; }
  </style>
</head>
<body>
  <header class="seo-wrap" style="padding-bottom: 0;">
    <nav class="seo-breadcrumb">
      <a href="/">Home</a> › <a href="/market">Market</a> › <a href="/market/country/">Countries</a> › <strong>${escapeHtml(country.name)}</strong>
    </nav>
  </header>

  <main class="seo-wrap">
    <div class="seo-hero">
      <div class="flag">${country.flag}</div>
      <h1>${listings.length > 0 ? `${listings.length} ${listings.length === 1 ? 'Business' : 'Businesses'}` : 'Business Directory'} in ${escapeHtml(country.name)}</h1>
    </div>
    <p class="seo-intro">${escapeHtml(description)}</p>

    <div class="seo-cta-row">
      <a href="/market-submit" class="btn-gold">List Your Business — $29.99/mo</a>
      <a href="/market" class="btn-outline">Browse All 105 Countries</a>
    </div>

    <div class="seo-meta">
      <div><strong>${listings.length}</strong> total listings</div>
      <div><strong>${featured.length}</strong> featured</div>
      <div><strong>${country.region}</strong> region</div>
      <div><strong>105</strong> countries on SophiaMarket</div>
    </div>

    <section class="listings-grid">
      ${listingCards}
    </section>

    ${siblings.length ? `
    <section class="region-section">
      <h2>More businesses in ${escapeHtml(country.region)}</h2>
      ${regionLinks}
    </section>` : ''}

    <section class="final-cta">
      <h2>Ready to list your ${escapeHtml(country.name)} business?</h2>
      <p>Get seen in front of buyers in 105 countries — $29.99/month, cancel anytime.</p>
      <a href="/market-submit" class="btn-gold">List Your Business</a>
    </section>
  </main>

  <footer class="seo-wrap" style="padding-top: 0; text-align: center; color: #666; font-size: 13px;">
    <p>&copy; 2026 SophiaTV · The Global Marketplace for 105 Countries</p>
  </footer>
</body>
</html>
`;
}

// Emit per-country pages
fs.mkdirSync(OUT, { recursive: true });
let generated = 0;
for (const country of COUNTRIES) {
  const slug = slugify(country.name);
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageFor(country));
  generated++;
}

// Index page listing all 105 countries
const regions = {};
for (const c of COUNTRIES) { (regions[c.region] = regions[c.region] || []).push(c); }

const indexHtml = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Business Directory by Country — 105 Countries on SophiaMarket</title>
<meta name="description" content="Browse SophiaMarket business directory by country — 105 countries across Americas, Europe, Africa, Middle East, and Asia-Pacific." />
<link rel="canonical" href="https://sophiatv.vercel.app/market/country/" />
<link rel="stylesheet" href="/style.css" />
<style>
  .country-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
  .country-wrap h1 { font-size: 36px; margin-bottom: 8px; }
  .country-wrap > p { color: var(--muted, #888); margin-bottom: 32px; }
  .region-block { margin-bottom: 32px; }
  .region-block h2 { font-size: 20px; border-bottom: 1px solid #222; padding-bottom: 8px; margin-bottom: 16px; }
  .country-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
  .country-link { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #121212; border: 1px solid #222; border-radius: 8px; text-decoration: none; color: inherit; font-size: 14px; }
  .country-link:hover { border-color: var(--gold, #d4af37); }
</style>
</head><body>
<main class="country-wrap">
  <nav style="font-size: 13px; color: var(--muted, #888); margin-bottom: 16px;">
    <a href="/" style="color: inherit;">Home</a> › <a href="/market" style="color: inherit;">Market</a> › <strong>Countries</strong>
  </nav>
  <h1>Business Directory by Country</h1>
  <p>SophiaMarket covers 105 countries across 5 regions. Pick yours to see the businesses listed — or be the first to list your own.</p>
  ${Object.entries(regions).map(([region, list]) => `
    <section class="region-block">
      <h2>${escapeHtml(region)} <small style="font-weight: 400; color: var(--muted, #888);">· ${list.length} countries</small></h2>
      <div class="country-grid">
        ${list.map(c => `<a class="country-link" href="/market/country/${slugify(c.name)}/"><span>${c.flag}</span><span>${escapeHtml(c.name)}</span></a>`).join('')}
      </div>
    </section>
  `).join('')}
</main>
</body></html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), indexHtml);

console.log(`✓ Generated ${generated} country landing pages + 1 index at /market/country/`);
console.log(`  Live URLs: /market/country/<slug>/ (e.g., /market/country/united-states/)`);
