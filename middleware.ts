import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import { SESSION_OPTIONS, type SessionData } from '@/lib/session-config';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieValue = req.cookies.get(SESSION_OPTIONS.cookieName)?.value ?? '';

    let isLoggedIn = false;
    if (cookieValue) {
      try {
        const session = await unsealData<SessionData>(cookieValue, {
          password: SESSION_OPTIONS.password as string,
        });
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
