# Sophia Prompt Library

Purpose: reusable prompts that produce high-quality, forward-moving Sophia work without re-explaining the project every session.

## Rules

- Use free/local tools first.
- Do not request secrets, billing, paid credits, account changes, deployment, publishing, outreach, or private data unless Tarence explicitly approves that exact action.
- Sophia visual standard: premium, elegant, real, restrained, global, useful; no cartoon/play-button branding.
- Codex owns final judgment and verification.
- Every prompt should produce one of: patch plan, critique, build action, approval gate, or concise decision packet.

## Folder Map

| Folder | Use |
| --- | --- |
| `website` | Sophia website/app polish, page audits, copy, elegance |
| `business` | money paths, app ideas, market wedges, monetization |
| `apps` | Simple App Factory specs and offline-first prototypes |
| `models` | Claude/Cursor/Ollama/OpenRouter worker prompts |
| `verification` | launch checks, smoke tests, risk review |
| `images` | premium image generation prompts and asset QA |
| `handoffs` | compact session handoffs for new devices/agents |

## Best Prompt Shape

```text
Role:
Context:
Goal:
Files/pages:
Constraints:
Output format:
Stop/approval gates:
```

## Codex-optimized prompts (added 2026-04-29)

These pair with the project-scoped skills at `~/outputs/sophiatv/.agents/skills/`:

| Prompt | Skill it invokes | When to use |
|--------|------------------|-------------|
| `handoffs/codex-session-start.md` | (session bootstrap) | Start of any Codex session on Sophia |
| `handoffs/end-of-session.md` | `$sophia-vault-sync` | Wrap up — log to vault, refresh state |
| `website/sovereign-page-polish.md` | `$sophia-page-polish` | Polish a single page to SOVEREIGN bar |
| `website/anti-slop-check.md` | `$sophia-anti-slop` | Squint Test + Mansa Musa Squint before merge |
| `verification/full-verification-run.md` | `$sophia-deploy-verify` | All gates before declaring done |

The skills do the work; the prompts are the paste-ready turn-starters.

