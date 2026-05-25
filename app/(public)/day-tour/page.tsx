import type { Metadata } from 'next';
import '@/styles/pages/day-tour.css';
import DayTourContent from '@/components/public/DayTourContent';

export const metadata: Metadata = {
  title: 'Day Tour',
  description: 'No overnight stay required. Two beach fronts, infinity pool, water sports, fresh food, and high-speed WiFi. Walk-ins welcome, pets welcome.',
};

export default function DayTourPage() {
  return (
    <>
      <section className="dt-hero">
        <div className="dt-hero-bg" />
        <div className="dt-hero-vgn" />
        <div className="dt-hero-content">
          <p className="eyebrow">The Day Pass · Open Daily · Walk-ins Welcome</p>
          <h1 className="s-title-light">Come for the <em>day.</em><br />Stay for the sunset.</h1>
          <p className="sub">No overnight stay required. Two beach fronts, an infinity pool, water sports, fresh food, and high-speed WiFi — all available to day visitors. Pets welcome.</p>
        </div>
      </section>
      <DayTourContent />
    </>
  );
}
