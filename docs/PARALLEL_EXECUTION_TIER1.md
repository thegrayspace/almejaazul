# Tier 1 — Parallel Execution Guide

How to run the first 6 features across Claude Code, Codex, and Antigravity in parallel without merge conflicts.

**Reference:** [FEATURE_PRIORITY.md §Tier 1](FEATURE_PRIORITY.md)

---

## Assignment summary

| # | Feature | Best tool | Why |
|---|---|---|---|
| 1 | Custom domain | **Claude Code (Opus 4.7)** | Mostly human/Vercel work — Claude verifies middleware + writes the runbook. **Workspace MX records must be preserved.** |
| 2 | GTM + GA4 + Pixel + CAPI | **Claude Code (Opus 4.7)** | Server-side CAPI needs codebase understanding; security-sensitive event hashing. **GTM container replaces individual script tags.** |
| 3 | Resend transactional email | **Codex (GPT-5)** or DeepSeek V3.5 via OpenRouter for cost | Standard SDK integration; well-trodden pattern; React Email templates |
| 4 | Phone alerts (**Google Chat** + Semaphore) | **Codex (GPT-5)** or DeepSeek V3.5 via OpenRouter for cost | Small isolated task; Google Chat webhooks identical to Slack's |
| 5 | SEO baseline | **Claude Code (Opus 4.7)** | Codebase-wide audit + per-page metadata + dynamic OG image generation |
| 6 | Image opt + Core Web Vitals | **Antigravity (Gemini 3)** | Multimodal — can analyze PageSpeed reports + screenshots + network waterfalls natively. Covered by your Workspace AI plan. |

---

## Google ecosystem strategy (the owner already runs Workspace)

Where Google products win because the owner already has them, they replace third-party services in this plan:

| Layer | Google ecosystem choice | Replaces / supplements |
|---|---|---|
| Tag management (Item 2) | **Google Tag Manager** | Hand-coded `<script>` tags |
| Team alerts (Item 4) | **Google Chat** webhooks | Slack |
| Analytics (Item 2) | **GA4 + Search Console** | (default — no replacement) |
| Perf verification (Item 6) | **PageSpeed Insights + Lighthouse CI + CrUX** | (default) |
| SEO validation (Item 5) | **Search Console + Rich Results Test** | (default) |
| Future: BI dashboards | Looker Studio (free, connects to Neon) | Building dashboards |
| Future: media authoring | Google Drive (existing) → sync to Vercel Blob | Custom CMS upload UI for staff |
| Future: scheduling | Google Calendar API for staff shifts/events | Custom calendar build |
| Future: surveys | Google Forms (Tier 6) | Survey tool buy |
| Future: tiny automations | Google Apps Script | Building one-off integrations |
| Future: in-product AI | Gemini API via Vertex (covered by Workspace AI plan) | Calling Claude/OpenAI from production |

Where Google products LOSE in this plan and why:

| Job | What you might think | Why it's wrong |
|---|---|---|
| Transactional email | Gmail SMTP via Workspace | 2k/day cap, no deliverability tooling, reputation contamination risk with personal Gmail. **Stay with Resend.** |
| Image hosting | Google Drive | Rate-limited, slow, ugly URLs. Keep Vercel's image pipeline. |
| Domain registrar | Google Domains | Sold to Squarespace in 2023 — no longer a Google product. |
| Database | Cloud SQL / Firestore | You're on Neon Postgres + Prisma — works great, don't migrate. |

## AI development tool — cost-conscious alternatives

| Tier 1 item | Default tool | Cost-optimized alternative |
|---|---|---|
| 1, 2, 5 | Claude Code (subscription — included) | — keep, needs codebase depth |
| 3 (Resend), 4 (alerts) | Codex (GPT-5 — paid API/sub) | **DeepSeek V3.5 via OpenRouter** — ~$0.27/M input, $1.10/M output. Tasks are small + well-defined; quality gap doesn't matter here. |
| 6 (perf/images) | Antigravity (Gemini 3 — covered by your Workspace AI plan) | — keep |

## Coordination rules (read first)

1. **One branch per task.** Naming: `t1-{number}-{slug}` (e.g., `t1-3-resend-email`). Never push directly to `main`.
2. **Each task creates its own module** in `lib/{domain}/`. Modifications to `app/layout.tsx` or `app/api/inquiries/route.ts` are limited to single-line imports + invocations.
3. **Merge order when PRs are ready** (to minimize conflicts): 1 → 6 → 4 → 3 → 2 → 5. Domain first (env vars), image opt is independent, alerts before email (email imports alerts), Pixel/SEO last because both touch `app/layout.tsx`.
4. **Each prompt declares "Files I will touch"** so the others know what's off-limits.
5. **Each prompt declares "Out of scope"** so the agent doesn't expand the task.

---

## Item 1 — Custom domain on `almejaazul.com`

**Tool:** Claude Code (Opus 4.7)
**Branch:** `t1-1-domain-setup`
**Files touched:** `middleware.ts` (verify), `docs/runbooks/DOMAIN.md` (new), `.env.example` (add NEXT_PUBLIC_SITE_URL)

**Workspace safety note:** Almeja Azul already runs email on Google Workspace. The MX, SPF, DKIM (`google._domainkey`), and DMARC records belong to Workspace and must NOT be changed when pointing the domain at Vercel. Only A/CNAME records for `@` and `www` (and `book`, `events`, `staff` subdomains) should be touched. The runbook below makes this explicit.

### Prompt to paste

```
You are setting up the production domain for Almeja Azul, a Next.js 15
beach resort site deployed on Vercel.

Context to read first:
- C:\projects\almejaazul\CLAUDE.md (project conventions + Vercel gotchas)
- C:\projects\almejaazul\docs\FEATURE_PRIORITY.md (Item 1 only — Custom domain)
- C:\projects\almejaazul\middleware.ts (verify no domain assumptions)
- C:\projects\almejaazul\next.config.* (check for domain-coupled config)

Your job has two parts:

PART A (code):
1. Add NEXT_PUBLIC_SITE_URL to .env.example with value
   "https://almejaazul.com" and a comment.
2. Search the codebase for hardcoded *.vercel.app references and any
   absolute URLs that assume Vercel preview domain. Replace with
   NEXT_PUBLIC_SITE_URL where appropriate.
3. Add a www → apex 308 redirect in next.config (NOT middleware — the
   project explicitly keeps middleware as a no-op per CLAUDE.md).
4. Verify the iron-session cookie config doesn't pin the domain
   incorrectly. If it does, fix.

PART B (runbook):
Create docs/runbooks/DOMAIN.md with step-by-step instructions for the
human owner (Ben) to:
1. BEFORE TOUCHING DNS: log into the domain registrar and screenshot the
   current DNS record table. The owner runs Google Workspace email on
   this domain — the following records MUST be preserved untouched:
   - All MX records (Workspace mail servers — typically
     smtp.google.com priority 1, etc.)
   - SPF TXT record (`v=spf1 include:_spf.google.com ~all`)
   - DKIM record (`google._domainkey` selector)
   - DMARC TXT record at `_dmarc`
   - Any `google-site-verification` TXT records
   Only A and CNAME records for the web subdomains will be added/changed.
2. Add the domain in Vercel → Settings → Domains
3. Configure DNS records at the registrar (cover both apex `@` and `www`,
   and the `book.almejaazul.com`, `events.almejaazul.com`,
   `staff.almejaazul.com` subdomains for future Tier 3+ use)
4. Verify the Workspace email still works after DNS change (send a test
   email to and from `ben@thegray.space` to a non-Google address)
5. Verify SSL auto-provisioning on the Vercel side
6. Add NEXT_PUBLIC_SITE_URL to Vercel env vars (Production scope)
7. Re-deploy and verify

Acceptance criteria:
- No hardcoded vercel.app domains remain
- next.config redirects www → apex
- Runbook is clear enough that a non-developer could follow it
- All four .env vars from CLAUDE.md still work locally

Out of scope:
- Do NOT touch any other Tier 1 work (analytics, email, SEO — they have
  their own branches)
- Do NOT add new middleware
- Do NOT alter the auth flow
```

---

## Item 2 — Google Tag Manager + GA4 + Meta Pixel + Conversions API

**Tool:** Claude Code (Opus 4.7)
**Branch:** `t1-2-gtm-analytics-capi`
**Files touched:** `lib/analytics/` (new dir), `app/layout.tsx` (single-line import + component placement), `app/api/inquiries/route.ts` (single-line CAPI call), `.env.example` (3 new vars)

**Why GTM:** the owner already runs Google Workspace and prefers ongoing management without code deploys. GTM is one container that holds GA4, Meta Pixel, and any future tags — added/paused through GTM's web UI rather than re-deploying. CAPI stays server-side in code.

### Prompt to paste

```
You are adding Google Tag Manager + GA4 + Meta Pixel + Meta Conversions
API to Almeja Azul, a Next.js 15 resort site. 90%+ of the site's traffic
comes from the Facebook page, so Pixel + CAPI accuracy matters more here
than usual. The owner uses Google Workspace and prefers tag management
via GTM rather than hardcoded script tags so non-developers can manage
tags later.

Context to read first:
- C:\projects\almejaazul\CLAUDE.md (full file)
- C:\projects\almejaazul\docs\FEATURE_PRIORITY.md (Item 2 — GA4 + Pixel + CAPI)
- C:\projects\almejaazul\app\layout.tsx
- C:\projects\almejaazul\app\api\inquiries\route.ts
- C:\projects\almejaazul\prisma\schema.prisma

Strategy:
- GTM container = the single client-side script in <head>. GA4 + Meta
  Pixel are installed AS TAGS inside GTM (configured in the GTM web UI,
  not in code). That way the owner can later add Hotjar, LinkedIn pixel,
  etc. without a code deploy.
- CAPI (server-side) stays in code because it needs server context and
  PII hashing.

Build a self-contained analytics module at lib/analytics/:

- lib/analytics/gtm.tsx — <GoogleTagManager> client component (Next 15
  Script). Two parts: head snippet (strategy="afterInteractive") and
  noscript iframe in body. Reads NEXT_PUBLIC_GTM_ID. No-op if env unset
  or NODE_ENV !== 'production'.

- lib/analytics/datalayer.ts — helper pushDataLayer(event, payload)
  for triggering custom GTM events from code (e.g., "InquirySubmitted"
  from the booking form on success). Type-safe events.

- lib/analytics/meta-capi.ts — server-side helper sendCapiEvent(event,
  userData, customData). Meta Conversions API v18+. Hash email + phone
  with SHA-256 (Node crypto) before sending. Reads META_PIXEL_ID +
  META_CAPI_ACCESS_TOKEN. Generates event_id (cuid) and includes it so
  Meta can dedupe between Pixel-side (via GTM) and CAPI-side events.

- lib/analytics/index.ts — barrel exports

Integrate:
1. In app/layout.tsx: render <GoogleTagManager /> in the appropriate
   slots (head script + body noscript). Single conditional block.
2. In app/api/inquiries/route.ts: after prisma.inquiry.create(), fire
   sendCapiEvent('Lead', { email, phone }, { source: pageSlug,
   event_id }). Wrap in try/catch — analytics failure must never break
   the inquiry flow.

Add to .env.example:
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
META_PIXEL_ID=                       # for CAPI server-side calls
META_CAPI_ACCESS_TOKEN=
META_CAPI_TEST_EVENT_CODE=           # optional, for testing

Also create docs/runbooks/GTM_SETUP.md with step-by-step instructions
for Ben to:
1. Create GTM container at tagmanager.google.com
2. Inside the container, add a GA4 Configuration tag with his GA4 ID
3. Inside the container, add a Meta Pixel tag with his Pixel ID
4. Add a trigger that fires Meta Pixel "Lead" event when the dataLayer
   gets {event: "InquirySubmitted"}
5. Configure event_id passthrough on the Pixel tag so it dedupes against
   CAPI

Acceptance criteria:
- Single GTM container script in <head> on all public pages in production
- Submitting the inquiry form fires:
  (a) dataLayer push from client → GTM picks up → Pixel sends event
  (b) CAPI POST from server with same event_id (so Meta dedupes)
- Analytics failures never break inquiry creation
- No PII sent to CAPI in raw form — always SHA-256 hashed
- The runbook is clear enough that a non-developer can configure GTM

Out of scope:
- Do NOT install GA4 or Meta Pixel directly in code (everything goes
  through GTM client-side)
- Do NOT touch cookie consent banner (Tier 6)
- Do NOT add other event types beyond Lead — reservation events in Tier 3
- Do NOT modify any Prisma schema
- Do NOT add or change SEO metadata (separate task — Item 5)
```

---

## Item 3 — Resend transactional email

**Tool:** Codex (GPT-5)
**Branch:** `t1-3-resend-email`
**Files touched:** `lib/email/` (new dir), `app/api/inquiries/route.ts` (single-line import + call), `.env.example`, `package.json`

### Prompt to paste

```
You are adding transactional email to Almeja Azul, a Next.js 15 resort
site. Currently inquiries are saved to the DB silently — nobody emails
the guest or notifies the owner.

Context to read first:
- C:\projects\almejaazul\CLAUDE.md (project setup)
- C:\projects\almejaazul\docs\FEATURE_PRIORITY.md (Item 3 only — Resend
  transactional email)
- C:\projects\almejaazul\app\api\inquiries\route.ts (where you'll
  invoke the send)
- C:\projects\almejaazul\prisma\schema.prisma (Inquiry model fields)
- C:\projects\almejaazul\lib\site-data.ts (resort name, address, contact
  info used in email signatures)

Install:
- resend
- react@^19 already installed
- @react-email/components

Build a self-contained email module:
- lib/email/client.ts — exports a Resend client initialized with
  RESEND_API_KEY
- lib/email/templates/InquiryGuestConfirmation.tsx — React Email
  component. Subject: "We received your inquiry — Almeja Azul". Branded
  with resort colors from styles/brand.css (#1a2530 navy, #4BBFE0 teal,
  #f0ece3 warm off-white). Includes: greeting with guest name, summary
  of what they inquired about, expected response time (4 business
  hours), resort contact info (phone + Messenger link from SiteSettings).
- lib/email/templates/InquiryOwnerNotification.tsx — React Email
  component. Subject: "[NEW INQUIRY] {inquiryType} — {name}". Plain,
  utilitarian. Includes all inquiry fields, link to admin detail page
  (use NEXT_PUBLIC_SITE_URL + /admin/inquiries/{id}).
- lib/email/send-inquiry-emails.ts — exports sendInquiryEmails(inquiry)
  that fires both emails in parallel. Returns void; logs errors but
  never throws.

Integrate:
- In app/api/inquiries/route.ts: after prisma.inquiry.create(), call
  sendInquiryEmails(newInquiry). Do NOT await in a way that blocks the
  response — use ctx.waitUntil() if available, else fire-and-forget with
  proper error logging.

Add to .env.example:
RESEND_API_KEY=
EMAIL_FROM=Almeja Azul <hello@almejaazul.com>
EMAIL_OWNER_NOTIFICATION=ben@thegray.space

Acceptance criteria:
- Submitting an inquiry sends two emails (guest confirmation + owner
  notification)
- Email failure never blocks the API response or causes a 500
- Templates render correctly in Gmail, Apple Mail, Outlook (use
  React Email's preview server to verify)
- All copy uses resort tone (warm, brief, no marketing fluff)

Out of scope:
- Do NOT add marketing/broadcast email (Tier 5 work)
- Do NOT add the new-inquiry phone alert (separate Item 4 branch handles
  that)
- Do NOT modify the Inquiry model
- Do NOT add other email types (pre-arrival, post-stay) — those land in
  Tier 3
```

---

## Item 4 — New-inquiry phone alerts (Google Chat + Semaphore SMS)

**Tool:** Codex (GPT-5) or DeepSeek V3.5 via OpenRouter for cost
**Branch:** `t1-4-inquiry-alerts`
**Files touched:** `lib/alerts/` (new dir), `app/api/inquiries/route.ts` (single-line import + call), `.env.example`

**Why Google Chat:** the owner already runs Google Workspace, so Google Chat is free and the team is already there. Webhook format is similar to Slack's. Saves adding Slack to the stack.

### Prompt to paste

```
You are adding new-inquiry phone alerts to Almeja Azul, a Next.js 15
resort site. The owner needs to know within seconds when a new lead
comes in, especially for wedding/corporate inquiries that arrive outside
business hours.

The owner already uses Google Workspace, so Google Chat is the primary
team alerting channel (NOT Slack). PH SMS via Semaphore is the
secondary/redundant channel.

Context to read first:
- C:\projects\almejaazul\CLAUDE.md
- C:\projects\almejaazul\docs\FEATURE_PRIORITY.md (Item 4 — Phone alerts)
- C:\projects\almejaazul\app\api\inquiries\route.ts
- C:\projects\almejaazul\prisma\schema.prisma (Inquiry model)

Build TWO alert channels (both optional based on env presence) in a
self-contained module:

- lib/alerts/google-chat.ts — sendGoogleChatAlert(inquiry). POSTs to
  GOOGLE_CHAT_WEBHOOK_URL with a Google Chat card v2 formatted message:
  header with title "📩 New {inquiryType} inquiry" + subtitle (guest
  name), section with key/value pairs (contact, dates, guest count,
  source page), button linking to /admin/inquiries/{id} (use
  NEXT_PUBLIC_SITE_URL). Reference: https://developers.google.com/chat/api/reference/rest/v1/cards
  If GOOGLE_CHAT_WEBHOOK_URL is unset, no-op silently.

- lib/alerts/sms.ts — sendSmsAlert(phone, message). Uses Semaphore PH
  SMS API (https://semaphore.co/docs). POSTs to
  https://api.semaphore.co/api/v4/messages with apikey
  (SEMAPHORE_API_KEY), number (SEMAPHORE_ALERT_RECIPIENT — owner's PH
  mobile), message (140 chars max). If env unset, no-op silently.

- lib/alerts/notify-new-inquiry.ts — orchestrator that calls both in
  parallel. SMS format: "Almeja Azul: New {type} from {name}, {phone}.
  Check Google Chat." Returns void; logs errors but never throws.

Integrate:
- In app/api/inquiries/route.ts: after prisma.inquiry.create(), call
  notifyNewInquiry(newInquiry). Fire-and-forget with try/catch.

Add to .env.example:
GOOGLE_CHAT_WEBHOOK_URL=             # optional, from chat space settings
SEMAPHORE_API_KEY=                   # optional
SEMAPHORE_ALERT_RECIPIENT=           # optional, e.g., 09993088800

Also create docs/runbooks/GOOGLE_CHAT_ALERTS.md with steps to:
1. Create a "Inquiries" space in Google Chat
2. Add Apps & Integrations → Webhooks → name it "Almeja Azul Site"
3. Copy the webhook URL into Vercel env vars
4. Test with curl

Acceptance criteria:
- Submitting an inquiry posts to the Google Chat space within ~2 seconds
- SMS arrives on owner phone within ~5 seconds (Semaphore typical)
- Either channel can be disabled independently by removing its env vars
- API response time NOT affected by alert sending (fire-and-forget)

Out of scope:
- Do NOT integrate Slack, WhatsApp, or Discord
- Do NOT send emails (Item 3 handles that, separate branch)
- Do NOT add alert preferences UI in admin (over-scoped for v1)
- Do NOT modify the Inquiry model
```

---

## Item 5 — SEO baseline (sitemap, robots, schema.org, OG)

**Tool:** Claude Code (Opus 4.7)
**Branch:** `t1-5-seo-baseline`
**Files touched:** `app/sitemap.ts` (new), `app/robots.ts` (new), `lib/seo/` (new dir), `app/layout.tsx` (single-line JSON-LD injection), per-page `metadata` exports across all `app/(public)/**/page.tsx`

### Prompt to paste

```
You are adding the SEO baseline to Almeja Azul, a Next.js 15 resort site
on Samal Island, Philippines. With 90%+ of current traffic from
Facebook, every link shared in Messenger needs to render a polished
preview, and Google's hotel knowledge panel must pick up this property.

Context to read first:
- C:\projects\almejaazul\CLAUDE.md
- C:\projects\almejaazul\docs\FEATURE_PRIORITY.md (Items 5 AND 9 — SEO
  baseline + FB link previews. Combine them; one branch is cleaner.)
- C:\projects\almejaazul\app\layout.tsx (root layout)
- C:\projects\almejaazul\app\(public)\page.tsx and all sibling
  page.tsx files (audit metadata exports)
- C:\projects\almejaazul\prisma\schema.prisma (SiteSettings fields used
  in schema.org JSON-LD)
- C:\projects\almejaazul\lib\site-data.ts

Build deliverables:

1. app/sitemap.ts — Next 15 native sitemap. Pull all published Room /
   Tour / Venue / EventPackage / DayPass entries from Prisma; include
   their /stay, /see, /build detail anchor URLs. Add the 7 main public
   pages. Set priority + changefreq sensibly. Return MetadataRoute.Sitemap.

2. app/robots.ts — Next 15 native robots. Allow all public routes,
   disallow /admin and /api. Reference the sitemap.

3. lib/seo/jsonld.ts — generateHotelJsonLd(siteSettings). Returns a
   schema.org @graph with LocalBusiness + Hotel + LodgingBusiness types,
   address (PostalAddress), geo (GeoCoordinates — use 7.0833, 125.7167
   for Samal placeholder, document this), phone, sameAs (facebookUrl,
   instagramUrl), priceRange "₱₱". Suitable for rendering as
   <script type="application/ld+json">.

4. lib/seo/og.ts — generateOgMetadata({title, description, imageUrl,
   path}) helper that returns the openGraph + twitter Metadata fields
   in a consistent shape. Default image fallback to a high-quality hero
   from /uploads.

5. app/api/og/route.tsx — dynamic OG image generation using next/og's
   ImageResponse. Accept query params (type, id) to fetch a Room / Tour
   / Venue / Event entity from Prisma and render a 1200×630 branded
   card: photo on left, resort logo + name + price-from + capacity on
   right, brand colors. Used by per-page metadata as the openGraph image.

6. Integrate in app/layout.tsx: inject the JSON-LD as a
   <script type="application/ld+json"> server-rendered (NOT a client
   component). Read SiteSettings once at request time.

7. Audit every app/(public)/**/page.tsx — ensure each has an exported
   metadata (or generateMetadata for dynamic pages) that uses
   generateOgMetadata. Detail pages (room, tour, venue) point their
   openGraph.images to /api/og?type=room&id={id}.

Acceptance criteria:
- Validate at https://search.google.com/test/rich-results — Hotel +
  LocalBusiness pass
- Validate at https://developers.facebook.com/tools/debug — each public
  URL shows a proper preview card with the right image
- /sitemap.xml and /robots.txt return valid responses
- /api/og?type=room&id=... returns a PNG within 2 seconds
- All public pages have a unique title + description (no duplicates)

Out of scope:
- Do NOT add GA4, Pixel, or CAPI (separate branch — Item 2)
- Do NOT add cookie consent banner
- Do NOT change page CSS or visual design
- Do NOT modify the Prisma schema
- Do NOT touch admin pages
```

---

## Item 6 — Image optimization + Core Web Vitals

**Tool:** Antigravity (Gemini 3) — its multimodal strength + native browser tooling fits this task best
**Branch:** `t1-6-perf-images`
**Files touched:** `next.config.*`, `app/(public)/**/page.tsx` (selective `priority` flag adds), `components/public/**`, image assets in `public/uploads/`

### Prompt to paste

```
You are optimizing image performance and Core Web Vitals for Almeja
Azul, a Next.js 15 resort site. Mobile users on PH 4G are the bulk of
traffic (most coming from Facebook Messenger link clicks). Current
LCP and total page weight have never been audited.

Context to read first:
- C:\projects\almejaazul\CLAUDE.md (project conventions)
- C:\projects\almejaazul\docs\FEATURE_PRIORITY.md (Item 6 only — Image
  optimization + CWV)
- C:\projects\almejaazul\next.config.* (current image config)
- C:\projects\almejaazul\app\(public)\page.tsx (homepage — likely
  worst LCP)
- C:\projects\almejaazul\public\uploads\ (current image library)

Your task uses your multimodal abilities — when the dev server is
running, take screenshots and run PageSpeed Insights for visual
verification, not just code reasoning.

Step 1 — audit:
1. Start the dev server (npm run dev). Visit /, /stay, /day-tour,
   /fun, /build, /see.
2. For each, capture: a full-page screenshot, Chrome DevTools
   Performance trace summary, network waterfall.
3. Run PageSpeed Insights against the production URL if available,
   otherwise against localhost. Capture LCP, CLS, INP, total transfer
   size, image-specific recommendations.
4. Identify the 5 heaviest images and the LCP element on each page.

Step 2 — fix:
1. For every above-the-fold image, ensure `priority` is set on
   next/image. Add explicit width/height to prevent CLS.
2. For every below-the-fold image, ensure lazy loading (default for
   next/image, but verify).
3. Convert hero/large JPGs to optimized WebP (and AVIF where it saves
   >20%). Use sharp or squoosh-cli to batch-convert; keep originals in
   /public/uploads/originals/ and reference the new optimized versions.
4. Update next.config.* image config: explicit deviceSizes,
   imageSizes, formats: ['image/avif', 'image/webp'].
5. Audit hero images on the home page — these are the LCP element on
   mobile. Ensure responsive `sizes` attribute is set correctly.
6. Add `fetchPriority="high"` on the LCP image element.
7. Verify font loading uses next/font (CLAUDE.md says it does — confirm
   no FOUT/FOIT).

Step 3 — verify:
1. Re-run PageSpeed Insights. Target: LCP < 2.5s on mobile, CLS < 0.1,
   INP < 200ms.
2. Capture before/after screenshots and metrics in
   docs/audits/CWV_2026-05.md (new file). Include the PageSpeed
   Insights URL for both runs.

Acceptance criteria:
- Mobile LCP < 2.5s on the homepage (measured via PageSpeed Insights)
- No CLS regressions
- Total homepage transfer size reduced by at least 40%
- All optimized images committed under /public/uploads/ (not external
  CDN — keep the deployment simple)
- Audit report at docs/audits/CWV_2026-05.md with screenshots and
  metrics

Out of scope:
- Do NOT change layout, design, or copy
- Do NOT migrate to an external image CDN (Cloudflare/Imgix) — defer
  that to Tier 4 if needed
- Do NOT add SEO metadata changes (separate branch — Item 5)
- Do NOT modify the Prisma schema
- Do NOT touch /admin pages
```

---

## Recommended execution sequence

**Day 1 (morning):**
- You: open 3 terminals/windows, one per tool.
- **Claude Code:** start Item 1 (domain) — small task, gets you the env var setup done.
- **Codex:** start Item 4 (alerts) — smallest task, gets a fast win.
- **Antigravity:** start Item 6 (image audit) — independent of everything else, takes longest.

**Day 1 (afternoon):**
- **Claude Code:** start Item 2 (analytics) on a fresh branch.
- **Codex:** start Item 3 (email) after Item 4 PR opens.
- **Antigravity:** continue Item 6.

**Day 2:**
- **Claude Code:** start Item 5 (SEO) on a fresh branch.
- **Codex:** review/finalize PRs.
- **Antigravity:** finish Item 6, run final PSI check.

**Day 2 (afternoon) — merge order:**
1. PR #1 (domain) → main
2. PR #6 (perf) → main
3. PR #4 (alerts) → main
4. PR #3 (email) → main (will have a 1-line conflict with #4 in inquiries/route.ts — trivial)
5. PR #2 (Pixel/CAPI) → main (1-line conflict in layout.tsx with #5 — trivial)
6. PR #5 (SEO) → main (will conflict with #2 in layout.tsx — resolve by combining the two single-line additions)

All 6 merged within 2–3 days. Total monthly cost added: ~$35–45 (Resend free tier + ManyChat in Tier 2 + Semaphore SMS pennies).

---

## What you provide to each tool

Each prompt is self-contained, but here's the file set each tool will need read access to. If your tool requires you to "load context" explicitly, point it at these:

**Always include:**
- `CLAUDE.md`
- `docs/FEATURE_PRIORITY.md` (the relevant item section)

**Per-task additional reads:**
- Item 1: `middleware.ts`, `next.config.*`
- Item 2: `app/layout.tsx`, `app/api/inquiries/route.ts`, `prisma/schema.prisma`
- Item 3: `app/api/inquiries/route.ts`, `lib/site-data.ts`, `styles/brand.css`
- Item 4: `app/api/inquiries/route.ts`, `prisma/schema.prisma`
- Item 5: All `app/(public)/**/page.tsx`, `app/layout.tsx`, `prisma/schema.prisma`
- Item 6: `next.config.*`, all `app/(public)/**/page.tsx`, `public/uploads/`

---

## A note on quality control

Running three agents in parallel multiplies your review burden. Two safeguards:

1. **Branch protection:** require all 6 PRs to pass `npm run build` + `npm run lint` before merge. CI is free on Vercel/GitHub.
2. **Spot-check each PR yourself for:** secrets in code (should all be env vars), error-handling that doesn't swallow real failures, and that each PR stayed in scope (no agent should be touching files outside its "files touched" declaration above).

If you only have time to deep-review one, deep-review Item 2 — Pixel + CAPI has the highest blast radius if done wrong (PII leak, broken inquiry flow, ghost analytics events).
