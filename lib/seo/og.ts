import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// High-quality static hero image fallback. Used when a page has no
// entity-specific OG image to generate via /api/og. The default
// route renders a generic resort card via /api/og?type=site.
export const DEFAULT_OG_IMAGE = '/api/og?type=site';
export const DEFAULT_OG_WIDTH = 1200;
export const DEFAULT_OG_HEIGHT = 630;

export type GenerateOgMetadataInput = {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  // When true, the page sets the full <title> exactly — bypassing the
  // `%s | Almeja Azul` template defined on the root layout. Use for the
  // home page where the title is already the full brand line.
  absoluteTitle?: boolean;
};

function toAbsolute(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

export function generateOgMetadata(input: GenerateOgMetadataInput): Metadata {
  const { title, description, path, imageAlt, type = 'website', absoluteTitle = false } = input;
  const imageUrl = toAbsolute(input.imageUrl ?? DEFAULT_OG_IMAGE);
  const canonical = toAbsolute(path === '/' ? '/' : path);

  const images = [
    {
      url: imageUrl,
      width: DEFAULT_OG_WIDTH,
      height: DEFAULT_OG_HEIGHT,
      alt: imageAlt ?? title,
    },
  ];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Almeja Azul',
      locale: 'en_PH',
      type,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
