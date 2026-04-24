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
  { loc: '/signup', priority: '0.8', changefreq: 'monthly' },
  { loc: '/login', priority: '0.6', changefreq: 'yearly' },
  { loc: '/session', priority: '0.7', changefreq: 'monthly' },
  { loc: '/dashboard', priority: '0.5', changefreq: 'monthly' },
];

// Country pages from the generated /market/country/<slug>/ dirs
const countryDir = path.join(ROOT, 'market', 'country');
const countryPages = fs.existsSync(countryDir)
  ? fs.readdirSync(countryDir).filter(d => {
      const full = path.join(countryDir, d);
      return fs.statSync(full).isDirectory();
    }).map(slug => ({
      loc: `/market/country/${slug}/`,
      priority: '0.75',
      changefreq: 'weekly',
    }))
  : [];

const urls = [...topLevel, ...countryPages];

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
console.log(`✓ Sitemap written: ${urls.length} URLs (${topLevel.length} top-level + ${countryPages.length} country)`);
