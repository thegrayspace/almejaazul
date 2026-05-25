import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SESSION_OPTIONS, type SessionData } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  const session = await getIronSession<SessionData>(req, res, SESSION_OPTIONS);
  session.destroy();
  return res;
}
