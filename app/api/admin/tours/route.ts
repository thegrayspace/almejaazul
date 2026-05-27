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

const TourCreateSchema = z.object({
  tag: z.string().max(200).optional().default(''),
  name: z.string().min(1).max(200),
  shortDescription: z.string().max(500).optional().default(''),
  detail: z.string().max(5000).optional().default(''),
  price: z.number().min(0).optional().default(0),
  priceMode: z.enum(['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM']).optional().default('INQUIRE'),
  customPriceText: z.string().max(200).optional().default(''),
  duration: z.string().max(100).optional().default(''),
  includesJson: z.array(z.string()).optional().default([]),
  imageUrl: z.string().max(1000).optional().default(''),
  modalImageUrl: z.string().max(1000).optional().default(''),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const tours = await prisma.tour.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(tours.map(t => ({ ...t, price: t.price.toNumber() })));
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const parsed = TourCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed: " + Object.keys(parsed.error.flatten().fieldErrors).join(', ') || 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  const tour = await prisma.tour.create({ data: parsed.data });
  return NextResponse.json({ ...tour, price: tour.price.toNumber() }, { status: 201 });
}

