import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'FAQs' };

export default async function AdminFAQsPage() {
  await requireAdminSession();

  const faqs = await prisma.fAQ.findMany({
    orderBy: [{ pageSlug: 'asc' }, { sortOrder: 'asc' }],
  });

  // Group by pageSlug
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    if (!acc[faq.pageSlug]) acc[faq.pageSlug] = [];
    acc[faq.pageSlug].push(faq);
    return acc;
  }, {});

  return (
    <AdminShell title="FAQs">
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: 'rgba(26,37,48,0.55)', margin: 0 }}>
          {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} page{Object.keys(grouped).length !== 1 ? 's' : ''}
        </p>
        <Link
          href="/admin/faqs/new"
          style={{
            padding: '10px 24px',
            background: '#4BBFE0',
            color: '#1a2530',
            textDecoration: 'none',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          + Add FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
          <p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>No FAQs yet. Add your first FAQ to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(grouped).map(([slug, slugFaqs]) => (
            <div key={slug}>
              {/* Page group header */}
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#4BBFE0',
                marginBottom: 10,
                paddingLeft: 4,
              }}>
                Page: {slug}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {slugFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    style={{
                      background: '#fff',
                      borderRadius: 8,
                      padding: '18px 24px',
                      boxShadow: '0 2px 12px rgba(26,37,48,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    {/* Sort order badge */}
                    <div style={{
                      width: 36,
                      height: 36,
                      background: '#f0ece3',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'rgba(26,37,48,0.4)',
                      flexShrink: 0,
                    }}>
                      {faq.sortOrder}
                    </div>

                    {/* FAQ content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2530', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {faq.question}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(26,37,48,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {faq.answer.length > 100 ? faq.answer.slice(0, 100) + '…' : faq.answer}
                      </div>
                    </div>

                    {/* Published badge */}
                    <div style={{ flexShrink: 0 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: faq.isPublished ? '#2a9d5c' : 'rgba(26,37,48,0.4)',
                        background: faq.isPublished ? 'rgba(42,157,92,0.1)' : 'rgba(26,37,48,0.07)',
                        padding: '4px 10px',
                        borderRadius: 100,
                      }}>
                        {faq.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Edit link */}
                    <Link
                      href={`/admin/faqs/${faq.id}`}
                      style={{
                        padding: '8px 20px',
                        background: 'transparent',
                        color: '#1a2530',
                        textDecoration: 'none',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        border: '1.5px solid rgba(26,37,48,0.2)',
                        flexShrink: 0,
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
