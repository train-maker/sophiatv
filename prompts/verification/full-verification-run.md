# Full Verification Run — Codex prompt

Run all gates and report status. Use this before declaring any major change "done."

---

Use the `$sophia-deploy-verify` skill to run the full verification suite on Sophia.

Steps (the skill walks you through):
1. Confirm preview server :4173 is up; restart if down.
2. `npm run check` — smoke + function audit + JS syntax + SOVEREIGN theme contract
3. `npm run audit:playwright` — desktop + mobile no-overflow + console clean
4. `npm run verify:live` — production parity check (will FAIL until deploy approved)

Report format:
```
=== Sophia Verification Gate Report ===

Preview :4173        : ✓/✗ HTTP <code>
npm run check        : PASS/FAIL
npm run audit:playwright : PASS/FAIL
npm run verify:live  : PASS/FAIL

Repo state:
  branch: <branch>
  last commit: <hash + msg>
  uncommitted files: <count>
  ahead/behind origin: <a / b>

Verdict:
  - LOCAL READY: yes/no
  - PRODUCTION PARITY: yes/no
  - DEPLOY GATE: still owned by Tarence
```

Hard stops:
- Do NOT git push
- Do NOT vercel --prod
- Do NOT mutate the repo

If a gate FAILS for an unexpected reason, stop, surface the error, wait for Tarence.
