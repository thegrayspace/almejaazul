import { NextRequest, NextResponse } from 'next/server';
import { SESSION_OPTIONS } from '@/lib/session-config';

// POST-only by design. Logout mutates state (clears the session cookie), so it
// must never be reachable via GET — a GET handler can be triggered by a Next.js
// <Link> prefetch, a browser preconnect, or a crawler, silently logging the user
// out. The Sign-out UI submits a <form method="post">. See CLAUDE.md "Admin Auth".
export async function POST(req: NextRequest) {
  // 303 See Other so the browser follows the redirect with GET, not a re-POST.
  const response = NextResponse.redirect(new URL('/admin/login', req.url), 303);
  response.cookies.set(SESSION_OPTIONS.cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
