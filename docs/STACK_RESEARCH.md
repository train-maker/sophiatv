# Stack Research

## Reference Repos Inspected

| Local path | Purpose | License note | Use level |
| --- | --- | --- | --- |
| `references/clone-wars` | Catalog of open-source clones and alternatives for social, media, marketplace, and SaaS pattern discovery. | AGPL-3.0 at catalog level. Treat linked repos individually. Do not copy code without exact downstream license review. | Architecture research only. |
| `references/awesome-code-agents` | Catalog of coding agents and developer workflow tools. | No top-level license file found in cloned snapshot. | Research only. |
| `references/awesome-agents` | Catalog of general AI agent frameworks and orchestration patterns. | No top-level license file found in cloned snapshot. | Research only. |
| `references/awesome-saas-boilerplates` | Catalog of SaaS starter kits across frameworks. | CC0 1.0 Universal. Linked projects still require their own license review. | Starter comparison. |
| `references/best-nextjs-saas-boilerplates` | Curated list of free Next.js SaaS boilerplates. | CC0 1.0 Universal. Linked projects still require their own license review. | Starter comparison. |

## Patterns Found

### Social/Product Clone Patterns
`clone-wars` is useful for feature decomposition, not production code. Relevant inspiration categories include Instagram, Twitter/X, TikTok, YouTube, Facebook, Discord, WhatsApp, Airbnb, and marketplace/directory-style apps.

Common architecture lessons:
- social apps split into identity, content, relationships, feed ranking, notifications, messaging, moderation, and search
- video/media apps need upload validation, transcoding/storage strategy, moderation, and CDN-aware delivery
- marketplace apps need listing state, seller/business profiles, category/location search, featured placement, payment flow, and trust signals
- realtime is best reserved for messages, notifications, live counters, and collaborative presence

### SaaS Starter Patterns
The SaaS catalogs repeatedly point to this shape:
- Next.js + TypeScript front end and server surface
- Tailwind and shadcn/ui for component velocity
- PostgreSQL with Prisma or Drizzle
- Supabase or Clerk for auth
- Stripe for subscriptions/payments
- Vercel for hosting
- PostHog/Plausible/Google Analytics for analytics
- Sentry for errors

Specific starter references worth deeper review before choosing a base:
- `vercel/nextjs-subscription-payments`: strong Supabase + Stripe reference.
- `ixartz/SaaS-Boilerplate`: modern Next.js, Tailwind, shadcn/ui, Stripe, multi-tenancy ideas.
- `next-forge`: strong commercial-grade architecture ideas with Prisma, Clerk, Stripe, Sentry.
- `Nextacular`: Prisma, NextAuth, Tailwind, Stripe pattern.
- `Basejump`: Supabase-first SaaS account/team patterns.

### Agent Workflow Patterns
The agent lists reinforce a command-center model:
- keep role-based agents bounded by task ownership
- use coding agents for implementation, review, debugging, and QA lanes
- preserve memory/handoff files so context survives sessions
- use browser automation and test evidence instead of visual guesses
- treat agent catalogs as routing inspiration, not install targets

## Recommended Stack

For a new social-media / marketplace website, recommend:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- Supabase
- Clerk or Supabase Auth
- UploadThing or Cloudinary
- Supabase Realtime
- Stripe
- Vercel
- Playwright
- Vitest
- ESLint
- Prettier
- Sentry
- PostHog

## Starter Recommendation

Best practical base approach: do not clone a random full app into Sophia yet. Create a clean Next.js App Router app using the recommended stack, then selectively port Sophia branding/content and build the social + marketplace modules in phases.

Preferred starting point for deeper approved evaluation:
1. Supabase + Stripe starter if auth/database/payments speed matters most.
2. A mature Next.js SaaS starter with Prisma + Clerk + Stripe if multi-tenant admin structure matters most.
3. A custom Next.js app if Sophia needs full control and avoids starter lock-in.

Recommendation: choose the custom Next.js App Router shell plus Supabase/PostgreSQL and Prisma, then add Stripe and media upload after auth and core data model are approved.
