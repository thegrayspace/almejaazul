# Migration Plan — Almeja Azul Static → Next.js Full-Stack

---

## Architecture

```
Next.js 15 App Router
├── Public pages — React Server Components + Client Components for interactivity
├── Admin dashboard — Protected routes, CRUD UI, shadcn/ui
├── API routes — Inquiry submission, admin auth, media upload
├── Prisma ORM → PostgreSQL
└── iron-session → cookie-based admin auth
```

---

## Phase Order

### Phase 0 ✓ — Audit
- [x] `docs/frontend-audit.md`
- [x] `docs/visual-reference.md`
- [x] `docs/migration-plan.md` (this file)
- [x] `docs/visual-qa-checklist.md`

### Phase 1 — Project Bootstrap
1. `package.json` — next, react, prisma, bcryptjs, iron-session, zod
2. `tsconfig.json` — strict TypeScript
3. `next.config.ts` — image domains, redirects, env vars
4. `.env.example` — all environment variables documented
5. `.gitignore` — node_modules, .env, .next, prisma client
6. `middleware.ts` — protect `/admin` routes, redirect if not authenticated
7. `styles/brand.css` — migrated from `project/brand.css` (unchanged CSS)
8. Page-specific CSS files in `styles/pages/`
9. `app/globals.css` — import brand.css + page CSS
10. `app/layout.tsx` — root layout with Google Fonts via next/font

### Phase 2 — Database Schema
1. `prisma/schema.prisma` — complete model definitions
2. `npx prisma generate` — generate Prisma client
3. Verify schema with `npx prisma validate`

### Phase 3 — Seed Script
1. `prisma/seed.ts` — extract all hardcoded content from HTML prototypes
2. Covers: SiteSettings, Rooms, BookableSpaces, DayPasses, AddOns, Activities, Tours, EventPackages, Venues, FAQs, FacebookUpdates, FooterLinks
3. Run after DB is set up

### Phase 4 — Core Components
1. `components/icons/index.tsx` — 18 custom icons from `icons.jsx`
2. `components/public/Nav.tsx` — client component, scroll listener
3. `components/public/Footer.tsx` — server component
4. `components/public/MessengerFloat.tsx` — static
5. `components/public/InquiryModal.tsx` — client, context-based
6. `components/public/Modal.tsx` — base modal overlay
7. `lib/db.ts` — Prisma client singleton
8. `lib/auth.ts` — iron-session helpers
9. `app/(public)/layout.tsx` — shared public layout with InquiryModalProvider
10. `app/admin/layout.tsx` — admin shell layout

### Phase 5 — Public Pages
For each page:
- RSC page component fetches from DB via Prisma
- Passes data as props to client interactive components

Pages in order:
1. Home (`app/(public)/page.tsx`)
2. Stay (`app/(public)/stay/page.tsx`)
3. Day Tour (`app/(public)/day-tour/page.tsx`)
4. Fun (`app/(public)/fun/page.tsx`)
5. Build (`app/(public)/build/page.tsx`)
6. See (`app/(public)/see/page.tsx`)
7. Archive (`app/(public)/archive/page.tsx`)

### Phase 6 — Admin Dashboard
1. `app/admin/login/page.tsx` — login form
2. `app/api/admin/login/route.ts` — POST handler, bcrypt verify, set session
3. `app/admin/page.tsx` — dashboard stats overview
4. `app/admin/rooms/page.tsx` — list/edit rooms
5. `app/admin/spaces/page.tsx` — bookable spaces
6. `app/admin/day-passes/page.tsx` — day passes + add-ons
7. `app/admin/activities/page.tsx` — sports + water + leisure
8. `app/admin/tours/page.tsx` — tours
9. `app/admin/events/page.tsx` — corporate packages + event types
10. `app/admin/venues/page.tsx` — wedding venues + floor plans
11. `app/admin/faqs/page.tsx` — FAQ management
12. `app/admin/inquiries/page.tsx` — inquiry list + status
13. `app/admin/settings/page.tsx` — site settings
14. `app/admin/media/page.tsx` — image library

### Phase 7 — Inquiry Forms
1. `app/api/inquiries/route.ts` — POST handler, save to DB, optional email notification
2. Update InquiryModal to POST to API instead of just showing success state
3. Per-page inquiry forms for rooms, spaces, tours, packages, weddings

---

## Components to Create

### Public Components (no Tailwind, custom CSS)

```
components/public/
├── Nav.tsx                  # Client component
├── Footer.tsx               # Server component
├── MessengerFloat.tsx       # Static
├── InquiryModal.tsx         # Client component + context provider
├── Modal.tsx                # Base modal overlay (client)
├── PageHero.tsx             # Reusable page hero section
├── SectionHeader.tsx        # Eyebrow + title
├── CTASection.tsx           # Dark/teal strip with actions
├── FloorPlanSVG.tsx         # SVG floor plan (mangrove | sea)
└── RippleLink.tsx           # .rpl wrapper with ripple effect
```

### Page-specific Client Components

```
components/public/
├── home/
│   ├── HeroSection.tsx      # Kinetic text + parallax bg
│   ├── SectionHub.tsx       # 5 section cards
│   ├── MangroveSection.tsx  # Parallax (scroll listener)
│   └── FBSection.tsx        # Facebook updates display
├── stay/
│   ├── RoomsGrid.tsx        # 12-col organic grid + modal state
│   └── SpacesGrid.tsx       # 3-col spaces + modal state
├── day-tour/
│   ├── PassCards.tsx        # 3 pass cards + modal state
│   └── FAQAccordion.tsx     # Accordion state
├── fun/
│   ├── SportsGrid.tsx       # Organic grid + modal state
│   ├── WaterGrid.tsx        # 3-col water cards + modal state
│   └── LeisureGrid.tsx      # 4-col leisure + modal state
├── build/
│   ├── BuildTabs.tsx        # Tab state
│   ├── PackageCards.tsx     # Package cards + modal state
│   └── EventTypePicker.tsx  # Event type pill state
└── see/
    └── ToursGrid.tsx        # 3-col tour cards + modal state
```

### Admin Components (Tailwind + shadcn/ui)

```
components/admin/
├── AdminLayout.tsx          # Shell with sidebar nav
├── AdminSidebar.tsx         # Nav links
├── DataTable.tsx            # Table with actions
├── RecordForm.tsx           # Generic create/edit form
├── ImagePicker.tsx          # Media library + upload
├── PriceField.tsx           # Price + priceMode selector
├── SortableList.tsx         # Drag-to-reorder
└── PublishToggle.tsx        # Published/draft toggle
```

### Icon System

```
components/icons/index.tsx   # 18 exported icon components, same paths as icons.jsx
```

---

## Database Models Summary

| Model | Key Fields | Used On |
|---|---|---|
| `SiteSettings` | resortName, phone, messengerUrl, facebookUrl, logoUrl | Nav, Footer, CTAs everywhere |
| `Page` | slug, title, heroTitle, heroImageUrl, isPublished | Each page hero |
| `PageSection` | pageSlug, sectionKey, title, body, contentJson | Flexible content blocks |
| `Room` | name, price, priceMode, amenitiesJson, modalImageUrl | Stay page |
| `BookableSpace` | name, capacity, price, priceSub, priceMode | Stay page |
| `DayPass` | name, icon, price, priceSuffix, pricingJson, includesJson | Day Tour page |
| `AddOn` | name, icon, price, priceMode, description | Day Tour page |
| `Activity` | category, name, price, featuresJson, imageUrl, placeholder | Fun page |
| `Tour` | tag, name, price, includesJson, duration, modalImageUrl | See page |
| `EventPackage` | name, includes, price, detail, featuresJson | Build page (Corporate) |
| `Venue` | type, name, capacity, floorPlanSvgType, floorPlanJson | Build page (Weddings/Floor Plans) |
| `FAQ` | pageSlug, question, answer | Day Tour page |
| `Inquiry` | name, email, phone, inquiryType, status | All forms |
| `AdminUser` | email, passwordHash, role | Admin login |
| `FacebookUpdate` | dateLabel, body | Home page FB section |
| `FooterLink` | groupLabel, label, url | All footers |

---

## Seed Strategy

Source data:
- Extract from hardcoded arrays in HTML files (ROOMS, SPACES, PASS_DATA, SPORTS, WATER, LEISURE, TOURS, PACKAGES, etc.)
- After seeding, the site should visually match the HTML prototypes exactly

Seed order (respecting FK dependencies):
1. AdminUser (from env vars `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`)
2. SiteSettings
3. FooterLinks
4. FacebookUpdates
5. Rooms
6. BookableSpaces
7. DayPasses
8. AddOns
9. Activities
10. Tours
11. EventPackages
12. Venues
13. FAQs
14. Pages (hero content for each page)
15. PageSections (where applicable)

---

## Known Risks

| Risk | Mitigation |
|---|---|
| CSS class name collision between brand.css and Next.js modules | Import page CSS as global files, not modules; use page-scoped class names |
| Mangrove parallax requires `window` scroll listener | Wrap in `useEffect`, use `"use client"` |
| `window.openInquiry()` global function from original | Replace with React context `useInquiry()` hook |
| Archive page uses different CSS variables (oklch) | Archive has own standalone CSS, keep as separate stylesheet |
| Floor plan SVG has hardcoded inline React JSX | Extract to `FloorPlanSVG.tsx` with `type: 'mangrove' | 'sea'` prop |
| Image domains (Unsplash CDN) need to be whitelisted | Add `images.unsplash.com` to `next.config.ts` remotePatterns |
| No DB in dev → pages break | Add `lib/site-data.ts` with seed data as fallback for dev-without-DB |
| Admin auth uses iron-session which needs `AUTH_SECRET` >= 32 chars | Validate at startup, throw if missing |
| Emoji in some CTAs (📞) | Replace with `<IconPhone>` component |
| Duplicate JSX in footer of stay.html (malformed HTML) | Ignore, source file had copy-paste artefact; clean up in migration |

---

## Redirects (next.config.ts)

```ts
redirects: [
  { source: '/Almeja%20Azul.html', destination: '/', permanent: true },
  { source: '/stay.html', destination: '/stay', permanent: true },
  { source: '/day-tour.html', destination: '/day-tour', permanent: true },
  { source: '/fun.html', destination: '/fun', permanent: true },
  { source: '/build.html', destination: '/build', permanent: true },
  { source: '/see.html', destination: '/see', permanent: true },
  { source: '/archive.html', destination: '/archive', permanent: true },
]
```

---

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/almeja_azul
AUTH_SECRET=at-least-32-chars-random-secret
ADMIN_EMAIL=admin@almejaazul.com
ADMIN_INITIAL_PASSWORD=change-me-on-first-login

# Optional — email notifications for inquiries
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM=
INQUIRY_NOTIFY_TO=

# Optional — media storage (defaults to local /public/uploads)
MEDIA_STORAGE_PROVIDER=local
MEDIA_STORAGE_KEY=
MEDIA_STORAGE_SECRET=
MEDIA_BUCKET=

# Next.js
NEXTAUTH_URL=http://localhost:3000
```
