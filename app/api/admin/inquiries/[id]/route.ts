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

const InquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'RESPONDED', 'CONFIRMED', 'CANCELLED']).optional(),
  adminNotes: z.string().max(2000).optional(),
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
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });

  if (!inquiry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(inquiry);
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

  const parsed = InquiryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }

  const existing = await prisma.inquiry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(inquiry);
}
