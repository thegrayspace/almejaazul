import type { Inquiry } from '@prisma/client';
import {
  getFromAddress,
  getOwnerNotificationAddress,
  getResendClient,
  isEmailEnabled,
} from './client';
import { getSiteSettings } from '@/lib/site-data';
import { InquiryGuestConfirmation } from './templates/InquiryGuestConfirmation';
import { InquiryOwnerNotification } from './templates/InquiryOwnerNotification';

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function buildAdminUrl(inquiryId: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
  return `${base}/admin/inquiries/${inquiryId}`;
}

export async function sendInquiryEmails(inquiry: Inquiry): Promise<void> {
  if (!isEmailEnabled()) {
    console.warn('[email] RESEND_API_KEY not set; skipping inquiry emails');
    return;
  }

  const resend = getResendClient();
  if (!resend) return;

  const from = getFromAddress();
  const ownerTo = getOwnerNotificationAddress();
  const settings = await getSiteSettings();

  const guestProps = {
    guestName: inquiry.name,
    inquiryType: inquiry.inquiryType,
    arrivalDate: toIso(inquiry.requestedDate),
    departureDate: toIso(inquiry.departurDate),
    guestCount: inquiry.guestCount,
    message: inquiry.message || null,
    resortName: settings.resortName,
    resortPhone: settings.phone,
    resortAddress: settings.address,
    messengerUrl: settings.messengerUrl,
  };

  const ownerProps = {
    inquiryId: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    inquiryType: inquiry.inquiryType,
    requestedDate: toIso(inquiry.requestedDate),
    departureDate: toIso(inquiry.departurDate),
    guestCount: inquiry.guestCount,
    message: inquiry.message || null,
    sourcePage: inquiry.sourcePage || null,
    createdAt: toIso(inquiry.createdAt) ?? new Date().toISOString(),
    adminUrl: buildAdminUrl(inquiry.id),
  };

  const tasks: Promise<unknown>[] = [];

  tasks.push(
    resend.emails
      .send({
        from,
        to: inquiry.email,
        subject: `We received your inquiry — ${settings.resortName}`,
        react: InquiryGuestConfirmation(guestProps),
      })
      .then((res) => {
        if (res.error) {
          console.error('[email] guest confirmation failed:', res.error);
        }
      })
      .catch((err) => {
        console.error('[email] guest confirmation threw:', err);
      }),
  );

  if (ownerTo) {
    tasks.push(
      resend.emails
        .send({
          from,
          to: ownerTo,
          subject: `[NEW INQUIRY] ${inquiry.inquiryType} — ${inquiry.name}`,
          react: InquiryOwnerNotification(ownerProps),
          replyTo: inquiry.email,
        })
        .then((res) => {
          if (res.error) {
            console.error('[email] owner notification failed:', res.error);
          }
        })
        .catch((err) => {
          console.error('[email] owner notification threw:', err);
        }),
    );
  } else {
    console.warn('[email] EMAIL_OWNER_NOTIFICATION not set; skipping owner notification');
  }

  await Promise.allSettled(tasks);
}
