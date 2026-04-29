---
name: sophia-deploy-verify
description: Run the full Sophia pre-deploy verification suite. Triggers on "verify Sophia", "check before deploy", "run all gates", "is it ready to ship". Runs npm run check, npm run audit:playwright, npm run verify:live in sequence and reports gate-by-gate pass/fail. Does NOT deploy — verification only.
---

# Sophia Pre-Deploy Verification

Run all verification gates in sequence and report status. **Never deploys** — that's owned by Tarence's explicit approval.

## Steps

1. Confirm working directory is `~/outputs/sophiatv`. Refuse if not.

2. Confirm preview server is running on `:4173`:
   ```bash
   curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:4173/
   ```
   If 000 (down), restart: `cd ~/outputs/sophiatv && nohup python3 -m http.server 4173 >/tmp/sophia-preview.log 2>&1 &`

3. Run launch-health gate:
   ```bash
   npm run check
   ```
   Must pass: smoke (137 HTML, ~2300 targets), JS syntax, SOVEREIGN theme contract, function audit.

4. Run Playwright audit:
   ```bash
   npm run audit:playwright
   ```
   Must pass desktop + mobile: no horizontal overflow, no console errors, no page errors, all required assets load.

5. Run production parity check:
   ```bash
   npm run verify:live
   ```
   This will FAIL if any uncommitted local changes haven't been deployed. The FAIL is informational — do not panic. Report the exact missing/banned strings.

## Report format

```
=== Sophia Verification Gate Report ===

Preview :4173        : [✓ / ✗] HTTP <code>
npm run check        : [PASS / FAIL] (smoke X HTML, Y targets, theme contract, JS syntax)
npm run audit:playwright : [PASS / FAIL] (desktop + mobile, overflow=0, console clean)
npm run verify:live  : [PASS / FAIL]
  Missing on prod : <list>
  Banned on prod  : <list>

Repo state:
  branch: <branch>
  last commit: <hash + msg>
  uncommitted files: <count>
  ahead/behind origin: <a / b>

Verdict:
  - LOCAL READY: yes/no
  - PRODUCTION PARITY: yes/no
  - DEPLOY GATE: <still owned by Tarence>
```

## Hard stops

- Do NOT run `git push` or `vercel --prod` — those need Tarence's explicit approval.
- Do NOT mutate the repo. Verification only.
- If a gate FAILS for an unexpected reason (not "production stale"), stop, surface the error, and wait.

## Fix-then-reverify loop

If `npm run check` or `npm run audit:playwright` fails:
1. Read the failing test output carefully.
2. Identify the smallest reversible patch.
3. Apply.
4. Re-run the failing gate only (not the full suite — saves time).
5. When green, run the full suite once to confirm.
6. Report.

## See also

- Verification gates documented in: `~/outputs/sophiatv/AGENTS.md`
- Deploy approval workflow: `Sophia Brain/03 - Sophia OS/agent-sync/HANDOFF.md`
- Latest baton: vault `START-HERE-NOW.md`
