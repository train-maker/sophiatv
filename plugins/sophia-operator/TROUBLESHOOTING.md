# Sophia Operator Troubleshooting

## Local Preview

Run:

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

If a clean URL like `/blog/example` fails locally, use the explicit file path `/blog/example.html`. Vercel clean URLs can resolve routes that the Python static server cannot.

## Smoke Test

Run:

```bash
npm run smoke
```

The smoke test checks static local `href` and `src` targets, PWA manifest assets, and service-worker cached assets.

If it reports a missing `${...}` target, the smoke test should ignore that dynamic template string.

## Browser Checks

After UI work, check:

- Home: `/`
- Translator: `/#translate`
- Social: `/social.html`
- Market: `/market.html`
- Control Center: `/control-center.html`
- Pricing: `/pricing.html`
- Login/signup: `/login.html`, `/signup.html`
- Session pre-join: `/session.html?room=sophia-demo`

Pass criteria:

- Page loads.
- No console errors.
- No horizontal overflow.
- Main interaction works.

## Production Keys

- Anthropic: set `ANTHROPIC_API_KEY` in Vercel.
- Supabase: add public anon key to `config.js`.
- Stripe: set server-only Stripe environment variables in Vercel.

Never put secret keys or service-role keys in browser files.

## Paid/Account Actions

Stop and ask the user before:

- Starting any paid subscription or plan.
- Entering API keys into third-party dashboards.
- Deploying if deployment changes billing.
- Submitting forms that transmit sensitive data.
- Creating persistent access keys.

