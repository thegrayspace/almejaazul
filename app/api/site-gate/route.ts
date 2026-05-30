import { NextResponse } from 'next/server';
import { checkPassword, getGateSession, isGateEnabled } from '@/lib/site-gate';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isGateEnabled()) {
    return NextResponse.redirect(new URL('/', req.url), { status: 303 });
  }

  let password = '';
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => ({}));
    password = typeof body?.password === 'string' ? body.password : '';
  } else {
    const form = await req.formData();
    const raw = form.get('password');
    password = typeof raw === 'string' ? raw : '';
  }

  if (!checkPassword(password)) {
    const res = NextResponse.redirect(new URL('/', req.url), { status: 303 });
    res.cookies.set('almeja_gate_flash', 'invalid', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10,
      path: '/',
    });
    return res;
  }

  const session = await getGateSession();
  session.unlocked = true;
  await session.save();

  const next = new URL(req.url).searchParams.get('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
  return NextResponse.redirect(new URL(safeNext, req.url), { status: 303 });
}
