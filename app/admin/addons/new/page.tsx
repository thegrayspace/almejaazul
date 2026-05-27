import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import AddOnForm from '@/components/admin/AddOnForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'New Add-On' };

export default async function NewAddOnPage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Add-On" backHref="/admin/addons" backLabel="Add-Ons">
      <AddOnForm />
    </AdminShell>
  );
}
