import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import ActivityForm from '@/components/admin/ActivityForm';

export const metadata = { title: 'Edit Activity' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditActivityPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const act = await prisma.activity.findUnique({ where: { id } });

  if (!act) return (
    <AdminShell title="Activity Not Found" backHref="/admin/activities" backLabel="Activities">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Activity not found.</p></div>
    </AdminShell>
  );

  const actData = { id: act.id, category: act.category, name: act.name, subtitle: act.subtitle, description: act.description, price: act.price.toNumber(), priceMode: act.priceMode, customPriceText: act.customPriceText, availability: act.availability, features: act.featuresJson as string[], imageUrl: act.imageUrl, icon: act.icon, layoutSize: act.layoutSize, isPlaceholder: act.isPlaceholder, isPublished: act.isPublished, sortOrder: act.sortOrder };

  return (
    <AdminShell title="Edit Activity" backHref="/admin/activities" backLabel="Activities">
      <ActivityForm activity={actData} />
    </AdminShell>
  );
}
