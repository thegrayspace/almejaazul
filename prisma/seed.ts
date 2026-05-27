/**
 * Almeja Azul – Database Seed
 * Run: npm run db:seed
 *
 * Seeds all content matching the Prisma schema.
 * Idempotent: clears and re-creates all seeded records.
 */

import { PrismaClient, PriceMode, ActivityCategory, FloorPlanType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database…');

  // ── Admin user ──────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@almejaazul.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, role: 'SUPER_ADMIN' },
  });
  console.log(`  ✓ Admin user: ${adminEmail}`);

  // ── Rooms ───────────────────────────────────────────────
  await prisma.room.deleteMany();
  const rooms = [
    {
      tag: 'Romantic · For Two',
      name: 'Seaside Room',
      subtitle: 'Aircon · Sea-Facing · Queen Bed',
      capacity: 'Good for 2',
      basePrice: 2950,
      priceSuffix: '/night',
      priceMode: PriceMode.NUMERIC,
      longDescription: 'A quietly designed aircon room steps from both beach fronts. White linens, morning light off the Davao Gulf, and the sound of waves at the window. The most intimate retreat on the property — made for two who want unhurried mornings and unhurried evenings.',
      shortDescription: 'The most intimate room on the property, steps from both beach fronts.',
      amenities: ['Aircon', 'Queen bed', 'Private bathroom', 'Sea-facing window', 'Beach access (both fronts)', 'Infinity pool access', 'Complimentary towels', 'Daily housekeeping', 'High-speed fiber WiFi', 'In-room coffee setup'],
      note: 'Day tour add-on: ₱200/pax · Pool +₱100 per additional guest',
      cardImageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85',
      modalImageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=90',
      layoutSize: 'feature',
      isFeatured: true,
      sortOrder: 0,
    },
    {
      tag: 'Family · For Four',
      name: 'Family Room',
      subtitle: 'Aircon · Garden View · 2 Beds',
      capacity: 'Good for 4',
      basePrice: 4950,
      priceSuffix: '/night',
      priceMode: PriceMode.NUMERIC,
      longDescription: "Generous and well-appointed for families ready to reconnect. Set within the resort's 5-hectare grounds, this room opens toward the garden with easy beach and infinity pool access. Space enough for four to breathe and be. Pets welcome.",
      shortDescription: 'Spacious garden-view room ideal for families and small groups.',
      amenities: ['Aircon', '2 beds', 'Private bathroom', 'Garden view', 'Beach access (both fronts)', 'Infinity pool access', 'Complimentary towels', 'Daily housekeeping', 'High-speed fiber WiFi', 'Pet-friendly'],
      note: 'Pets welcome · Extra bedding available on request',
      cardImageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=85',
      modalImageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1400&q=90',
      layoutSize: 'default',
      isFeatured: false,
      sortOrder: 1,
    },
    {
      tag: 'Group · For Six',
      name: 'Group Suite',
      subtitle: 'Aircon · Mangrove Views · Multiple Beds',
      capacity: 'Good for 6',
      basePrice: 5000,
      priceSuffix: '/night',
      priceMode: PriceMode.NUMERIC,
      longDescription: 'Ideal for barkada trips and extended families. A spacious, well-lit room nestled between the beach and the mangrove forest — nature in every direction. Six guests, one setting that brings out the best in everyone.',
      shortDescription: 'Perfect for barkada trips between beach and mangrove forest.',
      amenities: ['Aircon', 'Multiple beds', 'Private bathroom', 'Mangrove edge views', 'Beach access (both fronts)', 'Infinity pool access', 'High-speed fiber WiFi', 'Function room access', 'Van transfer available', 'Outdoor recreation access'],
      note: 'Van transfer from Babak Ferry Terminal available on request',
      cardImageUrl: 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=900&q=85',
      modalImageUrl: 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=1400&q=90',
      layoutSize: 'default',
      isFeatured: false,
      sortOrder: 2,
    },
    {
      tag: 'Extended · For Eight',
      name: 'Extended Room',
      subtitle: 'Aircon · Full Property Access',
      capacity: 'Good for 8',
      basePrice: 7000,
      priceSuffix: '/night',
      priceMode: PriceMode.NUMERIC,
      longDescription: 'For groups that need room to spread out. This configuration gives eight guests full access to both beach fronts, the infinity pool, and all on-site recreation — water sports, courts, and the mangrove boardwalk.',
      shortDescription: 'Full property access for groups of eight.',
      amenities: ['Aircon', 'Multiple beds', 'Private bathrooms', 'Full beach access', 'Infinity pool', 'All recreation facilities', 'High-speed fiber WiFi', 'Priority water sports booking', 'Van transfer available', 'Function room option'],
      note: 'Water sports included in stay pricing during regular season',
      cardImageUrl: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=900&q=85',
      modalImageUrl: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=1400&q=90',
      layoutSize: 'wide',
      isFeatured: false,
      sortOrder: 3,
    },
    {
      tag: 'Grand · For Twelve',
      name: 'Grand Estate Room',
      subtitle: 'Aircon · Full Butler · Events Ready',
      capacity: 'Good for 12',
      basePrice: 8000,
      priceSuffix: '/night',
      priceMode: PriceMode.NUMERIC,
      longDescription: "The resort's grandest accommodation — made for family reunions, group celebrations, and gatherings that deserve a proper setting. Five hectares of coastline, full staff support, and a beach arrival that sets the tone from the moment you land.",
      shortDescription: "The resort's grandest option for reunions and celebrations.",
      amenities: ['Aircon throughout', 'Multiple rooms', 'Full private bathrooms', 'Both beach fronts exclusive', 'Infinity pool priority', 'All water sports', 'Function Hall access', "Chef's dining option", 'Van transfer included', 'Dedicated host'],
      note: 'Best for reunions, milestone celebrations, and private buyouts',
      cardImageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=85',
      modalImageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=90',
      layoutSize: 'wide',
      isFeatured: false,
      sortOrder: 4,
    },
  ];

  for (const r of rooms) {
    await prisma.room.create({
      data: {
        tag: r.tag,
        name: r.name,
        subtitle: r.subtitle,
        capacity: r.capacity,
        basePrice: r.basePrice,
        priceSuffix: r.priceSuffix,
        priceMode: r.priceMode,
        longDescription: r.longDescription,
        shortDescription: r.shortDescription,
        amenitiesJson: r.amenities,
        note: r.note,
        cardImageUrl: r.cardImageUrl,
        modalImageUrl: r.modalImageUrl,
        layoutSize: r.layoutSize,
        isFeatured: r.isFeatured,
        isPublished: true,
        sortOrder: r.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${rooms.length} rooms`);

  // ── Bookable Spaces ─────────────────────────────────────
  await prisma.bookableSpace.deleteMany();
  const spaces = [
    {
      tag: 'Events',
      name: 'Function Hall',
      capacity: 'Up to 100 guests',
      price: 5000,
      priceSub: '/half day · ₱8,000/full',
      priceMode: PriceMode.NUMERIC,
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80',
      description: 'The main event venue at Almeja Azul — a fully air-conditioned hall with natural light and direct access to the beach lawns.',
      amenities: ['Air-conditioned', 'Projector & screen', 'Sound system', '100-person capacity', 'Staging area', 'Bridal / green room', 'Lawn overflow space', 'High-speed WiFi', 'Beach access', 'Catering coordination'],
      note: 'Rates vary by event type and catering requirements',
      sortOrder: 0,
    },
    {
      tag: 'Corporate',
      name: 'Meeting Room',
      capacity: 'Up to 20 persons',
      price: 2500,
      priceSub: '/half day · ₱4,500/full',
      priceMode: PriceMode.NUMERIC,
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80',
      description: 'A quiet, well-designed meeting room for productive sessions with a beach view. High-speed fiber, whiteboard, and video conferencing setup.',
      amenities: ['Aircon', '20-person capacity', '4K display screen', 'Fiber WiFi (dedicated)', 'Whiteboard & markers', 'Video conferencing ready', 'Coffee & water station', 'Natural light', 'Soundproofed', 'Stationery on request'],
      note: 'Half-day (AM or PM) and full-day rates available',
      sortOrder: 1,
    },
    {
      tag: 'Intimate',
      name: 'Coastal Cabana A',
      capacity: 'Up to 10 guests',
      price: 1500,
      priceSub: '/session',
      priceMode: PriceMode.NUMERIC,
      imageUrl: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=700&q=80',
      description: 'An open-air beachside cabana — perfect for small celebrations, company breakouts, or family gatherings by the water.',
      amenities: ['Beachside location', '10-person seating', 'Shade & ventilation', 'Beach access', 'Power outlets', 'Basic AV on request', 'Food & drinks service', 'Sunrise / sunset views'],
      note: 'Ideal for breakout sessions, private dining, and small celebrations',
      sortOrder: 2,
    },
    {
      tag: 'Intimate',
      name: 'Coastal Cabana B',
      capacity: 'Up to 10 guests',
      price: 1500,
      priceSub: '/session',
      priceMode: PriceMode.NUMERIC,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
      description: 'Sister cabana to Cabana A, positioned further along the beach for maximum privacy.',
      amenities: ['Secluded beachside location', '10-person seating', 'Natural ventilation', 'Beach access', 'Power outlets', 'Food & drinks service', 'Mangrove-adjacent view', 'Sunrise lighting'],
      note: 'Can be combined with Cabana A for larger groups of 20',
      sortOrder: 3,
    },
    {
      tag: 'Vendor / Pop-up',
      name: 'Marketplace Area',
      capacity: 'Flexible',
      price: 0,
      priceSub: '',
      priceMode: PriceMode.INQUIRE,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80',
      description: 'A flexible open-air zone designed for pop-up markets, vendor showcases, and artisan fairs.',
      amenities: ['Open-air flexible layout', 'Power connections', 'Shade structures available', 'High foot traffic location', 'WiFi coverage', 'Event lighting available', 'Adjacent parking', 'Setup support'],
      note: 'Great for brand activations, bazaars, and island pop-up events',
      sortOrder: 4,
    },
    {
      tag: 'Waterfront',
      name: 'Beach Pavilion',
      capacity: 'Up to 40 guests',
      price: 3500,
      priceSub: '/event',
      priceMode: PriceMode.NUMERIC,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      description: 'An alfresco event space on the beach itself — open to the sky, the breeze, and the sound of the Davao Gulf.',
      amenities: ['Beachfront location', '40-person capacity', 'String lighting', 'Sound system (portable)', 'Seaside dining setup', 'Sunset-facing', 'Bonfire option', 'Catering coordination', 'Barefoot-optional', 'Photographer-friendly'],
      note: 'Popular for sunset elopements and intimate wedding ceremonies',
      sortOrder: 5,
    },
  ];

  for (const s of spaces) {
    await prisma.bookableSpace.create({
      data: {
        tag: s.tag,
        name: s.name,
        capacity: s.capacity,
        price: s.price,
        priceSub: s.priceSub,
        priceMode: s.priceMode,
        imageUrl: s.imageUrl,
        description: s.description,
        amenitiesJson: s.amenities,
        note: s.note,
        isPublished: true,
        sortOrder: s.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${spaces.length} bookable spaces`);

  // ── Day Passes ──────────────────────────────────────────
  await prisma.dayPass.deleteMany();
  const passes = [
    {
      name: 'Seaside Day Pass',
      icon: 'umbrella',
      price: 200,
      priceSuffix: '/person',
      priceMode: PriceMode.NUMERIC,
      pricingJson: [
        { label: '1 Hour', price: '₱80', note: 'min. 2 hrs' },
        { label: 'Half Day', price: '₱150', note: 'up to 6 hrs' },
        { label: 'Full Day', price: '₱200', note: 'dawn to dusk' },
      ],
      includesJson: ['Both beach fronts', 'Shoreline lounge areas', 'Restroom facilities', 'High-speed WiFi', 'Open daily · Dawn to dusk'],
      note: 'Pets welcome. Walk-ins always accepted. Add pool for ₱100 more.',
      isHighlighted: false,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      sortOrder: 0,
    },
    {
      name: 'Beach + Pool Pass',
      icon: 'waves',
      price: 300,
      priceSuffix: '/person',
      priceMode: PriceMode.NUMERIC,
      pricingJson: [
        { label: '1 Hour', price: '₱120', note: 'min. 2 hrs' },
        { label: 'Half Day', price: '₱200', note: 'up to 6 hrs' },
        { label: 'Full Day', price: '₱300', note: 'dawn to dusk' },
      ],
      includesJson: ['Both beach fronts', 'Infinity pool access', 'Lounge chairs at pool', 'Restroom & shower', 'High-speed WiFi'],
      note: 'Most popular for groups and families.',
      isHighlighted: true,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      sortOrder: 1,
    },
    {
      name: 'Cottage Rental',
      icon: 'cottage',
      price: 300,
      priceSuffix: '/cottage',
      priceMode: PriceMode.NUMERIC,
      pricingJson: [
        { label: '1 Hour', price: '₱100', note: 'min. 2 hrs' },
        { label: 'Half Day', price: '₱200', note: 'up to 6 hrs' },
        { label: 'Full Day', price: '₱300', note: 'dawn to dusk' },
      ],
      includesJson: ['Shaded beachside cottage', 'Table & seating for group', 'Power outlet', 'Cooler storage', 'Full or part-day'],
      note: 'Add any beach pass on top. Best for families and groups.',
      isHighlighted: false,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      sortOrder: 2,
    },
  ];

  for (const p of passes) {
    await prisma.dayPass.create({
      data: {
        name: p.name,
        icon: p.icon,
        price: p.price,
        priceSuffix: p.priceSuffix,
        priceMode: p.priceMode,
        pricingJson: p.pricingJson,
        includesJson: p.includesJson,
        note: p.note,
        isHighlighted: p.isHighlighted,
        imageUrl: p.imageUrl,
        isPublished: true,
        sortOrder: p.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${passes.length} day passes`);

  // ── FAQs ────────────────────────────────────────────────
  await prisma.fAQ.deleteMany();
  const faqs = [
    { pageSlug: 'day-tour', question: 'What time does the resort open for day visitors?', answer: 'The resort opens at 7:00 AM and day guests must check out by 6:00 PM. The last entry for day visitors is 4:00 PM.', sortOrder: 0 },
    { pageSlug: 'day-tour', question: 'Do I need to book in advance for a day pass?', answer: "Walk-ins are always welcome. However, during peak weekends and holidays we recommend confirming via Messenger or a quick call — especially if you're bringing a group of 10 or more.", sortOrder: 1 },
    { pageSlug: 'day-tour', question: 'Are pets allowed?', answer: 'Yes. Almeja Azul is pet-friendly. Dogs and other pets are welcome on the beach and common grounds. We ask that pets are supervised and on a leash in common areas.', sortOrder: 2 },
    { pageSlug: 'day-tour', question: 'Can day guests access the pool?', answer: 'Yes. The Beach + Pool Pass (₱300/person full day) includes full infinity pool access. The Seaside Day Pass does not include pool access but you can upgrade on arrival for ₱100 more per person.', sortOrder: 3 },
    { pageSlug: 'day-tour', question: 'Is food available on-site?', answer: 'Yes. The resort restaurant is open to day guests. We serve Filipino classics, fresh seafood, and light snacks. Corkage fees apply if you bring outside food.', sortOrder: 4 },
    { pageSlug: 'day-tour', question: 'Is WiFi available for day guests?', answer: 'Yes. High-speed fiber WiFi is available throughout the resort, including common areas and the beach. Perfect for the remote worker taking a beach day.', sortOrder: 5 },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: { ...f, isPublished: true } });
  }
  console.log(`  ✓ ${faqs.length} FAQs`);

  // ── Add-ons ─────────────────────────────────────────────
  await prisma.addOn.deleteMany();
  const addons = [
    { name: 'Snorkeling Equipment', icon: 'snorkel', price: 200, priceMode: PriceMode.NUMERIC, description: 'Full snorkel set rental — mask, fins, and vest. Multiple reef sites accessible from both beach fronts.', category: 'water-sports', sortOrder: 0 },
    { name: 'Jet Ski', icon: 'jetski', price: 0, priceMode: PriceMode.INQUIRE, description: 'Open-water jet ski on the Davao Gulf. Rates vary by session length. Inquire at the water sports desk.', category: 'water-sports', sortOrder: 1 },
    { name: 'Banana Boat', icon: 'bananaboat', price: 300, priceMode: PriceMode.NUMERIC, description: 'Up to 8 riders per run. The loudest fun on the property. Lifeguard on duty.', category: 'water-sports', sortOrder: 2 },
    { name: 'Kayak', icon: 'kayak', price: 0, priceMode: PriceMode.ON_REQUEST, description: 'Single and double kayaks available. Paddle the mangrove edge or explore the coastline at your pace.', category: 'water-sports', sortOrder: 3 },
    { name: 'Pickleball Session', icon: 'pickleball', price: 150, priceMode: PriceMode.NUMERIC, description: '3 full courts with equipment provided. Drop-in play or arrange a match. Clinics available on request.', category: 'land-sports', sortOrder: 4 },
    { name: 'Dining Package', icon: 'dining', price: 0, priceMode: PriceMode.INQUIRE, description: 'Pre-arranged meal sets for groups — Filipino classics, fresh seafood, and BBQ on the beach. Inquire for menus and rates.', category: 'dining', sortOrder: 5 },
  ];

  for (const a of addons) {
    await prisma.addOn.create({
      data: {
        name: a.name,
        icon: a.icon,
        price: a.price,
        priceMode: a.priceMode,
        customPriceText: '',
        description: a.description,
        category: a.category,
        isPublished: true,
        sortOrder: a.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${addons.length} add-ons`);

  // ── Activities ──────────────────────────────────────────
  await prisma.activity.deleteMany();
  const activities = [
    { category: ActivityCategory.WATER_SPORT, name: 'Banana Boat', subtitle: 'Davao Gulf thrills — up to 8 riders', price: 300, priceMode: PriceMode.NUMERIC, imageUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=700&q=80', sortOrder: 0 },
    { category: ActivityCategory.WATER_SPORT, name: 'Jet Ski', subtitle: 'Open water on the Davao Gulf', price: 0, priceMode: PriceMode.INQUIRE, imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&q=80', sortOrder: 1 },
    { category: ActivityCategory.COURT_SPORT, name: 'Pickleball', subtitle: '3 courts · Equipment provided', price: 150, priceMode: PriceMode.NUMERIC, imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=700&q=80', sortOrder: 2 },
    { category: ActivityCategory.WATER_SPORT, name: 'Snorkeling', subtitle: 'Reef access · Equipment for rent', price: 200, priceMode: PriceMode.NUMERIC, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&q=80', sortOrder: 3 },
    { category: ActivityCategory.WATER_SPORT, name: 'Kayaking', subtitle: 'Mangrove edge & coastline', price: 0, priceMode: PriceMode.ON_REQUEST, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', sortOrder: 4 },
    { category: ActivityCategory.WATER_SPORT, name: 'Paddleboard', subtitle: 'Calm water sessions', price: 0, priceMode: PriceMode.ON_REQUEST, imageUrl: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=700&q=80', isPlaceholder: true, sortOrder: 5 },
    { category: ActivityCategory.BEACH_SPORT, name: 'Beach Volleyball', subtitle: 'Full court · Team play', price: 0, priceMode: PriceMode.NUMERIC, imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=700&q=80', isPlaceholder: true, sortOrder: 6 },
  ];

  for (const a of activities) {
    await prisma.activity.create({
      data: {
        category: a.category,
        name: a.name,
        subtitle: a.subtitle,
        price: a.price,
        priceMode: a.priceMode,
        imageUrl: a.imageUrl,
        isPlaceholder: a.isPlaceholder ?? false,
        isPublished: true,
        sortOrder: a.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${activities.length} activities`);

  // ── Tours ───────────────────────────────────────────────
  await prisma.tour.deleteMany();
  const tours = [
    {
      tag: 'Island Experience', name: 'Samal Island Tour',
      shortDescription: 'The full picture of Samal — caves, white sand coves, mangrove boardwalks, and local fishing villages.',
      detail: 'A guided full-day circuit of what makes Samal worth the crossing. Caves, white sand coves, mangrove boardwalks, and local fishing villages — this is the island as it actually is, not just the beach in front of the resort.',
      price: 0, priceMode: PriceMode.INQUIRE, duration: 'Full Day',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90',
      sortOrder: 0,
    },
    {
      tag: 'Aquatic Experience', name: 'Reef & Snorkel Tour',
      shortDescription: 'Guided snorkeling over the reefs of Samal. Equipment included. Multiple reef sites.',
      detail: 'Guided snorkeling over the reefs of Samal Island. Equipment included. Multiple reef sites, species briefing, and a surface guide throughout the session.',
      price: 500, priceMode: PriceMode.NUMERIC, duration: 'Half Day',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=90',
      sortOrder: 1,
    },
    {
      tag: 'Sunrise Experience', name: 'Mangrove Kayak at Dawn',
      shortDescription: "A guided kayak through the resort's mangrove sanctuary at first light.",
      detail: "A guided kayak through the resort's mangrove sanctuary at first light. One of the quieter, more unforgettable ways to experience Samal — nature at its most undisturbed.",
      price: 0, priceMode: PriceMode.INQUIRE, duration: '2–3 Hours',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90',
      sortOrder: 2,
    },
    {
      tag: 'Cultural Experience', name: 'Davao City Day Tour',
      shortDescription: "Curated circuit of Davao City — local markets, Durian experience, cultural landmarks, and street food.",
      detail: "From the resort, cross back to Davao City for a curated circuit of the city's best: local markets, Durian experience, cultural landmarks, and street food. A full-day guided tour that rounds out the Samal stay.",
      price: 0, priceMode: PriceMode.INQUIRE, duration: 'Full Day',
      imageUrl: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=1200&q=90',
      sortOrder: 3,
    },
    {
      tag: 'Overnight Experience', name: 'Talicud Island Overnight',
      shortDescription: 'Ferry across to Talicud — a smaller, quieter island with powdery white sand and maximum disconnect.',
      detail: 'Ferry across to Talicud — a smaller, quieter island off Samal with powdery white sand, minimal infrastructure, and maximum disconnect. Camping and simple beach accommodations. Best booked 3+ days in advance.',
      price: 0, priceMode: PriceMode.INQUIRE, duration: 'Overnight',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90',
      sortOrder: 4,
    },
    {
      tag: 'Aerial Experience', name: 'Samal from Above',
      shortDescription: 'Helicopter or light aircraft tour over Samal and the Davao Gulf. Bookable on request.',
      detail: 'Book a helicopter or light aircraft tour over Samal and the Davao Gulf — seeing the island, its coastlines, the nearby islands, and the city from altitude. Available on request, subject to aircraft availability.',
      price: 0, priceMode: PriceMode.INQUIRE, duration: '45 – 90 Min',
      imageUrl: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=1200&q=90',
      sortOrder: 5,
    },
  ];

  for (const t of tours) {
    await prisma.tour.create({
      data: {
        tag: t.tag,
        name: t.name,
        shortDescription: t.shortDescription,
        detail: t.detail,
        price: t.price,
        priceMode: t.priceMode,
        duration: t.duration,
        imageUrl: t.imageUrl,
        modalImageUrl: t.modalImageUrl,
        isPublished: true,
        sortOrder: t.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${tours.length} tours`);

  // ── Event Packages ──────────────────────────────────────
  await prisma.eventPackage.deleteMany();
  const packages = [
    {
      type: 'corporate', name: 'The Day Retreat',
      includesText: 'Function Hall (full day) · Meeting Room · All recreation courts · Beach & pool access · WiFi · 2 meals',
      price: 0, priceMode: PriceMode.INQUIRE,
      description: 'A complete corporate day — structured morning sessions in the Function Hall, breakout rooms, then the beach and recreation courts open for the afternoon. Two meals included. Built for productive teams.',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80',
      minPax: 20, maxPax: 100,
      durationsJson: ['Half Day', 'Full Day'],
      featuresJson: ['Function Hall — 100 pax', 'Meeting Room — 20 pax', 'All courts + beach + pool', 'Fiber WiFi throughout', '2 meals included', 'On-site coordinator'],
      sortOrder: 0,
    },
    {
      type: 'corporate', name: 'The Overnight Build',
      includesText: 'Accommodation (2 nights) · Full venue access · Team sports facilitation · Island tour · All meals · WiFi',
      price: 0, priceMode: PriceMode.CUSTOM, customPriceText: 'Custom package — message us',
      description: 'Two days, two nights. Morning strategy, afternoon island activities, evening dinners on the beach. The format that actually moves teams. Full accommodation, all meals, island tour — everything coordinated.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      minPax: 15, maxPax: 60,
      durationsJson: ['2 Nights', '3 Nights', 'Custom'],
      featuresJson: ['Accommodation · all rooms', 'Full venue access', 'Team sports facilitation', 'Island tour by bangka', 'All meals included', 'WiFi · full resort'],
      sortOrder: 1,
    },
    {
      type: 'corporate', name: 'The Full Buyout',
      includesText: 'Exclusive resort use · All rooms · All venues · All recreation · Full staff · All meals',
      price: 0, priceMode: PriceMode.INQUIRE,
      description: 'The whole resort — exclusively yours. All rooms, all venues, every beach, the pool, the courts, the restaurant. Custom programming available. Available for a minimum of 2 nights.',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80',
      minPax: 30, maxPax: 150,
      durationsJson: ['2 Nights', '3 Nights', 'Custom'],
      featuresJson: ['Exclusive full resort use', 'All rooms included', 'All venues + beach', 'Dedicated event host', 'Custom activity programming', 'All meals · catering team'],
      sortOrder: 2,
    },
  ];

  for (const p of packages) {
    await prisma.eventPackage.create({
      data: {
        type: p.type,
        name: p.name,
        includesText: p.includesText,
        price: p.price,
        priceMode: p.priceMode,
        customPriceText: (p as { customPriceText?: string }).customPriceText ?? '',
        description: p.description,
        imageUrl: p.imageUrl,
        minPax: p.minPax,
        maxPax: p.maxPax,
        durationsJson: p.durationsJson,
        featuresJson: p.featuresJson,
        isPublished: true,
        sortOrder: p.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${packages.length} event packages`);

  // ── Venues ──────────────────────────────────────────────
  await prisma.venue.deleteMany();
  const venues = [
    {
      type: 'wedding', tag: 'Garden · Open Air', name: 'Mangrove Pavilion',
      subtitle: 'Ceremony & Reception · Up to 120 guests',
      capacity: 'Up to 120 guests',
      description: 'A shaded open-air pavilion set at the edge of the mangrove sanctuary. String lights overhead, the sound of the forest behind you, and the Davao Gulf just beyond the ceremony lawn. The most requested venue for intimate outdoor weddings.',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=90',
      floorPlanSvgType: FloorPlanType.MANGROVE_PAVILION,
      amenitiesJson: ['Open-air pavilion', 'Mangrove backdrop', 'String light canopy', 'Ceremony lawn', 'Cocktail terrace', 'Bridal suite', 'Built-in sound system', 'Fiber WiFi', 'Generator backup', 'In-house catering option'],
      price: 0, priceMode: PriceMode.INQUIRE,
      sortOrder: 0,
    },
    {
      type: 'wedding', tag: 'Beachfront · Barefoot', name: 'Vow by the Sea',
      subtitle: 'Ceremony at the Water\'s Edge · Up to 60 guests',
      capacity: 'Up to 60 guests',
      description: 'An intimate ceremony setup directly on the beach — sand underfoot, the Davao Gulf ahead, and a horizon that stretches to Mindanao. Designed for small, meaningful ceremonies where the setting does the work.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90',
      floorPlanSvgType: FloorPlanType.VOW_BY_THE_SEA,
      amenitiesJson: ['Beachfront ceremony space', 'Sunset-facing', 'Bamboo arch option', 'Petal aisle setup', 'Bonfire option', 'Portable sound system', 'Cocktail area on sand', 'Barefoot-optional', 'Photographer-friendly golden hour', 'Intimate capacity'],
      price: 0, priceMode: PriceMode.INQUIRE,
      sortOrder: 1,
    },
    {
      type: 'wedding', tag: 'Indoor · Airconditioned', name: 'The Function Hall',
      subtitle: 'Reception & Celebration · Up to 150 guests',
      capacity: 'Up to 150 guests',
      description: 'The resort\'s main indoor event space — fully air-conditioned with natural light, direct beach access, and a built-in AV system. The go-to for receptions that go past sunset and need a proper dance floor.',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80',
      modalImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=90',
      floorPlanSvgType: FloorPlanType.CUSTOM,
      amenitiesJson: ['Air-conditioned throughout', '150-person capacity', 'Projector & stage', 'Dance floor', 'Sound system', 'Bridal room', 'Lawn overflow', 'Fiber WiFi', 'Generator backup', 'Catering coordination'],
      price: 0, priceMode: PriceMode.INQUIRE,
      sortOrder: 2,
    },
  ];

  for (const v of venues) {
    await prisma.venue.create({
      data: {
        type: v.type,
        tag: v.tag,
        name: v.name,
        subtitle: v.subtitle,
        capacity: v.capacity,
        description: v.description,
        imageUrl: v.imageUrl,
        modalImageUrl: v.modalImageUrl,
        floorPlanSvgType: v.floorPlanSvgType,
        amenitiesJson: v.amenitiesJson,
        price: v.price,
        priceMode: v.priceMode,
        isPublished: true,
        sortOrder: v.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${venues.length} venues`);

  console.log('\n✅ Seed complete!');
  console.log(`\n  Admin login: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log('\n  ⚠️  Change the admin password immediately in production.');
}

main()
  .catch(err => { console.error('Seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
