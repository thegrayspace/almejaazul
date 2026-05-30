// schema.org JSON-LD generator for the site root.
//
// We emit a @graph that combines:
//   - LocalBusiness   (generic business pin — broadest crawler coverage)
//   - Hotel           (Google hotel knowledge panel eligibility)
//   - LodgingBusiness (canonical lodging type, used by some aggregators)
//
// Pulls everything possible from the SiteSettings row so the admin can
// update phone/address/socials without code changes.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Geo coordinates: approximate centroid of Brgy. Adecor, Samal Island,
// Davao del Norte. This is a deliberate placeholder — the resort's
// exact coordinates should be set on SiteSettings once surveyed.
// Source: public OpenStreetMap data for Adecor barangay.
export const SAMAL_PLACEHOLDER_GEO = {
  latitude: 7.0833,
  longitude: 125.7167,
};

type SiteSettingsLike = {
  resortName: string;
  tagline?: string;
  address: string;
  phone?: string;
  phoneE164?: string;
  messengerUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  logoUrl?: string;
  footerText?: string;
};

function toAbsolute(url: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

function buildPostalAddress(addressLine: string) {
  return {
    '@type': 'PostalAddress',
    streetAddress: addressLine,
    addressLocality: 'Samal',
    addressRegion: 'Davao del Norte',
    addressCountry: 'PH',
  };
}

function buildSameAs(settings: SiteSettingsLike): string[] {
  return [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.messengerUrl,
    settings.googleMapsUrl,
  ].filter((u): u is string => !!u && u.length > 0);
}

export function generateHotelJsonLd(settings: SiteSettingsLike): object {
  const name = settings.resortName || 'Almeja Azul';
  const description =
    settings.footerText ||
    'Five hectares of white sand and open sea on Samal Island. Two beach fronts. One resort that knows when to get out of the way.';
  const logo = toAbsolute(settings.logoUrl || '/uploads/Almeja_Logo_Large_PNG.png');
  const address = buildPostalAddress(settings.address);
  const geo = {
    '@type': 'GeoCoordinates',
    latitude: SAMAL_PLACEHOLDER_GEO.latitude,
    longitude: SAMAL_PLACEHOLDER_GEO.longitude,
  };
  const phone = settings.phoneE164 || settings.phone || '';
  const sameAs = buildSameAs(settings);
  const priceRange = '₱₱'; // ₱₱

  const common = {
    name,
    description,
    url: SITE_URL,
    logo,
    image: logo,
    address,
    geo,
    telephone: phone,
    priceRange,
    sameAs,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        ...common,
      },
      {
        '@type': 'Hotel',
        '@id': `${SITE_URL}/#hotel`,
        ...common,
        starRating: { '@type': 'Rating', ratingValue: '4' },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Infinity Pool', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Beachfront', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Event Venues', value: true },
        ],
      },
      {
        '@type': 'LodgingBusiness',
        '@id': `${SITE_URL}/#lodging`,
        ...common,
      },
    ],
  };
}
