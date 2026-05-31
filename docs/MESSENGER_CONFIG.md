# Almeja Azul — Facebook Messenger Configuration

**Purpose:** A proposed new Meta-native Messenger configuration that replaces the current "respond with room rates" pattern. Uses Facebook's free built-in tools — no ManyChat, no code. Applied entirely inside **Meta Business Suite → Inbox → Automations**.

**Current state:** Manual replies with room rates pasted into Messenger.
**Target state:** 24/7 self-service for ~70% of common questions, structured intake, human handoff for everything else.

---

## How this works (the building blocks)

Meta gives you these free with a verified Business Page. None requires code:

| Tool | What it does | Where to find it |
|---|---|---|
| **Welcome Message** | First message a user sees when they open the chat (before sending anything) | Meta Business Suite → Inbox → Automated Responses → Greeting |
| **Instant Reply** | Auto-sent immediately after a user sends their first message | → Automated Responses → Instant Reply |
| **Away Message** | Auto-sent when you're outside business hours | → Automated Responses → Away Message |
| **Frequently Asked Questions** | Up to 4 question/answer pairs that surface as quick-reply buttons | → Automated Responses → Frequently Asked Questions |
| **Persistent Menu** | Always-visible menu at the bottom of every chat | → Inbox Settings → Menu |
| **Saved Replies** | Pre-written messages your CS agents click to send | → Inbox → Saved Replies |
| **Comment Auto-Reply** | When someone comments on a Page post, DM them automatically | → Inbox → Automations → Comment Auto-Reply |
| **Booking Requests / Appointment Booking** | Built-in form (limited; useful for spa/day-tour intake) | → Page Settings → Templates → Services |
| **Ad Quick-Replies** | When Click-to-Messenger ads bring a user in, custom welcome flow | Meta Ads Manager → Messenger placement |

---

## Recommended configuration

### 1. Greeting (shown before any message)

```
Mabuhay! 👋 Welcome to Almeja Azul — Samal Island's quiet five-hectare
escape on two beach fronts. We typically reply within an hour during
business hours (8am–8pm PH time). Tap a topic below or send your question.
```

> Greeting only displays in Messenger if the user hasn't started a conversation yet. Sets tone before they type.

---

### 2. Instant Reply (auto-sent on first message)

```
Salamat sa pag-message! 🌊

I'm a quick-reply helper — a real person will jump in shortly. While
you wait, here's what most guests ask about:

🏨 Room rates & availability
☀️ Day pass (Seaside / Beach+Pool / Cottage)
💍 Weddings & corporate events
🛶 Activities & tours
📍 Directions & how to get here

Just send the topic or tap a Quick Reply below. For urgent calls:
0999 308 8800.
```

**Configure 4 Quick Reply buttons under this:**
- `Room rates` → triggers FAQ #1
- `Day pass info` → triggers FAQ #2
- `Wedding/Event info` → triggers FAQ #3
- `Just a question` → silent, lets user type freely

---

### 3. Away Message (outside 8am–8pm PH time)

```
Hi! 🌙 We're offline right now (we reply 8am–8pm Philippine time).
We'll get back to you first thing in the morning.

Meanwhile, browse rooms + rates: almejaazul.com/stay
Day tour: almejaazul.com/day-tour
Events: almejaazul.com/build

If urgent, leave your phone number and we'll call you back when we open.
```

**Set hours:** 8am–8pm PH time (or whatever your CS agents actually cover — match reality).

---

### 4. Frequently Asked Questions (4 entries — the Meta limit)

These appear as tappable quick-reply buttons. Each is a question + a stored answer Messenger auto-sends.

#### FAQ #1 — Room rates & availability
**Question shown:** "What are your room rates?"
**Auto-reply:**
```
Our rooms start at ₱[X,XXX]/night. Full rate sheet and photos:
👉 almejaazul.com/stay

To check availability, please share:
• Check-in date
• Check-out date
• Number of guests
• Room preference if any

A real person will confirm availability + send a booking link within
an hour during business hours.
```

#### FAQ #2 — Day pass pricing
**Question shown:** "What's your day pass?"
**Auto-reply:**
```
We have 3 day-pass options:

☀️ Seaside Pass — ₱[XXX]/adult
🏊 Beach + Pool Pass — ₱[XXX]/adult
🏡 Cottage Day Use — ₱[X,XXX] (up to 8 guests)

Full inclusions + child rates: almejaazul.com/day-tour

To book, share your date + group size and we'll confirm same day.
```

#### FAQ #3 — Wedding & event pricing
**Question shown:** "I want to host an event"
**Auto-reply:**
```
Beautiful — we host weddings, corporate retreats, and large family
celebrations on our beachfront venues. 🌅

Quick info:
• Mangrove Pavilion (up to [X] pax)
• Vow by the Sea (up to [X] pax)
• Custom setups available

Send us:
• Event type
• Date range
• Approximate guest count
• Budget range (optional)

Our events team will reply with a quote within 24 hours. Or request a
full quote: almejaazul.com/build
```

#### FAQ #4 — Directions
**Question shown:** "How do I get there?"
**Auto-reply:**
```
We're at Brgy. Adecor, Samal Island, Davao del Norte. 📍

From Davao City:
1. Ferry from Sasa/Sta Ana to Samal (every 30 min)
2. ~20 min drive on Samal Island to Brgy. Adecor
3. Look for the Almeja Azul gate on the beach side

Google Maps: [link]
Detailed directions: almejaazul.com (we'll add a Directions page)

Need a driver/airport transfer? Send us your flight info and we'll
arrange.
```

---

### 5. Persistent Menu (always at bottom of chat)

Configure 3 sections:

**Section 1 — Browse**
- 🏨 Rooms & Rates → opens `almejaazul.com/stay` in browser
- ☀️ Day Tour → opens `almejaazul.com/day-tour`
- 💍 Events & Weddings → opens `almejaazul.com/build`
- 🛶 Activities & Tours → opens `almejaazul.com/fun`

**Section 2 — Get a quote**
- 📋 Request a quote → opens `almejaazul.com/contact` (or future quote-form URL)

**Section 3 — Talk to a person**
- 💬 Live chat (now) → simply types "Talk to a person" which signals CS to take over
- 📞 Call us → click-to-call `0999 308 8800`

---

### 6. Saved Replies (for CS agents — top 20 common scenarios)

These are NOT auto-sent. CS agents click a Saved Reply to insert pre-written text. Keep them friendly, never robotic.

Drafts below — review and tweak language before saving. Each title is how the agent will find it in the Saved Reply picker.

1. **Rate quote — Stay** — current room rates + booking link + ask for dates
2. **Rate quote — Day pass** — three pass options + how to reserve
3. **Wedding pricing range** — typical wedding package starting point + ask for guest count
4. **Corporate retreat pricing range** — starter range + ask for group size + dates
5. **Cancellation policy** — current policy in 3 lines
6. **Deposit & payment terms** — GCash / bank transfer / cards accepted; deposit % + when due
7. **Pet policy** — confirm allowed/not, conditions
8. **Children's rates** — per-child surcharge / free under X / extra bed cost
9. **Check-in / check-out times** — 2pm in / 12pm out (or actual)
10. **Airport transfer** — cost + booking lead time + what to share
11. **Group discount inquiry** — threshold (e.g., 5+ rooms) + ask for full party size
12. **Anniversary / celebration request** — cake/flowers/decoration setup options
13. **WiFi / power / generator** — coverage areas + backup
14. **Food options** — restaurant outlets + outside-food policy + dietary
15. **Activities included vs paid** — list of complimentary vs add-on
16. **Spa / massage** — availability + how to book on-arrival
17. **Tours offered** — island excursion list + half-day vs full-day
18. **Holiday/peak season note** — premium dates + min-stay policy
19. **Booking confirmation request — Stay** — agent confirming details before sending payment link
20. **Booking confirmation request — Event** — agent confirming details before sending proposal

> Each Saved Reply should end with the same line:
> *"Anything else I can clarify? We're here 8am–8pm."*
> Consistent close pattern = stronger brand voice.

---

### 7. Comment Auto-Reply (DM-from-Page-post)

When someone comments on Facebook posts about specific offers, automatically DM them with relevant info.

Configure 2 to start:

**Trigger 1 — Wedding-related post comments**
Keywords in comments: `wedding`, `kasal`, `marry`, `event`, `venue`
DM sent: a short "thanks for your interest" + FAQ #3 content

**Trigger 2 — Day pass post comments**
Keywords: `day pass`, `day tour`, `swimming`, `pool`, `magkano`, `rates`
DM sent: FAQ #2 content + ask for date

> Comment auto-reply is in Meta Business Suite under Inbox → Automations → Comments

---

### 8. Click-to-Messenger ad welcome flow

If/when you start running paid FB ads to grow inquiries (planned in Phase 1 item COM-06), every ad-driven Messenger conversation should:

1. Auto-send a specific "welcome from this ad" message referencing the ad's offer (e.g., "Saw our Valentine's package post? Here's the full deal…")
2. Surface 2 quick-reply buttons relevant to that ad
3. Tag the conversation in Inbox with the ad name so agents see context

This is configured per-ad in Meta Ads Manager, not in Inbox.

---

## How to apply this

1. Open **Meta Business Suite** (business.facebook.com)
2. Select Almeja Azul Page → **Inbox** → **Automated Responses**
3. Configure each of Greeting / Instant Reply / Away Message / FAQ in the UI — paste the copy above
4. Inbox → **Saved Replies** → create the 20 templates (or start with top 5 and grow)
5. Page Settings → **Templates** → set Messaging → **Persistent Menu**
6. Inbox → **Automations** → **Comment Auto-Reply** → set up 2 keyword triggers

Total time to apply: ~2–3 hours for the first pass. Iterate based on what conversations actually look like in the first 2 weeks.

---

## Measuring success

Track these inside Meta Business Suite → Insights → Messaging after 2 weeks:

| Metric | Current (guess) | Target after this config |
|---|---|---|
| % conversations resolved by automation alone | ~0% | 30–50% |
| Median first-response time (human) | ? | <15 min business hours |
| Conversations missed (no reply within 24h) | ? | <5% |
| FAQ click-through rate | 0% | 40%+ of new conversations tap a FAQ |

If FAQ click-through is below 30%, the FAQ phrasing isn't matching what guests actually ask — rewrite based on real conversation logs.

---

## When to upgrade to ManyChat (Phase 2B COM-02)

Stay on Meta-native through Phase 1. Upgrade only if you observe:

- More than ~20% of conversations need conditional/branching logic the FAQs can't handle (e.g., "I want to book BUT only if X is available BUT also need Y…")
- Lead capture needs structured form-style fields (specific date pickers, multi-select)
- You want to push lead data automatically into your CMS or a Sheet (Meta-native can't do this; ManyChat can)
- You want to send broadcasts (e.g., "Holiday rates just dropped" to past inquirers) — Meta-native doesn't allow this

At 25–60 rooms with mostly direct/walk-in funnels, you may never need ManyChat. The $15/mo fee is real money saved if Meta-native carries the load.

---

## What's NOT in this config (intentional)

- **No bot responding to free-form questions** — Meta-native can't do natural-language responses. That's a ManyChat (Phase 2B) or Gemini-powered (Phase 6 AI-02) upgrade.
- **No live booking confirmation in Messenger** — booking flows live on the site once Phase 3 ships; Messenger handles intent capture only.
- **No quote generation in Messenger** — quotes go through the human-driven Quote Builder in Phase 2B (CRM-05).
- **No appointment-booking widget** — Meta's built-in appointment widget is too rigid for resort use cases. Spa booking will be in Phase 5 (ACT-04).
