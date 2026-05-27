import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import TourForm from '@/components/admin/TourForm';

export const metadata = { title: 'Edit Tour' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditTourPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const tour = await prisma.tour.findUnique({ where: { id } });

  if (!tour) return (
    <AdminShell title="Tour Not Found" backHref="/admin/tours" backLabel="Tours">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Tour not found.</p></div>
    </AdminShell>
  );

  const tourData = { id: tour.id, tag: tour.tag, name: tour.name, shortDescription: tour.shortDescription, detail: tour.detail, price: tour.price.toNumber(), priceMode: tour.priceMode, customPriceText: tour.customPriceText, duration: tour.duration, includes: tour.includesJson as string[], imageUrl: tour.imageUrl, modalImageUrl: tour.modalImageUrl, isPublished: tour.isPublished, sortOrder: tour.sortOrder };

  return (
    <AdminShell title="Edit Tour" backHref="/admin/tours" backLabel="Tours">
      <TourForm tour={tourData} />
    </AdminShell>
  );
}
