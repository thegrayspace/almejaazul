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

## Architecture Decision
**Keep as a Next.js monolith.** A frontend/backend split was evaluated and rejected — no technical benefit for this project's scale. API routes, RSCs, and admin CMS all live in the same repo and deploy together to Vercel.

---

## Deployment: Vercel
- Deployed at Vercel (connected to GitHub repo — pushes to `main` auto-deploy)
- All four environment variables must be set in the Vercel dashboard (not just `.env.local`)
- `.vercel/` is in `.gitignore` — do not commit it

### Vercel-specific gotchas
- **Do not add `build/` to `.gitignore`.** This was the root cause of the `/build` page 404 on Vercel: a CRA-leftover `build/` ignore pattern silently excluded `app/(public)/build/page.tsx` from git, so Vercel never received the file. It has been removed. Next.js outputs to `.next/`, not `build/`.
- **`export const dynamic = 'force-dynamic'`** is set on `app/(public)/build/page.tsx` to prevent Neon cold-start timeouts from stalling static generation during `next build`.
- **Neon connection drop warnings** (`prisma:error Error { kind: Closed }`) are harmless — Neon drops idle connections on the free tier.

---

## Environment Variables (`.env.local` locally, Vercel dashboard in production)
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
project/               Original HTML prototypes — visual reference for public pages
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

Prisma v6 — `datasource db` block must only have `provider` and `url`. No `connection_limit` or other extra properties (Prisma v6 dropped them).

---

## What's Built

### Public Pages (all working)
- [x] Home (`/`) — hero, section hub, mangrove parallax, FB updates section
- [x] Stay (`/stay`) — rooms grid + bookable spaces
- [x] Day Tour (`/day-tour`) — pass cards + FAQ accordion
- [x] Fun (`/fun`) — sports/water/leisure grids
- [x] Build (`/build`) — corporate packages + wedding venues tabs (BuildTabs component)
- [x] See (`/see`) — tours grid
- [x] Archive (`/archive`) — static content page

### Admin CMS
- [x] Login (`/admin/login`)
- [x] Dashboard (`/admin`) — nav grid to all sections
- [x] Rooms CRUD (`/admin/rooms`)
- [x] FAQs CRUD (`/admin/faqs`)
- [x] Inquiries list + status update (`/admin/inquiries`)
- [x] Spaces CRUD (`/admin/spaces`)
- [x] Day Passes CRUD (`/admin/day-passes`)
- [x] Add-Ons CRUD (`/admin/addons`)
- [x] Activities CRUD (`/admin/activities`)
- [x] Tours CRUD (`/admin/tours`)
- [x] Event Packages CRUD (`/admin/packages`)
- [x] Venues CRUD (`/admin/venues`)
- [x] Media Manager (`/admin/media`)
- [x] Site Settings Editor (`/admin/settings`)

### Infrastructure
- [x] Prisma schema + migration
- [x] Seed script (creates admin user + all content)
- [x] iron-session auth + middleware route protection
- [x] Inquiry form API (`POST /api/inquiries`)
- [x] Media upload utility (`lib/media.ts`)

---

## Known Issues
- **Hydration warning** in browser — caused by ClickUp Chrome extension injecting a class on `<body>`. Not a code issue.

---

## Design System
- **Brand colors:** `#1a2530` (dark navy), `#4BBFE0` (teal), `#f0ece3` (warm off-white)
- **No Tailwind** — all styling is CSS classes from `styles/` or inline `style={{}}` objects
- Public pages use CSS class names from the original HTML prototypes (preserved exactly)
- Admin pages use inline `style={{}}` — intentional, keeps admin self-contained
- Icons: `components/icons/index.tsx` — 18 SVG components matching `project/icons.jsx`
- `PriceMode` enum: `NUMERIC | INQUIRE | INCLUDED | COMPLIMENTARY | ON_REQUEST | CUSTOM`

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
4. Make changes, commit, push to `main` (triggers Vercel deploy)
