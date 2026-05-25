'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInquiry } from './InquiryModal';

const NAV_LINKS = [
  { href: '/stay', label: 'Stay' },
  { href: '/day-tour', label: 'Day Tour' },
  { href: '/fun', label: 'Fun' },
  { href: '/build', label: 'Build' },
  { href: '/see', label: 'See' },
];

export default function Nav() {
  const pathname = usePathname();
  const { open } = useInquiry();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navClass = `nav${scrolled ? ' scrolled' : ''}`;

  return (
    <nav className={navClass}>
      <Link href="/" className="nav-logo">
        <img src="/uploads/Almeja_Logo_Large_PNG.png" alt="Almeja Azul" />
      </Link>

      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${pathname.startsWith(link.href) ? ' active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <a href="tel:09993088800" className="nav-phone">0999 308 8800</a>
        <button className="nav-book" onClick={() => open()}>
          Book Now
        </button>
        <button
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
