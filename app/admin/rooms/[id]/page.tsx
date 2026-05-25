import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import RoomForm from '@/components/admin/RoomForm';

export const metadata = { title: 'Edit Room' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRoomPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;

  const room = await prisma.room.findUnique({ where: { id } });

  if (!room) {
    return (
      <AdminShell title="Room Not Found" backHref="/admin/rooms" backLabel="Rooms">
        <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
          <p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Room not found.</p>
        </div>
      </AdminShell>
    );
  }

  const roomData = {
    id: room.id,
    tag: room.tag,
    name: room.name,
    subtitle: room.subtitle,
    capacity: room.capacity,
    basePrice: room.basePrice.toNumber(),
    priceSuffix: room.priceSuffix,
    priceMode: room.priceMode,
    customPriceText: room.customPriceText,
    shortDescription: room.shortDescription,
    longDescription: room.longDescription,
    amenities: room.amenitiesJson as string[],
    note: room.note,
    cardImageUrl: room.cardImageUrl,
    modalImageUrl: room.modalImageUrl,
    layoutSize: room.layoutSize,
    isFeatured: room.isFeatured,
    isPublished: room.isPublished,
    sortOrder: room.sortOrder,
  };

  return (
    <AdminShell title="Edit Room" backHref="/admin/rooms" backLabel="Rooms">
      <RoomForm room={roomData} />
    </AdminShell>
  );
}
