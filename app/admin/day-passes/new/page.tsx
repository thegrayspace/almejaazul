import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import DayPassForm from '@/components/admin/DayPassForm';

export const metadata = { title: 'New Day Pass' };

export default async function NewDayPassPage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Day Pass" backHref="/admin/day-passes" backLabel="Day Passes">
      <DayPassForm />
    </AdminShell>
  );
}
