'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#1a2530', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      <div style={{
        background: '#faf8f4', borderRadius: 12, padding: '48px 44px',
        width: '100%', maxWidth: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
      }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4BBFE0', marginBottom: 8 }}>
            Almeja Azul
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 300, color: '#1a2530', lineHeight: 1 }}>
            Admin
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.45)', display: 'block', marginBottom: 7 }}>
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', background: '#f0ece3', border: '1.5px solid rgba(26,37,48,0.12)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.45)', display: 'block', marginBottom: 7 }}>
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', background: '#f0ece3', border: '1.5px solid rgba(26,37,48,0.12)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#e53e3e', marginBottom: 16, padding: '10px 14px', background: 'rgba(229,62,62,0.08)', borderRadius: 6 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 14, background: loading ? 'rgba(75,191,224,0.6)' : '#4BBFE0',
              color: '#1a2530', border: 'none', borderRadius: 100, fontFamily: 'inherit',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(26,37,48,0.08)' }}>
          <a href="/" style={{ fontSize: 12, color: 'rgba(26,37,48,0.4)', textDecoration: 'none' }}>
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
