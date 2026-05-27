import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SESSION_OPTIONS, SessionData } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadMedia } from '@/lib/media';

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
  if (!session.isLoggedIn) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: 'Expected multipart form data' }, { status: 400 });

  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const altText = (formData.get('altText') as string) ?? '';
  const category = (formData.get('category') as string) ?? 'general';

  let result;
  try {
    result = await uploadMedia(file);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      fileName: result.fileName,
      url: result.url,
      altText,
      category,
      source: 'upload',
    },
  });

  return NextResponse.json(asset, { status: 201 });
}
