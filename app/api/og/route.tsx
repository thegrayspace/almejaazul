import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getSiteSettings } from '@/lib/site-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;

// Brand palette (mirrors styles/brand.css).
const COLOR_INK = '#1a2530';
const COLOR_BRAND = '#4BBFE0';
const COLOR_SAND = '#f0ece3';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function toAbsolute(url: string | null | undefined, fallback: string): string {
  const value = url && url.length > 0 ? url : fallback;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${SITE_URL}${value}`;
  return `${SITE_URL}/${value}`;
}

function formatPrice(price: number, mode: string, custom: string): string {
  switch (mode) {
    case 'INQUIRE':       return 'Inquire for rates';
    case 'INCLUDED':      return 'Included';
    case 'COMPLIMENTARY': return 'Complimentary';
    case 'ON_REQUEST':    return 'On Request';
    case 'CUSTOM':        return custom || 'On Request';
    default:              return `₱${price.toLocaleString('en-PH')}`;
  }
}

type Card = {
  name: string;
  eyebrow: string;
  priceLabel: string;
  capacity: string;
  imageUrl: string;
};

async function loadCard(type: string | null, id: string | null): Promise<Card> {
  const settings = await getSiteSettings();
  const logo = toAbsolute(settings.logoUrl, '/uploads/Almeja_Logo_Large_PNG.png');
  const defaultHero = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=85';

  const fallback: Card = {
    name: settings.resortName || 'Almeja Azul',
    eyebrow: settings.tagline || 'LYR Beach Resort · Samal Island',
    priceLabel: 'Day passes from ₱200',
    capacity: 'Brgy. Adecor, Samal Island',
    imageUrl: defaultHero,
  };

  if (!type || !id) return fallback;

  try {
    if (type === 'room') {
      const r = await prisma.room.findUnique({ where: { id } });
      if (!r) return fallback;
      return {
        name: r.name,
        eyebrow: r.tag || 'Room',
        priceLabel: `${formatPrice(Number(r.basePrice), r.priceMode, r.customPriceText)}${r.priceMode === 'NUMERIC' ? r.priceSuffix : ''}`,
        capacity: r.capacity || '',
        imageUrl: toAbsolute(r.cardImageUrl, defaultHero),
      };
    }
    if (type === 'tour') {
      const t = await prisma.tour.findUnique({ where: { id } });
      if (!t) return fallback;
      return {
        name: t.name,
        eyebrow: t.tag || 'Island Tour',
        priceLabel: formatPrice(Number(t.price), t.priceMode, t.customPriceText),
        capacity: t.duration || '',
        imageUrl: toAbsolute(t.imageUrl, defaultHero),
      };
    }
    if (type === 'venue') {
      const v = await prisma.venue.findUnique({ where: { id } });
      if (!v) return fallback;
      return {
        name: v.name,
        eyebrow: v.tag || 'Wedding Venue',
        priceLabel: formatPrice(Number(v.price), v.priceMode, v.customPriceText),
        capacity: v.capacity || '',
        imageUrl: toAbsolute(v.imageUrl, defaultHero),
      };
    }
    if (type === 'package' || type === 'event') {
      const p = await prisma.eventPackage.findUnique({ where: { id } });
      if (!p) return fallback;
      return {
        name: p.name,
        eyebrow: p.type === 'wedding' ? 'Wedding Package' : 'Event Package',
        priceLabel: formatPrice(Number(p.price), p.priceMode, p.customPriceText),
        capacity: `${p.minPax}–${p.maxPax} pax`,
        imageUrl: toAbsolute(p.imageUrl, defaultHero),
      };
    }
    if (type === 'pass' || type === 'day-pass') {
      const d = await prisma.dayPass.findUnique({ where: { id } });
      if (!d) return fallback;
      return {
        name: d.name,
        eyebrow: 'Day Pass · Open Daily',
        priceLabel: `${formatPrice(Number(d.price), d.priceMode, d.customPriceText)}${d.priceMode === 'NUMERIC' ? d.priceSuffix : ''}`,
        capacity: 'Walk-ins welcome',
        imageUrl: toAbsolute(d.imageUrl, defaultHero),
      };
    }
  } catch {
    return fallback;
  }

  // type=site (or unrecognized) — return branded resort card.
  void logo;
  return fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  const card = await loadCard(type, id);
  const settings = await getSiteSettings();
  const logo = toAbsolute(settings.logoUrl, '/uploads/Almeja_Logo_Large_PNG.png');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: COLOR_INK,
          color: COLOR_SAND,
          fontFamily: 'sans-serif',
        }}
      >
        {/* LEFT — photo */}
        <div
          style={{
            width: 660,
            height: '100%',
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt=""
            width={660}
            height={HEIGHT}
            style={{ width: 660, height: HEIGHT, objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(26,37,48,0) 60%, rgba(26,37,48,0.9) 100%)',
              display: 'flex',
            }}
          />
        </div>

        {/* RIGHT — text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '64px 56px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt=""
              width={56}
              height={56}
              style={{ width: 56, height: 56, objectFit: 'contain' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: 0.5, color: COLOR_SAND }}>
                Almeja Azul
              </span>
              <span style={{ fontSize: 16, color: COLOR_BRAND, letterSpacing: 1, textTransform: 'uppercase' }}>
                Samal Island · PH
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span
              style={{
                fontSize: 18,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: COLOR_BRAND,
                fontWeight: 600,
              }}
            >
              {card.eyebrow}
            </span>
            <span
              style={{
                fontSize: 56,
                lineHeight: 1.1,
                fontWeight: 600,
                color: COLOR_SAND,
              }}
            >
              {card.name}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 32, color: COLOR_BRAND, fontWeight: 600 }}>
              {card.priceLabel}
            </span>
            {card.capacity ? (
              <span style={{ fontSize: 22, color: COLOR_SAND, opacity: 0.85 }}>
                {card.capacity}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    },
  );
}
