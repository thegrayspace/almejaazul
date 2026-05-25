'use client';

import { useState } from 'react';

const STATUS_OPTIONS = ['NEW', 'RESPONDED', 'CONFIRMED', 'CANCELLED'] as const;
type InquiryStatus = (typeof STATUS_OPTIONS)[number];

const STATUS_COLORS: Record<InquiryStatus, { bg: string; color: string }> = {
  NEW: { bg: 'rgba(75,191,224,0.12)', color: '#1a7a9a' },
  RESPONDED: { bg: 'rgba(245,168,32,0.15)', color: '#8a6200' },
  CONFIRMED: { bg: 'rgba(42,157,92,0.12)', color: '#1a7a42' },
  CANCELLED: { bg: 'rgba(26,37,48,0.08)', color: 'rgba(26,37,48,0.4)' },
};

interface Props {
  inquiryId: string;
  initialStatus: InquiryStatus;
}

export default function InquiryStatusSelect({ inquiryId, initialStatus }: Props) {
  const [status, setStatus] = useState<InquiryStatus>(initialStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: InquiryStatus) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } finally {
      setSaving(false);
    }
  }

  const colors = STATUS_COLORS[status];

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as InquiryStatus)}
      disabled={saving}
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.color,
        background: colors.bg,
        border: 'none',
        borderRadius: 100,
        padding: '4px 10px',
        cursor: saving ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        appearance: 'none',
        WebkitAppearance: 'none',
        outline: 'none',
      }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
