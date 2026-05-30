import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleTagManager } from '@/lib/analytics';
import { getSiteSettings } from '@/lib/site-data';
import { generateHotelJsonLd } from '@/lib/seo/jsonld';
import { DEFAULT_OG_IMAGE, DEFAULT_OG_HEIGHT, DEFAULT_OG_WIDTH } from '@/lib/seo/og';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Almeja Azul — LYR Beach Resort, Samal Island',
    template: '%s | Almeja Azul',
  },
  description:
    'A hidden sanctuary on Samal Island, Philippines. Beachfront rooms, island tours, team building, and weddings.',
  openGraph: {
    siteName: 'Almeja Azul',
    locale: 'en_PH',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: DEFAULT_OG_WIDTH,
        height: DEFAULT_OG_HEIGHT,
        alt: 'Almeja Azul — LYR Beach Resort, Samal Island',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const jsonLd = generateHotelJsonLd(settings);

  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <GoogleTagManager />
        {children}
      </body>
    </html>
  );
}
