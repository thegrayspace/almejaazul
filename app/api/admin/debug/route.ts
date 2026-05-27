import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SESSION_OPTIONS, type SessionData } from '@/lib/session-config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_OPTIONS.cookieName);

  let session: SessionData | null = null;
  let unsealError: string | null = null;
  try {
    const s = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
    session = { isLoggedIn: s.isLoggedIn, userId: s.userId, email: s.email };
  } catch (err) {
    unsealError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    cookieHeader: cookieHeader.slice(0, 200),
    allCookieNames: cookieStore.getAll().map(c => c.name),
    sessionCookiePresent: !!sessionCookie,
    sessionCookieLength: sessionCookie?.value.length ?? 0,
    session,
    unsealError,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
  });
}
