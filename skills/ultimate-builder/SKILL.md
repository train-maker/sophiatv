---
name: ultimate-builder
description: Use when planning or building a production social-media, marketplace, SaaS, or business platform from this repo. Applies repo-first inspection, reference-library research, safe stack selection, data modeling, security gates, Playwright verification, and launch discipline without blindly copying code.
---

# Ultimate Builder

## Mission
Build production software, not demos. Use cloned reference repos for architecture and pattern research only.

## Mandatory Safety Gates
Ask before:
- installing packages
- connecting accounts
- using paid APIs
- deploying publicly
- changing auth, payment, admin, database security, or secrets
- copying source code from a reference repo

## Reference Libraries
Use these local paths for research:
- `references/clone-wars`
- `references/awesome-code-agents`
- `references/awesome-agents`
- `references/awesome-saas-boilerplates`
- `references/best-nextjs-saas-boilerplates`

Before using any code pattern directly, inspect the exact source repo license. Catalog licenses are not enough for linked third-party repos.

## Default Stack
Recommend:
- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- Prisma, PostgreSQL, Supabase
- Clerk or Supabase Auth
- UploadThing or Cloudinary
- Supabase Realtime
- Stripe
- Vercel
- Playwright, Vitest, ESLint, Prettier
- Sentry, PostHog

## Build Workflow
1. Inspect repo: framework, package manager, scripts, routes, data layer, auth/payment/admin surfaces, dirty worktree.
2. Read `AGENTS.md`, `docs/STACK_RESEARCH.md`, `docs/SOCIAL_PLATFORM_BLUEPRINT.md`, `docs/TOOL_REGISTRY.md`, and `docs/BUILD_PLAN.md`.
3. Restate product goal, target user, business purpose, required features, files likely touched, and biggest risks.
4. Pick a narrow implementation slice and state the plan before editing.
5. Make small reversible changes.
6. Add or update tests for the changed behavior.
7. Run available checks: lint/typecheck/tests/build plus Playwright for user-visible pages.
8. Report files changed, commands run, results, risks, and next step.

## Social Platform Scope Checklist
Plan these as real features, not fake UI:
- user profiles
- posts
- image/video uploads
- feed
- likes, comments, shares/reposts
- followers/friends
- groups/pages
- notifications
- direct messages
- search
- admin moderation
- reporting/blocking
- privacy settings
- monetization options

## Architecture Rules
- Model trust and safety early: reporting, blocking, admin actions, audit logs, rate limits.
- Keep marketplace listings and social posts separate data domains with shared identity and moderation.
- Use server-side validation for all writes.
- Use storage policies and file validation for uploads.
- Use realtime only where it improves the workflow; do not make every surface realtime.
- Keep generated SEO pages driven by data or scripts, not hand-edited copies.

## Verification Gate
Do not call a build complete until:
- app routes load on desktop and mobile
- no broken local links
- auth and protected route behavior is verified
- forms have honest success/error states
- Playwright passes for touched flows
- security/payment/admin changes have explicit approval and review
