import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import type { SessionData } from '@/lib/session-config';

const COOKIE_NAME = 'almeja_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value ?? '';
    // Read at request time, not module init — avoids Edge Runtime env-var
    // availability issues where module-level process.env can be undefined.
    const password = process.env.AUTH_SECRET;

    let isLoggedIn = false;
    if (cookieValue && password) {
      try {
        const session = await unsealData<SessionData>(cookieValue, { password });
        isLoggedIn = session.isLoggedIn === true;
      } catch {
        // Invalid or expired seal — treat as logged out
        isLoggedIn = false;
      }
    }

    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
