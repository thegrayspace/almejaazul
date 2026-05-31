# Almeja Azul — Master Feature Backlog (v2)

**Status:** v2.0 — 2026-05-29 — first pass, unphased
**Supersedes for backlog purposes:** the priority lists in [FEATURE_PRIORITY.md](FEATURE_PRIORITY.md) and the build-vs-buy matrix in [ROADMAP.md](ROADMAP.md). Those v1 docs remain valid as strategic context.

This is the **source-of-truth backlog**. Items are not yet assigned to phases — that comes after review. Each item carries enough metadata (priority, effort, buy/build, cost, category, tags) to drive phasing decisions in a follow-up pass.

---

## Methodology

### Priority (impact-based, per Ben's instruction)
P1–P5 reflect **strategic importance to the business**, not effort or urgency. A P1 item is something Almeja Azul cannot become the property it wants to be without. P5 is genuinely deferrable forever.

- **P1 Urgent** — directly drives revenue, owns guest trust, or is foundational to multiple other P1 items
- **P2 High** — meaningful strategic value, important within 6–12 months
- **P3 Medium** — incremental improvement, important within 12–24 months
- **P4 Low** — nice-to-have refinement, can be deferred
- **P5 Backlog** — captured for completeness; revisit annually

### Effort
- **VL Very Low** — <1 day
- **L Low** — 2–5 days
- **M Medium** — 1–2 weeks
- **H High** — 2–4 weeks
- **VH Very High** — 1+ month

### Buy vs Build
- **Buy** — pay a vendor for the capability
- **Build** — implement in our stack
- **Hybrid** — buy a service, build the integration / experience layer
- **Configure** — a Google Workspace setup or similar that requires no code

### Cost
Monthly USD recurring. One-time costs noted separately. `$0` = no incremental cost. Per-transaction fees noted inline.

### Categories (19 used)
`FND` Foundation · `SEC` Security & Governance · `OBS` Observability & Analytics · `CMS` CMS & Content · `WEB` Website & Marketing · `COM` Communications · `CRM` Inquiry & CRM · `RES` Reservations & Booking · `PAY` Payments & Finance · `OPS-R` Ops: Rooms Division · `OPS-M` Ops: Maintenance & Assets · `OPS-F` Ops: F&B · `OPS-S` Ops: Staff · `EVT` Events & Weddings · `ACT` Activities, Spa, Rentals · `REV` Revenue & Pricing · `DOC` Documentation & Workflow · `INT` Integrations Platform · `AI` AI/ML in Product

### Tags (used to filter and cross-cut)
`foundation` `security` `compliance` `pii` `quick-win` `bottleneck` `differentiator` `revenue-direct` `revenue-indirect` `risk-reduction` `google-workspace` `gemini` `messenger-funnel` `pms-dependent` `ph-localization` `staff-facing` `guest-facing` `internal-tool` `automation`

---

## Master backlog

### FND — Foundation

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| FND-01 | Custom domain `almejaazul.com` + subdomains (book, events, staff) | P1 | L | Build | $1 (DNS) | foundation, quick-win |
| FND-02 | Rotate production admin password + secrets audit | P1 | VL | Build | $0 | security, quick-win, risk-reduction |
| FND-03 | External media storage (Vercel Blob or Cloudflare R2) | P1 | L | Buy | $0–5 | foundation, risk-reduction |
| FND-04 | Database backup + disaster recovery (nightly dump to R2/Drive) | P1 | L | Build | $1–5 | risk-reduction |
| FND-05 | Staging environment + branch preview deploys | P2 | L | Configure | $0 | foundation |
| FND-06 | Neon paid tier upgrade (connection pooling, PITR) | P2 | VL | Buy | $19+ | foundation, risk-reduction |
| FND-07 | Seed/reset script separation for dev vs production safety | P2 | L | Build | $0 | risk-reduction |

### SEC — Security & Governance

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| SEC-01 | Role-based admin/staff permissions (Role, Permission, AdminUserRole) | P1 | H | Build | $0 | foundation, bottleneck, security |
| SEC-02 | Audit log infrastructure (AuditLog model + key-action tracking) | P1 | M | Build | $0 | foundation, security, risk-reduction |
| SEC-03 | Google Identity SSO for staff login (Sign in with Google) | P2 | M | Hybrid | $0 | google-workspace, staff-facing |
| SEC-04 | Cookie banner + PH Data Privacy Act compliance | P2 | L | Hybrid | $0 | compliance, pii |
| SEC-05 | Right-to-be-forgotten admin function (data export + delete) | P3 | L | Build | $0 | compliance, pii |
| SEC-06 | Two-factor auth for admin accounts | P3 | M | Build | $0 | security |
| SEC-07 | PII handling review (hashing, encryption at rest for sensitive fields) | P2 | L | Build | $0 | security, pii, compliance |
| SEC-08 | Content security policy + security headers audit | P3 | L | Build | $0 | security |

### OBS — Observability & Analytics

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| OBS-01 | Google Tag Manager container (holds GA4 + Pixel + future tags) | P1 | L | Buy | $0 | foundation, google-workspace |
| OBS-02 | GA4 + Google Search Console verification | P1 | VL | Buy | $0 | foundation, google-workspace, quick-win |
| OBS-03 | Meta Pixel + Conversions API (server-side, PII hashed) | P1 | M | Build | $0 | messenger-funnel, pii |
| OBS-04 | Sentry error monitoring (production-only alerts) | P2 | VL | Buy | $0 | risk-reduction, quick-win |
| OBS-05 | Uptime monitoring (UptimeRobot or BetterStack) | P2 | VL | Buy | $0 | risk-reduction, quick-win |
| OBS-06 | Looker Studio dashboards connected to Neon | P2 | M | Buy | $0 | google-workspace, internal-tool |
| OBS-07 | PageSpeed Insights + Lighthouse CI baseline | P3 | L | Buy | $0 | quick-win |
| OBS-08 | Webhook & integration event log dashboard | P2 | M | Build | $0 | foundation, internal-tool |

### CMS — CMS & Content

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| CMS-01 | Google Sheets ↔ CMS one-way sync (Sheet → DB, whitelisted fields) | P1 | M | Build | $0 | google-workspace, automation, internal-tool |
| CMS-02 | Bulk import/export (CSV/Sheets) for prices, packages, FAQs | P2 | M | Build | $0 | internal-tool |
| CMS-03 | Draft/publish workflow with preview | P2 | H | Build | $0 | internal-tool |
| CMS-04 | "Last updated by/at" + per-entity change history | P2 | M | Build | $0 | internal-tool, risk-reduction |
| CMS-05 | ChangeRequest workflow (approval queue before publish) | P3 | H | Build | $0 | internal-tool |
| CMS-06 | Image library reorganization + alt-text required field | P3 | M | Build | $0 | internal-tool |
| CMS-07 | Galleries per Room/Tour/Venue (multi-image join) | P2 | M | Build | $0 | guest-facing |
| CMS-08 | FAQ content from a Google Doc (Doc → DB sync) | P3 | M | Build | $0 | google-workspace, automation |
| CMS-09 | Google Sheets two-way real-time sync (high-risk; see notes) | P4 | VH | Build | $0 | google-workspace, risk-reduction |
| CMS-10 | Content validation engine (Zod schemas per entity type) | P2 | M | Build | $0 | risk-reduction |
| CMS-11 | Restaurant menu management (CMS section for F&B) | P3 | M | Build | $0 | guest-facing |
| CMS-12 | Spa service catalog (CMS section) | P3 | M | Build | $0 | guest-facing |
| CMS-13 | Activity / rental catalog (CMS section) | P3 | M | Build | $0 | guest-facing |

### WEB — Website & Marketing

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| WEB-01 | SEO baseline (sitemap, robots, schema.org JSON-LD) | P1 | M | Build | $0 | quick-win, revenue-indirect |
| WEB-02 | Per-page metadata audit + OG tags | P1 | M | Build | $0 | messenger-funnel, revenue-indirect |
| WEB-03 | Dynamic OG image generation (Room/Tour/Venue/Event cards) | P2 | M | Build | $0 | messenger-funnel |
| WEB-04 | Image optimization (WebP/AVIF) + Core Web Vitals | P1 | M | Build | $0 | revenue-indirect, quick-win |
| WEB-05 | Reviews aggregation (Google Places + FB) on home + stay pages | P2 | M | Hybrid | $0 | google-workspace, guest-facing, revenue-indirect |
| WEB-06 | Google Hotel Center inventory feed (Google Hotel search visibility) | P3 | M | Buy | $0 | google-workspace, revenue-direct |
| WEB-07 | Multi-language toggle (English + Tagalog) | P4 | H | Build | $0 | ph-localization, guest-facing |
| WEB-08 | Blog/journal section for SEO content | P5 | M | Build | $0 | revenue-indirect |
| WEB-09 | Voucher/gift certificate system | P4 | H | Build | $0 | revenue-direct, guest-facing |
| WEB-10 | Affiliate / referral program | P5 | H | Build | $0 | revenue-direct |

### COM — Communications

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| COM-01 | Resend transactional email (branded sender per Workspace domain) | P1 | L | Buy | $0–20 | foundation, automation |
| COM-02 | Facebook Messenger chatbot (ManyChat, scripted flows + live takeover) | P1 | M | Hybrid | $15 | messenger-funnel, revenue-direct, automation |
| COM-03 | Google Chat webhook alerts on new inquiry | P1 | L | Buy | $0 | google-workspace, staff-facing, quick-win |
| COM-04 | Semaphore PH SMS alerts (owner mobile) | P2 | L | Buy | ~$1 (₱50) | ph-localization, staff-facing |
| COM-05 | Messenger bot → Google Sheet destination for non-tech visibility | P2 | L | Build | $0 | google-workspace, messenger-funnel |
| COM-06 | Click-to-Messenger ad setup + conversion tracking | P2 | L | Buy | ad spend | messenger-funnel, revenue-direct |
| COM-07 | Pre-arrival email automation (7-day, 1-day reminders) | P2 | M | Build | $0 | automation, guest-facing |
| COM-08 | Post-stay survey via Google Forms → Guest record | P3 | L | Hybrid | $0 | google-workspace, automation |
| COM-09 | Internal staff announcement board / Chat space curation | P4 | M | Configure | $0 | google-workspace, staff-facing |
| COM-10 | Email marketing / broadcast tool (Resend Broadcasts) | P4 | M | Buy | $20 | revenue-indirect |
| COM-11 | WhatsApp Business (deprioritized — barely used in current funnel) | P5 | M | Hybrid | $15 | messenger-funnel |
| COM-12 | Facebook Customer Chat plugin embed (on-site live chat → existing Messenger inbox) | P1 | L | Configure | $0 | messenger-funnel, guest-facing, quick-win |
| COM-13 | Meta-native Messenger automation (Instant Replies, Saved Replies, Persistent Menu, Welcome) | P1 | L | Configure | $0 | messenger-funnel, automation, quick-win |

### CRM — Inquiry & CRM

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| CRM-01 | Inquiry form upgrade (Zod, dedup, hCaptcha, step-form by type) | P1 | M | Build | $0 | guest-facing, revenue-indirect |
| CRM-02 | Inquiry status pipeline (new → contacted → quoted → deposit → confirmed → lost) | P1 | M | Build | $0 | bottleneck, internal-tool, revenue-direct |
| CRM-03 | Inquiry assignment + next-follow-up date + reminders | P1 | M | Build | $0 | staff-facing, automation |
| CRM-04 | Internal notes + activity timeline on inquiries | P1 | L | Build | $0 | staff-facing, quick-win |
| CRM-05 | Quote builder — internal (build proposal, generate PDF, shareable link) | P1 | H | Build | $0 | revenue-direct, differentiator, staff-facing |
| CRM-06 | Quote request — guest-facing form on the site (for events / large parties) | P2 | M | Build | $0 | guest-facing, revenue-direct |
| CRM-07 | Guest profile (Guest model + dedup by email + phoneE164) | P1 | H | Build | $0 | foundation, bottleneck |
| CRM-08 | Guest history view (all inquiries, stays, spend, comms) | P2 | M | Build | $0 | staff-facing |
| CRM-09 | Daily inquiry digest email to owner | P2 | L | Build | $0 | automation, staff-facing, quick-win |
| CRM-10 | VIP tags + repeat-guest detection | P3 | M | Build | $0 | revenue-direct |
| CRM-11 | Birthday / anniversary detection + reminder workflow | P3 | M | Hybrid | $0 | google-workspace, automation, differentiator |
| CRM-12 | Corporate account tagging + B2B view | P3 | M | Build | $0 | revenue-direct |
| CRM-13 | Guest preferences storage (dietary, room prefs, allergies) | P3 | M | Build | $0 | guest-facing |
| CRM-14 | Guest communication history log (calls, Messenger, email) | P3 | M | Build | $0 | staff-facing |
| CRM-15 | Loyalty program (tiers + points + redemption) | P2 | H | Build | $0 | revenue-direct, differentiator |
| CRM-16 | Post-stay direct-booking offers (returning guest incentive) | P3 | M | Build | $0 | revenue-direct, automation |
| CRM-17 | Travel agent / corporate B2B portal | P5 | VH | Build | $0 | revenue-direct |

### RES — Reservations & Booking

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| RES-01 | HMP API audit — **DONE: HMP API confirmed weak, migration required** | P1 | VL | Configure | $0 | bottleneck, pms-dependent |
| RES-02 | PMS adapter layer (lib/pms/ with typed interface, provider-swappable) | P1 | H | Build | $0 | foundation, bottleneck, pms-dependent |
| RES-03 | Reservation v0 — held bookings (no payment yet) | P1 | H | Build | $0 | bottleneck, revenue-direct |
| RES-04 | Reservation mirror schema (ExternalReservation + SyncLog) | P1 | M | Build | $0 | foundation, pms-dependent |
| RES-05 | PMS webhook ingestion + retry/dead-letter | P1 | M | Build | $0 | pms-dependent, risk-reduction |
| RES-06 | Real-time availability surfaced from PMS to direct-book widget | P1 | M | Build | $0 | revenue-direct, pms-dependent |
| RES-07 | Direct booking widget v1 (date picker → availability → checkout) | P2 | H | Build | $0 | guest-facing, revenue-direct |
| RES-08 | Group booking management (>5 rooms, single contact) | P3 | H | Build | $0 | revenue-direct |
| RES-09 | **PMS migration execution** (data + rates + channels onto new PMS) | P1 | H | Buy | $150–400 | pms-dependent, bottleneck |
| RES-10 | Channel manager evaluation (Booking.com, Agoda, Klook coverage) | P2 | L | Buy | varies | revenue-direct |
| RES-11 | Walk-in / phone-booking quick-entry for FO | P3 | M | Build | $0 | staff-facing |
| RES-12 | **PMS vendor selection** (Cloudbeds / Mews / eZee / Little Hotelier scoring + demos + contract) | P1 | M | Configure | $0 | bottleneck, pms-dependent |

### PAY — Payments & Finance

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| PAY-01 | PayMongo integration (GCash, Maya, GrabPay, cards) | P1 | H | Buy | 2.5–3.5% per txn | ph-localization, revenue-direct |
| PAY-02 | Deposit collection workflow + auto-confirm on payment | P1 | M | Build | $0 | revenue-direct, automation |
| PAY-03 | Bank transfer with reference number + manual confirm | P2 | M | Build | $0 | ph-localization, revenue-direct |
| PAY-04 | PaymentIntent mirror schema (PMS / PayMongo / Stripe) | P1 | L | Build | $0 | foundation |
| PAY-05 | Folio / Charge ledger schema | P1 | H | Build | $0 | foundation, bottleneck |
| PAY-06 | Refund workflow + audit trail | P2 | M | Build | $0 | compliance, staff-facing |
| PAY-07 | Stripe fallback for foreign card guests | P3 | M | Buy | ~2.9% + $0.30 per txn | revenue-direct |
| PAY-08 | Payment reconciliation dashboard | P3 | M | Build | $0 | internal-tool, compliance |
| PAY-09 | Accounting integration (Xero or QuickBooks Online) | P3 | M | Buy | $15–40 | compliance |
| PAY-10 | Tax compliance: PH VAT 12% + DOT reporting | P2 | M | Build | $0 | compliance, ph-localization |

### OPS-R — Operations: Rooms Division

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| OPS-R-01 | Housekeeping board v0 (shared Google Calendar — Pattern C) | P2 | L | Configure | $0 | google-workspace, staff-facing, quick-win |
| OPS-R-02 | Housekeeping board custom UI (RoomStatus + assignment + checklist + live updates) | P2 | H | Hybrid | $0 (Pusher free) | staff-facing, differentiator |
| OPS-R-03 | Photo proof of cleaning + inspection sign-off | P3 | M | Build | $0 | staff-facing, risk-reduction |
| OPS-R-04 | Linen & consumable tracking | P3 | M | Build | $0 | staff-facing, internal-tool |
| OPS-R-05 | Room turnaround time metrics dashboard | P4 | M | Build | $0 | internal-tool |
| OPS-R-06 | Lost & found log | P4 | L | Build | $0 | staff-facing |

### OPS-M — Operations: Maintenance & Assets

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| OPS-M-01 | Maintenance ticketing v0 (Google Form → Sheet → Apps Script — Pattern B) | P2 | L | Hybrid | $0 | google-workspace, automation, quick-win |
| OPS-M-02 | Maintenance ticketing custom UI (queue, photos, assignment, SLA) | P3 | H | Build | $0 | staff-facing |
| OPS-M-03 | In-room QR code → guest issue report (auto-tagged to reservation) | P3 | M | Build | $0 | guest-facing, differentiator |
| OPS-M-04 | Asset registry with QR codes (large fixed assets) | P3 | H | Build | $0 | internal-tool, staff-facing |
| OPS-M-05 | Preventive maintenance schedule (per asset cadence) | P4 | M | Build | $0 | automation, risk-reduction |
| OPS-M-06 | Maintenance cost tracking per asset/room | P4 | M | Build | $0 | internal-tool |
| OPS-M-07 | Vendor/contractor directory + work order history | P4 | M | Build | $0 | internal-tool |

### OPS-F — Operations: F&B

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| OPS-F-01 | Loyverse POS integration (webhook ingestion) | P2 | M | Buy | $0–25 per outlet | revenue-direct |
| OPS-F-02 | AncillarySale schema + Folio link | P2 | M | Build | $0 | foundation, revenue-direct |
| OPS-F-03 | "Charge to room" workflow at POS | P2 | M | Build | $0 | differentiator, guest-facing, revenue-direct |
| OPS-F-04 | F&B revenue per outlet dashboard | P3 | M | Build | $0 | internal-tool |
| OPS-F-05 | Restaurant inventory & stock control (Marketman or similar) | P5 | H | Buy | $130+ | internal-tool |
| OPS-F-06 | Recipe / cost-of-goods tracking | P5 | H | Build | $0 | internal-tool |
| OPS-F-07 | Restaurant reservations system | P4 | M | Build | $0 | guest-facing, revenue-direct |

### OPS-S — Operations: Staff

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| OPS-S-01 | StaffUser model + role enum (HOUSEKEEPER / FO / MAINTENANCE / F&B / MGR / OWNER) | P1 | M | Build | $0 | foundation, bottleneck, staff-facing |
| OPS-S-02 | Staff portal home (mobile-first, PWA-ready) | P2 | H | Build | $0 | staff-facing |
| OPS-S-03 | Staff scheduling via Google Calendar (one cal per role — Pattern C) | P2 | L | Configure | $0 | google-workspace, staff-facing, quick-win |
| OPS-S-04 | Timesheets v0 via Google Sheet (Apps Script-validated, audit log) | P3 | L | Build | $0 | google-workspace, automation, staff-facing |
| OPS-S-05 | Timesheets custom UI (clock in/out + manager edit + audit) | P3 | H | Build | $0 | staff-facing, compliance |
| OPS-S-06 | Self-service: shift swap, PTO, request workflow | P4 | H | Build | $0 | staff-facing |
| OPS-S-07 | Staff onboarding checklist + document collection | P4 | M | Hybrid | $0 | google-workspace, staff-facing |
| OPS-S-08 | Staff training tracker + certifications | P5 | M | Build | $0 | staff-facing |

### EVT — Events & Weddings

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| EVT-01 | Event microsite generator — core (EventProject + EventGuest + microsite at events.almejaazul.com/[slug]) | P1 | VH | Build | $0 | differentiator, guest-facing, revenue-direct |
| EVT-02 | Event timeline editor (or Calendar API v0 — Pattern C) | P2 | M | Build | $0 | google-workspace, guest-facing |
| EVT-03 | RSVP form v0 via Google Form → sync to EventGuest | P2 | L | Hybrid | $0 | google-workspace, guest-facing, quick-win |
| EVT-04 | RSVP form custom branded version | P3 | M | Build | $0 | guest-facing |
| EVT-05 | Guest list CSV import + dedup | P2 | M | Build | $0 | staff-facing |
| EVT-06 | Day-of QR check-in (host marks arrivals on phone) | P3 | M | Build | $0 | differentiator, staff-facing |
| EVT-07 | Photo wall (guests upload via QR → auto-album) | P3 | M | Build | $0 | differentiator, guest-facing |
| EVT-08 | Microsite theme picker (wedding / corporate / family templates) | P3 | M | Build | $0 | differentiator |
| EVT-09 | EventMealChoice tracking + kitchen prep report | P3 | M | Build | $0 | staff-facing |
| EVT-10 | Event-specific Drive folder auto-creation (Recipe 1 — Apps Script) | P2 | L | Build | $0 | google-workspace, automation, quick-win |
| EVT-11 | Vendor management per event (caterers, photographers, etc.) | P4 | M | Build | $0 | staff-facing |
| EVT-12 | Event sales pipeline dashboard (Looker Studio) | P3 | M | Hybrid | $0 | google-workspace, internal-tool |
| EVT-13 | Wedding proposal templates (Doc / Sheet templates in Workspace) | P2 | M | Configure | $0 | google-workspace, automation |
| EVT-14 | Event seating chart tool | P4 | H | Build | $0 | guest-facing |
| EVT-15 | Event invoicing + multi-deposit schedule | P3 | H | Build | $0 | revenue-direct, staff-facing |

### ACT — Activities, Spa, Rentals

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| ACT-01 | Resource scheduling v0 (one Google Calendar per resource — Pattern C) | P3 | M | Configure | $0 | google-workspace, staff-facing, quick-win |
| ACT-02 | Resource scheduling custom UI (multi-resource calendar) | P4 | VH | Build | $0 | staff-facing, guest-facing |
| ACT-03 | Guest self-book activities (web + QR) | P4 | H | Build | $0 | guest-facing, revenue-direct |
| ACT-04 | Spa reservation system | P3 | H | Build | $0 | revenue-direct, guest-facing |
| ACT-05 | Activity / rental utilization dashboard | P4 | M | Build | $0 | internal-tool |
| ACT-06 | Kayak / equipment rental check-out/check-in flow | P4 | M | Build | $0 | staff-facing, revenue-direct |
| ACT-07 | Activity instructor scheduling | P4 | M | Build | $0 | staff-facing |

### REV — Revenue & Pricing

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| REV-01 | Occupancy / ADR / RevPAR dashboard (Looker Studio) | P2 | M | Hybrid | $0 | google-workspace, internal-tool, revenue-indirect |
| REV-02 | Channel mix dashboard (direct vs OTA vs travel-agent) | P2 | M | Hybrid | $0 | internal-tool |
| REV-03 | Inquiry-to-booking conversion tracking | P2 | L | Build | $0 | revenue-indirect, internal-tool |
| REV-04 | PriceLabs integration (dynamic pricing recommendations) | P3 | H | Buy | $20–60 | revenue-direct |
| REV-05 | Rate review/accept workflow (manager screen before PMS push) | P3 | M | Build | $0 | revenue-direct, staff-facing |
| REV-06 | 90-day occupancy forecast view | P3 | M | Build | $0 | internal-tool |
| REV-07 | Daily manager report (email at 8am: yesterday + today + tomorrow) | P3 | M | Build | $0 | automation, staff-facing |
| REV-08 | Ancillary revenue per guest tracking | P3 | M | Build | $0 | revenue-direct, internal-tool |
| REV-09 | Maintenance cost per room / asset (ROI view) | P4 | M | Build | $0 | internal-tool |
| REV-10 | Direct-booking lift dashboard (vs OTA commission saved) | P3 | M | Build | $0 | internal-tool, revenue-indirect |

### INV — Inventory Management (non-F&B)

Non-restaurant inventory across Rooms Division, Front Office, Maintenance, Common Areas, and Events.

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| INV-01 | Department-segmented inventory framework (model + admin UI) | P2 | H | Build | $0 | foundation, internal-tool, staff-facing |
| INV-02 | Stock-in / stock-out logging with reason codes | P2 | M | Build | $0 | internal-tool, staff-facing |
| INV-03 | Par-level + reorder alerts (per item, per department) | P3 | M | Build | $0 | automation, internal-tool |
| INV-04 | Mobile count tool (PWA — quick weekly counts) | P3 | M | Build | $0 | staff-facing, internal-tool |
| INV-05 | Purchase order workflow (draft → approved → received) | P4 | H | Build | $0 | internal-tool, staff-facing |
| INV-06 | Cost-per-occupied-room reporting (consumables ÷ occupancy) | P4 | M | Build | $0 | internal-tool, revenue-indirect |

### DOC — Documentation & Workflow (Google Workspace)

These items are Workspace template + automation work, grouped by category per Ben's preference. Each item represents a system, not a single template.

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| DOC-01 | Workspace folder structure standardization (org-wide Drive layout) | P1 | L | Configure | $0 | google-workspace, foundation, quick-win |
| DOC-02 | SOP system + first 10 SOPs (template + index + change-log) | P2 | H | Configure | $0 | google-workspace, internal-tool |
| DOC-03 | Policy library (HR, guest, vendor, data) + initial 5 policies | P2 | M | Configure | $0 | google-workspace, compliance, internal-tool |
| DOC-04 | RFP / RFI template + vendor evaluation rubric | P2 | M | Configure | $0 | google-workspace, internal-tool |
| DOC-05 | Project management tracker template (Sheets + Calendar) | P2 | M | Configure | $0 | google-workspace, internal-tool |
| DOC-06 | Wedding & corporate event proposal templates (Doc) | P2 | M | Configure | $0 | google-workspace, revenue-direct |
| DOC-07 | Vendor agreement / contract template library | P3 | M | Configure | $0 | google-workspace, compliance |
| DOC-08 | Apps Script: auto-create folder + template on new-project trigger | P3 | L | Build | $0 | google-workspace, automation |
| DOC-09 | Apps Script: SOP version control + change log automation | P3 | M | Build | $0 | google-workspace, automation, compliance |
| DOC-10 | Internal knowledge base / wiki (Google Sites) | P3 | M | Configure | $0 | google-workspace, staff-facing |
| DOC-11 | Staff handbook + onboarding doc set | P3 | M | Configure | $0 | google-workspace, staff-facing |
| DOC-12 | Workspace AI plan rollout playbook (Gemini in Docs/Sheets/Gmail for staff) | P3 | L | Configure | $0 | google-workspace, gemini, staff-facing |

### INT — Integrations Platform

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| INT-01 | Webhook bus + retry/dead-letter queue (Vercel Cron or Inngest) | P2 | H | Hybrid | $0 | foundation, risk-reduction |
| INT-02 | SyncLog model + admin dashboard (per-integration health view) | P2 | M | Build | $0 | foundation, internal-tool |
| INT-03 | DataImport / DataExport audit history (any bulk operation) | P3 | M | Build | $0 | compliance, internal-tool |
| INT-04 | Rate limiter for public endpoints (Upstash Redis) | P2 | L | Buy | $0 | security, risk-reduction |
| INT-05 | Background job runner (Vercel Cron initially; Inngest if needed) | P1 | L | Hybrid | $0 | foundation |
| INT-06 | Daily reconciliation cron (compare PMS state vs local DB; alert on drift) | P2 | M | Build | $0 | pms-dependent, risk-reduction |

### AI — AI/ML in Product (Gemini via Vertex — covered by your Workspace AI plan)

| # | Feature | Priority | Effort | B/B | Cost/mo | Tags |
|---|---|---|---|---|---|---|
| AI-01 | Auto-categorize incoming inquiries via Gemini Flash | P3 | L | Buy | ~$1 | gemini, automation |
| AI-02 | Draft Messenger reply suggestions via Gemini | P3 | M | Buy | $2–10 | gemini, messenger-funnel, staff-facing |
| AI-03 | Guest history summarization on guest profile page | P3 | L | Buy | ~$1 | gemini, staff-facing |
| AI-04 | FAQ semantic search (user question → best FAQ match) | P3 | M | Buy | ~$1 | gemini, automation |
| AI-05 | Review summarization for homepage social proof | P3 | L | Buy | <$1 | gemini, guest-facing |
| AI-06 | Pricing-change explanation copy (for REV-05 review screen) | P4 | L | Buy | ~$1 | gemini, internal-tool |
| AI-07 | OG image alt-text auto-generation | P4 | L | Buy | <$1 | gemini, automation |
| AI-08 | Tagalog first-draft translation (for WEB-07) | P4 | M | Buy | $1–3 | gemini, ph-localization |

---

## Backlog totals at a glance

- **Total items:** 138
- **By priority:** P1 = 33 · P2 = 47 · P3 = 41 · P4 = 14 · P5 = 6 (rough — adjust as you re-rank)
- **By disposition:** Build ~75% · Buy ~10% · Hybrid ~10% · Configure ~5%
- **Monthly run-rate at full P1+P2 buildout:** ~$330–410/mo (Cloudbeds if needed, ManyChat, Loyverse, Resend, PayMongo fees per-txn, PriceLabs deferred, Neon paid, accounting, Gemini)

---

## What I consolidated from the inputs

- The ChatGPT output's `ExternalSystem` / `ExternalReservation` / `ReservationMirror` / `BookingSyncLog` / `PaymentIntentMirror` are schema components, rolled into RES-02, RES-04, PAY-04, INT-02.
- `WebhookEvent` / `DataImport` / `DataExport` / `ChangeRequest` rolled into INT-01, INT-02, INT-03, CMS-05.
- "Audit log" referenced in multiple sources rolled into SEC-02 with explicit "key-action tracking" scope.
- The ChatGPT output's "production hardening sprint" rolled into FND-01 through FND-07 plus SEC-01, SEC-02 explicitly. It was a set of items, not one.
- The ChatGPT output's "manager dashboard" rolled into REV-07 (daily report) + multiple Looker Studio items (OBS-06 + REV-01–10).
- Apps Script recipes from [GOOGLE_INTEGRATION_STRATEGY.md](GOOGLE_INTEGRATION_STRATEGY.md) appear as: CRM-11 (birthday/anniversary), OPS-M-01 (maintenance), EVT-10 (event folder), DOC-08 (auto-folder), DOC-09 (SOP versioning).
- Calendar-API-as-v0 stopgaps (Pattern C) appear at OPS-R-01, OPS-S-03, ACT-01, EVT-02 — each paired with the eventual custom build as a separate item so phasing can keep the v0 indefinitely if it works.

## What I intentionally excluded

- **Native mobile apps (iOS/Android)** — overkill for current scale; PWA staff portal covers staff use case.
- **TripAdvisor API integration** — paid + gated; Google + FB reviews cover social proof.
- **Booker / Mindbody for spa** — $150–250/mo and doesn't integrate with your guest profile; ACT-04 builds it.
- **Salesforce / HubSpot** — overkill; CRM-07–14 covers what's actually needed.
- **Restaurant inventory** is P5 (OPS-F-05) — Loyverse covers basic stock; deep inventory is a 2027 problem.
- **Branch-specific OTA contracts** — out of software scope; legal/commercial work.
- **Tagalog full-site translation** — capped at toggle (WEB-07) and machine-first draft (AI-08). Human translation is too much copy for current ROI.

## Open clarifying questions for the re-phasing pass

These don't block the backlog but will sharpen Phase 1 selection:

1. **Quote builder scope** — confirm: internal (CRM-05) is P1, guest-facing (CRM-06) is P2. If guest-facing should be P1, say so.
2. **Loyalty program (CRM-15)** — at 25–60 rooms, this is high impact but requires the Guest schema first (CRM-07). Confirm P2 not P1?
3. **Multi-language Tagalog (WEB-07)** — kept at P4. If you have evidence Tagalog UI lifts conversion meaningfully for your guest demo, push to P3.
4. **Two-factor auth (SEC-06)** — kept at P3 given small admin team. If you ever onboard contract devs, push to P2.
5. **Restaurant reservations system (OPS-F-07)** — kept at P4 since current volume is unclear. If F&B is a destination in its own right (locals booking the restaurant), push to P3.
6. **Restaurant inventory (OPS-F-05)** — kept at P5. Push if F&B cost-of-goods control is currently painful.
7. **Group bookings (RES-08)** — kept at P3. Push to P2 if you do MICE / large family reunions with any regularity.

---

## Next step

Once you've adjusted priorities and added/removed items, the natural next pass is **phasing**: take the P1 set, plus the P2 items that share dependencies, and group into a 3 macro × 3 micro phase plan (similar to v1's [ROADMAP.md](ROADMAP.md) but driven by this richer backlog). I can do that pass when you signal.
