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

const RoomUpdateSchema = z.object({
  tag: z.string().min(1).max(200).optional(),
  name: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).optional(),
  capacity: z.string().max(100).optional(),
  basePrice: z.number().min(0).optional(),
  priceSuffix: z.string().max(100).optional(),
  priceMode: z.enum(['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM']).optional(),
  customPriceText: z.string().max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  longDescription: z.string().max(5000).optional(),
  amenitiesJson: z.array(z.string()).optional(),
  note: z.string().max(500).optional(),
  cardImageUrl: z.string().max(1000).optional(),
  modalImageUrl: z.string().max(1000).optional(),
  layoutSize: z.enum(['default', 'feature', 'wide']).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });

  if (!room) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...room,
    basePrice: room.basePrice.toNumber(),
    amenitiesJson: room.amenitiesJson as string[],
  });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = RoomUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }

  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const room = await prisma.room.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    ...room,
    basePrice: room.basePrice.toNumber(),
    amenitiesJson: room.amenitiesJson as string[],
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.room.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
