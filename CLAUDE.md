# Almeja Azul — Claude Code Context

## Project
Beach resort website for Almeja Azul (LYR Beach Resort, Samal Island, Davao del Norte, Philippines).
Migrated from static HTML prototypes to a full-stack Next.js 15 app with a CMS admin.

**Repo:** https://github.com/thegrayspace/almejaazul  
**Admin email:** ben@thegray.space  
**Admin default password:** changeme123 (change this in production via Prisma Studio)

---

## Stack
- **Next.js 15** App Router, TypeScript, React Server Components
- **Prisma ORM** → **PostgreSQL** (hosted on Neon — serverless, free tier)
- **iron-session** — cookie-based admin auth (no NextAuth)
- **No Tailwind** — custom CSS in `styles/` + inline styles in admin components
- **Fonts:** Cormorant Garamond + Plus Jakarta Sans via `next/font/google`

---

## Environment Variables (`.env.local`)
```
DATABASE_URL=        # Neon PostgreSQL connection string
AUTH_SECRET=         # >= 32 char random string
ADMIN_EMAIL=         # admin login email
ADMIN_INITIAL_PASSWORD=  # used only by seed script
```

---

## Key File Locations
```
app/(public)/          Public pages (Home, Stay, Day Tour, Fun, Build, See, Archive)
app/admin/             Admin CMS pages
app/api/admin/         Auth + CRUD API routes
app/api/inquiries/     Public inquiry form submission
components/public/     Public UI components (no Tailwind)
components/admin/      Admin UI components (inline styles)
components/icons/      18 custom SVG icon components
lib/auth.ts            iron-session helpers + requireAdminSession()
lib/db.ts              Prisma client singleton
lib/site-data.ts       Fallback site settings if DB unavailable
middleware.ts          Protects /admin routes
prisma/schema.prisma   Full DB schema
prisma/seed.ts         Seeds DB with content + admin user
styles/brand.css       Resort brand CSS (colors, typography, utilities)
styles/pages/          Per-page CSS files
```

---

## Database Models
| Model | Purpose |
|---|---|
| `SiteSettings` | Resort name, phone, Messenger URL, logo |
| `Room` | Room listings (Stay page) |
| `BookableSpace` | Function hall, cabanas, etc. (Stay page) |
| `DayPass` | Seaside/Beach+Pool/Cottage pass pricing |
| `AddOn` | Upsell items for day tour |
| `Activity` | Sports/leisure activities (Fun page) |
| `Tour` | Island excursions (See page) |
| `EventPackage` | Corporate/retreat packages (Build page) |
| `Venue` | Wedding venues with floor plans (Build page) |
| `FAQ` | Per-page FAQs |
| `Inquiry` | Form submissions from public site |
| `AdminUser` | CMS login (bcrypt hashed password) |
| `FacebookUpdate` | FB posts displayed on home page |
| `MediaAsset` | Uploaded image library |

---

## What's Built

### Public Pages
- [x] Home (`/`) — hero, section hub, mangrove parallax, FB updates section
- [x] Stay (`/stay`) — rooms grid + bookable spaces
- [x] Day Tour (`/day-tour`) — pass cards + FAQ accordion
- [x] Fun (`/fun`) — sports/water/leisure grids
- [x] Build (`/build`) — corporate packages + wedding venues tabs
- [x] See (`/see`) — tours grid
- [x] Archive (`/archive`) — static content page

### Admin CMS
- [x] Login (`/admin/login`)
- [x] Dashboard (`/admin`) — nav grid to all sections
- [x] Rooms CRUD (`/admin/rooms`)
- [x] FAQs CRUD (`/admin/faqs`)
- [x] Inquiries list + status update (`/admin/inquiries`)

### Infrastructure
- [x] Prisma schema + migration (run locally)
- [x] Seed script (run locally — creates admin user + all content)
- [x] iron-session auth + middleware route protection
- [x] Inquiry form API (`POST /api/inquiries`)
- [x] Media upload utility (`lib/media.ts`)

---

## What's NOT Built Yet (Admin stubs — 404 on click)
The dashboard nav links to these pages but they don't exist yet:
- `/admin/spaces` — BookableSpace CRUD
- `/admin/day-passes` — DayPass CRUD
- `/admin/addons` — AddOn CRUD
- `/admin/activities` — Activity CRUD
- `/admin/tours` — Tour CRUD
- `/admin/packages` — EventPackage CRUD
- `/admin/venues` — Venue CRUD
- `/admin/media` — MediaAsset library + upload
- `/admin/settings` — SiteSettings editor

---

## Known Issues
1. **Admin dashboard 404s** — 9 nav items link to unbuilt pages (see above)
2. **Neon connection drop warnings** in dev console — `prisma:error Error in PostgreSQL connection: Error { kind: Closed }` — harmless, Neon drops idle connections on free tier
3. **Hydration warning** in browser — caused by ClickUp Chrome extension injecting a class on `<body>`, not a code issue

---

## How to Run Locally
```bash
npm install
# Create .env.local with the 4 env vars above
npx prisma migrate dev --name init   # first time only
npm run db:seed                       # first time only
npm run dev                           # http://localhost:3000
```

## How to Work in a New Session (claude.ai/code)
1. Clone: `git clone https://github.com/thegrayspace/almejaazul /home/claude/repo`
2. Read this file
3. Ask for a GitHub token if pushing is needed (user provides PAT)
4. Make changes, commit, push

---

## Design System Notes
- **Brand colors:** `#1a2530` (dark navy), `#4BBFE0` (teal), `#f0ece3` (warm off-white)
- **No Tailwind** — all styling is CSS classes from `styles/` or inline styles
- Public pages use the CSS class system from the original HTML prototypes (preserved exactly)
- Admin pages use inline `style={{}}` objects — intentional, keeps admin self-contained
- Icons are in `components/icons/index.tsx` — 18 components matching the original `icons.jsx`
- `PriceMode` enum controls how prices display: `NUMERIC | INQUIRE | INCLUDED | COMPLIMENTARY | ON_REQUEST | CUSTOM`

## Original Source Files
The `project/` directory contains the original HTML prototypes that the app was migrated from.
Use these as the visual reference when building public pages.
