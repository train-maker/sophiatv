---
name: sophia-operator
description: Use this for SophiaTV/SophiaMarket website work, especially futuristic UI upgrades, control-center work, translation/social/market/session features, launch readiness, smoke testing, troubleshooting, and assistant handoff.
---

# Sophia Operator

## Mission

Make SophiaTV feel like a new-age technology platform while keeping every core flow functional, testable, and ready for deployment.

The product pillars are:

- SophiaTV: live media, creator sessions, and premium platform experience.
- SophiaMarket: global business directory and listings.
- Sophia Social: X-style signal feed and social layer.
- Universal Translator: speech input, text translation, captions, and text-to-speech.
- AI Mission Control: operator status, visible AI fleet, assistant handoff, work lanes, production readiness, and launch checklist.

## Required Operating Format

For every Sophia task, work in this order:

1. Objective: state the business result.
2. User flow: name affected pages and interactions.
3. Implementation: list files changed and behavior added.
4. Verification: run desktop/mobile/browser/smoke checks as appropriate.
5. Production needs: call out API keys, backend services, paid confirmations, or account actions.

## Capability Upgrade Rule

Always consider whether a skill, plugin, local script, official CLI, or project-local helper would make the work cheaper, faster, more reliable, or easier to verify.

Preference order:

1. Existing project-local scripts and docs.
2. Already-installed skills/plugins.
3. Official curated skills/plugins.
4. Well-known open-source tools with clear provenance.

Ask before installing/cloning unknown code, paid tools, account-connected tools, tools that request secrets, or anything that could affect billing, permissions, or sensitive data.

## Local Commands

From the SophiaTV repo root:

```bash
python3 -m http.server 4173
npm run smoke
node --check future.js
node --check translator.js
node --check config.js
node --check app/sw.js
node --check scripts/smoke-test.cjs
```

Open local preview:

```text
http://127.0.0.1:4173/
```

Important routes:

- Home: `/`
- Universal Translator: `/#translate`
- Sophia Social: `/social.html`
- SophiaMarket: `/market.html`
- AI Mission Control: `/control-center.html`
- Private Session Preview: `/session.html?room=sophia-demo`
- Sophia Connect App: `/app/`
- Blog: `/blog/`
- Settings: `/settings.html`
- Listing Guidelines: `/listing-guidelines.html`

## Verification Standard

Before calling work complete:

- `npm run smoke` passes.
- Changed JavaScript files pass `node --check`.
- Main changed page loads locally with HTTP 200.
- Browser console has no new errors.
- No horizontal overflow on desktop or mobile when layout changed.
- Primary button/form interaction works.
- Camera, microphone, payment, account, upload, or external submission actions are not triggered without explicit user confirmation.

## Frontend Standards

- Match the existing futuristic Sophia layer in `future.css` and `future.js`.
- Use neon/chrome/high-tech styling without making text unreadable.
- Keep controls usable on mobile.
- Preserve reduced-motion support.
- Do not hide real blockers behind flashy UI.
- Prefer explicit `.html` links when local Python preview needs them.
- Do not make camera/microphone start automatically; keep them behind user action.
- Prefer Sophia toast feedback over browser `alert()` popups.
- Prefer lightweight project-native motion first. Heavy animation dependencies such as GSAP or Three.js should only be added when they clearly improve the experience and pass performance/reduced-motion checks.

## Production Readiness Rules

- `ANTHROPIC_API_KEY` belongs in Vercel environment variables. It powers `/api/chat.js` and `/api/translate.js`.
- Supabase public anon key goes in `config.js`. Never place a service-role key in browser code.
- Stripe secrets/webhook secrets belong only in Vercel environment variables.
- Control/private/session/API routes should not be indexed.
- Run `node scripts/generate-sitemap.cjs` after changing public SEO routes.

## Troubleshooting

- Broken local route: use explicit `.html` links or add the missing file.
- Smoke test false positive: dynamic template placeholders like `${value}` should be ignored by the smoke test, not treated as real static links.
- PWA install/offline bug: check `app/manifest.webmanifest` and `app/sw.js`; every cached asset must exist.
- Translator does not call API locally: expected on static preview; `translator.js` uses local fallback for port 4173.
- Deployed translator fails: confirm `ANTHROPIC_API_KEY` exists in Vercel and endpoint `/api/translate.js` returns JSON.
- Production readiness unclear: check `/api/health` after deployment.
- Login/signup says not connected: add the public Supabase anon key in `config.js`.
- Dashboard redirects to login: expected without Supabase session.
- Session page requests camera immediately: bug. It must show pre-join first.
- Stripe webhook has production scaffolding, but it needs Supabase service credentials, profile-table compatibility, and Stripe price-to-tier env vars before live tier updates can be trusted.

## Handoff Template

Use this exact shape when updating another assistant or the user:

```text
Objective:
User flow:
Implementation:
Verification:
Production needs:
Files changed:
```

Keep it direct and concrete. Mention any paid, account, key, deployment, or privacy action that still needs user confirmation.
