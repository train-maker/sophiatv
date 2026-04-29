# SophiaTV Business Handoff

## Mission

SophiaTV is a futuristic media, marketplace, social, and translation platform. The current goal is to make the site feel like a new-age technology product while keeping core user flows functional on desktop and mobile.

## Current Product Pillars

- SophiaTV: live sessions, creator/media experience, and premium platform positioning.
- SophiaMarket: global business marketplace and listings.
- Sophia Social: X-style signal feed for posts, trends, likes, reposts, bookmarks, and local saved posts.
- Universal Translator: speech-to-text input, text translation, and text-to-speech output so English, French, Russian, and other language users can communicate.

## Operating Format

Primary coordination happens in Paperclip:

```text
http://127.0.0.1:3100/
```

Use Paperclip as the main meeting room for assigning work, checking agent status, and reviewing AI company activity. Use the Sophia app preview for product testing and customer-facing pages. Keep paid agents paused unless Tarence explicitly approves a paid run, API key use, billing action, or account permission change.

Persistent project memory lives at:

```text
memory/DAILY_MEMORY.md
```

Read it before major work. Append durable updates with:

```bash
npm run memory -- add "short memory note"
```

The local Office Watcher mirrors Paperclip Office Chat comments into `memory/PAPERCLIP_OFFICE_INBOX.md`:

```bash
npm run office-watch
```

The Desktop Paperclip launcher starts it when needed.

Use this format for Cursor, Claude, and Codex work:

1. Objective: state the business outcome first.
2. User flow: list the exact pages and interactions affected.
3. Implementation: name the files changed and the behavior added.
4. Verification: test desktop, mobile, console errors, and horizontal overflow.
5. Production needs: call out required API keys, services, or backend setup.

Also check whether a trusted skill, plugin, local script, or official tool would reduce token usage, speed up verification, improve memory/context reuse, or make the assistant more expert for the task. Install or clone only after the user confirms the specific tool/source when confirmation is required.

## Local Preview

Static preview currently runs at:

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

Important routes:

- Paperclip AI Company HQ: `http://127.0.0.1:3100/`
- Home: `http://127.0.0.1:4173/`
- Live: `http://127.0.0.1:4173/#live`
- Universal Translator: `http://127.0.0.1:4173/#translate`
- Private Session Preview: `http://127.0.0.1:4173/session.html?room=sophia-demo`
- Sophia Social: `http://127.0.0.1:4173/social.html`
- SophiaMarket: `http://127.0.0.1:4173/market.html`
- AI Mission Control: `http://127.0.0.1:4173/control-center.html`
- Settings: `http://127.0.0.1:4173/settings.html`
- Listing Guidelines: `http://127.0.0.1:4173/listing-guidelines.html`

## Production Environment

Set these on Vercel before expecting full backend behavior:

- `ANTHROPIC_API_KEY`: powers `/api/chat.js` and `/api/translate.js`.
- Supabase public and backend keys: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are required for login, signup, dashboard data, and backend profile updates. Never place a Supabase service-role or secret key in browser code.
- Stripe variables: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are present for webhook scaffolding. Stripe price IDs are intentionally deferred during the 30-day free launch period and should be added before paid billing starts.

## Current Implementation Notes

- `future.css` adds the neon, chrome, robotic, Shenzhen/Tesla-style visual layer.
- `future.js` adds command palette, HUD clock, scroll rail, cursor spotlight, stat animation, Sophia toast feedback, and the premium motion layer.
- The premium motion layer adds scroll reveals, card tilt/shine, holographic circuit overlays, and reduced-motion fallbacks without adding a heavy animation dependency.
- `social.html` adds Sophia Social with localStorage-based post interactions.
- `translator.js` powers the Universal Translator UI.
- `api/translate.js` is the serverless translation endpoint.
- `index.html` links the translator, future UI, social navigation, and translate section.
- `control-center.html` is AI Mission Control: it shows Codex, Claude, Cursor, Sophia Operator, work lanes, command files, production keys, and launch checklist.
- `404.html` is the branded recovery page for missing routes.
- `settings.html` provides local browser preferences and explains backend-gated settings.
- `listing-guidelines.html` provides SophiaMarket listing quality rules and replaces dead legal links.
- `config.js` is the public browser configuration file for Supabase URL and anon key.
- `scripts/smoke-test.cjs` checks internal local links and assets with Vercel-style clean URL resolution.
- `app/sw.js` is the Sophia Connect service worker; keep its cache list pointed at existing app assets.
- `session.html` uses a pre-join flow so camera and microphone do not start until the visitor chooses Join Session.
- `api/health.js` reports whether production AI, billing webhook, and server data environment variables are configured.

## Verification Standard

Before marking work complete, verify:

- Page loads with HTTP 200.
- No new console errors.
- No horizontal overflow at desktop width.
- No horizontal overflow at mobile width.
- Main buttons or forms work for the changed feature.
- Reduced-motion users are not forced into heavy animation.

## Next High-Value Tickets

- Connect Universal Translator to deployed `ANTHROPIC_API_KEY` and test on Vercel.
- Add continuous live-caption ingestion for video/news clips.
- Add authenticated cloud storage for Sophia Social posts instead of localStorage.
- Build Supabase tables, policies, and storage for profiles, social posts, media uploads, comments, likes, and moderation.
- Before the 30-day free launch period ends, configure Stripe price-to-tier env vars and test the webhook on Vercel with Stripe CLI.
- Connect dashboard metrics and listings to Supabase data.
- Add automated smoke tests for home, market, social, translator, login, and dashboard.
- Expand the Control Center into a live admin dashboard once Supabase, Stripe, and deployment data are connected.
- Replace localStorage-only social/settings data with Supabase once auth is configured.

## Verification Commands

```bash
npm run smoke
```
