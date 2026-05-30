import '@/styles/pages/fun.css';
import FunContent, { ActivityItem } from '@/components/public/FunContent';
import { prisma } from '@/lib/db';
import { generateOgMetadata } from '@/lib/seo/og';

export const metadata = generateOgMetadata({
  title: 'Fun & Recreation',
  description:
    'Water sports, pickleball, kayaking, snorkeling, banana boat, pool, and beach recreation at Almeja Azul on Samal Island.',
  path: '/fun',
});

const CATEGORY_LABELS: Record<string, string> = {
  COURT_SPORT: 'Court Sport',
  TEAM_SPORT: 'Team Sport',
  GIANT_LEISURE: 'Giant Leisure',
  LAWN_GAME: 'Lawn Game',
  BEACH_SPORT: 'Beach Sport',
  WATER_SPORT: 'Water Sport',
  LEISURE_NATURE: 'Leisure & Nature',
};

function formatPrice(price: number, mode: string, customText: string): string {
  if (mode === 'INQUIRE') return 'Inquire';
  if (mode === 'ON_REQUEST') return 'On Request';
  if (mode === 'INCLUDED') return 'Included';
  if (mode === 'COMPLIMENTARY') return 'Complimentary';
  if (mode === 'CUSTOM') return customText;
  return `₱${price.toLocaleString()}`;
}

export default async function FunPage() {
  let activities: ActivityItem[] | undefined;

  try {
    const dbActivities = await prisma.activity.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } });
    if (dbActivities.length > 0) {
      activities = dbActivities.map(a => ({
        id: a.id,
        cat: a.isPlaceholder ? 'Coming Soon' : (CATEGORY_LABELS[a.category] ?? a.category),
        name: a.name,
        sub: a.subtitle,
        img: a.imageUrl || 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=700&q=80',
        pill: formatPrice(Number(a.price), a.priceMode, a.customPriceText),
        status: a.isPlaceholder ? 'request' : 'active',
      }));
    }
  } catch { /* DB unavailable — FunContent will use built-in defaults */ }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530053969600-caed2596d242?w=2000&q=85')" }} />
        <div className="page-hero-vgn" />
        <div className="page-hero-content">
          <p className="hero-eyebrow">Recreation</p>
          <h1 className="s-title-light">Sports &amp; <em>Play</em></h1>
          <p>Water sports, courts, pool, and beach — everything moving, all day long.</p>
        </div>
      </section>
      <FunContent activities={activities} />
    </>
  );
}
