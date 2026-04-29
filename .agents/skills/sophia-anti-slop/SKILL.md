---
name: sophia-anti-slop
description: Run the anti-AI-slop check on any Sophia diff or page. Triggers on "check for slop", "Squint Test", "Mansa Musa Squint", "is this AI generic". Greps for banned superlatives, emoji UI, fake live metrics, purple-on-black noise, cartoon branding remnants. Reports findings — does not auto-fix.
---

# Sophia Anti-Slop Check

Tarence's hard rule (2026-04-28): **NO AI SLOP AT ALL.** Every diff passes the Squint Test before merge.

## What is slop

If you can't tell at a glance whether a section is real product or generated decoration, it's slop. Specifically:

- **Banned superlatives:** "revolutionary", "game-changing", "next-generation", "world-class", "cutting-edge", "industry-leading", "best-in-class", "unparalleled", "state-of-the-art"
- **Emoji UI:** Decorative emoji in nav, buttons, success messages, headers, feature lists
- **Fake live metrics:** `live-pill`, `vcard-live`, `vcard-live-tag`, `scanlines`, fake viewer counts, fake "120 listings", fake "59 countries"
- **Generic dark-mode:** purple-on-black gradients, `ma-purple` class, cheap neon glow, random gradient blobs
- **Cartoon branding:** old play-button logos, mascot art, simple filler shapes
- **Demo language on launch surfaces:** "PREVIEW", "BETA", "COMING SOON" when the surface is meant to be live
- **Generic CTAs:** "Get started", "Learn more", "Click here"
- **Lorem-ipsum-style copy:** vague benefits, unproven claims, "imagine if" framing
- **AI-generated images that look AI-generated:** floating glowing orbs, generic 3D blobs, abstract flow lines

## The Squint Test

1. Look at the diff (or rendered page) from arm's length.
2. Squint until you can't read individual words.
3. Does it read as a SERIOUS PRODUCT or as a generated demo?
4. If it reads like a demo — it's slop. Block the merge.

## The Mansa Musa Squint Test (locked 2026-04-28)

After the regular Squint Test:
1. Does this section make being on Sophia signal importance?
2. Does being absent feel like missing the world that matters?
3. Is wealth shown not stated? (real numbers, real assets, real status — not adjectives)
4. Is exclusivity structural (gates, by-application lanes) not decorative?
5. Is scarcity honored never faked? (empty Anchor Wall seats with promise > fake "ALMOST FULL" badges)

If any answer is no, the section needs work.

## Grep commands

Run all of these against any modified file:

```bash
# Banned superlatives
rg -i 'revolutionary|game.changing|cutting.edge|next.generation|world.class|industry.leading|best.in.class|unparalleled|state.of.the.art' <file>

# Banned live-shape markup
rg 'live-pill|vcard-live|vcard-live-tag|scanlines|ma-purple' <file>

# Banned launch language on production-meant surfaces
rg -i 'GLOBAL DIRECTORY · LAUNCH PREVIEW|SOPHIA MARKET — PREVIEW|@keyframes pulse' <file>

# Emoji UI (look for these in copy/nav/buttons/cards)
rg -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' <file>

# Banned animations that read live-shaped
rg '@keyframes pulse|animation:.*pulse' <file>
```

All should return zero results on a polished SOVEREIGN page.

## Report format

```
=== Sophia Anti-Slop Report — <file or diff> ===

Banned superlatives    : <count> | <list>
Live-shape markup      : <count> | <list>
Launch-preview language: <count> | <list>
Emoji UI               : <count>
Pulse animations       : <count>

Squint Test           : [PASS / FAIL]
Mansa Musa Squint Test: [PASS / FAIL]

Verdict: <ship / block / fix-required>
Required fixes:
  - <specific lines + concrete replacement>
```

## Anti-slop is not anti-luxury

The cure for slop isn't blandness. It's:
- **Real numbers:** "105 countries · 18 categories · 50+ language layer · 0 fake live metrics"
- **Real materials:** gold, diamond, polished wood, marble — not generic neon
- **Real assets:** actual photography, actual generated images that look intentional
- **Real status architecture:** Anchor seats, by-application lanes, country mosaics
- **Real motion:** purposeful reveal-on-scroll, not generic parallax

## See also

- Squint Test full spec: `Sophia Brain/03 - Sophia OS/agent-sync/RESPONSE-FROM-CLAUDE-LUXURY-DIRECTION-2026-04-28.md` §12
- Mansa Musa effect spec: `Sophia Brain/03 - Sophia OS/agent-sync/MANSA-MUSA-EFFECT-2026-04-28.md`
- Banned-superlative list (canonical): same Mansa Musa file
- Approved visual identity: `assets/brand/sophia-logo-premium.png` + `assets/brand/sophia-globe-black-gold.png`
