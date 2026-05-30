# Almeja Azul — Prioritized Feature Queue (v2)

**Companion to [ROADMAP.md](ROADMAP.md).** That doc is strategic phases; this one is a **tactical work queue** ordered by (revenue impact + risk reduction) ÷ effort. Each item explains what the tool actually is, what it does for Almeja Azul, how to build it, and what it depends on.

**Context this version is written against** (updated 2026-05-28):
- Current PMS: **HMP** (need API documentation status — see item 14)
- Traffic mix: **90%+ from the Facebook page**, plus word of mouth. WhatsApp barely used.
- Communications: **Facebook Messenger is the primary inbox**, plus phone calls and SMS. **There is no Messenger bot today** — greenfield opportunity.
- Deposits: **GCash** (most common), **bank transfer**, some credit cards
- On-site: card terminal, GCash, cash

**Implication for everything below:** the Messenger funnel is the operating system of this business. The website's job is to be the high-trust resource that Messenger conversations *link to* ("here are the rooms: almejaazul.com/stay"), and to capture the small share of direct visitors. Every feature is scored with this in mind.

**Effort key:** S = ≤1 day · M = 2–5 days · L = 1–3 weeks · XL = 3+ weeks
**B/B:** Buy vs Build
**Depends on:** items that must be done first (or done meaningfully in parallel)

---

## Tier 1 — Foundations (parallel-able in week 1, ~2 days total work)

These are all trivial individually but unblock everything else. Do them in parallel; none meaningfully blocks another beyond item 1.

### 1. Custom domain (`almejaazul.com` and `book.almejaazul.com` subdomain)
**What it is:** Your branded web address. A "subdomain" is a prefix on the domain (e.g., `book.almejaazul.com`) — useful for routing traffic to different apps without buying multiple domains.
**Why for AA:** Every Messenger conversation will link to the site ("see the floor plan at..."). A `vercel.app` URL looks like a scam. Also required for: branded email sender (item 3), Meta business verification (item 7), schema.org credibility (item 11), Google Search visibility.
**How:** Vercel → Settings → Domains → add domain. Point your DNS records (at the registrar where you bought the domain — Namecheap, GoDaddy, etc.) to Vercel. SSL is automatic. Add `www → apex` redirect. If you want a `book.` subdomain later for the booking app, just add another A/CNAME record.
**Effort:** S · **Cost:** $10–15/yr if you don't own the domain yet · **B/B:** N/A
**Depends on:** Nothing.

### 2. Google Analytics 4 + Google Search Console + **Meta Pixel + Meta Conversions API**
**What it is:**
- **GA4:** Google's free traffic-tracking tool. Tells you which pages get visited, where visitors come from, which paths lead to bookings.
- **Search Console:** Google's free SEO tool. Tells you what people are searching to find you, indexes your pages, lets you submit a sitemap.
- **Meta Pixel:** Facebook's tracking snippet. Tells you which FB ads/posts drove the click and what the user did after.
- **Meta Conversions API (CAPI):** A *server-side* version of Pixel. When a booking completes on your server, your server tells Facebook directly. This survives ad-blockers and iOS privacy restrictions.

**Why for AA:** With 90% of traffic from Facebook, knowing *which* posts/ads drive bookings is uniquely valuable. Pixel alone misses 30–40% of mobile traffic; Pixel + CAPI captures nearly all of it. This data also powers FB ad retargeting later.
**How:** GA4 + Search Console: install via `@next/third-parties/google` in `app/layout.tsx`, verify domain via DNS TXT. Meta Pixel: install the JS snippet in `app/layout.tsx`. Conversions API: when a booking confirms on your server, POST to the Meta CAPI endpoint with the event (use Meta's official Node SDK).
**Effort:** S · **Cost:** $0 · **B/B:** Buy (all free)
**Depends on:** Item 1 (Meta requires a verified domain for full Pixel features).

### 3. Transactional email via Resend (`hello@almejaazul.com`, `bookings@almejaazul.com`)
**What it is:** [Resend](https://resend.com) is an email-sending service — an API that delivers emails. "Transactional" means automated emails triggered by an action (inquiry submitted → confirmation, booking confirmed → receipt), as opposed to marketing blasts. Without a service like this, emails you send from your server land in spam or get blocked by Gmail/Outlook entirely.
**Why for AA:** Right now an inquiry sits in your DB and no email goes anywhere. Resend lets you fire branded confirmations + owner notifications instantly. Also a foundation for every later automated email (booking confirmations, pre-arrival reminders, post-stay surveys).
**How:** Sign up → verify `almejaazul.com` by adding 3 DNS records (SPF, DKIM, DMARC). Add `RESEND_API_KEY` to env. Create `lib/email/send.ts` with React Email templates (one for guest confirmation, one for your notification). Modify `POST /api/inquiries` to fire both after the DB insert.
**Effort:** S · **Cost:** $0 (free tier 3k emails/mo) → $20/mo at 50k · **B/B:** Buy
**Depends on:** Item 1 (need the domain to verify it as sender).

### 4. New-inquiry phone alerts (Slack workspace or PH SMS via Semaphore)
**What it is:**
- **Slack** = a chat app (like Discord/Teams). Free for small workspaces. An "incoming webhook" is a URL — your server POSTs a message to it and the message appears in a Slack channel, which becomes a phone push.
- **Semaphore** = a Philippine SMS API. You POST `{to: '09XX...', message: '...'}` to their endpoint and they send an SMS via PH carriers (Globe/Smart). Way cheaper than international SMS services for domestic numbers.

**Why for AA:** A wedding inquiry at 8pm Friday that you don't see until Monday is a lost ₱200k+ booking. A phone push within seconds of submission keeps Almeja Azul's response speed as a competitive edge.
**How:** Easiest → Slack workspace + "Incoming Webhooks" app → paste the webhook URL into your env, POST to it from `POST /api/inquiries`. Most "wow" → Semaphore: ~₱0.50 per SMS; ~₱50/month at one alert per day.
**Effort:** S · **Cost:** $0 (Slack) or ~₱50/mo (SMS) · **B/B:** Buy
**Depends on:** Nothing.

### 5. SEO baseline (sitemap, robots, schema.org, OG tags)
**What it is:**
- **Sitemap:** a `sitemap.xml` listing all your pages so Google knows what to crawl.
- **robots.txt:** tells search engine crawlers what they can/can't access.
- **schema.org:** structured data (JSON-LD) you embed in pages telling Google "this is a Hotel, here's the address, here's the price range, here's the rating." Gets you into Google's hotel search panel.
- **OG (Open Graph) tags:** meta tags that control how a link looks when shared on Facebook/Messenger — the preview image, title, description. **For AA this matters enormously because your team will link to your site from Messenger constantly.**

**Why for AA:** Every Messenger link preview needs to look professional. Schema.org makes the resort show up in Google's hotel knowledge panel for "Samal beach resort." All compounds for free over years.
**How:** `app/sitemap.ts` (Next 15 native — auto-generates from your routes). `app/robots.ts`. Add `LocalBusiness` + `Hotel` + `LodgingBusiness` JSON-LD `<script>` in `app/layout.tsx` pulled from `SiteSettings`. Audit each page's `metadata` export — every public page needs `title`, `description`, `openGraph.title`, `openGraph.images`.
**Effort:** M · **Cost:** $0 · **B/B:** Build (one-time)
**Depends on:** Item 1.

### 6. Image optimization + Core Web Vitals
**What it is:** **Core Web Vitals** = Google's three speed metrics (LCP, INP, CLS). LCP <2.5s on mobile is the line — past it, you lose ~20% of visitors before they see anything and Google ranks you lower. **Image optimization** = converting hero JPGs to WebP/AVIF formats and serving the right size per device.
**Why for AA:** PH mobile is mostly 4G with variable speed. A heavy hero image on the home page is the single biggest conversion killer. Also: every Messenger-link visitor lands and bounces in 2 seconds if it's slow.
**How:** Audit with [PageSpeed Insights](https://pagespeed.web.dev/). Verify `next/image` is used everywhere with `priority` on above-the-fold images. Convert hero assets to WebP. Lazy-load below-fold. If image bandwidth grows, put Cloudflare in front of Vercel.
**Effort:** M · **Cost:** $0 · **B/B:** Build
**Depends on:** Nothing.

---

## Tier 2 — Messenger funnel (the highest-impact work — weeks 2–4)

If the website is your brochure, Messenger is your sales floor. This is where to invest.

### 7. Facebook Messenger chatbot (with handoff to human)
**What it is:** An automated assistant inside your FB Messenger inbox that answers common questions 24/7. When the visitor's intent gets serious (real dates, real guest count, ready to book), it hands off to a human staff member or escalates to your phone via Slack/SMS. Built with **ManyChat** ($15/mo Pro) — a visual no-code flow builder for Messenger/IG/WhatsApp — not by integrating Meta's API yourself (that path is a swamp).
**Why for AA:** You're a small team. Right now every "what's the day-tour rate" question costs human minutes during business hours and is missed entirely after-hours. A bot handles 70% of inbound traffic without human intervention and converts after-hours inquiries into structured leads in your DB by morning.
**How:**
1. Verify your Facebook Business + connect Messenger + (optional) Instagram inbox.
2. Build 5–8 core flows in ManyChat: Welcome → "What can I help with?" → branches for Day Tour / Stay / Event / Wedding / Tour / FAQ. Each branch collects key fields (dates, guest count, contact) and ends in either an answer or a handoff.
3. Use ManyChat's "External Request" action to POST collected lead data to your `/api/inquiries` endpoint → lead lands in your CMS automatically.
4. Set up "Live Chat Takeover" so staff can jump in mid-conversation when the bot escalates.
5. Add **Click-to-Messenger ads** in Meta Ads Manager — FB ads that open Messenger straight into your bot flow (better conversion than ads-to-website for PH market).

**Effort:** M (mostly flow design, very little code) · **Cost:** $15/mo ManyChat Pro · **B/B:** **Buy** (the SaaS layer)
**Depends on:** Items 1, 3, 4 (domain for branded sender, Resend for email handoff, alerts for human handoff).

### 8. Inquiry form upgrade on the website (the small-but-real direct channel)
**What it is:** The structured form on your site that captures the ~10% of traffic that doesn't go through Messenger. Currently it's a plain submission with weak validation and no dedup — guests inquiring multiple times become duplicate records.
**Why for AA:** Even at 10% of volume, these are often the highest-intent visitors (they took the time to fill a form instead of opening Messenger). They deserve the same instant confirmation + phone alert path as Messenger leads.
**How:** Tighten Zod schemas. Step-form on the public site: pick `inquiryType` first (Day Tour / Stay / Event / Wedding / Other), then type-specific follow-up fields appear. Dedup by `lower(email)` or `phoneE164` on submit. Add **hCaptcha** (free; bot-prevention widget, similar to reCAPTCHA but more privacy-friendly) to kill spam. Same end-of-pipeline as Messenger: insert → Resend confirmation → Slack/SMS alert.
**Effort:** M · **Cost:** $0 · **B/B:** Build
**Depends on:** Items 3, 4.

### 9. FB-friendly link previews + Messenger send-to-friend optimization
**What it is:** When someone shares an Almeja Azul link in Messenger, Facebook auto-fetches the OG tags to build the preview card. Making sure every page (especially room/tour/venue detail pages) has a strong OG image + title + description means every shared link does free marketing.
**Why for AA:** Your guests *will* share your link. Right now the share preview likely shows a generic logo or nothing. A polished preview with the room image + "₱X,XXX/night · Samal Island" lifts share-conversion.
**How:** Per-page `metadata.openGraph` in each `page.tsx`. Generate dynamic OG images using `ImageResponse` from `next/og` for room/tour/venue/event pages — image overlays the photo with the name + price. Validate with [Meta's Sharing Debugger](https://developers.facebook.com/tools/debug/).
**Effort:** M · **Cost:** $0 · **B/B:** Build
**Depends on:** Items 1, 5.

### 10. Reviews aggregation on the website (Google + Facebook reviews)
**What it is:** Pull live reviews from your Google Business profile and Facebook page, display them on the home and stay pages. Social proof boosts direct-booking conversion.
**Why for AA:** PH guests trust Google + FB reviews more than TripAdvisor. Surfacing them on every key page closes the trust gap that OTAs normally provide for free.
**How:** Use **Google Places API** (free up to ~$200/mo of lookups) to pull Google reviews; cache nightly via Vercel Cron in a `Review` Prisma model. Facebook page reviews require Facebook Graph API + page access token (one-time setup). Render a carousel/grid component on home + stay pages.
**Effort:** M · **Cost:** $0 (within free tiers) · **B/B:** Buy the data, build the display
**Depends on:** Items 1 (domain for Places API key), 5 (good page structure to show reviews on).

### 11. Sales-quality FAQ + galleries (Messenger-bot's knowledge base)
**What it is:** A polished FAQ section and image galleries per room/venue/tour that the Messenger bot links to instead of trying to answer in chat. Bot says "here's a full gallery of Mangrove Pavilion: [link]" instead of awkwardly pasting 10 images.
**Why for AA:** Reduces bot complexity dramatically — the bot routes complex questions to rich web pages rather than trying to embed everything in chat.
**How:** Audit current `FAQ` model — likely needs more entries. Build image gallery components for each Room/Venue/Tour using a light gallery library (e.g., `yet-another-react-lightbox`, ~5kb). Use existing `MediaAsset` model with a new join table `EntityMedia` linking media to rooms/venues/tours.
**Effort:** M · **Cost:** $0 · **B/B:** Build
**Depends on:** Nothing technical (but ideally do after item 9 so OG previews look right when bot links).

---

## Tier 3 — Reservations and money (weeks 5–14)

This cluster is the foundation everything else sits on. Items 12–15 should be designed together because they share the same schema.

### 12. Google Sheets ↔ CMS sync (lean-budget admin)
**What it is:** A scheduled job that reads from a Google Sheet and writes specific fields into your Prisma database. Your team edits a Sheet (familiar, mobile-friendly, multi-user); the site auto-updates within minutes. **Strictly one-way (Sheet → DB)** for safety, **and only for whitelisted fields** (e.g., `Room.basePrice`, `DayPass.price`) — never IDs, never publish-state, never deletes.
**Why for AA:** Faster than admin for bulk operations (e.g., seasonal price updates across 10 rooms in 2 minutes). Works offline-then-syncs. Multiple staff can edit at once.
**How:**
1. Create a Service Account in Google Cloud Console; share the Sheet with the service-account email.
2. Store `GOOGLE_SHEETS_PRIVATE_KEY` + sheet ID in env.
3. One tab per model: `Rooms`, `DayPasses`, `Tours`. First row = column headers matching Prisma field names.
4. Vercel Cron job every 15 min: fetch sheet → diff against DB → upsert whitelisted fields → log to a `SheetSyncLog` audit table.

**Effort:** L · **Cost:** $0 · **B/B:** Build (Sheety/Steinhq exist but add a vendor)
**Depends on:** Nothing.

### 13. Reservation system v0 — held bookings (no payment yet)
**What it is:** A "Book Now" flow on the site (or linkable from Messenger) that captures a structured reservation intent: dates + room type + guest info → creates a `HELD` reservation in your DB → emails the guest "we'll confirm within 4 hours." Different from an inquiry: structured, time-bound, ready to convert to a confirmed booking. **This is the schema foundation — get it right because Tier 4–5 depends on it.**
**Why for AA:** Lets serious leads commit *before* you've built the full payment+PMS-sync stack. Also acts as a structured handoff target for the Messenger bot ("ready to book? fill this: book.almejaazul.com").
**How:** Prisma models: `Guest`, `Reservation` (state machine: HELD → CONFIRMED → CHECKED_IN → CHECKED_OUT → CANCELLED / NO_SHOW), `Folio` (running tab), `Charge` (line items). Public flow at `book.almejaazul.com` or `/book`: room cards → date picker → guest info → "Hold this room — we'll confirm within 4 hours." Admin reservation list + detail view. State transitions in code, not the database, so the workflow is auditable.
**Effort:** L · **Cost:** $0 · **B/B:** Build
**Depends on:** Items 1, 3.

### 14. HMP API integration (or decision-to-migrate)
**What it is:** A typed adapter (`lib/pms/hmp.ts`) that calls HMP's REST API to pull current room inventory, rates, and availability, and pushes new bookings into HMP. Webhook receiver for HMP-side changes. If HMP doesn't expose a usable API, this item becomes "migrate to Cloudbeds" instead.
**Why for AA:** Without this, every direct booking is double-entered manually, and you risk double-booking against OTA traffic. This is the keystone of "wrap the PMS, don't replace it."
**How:**
1. **Immediate action this week:** email HMP support: *"What is the REST API documentation URL? Do you provide webhooks for reservation events? Is API access included in our plan or is it a paid add-on?"*
2. If HMP has a usable API: build `lib/pms/` with a `PmsProvider` interface so any future swap is contained. Methods: `listAvailability(dateRange)`, `createReservation()`, `cancelReservation()`. Webhook receiver at `/api/webhooks/pms`.
3. If HMP API is unusable: this becomes Tier 3 item #1 — migrate to Cloudbeds — see ROADMAP §2.2.
4. Every sync writes to a `SyncEvent` audit table. Add a nightly reconciliation cron that compares PMS state to local DB and alerts on drift.

**Effort:** XL · **Cost:** $0 (PMS already paid) · **B/B:** Build the adapter, the PMS is bought
**Depends on:** Item 13.

### 15. Deposit collection — PayMongo + bank transfer + manual confirmation
**What it is:** **PayMongo** = "Stripe for the Philippines." One checkout that accepts GCash, Maya, GrabPay, credit/debit cards, and bank transfer (via InstaPay/PESONet). They take 2.5–3.5% per transaction, no monthly fee. Your booking flow redirects to their hosted checkout; they redirect back with a success/fail webhook.
**Why for AA:** GCash is your most common deposit method — PayMongo handles it natively, no separate integration. Bank transfer instructions can be included in the deposit-pending email (which Resend sends after a HELD reservation). Cards are an option too. Saves OTA commission (15–20%) on every direct booking.
**How:** PayMongo business account (KYC ~1 week in PH). Implement Checkout Session API: backend creates session for the deposit amount (e.g., 30% of total), redirects guest, webhook updates `Reservation` state to CONFIRMED + creates `Payment` record on success. For bank transfer: send instructions email via Resend with reference number = reservation ID; admin marks payment received manually for now (automate via PESONet API later if volume warrants).
**Effort:** L · **Cost:** 2.5–3.5% per transaction · **B/B:** **Buy** (PayMongo)
**Depends on:** Items 3, 13.

### 16. Guest profile / CRM-lite
**What it is:** A first-class `Guest` model with dedup, history view, and notes. Currently every inquiry is a stranger; there's no record of "this person stayed in March, asked about anniversary upgrade." Powers personalization, loyalty, and repeat-stay marketing.
**Why for AA:** Repeat guests are 5–10× more profitable than acquisition. For a 25–60 room resort with high WoM, repeat guests are likely already a meaningful share — they should be visible.
**How:** `Guest` model. Dedup on `lower(email)` + `phoneE164` at every entry point (Inquiry submit, Reservation creation, future POS sale). Backfill from existing Inquiry table. Guest detail page in admin: timeline (every interaction), notes, total spend, lifetime stays. Loyalty fields prepared but inactive until Tier 5.
**Effort:** L · **Cost:** $0 · **B/B:** Build (HubSpot/Salesforce are overkill at this scale and don't link to your booking data)
**Depends on:** Items 8, 13.

---

## Tier 4 — Internal operations (months 4–9)

### 17. Housekeeping board with live room status
**What it is:** A web app at `staff.almejaazul.com` (or `/staff`) — mobile-first — where housekeepers see their assigned rooms, mark them clean/inspected, and FO sees status update live. Replaces the paper status sheet and radio chatter at the FO desk. **Pusher** is a service that delivers real-time messages from your server to connected browsers (so the board updates without refresh) — free tier covers a 60-room property.
**Why for AA:** Saves ~15 min/day of FO radio time. Visible room readiness reduces guest check-in waits. Photo uploads on completion create a quality record.
**How:** New `StaffUser` model with role enum (HOUSEKEEPER, FRONT_OFFICE, MAINTENANCE, F&B, MANAGER, OWNER). New `RoomStatus` model (Clean/Dirty/Inspected/OOO + last updated + by whom). Mobile-first staff UI under `/staff` route group. Pusher Channels for live updates (or SSE if you want zero added vendors). Photo upload on completion. Consider PWA install prompt so it feels like a native app.
**Effort:** XL · **Cost:** $0 (Pusher free tier) · **B/B:** Build
**Depends on:** Items 14 (room data from PMS), maybe item 18 (StaffUser model shared).

### 18. Maintenance ticketing
**What it is:** Any staff member files a ticket from their phone (broken AC, leaky faucet, photo + location + priority). Maintenance role has queue view. Closes the loop on issues that currently get reported via FB Messenger group chat and forgotten.
**Why for AA:** SLA visibility on issues. Pattern detection (which rooms have recurring AC complaints?). A paper trail for capex decisions.
**How:** `MaintenanceTicket` model (location + category + priority + photos + assignee + state + cost). All staff file. Maintenance team has queue. **Guest-side path:** in-room QR code → "report an issue" form → ticket auto-tagged to current reservation. This guest path is the build-vs-buy tiebreaker — Linear/Jira free tiers don't link guest reservations to tickets.
**Effort:** L · **Cost:** $0 · **B/B:** Build
**Depends on:** Item 17 (shares StaffUser model).

### 19. POS integration — Loyverse + "charge to room"
**What it is:** **Loyverse** = a free POS app that runs on Android/iPad. Used by ~1M+ small businesses globally. Has a REST API + webhooks on the paid tier ($25/mo per outlet). When the restaurant takes an order, Loyverse fires a webhook to your server; your server records the sale and optionally adds it to an in-house guest's running folio for settlement at check-out.
**Why for AA:** "Charge dinner to my room" is a feature that competitors literally cannot match — OTAs send guests with no ability to do this. Also, ancillary revenue per guest is the most important KPI nobody tracks: a guest who buys ₱3k of F&B is worth dramatically more than one who doesn't.
**How:** Set up Loyverse free at each outlet (terminals + menu). Upgrade to Pro for API access. Build webhook receiver at `/api/webhooks/loyverse`. `AncillarySale` model → if guest in-house, link to open `Folio` → `Charge` line item. In Loyverse, configure a custom payment type "Charge to Room" that triggers the webhook with the room number.
**Effort:** L · **Cost:** $0–25/mo per outlet · **B/B:** **Buy** Loyverse, **build** the bridge
**Depends on:** Items 13, 16.

### 20. Staff portal + timesheets
**What it is:** A unified `/staff` home that combines the housekeeping board, maintenance queue, shift schedule, and self-service timesheet editing. Reduces payroll disputes ("I clocked in at 8, not 8:15") with an audit log.
**Why for AA:** Lets staff self-serve common requests (PTO, shift swap, timesheet correction) without involving you/the manager. Becomes the natural home for items 17 + 18.
**How:** Role-aware navigation under `/staff`. `Timesheet` model with clock-in/out + manager-edit-with-audit-log (`TimesheetEdit` table tracks who changed what, when, why). Self-service request flow. Consider **tailwindcss just for the staff portal** (mobile UI density justifies it — keep the public site untouched).
**Effort:** XL · **Cost:** $0 · **B/B:** Build
**Depends on:** Items 17, 18.

---

## Tier 5 — Differentiation (months 9–18+)

### 21. Event mini-sites generator (weddings + corporate retreats)
**What it is:** A templated, branded one-page website auto-generated for each large event — wedding, corporate retreat — at `events.almejaazul.com/[slug]`. Includes timeline (Day 1 9am: Welcome Drinks), RSVP form, FAQ, photo wall (guests upload via QR at the event), check-in (host marks arrivals on their phone). Couples planning a wedding desperately want this; competitors don't offer it.
**Why for AA:** This is your competitive moat. Can be sold as a ₱5–15k add-on per event or bundled into venue rental. Cvent/Eventtia (the enterprise equivalents) cost $5k+/event.
**How:** `Event` + `EventGuest` + `EventTimelineItem` models. Theme picker (3–4 color palettes + hero image). CSV import for guest list. RSVP form pushes into `EventGuest`. Day-of: host opens `/events/[slug]/checkin` on their phone, taps to mark guests arrived. Photo wall: QR at event → upload page → auto-album. Resend for invite blast.
**Effort:** XL · **Cost:** $0 · **B/B:** Build
**Depends on:** Items 3, 13, 16.

### 22. Resource scheduling (kayaks, spa rooms, cabanas, activities)
**What it is:** A unified multi-resource calendar. You have 4 kayaks, 2 spa rooms, 6 cabanas, etc. Each is a constrained resource that needs scheduling. Solves "is the spa free at 3pm" without staff radio.
**Why for AA:** Reduces double-booking of cabanas/kayaks (currently risk: yes). Lets guests self-book activities from their phone — both adds revenue and reduces FO load.
**How:** `Resource` model (type + quantity per type) + `ResourceBooking` (resource + time window + guest). Multi-resource calendar UI (use `@fullcalendar/react` or build with `date-fns`). Guest-side booking from phone (guest portal or QR code at the cabana). Walk-in booking flow for FO.
**Effort:** L–XL · **Cost:** $0 · **B/B:** Build (Booker/Mindbody cost $150–250/mo and don't integrate)
**Depends on:** Items 13, 16.

### 23. Loyalty program (points + tiers)
**What it is:** Bronze/Silver/Gold tiers with points earned per ₱ spent on stays + ancillary, redeemable for discounts/upgrades. Drives repeat stays (cheaper than acquisition).
**Why for AA:** Lifts repeat-guest rate. Particularly effective when paired with the Guest profile (item 16) and event mini-sites (item 21) — past wedding guests come back for anniversaries with points.
**How:** `LoyaltyAccount` + `LoyaltyTransaction` (earn/redeem ledger). Earn rules: configurable (e.g., 1 point per ₱1 on stays, 2 per ₱ on F&B). Tier thresholds + perks (free upgrade at Silver, etc). Resend email celebration on tier-up. Surface balance on guest profile + booking flow.
**Effort:** L · **Cost:** $0 · **B/B:** Build (SaaS loyalty $100–300/mo, doesn't integrate)
**Depends on:** Items 13, 16, 19.

### 24. Dynamic pricing integration (PriceLabs)
**What it is:** [PriceLabs](https://pricelabs.co) is a service that runs ML on millions of properties' booking data and recommends a price for each room-type, each night, daily. You don't auto-apply — you review and accept/edit in your admin, then the accepted rate pushes to HMP.
**Why for AA:** Static pricing leaves ~10–15% RevPAR on the table vs market-tracking pricing. Particularly impactful for shoulder-season optimization.
**How:** PriceLabs subscription. If you're on Cloudbeds, integration is native. If you stay on HMP, you'll likely need to build a small bridge: pull recs from PriceLabs API → store in `PricingRecommendation` model → manager review screen → push accepted rates via your PMS adapter (item 14).
**Effort:** L (integration only) · **Cost:** $20–60/mo · **B/B:** **Buy** the engine, build the workflow
**Depends on:** Item 14.

---

## Tier 6 — Quality of life (do alongside Tier 1–3)

### 25. Backup + disaster recovery
**What it is:** Nightly automated database backups stored outside Neon (S3 / Cloudflare R2). Once Reservation + Payment data lives in your DB, an accidental migration is a fire.
**How:** Vercel Cron job nightly: `pg_dump` to R2/S3 via a small Node script. Retain 30 days. Test restore quarterly. Document the runbook (10 lines).
**Effort:** S · **Cost:** ~$1/mo storage · **B/B:** Build (Neon paid tier has PITR but you're on free)
**Depends on:** Nothing.

### 26. Error monitoring via Sentry
**What it is:** [Sentry](https://sentry.io) catches runtime errors in production and sends you alerts with full stack traces. Free tier covers 5k events/month — plenty for AA's traffic. Once real money flows through the booking endpoint, silent errors = lost revenue.
**How:** Install `@sentry/nextjs`. Configure DSN. Phone alerts on production-only errors.
**Effort:** S · **Cost:** $0 · **B/B:** Buy (free tier)
**Depends on:** Item 15 (most valuable once booking flow is live).

### 27. Cookie banner + privacy policy
**What it is:** PH Data Privacy Act requires consent for cookies + a published privacy policy + a way for users to request data deletion. Once GA4 + Meta Pixel + Guest data are in play, this becomes compliance-required.
**How:** [Cookie Consent](https://www.cookieconsent.com/) (free widget). Privacy policy page using a PH-localized template + your specifics. Admin function for "export this guest's data" + "delete this guest" (right-to-be-forgotten).
**Effort:** S · **Cost:** $0 · **B/B:** Buy the widget, write the policy
**Depends on:** Item 2.

### 28. Multi-language toggle (Tagalog UI)
**What it is:** `next-intl` library lets you maintain Tagalog versions of UI strings without rewriting pages. Tagalog speakers read English well, so this is polish, not urgent. SEO benefit for queries like "resort sa Samal."
**Effort:** M–L · **Cost:** $0 · **B/B:** Build
**Depends on:** Item 5.

---

## Dependency map — what can run in parallel

```
WEEK 1 PARALLEL CLUSTER (Tier 1 — none block each other beyond [1]):
[1] Domain ──┬──> [2] Analytics + Pixel
             ├──> [3] Resend email
             ├──> [5] SEO baseline
             └──> [6] Image optimization
[4] Phone alerts (no dependencies)

WEEK 2–4 (Tier 2 — Messenger funnel):
[7] Messenger bot ────depends on──> [1], [3], [4]
[8] Inquiry form upgrade ──> [3], [4]
[9] FB link previews ──> [1], [5]
[10] Reviews aggregation ──> [1], [5]
[11] FAQ + galleries (no hard deps)

[7], [8], [9], [10], [11] can ALL run in parallel once Tier 1 is done.

WEEK 5–14 (Tier 3 — the bottleneck cluster — design together):
[12] Google Sheets sync (independent — can be done anytime)
[13] Reservation v0 ──> [1], [3]
[14] HMP API ──> [13]
[15] PayMongo deposits ──> [3], [13]
[16] Guest profile ──> [8], [13]

[13] is the keystone. Everything in Tier 4–5 depends on it.
[14] and [15] can be done in parallel after [13].
[16] can start in parallel with [14]/[15].

MONTHS 4–9 (Tier 4 — operations):
[17] Housekeeping board ──> [14] (room data) + new StaffUser model
[18] Maintenance ──> shares StaffUser with [17]
[19] POS / charge-to-room ──> [13], [16]
[20] Staff portal ──> [17], [18]

[17] and [18] can run in parallel (share schema work).
[19] can run in parallel with [17]/[18] (different domain).

MONTHS 9–18+ (Tier 5 — differentiation):
[21] Event mini-sites ──> [3], [13], [16]
[22] Resource scheduling ──> [13], [16]
[23] Loyalty ──> [13], [16], [19]
[24] Dynamic pricing ──> [14]

[21], [22], [24] can run in parallel. [23] should wait for [19] to fully realize value.

TIER 6 (any time):
[25] Backups — do before [15] goes live
[26] Sentry — do alongside [15]
[27] Privacy compliance — do before [16] is live
[28] Multi-language — defer to Tier 5 timeline
```

---

## Updated first-30-days plan (incorporates Messenger reframe)

| Week | Items in parallel | Outcome |
|---|---|---|
| **Week 1** | Items 1, 2, 3, 4, 5, 6 | Branded domain live, analytics + Pixel tracking, branded emails firing, phone alerts working, SEO + speed baseline solid |
| **Week 2** | Item 7 (Messenger bot core flows) + Item 11 (galleries) + Item 25 (backups) | Bot handling Day Tour / Stay / FAQ queries 24/7, rich galleries to link to from chat, DB backups running |
| **Week 3** | Item 7 (bot polish + handoff) + Item 8 (form upgrade) + Item 9 (OG previews) + Item 27 (privacy) | Messenger funnel ~70% automated, web inquiries deduped + spam-protected, every Messenger-shared link looks professional |
| **Week 4** | Item 10 (reviews) + start Item 12 (Sheets sync) + plan Item 13 (reservation schema) | Reviews on site, Sheets editing live for prices, design doc for reservation system ready to build |

At day 30: every inquiry path is automated + tracked, the Messenger funnel works without you, total new monthly spend ≈ $35–45 (Resend + ManyChat + SMS alerts). Then Month 2 starts the big reservation/HMP build.

---

## The single highest-leverage thing this week

**Email HMP today** for: (a) REST API documentation, (b) webhook event types, (c) whether API access is on your current plan or a paid add-on. Their answer determines whether Item 14 takes 3 weeks or whether you migrate PMS first — a 3-month timeline difference. Everything else can proceed in parallel while you wait.
