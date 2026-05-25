import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
  async redirects() {
    return [
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
