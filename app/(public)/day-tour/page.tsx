import type { Metadata } from 'next';
import '@/styles/pages/day-tour.css';
import DayTourContent, { PassItem, AddOnItem } from '@/components/public/DayTourContent';
import { prisma } from '@/lib/db';
import OptimizedImage from '@/components/public/OptimizedImage';
import { resortImages } from '@/lib/image-assets';

export const metadata: Metadata = {
  title: 'Day Tour',
  description: 'No overnight stay required. Two beach fronts, infinity pool, water sports, fresh food, and high-speed WiFi. Walk-ins welcome, pets welcome.',
};

function formatPrice(price: number, mode: string, customText: string): string {
  if (mode === 'INQUIRE') return 'Inquire for rates';
  if (mode === 'ON_REQUEST') return 'On Request';
  if (mode === 'INCLUDED') return 'Included';
  if (mode === 'COMPLIMENTARY') return 'Complimentary';
  if (mode === 'CUSTOM') return customText;
  return `â‚±${price.toLocaleString()}`;
}

export default async function DayTourPage() {
  let passes: PassItem[] | undefined;
  let addons: AddOnItem[] | undefined;

  try {
    const [dbPasses, dbAddons] = await Promise.all([
      prisma.dayPass.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.addOn.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    ]);

    if (dbPasses.length > 0) {
      passes = dbPasses.map(p => ({
        key: p.id,
        name: p.name,
        iconName: p.icon,
        tag: p.isHighlighted ? 'Most Popular Â· Per Person' : 'Per Person',
        img: p.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
        pricing: p.pricingJson as { label: string; price: string; note: string }[],
        includes: p.includesJson as string[],
        note: p.note,
        unit: p.priceSuffix.replace(/^\//, '') || 'per person',
      }));
    }

    if (dbAddons.length > 0) {
      addons = dbAddons.map(a => ({
        name: a.name,
        icon: a.icon,
        price: formatPrice(Number(a.price), a.priceMode, a.customPriceText),
        desc: a.description,
      }));
    }
  } catch { /* DB unavailable â€” DayTourContent will use built-in defaults */ }

  return (
    <>
      <section className="dt-hero">
        <div className="dt-hero-bg">
          <OptimizedImage
            src={resortImages.beach}
            alt=""
            fill
            priority
            fetchPriority="high"
            quality={50}
            sizes="100vw"
            className="dt-hero-img"
          />
        </div>
        <div className="dt-hero-vgn" />
        <div className="dt-hero-content">
          <p className="eyebrow">The Day Pass Â· Open Daily Â· Walk-ins Welcome</p>
          <h1 className="s-title-light">Come for the <em>day.</em><br />Stay for the sunset.</h1>
          <p className="sub">No overnight stay required. Two beach fronts, an infinity pool, water sports, fresh food, and high-speed WiFi â€” all available to day visitors. Pets welcome.</p>
        </div>
      </section>
      <DayTourContent passes={passes} addons={addons} />
    </>
  );
}
