import Link from 'next/link';
import React from 'react';

interface AdminShellProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, backHref, backLabel, children }: AdminShellProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0ece3',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ background: '#1a2530', padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4BBFE0', marginBottom: 4 }}>Almeja Azul</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#fff', margin: 0 }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Link href="/admin" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>← Dashboard</Link>
          <Link href="/" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>View site</Link>
          <Link href="/api/admin/logout" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Sign out</Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
        {backHref && (
          <div style={{ marginBottom: 24 }}>
            <Link
              href={backHref}
              style={{ fontSize: 12, color: 'rgba(26,37,48,0.5)', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              ← {backLabel ?? 'Back'}
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
