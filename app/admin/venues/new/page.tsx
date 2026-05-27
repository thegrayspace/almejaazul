import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import VenueForm from '@/components/admin/VenueForm';

export const metadata = { title: 'New Venue' };

export default async function NewVenuePage() {
  await requireAdminSession();
  return (
    <AdminShell title="New Venue" backHref="/admin/venues" backLabel="Venues">
      <VenueForm />
    </AdminShell>
  );
}
