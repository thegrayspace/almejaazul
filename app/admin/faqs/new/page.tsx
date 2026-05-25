import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import FAQForm from '@/components/admin/FAQForm';

export const metadata = { title: 'New FAQ' };

export default async function NewFAQPage() {
  await requireAdminSession();

  return (
    <AdminShell title="New FAQ" backHref="/admin/faqs" backLabel="FAQs">
      <FAQForm />
    </AdminShell>
  );
}
