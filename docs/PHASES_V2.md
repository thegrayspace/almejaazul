# Almeja Azul — 6-Phase Implementation Plan (v2)

**Status:** v2.0 — 2026-05-29 — draft for review
**Source backlog:** [BACKLOG_V2.md](BACKLOG_V2.md) (146 items across 20 categories)
**Supersedes:** the phase shape in v1's [ROADMAP.md](ROADMAP.md)

This plan assigns every backlog item to one of six phases. The structure follows Ben's stated principle: **Phases 1–2 contain everything that doesn't depend on the core booking engine decision.** PMS integration kicks off in Phase 3 once HMP API capability is confirmed (or migration to Cloudbeds is decided).

---

## Assumptions stated up-front (please correct)

1. **Phase 2 cutoff** — your message ended at "quote builder and …". I've completed Phase 2 with items that match the pattern (Workspace, staff portal basics, inventory, quote builder, CRM core). If you meant to add others, they'll just shift in.
2. **Defaults applied for the 7 unanswered questions:**
   - CRM-06 guest-facing quote form → **P1** (matches CRM-05 since you grouped both as "quote builder" in Phase 2)
   - CRM-15 loyalty → **P2**, activate in Phase 5 (schema seeded earlier)
   - WEB-07 Tagalog → **P4**, Phase 6
   - SEC-06 2FA → **P3**, Phase 2 (paired with role rollout)
   - OPS-F-07 restaurant reservations → **P4**, Phase 5
   - OPS-F-05 restaurant inventory → **P5**, Phase 6
   - RES-08 group bookings → **P3**, Phase 4
3. **Messenger funnel — Phase 1 uses Meta-native tools first** (free, since you're verified business), then upgrades to ManyChat in Phase 2 if rule-based gets too limiting. Saves $15/mo for the first 2 months and lets you ship before evaluating ManyChat.
4. **"Direct chat" = Facebook Chat plugin embedded on site** (COM-12) — feeds your existing Messenger inbox where CS agents already work. No separate vendor.

---

## Phasing principles

| Principle | Why |
|---|---|
| Phases 1–2 ship without PMS decision | HMP API audit (RES-01) may take weeks; don't block customer-facing wins on it |
| Phase 3 is the keystone | Reservation + PMS + Payment = the foundation everything in 4–6 depends on |
| v0 stopgaps stay in Phase 2; custom builds in Phase 4 | Calendar API + Forms + Sheets do real work for months — only build custom UI when v0 is the actual bottleneck |
| Differentiation in Phase 5 | Event microsites, loyalty, resource scheduling — the moat work, after operational foundation is stable |
| Intelligence last | Looker dashboards + Gemini AI + PriceLabs need clean operational data to be valuable |

---

## Phase 1 — Site & Funnel Foundation
**Duration:** ~2 months (months 1–2)
**Goal:** Make the existing site fully production-ready, route every inquiry through a tight pipeline, and get the FB Messenger funnel operating professionally without a code-heavy bot framework.

### Headline outcomes
- Branded domain live, analytics + Pixel + CAPI tracking, Sentry + Uptime monitoring
- Every inquiry → guest confirmation email + owner phone alert within seconds
- Inquiry pipeline with status, assignment, follow-up, notes — no inquiry can fall through the cracks
- Messenger bot using Meta's built-in automation tools (free, no ManyChat yet)
- On-site live chat embedded → Messenger inbox where CS agents already work
- Galleries + image optimization → site looks professional everywhere

### Items (28)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| FND-01 | Custom domain + subdomains | P1 | L | Protect Workspace MX records |
| FND-02 | Rotate prod admin password + secrets audit | P1 | VL | Do this day 1 |
| FND-03 | External media storage (Vercel Blob or R2) | P1 | L | Unblocks "correct images" work |
| FND-04 | Database backup + disaster recovery | P1 | L | Nightly to R2 |
| OBS-01 | Google Tag Manager container | P1 | L | Replaces hard-coded tags |
| OBS-02 | GA4 + Search Console | P1 | VL | |
| OBS-03 | Meta Pixel + Conversions API | P1 | M | PII hashed |
| OBS-04 | Sentry error monitoring | P2 | VL | Free tier |
| OBS-05 | Uptime monitoring | P2 | VL | Free tier |
| WEB-01 | SEO baseline | P1 | M | Sitemap, robots, schema.org |
| WEB-02 | Per-page metadata + OG tags | P1 | M | Critical for Messenger shares |
| WEB-03 | Dynamic OG image generation | P2 | M | Room/Tour/Venue cards |
| WEB-04 | Image optimization + Core Web Vitals | P1 | M | LCP <2.5s mobile |
| WEB-05 | Reviews aggregation (Google + FB) | P2 | M | Homepage + Stay page |
| COM-01 | Resend transactional email | P1 | L | Branded sender on `almejaazul.com` |
| COM-03 | Google Chat webhook alerts | P1 | L | New inquiries → team chat |
| COM-04 | Semaphore PH SMS alerts | P2 | L | Owner phone |
| COM-12 | Facebook Chat plugin embed | P1 | L | Live chat → existing Messenger inbox |
| COM-13 | Meta-native Messenger automation | P1 | L | Instant Replies, Saved Replies, Persistent Menu, Welcome |
| COM-06 | Click-to-Messenger ads setup | P2 | L | Conversion-tracked |
| CRM-01 | Inquiry form upgrade (Zod, dedup, hCaptcha) | P1 | M | Step-form by inquiry type |
| CRM-02 | Inquiry status pipeline | P1 | M | New → Contacted → Quoted → Deposit → Confirmed → Lost |
| CRM-03 | Inquiry assignment + follow-up dates | P1 | M | Reminder emails |
| CRM-04 | Internal notes + activity timeline | P1 | L | Quick-win |
| CRM-09 | Daily inquiry digest email | P2 | L | Morning summary to owner |
| CMS-06 | Image library + alt text required | P3 | M | Pulled to Phase 1 for "correct images" |
| CMS-07 | Galleries per Room/Tour/Venue | P2 | M | Multi-image join |
| INT-05 | Background job runner (Vercel Cron) | P1 | L | Used by digest + reminders |

### Phase 1 dependencies
- Email HMP for API docs (RES-01) at the start of Phase 1, in parallel. Their answer drives Phase 3 planning.
- Vercel Blob or Cloudflare R2 account (FND-03) before image work.

### Phase 1 risks
- "Image optimization" can drag if the existing image library is large. Time-box to 1 week.
- Meta-native bot tools may feel underpowered fast → either accept the limit through Phase 1 or fast-track ManyChat (COM-02) into Phase 1 if you need conversational flows now.

### Definition of Phase 1 complete
- Every inquiry → confirmation email + chat alert + SMS within 5 seconds
- Mobile homepage LCP under 2.5s
- Search Console shows your sitemap indexed; Meta Sharing Debugger shows polished previews
- Pipeline view in admin lets you triage 30 inquiries in <5 min
- New monthly run-rate added: ~$25–35 (Resend tier, Semaphore SMS, Sentry & Uptime free)

---

## Phase 2 — Internal Foundation (split into 2A + 2B)
**Duration:** ~4 months total (months 3–6)
**Goal:** Build the internal-operations foundation that doesn't require PMS data. Split into two sub-phases so 2A locks down the security + Workspace + CRM-schema foundation that 2B's operational tooling all depends on.

---

### Phase 2A — Security, Workspace Docs, CMS Maturity, CRM Foundation
**Duration:** ~2 months (months 3–4)
**Goal:** Lock down the foundation layer — staff roles, audit log, Workspace doc system, CMS polish, Guest profile schema. Nothing operational ships in 2A; instead, 2A's outputs unblock 2B.

### Headline outcomes (Phase 2A)
- Role-based permissions + audit log: staff can edit content without losing accountability
- Full Workspace folder structure + 10 SOPs + policy library + RFP/proposal templates
- CMS gets draft/publish, Sheets sync, content validation, last-updated tracking
- Guest entity is a first-class model with dedup + history view
- PMS vendor selection completed (Cloudbeds vs Mews vs eZee vs Little Hotelier evaluation)

### Items — Phase 2A (30)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| SEC-01 | Role-based admin/staff permissions | P1 | H | Bottleneck for everything in 2B |
| SEC-02 | Audit log infrastructure | P1 | M | Required before staff edit content |
| SEC-03 | Google Identity SSO for staff | P2 | M | "Sign in with Google" |
| SEC-04 | Cookie banner + PDP Act compliance | P2 | L | |
| SEC-06 | Two-factor auth for admin | P3 | M | |
| SEC-07 | PII handling review | P2 | L | |
| SEC-08 | CSP + security headers audit | P3 | L | |
| DOC-01 | Workspace folder structure | P1 | L | Foundation for all DOC work |
| DOC-02 | SOP system + first 10 SOPs | P2 | H | Includes the "what a clean room looks like" visual SOP |
| DOC-03 | Policy library + 5 initial policies | P2 | M | HR, guest, vendor, data, safety |
| DOC-04 | RFP / RFI template + vendor evaluation rubric | P2 | M | |
| DOC-05 | Project management tracker (Sheets) | P2 | M | |
| DOC-06 | Wedding/corporate proposal templates | P2 | M | Feeds CRM-05 in 2B |
| DOC-07 | Vendor agreement template library | P3 | M | |
| DOC-08 | Apps Script: auto-create folder per project | P3 | L | Recipe 1 |
| DOC-10 | Internal knowledge base / wiki (Google Sites) | P3 | M | |
| DOC-11 | Staff handbook + onboarding doc set | P3 | M | |
| CMS-01 | Google Sheets ↔ CMS one-way sync | P1 | M | The flagship Workspace integration |
| CMS-02 | Bulk import/export | P2 | M | |
| CMS-04 | Last updated by/at + history (builds on audit log) | P2 | M | |
| CMS-10 | Content validation engine | P2 | M | |
| CMS-11 | Restaurant menu management (CMS section) | P3 | M | Content only |
| CMS-12 | Spa service catalog (CMS section) | P3 | M | |
| CMS-13 | Activity/rental catalog (CMS section) | P3 | M | |
| CRM-07 | Guest profile (Guest model + dedup) | P1 | H | Foundation for Phase 3+ |
| CRM-08 | Guest history view | P2 | M | |
| CRM-10 | VIP tags + repeat-guest detection | P3 | M | |
| CRM-11 | Birthday / anniversary detection (Apps Script Recipe 3) | P3 | M | |
| CRM-13 | Guest preferences storage | P3 | M | |
| CRM-14 | Guest communication history log | P3 | M | |
| INT-04 | Rate limiter (Upstash Redis) | P2 | L | Pre-empts Phase 3 booking endpoint abuse |
| RES-12 | **PMS vendor selection** (Cloudbeds / Mews / eZee / Little Hotelier scoring + demos + contract) | P1 | M | Replaces dead HMP API path; gate to Phase 3 |

### Definition of Phase 2A complete
- Staff log into the admin with appropriate roles; every content change is logged
- A new SOP can be authored from a Workspace template in <15 min
- Bulk-edit a Sheet of room prices → site reflects within 15 min
- PMS vendor signed; sandbox/account access verified

---

### Phase 2B — Staff Portal, Inventory, Quote Builder, Ops v0
**Duration:** ~2 months (months 5–6)
**Goal:** Ship the operational tools that ride on 2A's foundation. Every item here uses staff roles, audit logs, Guest profile, or Workspace templates from 2A.

### Headline outcomes (Phase 2B)
- Mobile-first staff portal home with Google sign-in
- Department inventory tracking live for Rooms / FO / Maintenance / Common
- Internal quote builder + guest-facing quote request → events convert
- Housekeeping v0 = shared Google Calendar (Pattern C)
- Maintenance v0 = Google Form + Sheet + Apps Script (Pattern B)
- Asset registry with QR codes (start; deepens in Phase 4)
- Messenger bot upgrades to ManyChat if Phase 1's Meta-native tools hit limits

### Items — Phase 2B (19)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| OPS-S-01 | StaffUser model + role enum | P1 | M | Depends on SEC-01 (2A) |
| OPS-S-02 | Staff portal home (mobile-first) | P2 | H | Visual SOP library accessible from here |
| OPS-S-03 | Staff scheduling via Google Calendar | P2 | L | Pattern C — one calendar per role |
| OPS-S-04 | Timesheets v0 via Sheet (Apps Script validated) | P3 | L | Custom UI deferred to Phase 4 |
| OPS-S-07 | Staff onboarding workflow | P4 | M | Builds on DOC-11 |
| OPS-R-01 | Housekeeping board v0 (shared Calendar) | P2 | L | Pattern C — custom build in Phase 4 |
| OPS-R-04 | Linen & consumable tracking | P3 | M | Sits inside INV framework |
| OPS-M-01 | Maintenance ticketing v0 (Form + Sheet + Apps Script routing) | P2 | L | Pattern B |
| OPS-M-04 | Asset registry with QR codes — start | P3 | H | Continues in Phase 4 |
| INV-01 | Department-segmented inventory framework | P2 | H | Rooms / FO / Maintenance / Common / Events |
| INV-02 | Stock-in / stock-out logging | P2 | M | |
| INV-03 | Par-level + reorder alerts | P3 | M | |
| INV-04 | Mobile count tool (PWA) | P3 | M | Weekly counts on phone |
| CRM-05 | Quote builder — internal (PDF + shareable link) | P1 | H | Uses DOC-06 templates |
| CRM-06 | Quote request — guest-facing form | P1 | M | "Get a quote" CTA on Build page |
| COM-02 | FB Messenger chatbot upgrade to ManyChat (if needed) | P1 | M | Only if Phase 1 Meta-native hits limits |
| COM-05 | Messenger bot → Google Sheet destination | P2 | L | Non-tech staff visibility |
| COM-07 | Pre-arrival email automation framework | P2 | M | Template work; triggers wired in Phase 3 |
| COM-08 | Post-stay survey via Google Forms → Guest | P3 | L | Pre-builds the survey logic |

### Phase 2 (combined) dependencies
- Phase 1's media storage (FND-03) for staff portal imagery (clean-room reference photos in SOPs)
- DOC-01 folder structure must complete before SOP/policy/template population
- SEC-01 + SEC-02 (Phase 2A) gate all of Phase 2B

### Phase 2 (combined) risks
- DOC items balloon if SOPs are written exhaustively → time-box to top 10 daily workflows
- INV framework scope: anchor on what each department would count this Friday, ignore the rest until par-levels make those items real
- Staff portal scope creep — Phase 2B keeps it to "log in, see schedule, see SOPs, count inventory, file maintenance ticket via Form"; custom UIs wait for Phase 4

### Definition of Phase 2 complete (after 2B)
- A new hire can be onboarded entirely from Google Workspace materials
- Every department can produce a current inventory count from their phone
- An event lead → quote PDF in under 15 min, with auto-created Drive folder
- Owner can see who edited what content from the audit log
- PMS vendor signed and sandbox accessible (gate to Phase 3)
- Monthly run-rate added: ~$5–10 (Upstash free, ManyChat if upgraded ~$15)

---

## Phase 3 — PMS Migration + Reservations + Payments
**Duration:** ~4 months (months 7–10)
**Goal:** Migrate off HMP to a new PMS (Cloudbeds, Mews, eZee, or Little Hotelier — selected in Phase 2A via RES-12) and connect it as the system of record for inventory/rates/availability. Ship direct booking with payment. Establish the integration platform every later phase rides on.

### Why migration, not integration
**HMP's API is confirmed insufficient.** RES-01 returned a negative result: HMP cannot expose the REST endpoints + webhooks needed for reservation/availability/rate sync at the quality this roadmap requires. Three implications:

1. Phase 3 starts with a **data migration** (rooms, rates, contacts, history) onto the new PMS — not a code integration.
2. Phase 2A includes **RES-12 PMS vendor selection** so the chosen PMS is signed before Phase 3 starts. Demo, score, contract, get sandbox access — all in Phase 2A.
3. Cost shifts: HMP's monthly fee retires; new PMS monthly cost (~$150–400 depending on choice) replaces it. Net change depends on vendor.

### Headline outcomes
- Almeja Azul fully migrated onto the new PMS (rooms, rates, channel connections, historical reservations if feasible)
- Direct booking widget on the site: date picker → live availability from new PMS → guest info → PayMongo checkout → confirmed reservation
- OTA bookings (Booking.com, Agoda, etc.) appear in admin within 60 seconds via webhooks
- Deposits collected via GCash, Maya, cards, or bank transfer; refunds workable
- Folio/charge ledger schema ready for ancillary integration in Phase 4
- Integration platform: webhook bus, sync log dashboard, reconciliation cron
- Loyalty model schema seeded but inactive (activation in Phase 5)

### Items (24)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| RES-09 | **PMS migration execution** (rooms, rates, channels, history) | P1 | H | Starts week 1 of Phase 3; gates everything else |
| RES-02 | PMS adapter layer (`lib/pms/`) for new PMS | P1 | H | Provider-swappable interface; uses new PMS's API |
| RES-03 | Reservation v0 (held + confirmed states) | P1 | H | Schema foundation |
| RES-04 | Reservation mirror + SyncLog schema | P1 | M | |
| RES-05 | PMS webhook ingestion + retry | P1 | M | |
| RES-06 | Real-time availability from new PMS | P1 | M | |
| RES-07 | Direct booking widget v1 | P2 | H | Date picker + checkout |
| RES-10 | Channel manager configuration (Booking.com, Agoda, Klook) | P2 | L | Most modern PMSs include this — verify in Phase 2A selection |
| RES-11 | Walk-in / phone-booking quick-entry | P3 | M | FO use case |
| PAY-01 | PayMongo integration | P1 | H | GCash, Maya, cards, bank |
| PAY-02 | Deposit collection workflow | P1 | M | Auto-confirm on payment |
| PAY-03 | Bank transfer + reference number tracking | P2 | M | |
| PAY-04 | PaymentIntent mirror schema | P1 | L | |
| PAY-05 | Folio + Charge ledger schema | P1 | H | Foundation for Phase 4 ancillary |
| PAY-06 | Refund workflow | P2 | M | |
| PAY-10 | Tax compliance (PH VAT 12% + DOT reporting) | P2 | M | Many PMSs handle this — verify in selection |
| INT-01 | Webhook bus + retry/dead-letter | P2 | H | All later integrations use this |
| INT-02 | SyncLog model + admin dashboard | P2 | M | |
| INT-06 | Daily PMS reconciliation cron | P2 | M | Alert on drift |
| FND-05 | Staging environment setup | P2 | L | Before live PMS hits prod |
| FND-06 | Neon paid tier upgrade | P2 | VL | Pre-empt cold-start risk on booking |
| FND-07 | Seed/reset script separation | P2 | L | Safety before production booking |
| CRM-15 | Loyalty schema seeded (inactive) | P2 | H | Activate in Phase 5 |

### Phase 3 dependencies
- **RES-12 PMS vendor selected and contracted by end of Phase 2A** (gate to Phase 3)
- CRM-07 Guest profile (built Phase 2A) underpins everything
- INT-05 background runner (built Phase 1) handles cron + retries
- PayMongo KYC (~1 week) started at end of Phase 2B

### Phase 3 risks
- **Data migration off HMP is the single biggest risk in this phase.** Don't cut over OTAs until: (a) rates verified against HMP source, (b) channel manager test bookings round-trip cleanly, (c) the new PMS shadow-runs alongside HMP for 1–2 weeks.
- HMP cancellation timing — do NOT cancel HMP until new PMS is 100% operational and the last in-flight reservation has checked out. Plan ~2 months of dual-run cost.
- Double-booking risk during cutover → freeze rate edits during the 24-hour migration window; communicate with OTAs.
- PayMongo dispute/chargeback procedures need a runbook.

### Definition of Phase 3 complete
- A guest can book a room from the site, pay via GCash, get a confirmation
- An OTA booking on Booking.com shows up in your admin within 60 seconds
- Daily reconciliation report shows zero drift between PMS and local DB
- Refunds workable; tax-correct receipts generated
- Monthly run-rate added: ~$30–50 (Neon paid, Cloudbeds if migrated) + PayMongo per-transaction

---

## Phase 4 — Operations Depth
**Duration:** ~3 months (months 9–11)
**Goal:** Replace Phase 2's v0 stopgaps with custom UIs where the v0 has become the bottleneck. Integrate F&B POS so ancillary revenue flows into guest folios. Ship the operational dashboards owners actually open daily.

### Headline outcomes
- Housekeeping board: live room status, mobile assignment UI, photo proof — replaces Calendar v0
- Maintenance: custom queue, in-room QR for guest-reported issues — replaces Form v0
- Loyverse POS integration + "charge to room" → ancillary revenue per guest visible
- Timesheets custom UI with audit log → replaces Sheet v0
- Manager daily report email at 8am
- Looker Studio dashboards: occupancy, ADR, RevPAR, channel mix, inquiry conversion
- Accounting integration (Xero or QuickBooks)

### Items (25)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| OPS-R-02 | Housekeeping board custom UI | P2 | H | Replaces OPS-R-01 v0 |
| OPS-R-03 | Photo proof of cleaning | P3 | M | |
| OPS-R-05 | Room turnaround time metrics | P4 | M | |
| OPS-R-06 | Lost & found log | P4 | L | |
| OPS-M-02 | Maintenance custom UI | P3 | H | Replaces OPS-M-01 v0 |
| OPS-M-03 | In-room QR → guest issue report | P3 | M | Differentiator |
| OPS-M-05 | Preventive maintenance schedule | P4 | M | |
| OPS-M-06 | Maintenance cost tracking | P4 | M | |
| OPS-F-01 | Loyverse POS integration | P2 | M | |
| OPS-F-02 | AncillarySale schema + Folio link | P2 | M | |
| OPS-F-03 | Charge-to-room workflow | P2 | M | The differentiating feature |
| OPS-F-04 | F&B revenue per outlet dashboard | P3 | M | Looker Studio |
| OPS-S-05 | Timesheets custom UI | P3 | H | Replaces OPS-S-04 v0 |
| OPS-S-06 | Self-service: shift swap, PTO | P4 | H | |
| CMS-03 | Draft/publish workflow with preview | P2 | H | |
| CMS-05 | ChangeRequest workflow | P3 | H | |
| CMS-08 | FAQ content from Google Doc | P3 | M | |
| CRM-12 | Corporate account tagging | P3 | M | B2B view |
| RES-08 | Group booking management | P3 | H | |
| REV-01 | Occupancy/ADR/RevPAR dashboard | P2 | M | Looker Studio |
| REV-02 | Channel mix dashboard | P2 | M | |
| REV-03 | Inquiry-to-booking conversion tracking | P2 | L | |
| REV-07 | Daily manager report email | P3 | M | 8am summary |
| REV-08 | Ancillary revenue per guest | P3 | M | |
| REV-10 | Direct-booking lift dashboard | P3 | M | OTA commission saved |
| PAY-08 | Payment reconciliation dashboard | P3 | M | |
| PAY-09 | Accounting integration (Xero/QuickBooks) | P3 | M | |
| SEC-05 | Right-to-be-forgotten function | P3 | L | |
| INT-03 | DataImport/Export audit | P3 | M | |

### Phase 4 dependencies
- All Phase 3 items (Reservation, PMS sync, Folio schema) must be live
- INV framework (Phase 2) must be live before INV usage analytics

### Definition of Phase 4 complete
- An owner can open one Looker Studio dashboard and see every operational KPI
- A guest can scan a QR in their room to report a leaky AC; ticket auto-assigned + photo attached
- F&B revenue is automatically attributed to guest folios where applicable
- Monthly run-rate added: ~$40–60 (Xero or QuickBooks, Loyverse Pro per outlet)

---

## Phase 5 — Differentiation & Guest Experience
**Duration:** ~4 months (months 12–15)
**Goal:** Ship the features competitors don't have — event microsites (the moat), loyalty program, resource scheduling for kayaks/spa, guest self-service.

### Headline outcomes
- Event microsites generator: every wedding/corporate booking gets a branded mini-site with timeline, RSVP, FAQ, photo wall, QR check-in
- Loyalty program live: points on stays + ancillary, tiers, redemption
- Spa reservations, kayak rentals, activity self-booking — all from a guest's phone
- Pre-arrival + post-stay automation sequences running on every reservation

### Items (24)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| EVT-01 | Event microsite generator (core) | P1 | VH | THE moat |
| EVT-02 | Event timeline editor (Calendar v0 → custom) | P2 | M | Pattern C |
| EVT-03 | RSVP form v0 (Google Form) | P2 | L | Stopgap |
| EVT-04 | RSVP form custom branded | P3 | M | |
| EVT-05 | Guest list CSV import | P2 | M | |
| EVT-06 | Day-of QR check-in | P3 | M | |
| EVT-07 | Photo wall (guest QR upload) | P3 | M | |
| EVT-08 | Theme picker | P3 | M | |
| EVT-09 | EventMealChoice tracking | P3 | M | Kitchen prep report |
| EVT-10 | Event Drive folder auto-creation (Apps Script) | P2 | L | Recipe 1 |
| EVT-11 | Vendor management per event | P4 | M | |
| EVT-12 | Event sales pipeline dashboard | P3 | M | |
| EVT-14 | Event seating chart tool | P4 | H | |
| EVT-15 | Event invoicing + multi-deposit schedule | P3 | H | |
| CRM-15 | Loyalty activation (tiers + redemption UI) | P2 | H | Schema from Phase 3 |
| CRM-16 | Post-stay direct-booking offers | P3 | M | |
| ACT-01 | Resource scheduling v0 (Calendar per resource) | P3 | M | Pattern C — may stay v0 |
| ACT-02 | Resource scheduling custom UI | P4 | VH | Only if v0 hits limits |
| ACT-03 | Guest self-book activities | P4 | H | Phone + QR |
| ACT-04 | Spa reservation system | P3 | H | |
| ACT-05 | Activity utilization dashboard | P4 | M | |
| ACT-06 | Rental check-out/check-in flow | P4 | M | Kayaks etc. |
| OPS-F-07 | Restaurant reservations | P4 | M | |
| DOC-09 | Apps Script: SOP version control | P3 | M | |
| COM-09 | Internal staff announcement board | P4 | M | Curated Chat space |

### Phase 5 dependencies
- CRM-07 Guest profile + CRM-15 loyalty schema (Phase 3) → loyalty activation here
- PAY-05 Folio (Phase 3) → event invoicing rides on it
- OPS-F-02 AncillarySale (Phase 4) → loyalty points on F&B spend

### Definition of Phase 5 complete
- A new wedding inquiry → confirmed event → branded microsite live + RSVPs flowing within hours of confirmation
- Repeat-guest VIPs earn points automatically and see balance on booking
- Spa bookings happen 24/7 without front-desk involvement
- No new monthly run-rate

---

## Phase 6 — Intelligence, AI, and Long-Tail
**Duration:** ongoing (months 16+)
**Goal:** Add the intelligence layer (dynamic pricing, AI features) and the long-tail features that are valuable but never urgent.

### Headline outcomes
- PriceLabs feeds daily rate recommendations into the manager review screen
- 8 Gemini-powered in-product AI features (auto-categorize, draft replies, summarize, etc.)
- Multi-language Tagalog toggle
- Vouchers, affiliate referrals, B2B portal
- Restaurant inventory and recipe management (if F&B cost-of-goods becomes a priority)

### Items (~16)

| # | Feature | Priority | Effort | Notes |
|---|---|---|---|---|
| REV-04 | PriceLabs integration | P3 | H | Dynamic pricing engine |
| REV-05 | Rate review/accept workflow | P3 | M | Manager screen |
| REV-06 | 90-day occupancy forecast | P3 | M | |
| REV-09 | Maintenance cost per room/asset | P4 | M | |
| AI-01 | Auto-categorize inquiries via Gemini | P3 | L | |
| AI-02 | Draft Messenger reply suggestions | P3 | M | |
| AI-03 | Guest history summarization | P3 | L | |
| AI-04 | FAQ semantic search | P3 | M | |
| AI-05 | Review summarization for homepage | P3 | L | |
| AI-06 | Pricing-change explanation copy | P4 | L | |
| AI-07 | OG image alt-text generation | P4 | L | |
| AI-08 | Tagalog first-draft translation | P4 | M | |
| WEB-06 | Multi-language toggle (Tagalog) | P4 | H | |
| WEB-08 | Blog/journal section | P5 | M | SEO |
| WEB-09 | Voucher/gift certificate system | P4 | H | |
| WEB-10 | Affiliate/referral program | P5 | H | |
| COM-10 | Email marketing broadcasts | P4 | M | Resend Broadcasts |
| COM-11 | WhatsApp Business | P5 | M | Deprioritized |
| ACT-07 | Activity instructor scheduling | P4 | M | |
| OPS-F-05 | Restaurant inventory (Marketman) | P5 | H | |
| OPS-F-06 | Recipe / COGS tracking | P5 | H | |
| OPS-S-08 | Staff training tracker | P5 | M | |
| CRM-17 | Travel agent / B2B portal | P5 | VH | |
| INV-05 | Purchase order workflow | P4 | H | |
| INV-06 | Cost-per-occupied-room reporting | P4 | M | |
| CMS-09 | Sheets two-way real-time sync | P4 | VH | Defer — high risk |
| DOC-12 | Workspace AI rollout playbook | P3 | L | Gemini in Docs/Sheets/Gmail for staff |

### Phase 6 disposition
This phase is intentionally less time-boxed. Items here ship as bandwidth allows. Reassess priorities quarterly based on what Phase 3–5 data reveals.

### Definition of Phase 6 "in flight"
- PriceLabs is live and feeding the morning rate review
- At least 3 Gemini AI features are in production
- Quarterly review of remaining items determines what graduates to "next quarter"

---

## Cross-phase summary

| Phase | Months | Item count | New monthly run-rate added | Biggest risk |
|---|---|---|---|---|
| 1 — Site & funnel foundation | 1–2 | 28 | ~$25–35 | Meta-native bot limitations |
| 2A — Security + Workspace + CRM foundation | 3–4 | 30 | ~$0 | DOC scope creep |
| 2B — Staff portal + inventory + quote + ops v0 | 5–6 | 19 | ~$0–15 (ManyChat if upgraded) | Inventory framework over-design |
| 3 — PMS migration + reservations + payments | 7–10 | 24 | ~$120–280 (new PMS replaces HMP) + per-txn | PMS data migration |
| 4 — Operations depth | 11–13 | 25 | ~$40–60 | Loyverse integration depth |
| 5 — Differentiation | 14–17 | 24 | $0 | Event microsite complexity |
| 6 — Intelligence + long-tail | 18+ | 27 | ~$30–80 | Defocus risk |

**Cumulative monthly run-rate by end of Phase 6:** ~$215–390 + per-transaction fees. The PMS migration is the big swing: Cloudbeds (~$250) lands above your $100–300 target; Little Hotelier (~$170) or eZee (~$150) stays inside it. PMS choice in Phase 2A directly determines whether you exceed budget.

**Cumulative items:** 178 (138 original + COM-12 + COM-13 + INV-01–06 + RES-12 added during phasing). All accounted for.

---

## What happens between now and Phase 1 starts

1. **Apply the proposed Messenger configuration** (see [MESSENGER_CONFIG.md](MESSENGER_CONFIG.md)) — the new welcome flow, persistent menu, and Saved Replies cover ~70% of common inquiries automatically.
2. **PMS shopping starts in Phase 2A** (RES-12). Until then, HMP keeps running as-is. No urgent action this week.
3. PayMongo business account application can wait until late Phase 2B (KYC takes ~1 week; only needs to be ready by Phase 3 start).
4. Parallel-execution prompts in [PARALLEL_EXECUTION_TIER1.md](PARALLEL_EXECUTION_TIER1.md) cover the first six Phase 1 items verbatim.
