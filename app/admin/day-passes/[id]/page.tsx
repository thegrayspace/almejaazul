import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import DayPassForm from '@/components/admin/DayPassForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit Day Pass' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditDayPassPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const pass = await prisma.dayPass.findUnique({ where: { id } });

  if (!pass) return (
    <AdminShell title="Pass Not Found" backHref="/admin/day-passes" backLabel="Day Passes">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Day pass not found.</p></div>
    </AdminShell>
  );

  const pricingJson = pass.pricingJson as unknown[];
  const passData = { id: pass.id, name: pass.name, icon: pass.icon, price: pass.price.toNumber(), priceSuffix: pass.priceSuffix, priceMode: pass.priceMode, customPriceText: pass.customPriceText, pricingTiers: pricingJson.length ? JSON.stringify(pricingJson, null, 2) : '', includes: pass.includesJson as string[], note: pass.note, isHighlighted: pass.isHighlighted, imageUrl: pass.imageUrl, isPublished: pass.isPublished, sortOrder: pass.sortOrder };

  return (
    <AdminShell title="Edit Day Pass" backHref="/admin/day-passes" backLabel="Day Passes">
      <DayPassForm pass={passData} />
    </AdminShell>
  );
}
