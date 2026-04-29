# End-of-Session — Codex prompt

Use at the end of any meaningful Codex session on Sophia.

---

Wrap this session by:

1. **Append to CODEX-LOG.md** at top:
   ```
   ## YYYY-MM-DD — Codex (one-line summary)
   - objective:
   - changed:
     - file: path → what changed
   - did NOT change:
   - verified:
     - npm run check: PASS/FAIL
     - npm run audit:playwright: PASS/FAIL
   - blockers raised: <list with owners>
   - next:
   ```

2. **Update HANDOFF.md** Current Baton if state changed:
   - "next exact action" line
   - "owner" line if it shifted

3. **Update BLOCKERS.md** — move resolved blockers to "Recently cleared", add new ones to "Active" with owner + unblock command.

4. **Refresh state files:**
   ```bash
   node "/Users/tarencea.rainey/Documents/Sophia Brain/03 - Sophia OS/scripts/vault-now.cjs"
   ```
   (or `vault.sh apply` for full hygiene + index + state refresh)

5. **Append to `~/outputs/sophiatv/memory/DAILY_MEMORY.md`** — one or two lines describing what shipped, what was verified, and what's still gated.

6. **If concrete code changes were made and Tarence approved committing:**
   ```bash
   cd ~/outputs/sophiatv && git status && git diff --stat
   ```
   Show the diff. Wait for explicit "commit" / "push" approval. Do NOT commit unilaterally.

7. **Drop a one-line bridge ping** to BRIDGE-INBOX.md in compact format:
   ```
   STATUS — codex — <artifact paths> — <verify result> — <next action>
   ```

Final response format:
```
=== Session Wrap ===
Shipped: <count> files, <count> verifications
Blockers: <count> active, <count> cleared this session
Vault updated: HANDOFF / BLOCKERS / CODEX-LOG / DAILY_MEMORY / START-HERE-NOW
Next session pickup: <path to baton or specific action>
```
