const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'everyday-tools.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const toolCards = [...html.matchAll(/<article class="tool-card[^"]*"[^>]*>/g)];
const missing = toolCards
  .map((match, index) => ({ index: index + 1, tag: match[0] }))
  .filter((card) => !card.tag.includes('data-md-source='));

if (toolCards.length < 15) {
  throw new Error(`Expected at least 15 everyday tool cards, found ${toolCards.length}.`);
}

if (missing.length) {
  throw new Error(
    `Every everyday tool card needs a data-md-source attribute. Missing: ${missing
      .map((card) => `#${card.index}`)
      .join(', ')}`
  );
}

console.log(`Everyday tools MD source check passed: ${toolCards.length} cards tagged.`);
