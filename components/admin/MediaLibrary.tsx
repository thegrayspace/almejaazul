'use client';

import { useState, useRef } from 'react';

interface Asset {
  id: string;
  fileName: string;
  url: string;
  altText: string;
  category: string;
  createdAt: string;
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,37,48,0.15)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, color: '#1a2530', background: '#fff', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.5)', display: 'block', marginBottom: 6 };

export default function MediaLibrary({ assets: initialAssets }: { assets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('general');
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setUploadMsg({ type: 'error', text: 'Please select a file.' }); return; }
    setUploading(true);
    setUploadMsg(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('altText', altText);
    fd.append('category', category);
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? `HTTP ${res.status}`); }
      const asset = await res.json() as Asset;
      setAssets(prev => [asset, ...prev]);
      setUploadMsg({ type: 'success', text: `Uploaded: ${asset.fileName}` });
      setAltText('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setUploadMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally { setUploading(false); }
  }

  async function handleDelete(id: string, fileName: string) {
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAssets(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Failed to delete asset.');
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      {/* Upload form */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Upload Image</h2>
        {uploadMsg && <div style={{ padding: '14px 20px', borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: uploadMsg.type === 'success' ? 'rgba(42,157,92,0.12)' : 'rgba(220,53,69,0.1)', color: uploadMsg.type === 'success' ? '#1a7a42' : '#c0392b', border: `1px solid ${uploadMsg.type === 'success' ? 'rgba(42,157,92,0.25)' : 'rgba(220,53,69,0.2)'}` }}>{uploadMsg.text}</div>}
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div><label style={labelStyle}>File *</label><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ ...inputStyle, padding: '8px 12px' }} /></div>
            <div><label style={labelStyle}>Alt Text</label><input style={inputStyle} type="text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="Descriptive alt text" /></div>
            <div><label style={labelStyle}>Category</label><select style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}><option value="general">General</option><option value="rooms">Rooms</option><option value="spaces">Spaces</option><option value="activities">Activities</option><option value="tours">Tours</option><option value="events">Events</option><option value="branding">Branding</option></select></div>
            <button type="submit" disabled={uploading} style={{ padding: '10px 24px', background: uploading ? 'rgba(75,191,224,0.5)' : '#4BBFE0', color: '#1a2530', border: 'none', borderRadius: 100, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>{uploading ? 'Uploading…' : 'Upload'}</button>
          </div>
        </form>
      </div>

      {/* Asset count */}
      <p style={{ fontSize: 14, color: 'rgba(26,37,48,0.55)', marginBottom: 16 }}>{assets.length} asset{assets.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      {assets.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}><p style={{ color: 'rgba(26,37,48,0.4)', fontSize: 14 }}>No media yet. Upload your first image above.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {assets.map(asset => (
            <div key={asset.id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
              <div style={{ width: '100%', height: 120, background: '#f0ece3', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.altText || asset.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#1a2530', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 4px' }}>{asset.fileName}</p>
                {asset.altText && <p style={{ fontSize: 10, color: 'rgba(26,37,48,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 8px' }}>{asset.altText}</p>}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => copyUrl(asset.url)} style={{ flex: 1, padding: '6px 0', background: copied === asset.url ? 'rgba(42,157,92,0.1)' : '#f0ece3', color: copied === asset.url ? '#1a7a42' : '#1a2530', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>{copied === asset.url ? 'Copied!' : 'Copy URL'}</button>
                  <button onClick={() => handleDelete(asset.id, asset.fileName)} style={{ padding: '6px 10px', background: 'transparent', color: '#c0392b', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
