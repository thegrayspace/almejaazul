'use client';

import { useState, useEffect } from 'react';
import { useInquiry } from './InquiryModal';

interface Item {
  id: number | string;
  tag: string;
  name: string;
  sub?: string;
  cap?: string;
  price: string;
  priceSub?: string;
  img: string;
  mImg?: string;
  desc: string;
  amenities: string[];
  note?: string;
  layoutSize?: string;
}

function Modal({ item, onClose }: { item: Item; onClose: () => void }) {
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

  const priceLabel = item.priceSub !== undefined ? 'Starting From' : 'Room Rate';
  const priceSub = item.priceSub !== undefined ? item.priceSub : '/night';

  return (
    <div
      className={`mOverlay${on ? ' on' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="m-gallery">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.mImg || item.img} alt={item.name} />
          <button className="m-close" onClick={onClose}>✕</button>
        </div>
        <div className="m-body">
          <p className="m-tag">{item.tag}{item.cap ? ` · ${item.cap}` : ''}</p>
          <h2 className="m-name">{item.name}</h2>
          <p className="m-meta">Almeja Azul · Brgy. Adecor, Samal Island</p>
          <div className="m-hr" />
          <p className="m-desc">{item.desc}</p>
          <div className="m-amenities">
            {item.amenities.map(a => <div key={a} className="m-amen-item">{a}</div>)}
          </div>
          <div className="m-price-box">
            <div className="m-price-label">{priceLabel}</div>
            <div className="m-price-val">
              {item.price}<small>{priceSub || ' / night'}</small>
            </div>
          </div>
          {item.note && <p className="m-note">{item.note}</p>}
          <div className="m-ctas">
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="m-book">
              Reserve via Facebook Messenger
            </a>
            <a href="tel:09993088800" className="m-book-fb">Call · 0999 308 8800</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const ROOMS: Item[] = [
  { id: 1, tag: 'Romantic · For Two', name: 'Seaside Room', sub: 'Aircon · Sea-Facing · Queen Bed', price: '₱2,950', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85', mImg: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=90', cap: 'Good for 2', desc: 'A quietly designed aircon room steps from both beach fronts. White linens, morning light off the Davao Gulf, and the sound of waves at the window.', amenities: ['Aircon', 'Queen bed', 'Private bathroom', 'Sea-facing window', 'Beach access (both fronts)', 'Infinity pool access', 'Complimentary towels', 'Daily housekeeping', 'High-speed fiber WiFi', 'In-room coffee setup'], note: 'Day tour add-on: ₱200/pax · Pool +₱100 per additional guest', layoutSize: 'feature' },
  { id: 2, tag: 'Family · For Four', name: 'Family Room', sub: 'Aircon · Garden View · 2 Beds', price: '₱4,950', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=85', mImg: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1400&q=90', cap: 'Good for 4', desc: "Generous and well-appointed for families ready to reconnect. Set within the resort's 5-hectare grounds, this room opens toward the garden with easy beach and infinity pool access.", amenities: ['Aircon', '2 beds', 'Private bathroom', 'Garden view', 'Beach access (both fronts)', 'Infinity pool access', 'Complimentary towels', 'Daily housekeeping', 'High-speed fiber WiFi', 'Pet-friendly'], note: 'Pets welcome · Extra bedding available on request', layoutSize: 'default' },
  { id: 3, tag: 'Group · For Six', name: 'Group Suite', sub: 'Aircon · Mangrove Views · Multiple Beds', price: '₱5,000', img: 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=900&q=85', mImg: 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=1400&q=90', cap: 'Good for 6', desc: 'Ideal for barkada trips and extended families. A spacious, well-lit room nestled between the beach and the mangrove forest — nature in every direction.', amenities: ['Aircon', 'Multiple beds', 'Private bathroom', 'Mangrove edge views', 'Beach access (both fronts)', 'Infinity pool access', 'High-speed fiber WiFi', 'Function room access', 'Van transfer available', 'Outdoor recreation access'], note: 'Van transfer from Babak Ferry Terminal available on request', layoutSize: 'default' },
  { id: 4, tag: 'Extended · For Eight', name: 'Extended Room', sub: 'Aircon · Full Property Access', price: '₱7,000', img: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=900&q=85', mImg: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=1400&q=90', cap: 'Good for 8', desc: 'For groups that need room to spread out. This configuration gives eight guests full access to both beach fronts, the infinity pool, and all on-site recreation.', amenities: ['Aircon', 'Multiple beds', 'Private bathrooms', 'Full beach access', 'Infinity pool', 'All recreation facilities', 'High-speed fiber WiFi', 'Priority water sports booking', 'Van transfer available', 'Function room option'], note: 'Water sports included in stay pricing during regular season', layoutSize: 'wide' },
  { id: 5, tag: 'Grand · For Twelve', name: 'Grand Estate Room', sub: 'Aircon · Full Butler · Events Ready', price: '₱8,000', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=85', mImg: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=90', cap: 'Good for 12', desc: "The resort's grandest accommodation — made for family reunions, group celebrations, and gatherings that deserve a proper setting.", amenities: ['Aircon throughout', 'Multiple rooms', 'Full private bathrooms', 'Both beach fronts exclusive', 'Infinity pool priority', 'All water sports', 'Function Hall access', "Chef's dining option", 'Van transfer included', 'Dedicated host'], note: 'Best for reunions, milestone celebrations, and private buyouts', layoutSize: 'wide' },
];

const SPACES: Item[] = [
  { id: 'fh', tag: 'Events', name: 'Function Hall', cap: 'Up to 100 guests', price: '₱5,000', priceSub: '/half day · ₱8,000/full', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80', desc: 'The main event venue at Almeja Azul — a fully air-conditioned hall with natural light and direct access to the beach lawns. Ideal for corporate gatherings, family reunions, birthday celebrations, and team kick-offs.', amenities: ['Air-conditioned', 'Projector & screen', 'Sound system', '100-person capacity', 'Staging area', 'Bridal / green room', 'Lawn overflow space', 'High-speed WiFi', 'Beach access', 'Catering coordination'], note: 'Rates vary by event type and catering requirements' },
  { id: 'mr', tag: 'Corporate', name: 'Meeting Room', cap: 'Up to 20 persons', price: '₱2,500', priceSub: '/half day · ₱4,500/full', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80', desc: 'A quiet, well-designed meeting room for productive sessions with a beach view. High-speed fiber, whiteboard, and video conferencing setup. The room where island decisions get made.', amenities: ['Aircon', '20-person capacity', '4K display screen', 'Fiber WiFi (dedicated)', 'Whiteboard & markers', 'Video conferencing ready', 'Coffee & water station', 'Natural light', 'Soundproofed', 'Stationery on request'], note: 'Half-day (AM or PM) and full-day rates available' },
  { id: 'cc1', tag: 'Intimate', name: 'Coastal Cabana A', cap: 'Up to 10 guests', price: '₱1,500', priceSub: '/session', img: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=700&q=80', desc: 'An open-air beachside cabana — perfect for small celebrations, company breakouts, or family gatherings by the water. Shaded, breezy, and steps from the shore.', amenities: ['Beachside location', '10-person seating', 'Shade & ventilation', 'Beach access', 'Power outlets', 'Basic AV on request', 'Food & drinks service', 'Sunrise / sunset views'], note: 'Ideal for breakout sessions, private dining, and small celebrations' },
  { id: 'cc2', tag: 'Intimate', name: 'Coastal Cabana B', cap: 'Up to 10 guests', price: '₱1,500', priceSub: '/session', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', desc: 'Sister cabana to Cabana A, positioned further along the beach for maximum privacy. The same open-air experience with a more secluded aspect — ideal when groups want separation or simultaneous breakout spaces.', amenities: ['Secluded beachside location', '10-person seating', 'Natural ventilation', 'Beach access', 'Power outlets', 'Food & drinks service', 'Mangrove-adjacent view', 'Sunrise lighting'], note: 'Can be combined with Cabana A for larger groups of 20' },
  { id: 'mp', tag: 'Vendor / Pop-up', name: 'Marketplace Area', cap: 'Flexible', price: 'Inquire', priceSub: '', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80', desc: 'A flexible open-air zone designed for pop-up markets, vendor showcases, and artisan fairs. The ideal space for branded activations, resort-wide events, and lifestyle collaborations on the island.', amenities: ['Open-air flexible layout', 'Power connections', 'Shade structures available', 'High foot traffic location', 'WiFi coverage', 'Event lighting available', 'Adjacent parking', 'Setup support'], note: 'Great for brand activations, bazaars, and island pop-up events' },
  { id: 'bp', tag: 'Waterfront', name: 'Beach Pavilion', cap: 'Up to 40 guests', price: '₱3,500', priceSub: '/event', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80', desc: 'An alfresco event space on the beach itself — open to the sky, the breeze, and the sound of the Davao Gulf. Perfect for sunset ceremonies, cocktail receptions, and beachside dinners.', amenities: ['Beachfront location', '40-person capacity', 'String lighting', 'Sound system (portable)', 'Seaside dining setup', 'Sunset-facing', 'Bonfire option', 'Catering coordination', 'Barefoot-optional', 'Photographer-friendly'], note: 'Popular for sunset elopements and intimate wedding ceremonies' },
];

interface StayGridProps {
  rooms?: Item[];
  spaces?: Item[];
}

export default function StayGrid({ rooms: roomsProp, spaces: spacesProp }: StayGridProps = {}) {
  const [selected, setSelected] = useState<Item | null>(null);
  const { open } = useInquiry();

  const roomList = roomsProp ?? ROOMS;
  const spaceList = spacesProp ?? SPACES;

  return (
    <>
      {/* ROOMS SECTION */}
      <section className="rooms-section">
        <div className="rooms-hd">
          <div>
            <p className="s-eyebrow">Accommodations</p>
            <h2 className="s-title">Our <em>Rooms</em></h2>
          </div>
          <div className="rooms-hd-right">
            <p className="s-body">
              Aircon rooms for 2 to 12 guests. All with full beach access, infinity pool, and
              high-speed fiber WiFi. Click any room to see full details and book.
            </p>
            <br />
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="btn-outline-brand">
              Check Availability
            </a>
          </div>
        </div>

        <div className="rooms-grid">
          {roomList.map((r) => (
            <div
              key={r.id}
              className={`rc rpl${r.layoutSize === 'feature' ? ' feature' : r.layoutSize === 'wide' ? ' wide' : ''}`}
              onClick={() => setSelected(r)}
            >
              <div style={{ overflow: 'hidden', position: 'relative', flex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="rc-img" src={r.img} alt={r.name} loading="lazy" />
              </div>
              <div className="rc-body" style={{ flex: r.layoutSize === 'feature' ? '0 0 auto' : 'unset' }}>
                <p className="rc-tag">{r.tag}</p>
                <h3 className="rc-name">{r.name}</h3>
                <p className="rc-sub">{r.sub}</p>
                <div className="rc-foot">
                  <div className="rc-price">{r.price}<small>/night</small></div>
                  <div className="rc-arr">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPACES SECTION */}
      <section className="spaces-section" id="spaces">
        <div className="spaces-hd">
          <p className="s-eyebrow">Bookable Spaces</p>
          <h2 className="s-title">Venues &amp; <em>Event Areas</em></h2>
        </div>
        <div className="spaces-grid">
          {spaceList.map(s => (
            <div key={s.id} className="space-card rpl" onClick={() => setSelected(s)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.name} loading="lazy" />
              <div className="space-card-body">
                <p className="space-tag">{s.tag}</p>
                <h3 className="space-name">{s.name}</h3>
                <p className="space-cap">{s.cap}</p>
                <div className="space-foot">
                  <div className="space-price">{s.price}<small> {s.priceSub}</small></div>
                  <div className="rc-arr">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING PUSH */}
      <div className="booking-push">
        <div className="bp-text">
          <h2>Ready to <em>reserve?</em></h2>
          <p>Message us on Facebook or call for the fastest response. We confirm same-day.</p>
        </div>
        <div className="bp-actions">
          <a
            href="https://m.me/AlmejaAzulResort"
            target="_blank"
            rel="noopener noreferrer"
            className="bp-messenger"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.869 1.37 5.43 3.519 7.129V22l3.206-1.747c.857.234 1.765.36 2.705.36 5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2z" />
            </svg>
            Message on Messenger
          </a>
          <button className="btn-outline" onClick={() => open('Room Reservation')}>
            Send an Inquiry
          </button>
          <a href="tel:09993088800" className="btn-outline" style={{ textAlign: 'center' }}>
            Call · 0999 308 8800
          </a>
        </div>
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
