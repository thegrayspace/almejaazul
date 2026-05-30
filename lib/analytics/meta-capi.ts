import { createHash } from 'crypto';

const CAPI_VERSION = 'v18.0';

type CapiEventName = 'Lead';

export interface CapiUserData {
  email?: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
}

export interface CapiCustomData {
  event_id: string;
  event_source_url?: string;
  source?: string;
  [key: string]: string | number | undefined;
}

interface MetaUserData {
  em?: string[];
  ph?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
}

interface MetaEvent {
  event_name: CapiEventName;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: 'website';
  user_data: MetaUserData;
  custom_data?: Record<string, string | number>;
}

interface MetaPayload {
  data: MetaEvent[];
  test_event_code?: string;
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isCapiEnabled() {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN);
}

export async function sendCapiEvent(
  eventName: CapiEventName,
  userData: CapiUserData,
  customData: CapiCustomData,
): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const { event_id, event_source_url, ...rest } = customData;

  const user_data: MetaUserData = {};
  if (userData.email) {
    user_data.em = [sha256(normalizeEmail(userData.email))];
  }
  if (userData.phone) {
    const digits = normalizePhone(userData.phone);
    if (digits) user_data.ph = [sha256(digits)];
  }
  if (userData.ip) user_data.client_ip_address = userData.ip;
  if (userData.userAgent) user_data.client_user_agent = userData.userAgent;

  const custom_data: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) custom_data[k] = v;
  }

  const event: MetaEvent = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id,
    action_source: 'website',
    user_data,
  };
  if (event_source_url) event.event_source_url = event_source_url;
  if (Object.keys(custom_data).length > 0) event.custom_data = custom_data;

  const payload: MetaPayload = { data: [event] };
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${CAPI_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Meta CAPI ${res.status}: ${body.slice(0, 500)}`);
  }
}
