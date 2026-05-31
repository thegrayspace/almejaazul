# Almeja Azul — PMS Expansion Roadmap

**Audience:** Ben (owner/operator + primary builder)
**Status:** Draft v1 — 2026-05-28
**Decision profile this document is written against:**

- Mid boutique: 25–60 rooms, 2–3 F&B outlets, events business
- Posture: keep a core PMS (HMP / eZee / or migrate), wrap with custom
- SaaS budget: lean — ~$100–300/mo run-rate target
- Builder: solo + AI; assume one-person bandwidth, note where a contract dev would unblock

---

## 1. Current state audit

**What you have today** (Next.js 15 monolith on Vercel + Neon Postgres):

- ~14 Prisma models, all of them **content/CMS** (Rooms, BookableSpace, DayPass, AddOn, Activity, Tour, EventPackage, Venue, FAQ, FacebookUpdate, SiteSettings, Page/PageSection, MediaAsset)
- Only one **operational** model: `Inquiry` (form submissions with status enum NEW/RESPONDED/CONFIRMED/CANCELLED)
- One auth surface: `AdminUser` with iron-session, single-role-ish (SUPER_ADMIN/EDITOR)
- All 7 public pages, ~13 admin CRUD pages, media manager, settings editor — all working

**What's missing for PMS work** (the gap):

- No reservation/booking state (no `Booking`, `Folio`, `RatePlan`, `Inventory`, `Stay`)
- No real guest entity (`Inquiry` ≠ `Guest`)
- No staff entity (only `AdminUser` for CMS editors — no housekeepers, FO, F&B)
- No payment, no POS link, no channel data
- No event/job/ticket model (housekeeping, maintenance, requests)
- No multi-resource scheduling (rentals, spa, activities)

**Verdict on the existing stack:** keep it. Next.js 15 App Router + Prisma + Neon + iron-session is exactly the right shape for what's coming. The decisions you've already lived through (no Tailwind, monolith, Edge-runtime-out-of-auth, the `<a>`-not-`<Link>` logout gotcha) are correct and you don't want to re-fight them. The build from here is **schema and workflows**, not a framework change.

---

## 2. Strategic posture

### 2.1 The wrap-don't-replace decision is right

For 25–60 rooms with a lean budget, you cannot economically rebuild what mature PMSs solved over 20 years: channel manager sync to 200+ OTAs, OTA contract terms, dynamic content distribution, parity enforcement, OTA payment reconciliation, ARI (availability/rates/inventory) push protocols, channel-specific gotchas. **Buy that, wrap it, own everything around it.**

Your differentiation is *not* "we built a better channel manager." Your differentiation is:

1. Event mini-sites for weddings/corporate (genuinely underserved by every PMS)
2. Brand-consistent direct booking experience that converts better than `[resort].cloudbeds.com`
3. Operational glue tuned to *your* property — housekeeping, maintenance, guest profile, ancillary revenue tied to F&B
4. Lean ops automation via Google Workspace + Sheets + your CMS

That's where to spend custom build effort.

### 2.2 Core PMS recommendation

You currently use HMP. Three credible paths:

| Option | Monthly cost (PH, 25–60 rooms) | API quality | Channel mgr included | Verdict |
|---|---|---|---|---|
| **Stay on HMP** | (your current spend) | Unclear — must verify they have a documented REST API & webhooks | Often yes | OK if APIs are usable; ask HMP for docs before committing |
| **Migrate to Cloudbeds** | ~$200–400 (Phil pricing varies; ask for boutique deal) | Strong, well-documented, OAuth, webhooks | Yes | **Best long-term API story**, slightly over your budget but worth it |
| **Migrate to Little Hotelier (SiteMinder)** | ~$130–180 | OK, smaller API surface | Yes | Cheapest, but API is more limited — risk of hitting walls |
| **eZee Absolute (Yanolja)** | ~$100–200 | Decent, popular in PH/Asia | Yes (eZee Centrix) | Strong regional support, mixed API depth |

**Recommendation:** ask HMP for their API docs this week. If they have proper REST + webhooks → stay on HMP, you save migration pain. If not → migrate to **Cloudbeds** in Phase 1 — the API quality is the single biggest leverage point for everything in this roadmap, and being $50–100 over budget on the PMS is the right place to overspend.

### 2.3 The lean-budget operating principle

Every recommendation in this doc is filtered through: *will it still fit when totaled at $100–300/mo?* See §3 for the run-rate stack.

---

## 3. Buy vs build — the matrix

This is the central decision table for the whole roadmap.

| Capability | Buy | Build | Why |
|---|---|---|---|
| **Core PMS + Channel Manager** | Cloudbeds / Little Hotelier / eZee | — | 20-year head start, OTA contracts, regulatory plumbing. Never build this. |
| **Direct booking widget** | — | **BUILD** on your Next.js | This is your conversion funnel — your brand, your UX. PMS booking widgets convert poorly. |
| **Payment processing** | **PayMongo** (PH-local: cards/GCash/Maya/GrabPay) + Stripe for international | — | Regulatory & PCI, never build. PayMongo is the right pick for PH primary, Stripe for foreign card support. |
| **F&B POS** | **Loyverse** (free tier!) or eZee BurrP if you want eZee ecosystem | — | Free → $25/mo per outlet. Hardware-friendly, REST API, webhooks. |
| **Email transactional** | **Resend** ($20/mo for 50k emails) | — | Stripe-quality DX, Next.js-native. |
| **SMS** (PH-local) | **Semaphore** (PHP 0.50/SMS) or Twilio | — | Local PH SMS is dramatically cheaper than Twilio for domestic. |
| **Dynamic pricing** | **PriceLabs** ($20–60/mo for 25–60 rooms) | — | Specialized ML on millions of rooms of comp data. Cannot replicate. **Defer to Phase 3.** |
| **Accounting** | **Xero** ($15–40/mo) or QuickBooks Online | — | Audit, tax, never build. |
| **Loyalty program** | — | **BUILD** thin layer on Prisma | Logic is simple (points, tiers); SaaS loyalty is overpriced for hospitality. |
| **Housekeeping board** | — | **BUILD** | This is operational glue tuned to your property; cheap to build, expensive SaaS. |
| **Maintenance tickets** | — | **BUILD** (or stopgap with Notion/Linear) | Same logic as housekeeping. |
| **Staff portal** | — | **BUILD** | Brand-aware UX, integrates with your timesheet + tickets. |
| **Event mini-sites** | — | **BUILD** | Your moat. Almost no PMS does this well; the ones that do (Eventtia, Cvent) are enterprise-priced. |
| **Spa/activity/rental scheduling** | — | **BUILD** | Multi-resource calendar; SaaS options (Booker, Mindbody) cost $200+/mo per location. |
| **Guest profile / CRM** | — | **BUILD** thin layer in Prisma | Should be your source of truth, not a third party's. |
| **Reviews / reputation** | Google Forms initially → **GuestRevu** ($60–100/mo) when scale demands | — | Stopgap free, upgrade later. |
| **BI / dashboards** | **Looker Studio** (free, native Google) | — | Connect to Postgres directly. Beats building dashboards. |
| **Content/price edits via Sheets** | **Google Sheets + Apps Script + your API** | (integration glue) | Brilliant lean move — your team edits a Sheet, a job syncs into Prisma. See §4.5. |
| **Cron / background jobs** | **Vercel Cron** (free on your plan) or **Inngest** (free tier) | — | Don't build a job runner. |
| **Real-time (housekeeping live updates)** | **Pusher Channels** (free up to 100 connections) or just SSE | — | Pusher's free tier covers a 60-room property easily. |
| **File storage** | **Vercel Blob** or **Cloudflare R2** | — | Cheap, S3-compatible. Migrate from local uploads when scale matters. |
| **Error monitoring** | **Sentry** (free tier 5k events) | — | Free, essential. |
| **Auth (when you add guest + staff accounts)** | Keep **iron-session** OR move to **Auth.js v5** | — | iron-session is fine until you need OAuth (Google sign-in for guests) — at that point Auth.js. |

**Estimated total monthly run-rate at full Phase 3 buildout:**

- Cloudbeds: ~$250
- PayMongo: 2.5–3.5% per txn (no monthly)
- Loyverse: $0–25
- Resend: $20
- PriceLabs: ~$40
- Xero: ~$30
- Semaphore: usage-based, ~$5–20
- Pusher: $0
- Sentry: $0
- Vercel + Neon: $0–20 (current)
- **Total: ~$365–405/mo at full buildout** — slightly over your $100–300 target

To stay strictly under $300: drop PriceLabs from Phase 3 (defer) and shop HMP/Little Hotelier hard for a $130–180 deal. That gets you to ~$220–250/mo.

---

## 4. Tech stack — what stays, what gets added

### 4.1 Keep
- Next.js 15 App Router, React 19, TypeScript
- Prisma 6 + Postgres on Neon
- iron-session
- Your custom CSS approach (don't Tailwind-ify mid-build, but consider for new staff portal — see 4.3)
- Vercel hosting

### 4.2 Add immediately (Phase 1A)

```
zod (already have)                # validate booking payloads
date-fns or Luxon                 # date math for availability
@upstash/redis                    # rate limit booking endpoints; cache PMS responses
resend                            # transactional email
react-hook-form + @hookform/resolvers  # booking form complexity warrants it
```

### 4.3 Add when needed (Phase 2+)

```
tailwindcss                       # only for the new staff portal — keep public site as-is
next-pwa                          # so housekeepers/maintenance can use phones offline-ish
@auth/core + @auth/prisma-adapter # if/when guest accounts need Google sign-in
pusher-js + pusher (server)       # live housekeeping board
@inngest/next                     # if Vercel Cron isn't enough
sentry/nextjs                     # observability
```

### 4.4 Database direction

Your current models are content. Operational PMS data is a different category — bigger volume, more relations, more lifecycle states. Plan for these new model families:

**Reservation core (Phase 1):**
- `Guest` (real CRM entity, not Inquiry)
- `Reservation` (booking — links Guest + Room/Space + dates + state machine)
- `RatePlan` / `RateOverride` (or just sync from Cloudbeds if you go that way)
- `Folio` / `Charge` (running tab for a stay)
- `Payment` (transactions, refunds, links to PayMongo/Stripe IDs)

**Operations (Phase 2):**
- `StaffUser` (separate from AdminUser; has Role enum: HOUSEKEEPER, FRONT_OFFICE, MAINTENANCE, F&B, MANAGER, OWNER)
- `RoomStatus` (Clean/Dirty/Inspected/Out-of-order, last updated, by whom)
- `HousekeepingTask` (room + checklist + assignee + state)
- `MaintenanceTicket` (location + category + priority + assignee + photos)
- `Timesheet` (staff clock-in/out, manual edits)

**Differentiation (Phase 3):**
- `Event` + `EventGuest` + `EventTimelineItem` (powers mini-sites)
- `Resource` (kayak #3, spa room 1, the pavilion) + `ResourceBooking`
- `LoyaltyAccount` + `LoyaltyTransaction`
- `AncillarySale` (F&B POS sales joined to guest folio)

**Architectural note:** keep using cuid IDs and Decimal for money. Add `version Int @default(0)` to high-contention rows (Reservation, RoomStatus) for optimistic locking.

### 4.5 The Google Workspace play (lean budget multiplier)

You mentioned wanting Sheets-based price/content editing. This is **a great lean move**. Two concrete uses:

1. **Sheets-as-admin-for-rapid-edits**: a Sheet with one tab per content type (Rooms, Tours, etc). A scheduled job (Vercel Cron every 15 min) reads the Sheet via Google Sheets API and upserts into Prisma. Non-technical staff edit a Sheet; the site updates. Use this for *bulk* edits; your admin UI stays as the rich editor.

2. **Looker Studio dashboards** wired to Neon Postgres directly: occupancy, ADR, RevPAR, ancillary spend per guest, top tours, inquiry→booking conversion. Free, looks professional, no BI vendor.

3. **Apps Script for tiny workflows**: e.g., new wedding inquiry in Sheet auto-creates a Google Drive folder with proposal template, sends Calendar invite, etc. Don't build a tool when one Apps Script does it.

4. **Calendar API for staff schedules**: Phase 2 maintenance/housekeeping shifts can publish into a shared Calendar. Don't build a scheduling UI in Phase 2 — calendar is free and your staff already use it.

Buy-vs-build verdict on Google Workspace integration: **use it heavily, treat it as your free admin tier.** Keep one foot in your custom DB so it stays the system of record.

---

## 5. The Roadmap — 3 macro phases × 3 micro phases

Each macro phase is **~4–6 months for a solo+AI builder**. Each micro phase is **~6–8 weeks**. Total: 12–18 months to Phase 3 complete.

### MACRO PHASE 1 — Revenue Foundation (months 0–6)
*Goal: stop leaking money on direct bookings, plug into the channel ecosystem, make every booking auditable in your own DB.*

#### Phase 1A — Direct booking + payment (weeks 1–8)
**Build:**
- `Guest`, `Reservation`, `Folio`, `Charge`, `Payment` models
- Public booking widget: date picker → available room types → guest info → PayMongo checkout
- Booking confirmation flow (Resend email + PDF voucher)
- Admin reservation list + detail view (your team can see/edit bookings)
- Reservation state machine: HELD → CONFIRMED → CHECKED_IN → CHECKED_OUT → CANCELLED / NO_SHOW

**Buy/integrate:**
- PayMongo account + webhooks
- Resend for transactional email
- Upstash Redis for booking holds (10-min hold while guest pays)

**Why first:** every other phase rides on having Reservations as a first-class entity. And direct bookings save 15–20% in OTA commission, which funds the rest of the roadmap.

**Definition of done:** a guest can book a room on your site, pay via GCash/card, receive a confirmation email, and you see it in `/admin/reservations`. Doesn't yet need to sync to HMP/Cloudbeds.

#### Phase 1B — PMS integration (weeks 9–16)
**This is the fork point on HMP vs Cloudbeds.** Step 1: get HMP API docs. If usable, integrate; if not, migrate.

**Build:**
- Two-way sync adapter: `lib/pms/` with a typed interface so you can swap providers
- Inventory pull (room types, availability, rates) from PMS → cache in your DB
- Reservation push: your booking → PMS reservation
- Webhook receiver: PMS-side changes → your DB
- Conflict resolution (PMS is source of truth for availability; you are source of truth for guest profile)

**Buy:**
- Cloudbeds/HMP integration tier (often needs an "API user" license — usually included on mid-tier plans)

**Buy-vs-build call-out:** the sync layer **must be yours** — but consider [n8n](https://n8n.io) self-hosted ($0) or Make.com (Zapier alternative, ~$10–20/mo) for low-volume webhook routing if you don't want to maintain the receiver code yourself. *Recommendation: build it in Next.js routes; n8n becomes a dependency drain.*

**DoD:** an OTA booking on Booking.com appears in your admin within 60s. A booking made on your site appears in the PMS within 60s.

#### Phase 1C — Guest profile + inquiry pipeline upgrade (weeks 17–24)
**Build:**
- Migrate `Inquiry` to a proper `Lead` → `Guest` flow with deduplication by email/phone
- Guest detail page in admin: history (past stays, total spend, preferences, notes)
- Pre-arrival email sequence (Resend + Vercel Cron)
- Post-stay survey (Google Form initially, results piped to `Guest.notes`)
- Search/filter on the Inquiries page (you'll have hundreds within months)

**Buy:**
- Nothing new

**DoD:** every booking and every inquiry attaches to a Guest record. You can pull up any guest and see their full history in one screen.

---

### MACRO PHASE 2 — Operations Backbone (months 6–12)
*Goal: digitize internal operations. Replace paper checklists, give staff tools, surface real-time room status.*

#### Phase 2A — Housekeeping & room status (weeks 25–32)
**Build:**
- `StaffUser` model + separate `/staff` route group (mobile-first UX, optionally PWA)
- Room status board (live grid: Clean/Dirty/Inspected/OOO/Occupied)
- Housekeeping assignment screen for FO/manager
- Housekeeper mobile view: "my rooms today" + checklist + mark-complete + photo upload
- Pusher (or SSE) for live updates so FO sees rooms turn green as staff mark them

**Buy:**
- Pusher (free tier)
- *Optional:* tailwindcss now for the new staff portal (keep public site untouched)

**DoD:** a housekeeper logs in on their phone, sees their assigned rooms, marks them clean. The FO sees the status flip in real time without refreshing.

#### Phase 2B — Maintenance tickets + staff portal (weeks 33–40)
**Build:**
- `MaintenanceTicket` (location, category, priority, photos, assignee, state)
- Any staff member can file a ticket from their phone (broken AC, leaky faucet)
- Maintenance team view: queue, claim, mark complete with cost/parts
- Guest-side: in-room QR → "report an issue" flow that creates a ticket tagged to their reservation
- Staff portal home: my shifts, my tickets, my pending tasks
- `Timesheet` model + clock-in/out + manager-edit-with-audit-log

**Buy:**
- Nothing new
- **Buy-vs-build call-out:** if maintenance volume is low (<5 tickets/week), use **Linear free tier** for tickets — it's overkill but free and you skip a build. *Recommendation: build it; integrating with guest reservations is the value.*

**DoD:** every maintenance issue creates a ticket. Staff can see the queue on their phone. Timesheets are in the system, not on paper.

#### Phase 2C — F&B POS integration + ancillary revenue (weeks 41–48)
**Build:**
- Loyverse webhook receiver
- `AncillarySale` model (POS sale → optional `Folio` link if guest is in-house)
- "Charge to room" flow: in-house guest's POS check links to their open folio
- Ancillary spend on the guest profile + reservation
- Manager dashboard: F&B revenue by day/outlet, spend-per-occupied-room

**Buy:**
- Loyverse Pro (~$25/mo per outlet) for API access if free tier insufficient

**Buy-vs-build call-out:** the POS itself is firmly buy (Loyverse). The "charge to room" workflow is firmly build because no POS does this with a custom PMS wrap.

**DoD:** a guest orders dinner at the restaurant, staff selects their room, it appears on the guest's folio at check-out.

---

### MACRO PHASE 3 — Differentiation & Intelligence (months 12–18+)
*Goal: ship features competitors don't have. Activate dynamic pricing. Open up revenue intelligence.*

#### Phase 3A — Event mini-sites generator (weeks 49–56)
This is the moat — almost no PMS does this well. For weddings and corporate events.

**Build:**
- `Event` model (linked to `Reservation` or `Venue` booking)
- `EventGuest` (RSVP list, dietary, +1s)
- `EventTimelineItem` (Day 1 9am: Welcome Drinks; etc.)
- Mini-site generator at `/events/[slug]` with branded theme, timeline, FAQ, photo upload, RSVP form, mobile-first
- Host dashboard: import guest list from CSV, send invites via Resend, track RSVPs
- Day-of: host can mark check-ins on a phone, see who arrived
- Photo wall (guests upload via QR; auto-album)

**Buy:**
- Nothing new (Resend you already have)

**DoD:** a wedding planner inputs their event details once, gets a polished mini-site they can share with guests. RSVPs flow into your admin.

#### Phase 3B — Resource scheduling + loyalty (weeks 57–64)
**Build:**
- `Resource` model with type (kayak/spa-room/pavilion/cabana) and quantity
- `ResourceBooking` multi-resource calendar (one kayak slot vs cottage day-rental)
- Guest can book activities/spa from their phone in their guest portal
- Walk-in/desk booking flow for FO
- `LoyaltyAccount` + tiers (Bronze/Silver/Gold) + points engine
- Points earn on stays + ancillary spend; redemption flow
- Auto-tier upgrades + email celebration via Resend

**Buy:**
- Nothing new
- **Buy-vs-build call-out:** Mindbody/Booker exist for spa, but cost $150–250/mo per location and don't link to your guest profile. Build wins for a single-property loyalty + scheduling combo.

**DoD:** a guest opens the resort site on their phone, books a kayak rental for 4pm, gets a confirmation, and earns loyalty points.

#### Phase 3C — Dynamic pricing + revenue intelligence (weeks 65–72+)
**Build:**
- Looker Studio dashboards connected to Neon
- KPIs: Occupancy %, ADR, RevPAR, conversion %, ancillary spend per guest, F&B contribution margin
- A `PricingRecommendation` model that ingests PriceLabs output and surfaces it in your admin (with one-click apply to PMS)
- Forecasting view: 90 days out occupancy + pacing vs same-time-last-year

**Buy:**
- **PriceLabs** ($20–60/mo for 25–60 rooms) — feeds dynamic pricing recs based on market data
- **Looker Studio** (free)

**Buy-vs-build call-out:** *Never build a dynamic pricing engine*. PriceLabs runs ML across millions of comp data points. Build the **integration** that lets you accept/override its suggestions in your workflow.

**DoD:** every morning a manager sees suggested rates for the next 90 days and can accept-all-or-edit in one screen, which pushes to the PMS.

---

## 6. Philippines-specific considerations

- **Payments:** PayMongo > Stripe for PH primary because of GCash/Maya/GrabPay coverage. Keep Stripe as fallback for foreign cards.
- **SMS:** Semaphore (~PHP 0.50/SMS) crushes Twilio for domestic. Use for booking confirmations + arrival reminders.
- **VAT & DOT compliance:** 12% VAT and DOT (Dept of Tourism) accreditation reporting — your accounting integration (Xero) needs PH localization. Verify Cloudbeds/your PMS produces the right tax reports.
- **OTA mix in PH:** Booking.com, Agoda (huge in Asia), Klook (for day passes/tours), Airbnb (less for resorts, but yes for villas). Verify your chosen channel manager covers Agoda + Klook — both are non-negotiable for PH resorts.
- **Language:** English is fine for now. Add Tagalog UI strings in Phase 3 if you want — i18n with `next-intl` is straightforward.

---

## 7. Top 3 risks + how to mitigate

1. **PMS API quality lock-in.** If HMP turns out to have a thin API, you'll discover it deep in Phase 1B and have to migrate mid-build. **Mitigate this week:** request the HMP API docs and a sandbox account *before* writing Phase 1A code. If they can't produce it in 2 weeks, plan the Cloudbeds migration into Phase 1A.

2. **Solo+AI burnout.** 18 months is a long solo build. **Mitigate:** consider a contract dev for Phase 2A (housekeeping board) and Phase 3A (event mini-sites) — those are the two biggest UI builds and easy to scope. Even 80 hours of contract help compresses each by weeks.

3. **Data integrity once PMS sync is live.** A sync bug that double-books or loses a reservation is a fire. **Mitigate:** every sync writes to an immutable audit log (`SyncEvent` table); add a daily reconciliation cron that compares PMS state to local DB and alerts (Resend email) on drift; never delete reservations, only soft-archive.

---

## 8. Open questions for Ben to decide

1. **Does HMP have a documented REST API?** Need this answered before Phase 1B begins. Action: email HMP support.
2. **How many F&B outlets exactly?** (Affects Loyverse plan tier and 2C scope.)
3. **Do you want guest accounts (login on the public site) in Phase 1, or defer to Phase 3 alongside loyalty?** Recommendation: defer. Guests historically don't want to create accounts to book.
4. **Single Cloudbeds-style suite, or best-of-breed at each layer?** Recommendation: single suite for PMS+CM, best-of-breed for everything else.
5. **Where does email marketing live?** Not in this roadmap currently. If you want pre-stay upsells / nurture, add Resend Broadcasts (free with Resend) in Phase 1C, or defer to Phase 3 with proper segmentation.

---

## 9. The next 2 weeks

If you green-light this roadmap, the immediate next steps are:

1. Email HMP for API documentation & sandbox access
2. Open PayMongo business account (KYC takes ~1 week in PH)
3. Sign up for Cloudbeds free trial in parallel — even if you stay on HMP, having Cloudbeds for spec reference is valuable
4. Decide solo vs solo+contract for Phase 2 (no commitment needed yet, just direction)
5. Create the Phase 1A Prisma schema PR (Reservation, Guest, Folio, Charge, Payment) — this is the foundation everything sits on

That's the doc. The first concrete build task — when you're ready — is the Phase 1A schema. Everything else flows from owning Reservation as a first-class entity.
