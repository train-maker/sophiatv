#!/usr/bin/env node
const { setTimeout: delay } = require('node:timers/promises');

const LIVE_URL = process.env.SOPHIA_LIVE_URL || 'https://sophiatv.vercel.app/';
const EXPECTED = [
  'country-mosaic',
  '105 countries on the floor',
  'SOPHIA · WISDOM · TRADE · TRANSLATION',
];
const BANNED = [
  'live-pill',
  'vcard-live',
  'vcard-live-tag',
  'scanlines',
  'ma-purple',
  'GLOBAL DIRECTORY · LAUNCH PREVIEW',
  'SOPHIA MARKET — PREVIEW',
  '@keyframes pulse',
];

async function fetchHtml() {
  const response = await fetch(LIVE_URL, {
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
  });
  if (!response.ok) throw new Error(`${LIVE_URL} returned HTTP ${response.status}`);
  return response.text();
}

(async () => {
  const waitSeconds = Number(process.env.SOPHIA_LIVE_WAIT_SECONDS || 0);
  if (waitSeconds > 0) await delay(waitSeconds * 1000);

  const html = await fetchHtml();
  const missing = EXPECTED.filter((text) => !html.includes(text));
  const presentBanned = BANNED.filter((text) => html.includes(text));
  const countryCells = (html.match(/class="country-cell/g) || []).length;

  if (countryCells !== 105) {
    missing.push(`105 country-cell elements (found ${countryCells})`);
  }

  if (missing.length || presentBanned.length) {
    console.error('Sophia live verification failed.');
    if (missing.length) console.error(`Missing expected: ${missing.join(' | ')}`);
    if (presentBanned.length) console.error(`Banned still present: ${presentBanned.join(' | ')}`);
    process.exit(1);
  }

  console.log(`Sophia live verification passed: ${LIVE_URL}`);
})();
