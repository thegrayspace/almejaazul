import { requireAdminSession } from '@/lib/auth';
import Link from 'next/link';

const ADMIN_NAV = [
  { href: '/admin/rooms', label: 'Rooms', desc: 'Manage room listings, prices, and descriptions' },
  { href: '/admin/spaces', label: 'Spaces', desc: 'Function Hall, Meeting Room, Cabanas, Pavilion' },
  { href: '/admin/day-passes', label: 'Day Passes', desc: 'Seaside, Beach+Pool, Cottage pass pricing' },
  { href: '/admin/addons', label: 'Add-Ons', desc: 'Water sports, dining, activities pricing' },
  { href: '/admin/activities', label: 'Activities', desc: 'Sports & leisure card content' },
  { href: '/admin/tours', label: 'Tours', desc: 'Island and excursion listings' },
  { href: '/admin/packages', label: 'Event Packages', desc: 'Corporate and retreat packages' },
  { href: '/admin/venues', label: 'Venues', desc: 'Wedding and event venue content' },
  { href: '/admin/faqs', label: 'FAQs', desc: 'Frequently asked questions' },
  { href: '/admin/inquiries', label: 'Inquiries', desc: 'View and manage form submissions' },
  { href: '/admin/media', label: 'Media', desc: 'Upload and manage images' },
  { href: '/admin/settings', label: 'Settings', desc: 'Site settings, contact info, social links' },
];

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await requireAdminSession();

  return (
    <div style={{
      minHeight: '100vh', background: '#f0ece3', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ background: '#1a2530', padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4BBFE0', marginBottom: 4 }}>Almeja Azul</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#fff' }}>Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>← View site</Link>
          <Link href="/api/admin/logout" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Sign out</Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 14, color: 'rgba(26,37,48,0.55)', marginBottom: 32 }}>
          Select a section to manage content.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {ADMIN_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{ display: 'block', background: '#fff', borderRadius: 8, padding: '24px 28px', textDecoration: 'none', boxShadow: '0 2px 12px rgba(26,37,48,0.06)', transition: 'box-shadow 0.2s, transform 0.2s' }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4BBFE0', marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(26,37,48,0.6)', lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
