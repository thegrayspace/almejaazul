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

const CATEGORIES = ['COURT_SPORT', 'TEAM_SPORT', 'GIANT_LEISURE', 'LAWN_GAME', 'BEACH_SPORT', 'WATER_SPORT', 'LEISURE_NATURE'] as const;

const ActivityCreateSchema = z.object({
  category: z.enum(CATEGORIES),
  name: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().default(''),
  description: z.string().max(2000).optional().default(''),
  price: z.number().min(0).optional().default(0),
  priceMode: z.enum(['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM']).optional().default('NUMERIC'),
  customPriceText: z.string().max(200).optional().default(''),
  availability: z.string().max(200).optional().default(''),
  featuresJson: z.array(z.string()).optional().default([]),
  imageUrl: z.string().max(1000).optional().default(''),
  icon: z.string().max(100).optional().default(''),
  layoutSize: z.string().max(50).optional().default('default'),
  isPlaceholder: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const activities = await prisma.activity.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(activities.map(a => ({ ...a, price: a.price.toNumber() })));
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const parsed = ActivityCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed: " + Object.keys(parsed.error.flatten().fieldErrors).join(', ') || 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  const activity = await prisma.activity.create({ data: parsed.data });
  return NextResponse.json({ ...activity, price: activity.price.toNumber() }, { status: 201 });
}

