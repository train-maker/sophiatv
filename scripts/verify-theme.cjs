#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CONTRACT_PATH = path.join(ROOT, 'design-system', 'sovereign.theme.json');
const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, 'utf8'));
const files = [
  ...contract.audit.launchPages,
  ...contract.audit.styleFiles,
  ...contract.audit.scriptFiles,
];

const allowed = contract.audit.allowedMatches;
const checks = [
  {
    kind: 'visible copy',
    re: new RegExp(`\\b(${contract.banned.visibleCopy.join('|')})\\b`, 'gi'),
  },
  {
    kind: 'legacy live selector',
    re: new RegExp(contract.banned.classOrSelector.join('|'), 'g'),
  },
  {
    kind: 'pulse animation',
    re: new RegExp(contract.banned.animation.join('|'), 'gi'),
  },
  {
    kind: 'emoji icon',
    re: new RegExp(contract.banned.emojiIcon, 'gu'),
  },
];

function isAllowed(lineText, match) {
  return allowed.some((token) => lineText.includes(token) || match.includes(token));
}

function lineAt(text, index) {
  const start = text.lastIndexOf('\n', index - 1) + 1;
  const end = text.indexOf('\n', index);
  return text.slice(start, end === -1 ? text.length : end);
}

const violations = [];

for (const rel of files) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const check of checks) {
    check.re.lastIndex = 0;
    let match;
    while ((match = check.re.exec(text)) !== null) {
      const lineText = lineAt(text, match.index);
      if (isAllowed(lineText, match[0])) continue;
      const line = text.slice(0, match.index).split('\n').length;
      violations.push({
        file: rel,
        line,
        kind: check.kind,
        match: match[0],
      });
    }
  }
}

if (violations.length) {
  console.error(`SOVEREIGN theme contract failed: ${violations.length} violation(s).`);
  for (const violation of violations.slice(0, 80)) {
    console.error(`${violation.file}:${violation.line} ${violation.kind}: ${violation.match}`);
  }
  if (violations.length > 80) {
    console.error(`...and ${violations.length - 80} more`);
  }
  process.exit(1);
}

console.log('SOVEREIGN theme contract passed: no launch-surface violations.');
