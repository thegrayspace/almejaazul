'use client';

import { useEffect, useRef } from 'react';
import OptimizedImage from './OptimizedImage';
import { resortImages } from '@/lib/image-assets';

export default function MangroveSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const bg = bgRef.current;
      if (!bg) return;
      const section = bg.closest('.mangrove') as HTMLElement | null;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const pct = rect.top / window.innerHeight;
      bg.style.transform = `translateY(${pct * -60}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="mangrove">
      <div className="mg-bg" ref={bgRef}>
        <OptimizedImage src={resortImages.mangrove} alt="" fill sizes="100vw" className="mg-bg-img" />
      </div>
      <div className="mg-vgn" />
      <div className="mg-content">
        <span className="s-eyebrow-light">The Mangrove Sanctuary</span>
        <h2 className="mg-title">Where the<br />forest <em>meets</em> the sea</h2>
        <p className="mg-desc">
          Almeja Azul&apos;s mangrove edge is a living ecosystem — ancient root systems, still water,
          and light that filters like no other. Walk the boardwalk at dawn. Kayak through the canopy.
          Breathe.
        </p>
        <div className="mg-pills">
          <span className="mg-pill">Boardwalk Trail</span>
          <span className="mg-pill">Kayaking</span>
          <span className="mg-pill">Sunrise Guided Walks</span>
          <span className="mg-pill">Eco-Photography</span>
          <span className="mg-pill">Nature Immersion</span>
        </div>
      </div>
    </section>
  );
}
