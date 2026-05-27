import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { SESSION_OPTIONS } from '@/lib/session-config';

export async function GET(req: NextRequest) {
  // Expire the session cookie immediately
  const cookieStr = serialize(SESSION_OPTIONS.cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return new NextResponse(null, {
    status: 302,
    headers: {
      location: new URL('/admin/login', req.url).toString(),
      'set-cookie': cookieStr,
    },
  });
}
