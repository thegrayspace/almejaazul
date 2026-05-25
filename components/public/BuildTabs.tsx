'use client';

import { useState, useEffect } from 'react';
import { IconPhone } from '@/components/icons';
import { useInquiry } from './InquiryModal';
import Link from 'next/link';

// ── DATA ──────────────────────────────────────────────────

const PACKAGES = [
  {
    name: 'The Day Retreat',
    includes: 'Function Hall (full day) · Meeting Room · All recreation courts · Beach & pool access · WiFi · 2 meals',
    price: 'Inquire for group rates (min 20 pax)',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80',
    detail: 'A complete corporate day — structured morning sessions in the Function Hall, breakout rooms, then the beach and recreation courts open for the afternoon. Two meals included. Built for productive teams.',
    minPax: 20, maxPax: 100,
    duration: ['Half Day', 'Full Day'],
    features: ['Function Hall — 100 pax', 'Meeting Room — 20 pax', 'All courts + beach + pool', 'Fiber WiFi throughout', '2 meals included', 'On-site coordinator'],
  },
  {
    name: 'The Overnight Build',
    includes: 'Accommodation (2 nights) · Full venue access · Team sports facilitation · Island tour · All meals · WiFi',
    price: 'Custom package — message us',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
    detail: 'Two days, two nights. Morning strategy, afternoon island activities, evening dinners on the beach. The format that actually moves teams. Full accommodation, all meals, island tour — everything coordinated.',
    minPax: 15, maxPax: 60,
    duration: ['2 Nights', '3 Nights', 'Custom'],
    features: ['Accommodation · all rooms', 'Full venue access', 'Team sports facilitation', 'Island tour by bangka', 'All meals included', 'WiFi · full resort'],
  },
  {
    name: 'The Executive Offsite',
    includes: 'Meeting Room (full day) · 3 Meals · Airport & ferry transfers · WiFi · Leisure time · Cabana access',
    price: 'Per person pricing available',
    img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=700&q=80',
    detail: 'For C-suite and senior leadership. A focused work-and-unwind format — private meeting room, high-speed WiFi, and the Davao Gulf when the agenda ends. Airport and ferry transfers from Davao City arranged.',
    minPax: 4, maxPax: 20,
    duration: ['Full Day', 'Overnight', '2 Nights'],
    features: ['Private Meeting Room', 'Airport & ferry transfers', '3 meals daily', 'Cabana access', 'Fiber WiFi', 'Leisure & beach time'],
  },
];

const WED_VENUES = [
  { tag: 'Ceremony', name: 'Vow by the Sea', sub: 'Beachfront · Up to 80 guests · Sunset facing', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85' },
  { tag: 'Reception', name: 'The Mangrove Pavilion', sub: 'Canopy setting · Up to 60 guests · Intimate', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=85' },
];

const EVENT_TYPES = ['Team Building', 'Corporate Retreat', 'Executive Offsite', 'Destination Wedding', 'Birthday Celebration', 'Family Reunion', 'Product Launch'];

const NEEDS_OPTS = ['Function Hall', 'Meeting Room', 'Accommodation', 'All Meals', 'Team Activities', 'AV & Projector', 'Island Tour', 'Beach Access', 'Transfers'];

// ── SVG FLOOR PLANS ───────────────────────────────────────

function FloorPlanSVG({ type }: { type: 'mangrove' | 'sea' }) {
  if (type === 'mangrove') return (
    <svg className="fp-svg" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="220" fill="#f0ece3" rx="4" />
      <rect x="80" y="40" width="200" height="130" rx="4" fill="#fff" stroke="#4BBFE0" strokeWidth="1.5" />
      <text x="180" y="105" textAnchor="middle" fill="#1a2530" fontSize="11" fontWeight="500">Pavilion Floor</text>
      <text x="180" y="120" textAnchor="middle" fill="#4BBFE0" fontSize="10">60 capacity</text>
      <rect x="120" y="50" width="120" height="28" rx="3" fill="#4BBFE0" opacity="0.2" stroke="#4BBFE0" strokeWidth="1" />
      <text x="180" y="68" textAnchor="middle" fill="#2A8FB5" fontSize="9" fontWeight="600">STAGE / HEAD TABLE</text>
      {[0, 1, 2, 3, 4, 5].map(i => <ellipse key={i} cx={130 + (i % 3) * 50} cy={110 + (Math.floor(i / 3) * 28)} rx="16" ry="10" fill="#5a8a6e" opacity="0.18" stroke="#5a8a6e" strokeWidth="1" />)}
      <rect x="160" y="168" width="40" height="8" rx="2" fill="#4BBFE0" opacity="0.4" />
      <text x="180" y="192" textAnchor="middle" fill="#1a2530" opacity="0.5" fontSize="9">ENTRANCE</text>
      <rect x="0" y="0" width="75" height="220" fill="#5a8a6e" opacity="0.08" />
      <text x="37" y="115" textAnchor="middle" fill="#5a8a6e" fontSize="8" fontWeight="600" opacity="0.7">MANGROVE</text>
      <rect x="285" y="0" width="75" height="220" fill="#5a8a6e" opacity="0.08" />
      <text x="322" y="115" textAnchor="middle" fill="#5a8a6e" fontSize="8" fontWeight="600" opacity="0.7">FOREST</text>
      <rect x="85" y="140" width="45" height="18" rx="3" fill="#d4c9b0" stroke="#c4b9a0" strokeWidth="1" />
      <text x="107" y="152" textAnchor="middle" fill="#1a2530" fontSize="8">BAR</text>
      <rect x="245" y="140" width="30" height="18" rx="3" fill="#e8e0d4" stroke="#c4b9a0" strokeWidth="1" />
      <text x="260" y="152" textAnchor="middle" fill="#1a2530" fontSize="7">WC</text>
    </svg>
  );
  return (
    <svg className="fp-svg" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="220" fill="#f0ece3" rx="4" />
      <rect x="0" y="190" width="360" height="30" fill="#4BBFE0" opacity="0.15" />
      <text x="180" y="210" textAnchor="middle" fill="#2A8FB5" fontSize="9" fontWeight="600" opacity="0.7">DAVAO GULF ↓</text>
      <ellipse cx="180" cy="120" rx="30" ry="14" fill="#fff" stroke="#4BBFE0" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x="180" y="124" textAnchor="middle" fill="#4BBFE0" fontSize="8" fontWeight="600">ALTAR</text>
      <rect x="173" y="120" width="14" height="62" fill="rgba(75,191,224,0.1)" stroke="#4BBFE0" strokeWidth="0.5" strokeDasharray="3 2" />
      {[0, 1, 2, 3, 4].map(i => <rect key={`l${i}`} x={80} y={122 + i * 12} width={86} height={9} rx="2" fill="#fff" stroke="#d4c9b0" strokeWidth="1" />)}
      {[0, 1, 2, 3, 4].map(i => <rect key={`r${i}`} x={194} y={122 + i * 12} width={86} height={9} rx="2" fill="#fff" stroke="#d4c9b0" strokeWidth="1" />)}
      <path d="M160 185 Q180 175 200 185" stroke="#4BBFE0" strokeWidth="1.5" fill="none" />
      <text x="180" y="200" textAnchor="middle" fill="#1a2530" opacity="0.45" fontSize="8">ENTRANCE ARCH</text>
      <circle cx="180" cy="80" r="12" fill="none" stroke="#4BBFE0" strokeWidth="1" strokeDasharray="3 2" />
      <text x="180" y="50" textAnchor="middle" fill="#1a2530" fontSize="11" fontWeight="500">Vow by the Sea</text>
      <text x="180" y="66" textAnchor="middle" fill="#4BBFE0" fontSize="9">80 guest capacity</text>
    </svg>
  );
}

// ── PACKAGE MODAL ────────────────────────────────────────

const pillStyle = (on: boolean): React.CSSProperties => ({
  padding: '6px 14px',
  border: `1px solid ${on ? 'var(--c-brand)' : 'rgba(26,37,48,0.2)'}`,
  borderRadius: 100,
  fontSize: 11,
  color: on ? 'var(--c-ink)' : 'rgba(26,37,48,0.65)',
  cursor: 'pointer',
  background: on ? 'var(--c-brand)' : 'transparent',
  fontFamily: 'var(--ff-n)',
  transition: 'all 0.2s',
});

const fieldLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.45)', display: 'block', marginBottom: 7 };
const fieldInput: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'var(--c-sand)', border: '1px solid rgba(26,37,48,0.12)', borderRadius: 6, fontFamily: 'var(--ff-n)', fontSize: 14, color: 'var(--c-ink)', outline: 'none', boxSizing: 'border-box' };

function PackageModal({ pkg, onClose }: { pkg: typeof PACKAGES[0]; onClose: () => void }) {
  const [on, setOn] = useState(false);
  const [pax, setPax] = useState('');
  const [dur, setDur] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [rooms, setRooms] = useState('');

  const toggle = (n: string) => setNeeds(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 10);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className={`mOverlay${on ? ' on' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 960 }}>
        <div className="m-gallery">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pkg.img} alt={pkg.name} />
          <button className="m-close" onClick={onClose}>✕</button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(to top,rgba(26,37,48,0.92),transparent)' }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--c-brand)', marginBottom: 6 }}>{pkg.minPax}–{pkg.maxPax} pax · {pkg.duration.join(' / ')}</p>
            <h3 style={{ fontFamily: 'var(--ff-s)', fontSize: 28, fontWeight: 300, color: '#fff', lineHeight: 1.1 }}>{pkg.name}</h3>
          </div>
        </div>
        <div className="m-body">
          <p className="m-tag">Corporate Package</p>
          <h2 className="m-name" style={{ fontSize: 30 }}>{pkg.name}</h2>
          <p className="m-meta">{pkg.price}</p>
          <div className="m-hr" />
          <p className="m-desc">{pkg.detail}</p>
          <div className="m-amenities" style={{ marginBottom: 20 }}>
            {pkg.features.map(f => <div key={f} className="m-amen-item">{f}</div>)}
          </div>
          <div className="m-hr" />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.38)', marginBottom: 16 }}>Build Your Quote</p>

          <div style={{ marginBottom: 14 }}>
            <label style={fieldLabel}>How many people?</label>
            <input type="number" placeholder={`${pkg.minPax} – ${pkg.maxPax}`} min={pkg.minPax} max={pkg.maxPax} value={pax} onChange={e => setPax(e.target.value)} style={fieldInput} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={fieldLabel}>How long?</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {pkg.duration.map(d => <button key={d} onClick={() => setDur(d)} style={pillStyle(dur === d)}>{d}</button>)}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={fieldLabel}>What do you need?</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {NEEDS_OPTS.map(n => <button key={n} onClick={() => toggle(n)} style={pillStyle(needs.includes(n))}>{n}</button>)}
            </div>
          </div>

          {needs.includes('Accommodation') && (
            <div style={{ marginBottom: 14 }}>
              <label style={fieldLabel}>How many rooms?</label>
              <input type="number" placeholder="e.g. 5" min="1" max="30" value={rooms} onChange={e => setRooms(e.target.value)} style={fieldInput} />
            </div>
          )}

          <div className="m-ctas" style={{ marginTop: 20 }}>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="m-book">Send Inquiry on Messenger →</a>
            <a href="tel:09993088800" className="m-book-fb" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <IconPhone size={14} /> 0999 308 8800
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CORPORATE TAB ─────────────────────────────────────────

function CorporateTab() {
  const [activePkg, setActivePkg] = useState<typeof PACKAGES[0] | null>(null);

  return (
    <section className="corp-section" id="corporate">
      <div>
        <p className="s-eyebrow">Corporate &amp; Team Building</p>
        <h2 className="s-title">Offsite, <em>Elevated</em></h2>
      </div>
      <div className="corp-grid">
        <div>
          <p className="corp-desc">
            Almeja Azul is the rare venue where your team can sit in a proper meeting room with fiber WiFi
            in the morning, and be playing pickleball by the sea by afternoon. Function Hall for 100.
            Meeting Room for 20. Five hectares for everything else.
          </p>
          <div className="corp-packages">
            {PACKAGES.map(p => (
              <div key={p.name} className="pkg-card" style={{ cursor: 'pointer' }} onClick={() => setActivePkg(p)}>
                <h3 className="pkg-name">{p.name}</h3>
                <p className="pkg-includes">{p.includes}</p>
                <p className="pkg-price">{p.price}</p>
              </div>
            ))}
          </div>
          <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="btn-brand" style={{ display: 'inline-block', marginRight: 12 }}>
            Get a Custom Quote
          </a>
          <a href="tel:09993088800" className="btn-outline-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <IconPhone size={14} /> Call Us
          </a>
        </div>
        <div className="corp-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85" alt="Meeting" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&q=80" alt="Pickleball" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80" alt="Beach" />
        </div>
      </div>
      {activePkg && <PackageModal pkg={activePkg} onClose={() => setActivePkg(null)} />}
    </section>
  );
}

// ── WEDDINGS TAB ──────────────────────────────────────────

function WeddingsTab() {
  const WED_FEATURES = ['Beach ceremony setup', 'Mangrove Pavilion reception', 'In-house coordination', 'Accommodation for wedding party', 'Catering coordination', 'Floral & décor support available', 'Bangka arrival experience', 'Private beach access'];

  return (
    <section className="wed-section" id="weddings">
      <div>
        <p className="s-eyebrow">Destination Weddings</p>
        <h2 className="s-title">Your <em>Vow</em> by the Sea</h2>
      </div>
      <div className="wed-intro" style={{ marginTop: 56 }}>
        <div style={{ position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wed-img-main" src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85" alt="Sunset wedding" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wed-img-inset" src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80" alt="Mangrove pavilion" />
        </div>
        <div>
          <p className="s-body" style={{ marginBottom: 28 }}>
            Two ceremony locations. One intimate, one cinematic. The Mangrove Pavilion wraps your reception
            in ancient root systems and forest light. Vow by the Sea opens your ceremony to the full horizon
            of the Davao Gulf at golden hour. Both are unforgettable.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WED_FEATURES.map(f => <div key={f} className="m-amen-item">{f}</div>)}
          </div>
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="btn-brand">Inquire on Messenger</a>
            <a href="tel:09993088800" className="btn-outline-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <IconPhone size={14} /> 0999 308 8800
            </a>
          </div>
        </div>
      </div>
      <div>
        <p className="s-eyebrow">Our Venues</p>
        <h2 className="s-title" style={{ marginBottom: 32 }}>Two <em>Spaces</em></h2>
        <div className="wed-venue-grid">
          {WED_VENUES.map(v => (
            <div key={v.name} className="wed-venue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.img} alt={v.name} loading="lazy" />
              <div className="wed-venue-overlay" />
              <div className="wed-venue-body">
                <p className="wed-venue-tag">{v.tag}</p>
                <h3 className="wed-venue-name">{v.name}</h3>
                <p className="wed-venue-sub">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FLOOR PLANS TAB ───────────────────────────────────────

function FloorPlansTab() {
  return (
    <section className="floorplan-section" id="floorplans">
      <p className="s-eyebrow">Interactive Floor Plans</p>
      <h2 className="s-title">Plan Your <em>Space</em></h2>
      <div className="floorplan-grid">
        <div className="fp-card">
          <div className="fp-card-header">
            <div className="fp-card-title">The Mangrove Pavilion</div>
            <div className="fp-card-cap">Up to 60 guests</div>
          </div>
          <div className="fp-diagram"><FloorPlanSVG type="mangrove" /></div>
          <div className="fp-legend">
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: '#4BBFE0' }} /> Stage / Head Table</div>
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: '#5a8a6e' }} /> Mangrove Forest</div>
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: '#d4c9b0' }} /> Bar</div>
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: '#fff', border: '1px solid #ccc' }} /> Guest Tables</div>
          </div>
          <div className="fp-info">
            <p>Air-conditioned interior with open-air forest edges. Stage, dance floor, and dining area. Bar + restroom block included. Natural canopy lighting available.</p>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer">Inquire about this venue →</a>
          </div>
        </div>
        <div className="fp-card">
          <div className="fp-card-header">
            <div className="fp-card-title">Vow by the Sea</div>
            <div className="fp-card-cap">Up to 80 guests</div>
          </div>
          <div className="fp-diagram"><FloorPlanSVG type="sea" /></div>
          <div className="fp-legend">
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: '#4BBFE0' }} /> Altar</div>
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: '#fff', border: '1px solid #ccc' }} /> Guest Seating</div>
            <div className="fp-leg-item"><div className="fp-leg-dot" style={{ background: 'rgba(75,191,224,0.2)', border: '1px solid #4BBFE0' }} /> Aisle</div>
          </div>
          <div className="fp-info">
            <p>Open-air beachfront ceremony space with the Davao Gulf as backdrop. Sunset-facing. Floral arch, string lighting, and aisle florals available. Reception connects to the beach pavilion.</p>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer">Inquire about this venue →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── INQUIRY SECTION ───────────────────────────────────────

function InquirySection() {
  const [eventType, setEventType] = useState<string | null>(null);

  return (
    <section className="inquiry-section">
      <div>
        <p className="s-eyebrow-light">Start Planning</p>
        <h2 className="s-title-light">Tell us about<br />your <em>event.</em></h2>
        <p className="s-body-light" style={{ marginTop: 20, marginBottom: 32 }}>
          Select your event type below, then message us on Facebook Messenger for the fastest response.
          We build custom packages for every group.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="https://www.facebook.com/AlmejaAzulResort/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 28px', background: '#1877F2', color: '#fff', border: 'none', borderRadius: 100, fontFamily: "var(--ff-n)", fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            View Our Facebook Page
          </a>
          <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 28px', background: '#0099FF', color: '#fff', border: 'none', borderRadius: 100, fontFamily: "var(--ff-n)", fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Message via Messenger
          </a>
          <a href="tel:09993088800" className="btn-outline" style={{ textAlign: 'center' }}>0999 308 8800</a>
        </div>
      </div>
      <div className="inq-form">
        <h3>What are you planning?</h3>
        <div className="inq-row">
          <label className="inq-label">Event Type</label>
          <div className="inq-pill-row">
            {EVENT_TYPES.map(t => (
              <button key={t} className={`inq-pill${eventType === t ? ' on' : ''}`} onClick={() => setEventType(t === eventType ? null : t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {eventType && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(75,191,224,0.1)', borderRadius: 8, border: '1px solid rgba(75,191,224,0.25)' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>
              Great! Message us on Messenger with &ldquo;<strong style={{ color: 'var(--c-brand)' }}>I want to plan a {eventType} at Almeja Azul</strong>&rdquo; and we will respond within the hour.
            </p>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="btn-brand" style={{ display: 'block', textAlign: 'center', padding: 13 }}>
              Open Messenger →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────

type Tab = 'corporate' | 'weddings' | 'floorplans';

export default function BuildTabs({ initialTab = 'corporate' }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <>
      <div className="tab-nav">
        <button className={`tab-btn${tab === 'corporate' ? ' on' : ''}`} onClick={() => setTab('corporate')}>
          Corporate &amp; Team Building
        </button>
        <button className={`tab-btn${tab === 'weddings' ? ' on' : ''}`} onClick={() => setTab('weddings')} id="weddings">
          Destination Weddings
        </button>
        <button className={`tab-btn${tab === 'floorplans' ? ' on' : ''}`} onClick={() => setTab('floorplans')}>
          Interactive Floor Plans
        </button>
      </div>

      {tab === 'corporate' && <CorporateTab />}
      {tab === 'weddings' && <WeddingsTab />}
      {tab === 'floorplans' && <FloorPlansTab />}

      <InquirySection />
    </>
  );
}
