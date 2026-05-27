import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SESSION_OPTIONS, SessionData } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
  if (!session.isLoggedIn) return null;
  return session;
}

const VenueCreateSchema = z.object({
  type: z.string().max(100).optional().default('wedding'),
  name: z.string().min(1).max(200),
  tag: z.string().max(200).optional().default(''),
  capacity: z.string().max(100).optional().default(''),
  subtitle: z.string().max(300).optional().default(''),
  description: z.string().max(5000).optional().default(''),
  imageUrl: z.string().max(1000).optional().default(''),
  modalImageUrl: z.string().max(1000).optional().default(''),
  floorPlanSvgType: z.enum(['MANGROVE_PAVILION', 'VOW_BY_THE_SEA', 'CUSTOM']).optional().default('CUSTOM'),
  amenitiesJson: z.array(z.string()).optional().default([]),
  price: z.number().min(0).optional().default(0),
  priceMode: z.enum(['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM']).optional().default('INQUIRE'),
  customPriceText: z.string().max(200).optional().default(''),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const venues = await prisma.venue.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(venues.map(v => ({ ...v, price: v.price.toNumber() })));
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const parsed = VenueCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed: " + Object.keys(parsed.error.flatten().fieldErrors).join(', ') || 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  const venue = await prisma.venue.create({ data: parsed.data });
  return NextResponse.json({ ...venue, price: venue.price.toNumber() }, { status: 201 });
}

