import { Resend } from 'resend';

let cached: Resend | null = null;

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'Almeja Azul <hello@almejaazul.com>';
}

export function getOwnerNotificationAddress(): string | null {
  return process.env.EMAIL_OWNER_NOTIFICATION || null;
}

export function isEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
