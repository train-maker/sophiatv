# Page Polish

Polish a Sophia page to SOVEREIGN quality.

Input expected:

```text
Page:
Goal:
Known issue:
```

Workflow:

1. Read the full page and related CSS/JS.
2. Preserve forms, handlers, data attributes, required audit strings, and route behavior.
3. Remove slop: fake live, emojis, purple/neon, generic claims, weak CTAs, cartoon remnants.
4. Add or reuse `assets/css/sovereign.css` where appropriate.
5. Improve hierarchy, spacing, mobile fit, and primary action.
6. Run targeted checks, then broader checks if the page is user-facing.

Verification:

```bash
npm run check
npm run audit:playwright
```

Return changed files and screenshots/browser evidence if created.
