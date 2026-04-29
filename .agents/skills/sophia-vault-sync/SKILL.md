---
name: sophia-vault-sync
description: Coordinate with Claude (Cowork + Claude Code) and Cursor via the Obsidian vault at ~/Documents/Sophia Brain. Triggers on "sync to vault", "post handoff", "update baton", "log this to vault", "tell Claude". Writes to agent-sync/HANDOFF.md, BLOCKERS.md, CODEX-LOG.md, BRIDGE-INBOX.md. Vault-only by default per the 2026-04-28 hard rule.
---

# Vault Sync — Codex ↔ Claude ↔ Cursor coordination

Default communication between agents is vault-only unless Tarence explicitly asks for chat. This skill packages the right write pattern for each kind of update.

## File map

```text
~/Documents/Sophia Brain/03 - Sophia OS/agent-sync/
  HANDOFF.md             ← current baton (objective, owner, next exact action)
  BLOCKERS.md            ← active blockers with owners + unblock commands
  DECISIONS.md           ← durable rules locked with date
  CODEX-LOG.md           ← Codex's work journal (newest entry at top)
  CLAUDE-LOG.md          ← Claude's work journal
  CURSOR-LOG.md          ← Cursor's work journal
  BRIDGE-INBOX.md        ← short pings; long specs go in named files
  REQUEST-TO-CLAUDE-*.md ← bounded asks
  RESPONSE-FROM-*-*.md   ← paired responses
  SESSION-START.md       ← read order for new sessions
  SESSION-END.md         ← write order at end of session
```

## When to write what

| Update type | File | Format |
|-------------|------|--------|
| Finished a meaningful task | `CODEX-LOG.md` (top entry) | objective / changed / did NOT change / verified / next |
| Baton state change | `HANDOFF.md` (Current Baton section) | edit "next exact action" line |
| New blocker | `BLOCKERS.md` (Active section) | bullet + owner + unblock command |
| Resolved blocker | `BLOCKERS.md` | move to "Recently cleared" + add ✅ |
| New durable rule | `DECISIONS.md` | dated heading + rule + reason |
| Quick ping to Claude | `BRIDGE-INBOX.md` | one line: `STATUS — owner — artifact — verify — next` |
| Bounded request | `REQUEST-TO-CLAUDE-<TOPIC>-<DATE>.md` | new file with priority + ask + context |

## Compact handoff format (locked 2026-04-28)

```text
STATUS — owner — artifact — verify — next
```

One line. Long specs go in named vault files. Save tokens.

## Write rules

1. **Newest entry at the TOP** of every log file (CODEX-LOG, CLAUDE-LOG, CURSOR-LOG).
2. **Date every change** in `YYYY-MM-DD` format.
3. **Frontmatter** for new note files: `tags`, `priority` (P0/P1/P2), `date`, `owner`.
4. **Cite specific files/paths** rather than vague descriptions.
5. **List "did NOT change" too** so other agents know what's still open.

## Refresh state file

After meaningful changes, regenerate `START-HERE-NOW.md` so the next agent sees current state:
```bash
node "/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/scripts/vault-now.cjs"
```

Or run the full hygiene + state refresh:
```bash
"/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/scripts/vault.sh" apply
```

## Hygiene cadence

- Every 10 idle minutes during active work: `ls -lt agent-sync/ | head -20` to see what other agents shipped
- Every commit: `vault.sh now`
- Weekly: `vault.sh all`
- Before any risky operation: `vault.sh backup`

## Hard rule: NO secrets in vault

Never write API keys, passwords, tokens, account credentials, or PII to any vault file. Secrets live in `.env`, OS keychain, or platform env vars.

## See also

- `Sophia Brain/03 - Sophia OS/agent-sync/SESSION-START.md` — read order for any agent
- `Sophia Brain/03 - Sophia OS/agent-sync/COMPACT-BRIDGE-HANDOFF-RULE-2026-04-28.md` — handoff format
- `Sophia Brain/03 - Sophia OS/agent-sync/WORK-MODE-VAULT-ONLY-RULE-2026-04-28.md` — work-mode rule
