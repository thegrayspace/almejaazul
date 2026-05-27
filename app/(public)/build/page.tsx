import type { Metadata } from 'next';
import '@/styles/pages/build.css';
import BuildTabs, { PackageItem, VenueItem } from '@/components/public/BuildTabs';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Build Your Event',
  description: 'Corporate retreats, team building, destination weddings, and private events at Almeja Azul on Samal Island.',
};

function formatPrice(price: number, mode: string, customText: string): string {
  if (mode === 'INQUIRE') return 'Custom package — message us';
  if (mode === 'ON_REQUEST') return 'On Request';
  if (mode === 'CUSTOM') return customText;
  return `₱${price.toLocaleString()}`;
}

export default async function BuildPage() {
  let packages: PackageItem[] | undefined;
  let venues: VenueItem[] | undefined;

  try {
    const [dbPackages, dbVenues] = await Promise.all([
      prisma.eventPackage.findMany({ where: { isPublished: true, type: 'corporate' }, orderBy: { sortOrder: 'asc' } }),
      prisma.venue.findMany({ where: { isPublished: true, type: 'wedding' }, orderBy: { sortOrder: 'asc' } }),
    ]);

    if (dbPackages.length > 0) {
      packages = dbPackages.map(p => ({
        name: p.name,
        includes: p.includesText,
        price: formatPrice(Number(p.price), p.priceMode, p.customPriceText),
        img: p.imageUrl || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80',
        detail: p.description,
        minPax: p.minPax,
        maxPax: p.maxPax,
        duration: p.durationsJson as string[],
        features: p.featuresJson as string[],
      }));
    }

    if (dbVenues.length > 0) {
      venues = dbVenues.map(v => ({
        tag: v.tag,
        name: v.name,
        sub: v.subtitle,
        img: v.imageUrl,
      }));
    }
  } catch { /* DB unavailable — BuildTabs will use built-in defaults */ }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=2000&q=85')" }} />
        <div className="page-hero-vgn" />
        <div className="page-hero-content">
          <p className="hero-eyebrow">Events &amp; Weddings</p>
          <h1 className="s-title-light">Build Your <em>Event</em></h1>
          <p>Corporate retreats, team building, destination weddings — built around your group.</p>
        </div>
      </section>
      <BuildTabs packages={packages} venues={venues} />
    </>
  );
}
