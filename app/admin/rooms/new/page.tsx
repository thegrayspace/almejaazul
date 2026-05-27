import { requireAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import RoomForm from '@/components/admin/RoomForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'New Room' };

export default async function NewRoomPage() {
  await requireAdminSession();

  return (
    <AdminShell title="New Room" backHref="/admin/rooms" backLabel="Rooms">
      <RoomForm />
    </AdminShell>
  );
}
