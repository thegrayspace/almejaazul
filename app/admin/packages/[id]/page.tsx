import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import PackageForm from '@/components/admin/PackageForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit Package' };

interface Props { params: Promise<{ id: string }>; }

export default async function EditPackagePage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const pkg = await prisma.eventPackage.findUnique({ where: { id } });

  if (!pkg) return (
    <AdminShell title="Package Not Found" backHref="/admin/packages" backLabel="Event Packages">
      <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>Package not found.</p></div>
    </AdminShell>
  );

  const pkgData = { id: pkg.id, type: pkg.type, name: pkg.name, includesText: pkg.includesText, price: pkg.price.toNumber(), priceMode: pkg.priceMode, customPriceText: pkg.customPriceText, description: pkg.description, imageUrl: pkg.imageUrl, features: pkg.featuresJson as string[], minPax: pkg.minPax, maxPax: pkg.maxPax, durations: pkg.durationsJson as string[], isPublished: pkg.isPublished, sortOrder: pkg.sortOrder };

  return (
    <AdminShell title="Edit Event Package" backHref="/admin/packages" backLabel="Event Packages">
      <PackageForm pkg={pkgData} />
    </AdminShell>
  );
}
