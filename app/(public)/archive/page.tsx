import '@/styles/pages/archive.css';
import { generateOgMetadata } from '@/lib/seo/og';

export const metadata = generateOgMetadata({
  title: 'Concepts & Archive',
  description:
    'Three concept explorations from the Almeja Azul design process — pickleball destination, Isla Vida Collective, and Virtual Samal.',
  path: '/archive',
});

const ISLA_SVCS = [
  'Island Living Consulting',
  'Remote Work Retreat Design',
  'Eco-Property Development Advisory',
  'Community Integration Programs',
  'Sustainable Tourism Frameworks',
];

const HOTSPOTS = [
  { x: '30%', y: '58%', label: 'Main Beach' },
  { x: '65%', y: '48%', label: 'Mangrove Edge' },
  { x: '50%', y: '35%', label: 'Infinity Pool' },
];

export default function ArchivePage() {
  return (
    <>
      {/* HERO */}
      <section className="arc-hero" style={{ paddingTop: 'calc(var(--nav-h) + 80px)' }}>
        <div className="arc-badge">Concepts · Archive · 2024–2026</div>
        <h1 className="arc-title">What could<br /><em>Almeja be?</em></h1>
        <p className="arc-sub">Three concept explorations from the design process — the projects that shaped what Almeja Azul is becoming.</p>
      </section>

      {/* PICKLEBALL */}
      <section className="pkl">
        <div className="pkl-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1800&q=70')" }} />
        <div className="pkl-inner">
          <div>
            <p className="s-label">Concept No. 01</p>
            <h2 className="s-title">The Pickleball <em>Project</em></h2>
            <p className="pkl-desc">A dedicated pickleball destination within Almeja Azul — resort-grade courts, clinics, tournaments, and a culture built around play. Samal&apos;s first dedicated pickleball venue.</p>
            <div className="pkl-feats">
              <div className="pkl-feat"><div className="pkl-feat-n">3</div><div className="pkl-feat-l">Full Courts</div></div>
              <div className="pkl-feat"><div className="pkl-feat-n">∞</div><div className="pkl-feat-l">Open Play</div></div>
              <div className="pkl-feat"><div className="pkl-feat-n">24</div><div className="pkl-feat-l">Max Players</div></div>
              <div className="pkl-feat"><div className="pkl-feat-n">01</div><div className="pkl-feat-l">On Samal</div></div>
            </div>
          </div>
          <div className="pkl-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pkl-img" src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=85" alt="Pickleball courts" />
            <div className="pkl-glass">
              <div className="gn">Live.</div>
              <div className="gl">Play · Compete · Rest</div>
            </div>
          </div>
        </div>
      </section>

      {/* ISLA VIDA */}
      <section className="isla">
        <div className="isla-imgs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="isla-img img-a" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=85" alt="Island living" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="isla-img" src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Resort" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="isla-img" src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" alt="Mangrove" />
        </div>
        <div>
          <p className="s-label">Concept No. 02</p>
          <h2 className="s-title">Isla Vida <em>Collective</em></h2>
          <p className="isla-desc">A curated residency program for remote workers, digital nomads, and creative professionals — live and work from Samal Island for a month, a season, or indefinitely.</p>
          <div className="isla-svcs">
            {ISLA_SVCS.map(s => (
              <div key={s} className="isla-svc">
                <div className="isla-svc-dot" />
                <div className="isla-svc-name">{s}</div>
                <div className="isla-svc-arr">→</div>
              </div>
            ))}
          </div>
          <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="btn-teal">
            Express Interest →
          </a>
        </div>
      </section>

      {/* VIRTUAL SAMAL */}
      <section className="vsam">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <p className="s-label">Concept No. 03</p>
        <h2 className="s-title">Virtual <em>Samal</em></h2>
        <p className="vsam-desc">An interactive digital twin of the resort — explore Almeja Azul in 3D before you arrive. Navigate the property, discover the beach fronts, and find your perfect room.</p>

        <div className="vs-portal">
          <div className="vs-canvas">
            <div className="vs-sky" />
            <div className="vs-sea" />
            <div className="vs-sun" />
            <div className="vs-water-wrap">
              <div className="vs-water-plane" />
            </div>
            <div className="vs-island" />
            <div className="vs-ui">
              <div className="vs-chip">Samal Island · PH</div>
              <div className="vs-chip">7°04′N 125°41′E</div>
            </div>
            <div className="vs-compass">✦</div>
            <div className="vs-hs-wrap">
              {HOTSPOTS.map(hs => (
                <div key={hs.label} className="vs-hs" style={{ left: hs.x, top: hs.y }} title={hs.label} />
              ))}
            </div>
          </div>
          <div className="vs-ctas">
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="btn-glass">Request Early Access →</a>
            <a href="/" className="btn-g">Back to Resort →</a>
          </div>
        </div>
      </section>
    </>
  );
}
