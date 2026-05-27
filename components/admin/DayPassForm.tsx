'use client';

import { useState } from 'react';

export interface DayPassData {
  id?: string;
  name: string;
  icon: string;
  price: number;
  priceSuffix: string;
  priceMode: string;
  customPriceText: string;
  pricingTiers: string;
  includes: string[];
  note: string;
  isHighlighted: boolean;
  imageUrl: string;
  isPublished: boolean;
  sortOrder: number;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,37,48,0.15)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', background: '#fff', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.5)', display: 'block', marginBottom: 6 };
const fieldStyle: React.CSSProperties = { marginBottom: 20 };
const PRICE_MODES = ['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM'];

const defaultPass: DayPassData = { name: '', icon: '', price: 0, priceSuffix: '/person', priceMode: 'NUMERIC', customPriceText: '', pricingTiers: '', includes: [], note: '', isHighlighted: false, imageUrl: '', isPublished: true, sortOrder: 0 };

export default function DayPassForm({ pass }: { pass?: DayPassData }) {
  const isNew = !pass?.id;
  const [formData, setFormData] = useState<DayPassData>(pass ?? defaultPass);
  const [includesText, setIncludesText] = useState((pass?.includes ?? []).join('\n'));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function set<K extends keyof DayPassData>(key: K, value: DayPassData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let pricingJson: unknown[] = [];
    try {
      if (formData.pricingTiers.trim()) {
        pricingJson = JSON.parse(formData.pricingTiers);
      }
    } catch {
      setMessage({ type: 'error', text: 'Pricing tiers JSON is invalid. Use format: [{"label":"Full Day","price":"₱300","note":"dawn to dusk"}]' });
      setLoading(false);
      return;
    }

    const payload = { ...formData, pricingJson, includesJson: includesText.split('\n').map(s => s.trim()).filter(Boolean) };
    try {
      const url = isNew ? '/api/admin/day-passes' : `/api/admin/day-passes/${pass!.id}`;
      const res = await fetch(url, { method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: isNew ? 'Day pass created!' : 'Day pass updated!' });
      setTimeout(() => { window.location.href = '/admin/day-passes'; }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!pass?.id) return;
    if (!window.confirm(`Delete "${formData.name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/day-passes/${pass.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setMessage({ type: 'success', text: 'Day pass deleted.' });
      setTimeout(() => { window.location.href = '/admin/day-passes'; }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && <div style={{ padding: '14px 20px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, background: message.type === 'success' ? 'rgba(42,157,92,0.12)' : 'rgba(220,53,69,0.1)', color: message.type === 'success' ? '#1a7a42' : '#c0392b', border: `1px solid ${message.type === 'success' ? 'rgba(42,157,92,0.25)' : 'rgba(220,53,69,0.2)'}` }}>{message.text}</div>}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Basic Info</h2>
        <div style={fieldStyle}><label style={labelStyle}>Pass Name *</label><input style={inputStyle} type="text" value={formData.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Beach + Pool Pass" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Icon key</label><input style={inputStyle} type="text" value={formData.icon} onChange={e => set('icon', e.target.value)} placeholder="e.g. waves" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Image URL</label><input style={inputStyle} type="text" value={formData.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." /></div>
        </div>
        <div style={fieldStyle}><label style={labelStyle}>What&apos;s Included (one per line)</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={includesText} onChange={e => setIncludesText(e.target.value)} placeholder={`Both beach fronts\nInfinity pool access\nHigh-speed WiFi`} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Note</label><input style={inputStyle} type="text" value={formData.note} onChange={e => set('note', e.target.value)} placeholder="e.g. Walk-ins always welcome" /></div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Base Price (PHP)</label><input style={inputStyle} type="number" min={0} step={10} value={formData.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} /></div>
          <div style={fieldStyle}><label style={labelStyle}>Price Suffix</label><input style={inputStyle} type="text" value={formData.priceSuffix} onChange={e => set('priceSuffix', e.target.value)} placeholder="/person" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Price Mode</label><select style={inputStyle} value={formData.priceMode} onChange={e => set('priceMode', e.target.value)}>{PRICE_MODES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          {formData.priceMode === 'CUSTOM' && <div style={fieldStyle}><label style={labelStyle}>Custom Price Text</label><input style={inputStyle} type="text" value={formData.customPriceText} onChange={e => set('customPriceText', e.target.value)} /></div>}
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Pricing Tiers (JSON array)</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} rows={5} value={formData.pricingTiers} onChange={e => set('pricingTiers', e.target.value)} placeholder={`[
  {"label":"Per Hour","price":"₱80","note":"min. 2 hrs"},
  {"label":"Half Day","price":"₱150","note":"up to 6 hrs"},
  {"label":"Full Day","price":"₱200","note":"dawn to dusk"}
]`} />
          <p style={{ fontSize: 11, color: 'rgba(26,37,48,0.45)', marginTop: 4 }}>Optional. Defines the pricing breakdown shown in the pass modal.</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Display</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}><label style={labelStyle}>Sort Order</label><input style={inputStyle} type="number" min={0} value={formData.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value, 10) || 0)} /></div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}><input type="checkbox" checked={formData.isHighlighted} onChange={e => set('isHighlighted', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#4BBFE0' }} /> Highlighted (Most Popular)</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}><input type="checkbox" checked={formData.isPublished} onChange={e => set('isPublished', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#4BBFE0' }} /> Published</label>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: loading ? 'rgba(75,191,224,0.5)' : '#4BBFE0', color: '#1a2530', border: 'none', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving…' : isNew ? 'Create Pass' : 'Save Changes'}</button>
        {!isNew && <button type="button" onClick={handleDelete} disabled={loading} style={{ padding: '12px 24px', background: 'transparent', color: '#c0392b', border: '1.5px solid rgba(192,57,43,0.3)', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>Delete Pass</button>}
      </div>
    </form>
  );
}
