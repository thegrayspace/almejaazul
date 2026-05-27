import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SESSION_OPTIONS } from '@/lib/auth';
import { sealData } from 'iron-session';
import type { SessionData } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

// Simple rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60_000;

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_ATTEMPTS) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

  if (checkLoginRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    const { prisma } = await import('@/lib/db');
    const bcrypt = await import('bcryptjs');

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Seal the session data using iron-session's sealData directly.
    // Then set the cookie explicitly on the NextResponse — this is the most
    // reliable approach in Next.js 15 App Router Route Handlers, bypassing
    // any async-context cookie plumbing.
    const sessionData: SessionData = { isLoggedIn: true, userId: user.id, email: user.email };
    const seal = await sealData(sessionData, { password: SESSION_OPTIONS.password as string });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_OPTIONS.cookieName, seal, {
      httpOnly: SESSION_OPTIONS.cookieOptions?.httpOnly ?? true,
      secure: SESSION_OPTIONS.cookieOptions?.secure ?? (process.env.NODE_ENV === 'production'),
      sameSite: (SESSION_OPTIONS.cookieOptions?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
      maxAge: SESSION_OPTIONS.cookieOptions?.maxAge ?? 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[admin/login] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
