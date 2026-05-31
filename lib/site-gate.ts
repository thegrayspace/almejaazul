import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

interface GateSession {
  unlocked: boolean;
}

const GATE_COOKIE_NAME = 'almeja_site_gate';

function getGateOptions(): SessionOptions {
  const password = process.env.SITE_GATE_SECRET as string;
  return {
    password,
    cookieName: GATE_COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  };
}

export function isGateEnabled(): boolean {
  return Boolean(process.env.SITE_PASSWORD && process.env.SITE_GATE_SECRET);
}

export async function getGateSession(): Promise<IronSession<GateSession>> {
  const cookieStore = await cookies();
  return getIronSession<GateSession>(cookieStore, getGateOptions());
}

export async function isSiteUnlocked(): Promise<boolean> {
  if (!isGateEnabled()) return true;
  const session = await getGateSession();
  return session.unlocked === true;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) return false;
  if (typeof input !== 'string' || input.length === 0) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ input.charCodeAt(i);
  }
  return mismatch === 0;
}
