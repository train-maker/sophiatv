#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlFiles = [];
const missing = [];
const checked = new Set();
const ignoredDirs = new Set(['node_modules', '.git', '.vercel']);
const ignoredRelativePrefixes = [
  `references${path.sep}github-agent-repos${path.sep}`,
];

function shouldIgnore(fullPath, entryName) {
  if (ignoredDirs.has(entryName)) return true;
  const relative = path.relative(root, fullPath);
  return ignoredRelativePrefixes.some((prefix) => relative === prefix.slice(0, -1) || relative.startsWith(prefix));
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (shouldIgnore(full, entry.name)) continue;
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

function stripUrl(value) {
  return value
    .replace(/&amp;/g, '&')
    .split('#')[0]
    .split('?')[0]
    .trim();
}

function isLocal(value) {
  return value &&
    !value.includes('${') &&
    !value.startsWith('http://') &&
    !value.startsWith('https://') &&
    !value.startsWith('mailto:') &&
    !value.startsWith('tel:') &&
    !value.startsWith('sms:') &&
    !value.startsWith('javascript:') &&
    !value.startsWith('data:') &&
    !value.startsWith('#');
}

function candidatePaths(fromFile, target) {
  const clean = stripUrl(target);
  if (!isLocal(clean)) return [];

  if (clean.startsWith('/api/')) {
    return [path.join(root, `${clean.slice(1)}.js`)];
  }

  const base = clean.startsWith('/')
    ? path.join(root, clean.slice(1))
    : path.resolve(path.dirname(fromFile), clean);

  const candidates = [base];
  if (!path.extname(base)) {
    candidates.push(`${base}.html`);
    candidates.push(path.join(base, 'index.html'));
  }
  return candidates;
}

function existsAny(candidates) {
  return candidates.some((candidate) => fs.existsSync(candidate));
}

walk(root);

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const attrs = source.matchAll(/\b(?:href|src)=["']([^"']+)["']/g);
  for (const match of attrs) {
    const target = match[1];
    const candidates = candidatePaths(file, target);
    if (!candidates.length) continue;

    const key = `${file}:${target}`;
    if (checked.has(key)) continue;
    checked.add(key);

    if (!existsAny(candidates)) {
      missing.push({
        file: path.relative(root, file),
        target,
        tried: candidates.map((candidate) => path.relative(root, candidate)),
      });
    }
  }
}

for (const manifest of findFilesByExt(root, '.webmanifest')) {
  const data = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  for (const target of [data.start_url, data.scope, ...(data.icons || []).map((icon) => icon.src)]) {
    const candidates = candidatePaths(manifest, target || '');
    if (!candidates.length) continue;
    const key = `${manifest}:${target}`;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!existsAny(candidates)) {
      missing.push({
        file: path.relative(root, manifest),
        target,
        tried: candidates.map((candidate) => path.relative(root, candidate)),
      });
    }
  }
}

for (const worker of findFilesByName(root, 'sw.js')) {
  const source = fs.readFileSync(worker, 'utf8');
  const literals = source.matchAll(/['"]((?:\/|\.\/|\.\.\/)[^'"]+)['"]/g);
  for (const match of literals) {
    const target = match[1];
    const candidates = candidatePaths(worker, target);
    if (!candidates.length) continue;
    const key = `${worker}:${target}`;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!existsAny(candidates)) {
      missing.push({
        file: path.relative(root, worker),
        target,
        tried: candidates.map((candidate) => path.relative(root, candidate)),
      });
    }
  }
}

if (missing.length) {
  console.error(`Smoke test failed: ${missing.length} missing internal target(s).`);
  for (const item of missing.slice(0, 80)) {
    console.error(`- ${item.file} -> ${item.target}`);
    console.error(`  tried: ${item.tried.join(', ')}`);
  }
  if (missing.length > 80) console.error(`...and ${missing.length - 80} more`);
  process.exit(1);
}

console.log(`Smoke test passed: ${htmlFiles.length} HTML files, ${checked.size} local targets checked.`);

function findFilesByExt(dir, ext, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (shouldIgnore(full, entry.name)) continue;
    if (entry.isDirectory()) findFilesByExt(full, ext, out);
    else if (entry.isFile() && entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

function findFilesByName(dir, name, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (shouldIgnore(full, entry.name)) continue;
    if (entry.isDirectory()) findFilesByName(full, name, out);
    else if (entry.isFile() && entry.name === name) out.push(full);
  }
  return out;
}
