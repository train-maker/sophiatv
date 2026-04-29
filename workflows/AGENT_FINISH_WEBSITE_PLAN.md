# Agent Finish Website Plan

Current objective: finish Sophia as a premium, launch-ready website without going backward.

Codex remains lead engineer and verifier. Ollama, Claude Code, and Cursor help through bounded tasks only.

## Current Locked Direction

- Approved logo: `/Users/tarencea.rainey/outputs/sophiatv/assets/brand/sophia-logo-premium.png`
- Hero line: "The world, translated into opportunity."
- Style: elegant, premium, restrained, futuristic.
- No cartoon/play-button branding.
- Free/local tools first. Paid tools stay in `/Users/tarencea.rainey/outputs/sophiatv/references/paid-tools/README.md`.
- No secrets, billing, account permissions, paid APIs, deploys, publishing, or destructive actions without Tarence approval.

## Agent Roles

### Codex

Owner: final implementation, integration, verification, and memory.

Must run:

```bash
npm run check
npm run audit:playwright
```

### Ollama

Owner: free local critique and idea ranking.

Use for:

- visual critique from current files,
- copy and tone review,
- practical missing-section suggestions,
- mobile/clarity risk list.

Do not use for secrets, accounts, paid tools, publishing, or final authority.

### Claude Code

Owner: bounded senior review.

Use for:

- homepage polish review,
- consistency pass across key pages,
- launch-risk audit,
- small isolated patches only when explicitly assigned.

Do not let Claude edit broad surfaces without Codex reviewing.

### Cursor

Owner: scoped UI polish assistance.

Use for:

- CSS refinement,
- mobile spacing,
- component consistency,
- focused page-level improvements.

Do not let Cursor change product direction or revert current logo/typography.

## Immediate Work Queue

1. Homepage visual polish pass: typography, spacing, hero composition, CTA clarity.
2. Mobile polish pass: nav, hero, CTA stack, no text overlap.
3. Cross-page brand consistency: homepage, market, social, everyday tools, natural cures, pricing.
4. Launch trust cleanup: remove fake claims, keep useful proof and honest language.
5. Asset/performance check: logo size, image compression, no avoidable external calls.
6. Final browser verification and screenshots.

## Handoff Format

Every agent result should include:

```text
Objective:
Files inspected:
Findings:
Recommended edits:
Risks:
Verification needed:
```
