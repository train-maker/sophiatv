# Tool Trial Log

## Helpful For Sophia Website Work

- `rg`: fastest way to locate stale copy, duplicate headings, CSS overrides, and route references.
- Playwright through local scripts: best current proof for browser behavior, desktop/mobile screenshots, console errors, route health, and first-viewport checks.
- `npm run check`: best broad local gate because it runs link smoke, route smoke, full-site function audit, and JavaScript syntax checks.
- `npm run audit:playwright`: best focused browser gate before calling website work done.
- Cloned reference catalogs in `references/`: useful for architecture and stack research only; not useful as direct code dependencies.
- `skills/ultimate-builder`: useful as a durable operating checklist for future social marketplace builds.

## Not Useful For This Pass

- Plugins: explicitly excluded for this pass. No plugin install or plugin workflow should drive the Sophia website work.
- Blind starter cloning: not useful until a base is approved. It risks overwriting the existing Sophia site and importing license/security problems.
- Passing automated checks alone: not enough. Screenshots still exposed product and copy problems that smoke tests did not treat as failures.

## Trial Rule

Try tools in low-risk mode first. Keep tools that produce evidence, smaller patches, or better decisions. Put down tools that add complexity, require accounts, install dependencies, touch payments/auth/security, or do not improve the visible site.
