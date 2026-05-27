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

const SettingsUpdateSchema = z.object({
  resortName: z.string().min(1).max(200).optional(),
  tagline: z.string().max(300).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(50).optional(),
  phoneE164: z.string().max(50).optional(),
  messengerUrl: z.string().max(500).optional(),
  facebookUrl: z.string().max(500).optional(),
  instagramUrl: z.string().max(500).optional(),
  googleMapsUrl: z.string().max(500).optional(),
  logoUrl: z.string().max(1000).optional(),
  messengerLogoUrl: z.string().max(1000).optional(),
  footerText: z.string().max(1000).optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let settings = await prisma.siteSettings.findFirst({ where: { active: true } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = SettingsUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed: " + Object.keys(parsed.error.flatten().fieldErrors).join(', ') || 'Validation failed', details: parsed.error.flatten() }, { status: 422 });

  let settings = await prisma.siteSettings.findFirst({ where: { active: true } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { ...parsed.data } });
  } else {
    settings = await prisma.siteSettings.update({ where: { id: settings.id }, data: parsed.data });
  }
  return NextResponse.json(settings);
}

