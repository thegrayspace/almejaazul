import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Day Passes' };

export default async function AdminDayPassesPage() {
  await requireAdminSession();
  const passes = await prisma.dayPass.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <AdminShell title="Day Passes">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: 'rgba(26,37,48,0.55)', margin: 0 }}>{passes.length} pass{passes.length !== 1 ? 'es' : ''} total</p>
        <Link href="/admin/day-passes/new" prefetch={false} style={{ padding: '10px 24px', background: '#4BBFE0', color: '#1a2530', textDecoration: 'none', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>+ Add Pass</Link>
      </div>
      {passes.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>No day passes yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {passes.map(pass => (
            <div key={pass.id} style={{ background: '#fff', borderRadius: 8, padding: '18px 24px', boxShadow: '0 2px 12px rgba(26,37,48,0.06)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 36, height: 36, background: '#f0ece3', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(26,37,48,0.4)', flexShrink: 0 }}>{pass.sortOrder}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1a2530' }}>{pass.name}</span>
                {pass.isHighlighted && <span style={{ marginLeft: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4BBFE0' }}>Most Popular</span>}
                <div style={{ fontSize: 12, color: 'rgba(26,37,48,0.5)', marginTop: 2 }}>₱{pass.price.toNumber().toLocaleString()} {pass.priceSuffix} · {pass.priceMode}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: pass.isPublished ? '#2a9d5c' : 'rgba(26,37,48,0.4)', background: pass.isPublished ? 'rgba(42,157,92,0.1)' : 'rgba(26,37,48,0.07)', padding: '4px 10px', borderRadius: 100 }}>{pass.isPublished ? 'Published' : 'Draft'}</span>
              <Link href={`/admin/day-passes/${pass.id}`} prefetch={false} style={{ padding: '8px 20px', background: 'transparent', color: '#1a2530', textDecoration: 'none', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1.5px solid rgba(26,37,48,0.2)', flexShrink: 0 }}>Edit</Link>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
