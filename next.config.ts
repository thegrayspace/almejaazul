import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 390, 430, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.almejaazul.com' }],
        destination: 'https://almejaazul.com/:path*',
        permanent: true,
      },
      { source: '/Almeja%20Azul.html', destination: '/', permanent: true },
      { source: '/stay.html',          destination: '/stay',      permanent: true },
      { source: '/day-tour.html',      destination: '/day-tour',  permanent: true },
      { source: '/fun.html',           destination: '/fun',       permanent: true },
      { source: '/build.html',         destination: '/build',     permanent: true },
      { source: '/see.html',           destination: '/see',       permanent: true },
      { source: '/archive.html',       destination: '/archive',   permanent: true },
    ];
  },
};

export default nextConfig;
