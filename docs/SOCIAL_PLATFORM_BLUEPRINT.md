# Social Platform Blueprint

## Product Goal
Build Sophia as a premium social-media and worldwide marketplace platform: users can create profiles, post content, discover businesses/listings, interact socially, and monetize through featured listings, subscriptions, ads, or creator/business tools.

## Target Users
- everyday users posting and discovering content
- creators building an audience
- businesses listing products/services globally
- marketplace buyers searching by country, city, category, and trust signals
- admins/moderators protecting the platform

## Core Modules

### Identity
- users
- profiles
- account settings
- privacy settings
- blocked users
- roles: user, creator, business, moderator, admin

### Social Graph
- followers
- friends or mutual follows
- groups/pages
- memberships
- invites

### Content
- posts
- media attachments
- comments
- likes/reactions
- shares/reposts
- bookmarks/saves
- hashtags/topics
- visibility controls

### Feed
- following feed
- discovery feed
- marketplace/business feed
- country/city/category filters
- basic ranking inputs: freshness, engagement, relationship, safety status

### Marketplace
- business profiles
- listings/classified ads
- directory entries
- featured placements
- categories
- locations: country, state/region, city
- inquiry/contact flow
- listing moderation state

### Messaging
- direct message threads
- participants
- message receipts
- media attachments
- block/report integration

### Notifications
- likes/comments/follows/messages
- marketplace inquiries
- moderation decisions
- payment/listing status changes

### Search
- users
- posts
- businesses
- listings
- groups/pages
- category/location search

### Trust And Safety
- report content/user/listing
- block user
- hide/mute
- admin review queue
- moderation actions
- audit log
- upload checks
- rate limits

### Monetization
- Stripe subscriptions
- featured listings
- boosted posts/listings
- creator/business tools
- ads/sponsorship later

## Suggested Data Model

Initial Prisma entities:
- `User`
- `Profile`
- `Follow`
- `Block`
- `Post`
- `MediaAsset`
- `Comment`
- `Reaction`
- `Share`
- `Group`
- `GroupMember`
- `Business`
- `Listing`
- `ListingCategory`
- `Location`
- `Conversation`
- `Message`
- `Notification`
- `Report`
- `ModerationAction`
- `Subscription`
- `PaymentEvent`
- `AuditLog`

## Route Blueprint

Public:
- `/`
- `/market`
- `/market/[country]`
- `/market/[country]/[city]`
- `/directory`
- `/directory/[businessSlug]`
- `/pricing`
- `/about`
- `/terms`
- `/privacy`

Authenticated:
- `/feed`
- `/profile/[handle]`
- `/settings`
- `/messages`
- `/notifications`
- `/market/new`
- `/business/[slug]/dashboard`

Admin:
- `/admin`
- `/admin/reports`
- `/admin/users`
- `/admin/posts`
- `/admin/listings`
- `/admin/payments`
- `/admin/audit-log`

## API/Server Actions
- create/update profile
- create/delete post
- upload media
- like/comment/share
- follow/unfollow
- create marketplace listing
- submit report
- block/unblock
- send message
- mark notification read
- Stripe checkout and webhook
- admin moderation actions

## Security Requirements
- server-side validation on every write
- auth required for protected routes
- admin checks server-side, never UI-only
- RLS if using Supabase directly from client
- signed upload URLs or controlled upload endpoints
- file type and size validation
- webhook signature verification
- rate limiting for posts, comments, messages, reports, and auth-adjacent actions
- audit logs for admin and payment changes

## Launch Phases

### Phase 1: Foundation
- Next.js shell
- auth
- database schema
- layout/navigation
- profile basics
- protected/admin route guards

### Phase 2: Social MVP
- post composer
- media upload
- feed
- likes/comments
- profiles
- follow graph

### Phase 3: Marketplace MVP
- business profiles
- classified listings
- worldwide country/state/city structure
- directory search
- listing submission
- moderation queue

### Phase 4: Trust, Messaging, Monetization
- reports/blocking
- direct messages
- notifications
- Stripe featured listings/subscriptions
- analytics/error monitoring

### Phase 5: Launch Hardening
- Playwright e2e
- Vitest unit coverage
- accessibility pass
- SEO pages/sitemap
- load/performance pass
- privacy/terms/payment copy review
