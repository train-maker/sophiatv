# Google Free Tools Workflow For Sophia

Last checked: 2026-04-25

Purpose: use Google's free or no-cost-tier tools as support infrastructure for Sophia, Paperclip, and the app factory without drifting into surprise billing, secrets exposure, or account actions.

## Ground Rules

- Prefer local/Ollama/free tools first.
- Use official Google docs before YouTube claims or blog claims.
- Stop for Tarence approval before billing, API keys, OAuth consent screens, production account permissions, publishing, or sensitive data.
- Treat free tiers as prototypes, not guaranteed production capacity.
- Log each tool's real strength after a small benchmark.

## Ranked Tool Queue

| Rank | Tool | Best Sophia Use | Approval Gate | First Safe Test |
| --- | --- | --- | --- | --- |
| 1 | Chrome Lighthouse | Free web quality checks for Sophia pages: performance, accessibility, best practices, SEO. | No approval for local CLI/DevTools use. Approval only if adding third-party reporting or account integration. | Add a local Lighthouse npm script for `http://127.0.0.1:4173/` and compare it with Playwright audit results. |
| 2 | Google AI Studio / Gemini API free tier | Model comparison, long-context review, structured summaries, UI/copy critique, and agent workflow experiments. | Approval required before creating/saving API keys, enabling billing, sending sensitive data, or using paid tier. | Use the web UI manually with non-sensitive Sophia docs, or create a throwaway local script only after API-key approval. |
| 3 | Firebase Spark plan | No-cost app backend experiments: auth prototype, Firestore prototype, hosting trials. | Approval required before connecting real user data, OAuth consent, production auth, billing upgrade, or Cloud paid features. | Build a throwaway demo project with fake data and document exact limits before linking Sophia. |
| 4 | Google Cloud Free Tier | Small backend experiments: Cloud Run, Cloud Build, BigQuery analysis, Vision/Speech tests, Cloud Shell. | Approval required before enabling billing, deploying public services, storing secrets, or connecting production domains. | Use Cloud Shell or local notes to design a Cloud Run hello-world plan; do not deploy until approved. |
| 5 | Google Apps Script | Lightweight automations around Sheets/Docs/Gmail-style workflows and internal business dashboards. | Approval required before Gmail/Drive access, account scopes, triggers, or anything that touches real business data. | Draft a local Apps Script spec for a fake spreadsheet workflow; no account connection yet. |
| 6 | Google Colab | Free notebook experiments for data cleanup, ML demos, and one-off analysis with public or fake datasets. | Approval required before uploading sensitive files, connecting Drive, paid compute, or running long jobs. | Create a no-data notebook outline for a simple app-idea ranking model. |

## Current Official-Source Notes

- Google Cloud says new customers can get $300 in credits and that 20+ products have free monthly usage limits, including Cloud Run, BigQuery, Cloud Build, Vision AI, Speech-to-Text, and Cloud Shell.
- Google Cloud Free Tier resources are limited, do not roll over, and can change.
- Google AI Studio access is listed on Gemini's free tier; Gemini API pricing/rate limits vary by model. Google's pricing page says free-tier content may be used to improve products, while paid tier content is not.
- Firebase Spark is a no-cost tier for getting started, but some paid Google Cloud products and features are unavailable on Spark.
- Apps Script quotas vary by account type and reset on quota timing; exceeding quotas throws exceptions.
- Colab is free for interactive notebooks, but resources are not guaranteed or unlimited, limits fluctuate, and free managed runtimes restrict remote-control or web-UI style use.
- Lighthouse is an open-source automated page-quality audit tool available through Chrome DevTools, PageSpeed Insights, CLI, and Node.

## Ollama Scout Result

Local model used:

```text
qwen2.5:3b
```

The model correctly prioritized Cloud Run/Cloud Free Tier, Gemini/AI Studio, Firebase, Apps Script, Lighthouse, and Colab. Manual correction applied: local use of Lighthouse, Colab, Apps Script, and Firebase prototypes does not require approval from a Google team. Tarence approval is still required for account access, OAuth scopes, API keys, billing, paid tiers, sensitive data, and production deployment.

## First Implementation Move

Add a local Lighthouse audit command for Sophia after the current Playwright audit. That gives us a free Google-backed quality layer without accounts, billing, keys, or cloud access.

Suggested command:

```bash
npx lighthouse http://127.0.0.1:4173/ --output=json --output-path=test-results/lighthouse-home.json --chrome-flags="--headless"
```

Only run it when the local dev server is already up.

## Sources

- Google Cloud Free Program: https://cloud.google.com/free
- Google Cloud Free Program docs: https://cloud.google.com/free/docs/free-cloud-features
- Gemini API billing: https://ai.google.dev/gemini-api/docs/billing/
- Gemini API pricing: https://ai.google.dev/pricing
- Gemini API rate limits: https://ai.google.dev/gemini-api/docs/quota
- Firebase pricing plans: https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- Apps Script quotas: https://developers.google.com/apps-script/guides/services/quotas
- Google Colab FAQ: https://research.google.com/colaboratory/faq.html
- Lighthouse docs: https://developer.chrome.com/docs/lighthouse
