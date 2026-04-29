# Sophia Engineering OS

This is the shared operating system for Codex, Claude, Cursor, and local agents working on Sophia.

Agent workflow source of truth:

```text
/Users/tarencea.rainey/.codex/skills/sophia-agent-ops/SKILL.md
```

Use that skill when applying lessons from AI workflow videos, coordinating Codex/Claude/Cursor/Ollama, evaluating OpenCode/RuFlo/DeepSeek-style tooling, or deciding what to delegate.

Official Claude Code source library:

```text
/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/library/CLAUDE-CODE-COMPLETE-GUIDE-FOR-SOPHIA-2026-04-29.md
/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/library/claude-code-official-docs-2026-04-29/
```

Use this before changing Claude Code prompts, settings, permissions, hooks, slash commands, skills, subagents, or code-review behavior. Codex remains final verifier; Claude gets bounded work and returns objective, files, verification, blockers, next action, and approval needs.

Forward-motion source of truth:

```text
/Users/tarencea.rainey/.codex/skills/sophia-forward-motion/SKILL.md
```

Use that skill when deciding whether to create skills, plugins, files, scripts, assets, workflows, or durable docs. Tarence explicitly allows forward-moving creation so Sophia does not keep going backwards.

Premium visual polish source of truth:

```text
/Users/tarencea.rainey/.codex/skills/luxury-futurist-web-design/SKILL.md
```

Use that skill when Sophia needs to feel luxury, futuristic, high-end, cinematic, or launch-grade. It converts the DesignRush luxury website design study into original principles only: real hero assets, restraint, typography, purposeful motion, clear conversion, and no copied layouts or assets.

## Product Taste

Sophia should feel like wisdom from the future, not generic AI decoration.

Builder bio: Build like a premium AI coder whose job is to turn a modest codebase into a website that feels worth millions: beautiful because it is restrained, clear, and confidently assembled. Start from strong hero imagery, clean spacing, elegant typography, real visual identity, and purposeful motion instead of noisy AI decoration.

- Use real materials when possible: real Earth imagery, real 3D, real product UI, real working flows.
- Prefer clean futuristic glass, depth, motion, and symbolic meaning over noisy neon clutter.
- The approved Sophia identity starts with `/Users/tarencea.rainey/outputs/sophiatv/assets/brand/sophia-logo-premium.png`.
- Do not bring back cartoon/play-button-style Sophia branding. Every new visual layer should feel at least as elegant as that mark.
- Avoid biblical, church, or sermon language. Sophia means human spark: curiosity, judgment, memory, and the drive to build.
- Sophia's mission is to bring the world together as one: lower language barriers, widen access to markets, and help regular people communicate and build across borders.
- Keep that mission constructive. Avoid partisan, conspiratorial, or rage-driven copy.
- Do not ship fake claims, fake users, fake live activity, or decorative features that do not help the product.

## Work Loop

1. Clarify the outcome in one sentence.
2. Inspect the current files and running UI before changing code.
3. Make a small plan with the exact files likely to change.
4. Implement in scoped edits.
5. Verify with commands and browser checks.
6. Record blockers, production needs, and next action.

## Token Rotation

For long sessions, rotate work before context gets crowded.

- Codex owns implementation and final verification.
- Claude handles bounded review, copy, docs, audits, or isolated feature work.
- Cursor handles repo-local coding help when specifically opened for this repo.
- Ollama/free models handle cheap critique and idea ranking on non-sensitive material.
- Every handoff must include current objective, files changed, commands run, blockers, exact next action, and approval gates.
- Do not use rotation to bypass owner approval for secrets, billing, account permissions, publishing, or destructive actions.

## Engineering Rules

- Do not revert another agent or the user's changes.
- Create durable skills, plugins, files, scripts, assets, or docs when they preserve the current direction or prevent repeated mistakes.
- Keep changes scoped to the requested user flow.
- Prefer existing static HTML/CSS/JS patterns unless a stronger architecture is needed.
- Use proven libraries for hard visual/interactive work. Use Three.js for real 3D.
- Do not rely on pretend visuals when a real asset, texture, dataset, or browser behavior is available.
- Preserve mobile quality. No overlapping text, no horizontal scrolling, no hidden primary actions.

## Subagent Rules

Use subagents only for independent work that can run without blocking the immediate next step.

Good subagent jobs:
- Review a page for visual bugs.
- Check copy consistency.
- Build a separate utility app prototype.
- Audit links/assets.

Bad subagent jobs:
- Tasks requiring secrets, payments, account actions, or live publishing.
- Work that edits the same file as another active agent.

## Free Model Rules

Use local/free models as support staff, not as the source of truth.

Good free-model jobs:

- app idea critique,
- copy polish,
- test case generation,
- public-doc summarization,
- visual screenshot critique,
- non-sensitive prototype review.

Bad free-model jobs:

- secrets,
- billing or paid provider setup,
- account permissions,
- publishing,
- medical/legal claims without expert review,
- anything behind login or questionable scraping.

Before adding a new free-model workflow, verify the official source, inspect install scripts, run a small benchmark, and record what the model is actually good at.

## Paid Tools Backlog

Free/local tools come first until Tarence says cash is available.

Paid-tool planning lives here:

```text
/Users/tarencea.rainey/outputs/sophiatv/references/paid-tools/README.md
/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/paid-tools/README.md
```

Do not buy, subscribe, spend credits, upgrade hosting, connect paid APIs, configure paid analytics/ads, or change account billing without explicit approval. If a paid tool could make Sophia spectacular, add it to the backlog with a decision packet instead of acting on it.

## Verification

Before claiming Sophia work is complete, run:

```bash
npm run check
```

For broad website/app work, also run:

```bash
npm run audit:playwright
```

The Playwright audit should cover:
- Main pages load without console errors.
- Homepage 3D globe visibly rotates.
- Translator produces output or a useful configured-status message.
- AI chat panel opens.
- PWA app search, detail modal, saved items, and manifest work.

## Production Gates

Stop for Tarence approval before:

- Secrets or API keys.
- Billing or paid plans.
- Account permissions.
- App Store / Play Store publishing.
- Public production deploys.
- Destructive actions.

Affiliate marketing gates:

- affiliate account creation,
- tax or payment details,
- tracking pixels,
- paid ads,
- direct outreach,
- public affiliate publishing under Tarence's identity,
- medical, legal, or financial claims.

Affiliate pages must have clear disclosures near recommendations, original helpful value, and sponsored/nofollow link attributes where appropriate.

For utility-site businesses, use `/Users/tarencea.rainey/outputs/sophiatv/workflows/UTILITY_SITE_FACTORY.md`. Build original tools that solve one practical task quickly; do not clone another site's brand, content, layout, or proprietary data.

For GitHub repo recommendations from videos or social posts, use the Sophia Agent Ops repo-scouting rule. Verify the official repo, maintainer, license, activity, README, and scripts before cloning or installing. Copy principles into Sophia workflows when that is safer than adding dependencies.

For advanced generated visuals, use `/Users/tarencea.rainey/.codex/skills/sophia-agent-ops/references/gpt-image-2-design-workflow.md`. GPT Image 2 / ChatGPT Images 2.0 quality is the default bar for new generated Sophia image assets. Use image models for real design assets with accurate text, multilingual variants, photoreal materials, and exact composition. Keep API keys, paid credits, account permissions, and third-party uploads behind approval. Inspect every generated word, light source, reflection, shadow, and object relationship before shipping.

Preview deployments are allowed when Tarence says to deploy or says "go" in a deployment context.

## Design Bar

The default bar is not "works." The bar is "designed."

Every public-facing Sophia screen should answer:

- What is the real object or workflow here?
- Does the visual style support Sophia as future wisdom?
- Does it help people connect across language, geography, or opportunity gaps?
- Is there one clear primary action?
- Did Playwright verify it on desktop and mobile?
- Does it avoid fake AI fluff?
