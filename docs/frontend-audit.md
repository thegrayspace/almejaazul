# Frontend Audit — Almeja Azul Design-to-Next.js Migration

_Generated from source HTML prototypes in `project/`_

---

## Pages Inventory

| Route | Source File | Title |
|---|---|---|
| `/` | `Almeja Azul.html` | Home — Almeja Azul · LYR Beach Resort · Samal Island |
| `/stay` | `stay.html` | Stay — Almeja Azul · Samal Island |
| `/day-tour` | `day-tour.html` | Day Tour — Almeja Azul · Samal Island |
| `/fun` | `fun.html` | Fun & Recreation — Almeja Azul · Samal Island |
| `/build` | `build.html` | Build & Events — Almeja Azul · Samal Island |
| `/see` | `see.html` | See & Explore — Almeja Azul · Samal Island |
| `/archive` | `archive.html` | Concepts & Future Projects — Almeja Azul |

---

## Hard-coded Data Arrays

### `Almeja Azul.html` (Home)
- `SECTIONS` — 5 hub cards (Stay, Day Tour, Fun, Build, See) with image URLs and hrefs
- `FB_UPDATES` — 3 hardcoded Facebook update objects (date, text)

### `stay.html`
- `ROOMS` — 5 room objects: {id, tag, name, sub, price, img, mImg, cap, desc, amenities[], note}
  - Seaside Room ₱2,950 / Family Room ₱4,950 / Group Suite ₱5,000 / Extended Room ₱7,000 / Grand Estate Room ₱8,000
- `SPACES` — 6 space objects: {id, tag, name, cap, price, priceSub, img, desc, amenities[], note}
  - Function Hall, Meeting Room, Coastal Cabana A, Coastal Cabana B, Marketplace Area, Beach Pavilion

### `day-tour.html`
- `FAQS` — 6 FAQ objects {q, a}
- `PASS_DATA` — 3 pass objects: {key, name, Icon, tag, img, pricing[{label,price,note}], includes[], note, unit}
  - Seaside Day Pass / Beach+Pool Pass / Cottage Rental
- Add-ons — 8 inline objects (in JSX map) with {Icon, name, price, desc}
- Sample schedule — 8 timeline items (Icon, time, act, note)

### `fun.html`
- `SPORTS` — 7 sport objects: {cat, name, sub, price, img, desc, features[]} + `placeholder: true` flag on 2
- `WATER` — 3 water sport objects: {Icon, name, sub, price, img}
- `LEISURE` — 4 leisure/nature objects: {Icon, name, desc, avail, img, detail, features[], price}

### `build.html`
- `PACKAGES` — 3 corporate package objects: {name, includes, price, img, detail, minPax, maxPax, duration[], features[]}
  - The Day Retreat / The Overnight Build / The Executive Offsite
- `WED_VENUES` — 2 wedding venue objects: {tag, name, sub, img}
  - Vow by the Sea / The Mangrove Pavilion
- `EVENT_TYPES` — 7 string labels for event type pill selection
- `NEEDS_OPTS` — 9 string labels for package inquiry needs
- Floor plan SVG data is inline in `FloorPlanSVG` component

### `see.html`
- `TOURS` — 6 tour objects: {tag, name, desc, price, img, detail, includes[], duration}
  - Reef Snorkeling / Island Hopping / Mangrove Kayak Tour / Davao Gulf Diving / Samal Village Walk / Giant Clam Viewing
- Natural highlights — 4 inline objects {tag, name, desc, img}

### `archive.html`
- Concept content fully static (no data arrays)

---

## Modals Identified

| Page | Modal Name | Trigger | Content |
|---|---|---|---|
| Stay | `Modal` (rooms + spaces shared) | Click room card or space card | Image, tag, name, description, amenities grid, price box, CTA buttons |
| Day Tour | `PassModal` | Click pass card | Icon, tag, name, pricing 3-column grid (per hour/half day/full day), includes, note, CTAs |
| Fun | `SportModal` | Click sport card, water card, leisure item | Tag, name, sub, description, features, price, CTAs |
| Build | `PackageModal` | Click package card | Image overlay, description, features, build-your-quote form (pax, duration pills, needs pills, rooms), CTAs |
| See | `TourModal` | Click tour card | Tag + duration, name, meta, description, includes, price, CTAs |
| All pages | `InquiryModal` (global) | Nav "Book" button, various CTAs | Logo sidebar, form: name, email, phone+cc, inquiry type pills, guests, arrival, departure (hidden for day tour), message |

---

## Shared Nav / Footer / CTA Elements

### Navigation (`brand.css` + per-page React)
- Fixed position, transparent → dark on scroll (`.scrolled` class via JS scroll listener)
- Logo top-left (morphs from 85px → 38px on scroll)
- Links: Stay, Day Tour, Fun, Build, See
- Actions: phone number + Book button
- Mobile: hamburger toggle → slide-down overlay menu (`.nav-toggle`, `.nav-links.open`)
- Sub-pages use `.nav.solid` class (always dark, no transparent hero state)

### Footer
- 5-column grid: Brand | Explore | [Page-specific col 1] | [Page-specific col 2] | Book
- Book column always: phone → Messenger → Facebook (no Home)
- Bottom bar: copyright + optional "Concepts & Future Projects →" link (home page only)
- Mobile: 2-column grid, brand spans full width

### Floating Messenger Button
- Home page: `.fb-float` — pill with icon + "Message Us" text
- Sub-pages: `.fb-float-sm` — circular icon-only button
- Both: animate in on load (`fbPop` keyframe), hover lift effect

### CTA Patterns
- Messenger link: `https://m.me/AlmejaAzulResort`
- Facebook link: `https://www.facebook.com/AlmejaAzulResort/`
- Phone: `tel:09993088800` / display `0999 308 8800`
- openInquiry(`type?`) — global function from `inquiry-modal.jsx`

---

## Images

All images currently from Unsplash CDN. In production, these should be replaced with actual resort photography.

| Usage | URL Pattern |
|---|---|
| Hero backgrounds | `photo-1507525428034-b723cf961d3e` (beach), `photo-1511578314322-379afb476865` (corporate) |
| Room images | Various Unsplash room/hotel photos |
| Space images | Various Unsplash venue/meeting room photos |
| Sport images | Pickleball, volleyball, chess, etc. |
| Tour images | Snorkeling, kayaking, island photos |
| Nature | Mangrove, coral, coastline |

All `<img>` tags use `loading="lazy"` except hero backgrounds.

---

## Repeated Components → React Components

| Component | Used In | Notes |
|---|---|---|
| `Nav` | All pages | Client component (scroll listener, mobile toggle) |
| `Footer` | All pages | Server component |
| `MessengerFloat` | All pages | Static link, no state |
| `InquiryModal` | All pages | Client component, global via context |
| `Modal` (base) | Stay, Day Tour, Fun, See | Shared overlay + close behavior |
| `SectionHeader` | All pages | eyebrow + title pattern |
| `PageHero` | Stay, Fun, Build, See | 60–70vh hero with bg image + overlay |
| `CTASection` | All pages | Dark/teal strip with heading + action buttons |
| `BookingPush` | Stay | Teal strip, heading + buttons |
| `FloorPlanSVG` | Build | Inline SVG, parametric by type |
| `BuildTabs` | Build only | Client component, tab state |
| `FAQAccordion` | Day Tour | Client component, open state |
| `RoomsGrid` | Stay | Client component (modal state) |
| `SpacesGrid` | Stay | Client component (modal state) |
| `PassCards` | Day Tour | Client component (modal state) |
| `SportsGrid` | Fun | Client component (modal state) |
| `WaterGrid` | Fun | Client component (modal state) |
| `LeisureGrid` | Fun | Client component (modal state) |
| `ToursGrid` | See | Client component (modal state) |
| `PackageCards` | Build | Client component (modal state) |
| All icons | Day Tour, Fun, Home | Custom thin-stroke SVGs, 18 total |

---

## Brand CSS Classes (must be preserved)

From `brand.css`:
- CSS variables: `--c-brand`, `--c-brand-dk`, `--c-ink`, `--c-teal`, `--c-sand`, `--c-oyster`, `--c-sage`, `--c-drift`, `--c-warm`
- Font variables: `--ff-s`, `--ff-n`
- Easing: `--ease`
- Nav height: `--nav-h`
- Classes: `.nav`, `.nav.scrolled`, `.nav.solid`, `.nav-logo`, `.nav-link`, `.nav-book`, `.nav-toggle`
- `.fb-float`, `.fb-float-sm`
- `.site-footer`, `.footer-grid`, `.footer-col`, `.footer-brand`
- `.btn-brand`, `.btn-dark`, `.btn-outline`, `.btn-outline-brand`
- `.s-eyebrow`, `.s-eyebrow-light`, `.s-title`, `.s-title-light`, `.s-body`, `.s-body-light`
- `.mOverlay`, `.modal`, `.m-gallery`, `.m-body`, `.m-close`, `.m-tag`, `.m-name`, etc.
- `.rpl`, `.ripple-dot` (ripple click effect)
- All `@keyframes`: `fUp`, `sUp`, `hZoom`, `fbPop`, `sLine`
- Mobile breakpoints: 1100px, 860px, 720px, 480px

---

## Page-specific CSS Classes

Each HTML file includes an inline `<style>` block with page-specific classes. These must be migrated to:
- `/styles/pages/home.css`
- `/styles/pages/stay.css`
- `/styles/pages/day-tour.css`
- `/styles/pages/fun.css`
- `/styles/pages/build.css`
- `/styles/pages/see.css`
- `/styles/pages/archive.css`

Or alternatively as CSS Modules per-page (`.module.css`), though that would require renaming all class strings in the JSX.

**Recommendation:** Migrate as global page-scoped CSS files imported in each page layout. This preserves the exact class names from the prototype without any renaming.
