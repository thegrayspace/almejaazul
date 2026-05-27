import { NextRequest, NextResponse } from 'next/server';
import { SESSION_OPTIONS } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', req.url));
  // Clear the session cookie explicitly on the response
  response.cookies.set(SESSION_OPTIONS.cookieName, '', {
    httpOnly: SESSION_OPTIONS.cookieOptions?.httpOnly ?? true,
    secure: SESSION_OPTIONS.cookieOptions?.secure ?? (process.env.NODE_ENV === 'production'),
    sameSite: (SESSION_OPTIONS.cookieOptions?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
