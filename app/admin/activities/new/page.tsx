import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import ActivityForm from '@/components/admin/ActivityForm';

export const metadata = { title: 'New Activity' };

export default async function NewActivityPage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Activity" backHref="/admin/activities" backLabel="Activities">
      <ActivityForm />
    </AdminShell>
  );
}
