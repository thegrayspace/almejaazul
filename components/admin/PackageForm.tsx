'use client';

import { useState } from 'react';

export interface PackageData {
  id?: string;
  type: string;
  name: string;
  includesText: string;
  price: number;
  priceMode: string;
  customPriceText: string;
  description: string;
  imageUrl: string;
  features: string[];
  minPax: number;
  maxPax: number;
  durations: string[];
  isPublished: boolean;
  sortOrder: number;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,37,48,0.15)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', background: '#fff', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.5)', display: 'block', marginBottom: 6 };
const fieldStyle: React.CSSProperties = { marginBottom: 20 };
const PRICE_MODES = ['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM'];
const PKG_TYPES = ['corporate', 'wedding', 'private'];

const defaultPkg: PackageData = { type: 'corporate', name: '', includesText: '', price: 0, priceMode: 'INQUIRE', customPriceText: '', description: '', imageUrl: '', features: [], minPax: 1, maxPax: 100, durations: [], isPublished: true, sortOrder: 0 };

export default function PackageForm({ pkg }: { pkg?: PackageData }) {
  const isNew = !pkg?.id;
  const [formData, setFormData] = useState<PackageData>(pkg ?? defaultPkg);
  const [featuresText, setFeaturesText] = useState((pkg?.features ?? []).join('\n'));
  const [durationsText, setDurationsText] = useState((pkg?.durations ?? []).join('\n'));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function set<K extends keyof PackageData>(key: K, value: PackageData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = { ...formData, featuresJson: featuresText.split('\n').map(s => s.trim()).filter(Boolean), durationsJson: durationsText.split('\n').map(s => s.trim()).filter(Boolean) };
    try {
      const url = isNew ? '/api/admin/packages' : `/api/admin/packages/${pkg!.id}`;
      const res = await fetch(url, { method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: isNew ? 'Package created!' : 'Package updated!' });
      setTimeout(() => { window.location.href = '/admin/packages'; }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!pkg?.id) return;
    if (!window.confirm(`Delete "${formData.name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: 'Package deleted.' });
      setTimeout(() => { window.location.href = '/admin/packages'; }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && <div style={{ padding: '14px 20px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, background: message.type === 'success' ? 'rgba(42,157,92,0.12)' : 'rgba(220,53,69,0.1)', color: message.type === 'success' ? '#1a7a42' : '#c0392b', border: `1px solid ${message.type === 'success' ? 'rgba(42,157,92,0.25)' : 'rgba(220,53,69,0.2)'}` }}>{message.text}</div>}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Package Info</h2>
        <div style={fieldStyle}><label style={labelStyle}>Package Name *</label><input style={inputStyle} type="text" value={formData.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. The Day Retreat" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Type</label><select style={inputStyle} value={formData.type} onChange={e => set('type', e.target.value)}>{PKG_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
          <div style={fieldStyle}><label style={labelStyle}>Image URL</label><input style={inputStyle} type="text" value={formData.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." /></div>
        </div>
        <div style={fieldStyle}><label style={labelStyle}>Includes Summary</label><input style={inputStyle} type="text" value={formData.includesText} onChange={e => set('includesText', e.target.value)} placeholder="Function Hall · Meeting Room · All recreation courts · WiFi" /></div>
        <div style={fieldStyle}><label style={labelStyle}>Description *</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={formData.description} onChange={e => set('description', e.target.value)} required placeholder="Full description shown in the package modal" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Features (one per line)</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Function Hall — 100 pax&#10;Meeting Room — 20 pax&#10;All courts + beach + pool" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Duration Options (one per line)</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={durationsText} onChange={e => setDurationsText(e.target.value)} placeholder="Half Day&#10;Full Day" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Min Pax</label><input style={inputStyle} type="number" min={1} value={formData.minPax} onChange={e => set('minPax', parseInt(e.target.value, 10) || 1)} /></div>
          <div style={fieldStyle}><label style={labelStyle}>Max Pax</label><input style={inputStyle} type="number" min={1} value={formData.maxPax} onChange={e => set('maxPax', parseInt(e.target.value, 10) || 1)} /></div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Price (PHP)</label><input style={inputStyle} type="number" min={0} step={100} value={formData.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} /></div>
          <div style={fieldStyle}><label style={labelStyle}>Price Mode</label><select style={inputStyle} value={formData.priceMode} onChange={e => set('priceMode', e.target.value)}>{PRICE_MODES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
        </div>
        {formData.priceMode === 'CUSTOM' && <div style={fieldStyle}><label style={labelStyle}>Custom Price Text</label><input style={inputStyle} type="text" value={formData.customPriceText} onChange={e => set('customPriceText', e.target.value)} /></div>}
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Display</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Sort Order</label><input style={inputStyle} type="number" min={0} value={formData.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value, 10) || 0)} /></div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}><input type="checkbox" checked={formData.isPublished} onChange={e => set('isPublished', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#4BBFE0' }} /> Published</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: loading ? 'rgba(75,191,224,0.5)' : '#4BBFE0', color: '#1a2530', border: 'none', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving…' : isNew ? 'Create Package' : 'Save Changes'}</button>
        {!isNew && <button type="button" onClick={handleDelete} disabled={loading} style={{ padding: '12px 24px', background: 'transparent', color: '#c0392b', border: '1.5px solid rgba(192,57,43,0.3)', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>Delete Package</button>}
      </div>
    </form>
  );
}
