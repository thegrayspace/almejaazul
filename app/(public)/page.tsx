import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/pages/home.css';
import MangroveSection from '@/components/public/MangroveSection';
import { IconBolt, IconUmbrella, IconWaves, IconCottage, IconPaw, IconPhone } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Almeja Azul — LYR Beach Resort · Samal Island',
  description:
    'Five hectares of coastline, mangrove forest, and Davao Gulf light. Two beach fronts. High-speed fiber. One unhurried pace of life.',
};

const SECTIONS = [
  { label: 'Stay', sub: 'Rooms & Spaces', href: '/stay', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' },
  { label: 'Day Tour', sub: 'Swim & Dine', href: '/day-tour', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { label: 'Fun', sub: 'Recreation', href: '/fun', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80' },
  { label: 'Build', sub: 'Corporate & Events', href: '/build', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80' },
  { label: 'See', sub: 'Tours & Nature', href: '/see', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
];

const FB_UPDATES = [
  { date: 'April 2026', text: 'Summer is in full swing at Almeja Azul — pool, beaches, and all water sports open daily. Book your stay or day tour now!' },
  { date: 'March 2026', text: 'Our Coastal Cabanas are now bookable for intimate gatherings and corporate breakout sessions. Limited slots — message us to reserve.' },
  { date: 'Feb 2026', text: 'New: Giant Chess, Cornhole, and upgraded Pickleball courts now open to all guests. Tournaments coming soon!' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-vgn" />
        <div className="hero-content">
          <p className="hero-eyebrow">Brgy. Adecor · Samal Island · Davao del Norte</p>
          <h1 className="hero-title">
            <span className="ln"><span className="lni">White sand.</span></span>
            <span className="ln"><span className="lni">Open sea.</span></span>
            <span className="ln"><span className="lni">Always on.</span></span>
          </h1>
          <p className="hero-sub">
            Five hectares of coastline, mangrove forest, and Davao Gulf light. Two beach fronts.
            High-speed fiber. One unhurried pace of life.
          </p>
          <div className="hero-acts">
            <Link href="/stay" className="btn-brand rpl">Book Your Stay</Link>
            <Link href="/day-tour" className="btn-outline">Day Tour · From ₱200</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* STRIP */}
      <div className="strip">
        <div className="strip-quote">
          <p>
            A five-hectare coastal property where <em>white sand beaches</em>, mangrove calm,
            and the open Davao Gulf converge. The rare kind of place where you don&apos;t have to choose.
          </p>
        </div>
        <div className="strip-stats">
          <div className="stat"><div className="n">5</div><div className="l">Hectares</div></div>
          <div className="stat"><div className="n">2</div><div className="l">Beach Fronts</div></div>
          <div className="stat"><div className="n">1G</div><div className="l">Fiber WiFi</div></div>
          <div className="stat"><div className="n">∞</div><div className="l">Pool Access</div></div>
        </div>
      </div>

      {/* WIFI CALLOUT */}
      <div className="wifi-bar">
        <span className="wifi-icon"><IconBolt size={20} /></span>
        <span className="wifi-text">
          Now featuring <strong>High-Speed Fiber Internet</strong> across all rooms, event spaces,
          and common areas — stay connected while you unwind.
        </span>
        <div className="wifi-badge">1 Gbps Available</div>
      </div>

      {/* SECTION HUB */}
      <section className="hub">
        <div className="hub-hd">
          <div>
            <p className="s-eyebrow">Explore</p>
            <h2 className="s-title">Everything<br /><em>Almeja Azul</em></h2>
          </div>
          <p className="hub-desc">
            From overnight stays to island tours, team-building retreats to day passes — one island,
            infinite reasons to come.
          </p>
        </div>
        <div className="hub-grid">
          {SECTIONS.map(s => (
            <Link key={s.label} href={s.href} className="hub-card rpl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hub-card-img" src={s.img} alt={s.label} loading="lazy" />
              <div className="hub-card-overlay" />
              <div className="hub-card-body">
                <p className="hub-card-label">{s.sub}</p>
                <p className="hub-card-name">{s.label}</p>
                <div className="hub-card-arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MANGROVE SANCTUARY — client component for parallax */}
      <MangroveSection />

      {/* EVENTS TEASER */}
      <div className="events">
        <Link href="/build#weddings" className="event-half">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85" alt="Destination Weddings" />
          <div className="event-vgn" />
          <div className="event-body">
            <p className="event-tag">Destination Wedding</p>
            <h3 className="event-name">Vow by<br />the Sea</h3>
            <p className="event-sub">Seaside ceremonies &amp; mangrove pavilion receptions.</p>
            <span className="event-link">Explore Venues →</span>
          </div>
        </Link>
        <Link href="/build#corporate" className="event-half">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=85" alt="Corporate Retreats" />
          <div className="event-vgn" />
          <div className="event-body">
            <p className="event-tag">Corporate Retreat</p>
            <h3 className="event-name">Offsite,<br /><em>Elevated</em></h3>
            <p className="event-sub">Function hall, meeting room, team-building, and beaches.</p>
            <span className="event-link">Plan Your Retreat →</span>
          </div>
        </Link>
      </div>

      {/* DAY TOUR TEASER */}
      <section className="dt-section">
        <div className="dt-hd">
          <div>
            <p className="s-eyebrow">The Day Pass</p>
            <h2 className="s-title">No overnight<br />stay <em>required.</em></h2>
          </div>
          <Link href="/day-tour" className="btn-dark">Full Day Tour Info →</Link>
        </div>
        <div className="dt-tiles">
          <div className="dt-tile">
            <div className="dt-tile-icon"><IconUmbrella size={32} /></div>
            <div className="dt-tile-price">₱200</div>
            <div className="dt-tile-name">Seaside Day Pass</div>
            <div className="dt-tile-sub">Beach access · Both fronts · All day</div>
            <div className="dt-tile-note">Per person</div>
          </div>
          <div className="dt-tile">
            <div className="dt-tile-icon"><IconWaves size={32} /></div>
            <div className="dt-tile-price">₱300</div>
            <div className="dt-tile-name">Beach + Pool</div>
            <div className="dt-tile-sub">Infinity pool + beach access</div>
            <div className="dt-tile-note">Per person</div>
          </div>
          <div className="dt-tile">
            <div className="dt-tile-icon"><IconCottage size={32} /></div>
            <div className="dt-tile-price">₱300</div>
            <div className="dt-tile-name">Cottage Rental</div>
            <div className="dt-tile-sub">Shaded beachside cottage · Full day</div>
            <div className="dt-tile-note">Per cottage</div>
          </div>
          <div className="dt-tile">
            <div className="dt-tile-icon"><IconPaw size={32} /></div>
            <div className="dt-tile-price">Always</div>
            <div className="dt-tile-name">Pet-Friendly</div>
            <div className="dt-tile-sub">Bring the whole family — pets welcome</div>
            <div className="dt-tile-note">Open daily</div>
          </div>
        </div>
      </section>

      {/* FACEBOOK SECTION */}
      <section className="fb-section">
        <div className="fb-left">
          <p className="s-eyebrow-light">Stay Connected</p>
          <h2 className="s-title-light">Latest on<br /><em>Facebook</em></h2>
          <p>
            For the most current room availability, event announcements, promos, and booking
            confirmations — everything happens on our Facebook page. Message us directly to reserve.
          </p>
          <div className="fb-actions">
            <a href="https://www.facebook.com/AlmejaAzulResort/" target="_blank" rel="noopener noreferrer" className="fb-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Follow on Facebook
            </a>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="fb-messenger">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.869 1.37 5.43 3.519 7.129V22l3.206-1.747c.857.234 1.765.36 2.705.36 5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2z" />
              </svg>
              Message Us on Messenger
            </a>
            <a href="tel:09993088800" className="fb-phone">
              <IconPhone size={15} /> Call · 0999 308 8800
            </a>
          </div>
        </div>

        <div className="fb-right">
          <div className="fb-right-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/Almeja_Logo_Large_PNG.png" alt="Almeja Azul" />
            <div>
              <div className="fb-page-name">Almeja Azul Resort</div>
              <div className="fb-page-handle">@AlmejaAzulResort</div>
            </div>
          </div>
          {FB_UPDATES.map((u, i) => (
            <div key={i} className="fb-update">
              <p className="fb-update-date">{u.date}</p>
              <p className="fb-update-text">{u.text}</p>
            </div>
          ))}
          <a
            href="https://www.facebook.com/AlmejaAzulResort/"
            target="_blank"
            rel="noopener noreferrer"
            className="fb-see-more"
          >
            View all updates on Facebook →
          </a>
        </div>
      </section>
    </>
  );
}
