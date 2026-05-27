import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

// Re-export from session-config so all existing imports keep working.
// session-config.ts has no next/headers dependency and is safe for Edge Runtime.
export { SESSION_OPTIONS, type SessionData } from './session-config';
import { SESSION_OPTIONS, SessionData } from './session-config';

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdminSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    console.log('[requireAdminSession] redirecting to login', {
      hasCookie: !!(await cookies()).get(SESSION_OPTIONS.cookieName),
      authSecretLen: process.env.AUTH_SECRET?.length ?? 0,
      sessionRaw: JSON.stringify(session),
    });
    redirect('/admin/login');
  }
  return session;
}

export async function getSessionFromRequest(
  req: NextRequest,
  res: NextResponse,
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, SESSION_OPTIONS);
}
