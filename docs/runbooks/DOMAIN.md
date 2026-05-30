# Runbook — Pointing `almejaazul.com` at Vercel

**Audience:** Ben (non-developer). Follow these steps in order. Do not skip Step 1.

**Time:** 30–45 minutes of your time at the keyboard. DNS itself can take 5 min to a few hours to propagate worldwide — that part is just waiting.

**Risk:** Misconfiguring DNS can break your Google Workspace email (`ben@thegray.space` — wait, the Workspace is on `almejaazul.com` too, so any record you add at this domain matters). Step 1 mitigates this with a screenshot of the current state. Do not skip it.

---

## What you will end up with

- `https://almejaazul.com` → the live website
- `https://www.almejaazul.com` → redirects to `https://almejaazul.com` (handled in code; you only need to point DNS at Vercel)
- `https://book.almejaazul.com` → reserved for later (DNS pre-pointed at Vercel, no app yet)
- `https://events.almejaazul.com` → reserved for later
- `https://staff.almejaazul.com` → reserved for later
- Google Workspace email on `@almejaazul.com` → still works exactly as before

---

## Step 1 — Back up your current DNS (do this BEFORE touching anything)

> **Critical.** If you accidentally edit or delete an existing record, this screenshot is the only thing that lets you restore it.

1. Open a browser, go to your domain registrar (where you bought `almejaazul.com` — likely Namecheap, GoDaddy, Google Domains, or Cloudflare).
2. Log in.
3. Navigate to the **DNS** management page for `almejaazul.com`. The exact location varies by registrar:
   - **Namecheap:** Domain List → Manage → Advanced DNS
   - **GoDaddy:** My Products → DNS
   - **Cloudflare:** Select domain → DNS → Records
4. Take a **screenshot of the entire DNS records table**. Make sure every row is visible — scroll if needed and take multiple screenshots.
5. Save the screenshot(s) somewhere you will find them again. A folder called `almejaazul-dns-backup-YYYY-MM-DD` on your desktop is fine.
6. Eyeball the records and confirm you can see all of these. **Do not change them.** They make your Workspace email work:
   - **MX records** (usually 5 of them, all pointing to `*.google.com` mail hosts — `aspmx.l.google.com`, `alt1.aspmx.l.google.com`, etc.) with priorities 1, 5, 5, 10, 10.
   - **SPF TXT record** on the root (`@` or blank Host). Its value contains `v=spf1 include:_spf.google.com ~all`.
   - **DKIM record** — a `TXT` record at `google._domainkey` (very long string starting with `v=DKIM1`).
   - **DMARC TXT record** at host `_dmarc` (value contains `v=DMARC1`).
   - **Domain verification** — one or more `TXT` records on the root whose value starts with `google-site-verification=`.

If any of those are missing, **stop and ask for help** — your email setup may already be broken in a way unrelated to this work, and we should fix that first.

---

## Step 2 — Add the domains in Vercel

This is on the Vercel side, before touching DNS at the registrar.

1. Go to https://vercel.com and log in.
2. Open the **Almeja Azul** project.
3. Click **Settings** (top nav) → **Domains** (left sidebar).
4. Add the **apex domain first**:
   - Click **Add Domain**.
   - Type `almejaazul.com`.
   - Click **Add**.
   - Vercel will show you a DNS instruction box. **Keep this tab open** — you will use these values in Step 3.
5. Add `www.almejaazul.com`:
   - Click **Add Domain** again.
   - Type `www.almejaazul.com`.
   - Click **Add**.
   - Vercel will note that it will redirect `www` → apex. That's correct (we've also added a redirect in the app code as a belt-and-braces backup — both will work, redundancy is fine).
6. Add the three reserved subdomains so SSL certs are pre-issued and DNS is pre-pointed:
   - `book.almejaazul.com`
   - `events.almejaazul.com`
   - `staff.almejaazul.com`
   - For each: Click **Add Domain** → type subdomain → **Add**. These will show "Invalid Configuration" until Step 3 is done. That is expected.

> Vercel will show you the DNS values to use for each. **The exact values can change** — always use what Vercel shows you, not what is written below. The values below are the typical defaults as of 2026:
> - **Apex** (`almejaazul.com`): an **A record** pointing to `76.76.21.21`
> - **Subdomains** (`www`, `book`, `events`, `staff`): a **CNAME record** pointing to `cname.vercel-dns.com`

---

## Step 3 — Configure DNS at your registrar

Go back to your registrar's DNS records page (the same one you screenshotted in Step 1).

> **Rule of thumb:** You are only **adding** new records and possibly **editing** an existing `A` or `CNAME` on the root or `www`. **Do not touch** any `MX`, any `TXT`, or anything labeled `google._domainkey` or `_dmarc`. If the record name starts with `_` or is `MX`/`TXT`, leave it alone.

Add (or edit) these records. Field names vary slightly by registrar — the meanings below should map cleanly:

| Type  | Host / Name        | Value / Target            | TTL              | What it does |
|-------|--------------------|---------------------------|------------------|-------------|
| A     | `@` (or blank)     | `76.76.21.21`             | Automatic / 3600 | Points the bare `almejaazul.com` at Vercel |
| CNAME | `www`              | `cname.vercel-dns.com`    | Automatic / 3600 | Points `www.almejaazul.com` at Vercel |
| CNAME | `book`             | `cname.vercel-dns.com`    | Automatic / 3600 | Reserved for booking app (Tier 3) |
| CNAME | `events`           | `cname.vercel-dns.com`    | Automatic / 3600 | Reserved for event mini-sites (Tier 5) |
| CNAME | `staff`            | `cname.vercel-dns.com`    | Automatic / 3600 | Reserved for staff portal (Tier 4) |

**Important details:**
- Some registrars (Cloudflare) will not let you add a `CNAME` on the bare apex (`@`). For the apex use **A record → `76.76.21.21`**.
- On Cloudflare specifically, set the **proxy status** (the orange cloud icon) to **DNS only** (grey cloud) for all 5 rows. Vercel handles SSL itself; if Cloudflare proxies, you get certificate conflicts.
- If you see an existing `A` record on `@` pointing somewhere else (e.g., a prior hosting provider), **replace its value** with `76.76.21.21` rather than adding a duplicate. Same for an existing `www` CNAME.
- If a row asks for a "TTL", `Automatic` is fine; otherwise pick **3600** (= 1 hour). Lower TTLs make subsequent changes propagate faster but most registrars cap the minimum anyway.

**Save** the changes at your registrar.

---

## Step 4 — Verify Workspace email still works (do this within 15 minutes of Step 3)

DNS changes can take from seconds to a few hours to propagate. Email almost always keeps working through this because you did not touch the MX/SPF/DKIM/DMARC records — but verify, do not assume.

1. From your phone (NOT from Gmail web — use a different network/device to be sure routing is real), open Gmail and send a test email **from** `ben@thegray.space` (or whichever `@almejaazul.com` address you use) **to** a non-Google address (e.g., your iCloud, Outlook, or a friend's Yahoo address).
2. From the non-Google address, **reply** back to your `@almejaazul.com` address.
3. Confirm the reply arrives in your `@almejaazul.com` inbox within 1–2 minutes.

If the inbound reply does **not** arrive within 10 minutes:
- Check the sender's mailbox for a bounce notification (look for a "Mail Delivery Subsystem" reply).
- Check https://mxtoolbox.com/SuperTool.aspx → type `almejaazul.com` → choose **MX Lookup**. The result should still list 5 `*.google.com` mail servers. If it does not, your DNS change accidentally affected MX. **Stop and use the Step 1 screenshot to restore the MX rows.**
- If MX looks correct on mxtoolbox but mail still doesn't arrive, the inbound queue may just be slow. Wait 30 minutes and try again.

Do not proceed to Step 5 until email is confirmed working both directions.

---

## Step 5 — Verify Vercel SSL auto-provisioning

Vercel issues a Let's Encrypt SSL certificate automatically as soon as DNS resolves. This usually finishes within 1–10 minutes after Step 3.

1. Go back to the Vercel **Settings → Domains** page from Step 2.
2. Each domain row shows a status:
   - `almejaazul.com` → should show **Valid Configuration** and a green checkmark with the SSL certificate. May say **Issuing Certificate** for a few minutes — that's fine, just wait.
   - `www.almejaazul.com` → **Valid Configuration**, marked as redirecting to apex.
   - `book.almejaazul.com`, `events.almejaazul.com`, `staff.almejaazul.com` → **Valid Configuration**.
3. In a browser, visit https://almejaazul.com . You should see the website (or the pre-launch password gate, if `SITE_PASSWORD` is set in Vercel — see Step 6). Click the padlock in the address bar — it should show a valid certificate issued by Let's Encrypt for `almejaazul.com`.
4. Visit https://www.almejaazul.com . The address bar should bounce to `https://almejaazul.com` (308 redirect).

**If any row stays on "Invalid Configuration" for more than 30 minutes:**
- Click the **Refresh** button on that row.
- Recheck the DNS table at your registrar — the most common issue is a typo in the record value, or Cloudflare's orange cloud being on.
- Check https://dnschecker.org → type `almejaazul.com`, choose **A** record. Multiple regions should resolve to `76.76.21.21`. If only some do, DNS is still propagating — wait.

---

## Step 6 — Add `NEXT_PUBLIC_SITE_URL` to Vercel environment variables

The app uses this to build canonical URLs in metadata (Open Graph tags, sitemap, transactional email links).

1. In Vercel, **Settings → Environment Variables**.
2. Click **Add New**.
3. Key: `NEXT_PUBLIC_SITE_URL`
4. Value: `https://almejaazul.com` *(no trailing slash, no `www`)*
5. Environments: tick **Production**. *(Optional — also tick Preview if you want preview deployments to use the same canonical URL; otherwise leave Preview pointing at Vercel previews.)*
6. Click **Save**.

While you are here, **also set** these two if you intend to use the pre-launch password gate:

7. Key: `SITE_PASSWORD` → Value: a passphrase of your choice (e.g., `mangrove-2026`). Tick **Production** (and Preview if you want).
8. Key: `SITE_GATE_SECRET` → Value: a long random string, **at least 32 characters**, different from `AUTH_SECRET`. You can generate one in the terminal:
   - On macOS/Linux: `openssl rand -base64 32`
   - On Windows PowerShell: `[Convert]::ToBase64String((1..32 | %{[byte](Get-Random -Max 256)}))`
9. Click **Save**.

> Leave `SITE_PASSWORD` empty (or unset) to **disable the gate** and let the public site be reachable by anyone. When ready to launch publicly, delete `SITE_PASSWORD` in Vercel and redeploy (or just leave it blank).

---

## Step 7 — Re-deploy and verify

Adding env vars in Vercel does **not** auto-restart the running deployment — you need a fresh build to pick them up.

1. In Vercel, go to **Deployments** (top nav).
2. Find the most recent **Production** deployment (top of the list, branch `main`).
3. Click the **⋮** menu on the right → **Redeploy** → confirm.
4. Wait 1–3 minutes for the build to finish.

**Verify:**
- Visit https://almejaazul.com . If you set `SITE_PASSWORD`, you should see the dark password gate screen. Enter the password — you should be redirected to the actual site.
- Visit https://www.almejaazul.com . Browser address bar should switch to `https://almejaazul.com` (308 redirect).
- Visit https://almejaazul.com/admin/login . Admin login should still work normally.
- After logging in as admin, visit https://almejaazul.com/admin . The admin dashboard should render. You should remain logged in (the password gate is a separate cookie and does not interfere with admin auth).

---

## Rollback (if everything goes wrong)

1. At the registrar's DNS page: open your Step 1 screenshots and **manually restore** every row that you changed. Set the apex `A` back to whatever it was before (or delete it entirely if it did not exist). Delete the four new CNAMEs (`www`, `book`, `events`, `staff`).
2. Do NOT touch MX/SPF/DKIM/DMARC/google-site-verification rows — these were never changed in this runbook, so they should still be in place.
3. Within 5–60 minutes the site will revert to its previous routing.
4. In Vercel: **Settings → Domains** → remove the 5 domains added in Step 2 if they are causing confusion in the dashboard. The app itself remains accessible at its `*.vercel.app` URL regardless.

---

## Common gotchas

- **"My email broke!"** — Almost always one of the MX rows was accidentally deleted. Restore from the Step 1 screenshot. If MX rows are intact, see Step 4 troubleshooting.
- **"SSL certificate error / not secure"** — Vercel is still issuing. Wait 10 minutes. If it persists, check Cloudflare orange cloud is OFF.
- **"www doesn't redirect to apex"** — Check the CNAME on `www` resolves (dnschecker.org). The redirect itself is in `next.config.ts` and runs on every request; if it fires, you're done. Hard-refresh the browser (Ctrl-Shift-R) — browsers cache 308 redirects aggressively.
- **"I can see the site but the password gate isn't showing"** — `SITE_PASSWORD` env var is not set, or you haven't redeployed since adding it. Go back to Step 7.
- **"book.almejaazul.com shows a 404"** — That is currently correct. The subdomain is reserved; the booking app does not exist yet. The DNS pre-pointing is so we don't have to come back to this runbook later.
