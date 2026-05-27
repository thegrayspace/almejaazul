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

const PackageUpdateSchema = z.object({
  type: z.string().max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  includesText: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  priceMode: z.enum(['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM']).optional(),
  customPriceText: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().max(1000).optional(),
  featuresJson: z.array(z.string()).optional(),
  minPax: z.number().int().min(1).optional(),
  maxPax: z.number().int().min(1).optional(),
  durationsJson: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

interface RouteContext { params: Promise<{ id: string }>; }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const pkg = await prisma.eventPackage.findUnique({ where: { id } });
  if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...pkg, price: pkg.price.toNumber() });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const parsed = PackageUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed: " + Object.keys(parsed.error.flatten().fieldErrors).join(', ') || 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  const existing = await prisma.eventPackage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const pkg = await prisma.eventPackage.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ...pkg, price: pkg.price.toNumber() });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.eventPackage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.eventPackage.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
