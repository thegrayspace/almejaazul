import type { Inquiry } from '@prisma/client';
import { sendGoogleChatAlert } from './google-chat';
import { sendSmsAlert } from './sms';

function smsMessageFor(inquiry: Inquiry) {
  const type = inquiry.inquiryType || 'inquiry';
  const name = inquiry.name || 'guest';
  const phone = inquiry.phone || 'no phone';
  return `Almeja Azul: New ${type} from ${name}, ${phone}. Check Google Chat.`;
}

export async function notifyNewInquiry(inquiry: Inquiry): Promise<void> {
  const results = await Promise.allSettled([
    sendGoogleChatAlert(inquiry),
    sendSmsAlert(process.env.SEMAPHORE_ALERT_RECIPIENT, smsMessageFor(inquiry)),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[alerts] New inquiry alert failed:', result.reason);
    }
  }
}
