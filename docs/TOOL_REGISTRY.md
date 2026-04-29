# Tool Registry

## Local Reference Libraries

| Tool/Repo | Local path | Use | Install status | Safety note |
| --- | --- | --- | --- | --- |
| Clone Wars | `references/clone-wars` | Social/media/marketplace clone pattern research. | Cloned only. | AGPL-3.0 catalog. Do not copy code. Check linked repo licenses. |
| Awesome Code Agents | `references/awesome-code-agents` | Coding-agent landscape and workflow ideas. | Cloned only. | No top-level license found. Research only. |
| Awesome Agents | `references/awesome-agents` | AI agent orchestration and automation ideas. | Cloned only. | No top-level license found. Research only. |
| Awesome SaaS Boilerplates | `references/awesome-saas-boilerplates` | SaaS starter-kit comparison. | Cloned only. | CC0 catalog. Check linked repo licenses. |
| Best Next.js SaaS Boilerplates | `references/best-nextjs-saas-boilerplates` | Next.js starter comparison. | Cloned only. | CC0 catalog. Check linked repo licenses. |

## Recommended Stack Tools

| Tool | Role | Approval needed before use |
| --- | --- | --- |
| Next.js App Router | full-stack React app routing/rendering | yes, before new scaffold/install |
| TypeScript | type safety | no for docs; yes before package/config changes |
| Tailwind CSS | styling system | yes before install/config |
| shadcn/ui | component patterns | yes before CLI/install |
| Prisma | ORM/schema/migrations | yes before install or migration |
| PostgreSQL | production database | yes before connecting account/service |
| Supabase | database/auth/storage/realtime option | yes before account, env, or paid usage |
| Clerk | auth option | yes before account/env/security changes |
| UploadThing | upload handling option | yes before account/env/package install |
| Cloudinary | media storage/transforms option | yes before account/env/package install |
| Supabase Realtime | live events | yes before enabling account/env |
| Stripe | payments/subscriptions | yes before account/env/payment logic |
| Vercel | hosting/deployments | yes before public deploy |
| Playwright | browser/e2e verification | already present in repo checks; safe to run |
| Vitest | unit tests | yes before install/config if absent |
| ESLint | linting | yes before install/config if absent |
| Prettier | formatting | yes before install/config if absent |
| Sentry | error monitoring | yes before account/env/package install |
| PostHog | analytics/product events | yes before account/env/package install |

## Agent Roles

- Codex: implementation engine, repo inspection, patching, checks, Playwright.
- Claude Code: architecture/review/critique lane when explicitly invoked or when stuck.
- Cursor: IDE/refactor/UX polish lane when explicitly opened.
- Ollama/free models: brainstorming, review drafts, docs, summaries, test ideas.
- ChatGPT: escalation lane for stuck debugging, architecture critique, and second-opinion review.

## Do Not Do Without Approval
- install dependencies
- connect Supabase, Clerk, Stripe, Vercel, Sentry, PostHog, Cloudinary, or UploadThing accounts
- edit `.env` or secrets
- deploy publicly
- change auth, payment, admin, or security logic
- copy source from cloned references
