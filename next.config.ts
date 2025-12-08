import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporary redirects for pages not yet implemented
  async redirects() {
    return [
      {
        source: '/anmelden',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/schenken',
        destination: '/',
        permanent: false,
      },
      {
        source: '/beispiel',
        destination: '/',
        permanent: false,
      },
      {
        source: '/impressum',
        destination: '/',
        permanent: false,
      },
      {
        source: '/datenschutz',
        destination: '/',
        permanent: false,
      },
      {
        source: '/agb',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
