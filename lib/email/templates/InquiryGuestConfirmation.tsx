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

export interface InquiryGuestConfirmationProps {
  guestName: string;
  inquiryType: string;
  arrivalDate?: string | null;
  departureDate?: string | null;
  guestCount?: number | null;
  message?: string | null;
  resortName: string;
  resortPhone: string;
  resortAddress: string;
  messengerUrl: string;
}

const NAVY = '#1a2530';
const TEAL = '#4BBFE0';
const SAND = '#f0ece3';
const OYSTER = '#faf8f4';
const MUTED = '#5b6973';

const bodyStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: OYSTER,
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: NAVY,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '0',
  backgroundColor: '#ffffff',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: NAVY,
  padding: '32px 32px 28px',
  textAlign: 'center' as const,
};

const wordmarkStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '28px',
  fontWeight: 400,
  letterSpacing: '0.04em',
  color: '#ffffff',
};

const eyebrowStyle: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: TEAL,
};

const contentStyle: React.CSSProperties = {
  padding: '36px 32px 28px',
};

const headingStyle: React.CSSProperties = {
  margin: '0 0 18px',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '26px',
  fontWeight: 400,
  lineHeight: 1.25,
  color: NAVY,
};

const paragraphStyle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: '15px',
  lineHeight: 1.65,
  color: NAVY,
  fontWeight: 300,
};

const summaryBox: React.CSSProperties = {
  margin: '24px 0',
  padding: '20px 22px',
  backgroundColor: SAND,
  borderLeft: `3px solid ${TEAL}`,
};

const summaryLabel: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: MUTED,
};

const summaryValue: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: '15px',
  lineHeight: 1.5,
  color: NAVY,
};

const summaryValueLast: React.CSSProperties = {
  ...summaryValue,
  marginBottom: 0,
};

const footerStyle: React.CSSProperties = {
  backgroundColor: NAVY,
  padding: '28px 32px',
  color: '#ffffff',
};

const footerHeading: React.CSSProperties = {
  margin: '0 0 12px',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '18px',
  fontWeight: 400,
  color: '#ffffff',
};

const footerText: React.CSSProperties = {
  margin: '0 0 6px',
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.75)',
  fontWeight: 300,
};

const linkStyle: React.CSSProperties = {
  color: TEAL,
  textDecoration: 'none',
  fontWeight: 500,
};

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function InquiryGuestConfirmation({
  guestName,
  inquiryType,
  arrivalDate,
  departureDate,
  guestCount,
  message,
  resortName,
  resortPhone,
  resortAddress,
  messengerUrl,
}: InquiryGuestConfirmationProps) {
  const arrival = formatDate(arrivalDate);
  const departure = formatDate(departureDate);
  const firstName = guestName.trim().split(/\s+/)[0] || guestName;

  return (
    <Html>
      <Head />
      <Preview>We received your inquiry — {resortName}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading as="h1" style={wordmarkStyle}>
              {resortName}
            </Heading>
            <Text style={eyebrowStyle}>LYR Beach Resort · Samal Island</Text>
          </Section>

          <Section style={contentStyle}>
            <Heading as="h2" style={headingStyle}>
              Salamat, {firstName}.
            </Heading>
            <Text style={paragraphStyle}>
              We received your inquiry and someone from our team will write back within{' '}
              <strong>four business hours</strong>. If you sent this in the evening or on a
              Sunday, expect a reply by the next morning.
            </Text>
            <Text style={paragraphStyle}>Here is what we have on file:</Text>

            <Section style={summaryBox}>
              <Text style={summaryLabel}>Inquiry</Text>
              <Text style={summaryValue}>{inquiryType}</Text>

              {arrival && (
                <>
                  <Text style={summaryLabel}>Arrival</Text>
                  <Text style={summaryValue}>{arrival}</Text>
                </>
              )}

              {departure && (
                <>
                  <Text style={summaryLabel}>Departure</Text>
                  <Text style={summaryValue}>{departure}</Text>
                </>
              )}

              {guestCount != null && (
                <>
                  <Text style={summaryLabel}>Guests</Text>
                  <Text style={summaryValue}>{guestCount}</Text>
                </>
              )}

              {message && (
                <>
                  <Text style={summaryLabel}>Your message</Text>
                  <Text style={summaryValueLast}>{message}</Text>
                </>
              )}
            </Section>

            <Text style={paragraphStyle}>
              If anything is urgent, the fastest path is{' '}
              <Link href={messengerUrl} style={linkStyle}>
                Facebook Messenger
              </Link>{' '}
              or a call to {resortPhone}.
            </Text>

            <Hr style={{ borderColor: SAND, margin: '28px 0 8px' }} />
            <Text style={{ ...paragraphStyle, marginBottom: 0 }}>Warmly,<br />The {resortName} team</Text>
          </Section>

          <Section style={footerStyle}>
            <Heading as="h3" style={footerHeading}>
              {resortName}
            </Heading>
            <Text style={footerText}>{resortAddress}</Text>
            <Text style={footerText}>{resortPhone}</Text>
            <Text style={footerText}>
              <Link href={messengerUrl} style={{ ...linkStyle, color: TEAL }}>
                Message us on Facebook
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InquiryGuestConfirmation;
