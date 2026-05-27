import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import SpaceForm from '@/components/admin/SpaceForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'New Space' };

export default async function NewSpacePage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Space" backHref="/admin/spaces" backLabel="Spaces">
      <SpaceForm />
    </AdminShell>
  );
}
