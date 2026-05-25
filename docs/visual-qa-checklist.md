# Visual QA Checklist — Almeja Azul Migration

_Run this checklist after each page migration to verify visual parity with prototypes._

---

## Global / Shared

- [ ] Google Fonts load correctly: Cormorant Garamond (300, 400, italic) + Plus Jakarta Sans (300, 400, 500, 600)
- [ ] CSS variables resolve: `--c-brand: #4BBFE0`, `--c-ink: #1a2530`, `--c-teal: #1c3a4a`, etc.
- [ ] Nav is fixed, transparent at top
- [ ] Nav scrolls to dark (`scrolled` class, blur backdrop) after 50px
- [ ] Logo morphs from 85px to 38px height on scroll
- [ ] Logo filter: `brightness(0) invert(1)` (white on transparent/dark nav)
- [ ] Mobile hamburger shows at 860px breakpoint
- [ ] Mobile nav slide-down opens/closes correctly
- [ ] Floating Messenger button appears after 1.5s delay (fbPop animation)
- [ ] Messenger button: pill on home, circle icon on sub-pages
- [ ] Footer: 5-column grid on desktop, 2-column on mobile
- [ ] Footer brand column spans full width on mobile
- [ ] Inquiry modal opens from nav "Book" button
- [ ] Inquiry modal: teal sidebar with logo + "Make your visit happen"
- [ ] Inquiry modal: departure field hidden when Day Tour is selected
- [ ] Inquiry modal: success state shows checkmark + "Continue on Messenger"
- [ ] Inquiry modal: closes on Escape key, backdrop click

---

## Homepage (`/`)

- [ ] Hero: full-screen beach image with gradient overlay
- [ ] Hero: `hZoom` animation active (subtle scale 1.04 → 1.10)
- [ ] Hero eyebrow: "Brgy. Adecor · Samal Island · Davao del Norte" — animates up on load
- [ ] Hero title: 3 lines animate in with staggered delays; 3rd line italic + `--c-brand` color
- [ ] Hero subtitle: fades in after title
- [ ] Hero CTA buttons: "Book Your Stay" (brand pill) + "Day Tour · From ₱200" (outline)
- [ ] Hero scroll indicator: vertical line + "Scroll" text, bottom right, line animation
- [ ] Quote strip: teal left panel with italic em spans, brand-color right panel with 4 stats
- [ ] WiFi bar: bolt icon + text + "1 Gbps Available" badge (badge hidden on mobile)
- [ ] Section hub: 5 cards, 3/4 aspect ratio, hover zoom on images
- [ ] Hub card arrows fill with brand color on hover
- [ ] Mangrove section: parallax effect on scroll
- [ ] Events teaser: 2-column split, hover zoom on images
- [ ] Day tour teaser: 4 tiles with icons, prices
- [ ] Facebook section: 2-column, dark ink bg
- [ ] FB section: 3 update entries with date label
- [ ] FB section: "View all updates on Facebook →" link
- [ ] Footer: "Concepts & Future Projects →" link in bottom bar

---

## Stay (`/stay`)

- [ ] Page hero: 60vh, resort image
- [ ] Nav uses `.solid` class (always dark, no transparent state)
- [ ] Rooms section: oyster background
- [ ] Rooms grid: Room 1 (Seaside) is `.feature` — 8 columns, 2-column internal
- [ ] Rooms 4,5 (Extended, Grand Estate) are `.wide` — 4 columns
- [ ] Room cards: hover shadow lift
- [ ] Room image hover zoom
- [ ] Room arrow circle fills on hover
- [ ] Click room → modal opens with full details
- [ ] Room modal: image left, body right
- [ ] Room modal: amenities in 2-column grid
- [ ] Room modal: "Room Rate" label in price box
- [ ] Room modal: "Reserve via Facebook Messenger" CTA
- [ ] Spaces section: sand background, 3-column grid
- [ ] Space cards: hover lift + zoom
- [ ] Click space → modal opens with "Starting From" price
- [ ] Booking push: teal background, heading + 3 buttons

---

## Day Tour (`/day-tour`)

- [ ] Hero: beach image, "Come for the day. Stay for the sunset."
- [ ] Hero eyebrow: "The Day Pass · Open Daily · Walk-ins Welcome"
- [ ] Pass cards: 3-column grid, middle card has teal border + "Most Popular" badge
- [ ] Badge is outside/above card (position absolute, top: -12px)
- [ ] Pass cards are clickable → PassModal
- [ ] PassModal: icon (34px) + pricing 3-column strip (per hour / half day / full day)
- [ ] PassModal pricing boxes: label + large serif price + note
- [ ] Add-ons: sand bg, 4-col grid of 8 tiles, each with icon
- [ ] Timeline: teal bg, icon dots, connecting vertical lines
- [ ] Timeline last item has no connecting line
- [ ] Corporate CTA strip between timeline and FAQ
- [ ] FAQ: serif question text, +/× toggles
- [ ] FAQ: max-height animation on open/close
- [ ] Bottom CTAs: "Confirm My Visit on Messenger" + phone link + hint text

---

## Fun (`/fun`)

- [ ] Hero: pickleball image
- [ ] Sports grid: organic 12-column layout (not equal columns)
- [ ] Sport card 1 (Pickleball): spans columns 1–5
- [ ] Sport card 2 (Volleyball): spans columns 6–12
- [ ] Sport cards 3–5: equal width, row 2
- [ ] Sport cards 6–7: 6+6 columns, row 3
- [ ] Beach Soccer + Badminton: "On Request" overlay, not clickable
- [ ] Other sport cards: clickable → SportModal
- [ ] Water section: teal bg, 3 cards
- [ ] Water cards: dark glass style (rgba bg + rgba border)
- [ ] Leisure section: sand bg, 4 white cards
- [ ] All leisure items clickable → SportModal (using leisure data)
- [ ] CTA: dark ink bg, large 52px serif heading

---

## Build (`/build`)

- [ ] Hero: corporate meeting image
- [ ] Hero: max-width 680px content
- [ ] Tab nav: dark ink, 3 tabs, active tab has brand-color bottom border
- [ ] Corporate tab: 2-column grid
- [ ] Package cards: left-bordered with brand accent, hover shadow
- [ ] Package cards clickable → PackageModal
- [ ] PackageModal: build-your-quote form visible
- [ ] PackageModal: rooms field appears when "Accommodation" is selected in needs
- [ ] Weddings tab: image stack (main + inset offset), feature list, venue cards
- [ ] Wedding venue inset image: `position: absolute; bottom: -20px; right: -20px`
- [ ] Wedding venue cards: overlay on hover
- [ ] Floor plans tab: 2 SVG cards side by side
- [ ] Mangrove SVG: pavilion floor + stage + 6 ellipse tables + mangrove edges + bar + WC labels
- [ ] Vow by the Sea SVG: seating rows + altar + aisle + Davao Gulf strip
- [ ] Each floor plan card: teal header + legend + info + link
- [ ] Inquiry section: teal bg, 2-col; event type pills on right
- [ ] Selecting event type shows Messenger CTA with pre-filled message

---

## See (`/see`)

- [ ] Hero: snorkeling image, "The Island Beyond the Beach"
- [ ] Tours grid: 3 columns, 6 cards, 4/3 aspect ratio
- [ ] Tour cards: hover lift + image zoom + arrow fill
- [ ] Click tour → TourModal
- [ ] TourModal: tag + duration in tag line
- [ ] TourModal: pricing with 30px serif text
- [ ] Samal section: teal bg, 2-column
- [ ] Samal image grid: portrait photo row-spans 2
- [ ] Natural highlights: 2-column grid of 4 horizontal cards
- [ ] Nature cards: 180px fixed-width image column
- [ ] Nature cards: hover translateX(6px)
- [ ] CTA: dark ink, 3 action buttons

---

## Archive (`/archive`)

- [ ] Standalone dark theme (no brand.css, own CSS)
- [ ] Archive nav: different style (centered logo + "Back to Resort" link)
- [ ] Hero badge: "Concepts & Future Projects"
- [ ] Pickleball section: faint bg image, 2-column
- [ ] Pickleball glassmorphism card: `position: absolute; bottom: -24px; left: -24px`
- [ ] 4 stat cards in 2×2 grid
- [ ] Isla Vida section: slightly lighter dark bg, service rows slide on hover
- [ ] Virtual Samal: CSS 3D ocean scene renders (sky + water plane + sun + island)
- [ ] Hotspot pulsing animation active
- [ ] Hotspot tooltip shows on hover

---

## Modal Behavior (all modals)

- [ ] Opens with scale + opacity animation
- [ ] Closes on Escape key
- [ ] Closes on backdrop click
- [ ] Body scroll locked while modal is open
- [ ] Mobile: single column, full-height
- [ ] Mobile: gallery area fixed 280px height
- [ ] Close button: top-right, circular

---

## Mobile Responsiveness

- [ ] Home: hub grid → 2 columns at 720px
- [ ] Home: hero buttons stack vertically
- [ ] Home: strip stacks vertically
- [ ] Stay: rooms grid → 2 columns
- [ ] Stay: feature card becomes block (no internal 2-col)
- [ ] Stay: spaces → 1 column
- [ ] Day Tour: passes → 1 column at 1024px
- [ ] Fun: sports → 2 columns at 1024px, 1 column at 720px
- [ ] Build: tab nav scrolls horizontally
- [ ] Build: floor plans stack vertically
- [ ] See: tours → 2 columns at 1024px, 1 column at 720px
- [ ] All pages: section padding reduces (100px → 56px)
- [ ] All pages: hero padding reduces

---

## Database-Driven Content

- [ ] Room names/prices reflect database values
- [ ] Changing a room price in admin updates Stay page
- [ ] Adding a new room in admin shows on Stay page
- [ ] Unpublishing a room removes it from Stay page
- [ ] Day pass prices reflect database values
- [ ] FAQ changes in admin reflect on Day Tour page
- [ ] Site settings (phone, Messenger URL) update all instances
- [ ] Inquiry submitted via form is saved in DB with correct inquiry type

---

## CTAs / Links

- [ ] All Messenger links point to `https://m.me/AlmejaAzulResort`
- [ ] All Facebook links point to `https://www.facebook.com/AlmejaAzulResort/`
- [ ] Phone links use `tel:09993088800`
- [ ] Old HTML file URLs redirect correctly (`.html` → clean routes)
- [ ] Footer internal links navigate to correct pages/anchors
