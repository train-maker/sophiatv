---
name: sophia-page-polish
description: SOVEREIGN-grade polish workflow for any Sophia page. Triggers on "polish [page].html", "upgrade [surface]", "make this page sovereign", "apply gold/diamond/king treatment". Applies Mansa Musa effect (status architecture), Squint Test (no AI slop), banned-superlatives grep, emoji UI removal, restrained typography lock. Verifies via npm run check + audit:playwright.
---

# Sophia SOVEREIGN Page Polish

Bring any page in `~/outputs/sophiatv/` to the $10 billion valuation bar without breaking existing function.

## Visual standard (locked 2026-04-28 by Tarence)

- **System name:** SOVEREIGN
- **Lead metaphor:** Black diamond globe + gold cartography
- **Layered directive:** Mansa Musa effect — being on Sophia signals importance
- **Tokens:** Use `assets/css/sovereign.css` shared tokens (color, type, spacing, radius, motion)
- **Logo:** Premium gold logo at `assets/brand/sophia-logo-premium.png` (no cartoon/play-button)
- **No AI slop:** No generic blobs, fake live metrics, purple-on-black, emoji UI, cheap badges, dead CTAs

## Read these specs before polishing

```text
~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/RESPONSE-FROM-CLAUDE-LUXURY-DIRECTION-2026-04-28.md
~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/MANSA-MUSA-EFFECT-2026-04-28.md
~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/vault-assets/mansa-musa-copy-rewrites.md
```

## Polish workflow

1. **Read the page in full.** Do not skim. Note: existing function (forms, click handlers, data attributes), copy that's required by function-audit, current visuals.

2. **Catalog the AI slop.** Look for:
   - Live-ticker / vcard-live / scanlines / live-pill markup
   - Banned superlatives ("revolutionary", "game-changing", "next-generation" — use grep `rg -i 'revolutionary|game.changing|cutting.edge|next.gen|world.class' page.html`)
   - Emoji feature icons in nav, cards, success messages
   - Purple-on-black gradients (`ma-purple`, generic dark-mode noise)
   - Fake live counts, fake viewer numbers, fake testimonials
   - Generic CTAs ("Get started", "Learn more")
   - Cartoon mascot or play-button branding
   - Demo/preview language ("PREVIEW", "BETA", "COMING SOON" when launch-ready)

3. **Apply the Mansa Musa Squint Test.** Look at the page from across the room. Does it signal importance? Does being absent feel like missing the world that matters? If it's just generic SaaS, it's slop.

4. **Apply edits in this order:**
   1. Add `<link rel="stylesheet" href="/assets/css/sovereign.css" />` if missing
   2. Set favicon to premium logo
   3. Replace banned superlatives with concrete numbers + nouns ("105 countries on the floor" beats "world-class platform")
   4. Replace emoji UI with SOVEREIGN word/letter labels (e.g., emoji nav → "SG/MK/OP/AC/CT")
   5. Remove fake live metrics (live-pill, vcard-live, fake viewer counts)
   6. Tighten typography (serif display for headlines, refined sans for body)
   7. Apply institutional tone for commercial surfaces (pricing, signup, login, market-submit)
   8. Add reveal-on-scroll where it earns its keep (`assets/js/sovereign-reveal.js`)

5. **Preserve function.** Do not remove:
   - Form action handlers
   - Copy required by `npm run audit:functions`
   - Data attributes used by JS
   - Backend endpoints

6. **Squint Test pass.** Look at the diff. If you can't tell at a glance which lines are real product and which are decoration, fix.

7. **Verify:**
   ```bash
   npm run check
   npm run audit:playwright
   # If page-specific: node scripts/playwright-sophia-audit.cjs <page-slug>
   ```

8. **Capture screenshots** under `test-results/` with descriptive name (e.g., `home-sovereign-pass-desktop.png`).

9. **Do NOT commit, do NOT deploy.** Codex on-keyboard or Tarence handles those.

## Banned-superlative grep (run before declaring done)

```bash
rg -i 'revolutionary|game.changing|cutting.edge|next.generation|world.class|industry.leading|best.in.class|unparalleled|state.of.the.art' [page].html
```

Should return zero results.

## See also

- Sovereign tokens: `assets/css/sovereign.css`
- Reveal-on-scroll: `assets/js/sovereign-reveal.js`
- Country mosaic component: see `index.html` for canonical implementation
- Cartouche tile pattern: see homepage proof tiles
