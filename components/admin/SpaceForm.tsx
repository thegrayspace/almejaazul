'use client';

import { useState } from 'react';

export interface SpaceData {
  id?: string;
  tag: string;
  name: string;
  capacity: string;
  price: number;
  priceSub: string;
  priceMode: string;
  customPriceText: string;
  description: string;
  amenities: string[];
  note: string;
  imageUrl: string;
  modalImageUrl: string;
  isPublished: boolean;
  sortOrder: number;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,37,48,0.15)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', background: '#fff', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.5)', display: 'block', marginBottom: 6 };
const fieldStyle: React.CSSProperties = { marginBottom: 20 };
const PRICE_MODES = ['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM'];

const defaultSpace: SpaceData = { tag: '', name: '', capacity: '', price: 0, priceSub: '', priceMode: 'NUMERIC', customPriceText: '', description: '', amenities: [], note: '', imageUrl: '', modalImageUrl: '', isPublished: true, sortOrder: 0 };

export default function SpaceForm({ space }: { space?: SpaceData }) {
  const isNew = !space?.id;
  const [formData, setFormData] = useState<SpaceData>(space ?? defaultSpace);
  const [amenitiesText, setAmenitiesText] = useState((space?.amenities ?? []).join('\n'));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function set<K extends keyof SpaceData>(key: K, value: SpaceData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = { ...formData, amenitiesJson: amenitiesText.split('\n').map(s => s.trim()).filter(Boolean) };
    try {
      const url = isNew ? '/api/admin/spaces' : `/api/admin/spaces/${space!.id}`;
      const res = await fetch(url, { method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: isNew ? 'Space created!' : 'Space updated!' });
      setTimeout(() => { window.location.href = '/admin/spaces'; }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!space?.id) return;
    if (!window.confirm(`Delete "${formData.name}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/spaces/${space.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: 'Space deleted.' });
      setTimeout(() => { window.location.href = '/admin/spaces'; }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div style={{ padding: '14px 20px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, background: message.type === 'success' ? 'rgba(42,157,92,0.12)' : 'rgba(220,53,69,0.1)', color: message.type === 'success' ? '#1a7a42' : '#c0392b', border: `1px solid ${message.type === 'success' ? 'rgba(42,157,92,0.25)' : 'rgba(220,53,69,0.2)'}` }}>
          {message.text}
        </div>
      )}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Basic Info</h2>
        <div style={fieldStyle}><label style={labelStyle}>Space Name *</label><input style={inputStyle} type="text" value={formData.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Function Hall" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Tag</label><input style={inputStyle} type="text" value={formData.tag} onChange={e => set('tag', e.target.value)} placeholder="e.g. Events · 100 pax" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Capacity</label><input style={inputStyle} type="text" value={formData.capacity} onChange={e => set('capacity', e.target.value)} placeholder="e.g. Up to 100 guests" /></div>
        </div>
        <div style={fieldStyle}><label style={labelStyle}>Description *</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={formData.description} onChange={e => set('description', e.target.value)} required placeholder="Full description of the space" /></div>
        <div style={fieldStyle}><label style={labelStyle}>Amenities (one per line)</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={amenitiesText} onChange={e => setAmenitiesText(e.target.value)} placeholder={`Air conditioning\nProjector & screen\nSound system`} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Note</label><input style={inputStyle} type="text" value={formData.note} onChange={e => set('note', e.target.value)} placeholder="e.g. Rates quoted per event" /></div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Price (PHP)</label><input style={inputStyle} type="number" min={0} step={50} value={formData.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} /></div>
          <div style={fieldStyle}><label style={labelStyle}>Price Sub-label</label><input style={inputStyle} type="text" value={formData.priceSub} onChange={e => set('priceSub', e.target.value)} placeholder="e.g. per event · half day" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Price Mode</label><select style={inputStyle} value={formData.priceMode} onChange={e => set('priceMode', e.target.value)}>{PRICE_MODES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          {formData.priceMode === 'CUSTOM' && <div style={fieldStyle}><label style={labelStyle}>Custom Price Text</label><input style={inputStyle} type="text" value={formData.customPriceText} onChange={e => set('customPriceText', e.target.value)} /></div>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Images</h2>
        <div style={fieldStyle}><label style={labelStyle}>Card Image URL *</label><input style={inputStyle} type="text" value={formData.imageUrl} onChange={e => set('imageUrl', e.target.value)} required placeholder="https://..." />{formData.imageUrl && <div style={{ marginTop: 8, borderRadius: 6, overflow: 'hidden', width: 160, height: 100, background: '#f0ece3' }}><img src={formData.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}</div>
        <div style={fieldStyle}><label style={labelStyle}>Modal Image URL</label><input style={inputStyle} type="text" value={formData.modalImageUrl} onChange={e => set('modalImageUrl', e.target.value)} placeholder="https://..." /></div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Display</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Sort Order</label><input style={inputStyle} type="number" min={0} value={formData.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value, 10) || 0)} /></div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}><input type="checkbox" checked={formData.isPublished} onChange={e => set('isPublished', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#4BBFE0' }} /> Published</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: loading ? 'rgba(75,191,224,0.5)' : '#4BBFE0', color: '#1a2530', border: 'none', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving…' : isNew ? 'Create Space' : 'Save Changes'}</button>
        {!isNew && <button type="button" onClick={handleDelete} disabled={loading} style={{ padding: '12px 24px', background: 'transparent', color: '#c0392b', border: '1.5px solid rgba(192,57,43,0.3)', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>Delete Space</button>}
      </div>
    </form>
  );
}
