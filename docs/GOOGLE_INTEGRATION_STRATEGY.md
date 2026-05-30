# Google Integration Strategy

The single home for "where does the Google ecosystem fit into Almeja Azul's roadmap" — across all 6 tiers of [FEATURE_PRIORITY.md](FEATURE_PRIORITY.md).

**Context:** Ben already runs Google Workspace (email, Docs, shared Drive across the resort), holds a Google Pro personal plan, a Workspace expanded AI plan (= Gemini in Workspace + Gemini API access), and has Vertex/Gemini API + OpenRouter accounts. Preference is to use what he's already paying for before adding new SaaS.

---

## Principles

1. **Authoring in Google, system of record in Prisma.** Staff can edit content in Sheets/Docs because they already do; sync into Prisma which is the source of truth for the site + apps. Never the inverse.
2. **Use Apps Script before building.** 50 lines of Apps Script often replaces a 2-week feature build. If it's a simple "when X, do Y" workflow, try Apps Script first.
3. **Use Calendar / Forms / Sheets as visual UI before building custom UIs.** Especially for staff-facing scheduling and intake — your team already knows these tools.
4. **Use Gemini API in production where you'd otherwise call Claude/OpenAI.** Your Workspace AI plan covers it; far cheaper than third-party LLM API spend.
5. **Don't force Google where it loses.** Transactional email, image serving, hot-path low-latency APIs — Google products are wrong here. Listed in §Anti-patterns below.

---

## Cross-cutting patterns (reuse these across features)

### Pattern A — "Sheet as authoring surface, DB as truth"
- Staff edit a Sheet (familiar, multi-user, mobile-friendly, offline-capable)
- Service Account + Sheets API
- Vercel Cron job every 5–15 min: diff sheet → upsert into Prisma
- **Safety rules (non-negotiable):** one-way only, whitelisted fields only, never delete, audit log table
- **Used by:** Item 12 (Sheets sync), can extend to FAQ, addons pricing, staff phone numbers, anywhere bulk-edit is faster than admin UI

### Pattern B — "Apps Script for tiny workflows"
- Lives in Google's runtime (no infra)
- Triggered by Sheet edits, Form submissions, Calendar events, or time
- Calls your site's API or Google APIs directly
- **Used by:** wedding inquiry automations, status-change workflows, birthday/anniversary triggers — see §Apps Script Recipe Book below

### Pattern C — "Calendar API as visual scheduler v0"
- Before building custom calendar UI for housekeeping/maintenance/resources/events: one Google Calendar per resource (or shared) is a free, no-code starting point
- Your code reads/writes events via Calendar API
- Migrate to custom UI in Prisma only when Calendar's UX becomes the bottleneck (usually: multi-resource conflict detection, role-based visibility, embedded in staff portal)
- **Used by:** Item 17 (housekeeping shifts), Item 20 (staff schedule), Item 21 (event timeline), Item 22 (resource scheduling — can fully start here)

### Pattern D — "Gemini API for in-product AI"
- Your Workspace AI plan + Vertex access = cheap Gemini calls in production
- Vertex's "Gemini 2.5 Flash" (when stable) and "Gemini 3 Pro" cover almost every LLM use case at ~10–30% the cost of equivalent Claude/OpenAI calls
- Cache aggressively (these are stateless prompts, mostly)
- **Used by:** auto-categorize inquiries, draft Messenger replies, summarize threads, FAQ semantic matching, generate review summaries — see §Gemini in production below

### Pattern E — "Looker Studio over building dashboards"
- Direct Postgres connection (Neon supports it)
- Drag-and-drop dashboard UX, free, share with link
- Auto-refreshes
- **Used by:** all BI in Tier 5+ — never build a dashboard component for internal metrics

### Pattern F — "Drive as media authoring, Vercel Blob as serving"
- Staff already upload photos/videos to a shared Drive
- A sync job watches a specific Drive folder, mirrors approved assets to Vercel Blob (or Cloudflare R2) with optimized variants
- Drive stays the authoring source (where staff dump RAW), Blob is what the site serves
- **Used by:** future media manager upgrade, event photo collection, room re-photography campaigns

---

## Per-tier Google ecosystem index

### Tier 1 — Foundations
*(detailed in [PARALLEL_EXECUTION_TIER1.md](PARALLEL_EXECUTION_TIER1.md))*

| Item | Google angle |
|---|---|
| 1 Domain | Protect Workspace MX/SPF/DKIM/DMARC records during Vercel DNS change |
| 2 Analytics | **GTM container** holds GA4 + Pixel; CAPI server-side |
| 3 Resend | **No** — Gmail SMTP is wrong for transactional |
| 4 Alerts | **Google Chat** webhooks (replaces Slack) |
| 5 SEO | Validate via Search Console + Rich Results Test |
| 6 Perf | PageSpeed Insights + Lighthouse CI + CrUX for measurement |

### Tier 2 — Messenger funnel

| Item | Google angle |
|---|---|
| 7 Messenger bot | **Secondary destination: write leads to a Google Sheet** in addition to your API. Non-technical staff get a live, filterable lead view in a tool they already know. ManyChat's "Google Sheets" action handles this natively. |
| 7 (bot AI) | **Gemini API for FAQ matching:** when a guest message doesn't match any scripted flow, send the message + your FAQ corpus to Gemini, get the best-matched answer, reply. Cache common queries. Costs ~$0.10–0.30/day at expected volume. |
| 8 Inquiry form | Optional: ManyChat-style Sheet secondary destination here too, for parity |
| 9 OG previews | Use Search Console's URL Inspection tool to verify renderings |
| 10 Reviews | **Google Places API** is the source for Google reviews (this IS the Google integration). Optionally use Gemini to generate a one-sentence summary of recent reviews for a "What guests say" homepage block. |
| 11 FAQ/galleries | **FAQ content from a Google Doc:** non-tech staff edit a Doc, Apps Script triggers sync to FAQ table on save. Same pattern as Sheets but for richer text. |
| 11 (media) | Pattern F starts here in mini form: Drive folder per Room/Tour/Venue, manual approve flow into Vercel Blob |

### Tier 3 — Reservations & money

| Item | Google angle |
|---|---|
| 12 Sheets sync | **The flagship Google integration** — already designed around this. Service Account, whitelisted fields, audit log. Add **Gemini in Sheets** (covered by your AI plan) to help staff validate/format data before sync. |
| 13 Reservation v0 | No direct Google angle |
| 14 HMP API | No Google angle |
| 15 PayMongo | No Google angle (Google Pay exists but PH market uses GCash/Maya/bank/cards through PayMongo) |
| 16 Guest profile | **Gemini for guest insights:** on the guest detail page, a "Summarize this guest's history" button calls Gemini with their inquiries/stays/notes → 3-sentence summary. ~$0.001 per call. Surprisingly useful for repeat-guest prep. |
| 16 (CRM extension) | Consider syncing high-value guests to **Google Contacts** so staff can call/email from any Google interface — Apps Script + People API. Defer until volume warrants. |

### Tier 4 — Internal operations

| Item | Google angle |
|---|---|
| 17 Housekeeping | **Pattern C v0:** one Google Calendar named "Housekeeping Assignments" shared with all housekeepers + FO. Each assigned room = a calendar event with checklist in description. Migrate to custom Prisma-backed board when multi-resource conflict detection becomes the constraint. **Saves weeks.** |
| 17 (staff identity) | **Google Identity / Sign in with Google** for staff login. They already have personal Gmail; no new accounts to remember. Cheaper than Auth0/Clerk. Use Auth.js v5 with Google provider. |
| 18 Maintenance | **Pattern B candidate:** start with a Google Form for ticket intake → submissions flow to a Sheet → Apps Script triggers Chat alert + assigns from a rotation. Replaces a 2-week build with 1 day. Migrate to custom UI when guest-side QR reporting becomes a feature. |
| 19 POS | No Google angle (Loyverse direct integration) |
| 20 Staff portal | **Calendar for shifts:** one calendar per role (Housekeeping, FO, F&B, Maintenance) shared with that team. Staff see their shifts in their normal Calendar app. Manager edits in Calendar UI. Your portal reads Calendar API for "my next shift" display. **Pattern C in production.** |
| 20 (timesheets) | **Google Sheet per pay period**, one row per shift, Apps Script-validated. Manager edits get audit-logged in a separate `Audit` tab. Could be your full timesheet system at 25–60-room scale — never need a custom build. |

### Tier 5 — Differentiation

| Item | Google angle |
|---|---|
| 21 Event mini-sites | **Drive folder per event** (Pattern F): one shared Drive folder per wedding/corporate booking holds proposal PDFs, contracts, vendor lists, photos. Apps Script auto-creates the folder + invites the right team when an event reaches "confirmed" state. Site links to relevant public-share Drive items. |
| 21 (event timeline) | **Pattern C:** event's Day-of timeline is a Google Calendar — couple/host can edit on their phone in the Calendar app they already use. Site pulls timeline via Calendar API for the public event mini-site. |
| 21 (RSVP) | **Google Form for v0 RSVP** before building custom form — replace when you need branded UX. Form responses → Sheet → sync to EventGuest. |
| 22 Resource scheduling | **Pattern C: one Google Calendar per resource** (Kayak 1, Kayak 2, Spa Room A, Cabana 3, Pavilion). Staff book via Calendar UI; site shows availability by reading those calendars. Can run *indefinitely* in this state — only build custom UI if guest self-booking becomes a feature with high volume. **Potentially saves a Tier 5-sized build.** |
| 23 Loyalty | No Google angle (program logic in Prisma) |
| 24 Dynamic pricing | **Gemini for pricing explanations:** when PriceLabs recommends a rate change, generate a one-line "why" for the manager review screen ("Demand surge on similar Samal properties for these dates"). Helps managers accept/override with confidence. Not the core engine — PriceLabs stays. |

### Tier 6 — Quality of life

| Item | Google angle |
|---|---|
| 25 Backups | Optional: upload nightly `pg_dump` to **Google Drive** instead of R2/S3. Workspace storage is generous and you already pay for it. Simpler than provisioning S3. |
| 26 Sentry | No Google angle |
| 27 Privacy | Use Google's Privacy Policy generator template + customize. Apps Script for "right to be forgotten" requests received via Form. |
| 28 Multi-language | **Google Cloud Translation API** for initial English → Tagalog draft translation; human-edit before publishing. Use sparingly — machine translation is a draft, not production copy. |

---

## Apps Script recipe book

Concrete scripts worth writing once and reusing. Each is ≤100 lines.

### Recipe 1 — "New wedding inquiry → set up the deal"
**Trigger:** New row in the "Inquiries" Sheet (synced from your API) where `inquiryType = "wedding"`
**Actions:**
1. Create a Drive folder named `{date} - {couple names}` under `/Weddings/2026/`
2. Copy a "Wedding Proposal Template" Doc into the folder
3. Create a Calendar event 3 days out: "Send proposal to {couple}"
4. Post a Card to the Inquiries Chat space with folder link + couple details
5. Update inquiry row with `folderUrl` so the admin UI can show a link

**Replaces:** ~1 hour of manual setup per wedding lead.

### Recipe 2 — "Status change → next-step automation"
**Trigger:** Inquiry's `status` column changes to "CONFIRMED" (via Sheet sync) or by webhook from your API
**Actions:**
1. Calendar event 7 days before stay: "Pre-arrival check {guest}"
2. Calendar event 1 day after stay: "Post-stay outreach {guest}"
3. Drive folder for the guest stay (if event/wedding)
4. Chat ping to FO with arrival details

### Recipe 3 — "Birthday/anniversary detection"
**Trigger:** Daily cron in Apps Script
**Actions:**
1. Query Sheet (synced Guest data) for birthdays/anniversaries within 14 days
2. For each: create Calendar reminder "Handwritten note for {guest}" 7 days out
3. Daily summary email to Ben listing upcoming dates

**Replaces:** A loyalty-system feature you'd otherwise need to build.

### Recipe 4 — "Maintenance Form → Chat alert + assignment"
**Trigger:** New Google Form submission ("Report Maintenance Issue")
**Actions:**
1. Append row to Maintenance Sheet
2. Round-robin assign to a maintenance staff member (rotation tracked in a "RotationState" cell)
3. Chat alert in #maintenance Space with photo + assigned-to
4. Calendar event for the assigned person: "Maintenance: {location}"

**Replaces:** ~75% of the Item 18 build. Build the custom UI only when guest-side QR reporting is needed.

### Recipe 5 — "Event mini-site auto-config"
**Trigger:** Event status flips to "CONFIRMED"
**Actions:**
1. Create event Calendar
2. Add default timeline events (template)
3. Create RSVP Google Form linked to a guest Sheet
4. Create shared Drive folder for couple + planners
5. Send a Chat alert with all relevant links

---

## Gemini in production — when and how

Your Workspace AI plan + Vertex covers Gemini API at a price point dramatically cheaper than Claude/OpenAI from production. **Use Gemini for in-product LLM features.** Reserve Claude/OpenAI for development assistance (Claude Code, etc.).

### Cost reference (Vertex pricing, late-2025/early-2026 era)
- **Gemini 2.5 Flash:** ~$0.075/M input, $0.30/M output → essentially free at your scale
- **Gemini 3 Pro:** ~$1.25/M input, $5/M output → for hard reasoning tasks
- **Gemini 3 Flash** (when available): expected between Flash and Pro

### Use cases ranked by ROI

| Use case | Model | Estimated $/mo | Where it fits |
|---|---|---|---|
| Auto-categorize incoming inquiries (Day Tour / Stay / Event / Wedding / Other) | Flash | < $1 | Item 8/9 — improves dedup + routing |
| Draft Messenger replies for human-review | Flash | $2–10 | Item 7 — saves staff hours |
| Summarize long inquiry threads on guest profile | Flash | < $1 | Item 16 |
| FAQ semantic search (user question → best FAQ match) | Flash + embeddings | < $1 | Item 7, 11 |
| Summarize guest history "what to know about this guest" | Flash | < $1 | Item 16 |
| Review summarization for homepage social proof block | Flash, weekly | < $0.50 | Item 10 |
| Pricing change "explanation" copy | Flash | < $1 | Item 24 |
| Generate first-draft Tagalog translations | Pro | $1–3 | Item 28 |
| OG image alt-text generation | Flash | < $0.50 | Item 5/9 |

**Total Gemini in-product spend at full Tier 5 buildout: ~$10–25/month.**

### Integration sketch

```ts
// lib/ai/gemini.ts
import { VertexAI } from '@google-cloud/vertexai';

const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: 'asia-southeast1',  // Singapore — closest to PH
});

export async function geminiFlash(prompt: string, system?: string) {
  const model = vertex.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
  });
  return result.response.candidates?.[0]?.content.parts[0].text ?? '';
}
```

Cache with Upstash Redis keyed on prompt hash. Most queries (FAQ matches, categorization) are stateless and ~80% cache-hit at steady state.

### When NOT to use Gemini in product

- **Real-time chat with users** where latency matters — Gemini is fast but not always Claude-fast on long contexts
- **Anything legally sensitive** (T&C generation, contract drafting) — these need human review and ideally a different liability model
- **High-stakes pricing/availability decisions** — never let an LLM commit to a price or a booking on your behalf; surface as suggestions only

---

## Anti-patterns — where Google products lose

| Don't do | Reason | Use instead |
|---|---|---|
| Gmail SMTP for transactional email | 2k/day cap, no deliverability tooling, reputation contamination risk | Resend |
| Drive as a media CDN | Slow, rate-limited, ugly URLs | Vercel Blob or Cloudflare R2 |
| Firestore as the primary DB | You're committed to Prisma + Postgres, switching adds a year of work | Stay on Neon |
| Google Domains | Sold to Squarespace in 2023, no longer a Google product | Whichever registrar you use; just protect Workspace DNS records |
| Cloud Functions for site backend | Vercel does this better for Next.js | Stay on Vercel |
| Google Pay as primary payment | PH market is GCash/Maya/bank/cards via PayMongo | PayMongo handles it natively |
| Google Sheets as the live booking calendar | Concurrency + race conditions on hot booking days = lost reservations | Prisma + your reservation state machine |
| Apps Script for high-volume APIs | Quotas (6 min/execution, 30/min trigger rate) | Build it in Next.js when volume justifies |
| Translate API for production copy without human edit | Quality is "draft" not "ship" | Use as starting draft only |

---

## Summary — what changes vs. the original roadmap

Compared to [ROADMAP.md](ROADMAP.md) v1, the Google ecosystem lens **adds** the following items (not in the original plan) and **simplifies** others:

**Additions:**
- GTM container as the tag-management surface (Item 2)
- Google Chat for team alerts (Item 4)
- Gemini API for ~8 small in-product AI features across tiers (~$25/mo total)
- Apps Script automations for wedding/event workflows (saves ~2 weeks of build in Tier 5)
- Google Identity for staff sign-in (Tier 4)
- Looker Studio as the BI layer (Tier 5)

**Simplifications (potentially cuts weeks of build):**
- Maintenance ticketing (Item 18) starts as Google Form + Apps Script
- Resource scheduling (Item 22) can run on Calendar API indefinitely
- Housekeeping board (Item 17) starts as a shared Calendar
- Timesheets (Item 20) live in a Sheet forever at this scale
- Event RSVPs (Item 21) start as Google Forms before custom UI

**Estimated monthly run-rate impact:** unchanged or lower. Google services covered by your existing subscriptions. New spend limited to ~$10–25/mo Gemini API usage at full buildout. Saved build time freed up for higher-leverage Tier 5 features (event mini-sites, loyalty).

---

## Next action

The Google ecosystem integration doesn't change Tier 1 execution. Run the parallel Tier 1 work as already planned in [PARALLEL_EXECUTION_TIER1.md](PARALLEL_EXECUTION_TIER1.md). This document becomes load-bearing in Tier 2 onward — specifically when you build:

1. Item 12 (Sheets sync) — first major Google integration
2. Item 7 (Messenger bot) — Gemini FAQ matching + Sheet destination
3. Item 18 (maintenance) — start with Form + Apps Script
4. Item 17 / 22 (scheduling) — Calendar API v0 before custom UI

When you reach those items, this doc becomes the reference for HOW.
