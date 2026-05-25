// Almeja Azul — Thin-stroke Icon System
// strokeWidth 1.4 · round caps & joins · 24×24 viewBox · currentColor

interface IconProps {
  size?: number;
  className?: string;
}

const props = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.4',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  style: { display: 'block', flexShrink: 0 },
});

export function IconBolt({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <polygon points="13 2 7 13 12 13 11 22 17 11 12 11" />
    </svg>
  );
}

export function IconUmbrella({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M3 13A9 9 0 0 1 21 13" />
      <line x1="12" y1="13" x2="7.5" y2="5.2" />
      <line x1="12" y1="13" x2="16.5" y2="5.2" />
      <line x1="12" y1="13" x2="12" y2="22" />
    </svg>
  );
}

export function IconWaves({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M2 9.5c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" />
      <path d="M2 15.5c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" />
    </svg>
  );
}

export function IconCottage({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M2 11L12 3l10 8" />
      <line x1="2" y1="11" x2="22" y2="11" />
      <line x1="5" y1="11" x2="5" y2="21" />
      <line x1="19" y1="11" x2="19" y2="21" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  );
}

export function IconPaw({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <ellipse cx="7" cy="11" rx="2" ry="2.5" />
      <ellipse cx="12" cy="9" rx="2" ry="2.5" />
      <ellipse cx="17" cy="11" rx="2" ry="2.5" />
      <ellipse cx="12" cy="18" rx="5" ry="4" />
    </svg>
  );
}

export function IconPhone({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.85 12 19.79 19.79 0 0 1 1.78 3.38 2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.67a16 16 0 0 0 6.61 6.61l1.03-1.03a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function IconSnorkel({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <rect x="2" y="10" width="18" height="10" rx="3" />
      <path d="M20 14c2-3 2-6 0-8" />
      <line x1="18" y1="6" x2="22" y2="6" />
    </svg>
  );
}

export function IconJetSki({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M2 16c2-4 6-5 11-5h8" />
      <path d="M2 16v3c5 1 11 0 17-3l2-3c1-1 1-2 0-3h-8" />
      <path d="M4 21c2-1.5 4-1.5 6 0" />
    </svg>
  );
}

export function IconBananaBoat({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M2 14c3-4 8-4 10-3s7-1 10 3" />
      <path d="M3 16c3 3 8 3 10 2s6 1 8-2" />
      <circle cx="7" cy="11.5" r="1.5" />
      <circle cx="12" cy="11" r="1.5" />
      <circle cx="17" cy="11.5" r="1.5" />
    </svg>
  );
}

export function IconKayak({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <line x1="4" y1="19" x2="20" y2="5" />
      <path d="M4 19c-2 2-3 0-2-2l4-1z" />
      <path d="M20 5c2-2 3 0 2 2l-4 1z" />
      <path d="M9 17c2-2 4-2 6 0" />
    </svg>
  );
}

export function IconPickleball({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <circle cx="15" cy="9" r="6" />
      <line x1="11" y1="14" x2="5" y2="22" />
      <circle cx="4.5" cy="8" r="2" />
    </svg>
  );
}

export function IconDining({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <line x1="9" y1="3" x2="9" y2="21" />
      <path d="M7 3v5a2 2 0 0 0 4 0V3" />
      <path d="M15 3c2 0 4 2 3 5l-3 13" />
    </svg>
  );
}

export function IconWifi({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M10.54 16.1a6 6 0 0 1 2.92 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSunrise({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <circle cx="12" cy="11" r="4" />
      <line x1="1" y1="18" x2="23" y2="18" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" />
      <line x1="2" y1="11" x2="4" y2="11" />
      <line x1="22" y1="11" x2="20" y2="11" />
      <polyline points="9 18 12 15 15 18" />
    </svg>
  );
}

export function IconCoffee({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

export function IconSunset({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <circle cx="12" cy="13" r="4" />
      <line x1="1" y1="20" x2="23" y2="20" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="4.22" y1="5.22" x2="5.64" y2="6.64" />
      <line x1="19.78" y1="5.22" x2="18.36" y2="6.64" />
      <line x1="2" y1="13" x2="4" y2="13" />
      <line x1="22" y1="13" x2="20" y2="13" />
    </svg>
  );
}

export function IconLeaf({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <path d="M3 22c1-6 5-12 12-15 5-2 7-3 7-3s-2 5-6 10c-4 5-10 8-13 8z" />
      <path d="M3 22l9-9" />
    </svg>
  );
}

export function IconPool({ size = 24, className }: IconProps) {
  return (
    <svg {...props(size)} className={className}>
      <circle cx="17" cy="5" r="2" />
      <path d="M8 13c2-3 5-3 7-1s5 2 7 0" />
      <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

// Icon map for looking up by string name (used in admin/seed)
export const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  bolt: IconBolt,
  umbrella: IconUmbrella,
  waves: IconWaves,
  cottage: IconCottage,
  paw: IconPaw,
  phone: IconPhone,
  snorkel: IconSnorkel,
  jetski: IconJetSki,
  bananaboat: IconBananaBoat,
  kayak: IconKayak,
  pickleball: IconPickleball,
  dining: IconDining,
  wifi: IconWifi,
  sunrise: IconSunrise,
  coffee: IconCoffee,
  sunset: IconSunset,
  leaf: IconLeaf,
  pool: IconPool,
};

export function Icon({ name, size = 24, className }: { name: string } & IconProps) {
  const Component = ICON_MAP[name.toLowerCase()];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}
