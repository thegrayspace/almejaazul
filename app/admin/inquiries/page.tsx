import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import InquiryStatusSelect from '@/components/admin/InquiryStatusSelect';

export const metadata = { title: 'Inquiries' };

function formatDate(date: Date | null | undefined) {
  if (!date) return '—';
  return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  NEW: { bg: 'rgba(75,191,224,0.12)', color: '#1a7a9a' },
  RESPONDED: { bg: 'rgba(245,168,32,0.15)', color: '#8a6200' },
  CONFIRMED: { bg: 'rgba(42,157,92,0.12)', color: '#1a7a42' },
  CANCELLED: { bg: 'rgba(26,37,48,0.08)', color: 'rgba(26,37,48,0.4)' },
};

export default async function AdminInquiriesPage() {
  await requireAdminSession();

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const counts = {
    NEW: inquiries.filter((i) => i.status === 'NEW').length,
    RESPONDED: inquiries.filter((i) => i.status === 'RESPONDED').length,
    CONFIRMED: inquiries.filter((i) => i.status === 'CONFIRMED').length,
    CANCELLED: inquiries.filter((i) => i.status === 'CANCELLED').length,
  };

  return (
    <AdminShell title="Inquiries">
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([status, count]) => {
          const colors = STATUS_COLORS[status];
          return (
            <div key={status} style={{
              background: colors.bg,
              borderRadius: 8,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: colors.color }}>{count}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.color }}>{status}</span>
            </div>
          );
        })}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(26,37,48,0.5)', margin: 0 }}>
            {inquiries.length} total submission{inquiries.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
          <p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>No inquiries yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: '20px 24px',
                boxShadow: '0 2px 12px rgba(26,37,48,0.06)',
              }}
            >
              {/* Top row: name, type, status, date */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2530' }}>{inquiry.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(26,37,48,0.5)', marginTop: 2 }}>
                    <a href={`mailto:${inquiry.email}`} style={{ color: '#4BBFE0', textDecoration: 'none' }}>{inquiry.email}</a>
                    {inquiry.phone && <span> · {inquiry.phone}</span>}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,37,48,0.5)',
                    background: '#f0ece3',
                    padding: '4px 10px',
                    borderRadius: 100,
                  }}>
                    {inquiry.inquiryType}
                  </span>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <InquiryStatusSelect
                    inquiryId={inquiry.id}
                    initialStatus={inquiry.status as 'NEW' | 'RESPONDED' | 'CONFIRMED' | 'CANCELLED'}
                  />
                </div>

                <div style={{ flexShrink: 0, fontSize: 11, color: 'rgba(26,37,48,0.4)', whiteSpace: 'nowrap', paddingTop: 2 }}>
                  {formatDate(inquiry.createdAt)}
                </div>
              </div>

              {/* Details row */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 12, color: 'rgba(26,37,48,0.55)', marginBottom: inquiry.message ? 10 : 0 }}>
                {inquiry.guestCount != null && (
                  <span><strong style={{ color: 'rgba(26,37,48,0.4)', fontWeight: 600 }}>Guests:</strong> {inquiry.guestCount}</span>
                )}
                {inquiry.requestedDate && (
                  <span><strong style={{ color: 'rgba(26,37,48,0.4)', fontWeight: 600 }}>Check-in:</strong> {formatDate(inquiry.requestedDate)}</span>
                )}
                {inquiry.departurDate && (
                  <span><strong style={{ color: 'rgba(26,37,48,0.4)', fontWeight: 600 }}>Check-out:</strong> {formatDate(inquiry.departurDate)}</span>
                )}
                {inquiry.sourcePage && (
                  <span><strong style={{ color: 'rgba(26,37,48,0.4)', fontWeight: 600 }}>Source:</strong> {inquiry.sourcePage}</span>
                )}
              </div>

              {/* Message */}
              {inquiry.message && (
                <div style={{
                  fontSize: 13,
                  color: 'rgba(26,37,48,0.65)',
                  lineHeight: 1.5,
                  padding: '10px 14px',
                  background: '#f0ece3',
                  borderRadius: 6,
                  marginBottom: inquiry.adminNotes ? 10 : 0,
                }}>
                  {inquiry.message.length > 200
                    ? inquiry.message.slice(0, 200) + '…'
                    : inquiry.message}
                </div>
              )}

              {/* Admin notes */}
              {inquiry.adminNotes && (
                <div style={{
                  fontSize: 12,
                  color: 'rgba(26,37,48,0.55)',
                  fontStyle: 'italic',
                  marginTop: 6,
                }}>
                  <strong style={{ fontStyle: 'normal', fontWeight: 600, color: 'rgba(26,37,48,0.4)' }}>Notes:</strong> {inquiry.adminNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
