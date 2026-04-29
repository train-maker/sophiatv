# Ship Quality

Use before Claude says work is complete.

## Checks

Run what applies:

```bash
npm run check
npm run audit:playwright
npm run smoke:links
npm run smoke:routes
```

For production parity only:

```bash
npm run verify:live
```

`verify:live` may fail because production is stale. Report that clearly; do not deploy.

## Manual Review

Confirm:

- no AI slop,
- no cartoon branding,
- no fake live metrics,
- no broken primary CTA,
- no mobile overflow,
- no console/page errors if browser checked,
- no secrets exposed,
- docs/memory updated if behavior changed.

Return:

```text
Quality gate:
Commands run:
Browser evidence:
Remaining risk:
Done/not done:
Approval needed:
```
