import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import { SESSION_OPTIONS, type SessionData } from '@/lib/session-config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cookieValue = req.cookies.get(SESSION_OPTIONS.cookieName)?.value ?? null;
  const password = process.env.AUTH_SECRET;

  const result: Record<string, unknown> = {
    runtime: 'nodejs',
    nodeEnv: process.env.NODE_ENV,
    authSecretPresent: !!password,
    authSecretLength: password?.length ?? 0,
    cookieNameExpected: SESSION_OPTIONS.cookieName,
    cookiePresent: !!cookieValue,
    cookieValueLength: cookieValue?.length ?? 0,
    allCookieNames: req.cookies.getAll().map(c => c.name),
    sessionOptionsPassword: SESSION_OPTIONS.password
      ? `length=${(SESSION_OPTIONS.password as string).length}`
      : 'MISSING',
  };

  if (cookieValue && password) {
    try {
      const session = await unsealData<SessionData>(cookieValue, { password });
      result.unsealSuccess = true;
      result.session = session;
    } catch (err) {
      result.unsealSuccess = false;
      result.unsealError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json(result, { status: 200 });
}
