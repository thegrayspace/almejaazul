# Visual Reference Map — Almeja Azul

Maps each route/state to the approved design prototype.

---

## Route → Source File Map

| Next.js Route | Source Prototype | Notes |
|---|---|---|
| `/` | `project/Almeja Azul.html` | Homepage — hero + strip + wifi bar + hub + mangrove + events + day tour teaser + Facebook section + footer |
| `/stay` | `project/stay.html` | Rooms (12-col organic grid) + Bookable Spaces (3-col grid) + booking push |
| `/day-tour` | `project/day-tour.html` | Hero + 3 pass cards + 8 add-on tiles + sample day timeline + corporate CTA + FAQ accordion |
| `/fun` | `project/fun.html` | Hero + 7-card sports grid + 3-card water section + 4-card leisure/nature section + CTA |
| `/build` | `project/build.html` | Hero + tab nav (Corporate / Weddings / Floor Plans) + corporate content / wedding content / floor plan SVGs + inquiry section |
| `/see` | `project/see.html` | Hero + 6 tour cards + Samal island section + 4 natural highlights + CTA |
| `/archive` | `project/archive.html` | Concepts hero + Pickleball section + Isla Vida section + Virtual Samal portal |

---

## Section-level Reference

### Homepage (`/`)

1. **Hero** — Full-screen beach photo, kinetic text (3 lines animate in with clip-reveal), eyebrow text, CTA buttons (Book Your Stay + Day Tour from ₱200), scroll indicator
2. **Quote Strip** — Teal left panel with italic serif quote, brand-color right panel with 4 stats (5 Hectares / 2 Beach Fronts / 1G WiFi / ∞ Pool)
3. **WiFi Callout Bar** — Dark ink bar, bolt icon, "High-Speed Fiber Internet" text, "1 Gbps Available" badge
4. **Section Hub** — Oyster bg, 5 image cards (3/4 aspect ratio, hover zoom + gradient overlay), each card: label + name + arrow circle
5. **Mangrove Sanctuary** — Full-bleed 600px parallax section, centered content, title with italic teal em, eco pills
6. **Events Teaser** — 2-column split: Destination Weddings (left) + Corporate Retreat (right), overlay text, hover zoom
7. **Day Tour Teaser** — Sand bg, 4 tiles: prices + icons (umbrella/waves/cottage/paw)
8. **Facebook Section** — Dark ink bg, 2-col: left (CTA buttons) + right (mock FB page card with 3 updates)
9. **Footer** — 5-col standard footer

### Stay (`/stay`)

1. **Page Hero** — 60vh, beach/resort image, "Rooms & Spaces" heading
2. **Rooms Grid** — 12-column CSS grid, organic layout:
   - Row 1: Room 1 as `.feature` (spans 8 cols, 2-column internal layout) + 2 × `.wide` rooms
   - Row 2: 2 × `.wide` rooms
   - Actually: Room 0 = `.feature` (8 col), rooms 1,2 = default (3 col), rooms 3,4 = `.wide` (4 col)
3. **Bookable Spaces** — Sand bg, 3-col grid of space cards
4. **Booking Push** — Teal strip, heading + 3 action buttons (Messenger, phone, Facebook)

### Day Tour (`/day-tour`)

1. **Hero** — Beach image, kinetic animation, "Come for the day. Stay for the sunset."
2. **Pass Cards** — 3-column grid. Middle card has "Most Popular" badge + teal border. Each card: icon (large, 44px) + price + name + includes list + note
3. **Add-on Tiles** — Sand bg, 4-col grid of 8 tiles with icons
4. **Sample Day Timeline** — Teal bg, 2-col: left timeline with icon dots + right image stack
5. **Corporate CTA Strip** — Teal, "Bringing a Group?" heading + CTA buttons
6. **FAQ Accordion** — Oyster bg, max-width 720px list, serif question text, +/× toggle

### Fun (`/fun`)

1. **Hero** — Pickleball image bg
2. **Sports Grid** — 12-column organic grid:
   - Card 1 (Pickleball): col 1–5 / Card 2 (Volleyball): col 6–12 / Row 2: 3 equal 4-col cards / Row 3: 2 cards (6+6 col)
   - `.placeholder` cards have "On Request" overlay
3. **Water Section** — Teal bg, 3-col cards with img + icon + name + sub + price
4. **Leisure & Nature** — Sand bg, 4-col cards with icon + name + desc + availability link
5. **CTA Strip** — Dark ink, large serif heading + 3 action buttons

### Build (`/build`)

1. **Hero** — Corporate/meeting image bg
2. **Tab Nav** — Dark ink bg, 3 tabs: Corporate & Team Building / Destination Weddings / Interactive Floor Plans
3. **Corporate Tab**:
   - 2-col grid: left (desc + 3 package cards as left-bordered cards + CTAs) + right (image grid)
   - Package cards: name + includes text + price label + click → modal
4. **Weddings Tab**:
   - Header, 2-col intro (image stack left + text + features + CTAs right)
   - 2 venue cards with overlay (Vow by the Sea + The Mangrove Pavilion)
5. **Floor Plans Tab**:
   - 2 floor plan cards each with: teal header, SVG diagram, legend, info + link
   - Mangrove Pavilion SVG: pavilion floor + stage + 6 tables + mangrove edges + bar + WC
   - Vow by the Sea SVG: beach + altar arch + seating rows + aisle + Davao Gulf
6. **Inquiry Section** — Teal bg, 2-col: left (heading + CTAs) + right (event type picker pills → Messenger CTA card)

### See (`/see`)

1. **Hero** — Snorkeling/underwater image bg
2. **Tour Cards** — 3-col grid of 6 cards (4/3 aspect ratio), hover lift + zoom
3. **Samal Island Section** — Teal bg, 2-col: text left + image collage right (portrait + 2 landscape)
4. **Natural Highlights** — Sand bg, 2-col grid of 4 horizontal cards (180px img + text body)
5. **CTA Strip** — Dark ink, 3 action buttons

### Archive (`/archive`)

Standalone page with its own dark ink CSS (not sharing brand.css):
1. **Hero** — "Concepts & Future Projects" badge + editorial heading
2. **Pickleball Section** — Dark bg + faint bg image, 2-col (text + image + glassmorphism card)
3. **Isla Vida Section** — Slightly lighter dark bg, 2-col (image collage + text/service rows)
4. **Virtual Samal** — Deep teal bg, centered, CSS 3D ocean scene with hotspots

---

## Modal States

| Modal | Trigger | Key Visual Elements |
|---|---|---|
| Room modal (Stay) | Click room card | 2-col: full-height image left + body right; tag + name + description + amenities 2-col grid + price box + 2 CTAs |
| Space modal (Stay) | Click space card | Same 2-col layout; "Starting From" price label |
| Pass modal (Day Tour) | Click pass card | Icon (34px) + tag + name + pricing 3-col strip (per hour / half day / full day boxes) + amenities + note + CTAs |
| Sport modal (Fun) | Click sport/water/leisure card | Tag + name + subtitle + description + features 2-col + price box (smaller text) + CTAs |
| Package modal (Build) | Click package card | Image with overlay (pax + duration) + desc + features + "Build Your Quote" form (number input, duration pills, needs pills, rooms field) |
| Tour modal (See) | Click tour card | Tag + duration + name + meta + description + includes + pricing (30px text) + CTAs |
| Inquiry modal (global) | Nav Book button, various page CTAs | 2-col: teal sidebar (logo + tagline) + form body (name/email row, phone+cc, type pills, guests/arrival row, departure, message, submit); success state with checkmark |

---

## Interactive States

| Interaction | CSS/JS Mechanism | Notes |
|---|---|---|
| Nav transparent→dark | `.scrolled` class on scroll > 50px | `window.addEventListener('scroll')` |
| Nav logo morph | CSS transition on `img.height`: 85px → 38px on `.scrolled` | CSS transition |
| Mobile nav toggle | `.nav-links.open` class, transform/opacity transition | Click listener |
| Ripple click effect | `.ripple-dot` span injected on click on `.rpl` elements | Vanilla JS, keyframe `rA` |
| Hero text reveal | `@keyframes sUp` with staggered delays (0.5s / 0.67s / 0.84s) | CSS only, initial opacity:0 + translateY |
| Mangrove parallax | `mg.style.transform` updated on scroll | Vanilla JS |
| Hero bg subtle zoom | `@keyframes hZoom`: scale 1.04 → 1.10 over 20s | CSS only |
| Card hover zoom | CSS transition on `.rc-img`, `.hub-card-img`, `.tour-img` etc. | CSS only |
| Hub card arrow fill | Hover → `background: var(--c-brand)` | CSS only |
| Build tab switching | `tab` state, conditional section render | React useState |
| FAQ accordion | `openFaq` state, `max-height` CSS transition | React useState + CSS |
| Pass card modal | `activePass` state | React useState |
| Event type picker | `eventType` state | React useState |
| FB float animation | `@keyframes fbPop` delay 1.5s | CSS only |
