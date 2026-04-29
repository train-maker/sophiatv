# Claude Code 10-Hour Sophia Handoff

You are Claude Code taking over Sophia launch hardening from Codex.

## Repo

`/Users/tarencea.rainey/outputs/sophiatv`

Canonical preview:

`http://127.0.0.1:4173/`

## User Intent

Tarence wants Sophia ready for the May 15, 2026 launch. Work like a senior staff engineer and product-minded frontend lead. Keep chat minimal. Use tools aggressively. Do not burn time looping; if stuck, write a clear blocker note and ask for targeted help.

## Hard Rules

- Do not deploy publicly without approval.
- Do not spend money without approval.
- Do not touch `.env` files or secrets without approval.
- Do not change auth, payments, admin, or security logic without approval.
- Do not delete major files without approval.
- Preserve existing work in the dirty worktree.
- Keep approved premium Sophia logo.
- Keep selected black/gold globe.
- Keep globe caption off.
- Use `http://127.0.0.1:4173/` as canonical local preview.

## Current Verified State

Last Codex gates passed after latest banner edit:

- `npm run check`: passed
- `npm run audit:playwright`: passed

Recent targeted fixes:

- Homepage black/gold globe centered and constrained on desktop/mobile.
- Unity banner uses `object-fit: contain`.
- Bottom-left glass logo card removed from unity banner because user called it AI slop.
- Approved premium logo treatment added in top-left of unity banner.
- Market page no longer opens on stale prototype.
- Stale market globe/category prototype hidden.
- Market first H1 is now `SophiaMarket — Worldwide Classifieds & Business Directory`.
- Market starts at top on desktop/mobile.
- Market has separate classifieds and business directory sections.
- Country major city/state chips cover all 105 countries.
- Country SEO generated pages no longer use old `$29.99/mo` listing copy.
- Country CTAs now route to `/market-submit.html` and `/market.html`.
- Mobile nav links remain visible via horizontal quick nav.
- Pricing and market-submit now have `main` / `#main-content` landmarks.
- Local GitHub reference repos cloned under `references/github-agent-repos/`.
- Project subagents installed under `.codex/agents/`.
- Reusable Codex skill created at `~/.codex/skills/launch-grade-web-engineering/`.

## Claude Review Findings Already Returned

Claude previously found:

1. `index.html:633` internal dev copy: `Top-site pattern factory`.
2. `signup.html` and `emails/welcome.html` use politically loaded "AI-powered free speech network" copy.
3. `session.html` exposes Agora App ID and uses token-free join.
4. `market-submit.html` fakes success and promises email within 24 hours with no backend.
5. `index.html` has domain mismatch between `sophiaoperator.com` schema URL and `sophiatv.vercel.app` canonical/OG.
6. Desktop Shenzhen layer includes "OPEN 24/7" fake-operational-looking decoration.

Prioritize these by launch risk. For anything involving auth/payments/security/secrets/public deploy, stop and ask Tarence before changing.

## 10-Hour Work Plan

### Hour 1: Re-verify Baseline

- Run `npm run check`.
- Run `npm run audit:playwright`.
- Open screenshots for `/`, `/market.html`, `/pricing.html`, `/market-submit.html`, `/signup.html`, `/session.html`.
- Write any immediate blockers to `workflows/CLAUDE_10_HOUR_RESULTS.md`.

### Hours 2-3: Copy And Trust Cleanup

Patch low-risk copy:

- Replace internal `Top-site pattern factory` with public-facing copy.
- Replace "AI-powered free speech network" language with Sophia mission language.
- Remove or soften fake-operational claims like `OPEN 24/7` if visible.
- Ensure launch/pricing/listing copy agrees across public pages.

Suggested language:

- `Global media layer`
- `Connect, trade, and build across every language.`
- `Language stops being a wall.`

### Hours 4-5: Forms And Truthfulness

Review:

- `market-submit.html`
- `signup.html`
- `login.html`
- `pricing.html`

Patch only low-risk frontend copy/state issues unless approved.

Do not claim real email delivery if no backend sends email.
Do not imply payment is live if payment is not live.

### Hours 6-7: SEO And Generated Pages

- Check `index.html` schema/canonical domain consistency.
- Check generated country pages for stale copy/routes.
- If generator changes, run `npm run seo`.
- Search for stale claims: `29.99`, `free speech`, `OPEN 24/7`, `Top-site pattern factory`, `demo/testing`.

### Hours 8-9: Mobile/Desktop Visual QA

Use Playwright:

- Home
- Market
- Pricing
- Submit Listing
- Signup
- Session
- One generated country page

Check:

- first viewport
- mobile nav
- no horizontal overflow
- no clipped logo/badges
- forms usable
- no obvious fake/internal text

### Hour 10: Final Package

Run:

- `npm run check`
- `npm run audit:playwright`

Write `workflows/CLAUDE_10_HOUR_RESULTS.md`:

- Files changed
- Commands run
- Pass/fail status
- Remaining risks
- Questions for Tarence
- Next recommended action

## Output Rules

Keep final output concise. Findings first. No motivational filler.

