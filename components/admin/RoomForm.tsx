'use client';

import { useState } from 'react';

export interface RoomData {
  id?: string;
  tag: string;
  name: string;
  subtitle: string;
  capacity: string;
  basePrice: number;
  priceSuffix: string;
  priceMode: string;
  customPriceText: string;
  shortDescription: string;
  longDescription: string;
  amenities: string[];
  note: string;
  cardImageUrl: string;
  modalImageUrl: string;
  layoutSize: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

interface RoomFormProps {
  room?: RoomData;
}

const PRICE_MODES = ['NUMERIC', 'INQUIRE', 'INCLUDED', 'COMPLIMENTARY', 'ON_REQUEST', 'CUSTOM'];
const LAYOUT_SIZES = ['default', 'feature', 'wide'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid rgba(26,37,48,0.15)',
  borderRadius: 6,
  fontFamily: 'inherit',
  fontSize: 14,
  color: '#1a2530',
  background: '#fff',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(26,37,48,0.5)',
  display: 'block',
  marginBottom: 6,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: 20,
};

const defaultRoom: RoomData = {
  tag: '',
  name: '',
  subtitle: '',
  capacity: '',
  basePrice: 0,
  priceSuffix: '/night',
  priceMode: 'NUMERIC',
  customPriceText: '',
  shortDescription: '',
  longDescription: '',
  amenities: [],
  note: '',
  cardImageUrl: '',
  modalImageUrl: '',
  layoutSize: 'default',
  isFeatured: false,
  isPublished: true,
  sortOrder: 0,
};

export default function RoomForm({ room }: RoomFormProps) {
  const isNew = !room?.id;
  const [formData, setFormData] = useState<RoomData>(room ?? defaultRoom);
  const [amenitiesText, setAmenitiesText] = useState((room?.amenities ?? []).join('\n'));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function set<K extends keyof RoomData>(key: K, value: RoomData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      amenitiesJson: amenitiesText.split('\n').map(s => s.trim()).filter(Boolean),
    };

    try {
      const url = isNew ? '/api/admin/rooms' : `/api/admin/rooms/${room!.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setMessage({ type: 'success', text: isNew ? 'Room created successfully!' : 'Room updated successfully!' });
      setTimeout(() => {
        window.location.href = '/admin/rooms';
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!room?.id) return;
    if (!window.confirm(`Delete "${formData.name}"? This cannot be undone.`)) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setMessage({ type: 'success', text: 'Room deleted.' });
      setTimeout(() => {
        window.location.href = '/admin/rooms';
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Status message */}
      {message && (
        <div style={{
          padding: '14px 20px',
          borderRadius: 8,
          marginBottom: 24,
          fontSize: 14,
          fontWeight: 500,
          background: message.type === 'success' ? 'rgba(42,157,92,0.12)' : 'rgba(220,53,69,0.1)',
          color: message.type === 'success' ? '#1a7a42' : '#c0392b',
          border: `1px solid ${message.type === 'success' ? 'rgba(42,157,92,0.25)' : 'rgba(220,53,69,0.2)'}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Basic Info */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Basic Info</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Room Name *</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.name}
            onChange={e => set('name', e.target.value)}
            required
            placeholder="e.g. Garden Suite"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Tag</label>
            <input
              style={inputStyle}
              type="text"
              value={formData.tag}
              onChange={e => set('tag', e.target.value)}
              placeholder="e.g. Romantic · For Two"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Capacity</label>
            <input
              style={inputStyle}
              type="text"
              value={formData.capacity}
              onChange={e => set('capacity', e.target.value)}
              placeholder="e.g. Good for 2"
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Subtitle</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.subtitle}
            onChange={e => set('subtitle', e.target.value)}
            placeholder="e.g. Aircon · Sea-Facing · Queen Bed"
          />
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Pricing</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Base Price (PHP)</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              step={50}
              value={formData.basePrice}
              onChange={e => set('basePrice', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price Suffix</label>
            <input
              style={inputStyle}
              type="text"
              value={formData.priceSuffix}
              onChange={e => set('priceSuffix', e.target.value)}
              placeholder="/night"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price Mode</label>
            <select
              style={inputStyle}
              value={formData.priceMode}
              onChange={e => set('priceMode', e.target.value)}
            >
              {PRICE_MODES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          {formData.priceMode === 'CUSTOM' && (
            <div style={fieldStyle}>
              <label style={labelStyle}>Custom Price Text</label>
              <input
                style={inputStyle}
                type="text"
                value={formData.customPriceText}
                onChange={e => set('customPriceText', e.target.value)}
                placeholder="e.g. From ₱5,000"
              />
            </div>
          )}
        </div>
      </div>

      {/* Descriptions */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Descriptions</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Short Description</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.shortDescription}
            onChange={e => set('shortDescription', e.target.value)}
            placeholder="Brief one-liner for card display"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Long Description *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={4}
            value={formData.longDescription}
            onChange={e => set('longDescription', e.target.value)}
            required
            placeholder="Full room description shown in modal/detail view"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Amenities (one per line)</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={6}
            value={amenitiesText}
            onChange={e => setAmenitiesText(e.target.value)}
            placeholder={`Air conditioning\nSea view\nPrivate bathroom\nFree Wi-Fi`}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Note</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.note}
            onChange={e => set('note', e.target.value)}
            placeholder="e.g. Rates are per night, inclusive of breakfast"
          />
        </div>
      </div>

      {/* Images */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Images</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Card Image URL *</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.cardImageUrl}
            onChange={e => set('cardImageUrl', e.target.value)}
            required
            placeholder="https://..."
          />
          {formData.cardImageUrl && (
            <div style={{ marginTop: 8, borderRadius: 6, overflow: 'hidden', width: 160, height: 100, background: '#f0ece3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.cardImageUrl} alt="Card preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Modal Image URL</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.modalImageUrl}
            onChange={e => set('modalImageUrl', e.target.value)}
            placeholder="https://..."
          />
          {formData.modalImageUrl && (
            <div style={{ marginTop: 8, borderRadius: 6, overflow: 'hidden', width: 160, height: 100, background: '#f0ece3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.modalImageUrl} alt="Modal preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>

      {/* Display Settings */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>Display Settings</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Layout Size</label>
            <select
              style={inputStyle}
              value={formData.layoutSize}
              onChange={e => set('layoutSize', e.target.value)}
            >
              {LAYOUT_SIZES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Sort Order</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={e => set('sortOrder', parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, marginTop: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={e => set('isFeatured', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#4BBFE0' }}
            />
            Featured room
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}>
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={e => set('isPublished', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#4BBFE0' }}
            />
            Published
          </label>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 32px',
            background: loading ? 'rgba(75,191,224,0.5)' : '#4BBFE0',
            color: '#1a2530',
            border: 'none',
            borderRadius: 100,
            fontFamily: 'inherit',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving…' : isNew ? 'Create Room' : 'Save Changes'}
        </button>

        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#c0392b',
              border: '1.5px solid rgba(192,57,43,0.3)',
              borderRadius: 100,
              fontFamily: 'inherit',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Delete Room
          </button>
        )}
      </div>
    </form>
  );
}
