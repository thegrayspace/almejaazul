import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import FAQForm from '@/components/admin/FAQForm';

export const metadata = { title: 'Edit FAQ' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFAQPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;

  const faq = await prisma.fAQ.findUnique({ where: { id } });

  if (!faq) {
    return (
      <AdminShell title="FAQ Not Found" backHref="/admin/faqs" backLabel="FAQs">
        <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
          <p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>FAQ not found.</p>
        </div>
      </AdminShell>
    );
  }

  const faqData = {
    id: faq.id,
    pageSlug: faq.pageSlug,
    question: faq.question,
    answer: faq.answer,
    isPublished: faq.isPublished,
    sortOrder: faq.sortOrder,
  };

  return (
    <AdminShell title="Edit FAQ" backHref="/admin/faqs" backLabel="FAQs">
      <FAQForm faq={faqData} />
    </AdminShell>
  );
}
