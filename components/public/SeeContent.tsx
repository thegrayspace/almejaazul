'use client';

import { useState, useEffect } from 'react';
import { useInquiry } from './InquiryModal';

export interface TourItem {
  id: string;
  tag: string;
  name: string;
  desc: string;
  price: string;
  img: string;
  duration: string;
  mImg: string;
}

const DEFAULT_TOURS: TourItem[] = [
  { id: '1', tag: 'Island Experience', name: 'Samal Island Tour', desc: 'The full picture of Samal — caves, white sand coves, mangrove boardwalks, and local fishing villages. A guided full-day circuit of what makes the island worth the crossing.', price: 'Inquire for rates', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&q=80', duration: 'Full Day', mImg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90' },
  { id: '2', tag: 'Aquatic Experience', name: 'Reef & Snorkel Tour', desc: 'Guided snorkeling over the reefs of Samal. Equipment included. Multiple reef sites, species briefing, and a surface guide throughout.', price: '₱500/person', img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=700&q=80', duration: 'Half Day', mImg: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=90' },
  { id: '3', tag: 'Sunrise Experience', name: 'Mangrove Kayak at Dawn', desc: "A guided kayak through the resort's mangrove sanctuary at first light. One of the quieter, more unforgettable ways to experience Samal — nature at its most undisturbed.", price: 'Inquire for rates', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', duration: '2–3 Hours', mImg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90' },
  { id: '4', tag: 'Cultural Experience', name: 'Davao City Day Tour', desc: "From the resort, cross back to Davao City for a curated circuit of the city's best: local markets, Durian experience, cultural landmarks, and street food.", price: 'Inquire for rates', img: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=700&q=80', duration: 'Full Day', mImg: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=1200&q=90' },
  { id: '5', tag: 'Overnight Experience', name: 'Talicud Island Overnight', desc: 'Ferry across to Talicud — a smaller, quieter island off Samal with powdery white sand, minimal infrastructure, and maximum disconnect. Camping and simple beach accommodations.', price: 'Inquire for rates', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80', duration: 'Overnight', mImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90' },
  { id: '6', tag: 'Aerial Experience', name: 'Samal from Above', desc: 'Book a helicopter or light aircraft tour over Samal and the Davao Gulf — seeing the island, its coastlines, the nearby islands, and the city from altitude. Bookable on request.', price: 'Inquire for rates', img: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=700&q=80', duration: '45 – 90 Min', mImg: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=1200&q=90' },
];

const NATURE_SPOTS = [
  { tag: 'Reef', name: 'Samal Reef Systems', desc: 'Multiple reef systems around the island — some accessible by swim, most by boat. Best visibility in the early morning before afternoon winds.', img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80' },
  { tag: 'Forest', name: 'Hagimit Falls Area', desc: "Inland waterfalls and secondary forest in the island's protected zones. A contrast to the beach that surprises most first-time visitors.", img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' },
  { tag: 'Mangrove', name: 'Almeja Mangrove Edge', desc: "The resort's own mangrove sanctuary — boardwalk trail at the property's southern boundary. Kayak access at dawn.", img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { tag: 'Coast', name: 'Kaputian Beach', desc: "Samal's longest stretch of sand — a 20-minute drive from the resort. Good for sunset walks and open-water swimming.", img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
];

type Tour = TourItem;

function TourModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [on, setOn] = useState(false);
  const { open } = useInquiry();

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
          <img src={tour.mImg || tour.img} alt={tour.name} />
          <button className="m-close" onClick={onClose}>✕</button>
        </div>
        <div className="m-body">
          <p className="m-tag">{tour.tag}</p>
          <h2 className="m-name">{tour.name}</h2>
          <p className="m-meta">Duration: {tour.duration} · Almeja Azul, Samal Island</p>
          <div className="m-hr" />
          <p className="m-desc">{tour.desc}</p>
          <div className="m-price-box">
            <div className="m-price-label">Tour Rate</div>
            <div className="m-price-val">{tour.price}</div>
          </div>
          <div className="m-ctas">
            <a
              href="https://m.me/AlmejaAzulResort"
              target="_blank"
              rel="noopener noreferrer"
              className="m-book"
            >
              Book via Facebook Messenger
            </a>
            <button className="m-book-fb" onClick={() => { onClose(); open('Island Tour'); }}>
              Send an Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeeContent({ tours: dbTours }: { tours?: TourItem[] }) {
  const TOURS = (dbTours && dbTours.length > 0) ? dbTours : DEFAULT_TOURS;
  const [selected, setSelected] = useState<Tour | null>(null);
  const { open } = useInquiry();

  return (
    <>
      {/* TOURS SECTION */}
      <section className="tours-section">
        <p className="s-eyebrow">Island Experiences</p>
        <h2 className="s-title">Tours &amp; <em>Excursions</em></h2>
        <div className="tours-grid">
          {TOURS.map(tour => (
            <div key={tour.id} className="tour-card" onClick={() => setSelected(tour)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="tour-img" src={tour.img} alt={tour.name} loading="lazy" />
              <div className="tour-body">
                <p className="tour-tag">{tour.tag}</p>
                <h3 className="tour-name">{tour.name}</h3>
                <p className="tour-desc">{tour.desc}</p>
                <div className="tour-foot">
                  <div className="tour-price">{tour.price}</div>
                  <div className="tour-arr">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAMAL INTRO SECTION */}
      <section className="samal-section">
        <p className="s-eyebrow">The Island</p>
        <h2 className="s-title">Samal Island, <em>Philippines</em></h2>
        <p className="s-body">
          Samal Island sits 10 minutes by ferry from Davao City — one of the most biodiverse island ecosystems in Mindanao. Almeja Azul occupies five hectares of its coastline.
        </p>
        <div className="samal-imgs">
          {TOURS.slice(0, 4).map(t => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={t.id} src={t.img} alt={t.name} loading="lazy" />
          ))}
        </div>
      </section>

      {/* NATURE SECTION */}
      <section className="nature-section">
        <p className="s-eyebrow">Natural Wonders</p>
        <h2 className="s-title">The Island Beyond <em>the Resort</em></h2>
        <div className="nature-grid">
          {NATURE_SPOTS.map(spot => (
            <div key={spot.name} className="nature-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spot.img} alt={spot.name} loading="lazy" />
              <div className="nature-body">
                <p className="nature-tag">{spot.tag}</p>
                <h3 className="nature-name">{spot.name}</h3>
                <p className="nature-desc">{spot.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="see-cta">
        <h2>Plan your <em>escape.</em></h2>
        <p>Start with a tour inquiry and we&#39;ll put together an itinerary around your stay — island circuits, reef dives, or a simple day on the water.</p>
        <div className="see-cta-actions">
          <a
            href="https://m.me/AlmejaAzulResort"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand"
          >
            Message on Messenger →
          </a>
          <button className="btn-outline-brand" onClick={() => open('Island Tour')}>
            Send an Inquiry
          </button>
        </div>
      </section>

      {selected && <TourModal tour={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
