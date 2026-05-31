# GTM Setup Runbook — Almeja Azul

This runbook walks you (Ben) through wiring up analytics for the site. The
site already loads **one** script — Google Tag Manager (GTM). Everything else
(GA4, Meta Pixel, future tags like Hotjar or LinkedIn) is configured **inside
GTM's web UI** — no code change, no deploy.

You will end this runbook with:

1. A GTM container ID set on Vercel as `NEXT_PUBLIC_GTM_ID`.
2. **GA4 Configuration** tag firing on every page.
3. **Meta Pixel base code** firing on every page.
4. **Meta Pixel "Lead" event** firing when an inquiry form is submitted,
   tagged with an `event_id` that matches the server-side Conversions API
   call so Meta dedupes the two and doesn't double-count.

Plan on ~45 minutes the first time. You only do it once.

---

## 0. Prerequisites

Have ready:

- Your Google Workspace account (for GTM + GA4).
- Your Meta Business Manager access (for Pixel + CAPI access token).
- Vercel project access (to set environment variables).

---

## 1. Create the GTM container

1. Go to **<https://tagmanager.google.com>** and sign in.
2. Click **Create Account**.
   - Account Name: `Almeja Azul`
   - Country: `Philippines`
   - Container Name: `almejaazul.com`
   - Target platform: **Web**
3. Accept the GTM Terms of Service.
4. You'll see your container ID in the top right — looks like **`GTM-XXXXXXX`**.
   Copy it.

> **Close** the "Install Google Tag Manager" code snippet popup that appears —
> we install it via env var, not by pasting code.

### Set the env var on Vercel

1. Vercel → **almejaazul** project → **Settings** → **Environment Variables**.
2. Add:
   - Key: `NEXT_PUBLIC_GTM_ID`
   - Value: `GTM-XXXXXXX` (your real ID)
   - Environments: **Production** only (we don't want analytics firing in
     Preview deployments)
3. Trigger a redeploy: Deployments → latest production → **Redeploy**.

Once live, view source on the home page and confirm you can see a line like
`<script ... src="...googletagmanager.com/gtm.js?id=GTM-XXXXXXX"...>`. If not,
the env var didn't make it in — check it's set on Production and redeploy.

---

## 2. Add the GA4 Configuration tag

This makes GA4 fire on every page.

1. First, get your GA4 Measurement ID:
   - Go to **<https://analytics.google.com>** → Admin → **Data Streams** →
     **Add stream** → **Web** → enter `https://almejaazul.com`, stream name
     `Almeja Azul Web`.
   - Copy the **Measurement ID** at the top — looks like `G-XXXXXXXXXX`.

2. Back in GTM (<https://tagmanager.google.com>, inside your container):
   - Left sidebar → **Tags** → **New**.
   - Tag name (top left): `GA4 — Configuration`.
   - **Tag Configuration** → choose **Google Tag**.
   - **Tag ID**: paste your `G-XXXXXXXXXX`.
   - **Triggering** → **All Pages**.
   - **Save** (top right).

---

## 3. Add the Meta Pixel base tag

This makes the Pixel base code fire on every page so it can track pageviews
and remarketing audiences.

1. Get your Pixel ID from Meta:
   - **<https://business.facebook.com/events_manager>** → choose the Pixel
     (or create one named `Almeja Azul Pixel`).
   - The numeric **Pixel ID** is at the top — looks like `123456789012345`.

2. In GTM → **Tags** → **New**:
   - Tag name: `Meta Pixel — Base`.
   - **Tag Configuration** → **Discover more tag types in the Community
     Template Gallery** → search **"Facebook Pixel"** by `facebookarchive` /
     `gtm-templates-simo-ahava` (whichever is currently top-rated; either
     works). **Add to workspace** → **Add**.
   - In the tag config:
     - **Facebook Pixel ID(s)**: your Pixel ID.
     - **Event**: `PageView` (the default; this is the standard base load).
   - **Triggering** → **All Pages**.
   - **Save**.

> If you'd rather not use a community template, use a **Custom HTML** tag and
> paste the Pixel base snippet from Events Manager → Settings → Continue
> Pixel Setup → Install code manually. Same effect.

---

## 4. Add the dataLayer trigger for inquiry submissions

The site pushes a `dataLayer` event named **`InquirySubmitted`** whenever an
inquiry form is successfully submitted. The push includes an `event_id` —
this is the dedup key.

1. GTM → left sidebar → **Triggers** → **New**.
2. Trigger name: `Custom Event — InquirySubmitted`.
3. **Trigger Configuration** → **Custom Event**.
4. Event name: `InquirySubmitted` (exact spelling, case-sensitive).
5. This trigger fires on **All Custom Events**.
6. **Save**.

### Expose the `event_id` and other fields as Variables

So your Pixel Lead tag can read them.

1. Left sidebar → **Variables** → **User-Defined Variables** → **New**.
2. Name: `dlv — event_id`.
3. **Variable Configuration** → **Data Layer Variable**.
4. Data Layer Variable Name: `event_id`.
5. **Save**.

Repeat for two more variables (same pattern):

- Name: `dlv — inquiry_type`, Data Layer Variable Name: `inquiry_type`
- Name: `dlv — source_page`, Data Layer Variable Name: `source_page`

---

## 5. Add the Meta Pixel "Lead" event tag

This fires when an inquiry is submitted. The `event_id` makes it dedupe
against the Conversions API call coming from the server.

1. GTM → **Tags** → **New**.
2. Tag name: `Meta Pixel — Lead`.
3. **Tag Configuration** → same Facebook Pixel template you used in Step 3.
4. Configure:
   - **Facebook Pixel ID(s)**: same Pixel ID.
   - **Event**: `Lead` (or **Standard Event** → Lead, depending on template).
   - **Event ID** (sometimes labelled **eventID** or **Deduplication ID**):
     `{{dlv — event_id}}` — this is what makes the dedup work.
   - **Custom data** (optional but useful):
     - `content_name` → `{{dlv — inquiry_type}}`
     - `source_page` → `{{dlv — source_page}}`
5. **Triggering** → choose `Custom Event — InquirySubmitted` (from Step 4).
6. **Save**.

> **If your Pixel template doesn't expose an `event_id` / `eventID` field**,
> switch to a **Custom HTML** tag with this body — same effect:
>
> ```html
> <script>
>   fbq('track', 'Lead', {
>     content_name: {{dlv — inquiry_type}},
>     source_page: {{dlv — source_page}}
>   }, {
>     eventID: {{dlv — event_id}}
>   });
> </script>
> ```
>
> Set the trigger to `Custom Event — InquirySubmitted`.

---

## 6. Conversions API (server-side) — env vars

The server fires a matching `Lead` event to Meta directly. This survives
ad-blockers and iOS privacy restrictions, which is why it captures ~30% more
events than Pixel alone.

1. **<https://business.facebook.com/events_manager>** → your Pixel →
   **Settings** → scroll to **Conversions API** → **Set up manually** →
   **Generate access token**. Copy it.
2. Vercel → **Settings** → **Environment Variables** → add **Production**:
   - `META_PIXEL_ID` = your Pixel ID (same value you used in GTM)
   - `META_CAPI_ACCESS_TOKEN` = the token you just generated
3. **(Testing only)** Add `META_CAPI_TEST_EVENT_CODE` = a value from
   Events Manager → **Test Events** tab. Events fired with this code show up
   in Test Events instead of going to production reports. Remove this var
   when you're done validating.

Trigger a Vercel redeploy after adding env vars.

---

## 7. Validate everything end-to-end

### 7a. GTM Preview mode

1. In GTM (right of the top bar) click **Preview**.
2. Enter `https://almejaazul.com` → **Connect**. A new browser tab opens
   the site connected to GTM debug.
3. In the debug window (the original tab), confirm:
   - **GA4 — Configuration** tag fires on every page (Tags Fired section).
   - **Meta Pixel — Base** tag fires on every page.
4. In the connected site tab, open an inquiry modal and submit a test
   inquiry with **your own email + phone** (use a unique email like
   `you+gtmtest@thegray.space` so you can find it later).
5. Back in the debug window — the new event `InquirySubmitted` should appear
   in the left timeline. Click it. Under **Tags Fired** you should see
   **Meta Pixel — Lead**. Click that tag → confirm `Event ID` is a UUID
   (not empty).

### 7b. Meta Test Events

While `META_CAPI_TEST_EVENT_CODE` is set:

1. Events Manager → your Pixel → **Test Events**.
2. Submit another test inquiry on the site.
3. Within ~30 seconds you should see **two `Lead` rows** for the same event:
   one from `Browser` (GTM/Pixel) and one from `Server` (CAPI). Their
   `Event ID` column should be **identical**. Meta will collapse them with a
   "Deduplicated" badge.
4. If you see only one, check:
   - Browser-side missing → `event_id` field on the Pixel Lead tag isn't
     wired to `{{dlv — event_id}}`.
   - Server-side missing → `META_PIXEL_ID` / `META_CAPI_ACCESS_TOKEN` env
     vars missing or wrong; check Vercel function logs for
     `[inquiry] Meta CAPI send failed:`.

### 7c. Publish

1. Once the Preview validates clean → top right in GTM → **Submit**.
2. Version Name: `Initial setup — GA4 + Meta Pixel + Lead`.
3. **Publish**.

### 7d. Production verification

1. Remove `META_CAPI_TEST_EVENT_CODE` from Vercel and redeploy.
2. Wait ~10 minutes after a real inquiry comes in.
3. Events Manager → your Pixel → **Overview** → you should see a `Lead`
   row with the **Deduplication** column showing both `Browser` and `Server`.

---

## What can a non-developer change later?

Anything in GTM. To add Hotjar, a LinkedIn pixel, a TikTok pixel, or change
which pages a tag fires on — open GTM, edit the tags/triggers, **Submit**,
**Publish**. No code deploy.

The two things that **do** require a code change:

- **New custom events** — e.g., when the booking flow ships, the developer
  needs to add a `pushDataLayer('ReservationStarted', { ... })` call. Once
  that ships, you can add a GTM trigger + tag for it without further code.
- **New server-side events via CAPI** — these live in code because they
  need server context (user IP, hashed PII). Ask the developer to extend
  `lib/analytics/meta-capi.ts`.

---

## Where to look when something seems broken

| Symptom | Where to check |
|---|---|
| No `<script>` for GTM in page source | `NEXT_PUBLIC_GTM_ID` env var missing in Vercel **Production** scope, or last deploy was before it was set |
| GTM script loads but no tags fire | The container hasn't been **Published** — Preview mode reflects unpublished changes, live site does not |
| Pixel `Lead` fires twice in Events Manager | `event_id` field on the Pixel Lead tag is empty or not bound to `{{dlv — event_id}}` |
| CAPI never appears in Events Manager | Vercel function logs will have `[inquiry] Meta CAPI send failed:` — most often a wrong/expired access token |
| Events Manager shows raw email/phone | This would be a code bug — the server always SHA-256 hashes before sending. Open an issue, do not paste examples (it would leak data) |
