import { NextRequest, NextResponse } from 'next/server';
import { SESSION_OPTIONS } from '@/lib/session-config';

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', req.url));
  response.cookies.set(SESSION_OPTIONS.cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
