'use client';

import { useState } from 'react';

export interface FAQData {
  id?: string;
  pageSlug: string;
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
}

interface FAQFormProps {
  faq?: FAQData;
}

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

const defaultFAQ: FAQData = {
  pageSlug: '',
  question: '',
  answer: '',
  isPublished: true,
  sortOrder: 0,
};

export default function FAQForm({ faq }: FAQFormProps) {
  const isNew = !faq?.id;
  const [formData, setFormData] = useState<FAQData>(faq ?? defaultFAQ);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function set<K extends keyof FAQData>(key: K, value: FAQData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const url = isNew ? '/api/admin/faqs' : `/api/admin/faqs/${faq!.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setMessage({ type: 'success', text: isNew ? 'FAQ created successfully!' : 'FAQ updated successfully!' });
      setTimeout(() => {
        window.location.href = '/admin/faqs';
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!faq?.id) return;
    if (!window.confirm(`Delete this FAQ? This cannot be undone.`)) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setMessage({ type: 'success', text: 'FAQ deleted.' });
      setTimeout(() => {
        window.location.href = '/admin/faqs';
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      {/* Main content */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px', marginBottom: 16, boxShadow: '0 2px 12px rgba(26,37,48,0.06)' }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.4)', marginTop: 0, marginBottom: 24 }}>FAQ Content</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Page Slug *</label>
            <input
              style={inputStyle}
              type="text"
              value={formData.pageSlug}
              onChange={(e) => set('pageSlug', e.target.value)}
              required
              placeholder="e.g. rooms, day-passes, general"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Sort Order</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(e) => set('sortOrder', parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Question *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={3}
            value={formData.question}
            onChange={(e) => set('question', e.target.value)}
            required
            placeholder="Enter the frequently asked question"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Answer *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={5}
            value={formData.answer}
            onChange={(e) => set('answer', e.target.value)}
            required
            placeholder="Enter the full answer"
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#1a2530' }}>
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => set('isPublished', e.target.checked)}
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
          {loading ? 'Saving…' : isNew ? 'Create FAQ' : 'Save Changes'}
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
            Delete FAQ
          </button>
        )}
      </div>
    </form>
  );
}
