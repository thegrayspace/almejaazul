import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import PackageForm from '@/components/admin/PackageForm';

export const metadata = { title: 'New Package' };

export default async function NewPackagePage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Event Package" backHref="/admin/packages" backLabel="Event Packages">
      <PackageForm />
    </AdminShell>
  );
}
