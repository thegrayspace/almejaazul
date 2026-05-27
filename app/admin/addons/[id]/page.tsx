import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import AddOnForm from '@/components/admin/AddOnForm';

export const metadata = { title: 'Edit Add-On' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditAddOnPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const addon = await prisma.addOn.findUnique({ where: { id } });

  if (!addon) return (
    <AdminShell title="Add-On Not Found" backHref="/admin/addons" backLabel="Add-Ons">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Add-on not found.</p></div>
    </AdminShell>
  );

  const addonData = { id: addon.id, name: addon.name, icon: addon.icon, price: addon.price.toNumber(), priceMode: addon.priceMode, customPriceText: addon.customPriceText, description: addon.description, category: addon.category, isPublished: addon.isPublished, sortOrder: addon.sortOrder };

  return (
    <AdminShell title="Edit Add-On" backHref="/admin/addons" backLabel="Add-Ons">
      <AddOnForm addon={addonData} />
    </AdminShell>
  );
}
