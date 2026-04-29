# Sophia Claude Code God Mode Pack

This is Sophia's project-local Claude Code setup for elite coding and website-building work.

It is intentionally powerful but gated:

- build and review locally,
- use official docs and repo scripts,
- keep context clean,
- write durable handoffs,
- verify with browser evidence,
- never touch secrets, billing, account permissions, production deploys, publishing, destructive commands, or unknown installs without Tarence approval.

## Start

In Claude Code, run:

```text
/start-sophia
```

For high-output website work, run:

```text
/god-mode-website-build <page or objective>
```

Before claiming done, run:

```text
/ship-quality
```

## Main Pieces

- `settings.json` — conservative permissions and startup hook.
- `hooks/session-start.sh` — injects first-read paths and gates.
- `commands/` — reusable prompts for launch audit, page polish, handoffs, research, ship-quality, and Claude config.
- `agents/` — specialist Claude subagents for visual review, copy, a11y, code review, design, repo research, frontend implementation, business strategy, and QA.
- `memory/` — persistent Claude project memory.
- `prompts/` — copy-paste task prompts for Codex-to-Claude handoffs and Claude internal runs.

## Verification

Core local verification:

```bash
npm run check
npm run audit:playwright
```

Production parity is read-only and may fail when production is stale:

```bash
npm run verify:live
```

No deploy is authorized by this pack.
