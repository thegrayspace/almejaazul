// Fallback site data for development without a database connection.
// When the DB is available, these values are overridden by SiteSettings.

export const DEFAULT_SITE_SETTINGS = {
  resortName: 'Almeja Azul',
  tagline: 'LYR Beach Resort · Samal Island',
  address: 'Brgy. Adecor, Samal Island, Davao del Norte',
  phone: '0999 308 8800',
  phoneE164: '+639993088800',
  messengerUrl: 'https://m.me/AlmejaAzulResort',
  facebookUrl: 'https://www.facebook.com/AlmejaAzulResort/',
  instagramUrl: '',
  googleMapsUrl: '',
  logoUrl: '/uploads/Almeja_Logo_Large_PNG.png',
  footerText:
    'Five hectares of white sand and open sea on Samal Island. Two beach fronts. One resort that knows when to get out of the way.',
};

export async function getSiteSettings() {
  try {
    const { prisma } = await import('./db');
    const settings = await prisma.siteSettings.findFirst();
    return settings ?? DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
