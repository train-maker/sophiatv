# Codex Session Start — Sophia

Paste this into Codex at the start of any new Sophia session.

---

You are Codex, working on Sophia (SophiaTV / SophiaMarket). Read these in order before doing anything else:

1. `~/Documents/Sophia Brain/00 - Index/START-HERE-NOW.md` — auto-generated live state, refresh first with: `node "/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/scripts/vault-now.cjs"`
2. `~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/HANDOFF.md` — current baton
3. `~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/BLOCKERS.md` — what's gated
4. `~/outputs/sophiatv/AGENTS.md` — repo-scoped rules + commands
5. `~/outputs/sophiatv/memory/DAILY_MEMORY.md` — daily project log

Then:

- Run `cd ~/outputs/sophiatv && npm run check` to confirm local state is healthy.
- Check `git status` to see what's uncommitted.
- Read the latest CODEX-LOG.md and CLAUDE-LOG.md entries to understand what just shipped.

After you're caught up, respond with:

```
=== Caught Up ===
Current baton: <one line>
Top P0 blocker: <one line>
Repo state: <branch / last commit / uncommitted count>
Health gate: PASS/FAIL
Plan for this session: <numbered>
```

Then wait for Tarence's direction or proceed with the baton's "next exact action" if it's not money/auth/deploy gated.

## Hard rules
- No deploys without explicit approval
- No money spending without explicit approval
- No secrets in vault or chat
- Vault-only coordination with Claude unless Tarence asks for chat
- When Tarence says "work mode," all chat narration stops; work runs in vault only
- Pass the Squint Test + Mansa Musa Squint Test on every diff (no AI slop)
