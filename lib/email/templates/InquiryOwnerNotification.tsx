import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export interface InquiryOwnerNotificationProps {
  inquiryId: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  requestedDate?: string | null;
  departureDate?: string | null;
  guestCount?: number | null;
  message?: string | null;
  sourcePage?: string | null;
  createdAt: string;
  adminUrl: string;
}

const NAVY = '#1a2530';
const TEAL = '#4BBFE0';
const MUTED = '#5b6973';

const bodyStyle: React.CSSProperties = {
  margin: 0,
  padding: '24px 0',
  backgroundColor: '#f5f5f5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Plus Jakarta Sans', sans-serif",
  color: NAVY,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '28px 32px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e5e5',
};

const headingStyle: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: '18px',
  fontWeight: 600,
  color: NAVY,
};

const subStyle: React.CSSProperties = {
  margin: '0 0 20px',
  fontSize: '12px',
  color: MUTED,
};

const rowStyle: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: '14px',
  lineHeight: 1.5,
  color: NAVY,
};

const labelStyle: React.CSSProperties = {
  display: 'inline-block',
  minWidth: '110px',
  fontWeight: 600,
  color: MUTED,
};

const messageBox: React.CSSProperties = {
  margin: '16px 0',
  padding: '12px 14px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #e5e5e5',
  fontSize: '14px',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap' as const,
  color: NAVY,
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '16px',
  padding: '10px 20px',
  backgroundColor: NAVY,
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  borderRadius: '4px',
};

function formatDateTime(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function InquiryOwnerNotification({
  inquiryId,
  name,
  email,
  phone,
  inquiryType,
  requestedDate,
  departureDate,
  guestCount,
  message,
  sourcePage,
  createdAt,
  adminUrl,
}: InquiryOwnerNotificationProps) {
  const arrival = formatDate(requestedDate);
  const departure = formatDate(departureDate);
  const received = formatDateTime(createdAt);

  return (
    <Html>
      <Head />
      <Preview>
        New inquiry from {name} — {inquiryType}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading as="h1" style={headingStyle}>
            New inquiry — {inquiryType}
          </Heading>
          <Text style={subStyle}>
            Received {received ?? 'just now'} · ID {inquiryId}
          </Text>

          <Text style={rowStyle}>
            <span style={labelStyle}>Name</span> {name}
          </Text>
          <Text style={rowStyle}>
            <span style={labelStyle}>Email</span>{' '}
            <Link href={`mailto:${email}`} style={{ color: TEAL, textDecoration: 'none' }}>
              {email}
            </Link>
          </Text>
          {phone && (
            <Text style={rowStyle}>
              <span style={labelStyle}>Phone</span>{' '}
              <Link href={`tel:${phone}`} style={{ color: TEAL, textDecoration: 'none' }}>
                {phone}
              </Link>
            </Text>
          )}
          <Text style={rowStyle}>
            <span style={labelStyle}>Type</span> {inquiryType}
          </Text>
          {arrival && (
            <Text style={rowStyle}>
              <span style={labelStyle}>Arrival</span> {arrival}
            </Text>
          )}
          {departure && (
            <Text style={rowStyle}>
              <span style={labelStyle}>Departure</span> {departure}
            </Text>
          )}
          {guestCount != null && (
            <Text style={rowStyle}>
              <span style={labelStyle}>Guests</span> {guestCount}
            </Text>
          )}
          {sourcePage && (
            <Text style={rowStyle}>
              <span style={labelStyle}>Source page</span> {sourcePage}
            </Text>
          )}

          {message && (
            <>
              <Text style={{ ...rowStyle, marginTop: '14px', marginBottom: '6px' }}>
                <span style={labelStyle}>Message</span>
              </Text>
              <Section style={messageBox}>{message}</Section>
            </>
          )}

          <Hr style={{ borderColor: '#e5e5e5', margin: '20px 0 4px' }} />

          <Link href={adminUrl} style={buttonStyle}>
            Open in admin
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

export default InquiryOwnerNotification;
