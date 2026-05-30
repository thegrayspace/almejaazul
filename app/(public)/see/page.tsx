import '@/styles/pages/see.css';
import SeeContent, { TourItem } from '@/components/public/SeeContent';
import { prisma } from '@/lib/db';
import { generateOgMetadata } from '@/lib/seo/og';

export const metadata = generateOgMetadata({
  title: 'See & Explore',
  description:
    'Island tours, reef snorkeling, mangrove kayaking, and natural wonders around Samal Island from Almeja Azul.',
  path: '/see',
});

function formatPrice(price: number, mode: string, customText: string): string {
  if (mode === 'INQUIRE') return 'Inquire for rates';
  if (mode === 'ON_REQUEST') return 'On Request';
  if (mode === 'CUSTOM') return customText;
  return `₱${price.toLocaleString()}`;
}

export default async function SeePage() {
  let tours: TourItem[] | undefined;
  try {
    const dbTours = await prisma.tour.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } });
    if (dbTours.length > 0) {
      tours = dbTours.map(t => ({
        id: t.id,
        tag: t.tag,
        name: t.name,
        desc: t.shortDescription || t.detail,
        price: formatPrice(Number(t.price), t.priceMode, t.customPriceText),
        img: t.imageUrl,
        duration: t.duration,
        mImg: t.modalImageUrl || t.imageUrl,
      }));
    }
  } catch { /* DB unavailable — SeeContent will use built-in defaults */ }

  return (
    <>
      <section className="see-hero">
        <div className="see-hero-bg" />
        <div className="see-hero-vgn" />
        <div className="see-hero-content">
          <p className="eyebrow">Island Experiences</p>
          <h1 className="s-title-light">Beyond the <em>shore.</em></h1>
          <p className="sub">Island tours, reef snorkeling, mangrove kayaking, and the natural wonders of Samal — from the resort, all the way out.</p>
        </div>
      </section>
      <SeeContent tours={tours} />
    </>
  );
}
