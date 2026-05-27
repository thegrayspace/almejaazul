import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import SpaceForm from '@/components/admin/SpaceForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit Space' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditSpacePage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const space = await prisma.bookableSpace.findUnique({ where: { id } });

  if (!space) return (
    <AdminShell title="Space Not Found" backHref="/admin/spaces" backLabel="Spaces">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Space not found.</p></div>
    </AdminShell>
  );

  const spaceData = { id: space.id, tag: space.tag, name: space.name, capacity: space.capacity, price: space.price.toNumber(), priceSub: space.priceSub, priceMode: space.priceMode, customPriceText: space.customPriceText, description: space.description, amenities: space.amenitiesJson as string[], note: space.note, imageUrl: space.imageUrl, modalImageUrl: space.modalImageUrl, isPublished: space.isPublished, sortOrder: space.sortOrder };

  return (
    <AdminShell title="Edit Space" backHref="/admin/spaces" backLabel="Spaces">
      <SpaceForm space={spaceData} />
    </AdminShell>
  );
}
