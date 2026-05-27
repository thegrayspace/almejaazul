'use client';

import {
  IconSnorkel,
  IconKayak,
  IconBananaBoat,
  IconPickleball,
  IconPool,
  IconLeaf,
  IconDining,
} from '@/components/icons';

export interface ActivityItem {
  id: string;
  cat: string;
  name: string;
  sub: string;
  img: string;
  pill: string;
  status: 'active' | 'request';
}

const DEFAULT_SPORTS: ActivityItem[] = [
  { id: '1', cat: 'Water Sport', name: 'Banana Boat', sub: 'Davao Gulf thrills — up to 8 riders', img: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=700&q=80', pill: '₱300/ride', status: 'active' },
  { id: '2', cat: 'Water Sport', name: 'Jet Ski', sub: 'Open water on the Davao Gulf', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&q=80', pill: 'Inquire', status: 'active' },
  { id: '3', cat: 'Court Sport', name: 'Pickleball', sub: '3 courts · Equipment provided', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=700&q=80', pill: '+₱150/session', status: 'active' },
  { id: '4', cat: 'Water Activity', name: 'Snorkeling', sub: 'Reef access · Equipment for rent', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&q=80', pill: '₱200', status: 'active' },
  { id: '5', cat: 'Water Activity', name: 'Kayaking', sub: 'Mangrove edge & coastline', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', pill: 'On Request', status: 'active' },
  { id: '6', cat: 'Coming Soon', name: 'Paddleboard', sub: 'Calm water sessions', img: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=700&q=80', pill: 'On Request', status: 'request' },
  { id: '7', cat: 'Coming Soon', name: 'Beach Volleyball', sub: 'Full court · Team play', img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=700&q=80', pill: 'Coming Soon', status: 'request' },
];

const WATER = [
  { name: 'Snorkeling', Icon: IconSnorkel, sub: 'Reef access off both beach fronts. Rental equipment at the sports desk.', price: 'Equipment: ₱200/session', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&q=80' },
  { name: 'Kayaking', Icon: IconKayak, sub: 'Single and double kayaks. Paddle the mangrove edge or explore the coast.', price: 'On Request', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80' },
  { name: 'Banana Boat', Icon: IconBananaBoat, sub: "Up to 8 riders. The most fun you'll have with strangers. Lifeguard on duty.", price: '₱300/ride', img: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=700&q=80' },
];

const LEISURE = [
  { Icon: IconPickleball, name: 'Pickleball', desc: '3 full courts with equipment provided. Clinics and casual play available daily.', avail: '3 Courts Available' },
  { Icon: IconPool, name: 'Infinity Pool', desc: 'Saltwater-feel infinity pool overlooking the beach. Open to all guests.', avail: 'Always Open' },
  { Icon: IconLeaf, name: 'Mangrove Walk', desc: 'Boardwalk trail through the mangrove sanctuary at the resort edge.', avail: 'Dawn to Dusk' },
  { Icon: IconDining, name: 'Beach Restaurant', desc: 'Filipino classics and fresh seafood, right on the sand. Open to day guests.', avail: 'Open Daily' },
];

export default function FunContent({ activities: dbActivities }: { activities?: ActivityItem[] }) {
  const SPORTS = (dbActivities && dbActivities.length > 0) ? dbActivities : DEFAULT_SPORTS;

  return (
    <>
      {/* SPORTS SECTION */}
      <section className="sports-section">
        <p className="s-eyebrow">Recreation</p>
        <h2 className="s-title">Sports &amp; <em>Adventure</em></h2>
        <div className="sports-hd">
          <div>
            <p className="s-eyebrow">Recreation</p>
            <h2 className="s-title">Sports &amp; <em>Adventure</em></h2>
          </div>
          <p className="sports-desc">
            Seven active sports and a full water activity program — this is the side of Almeja Azul that never sits still.
          </p>
        </div>

        <div className="sports-grid">
          {SPORTS.map(sport => (
            <div key={sport.id} className="sport-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="sport-img" src={sport.img} alt={sport.name} loading="lazy" />
              <div className="sport-overlay" />
              <div className="sport-body">
                <p className="sport-cat">{sport.cat}</p>
                <h3 className="sport-name">{sport.name}</h3>
                <p className="sport-sub">{sport.sub}</p>
                <div className="sport-pill">{sport.pill}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WATER SECTION */}
      <section className="water-section">
        <p className="s-eyebrow-light">Water Activities</p>
        <h2 className="s-title-light">On the <em>Water</em></h2>
        <div className="water-grid">
          {WATER.map(w => (
            <div key={w.name} className="water-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.img} alt={w.name} loading="lazy" />
              <div className="water-card-body">
                <div className="water-card-icon">
                  <w.Icon size={28} />
                </div>
                <h3 className="water-card-name">{w.name}</h3>
                <p className="water-card-sub">{w.sub}</p>
                <div className="water-card-price">{w.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEISURE SECTION */}
      <section className="leisure-section">
        <p className="s-eyebrow">On Land</p>
        <h2 className="s-title">Leisure &amp; <em>Recreation</em></h2>
        <div className="leisure-list">
          {LEISURE.map(item => (
            <div key={item.name} className="leisure-item">
              <div className="leisure-icon">
                <item.Icon size={28} />
              </div>
              <h3 className="leisure-name">{item.name}</h3>
              <p className="leisure-desc">{item.desc}</p>
              <div className="leisure-avail">{item.avail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FUN CTA */}
      <div className="fun-cta">
        <div>
          <h2>Ready for <em>all of it?</em></h2>
          <p>Day pass or overnight — either way, everything here is yours. Water sports, courts, pool, beach, restaurant.</p>
        </div>
        <div className="fun-cta-actions">
          <a href="https://m.me/AlmejaAzulResort" className="btn-brand">Book Your Day →</a>
          <a href="/stay" className="btn-outline">See Rooms</a>
        </div>
      </div>
    </>
  );
}
