import type { Metadata } from 'next';
import '@/styles/pages/fun.css';
import FunContent from '@/components/public/FunContent';

export const metadata: Metadata = {
  title: 'Fun & Recreation',
  description: 'Water sports, pickleball, kayaking, snorkeling, banana boat, pool, and beach recreation at Almeja Azul on Samal Island.',
};

export default function FunPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530053969600-caed2596d242?w=2000&q=85')" }} />
        <div className="page-hero-vgn" />
        <div className="page-hero-content">
          <p className="hero-eyebrow">Recreation</p>
          <h1 className="s-title-light">Sports &amp; <em>Play</em></h1>
          <p>Water sports, courts, pool, and beach — everything moving, all day long.</p>
        </div>
      </section>
      <FunContent />
    </>
  );
}
