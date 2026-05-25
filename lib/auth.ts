import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export interface SessionData {
  isLoggedIn: boolean;
  userId?: string;
  email?: string;
}

export const SESSION_OPTIONS: SessionOptions = {
  password: process.env.AUTH_SECRET as string,
  cookieName: 'almeja_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdminSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.isLoggedIn) {
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
