'use client';

import { useState } from 'react';

export interface SettingsData {
  id?: string;
  resortName: string;
  tagline: string;
  address: string;
  phone: string;
  phoneE164: string;
  messengerUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  googleMapsUrl: string;
  logoUrl: string;
  messengerLogoUrl: string;
  footerText: string;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,37,48,0.15)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', background: '#fff', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.5)', display: 'block', marginBottom: 6 };
const fieldStyle: React.CSSProperties = { marginBottom: 20 };

export default function SettingsForm({ settings }: { settings: SettingsData }) {
  const [formData, setFormData] = useState<SettingsData>(settings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function set<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: 'Settings saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && <div style={{ padding: '14px 20px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, background: message.type === 'success' ? 'rgba(42,157,92,0.12)' : 'rgba(220,53,69,0.1)', color: message.type === 'success' ? '#1a7a42' : '#c0392b', border: `1px solid ${message.type === 'success' ? 'rgba(42,157,92,0.25)' : 'rgba(220,53,69,0.2)'}` }}>{message.text}</div>}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Resort Identity</h2>
        <div style={fieldStyle}><label style={labelStyle}>Resort Name</label><input style={inputStyle} type="text" value={formData.resortName} onChange={e => set('resortName', e.target.value)} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Tagline</label><input style={inputStyle} type="text" value={formData.tagline} onChange={e => set('tagline', e.target.value)} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Address</label><input style={inputStyle} type="text" value={formData.address} onChange={e => set('address', e.target.value)} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Footer Text</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={formData.footerText} onChange={e => set('footerText', e.target.value)} /></div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Contact</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Phone (Display)</label><input style={inputStyle} type="text" value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="0999 308 8800" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Phone (E.164 for tel: links)</label><input style={inputStyle} type="text" value={formData.phoneE164} onChange={e => set('phoneE164', e.target.value)} placeholder="+639993088800" /></div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Social & Links</h2>
        <div style={fieldStyle}><label style={labelStyle}>Facebook URL</label><input style={inputStyle} type="text" value={formData.facebookUrl} onChange={e => set('facebookUrl', e.target.value)} placeholder="https://facebook.com/..." /></div>
        <div style={fieldStyle}><label style={labelStyle}>Messenger URL</label><input style={inputStyle} type="text" value={formData.messengerUrl} onChange={e => set('messengerUrl', e.target.value)} placeholder="https://m.me/..." /></div>
        <div style={fieldStyle}><label style={labelStyle}>Instagram URL</label><input style={inputStyle} type="text" value={formData.instagramUrl} onChange={e => set('instagramUrl', e.target.value)} placeholder="https://instagram.com/..." /></div>
        <div style={fieldStyle}><label style={labelStyle}>Google Maps URL</label><input style={inputStyle} type="text" value={formData.googleMapsUrl} onChange={e => set('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/..." /></div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Branding</h2>
        <div style={fieldStyle}><label style={labelStyle}>Logo URL</label><input style={inputStyle} type="text" value={formData.logoUrl} onChange={e => set('logoUrl', e.target.value)} />{formData.logoUrl && <div style={{ marginTop: 8 }}><img src={formData.logoUrl} alt="logo" style={{ maxHeight: 60, objectFit: 'contain' }} /></div>}</div>
        <div style={fieldStyle}><label style={labelStyle}>Messenger Logo URL</label><input style={inputStyle} type="text" value={formData.messengerLogoUrl} onChange={e => set('messengerLogoUrl', e.target.value)} /></div>
      </div>
      <button type="submit" disabled={loading} style={{ padding: '12px 40px', background: loading ? 'rgba(75,191,224,0.5)' : '#4BBFE0', color: '#1a2530', border: 'none', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving…' : 'Save Settings'}</button>
    </form>
  );
}
