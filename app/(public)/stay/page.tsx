import type { Metadata } from 'next';
import '@/styles/pages/stay.css';
import StayGrid from '@/components/public/StayGrid';
import { prisma } from '@/lib/db';
import OptimizedImage from '@/components/public/OptimizedImage';
import { resortImages } from '@/lib/image-assets';

export const metadata: Metadata = {
  title: 'Rooms & Spaces',
  description:
    'Aircon rooms for 2 to 12 guests on Samal Island. All with full beach access, infinity pool, and high-speed fiber WiFi.',
};

function formatPrice(amount: number, mode: string, suffix: string): string {
  if (mode === 'INQUIRE') return 'Inquire';
  if (mode === 'INCLUDED') return 'Included';
  if (mode === 'COMPLIMENTARY') return 'Complimentary';
  return `â‚±${amount.toLocaleString()}`;
}

export default async function StayPage() {
  let roomItems = undefined;
  let spaceItems = undefined;

  try {
    const [dbRooms, dbSpaces] = await Promise.all([
      prisma.room.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.bookableSpace.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    ]);

    if (dbRooms.length > 0) {
      roomItems = dbRooms.map(r => ({
        id: r.id,
        tag: r.tag,
        name: r.name,
        sub: r.subtitle || undefined,
        cap: r.capacity,
        price: formatPrice(Number(r.basePrice), r.priceMode, r.priceSuffix),
        img: r.cardImageUrl,
        mImg: r.modalImageUrl || undefined,
        desc: r.longDescription,
        amenities: (r.amenitiesJson as string[]) ?? [],
        note: r.note || undefined,
        layoutSize: r.layoutSize,
      }));
    }

    if (dbSpaces.length > 0) {
      spaceItems = dbSpaces.map(s => ({
        id: s.id,
        tag: s.tag,
        name: s.name,
        cap: s.capacity,
        price: formatPrice(Number(s.price), s.priceMode, s.priceSub),
        priceSub: s.priceSub || undefined,
        img: s.imageUrl,
        mImg: s.modalImageUrl || undefined,
        desc: s.description,
        amenities: (s.amenitiesJson as string[]) ?? [],
        note: s.note || undefined,
      }));
    }
  } catch {
    // DB unavailable â€” StayGrid will use built-in defaults
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-bg">
          <OptimizedImage
            src={resortImages.grandRoom}
            alt=""
            fill
            priority
            fetchPriority="high"
            quality={50}
            sizes="100vw"
            className="page-hero-img"
          />
        </div>
        <div className="page-hero-vgn" />
        <div className="page-hero-content">
          <p className="s-eyebrow-light">Where You Stay</p>
          <h1 className="s-title-light">Rooms &amp; <em>Spaces</em></h1>
        </div>
      </section>

      <StayGrid rooms={roomItems} spaces={spaceItems} />
    </>
  );
}
