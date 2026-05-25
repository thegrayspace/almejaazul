'use client';

import { useState, useEffect } from 'react';
import {
  IconUmbrella,
  IconWaves,
  IconCottage,
  IconPhone,
  IconSnorkel,
  IconJetSki,
  IconBananaBoat,
  IconKayak,
  IconPickleball,
  IconDining,
  IconWifi,
  IconPaw,
  IconSunrise,
  IconCoffee,
  IconSunset,
} from '@/components/icons';

// ── Data ──────────────────────────────────────────────────────────────────────

const PASS_DATA = [
  {
    key: 'seaside',
    name: 'Seaside Day Pass',
    iconName: 'umbrella',
    tag: 'Beach Access · Per Person',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
    pricing: [
      { label: 'Per Hour', price: '₱80', note: 'min. 2 hrs' },
      { label: 'Half Day', price: '₱150', note: 'up to 6 hrs' },
      { label: 'Full Day', price: '₱200', note: 'dawn to dusk' },
    ],
    includes: [
      'Both beach fronts',
      'Shoreline lounge areas',
      'Restroom facilities',
      'High-speed WiFi',
      'Open daily · Dawn to dusk',
    ],
    note: 'Pets welcome. Walk-ins always accepted. Add pool for ₱100 more.',
    unit: 'per person',
  },
  {
    key: 'pool',
    name: 'Beach + Pool Pass',
    iconName: 'waves',
    tag: 'Most Popular · Per Person',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
    pricing: [
      { label: 'Per Hour', price: '₱120', note: 'min. 2 hrs' },
      { label: 'Half Day', price: '₱200', note: 'up to 6 hrs' },
      { label: 'Full Day', price: '₱300', note: 'dawn to dusk' },
    ],
    includes: [
      'Both beach fronts',
      'Infinity pool access',
      'Lounge chairs at pool',
      'Restroom & shower',
      'High-speed WiFi',
    ],
    note: 'Most popular for groups and families.',
    unit: 'per person',
  },
  {
    key: 'cottage',
    name: 'Cottage Rental',
    iconName: 'cottage',
    tag: 'Shaded Beachside · Per Cottage',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
    pricing: [
      { label: 'Per Hour', price: '₱100', note: 'min. 3 hrs' },
      { label: 'Half Day', price: '₱200', note: 'up to 6 hrs' },
      { label: 'Full Day', price: '₱300', note: 'dawn to dusk' },
    ],
    includes: [
      'Shaded beachside cottage',
      'Table & seating for group',
      'Power outlet',
      'Cooler storage',
      'Full or part-day',
    ],
    note: 'Add any beach pass on top. Best for families and groups.',
    unit: 'per cottage',
  },
];

type PassData = (typeof PASS_DATA)[number];

const ADDONS = [
  { Icon: IconSnorkel, name: 'Snorkeling', price: 'Equipment: ₱200', desc: 'Reef access off both beach fronts. Equipment rental at the water sports desk.' },
  { Icon: IconJetSki, name: 'Jet Ski', price: 'Inquire on-site', desc: 'Open water jet skiing on the Davao Gulf. Safety briefing included. Lifeguard on duty.' },
  { Icon: IconBananaBoat, name: 'Banana Boat', price: '₱300/ride', desc: 'Up to 8 riders. The most fun you will have with strangers. Lifeguard on duty.' },
  { Icon: IconKayak, name: 'Kayaking', price: 'On request', desc: 'Single and double kayaks. Paddle the mangrove edge or along the coast.' },
  { Icon: IconPickleball, name: 'Pickleball', price: '+₱150/session', desc: 'Three full courts available for day guests. Equipment provided. Book at the desk.' },
  { Icon: IconDining, name: 'Restaurant', price: 'À la carte', desc: 'Filipino classics and fresh seafood on-site. Open to all day guests throughout the day.' },
  { Icon: IconWifi, name: 'High-Speed WiFi', price: 'Complimentary', desc: 'Fiber internet across all resort areas including beach. Work remotely from paradise.' },
  { Icon: IconPaw, name: 'Pet-Friendly', price: 'Always', desc: 'Bring your pets. They are welcome on the beach and common grounds.' },
];

const TIMELINE = [
  { Icon: IconSunrise, time: '7:00 AM', act: 'Arrive & check in', note: 'Pay at the gate · Get wristband' },
  { Icon: IconCoffee, time: '7:30 AM', act: 'Breakfast at the restaurant', note: 'Fresh Filipino breakfast · Seafood options' },
  { Icon: IconWaves, time: '9:00 AM', act: 'Morning swim & pool time', note: 'Both beach fronts open · Infinity pool' },
  { Icon: IconSnorkel, time: '10:30 AM', act: 'Snorkeling session', note: 'Reef access · Equipment at the water desk' },
  { Icon: IconBananaBoat, time: '12:00 PM', act: 'Banana boat & water sports', note: 'Group fun · ₱300 per ride' },
  { Icon: IconDining, time: '1:00 PM', act: 'Lunch at the restaurant', note: 'À la carte · Fresh seafood' },
  { Icon: IconPickleball, time: '3:00 PM', act: 'Pickleball or beach volleyball', note: 'Courts open · Equipment provided' },
  { Icon: IconSunset, time: '5:30 PM', act: 'Sunset on the beach', note: 'The best part. Free.' },
];

const FAQS = [
  { q: 'What time does the resort open for day visitors?', a: 'The resort opens at 7:00 AM and day guests must check out by 6:00 PM. The last entry for day visitors is 4:00 PM.' },
  { q: 'Do I need to book in advance for a day pass?', a: "Walk-ins are always welcome. However, during peak weekends and holidays we recommend confirming via Messenger or a quick call — especially if you're bringing a group of 10 or more." },
  { q: 'Are pets allowed?', a: 'Yes. Almeja Azul is pet-friendly. Dogs and other pets are welcome on the beach and common grounds. We ask that pets are supervised and on a leash in common areas.' },
  { q: 'Can day guests access the pool?', a: 'Yes. The Beach + Pool Pass (₱300/person full day) includes full infinity pool access. The Seaside Day Pass does not include pool access but you can upgrade on arrival for ₱100 more per person.' },
  { q: 'Is food available on-site?', a: 'Yes. The resort restaurant is open to day guests. We serve Filipino classics, fresh seafood, and light snacks. Corkage fees apply if you bring outside food.' },
  { q: 'Is WiFi available for day guests?', a: 'Yes. High-speed fiber WiFi is available throughout the resort, including common areas and the beach. Perfect for the remote worker taking a beach day.' },
];

// ── PassIcon lookup ───────────────────────────────────────────────────────────

function PassIcon({ name, size }: { name: string; size?: number }) {
  if (name === 'umbrella') return <IconUmbrella size={size ?? 28} />;
  if (name === 'waves') return <IconWaves size={size ?? 28} />;
  if (name === 'cottage') return <IconCottage size={size ?? 28} />;
  return null;
}

// ── PassModal ─────────────────────────────────────────────────────────────────

function PassModal({ pass, onClose }: { pass: PassData; onClose: () => void }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 10);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className={`mOverlay${on ? ' on' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="m-gallery">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pass.img} alt={pass.name} />
          <button className="m-close" onClick={onClose}>✕</button>
        </div>

        <div className="m-body">
          <p className="m-tag">{pass.tag}</p>
          <h2 className="m-name">{pass.name}</h2>
          <p className="m-meta">{pass.unit}</p>

          <div className="m-hr" />

          {/* Pricing grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
            {pass.pricing.map(tier => (
              <div
                key={tier.label}
                style={{
                  background: 'var(--c-sand)',
                  borderRadius: 6,
                  padding: '16px 14px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,37,48,0.45)', marginBottom: 6 }}>
                  {tier.label}
                </p>
                <p style={{ fontFamily: 'var(--ff-s)', fontSize: 36, fontWeight: 300, lineHeight: 1, color: 'var(--c-ink)', marginBottom: 4 }}>
                  {tier.price}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(26,37,48,0.50)' }}>{tier.note}</p>
              </div>
            ))}
          </div>

          <div className="m-hr" />

          <div className="m-amenities">
            {pass.includes.map(item => (
              <div key={item} className="m-amen-item">{item}</div>
            ))}
          </div>

          <p className="m-note">{pass.note}</p>

          <div className="m-ctas">
            <a
              href="https://m.me/AlmejaAzulResort"
              target="_blank"
              rel="noopener noreferrer"
              className="m-book"
            >
              Book on Messenger →
            </a>
            <a href="tel:+63" className="m-book-fb">
              <IconPhone size={14} /> Call to Confirm
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FAQAccordion ──────────────────────────────────────────────────────────────

function FAQAccordion({ faqs }: { faqs: typeof FAQS }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`faq-item${openFaq === i ? ' open' : ''}`}
        >
          <div
            className="faq-q"
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
          >
            {faq.q}
            <span className="arr">+</span>
          </div>
          <div className="faq-a">{faq.a}</div>
        </div>
      ))}
    </div>
  );
}

// ── DayTourContent ────────────────────────────────────────────────────────────

export default function DayTourContent() {
  const [activePass, setActivePass] = useState<PassData | null>(null);

  return (
    <>
      {/* ── Passes ── */}
      <section className="passes-section">
        <p className="s-eyebrow">Day Pass Pricing</p>
        <h2 className="s-title">Choose your <em>pass.</em></h2>

        <div className="passes-grid">
          {PASS_DATA.map((pass, i) => (
            <div
              key={pass.key}
              className="pass-card"
              style={{ position: 'relative' }}
              onClick={() => setActivePass(pass)}
            >
              {i === 1 && (
                <span style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--c-brand)',
                  color: 'var(--c-ink)',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  borderRadius: 100,
                  whiteSpace: 'nowrap',
                }}>
                  Most Popular
                </span>
              )}

              <div className="pass-card-top">
                <div className="pass-icon">
                  <PassIcon name={pass.iconName} size={28} />
                </div>
                <div className="pass-price">
                  {pass.pricing[2].price}
                  <small> / {pass.unit}</small>
                </div>
                <div className="pass-name">{pass.name}</div>
              </div>

              <div className="pass-card-body">
                <ul className="pass-includes">
                  {pass.includes.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="pass-note">{pass.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
          <a
            href="https://m.me/AlmejaAzulResort"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand"
          >
            Confirm My Visit on Messenger
          </a>
          <a href="tel:+63" className="btn-outline-brand">
            <IconPhone size={14} /> Call Us
          </a>
          <p style={{ fontSize: 12, color: 'rgba(26,37,48,0.45)', fontWeight: 300 }}>
            Walk-ins always welcome · No reservation required
          </p>
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section className="addons-section">
        <p className="s-eyebrow">Activities & Extras</p>
        <h2 className="s-title">More to <em>do.</em></h2>

        <div className="addons-grid">
          {ADDONS.map(({ Icon, name, price, desc }) => (
            <div key={name} className="addon-tile">
              <div className="addon-icon">
                <Icon size={24} />
              </div>
              <div className="addon-name">{name}</div>
              <div className="addon-price">{price}</div>
              <p className="addon-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Schedule ── */}
      <section className="schedule-section">
        <p className="s-eyebrow-light">Sample Day</p>
        <h2 className="s-title-light">A perfect <em>day</em> at Almeja.</h2>

        <div className="schedule-grid">
          <div className="timeline">
            {TIMELINE.map(({ Icon, time, act, note }) => (
              <div key={time} className="tl-item">
                <div className="tl-dot">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="tl-time">{time}</p>
                  <p className="tl-act">{act}</p>
                  <p className="tl-note">{note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="schedule-img-stack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80"
              alt="Beach at Almeja Azul"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&q=80"
              alt="Infinity pool"
            />
          </div>
        </div>
      </section>

      {/* ── Corporate CTA strip ── */}
      <div style={{
        background: 'var(--c-teal)',
        padding: '56px 72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--c-brand)', marginBottom: 8 }}>
            Groups & Organizations
          </p>
          <h3 style={{ fontFamily: 'var(--ff-s)', fontSize: 'clamp(26px,3vw,42px)', fontWeight: 300, color: '#fff', lineHeight: 1.1 }}>
            Day retreats &amp; <em style={{ fontStyle: 'italic', color: 'var(--c-brand)' }}>corporate packages</em>
          </h3>
        </div>
        <a href="/build" className="btn-brand" style={{ flexShrink: 0 }}>
          Plan a Group Day →
        </a>
      </div>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <p className="s-eyebrow">FAQ</p>
        <h2 className="s-title">Good <em>questions.</em></h2>
        <FAQAccordion faqs={FAQS} />
      </section>

      {/* ── Pass Modal ── */}
      {activePass && (
        <PassModal pass={activePass} onClose={() => setActivePass(null)} />
      )}
    </>
  );
}
