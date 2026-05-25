import type { Metadata } from 'next';
import '@/styles/pages/see.css';
import SeeContent from '@/components/public/SeeContent';

export const metadata: Metadata = {
  title: 'See & Explore',
  description: 'Island tours, reef snorkeling, mangrove kayaking, and natural wonders around Samal Island from Almeja Azul.',
};

export default function SeePage() {
  return (
    <>
      <section className="see-hero">
        <div className="see-hero-bg" />
        <div className="see-hero-vgn" />
        <div className="see-hero-content">
          <p className="eyebrow">Island Experiences</p>
          <h1 className="s-title-light">Beyond the <em>shore.</em></h1>
          <p className="sub">Island tours, reef snorkeling, mangrove kayaking, and the natural wonders of Samal — from the resort, all the way out.</p>
        </div>
      </section>
      <SeeContent />
    </>
  );
}
