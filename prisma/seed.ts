/**
 * Almeja Azul – Database Seed
 * Run: npm run db:seed
 *
 * Seeds all content matching the Prisma schema.
 * Idempotent: clears and re-creates all seeded records.
 */

import { PrismaClient, PriceMode } from '@prisma/client';
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
        { label: '1 Hour', price: 80 },
        { label: 'Half Day', price: 150 },
        { label: 'Full Day', price: 200 },
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
        { label: '1 Hour', price: 120 },
        { label: 'Half Day', price: 200 },
        { label: 'Full Day', price: 300 },
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
        { label: '1 Hour', price: 100 },
        { label: 'Half Day', price: 200 },
        { label: 'Full Day', price: 300 },
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

  console.log('\n✅ Seed complete!');
  console.log(`\n  Admin login: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log('\n  ⚠️  Change the admin password immediately in production.');
}

main()
  .catch(err => { console.error('Seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
