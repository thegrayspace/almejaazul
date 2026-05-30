const SEMAPHORE_MESSAGES_URL = 'https://api.semaphore.co/api/v4/messages';
const SMS_MAX_LENGTH = 140;

function truncateSmsMessage(message: string) {
  if (message.length <= SMS_MAX_LENGTH) return message;
  return message.slice(0, SMS_MAX_LENGTH);
}

export async function sendSmsAlert(phone: string | undefined, message: string): Promise<void> {
  const apiKey = process.env.SEMAPHORE_API_KEY;
  if (!apiKey || !phone) return;

  const body = new URLSearchParams({
    apikey: apiKey,
    number: phone,
    message: truncateSmsMessage(message),
  });

  const response = await fetch(SEMAPHORE_MESSAGES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Semaphore SMS alert failed with ${response.status}`);
  }
}
