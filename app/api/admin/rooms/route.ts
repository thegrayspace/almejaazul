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

const RoomCreateSchema = z.object({
  name: z.string().min(1).max(200),
  tag: z.string().max(200).optional().default(''),
  subtitle: z.string().max(300).optional().default(''),
  capacity: z.string().max(100).optional().default(''),
  basePrice: z.number().min(0).optional().default(0),
  priceSuffix: z.string().max(100).optional().default('/night'),
  priceMode: z.enum(['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM']).optional().default('NUMERIC'),
  customPriceText: z.string().max(200).optional().default(''),
  shortDescription: z.string().max(500).optional().default(''),
  longDescription: z.string().max(5000).optional().default(''),
  amenitiesJson: z.array(z.string()).optional().default([]),
  note: z.string().max(500).optional().default(''),
  cardImageUrl: z.string().max(1000),
  modalImageUrl: z.string().max(1000).optional().default(''),
  layoutSize: z.enum(['default', 'feature', 'wide']).optional().default('default'),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rooms = await prisma.room.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const serialized = rooms.map((room) => ({
    ...room,
    basePrice: room.basePrice.toNumber(),
    amenitiesJson: room.amenitiesJson as string[],
  }));

  return NextResponse.json(serialized);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = RoomCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed: " + Object.keys(parsed.error.flatten().fieldErrors).join(', ') || 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  const room = await prisma.room.create({
    data: {
      name: data.name,
      tag: data.tag,
      subtitle: data.subtitle,
      capacity: data.capacity,
      basePrice: data.basePrice,
      priceSuffix: data.priceSuffix,
      priceMode: data.priceMode,
      customPriceText: data.customPriceText,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      amenitiesJson: data.amenitiesJson,
      note: data.note,
      cardImageUrl: data.cardImageUrl,
      modalImageUrl: data.modalImageUrl,
      layoutSize: data.layoutSize,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      sortOrder: data.sortOrder,
    },
  });

  return NextResponse.json({
    ...room,
    basePrice: room.basePrice.toNumber(),
  }, { status: 201 });
}

