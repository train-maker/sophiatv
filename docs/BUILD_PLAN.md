# Build Plan

## Current Status
Sophia is currently a launch-preview static/Vercel app with Supabase credentials connected in production. Stripe secret and webhook variables exist, but Stripe price IDs are intentionally deferred during the 30-day free launch period.

## Phase 0: Approval Gate
Before building, choose one base strategy:

1. **Recommended:** clean custom Next.js App Router app with TypeScript, Tailwind, shadcn/ui, Prisma, PostgreSQL/Supabase, Stripe later.
2. Supabase-first starter based on `vercel/nextjs-subscription-payments` patterns.
3. Prisma/Clerk/Stripe starter based on `next-forge` or similar architecture.

Do not scaffold or install until the base is approved.

## Phase 1: Foundation
- create Next.js App Router project
- configure TypeScript, Tailwind, shadcn/ui
- add ESLint/Prettier
- create app shell and navigation
- define environment variable contract without secrets
- add Playwright/Vitest baseline

## Phase 2: Data/Auth Design
- choose Clerk or Supabase Auth
- define Prisma schema
- model users, profiles, posts, media, follows, businesses, listings, reports, notifications, messages, payments
- define admin role model
- define Supabase storage/realtime usage if selected
- write security/RLS plan before implementation

## Phase 3: Social MVP
- profiles
- post composer
- media upload
- feed
- likes/comments/shares
- follows
- notifications skeleton
- privacy settings skeleton

## Phase 4: Marketplace MVP
- business directory
- worldwide classified listings
- countries/states/cities
- category search
- listing submission
- featured listing placeholder behind approval-gated Stripe work
- moderation queue

## Phase 5: Trust And Monetization
- reports/blocking
- admin moderation actions
- audit logs
- keep Stripe checkout disabled during the 30-day free launch period
- before paid billing starts, add Stripe price IDs and test webhook tier updates
- subscriptions/featured listings after the free-period gate
- Sentry/PostHog after approval

## Phase 6: Launch Verification
- unit tests for validation and data helpers
- integration tests for server actions/API routes
- Playwright for signup/login/profile/post/listing/search/payment-intent-free paths
- accessibility and mobile checks
- SEO metadata/sitemap
- performance pass
- deployment checklist

## Next Action
Build the free-period backend surface first: Supabase profiles, social posts, media uploads, comments, likes, reports, and moderation basics. Defer Stripe price IDs until paid billing is ready to turn on.

## Luxury Anti-Slop Pass

Use `docs/LUXURY_ANTI_SLOP_PLAN.md` as the design execution plan for the full-site polish pass. The work order is home, signup/login, Social, Market, Pricing, Dashboard, Control Center, market submission/listing pages, tools, then PWA shell.
