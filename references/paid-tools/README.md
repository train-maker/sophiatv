# Sophia Paid Tools Backlog

Use free and local tools first. Do not buy, subscribe, upgrade, deploy paid usage, or add billing credentials until Tarence explicitly approves after cash is available.

## Approval Rules

- Free/local first: Codex, local files, Playwright, browser checks, Ollama, existing connectors, and generated local assets.
- Paid tools wait: no subscriptions, API spend, ad spend, domains, production upgrades, or account billing changes without approval.
- Each paid tool needs a clear job, expected return, cheapest useful tier, setup owner, and cancellation path.
- Tools that touch money, customer data, analytics, ads, email, SMS, app stores, or production hosting need a separate approval gate.

## Priority Queue

| Tool | Job for Sophia | Why it helps | First paid gate | Free/local substitute now |
| --- | --- | --- | --- | --- |
| ChatGPT Plus / image generation credits | Premium brand images, hero assets, icons, app-store visuals | Highest visual leverage for Sophia's luxury direction | Approve plan/credit spend before generation beyond free quota | Current generated assets, local editing, SVG/CSS polish |
| Midjourney or Runway | Cinematic campaign visuals and motion references | Strong visual mood for launch promos | Approve subscription and usage scope | ChatGPT image generation, CSS/Three.js motion |
| Figma paid tier | Brand system, reusable component review, handoff boards | Better visual system management as pages multiply | Approve seat/subscription | Local HTML/CSS, screenshots, markdown specs |
| Vercel Pro | Production hosting headroom, previews, analytics/security controls | Cleaner launch operations once traffic grows | Approve plan and team/project billing | Current Vercel/free preview and local smoke checks |
| Supabase paid tier | Real auth/database headroom and backups | Needed when real users and listings need reliable storage | Approve database plan and data-handling scope | Static JSON/localStorage prototypes |
| Resend or Postmark | Transactional email for signup, listing, and payment flows | Professional email delivery and templates | Approve account/domain setup | Gmail drafts/local templates |
| Sentry or Vercel Observability | Production error monitoring | Finds launch bugs fast | Approve project setup and data retention | Playwright audits, local logs |
| Plausible, Fathom, or GA4 setup help | Privacy-aware traffic analytics | Know which pages convert without guessing | Approve analytics provider and cookie/privacy wording | Server logs, manual checks |
| Stripe Radar/Tax or Stripe paid add-ons | Payment safety and tax workflows | Useful once paid listings scale | Approve Stripe configuration and financial settings | Manual Stripe dashboard review |
| App Store / Play Store developer accounts | Native/PWA distribution | Needed for serious mobile distribution | Tarence account/payment approval | PWA install + local app shell |
| Firecrawl or browsing API credits | Public site research at scale | Faster public UX/product pattern scouting | Approve API key and budget cap | Manual public research with browser/curl |
| OpenRouter | Optional multi-model gateway for second opinions and cheap/free model routing | Access many model families through one API after approval | Approve key setup, credit limit, model/data policy, and prompt scope | Claude Code Max, Ollama local models, Cursor |
| Kimi / Moonshot via OpenRouter or Moonshot API | Agentic coding/reasoning comparison for Sophia launch work | Strong external model family for long-context critique and coding-agent experiments | Approve key setup, credit limit, data policy, and exact model | Claude Code Max, Ollama `qwen2.5-coder:7b`, Ollama `deepseek-r1:7b` |
| Ahrefs, Semrush, or Similarweb | SEO/market research | Better keyword/category targeting | Approve subscription and export limits | Google Search Console later, public search, local keyword sheets |
| Apollo or Clay | Lead sourcing for SophiaMarket | Can accelerate business outreach | Approve account, data policy, and outreach rules | Manual public directories, no spam |
| Canva Pro / Adobe Express | Fast social and ad creative variations | Speeds polished launch graphics | Approve subscription | Local generated images and HTML templates |

## Current Free Stack To Use First

- Playwright audits for desktop/mobile UI verification.
- Local smoke checks with `npm run check`.
- Claude Code Max plan for bounded review, copy critique, UI/a11y audits, and launch-blocking issue hunts. Tarence approved using it heavily as a support tool; Codex keeps final integration and verification.
- Existing Sophia memory and Obsidian vault for continuity.
- ChatGPT image generation when available inside the current plan/tooling.
- Ollama/local models for drafting and second opinions.
- Static HTML/CSS/JS prototypes before paid APIs.
- LocalStorage/JSON workflows before hosted databases.

## Next Paid Decision Packet Format

When a paid tool becomes worth considering, create a short packet:

```text
Tool:
Exact Sophia job:
Cheapest useful tier:
Expected result in 7 days:
What free/local work is already exhausted:
Setup steps:
Cancel/rollback path:
Approval needed from Tarence:
```
