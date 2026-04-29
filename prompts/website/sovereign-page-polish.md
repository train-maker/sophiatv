# Sovereign Page Polish — Codex prompt

Use this prompt to polish any single Sophia page to the SOVEREIGN bar.

---

Polish `<page>.html` to SOVEREIGN bar. Use the `$sophia-page-polish` skill.

Constraints:
- Do NOT remove existing form handlers, click handlers, or copy required by `npm run audit:functions`
- Do NOT change backend endpoints
- Do NOT commit, do NOT deploy
- Do follow the visual standard locked 2026-04-28: black diamond globe + gold cartography + Mansa Musa effect, restrained typography, no AI slop

Pre-read:
1. `~/outputs/sophiatv/AGENTS.md`
2. `~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/RESPONSE-FROM-CLAUDE-LUXURY-DIRECTION-2026-04-28.md`
3. `~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/MANSA-MUSA-EFFECT-2026-04-28.md`
4. `~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/vault-assets/mansa-musa-copy-rewrites.md`

Workflow:
1. Read `<page>.html` in full.
2. Catalog AI slop (banned superlatives, emoji UI, fake live metrics, purple-on-black, demo language, generic CTAs).
3. Apply edits in this order:
   - Add `assets/css/sovereign.css` link if missing
   - Set favicon to premium logo
   - Replace banned superlatives with concrete numbers + nouns
   - Replace emoji UI with SOVEREIGN word/letter labels
   - Remove `live-pill` / `vcard-live` / `scanlines` / `ma-purple` markup
   - Tighten typography
   - Apply institutional tone for commercial surfaces
   - Wire reveal-on-scroll where it earns its keep
4. Run `$sophia-anti-slop` on the page — must return zero banned strings.
5. Run `npm run check && npm run audit:playwright`.
6. Capture screenshots under `test-results/` with descriptive names.

Report format:
```
### Polished
- file: <page>.html
- before: <slop count>
- after: <slop count>

### Verified
- npm run check: PASS/FAIL
- npm run audit:playwright: PASS/FAIL (desktop + mobile, overflow=0, console clean)
- screenshots: <paths>

### Risks
- ...

### Next
- ... (do NOT include "deploy" — that's Tarence's gate)
```
