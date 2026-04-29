#!/usr/bin/env node
/**
 * generate-sitemap.cjs — rebuild sitemap.xml including all 105 country SEO pages.
 * Run after generate-seo-pages.cjs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOMAIN = 'https://sophiatv.vercel.app';  // swap to sophiaoperator.com once DNS resolves
const OUT = path.join(ROOT, 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

// Top-level pages
const topLevel = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/market', priority: '0.95', changefreq: 'daily' },
  { loc: '/market/country/', priority: '0.9', changefreq: 'weekly' },
  { loc: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { loc: '/market-submit', priority: '0.9', changefreq: 'monthly' },
  { loc: '/listing-guidelines', priority: '0.55', changefreq: 'yearly' },
  { loc: '/social', priority: '0.85', changefreq: 'weekly' },
  { loc: '/everyday-tools', priority: '0.74', changefreq: 'monthly' },
  { loc: '/natural-cures', priority: '0.72', changefreq: 'monthly' },
  { loc: '/signup', priority: '0.8', changefreq: 'monthly' },
  { loc: '/app/', priority: '0.75', changefreq: 'monthly' },
  { loc: '/blog/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/blog/alibaba-alternatives-2026', priority: '0.65', changefreq: 'monthly' },
  { loc: '/blog/how-to-find-global-suppliers', priority: '0.65', changefreq: 'monthly' },
  { loc: '/blog/list-your-business-sophiamarket', priority: '0.65', changefreq: 'monthly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/copyright', priority: '0.3', changefreq: 'yearly' },
];

// Country pages from the generated /market/country/<slug>/ dirs
const countryDir = path.join(ROOT, 'market', 'country');
const countryDirs = fs.existsSync(countryDir)
  ? fs.readdirSync(countryDir).filter(d => {
      const full = path.join(countryDir, d);
      return fs.statSync(full).isDirectory();
    })
  : [];

const countryPages = countryDirs.map(slug => ({
  loc: `/market/country/${slug}/`,
  priority: '0.75',
  changefreq: 'weekly',
}));

// Country×category pages: /market/country/<country>/<category>/
const countryCategoryPages = [];
for (const cSlug of countryDirs) {
  const inner = path.join(countryDir, cSlug);
  for (const sub of fs.readdirSync(inner)) {
    const subPath = path.join(inner, sub);
    if (!fs.statSync(subPath).isDirectory()) continue;
    if (!fs.existsSync(path.join(subPath, 'index.html'))) continue;
    countryCategoryPages.push({
      loc: `/market/country/${cSlug}/${sub}/`,
      priority: '0.6',
      changefreq: 'weekly',
    });
  }
}

const urls = [...topLevel, ...countryPages, ...countryCategoryPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(u => `  <url>
    <loc>${DOMAIN}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(OUT, xml);
console.log(`✓ Sitemap written: ${urls.length} URLs (${topLevel.length} top-level + ${countryPages.length} country + ${countryCategoryPages.length} country×category)`);
