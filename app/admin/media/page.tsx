import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import MediaLibrary from '@/components/admin/MediaLibrary';

export const metadata = { title: 'Media' };

export default async function AdminMediaPage() {
  await requireAdminSession();
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <AdminShell title="Media Library">
      <MediaLibrary assets={assets.map(a => ({ id: a.id, fileName: a.fileName, url: a.url, altText: a.altText, category: a.category, createdAt: a.createdAt.toISOString() }))} />
    </AdminShell>
  );
}
