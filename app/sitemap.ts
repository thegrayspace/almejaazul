import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type Entry = MetadataRoute.Sitemap[number];

const STATIC_PAGES: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] = [
  { path: '/',          priority: 1.0, changeFrequency: 'weekly' },
  { path: '/stay',      priority: 0.9, changeFrequency: 'weekly' },
  { path: '/day-tour',  priority: 0.9, changeFrequency: 'weekly' },
  { path: '/fun',       priority: 0.7, changeFrequency: 'monthly' },
  { path: '/build',     priority: 0.8, changeFrequency: 'weekly' },
  { path: '/see',       priority: 0.7, changeFrequency: 'monthly' },
  { path: '/archive',   priority: 0.3, changeFrequency: 'yearly'  },
];

function url(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function newest(...dates: (Date | null | undefined)[]): Date {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return new Date();
  return valid.reduce((a, b) => (a > b ? a : b));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_PAGES.map(p => ({
    url: url(p.path),
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  try {
    const [rooms, tours, venues, packages, passes] = await Promise.all([
      prisma.room.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.tour.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.venue.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.eventPackage.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.dayPass.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
    ]);

    for (const r of rooms) {
      entries.push({
        url: url(`/stay#room-${r.id}`),
        lastModified: newest(r.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    for (const t of tours) {
      entries.push({
        url: url(`/see#tour-${t.id}`),
        lastModified: newest(t.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const v of venues) {
      entries.push({
        url: url(`/build#venue-${v.id}`),
        lastModified: newest(v.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    for (const p of packages) {
      entries.push({
        url: url(`/build#package-${p.id}`),
        lastModified: newest(p.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const d of passes) {
      entries.push({
        url: url(`/day-tour#pass-${d.id}`),
        lastModified: newest(d.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch {
    // DB unavailable — return static pages only so the sitemap still validates.
  }

  return entries;
}
