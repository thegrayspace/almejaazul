import { NextResponse } from 'next/server';

// Admin auth is enforced by requireAdminSession() in every admin page
// (Node.js runtime). The Edge Runtime middleware was duplicating that
// check and triggering a redirect loop on Vercel, so it's been removed.
//
// Keeping the file as a no-op so any future middleware needs have a
// landing spot. The matcher is set to a path that never exists, which
// disables the middleware entirely without removing the file.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/__noop__'],
};
