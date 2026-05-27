import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import VenueForm from '@/components/admin/VenueForm';

export const metadata = { title: 'Edit Venue' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditVenuePage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const venue = await prisma.venue.findUnique({ where: { id } });

  if (!venue) return (
    <AdminShell title="Venue Not Found" backHref="/admin/venues" backLabel="Venues">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Venue not found.</p></div>
    </AdminShell>
  );

  const venueData = { id: venue.id, type: venue.type, name: venue.name, tag: venue.tag, capacity: venue.capacity, subtitle: venue.subtitle, description: venue.description, imageUrl: venue.imageUrl, modalImageUrl: venue.modalImageUrl, floorPlanSvgType: venue.floorPlanSvgType, amenities: venue.amenitiesJson as string[], price: venue.price.toNumber(), priceMode: venue.priceMode, customPriceText: venue.customPriceText, isPublished: venue.isPublished, sortOrder: venue.sortOrder };

  return (
    <AdminShell title="Edit Venue" backHref="/admin/venues" backLabel="Venues">
      <VenueForm venue={venueData} />
    </AdminShell>
  );
}
