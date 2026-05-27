import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import TourForm from '@/components/admin/TourForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'New Tour' };

export default async function NewTourPage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Tour" backHref="/admin/tours" backLabel="Tours">
      <TourForm />
    </AdminShell>
  );
}
