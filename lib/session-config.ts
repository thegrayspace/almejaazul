/**
 * Session configuration kept in its own file so it can be imported by
 * middleware (Edge Runtime) without pulling in next/headers, next/navigation,
 * or any other Node.js-only module from lib/auth.ts.
 */
import type { SessionOptions } from 'iron-session';

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
