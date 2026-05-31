import { after, NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { notifyNewInquiry } from '@/lib/alerts/notify-new-inquiry';
import { sendCapiEvent } from '@/lib/analytics';
import { sendInquiryEmails } from '@/lib/email/send-inquiry-emails';

const InquirySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  inquiryType: z.string().max(100).optional(),
  guests: z.number().int().min(1).max(10000).optional(),
  arrivalDate: z.string().max(20).optional(),
  departureDate: z.string().max(20).optional(),
  sourcePage: z.string().max(300).optional(),
  message: z.string().max(2000).optional(),
  eventId: z.string().min(1).max(100).optional(),
});

// Simple in-memory rate limiter (IP → [timestamps])
const rateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) return true;
  hits.push(now);
  rateLimits.set(ip, hits);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
  }

  const data = parsed.data;

  try {
    const { prisma } = await import('@/lib/db');
    const newInquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? '',
        inquiryType: data.inquiryType ?? 'General Inquiry',
        guestCount: data.guests ?? null,
        requestedDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
        departurDate: data.departureDate ? new Date(data.departureDate) : null,
        sourcePage: data.sourcePage ?? '',
        message: data.message ?? '',
      },
    });

    // Fire alerts (Google Chat + SMS) and transactional emails after the
    // response is sent. Neither must ever block or fail the request.
    try {
      after(async () => {
        try {
          await notifyNewInquiry(newInquiry);
        } catch (err) {
          console.error('[inquiry] alert dispatch failed:', err);
        }
        try {
          await sendInquiryEmails(newInquiry);
        } catch (err) {
          console.error('[inquiry] sendInquiryEmails threw:', err);
        }
      });
    } catch (err) {
      console.error('[inquiry] after() scheduling failed:', err);
    }
  } catch (err) {
    // Log but don't fail the request — user experience matters more than DB write
    console.error('[inquiry] DB write failed:', err);
  }

  try {
    const eventId = data.eventId ?? randomUUID();
    await sendCapiEvent(
      'Lead',
      {
        email: data.email,
        phone: data.phone,
        ip: ip !== 'unknown' ? ip.split(',')[0].trim() : undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
      },
      {
        event_id: eventId,
        event_source_url: req.headers.get('referer') ?? undefined,
        source: data.sourcePage || data.inquiryType || 'inquiry',
      },
    );
  } catch (err) {
    console.error('[inquiry] Meta CAPI send failed:', err);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
