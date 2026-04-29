# AGENTS.md — Sophia Repository (Codex / Claude / Cursor entry point)

> Codex reads this file at the start of every session in this repo. Project-scoped guidance overrides the global `~/.codex/AGENTS.md` for this codebase. Last updated: 2026-04-29.

## Where to start

```text
0. ~/Documents/Sophia Brain/00 - Index/START-HERE-NOW.md   ← auto-generated live state
1. ~/Documents/Sophia Brain/00 - Index/CURRENT-SOPHIA-PROJECT-ANCHOR.md
2. ~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/HANDOFF.md   ← current baton
3. ~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/BLOCKERS.md  ← what's gated
4. ~/outputs/sophiatv/memory/DAILY_MEMORY.md                       ← daily project log
5. ~/outputs/sophiatv/CODEX.md                                     ← detailed engineering reference
```

The vault is the source of truth for long-term memory. The repo is the source of truth for code. They coordinate via `agent-sync/` files.

## Mission

Build SophiaTV / SophiaMarket — a global media, marketplace, translation, social, wellness, and everyday-tools platform — to a $10 billion valuation bar. Visual standard: **SOVEREIGN** (black diamond globe + gold cartography + Mansa Musa effect). No AI slop, no cartoons, no fake live metrics, no purple-on-black, no generic templates.

## Hard rules in stone

1. **Decisive execution.** No fluff. No unsolicited summaries. Take action, report after.
2. **Money gate.** Never spend without approval. No paid subscriptions, no live Stripe, no paid APIs, no ad budgets.
3. **Deploy gate.** Never push to production without explicit Tarence approval. Manual `vercel --prod` only after green light. Vercel ↔ GitHub auto-deploy is currently disconnected.
4. **No AI slop.** Pass the **Squint Test** on every diff (see `Sophia Brain/03 - Sophia OS/agent-sync/RESPONSE-FROM-CLAUDE-LUXURY-DIRECTION-2026-04-28.md` §12). If you can't tell at a glance whether a section is real product or generated decoration, it's slop.
5. **Mansa Musa effect.** Every surface should make being on Sophia signal importance. Empty-with-promise (Anchor Wall seats, country mosaic) is the lever, not fake metrics. Spec: `Sophia Brain/03 - Sophia OS/agent-sync/MANSA-MUSA-EFFECT-2026-04-28.md`.
6. **No cartoon branding.** The premium logo at `assets/brand/sophia-logo-premium.png` is the elegance standard. Old play-button/cartoon marks are retired.
7. **Free/local tools first.** Paid tools go in `references/paid-tools/README.md` backlog with decision packets — not in live setup.
8. **Forward-motion creation is allowed.** Skills, plugins, files, scripts, assets, workflows, docs — create them when they keep Sophia moving forward. Money/auth/deploy gates still apply.
9. **Stripe price IDs deferred** until the 30-day free launch period ends. No paid billing flow active.
10. **Vault-only Codex ↔ Claude coordination** unless Tarence explicitly asks for chat between agents.

## Critical commands

```bash
# Verification gates — all must be green before "done"
npm run check                # smoke + function audit + JS syntax + SOVEREIGN theme contract
npm run smoke                # link smoke + route smoke (desktop/mobile)
npm run smoke:links          # link smoke only
npm run audit:playwright     # desktop + mobile, no overflow, console clean
npm run audit:lighthouse     # performance score
npm run audit:functions      # full-site function audit
npm run verify:live          # production parity (FAILS until deploy)
npm run verify:tools-md      # everyday-tools.html source verification

# Generation
npm run seo                  # regenerate SEO landing pages + sitemap
npm run listings             # regenerate sample-listings.json

# Sophia helper
npm run sophia <subcommand>  # see scripts/sophia-cli.cjs
npm run memory               # vault memory ops

# Vault hygiene (in vault repo)
"/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/scripts/vault.sh" now
"/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/scripts/vault.sh" all
```

## Repo state

- Framework: vanilla HTML/CSS/JS (no React/Next at the top level — kept simple for SEO and page speed)
- Build: Vercel auto-deploy (currently broken — needs manual `vercel --prod` until re-linked)
- Hosting: Vercel
- Backend: Supabase (auth + future profiles), Stripe (gated)
- Preview: `python3 -m http.server 4173` from repo root, or auto via `sophiatv-watcher.sh`
- 137 HTML files (homepage + market + 105 country pages + blog + emails + app + admin + control-center)
- Latest committed: `cb330ae feat(globe): add NASA Blue Marble land-mass texture over ocean base`
- Massive uncommitted SOVEREIGN polish work waiting on deploy approval

## Engineering standards

**Use:** TypeScript when available, clean folder structure, reusable components, validation on inputs, secure auth/payment/admin logic, responsive UI, accessibility, SEO metadata, loading/error/empty states, real tests where possible, restrained typography, real assets, purposeful motion.

**Avoid:** fake APIs, broken buttons, hardcoded secrets, giant files, random dependencies, overwriting working code, hallucinated packages, AI slop (generic blobs, fake live metrics, purple-on-black, emoji UI), copying proprietary code/assets/text.

## Subagent system (built-in roles, use when scope justifies)

1. **Architect** — system design, folder structure, app architecture
2. **Frontend** — UI, UX, responsive, animations, accessibility
3. **Backend** — APIs, database, auth, payments, webhooks
4. **Debugger** — runtime errors, build errors, import errors, logic bugs
5. **Refactor** — clean code without changing behavior
6. **Test** — unit, integration, e2e, smoke, regression
7. **Security** — permissions, secrets, injection, auth, payments, admin routes
8. **Performance** — speed, bundle size, caching, database
9. **DevOps** — deployment, CI/CD, Docker, Vercel, env vars
10. **Product** — business logic, conversion, usability, feature usefulness

## Project-scoped Codex skills

This repo ships skills under `.agents/skills/` (Codex auto-discovers them):

- `.agents/skills/sophia-deploy-verify/` — full pre-deploy verification suite (check + playwright + verify:live)
- `.agents/skills/sophia-page-polish/` — SOVEREIGN page polish workflow with Squint Test + Mansa Musa Squint Test
- `.agents/skills/sophia-vault-sync/` — write/read coordination via vault agent-sync
- `.agents/skills/sophia-anti-slop/` — banned-superlatives grep + emoji UI check + cartoon-branding check

Invoke explicitly: `$sophia-deploy-verify`, `$sophia-page-polish`, etc.

## Subagent definitions (existing)

- `.codex/agents/ui-fixer.toml` — smallest safe patch for reproduced UI defects
- `.codex/agents/frontend-developer.toml` — frontend implementation
- `.codex/agents/qa-expert.toml` — smoke, regression, browser, edge-case verification
- `.codex/agents/code-reviewer.toml` — maintainability + risk
- `.codex/agents/performance-engineer.toml` — speed, bundle, rendering, caching
- `.codex/agents/product-manager.toml` — launch priority, business logic
- `.codex/agents/seo-specialist.toml` — country pages, sitemap, metadata
- `.codex/agents/accessibility-tester.toml` — keyboard, contrast, labels, responsive
- `.codex/agents/browser-debugger.toml` — reproduced browser/runtime defects
- `.codex/agents/error-coordinator.toml` — repeated failure coordination
- `.codex/agents/workflow-orchestrator.toml` — multi-agent sequencing

## Claude Code project pack

Claude Code project-local config lives under `.claude/`:

- `.claude/settings.json` — conservative verification allows, deny rules for secrets/destructive commands/deploys/unknown installs, and a startup hook.
- `.claude/commands/` — `start-sophia`, `god-mode-website-build`, `page-polish`, `launch-audit`, `ship-quality`, `research-best`, `sophia-handoff`, `sovereign-copy-review`, `prompt-codex`, `update-memory`, `claude-config-polish`.
- `.claude/agents/` — Sophia visual, copy, accessibility, code, frontend-builder, design-director, repo-hunter, business-strategist, and QA verifier agents.
- `.claude/memory/` — project brain, design system, research log, business ideas, lessons learned, and prompt library.
- `.claude/prompts/` — copy-paste handoff/build/audit/report prompts for Codex and Claude.
- `.claude/hooks/session-start.sh` — injects the official Sophia Claude Code guide, vault path, gates, and verification commands at startup/resume.

Do not loosen permissions, add MCP servers, install plugins, enable paid tools, or add deploy/account authority without Tarence approval.

## Reusable prompt library

```text
~/outputs/sophiatv/prompts/README.md
```

Subfolders: `apps/`, `business/`, `handoffs/`, `images/`, `models/`, `verification/`, `website/`. Use these instead of rewriting instructions from scratch.

## Reference repos (cloned for inspection only — do NOT install blind)

- `references/github-agent-repos/skills` — official OpenAI Codex skills format
- `references/github-agent-repos/awesome-codex-subagents` — subagent role design
- `references/github-agent-repos/awesome-agent-skills` — agent skills patterns
- `references/clone-wars` — UI/UX patterns
- `references/awesome-saas-boilerplates` — starter-kit comparison
- `references/best-nextjs-saas-boilerplates` — Next.js SaaS patterns

License/security/fit review required before importing or copying anything.

## Currently-deferred / approved-paid tools

Backlog: `references/paid-tools/README.md`. Mirrored: `Sophia Brain/03 - Sophia OS/paid-tools/README.md`. Includes decision packets with: job, cheapest useful tier, expected 7-day result, setup steps, cancellation path, approval gate.

## Open blockers (need Tarence's hand)

1. **P0 — Approve deploy.** Local SOVEREIGN polish (homepage + 12 surfaces + 105 country pages) is uncommitted; production at `sophiatv.vercel.app` is stale.
2. Squarespace DNS for `sophiaoperator.com` (A `@` → 76.76.21.21, CNAME `www` → cname.vercel-dns.com)
3. Real `ANTHROPIC_API_KEY` in Vercel env (current is placeholder; `/api/chat` returns 401)
4. Real `STRIPE_WEBHOOK_SECRET` in Vercel env
5. Real GA4 tag (placeholder safely guarded by `window.__GA_ID__`)
6. Supabase `profiles` table in dashboard
7. Re-link Vercel ↔ GitHub for auto-deploy
8. (Optional) Obsidian Local REST API key — activates Obsidian MCP for direct vault edits

## Task execution format

**Before coding:**
```
### Repo Read
- framework:
- package manager:
- main files:
- scripts:
- risks:

### Plan
1.
2.
3.
```

**After coding:**
```
### Completed
- ...

### Files Changed
- ...

### Commands Run
- ...

### Test/Build Results
- ...

### Risks
- ...

### Next Best Step
- ...
```

## See also

- `~/outputs/sophiatv/CODEX.md` — detailed Codex engineering stack reference (subagent roles, recommended core stack, ChatGPT escalation lane, tool trial discipline)
- `~/outputs/sophiatv/SOPHIA_ENGINEERING_OS.md` — full engineering OS rules
- `~/outputs/sophiatv/CLAUDE.md` — Claude-specific working rules for this repo
- `~/outputs/sophiatv/CURSOR_AGENT_PROMPT.md` — Cursor-specific rules
