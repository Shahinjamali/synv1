import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/user', // Default role; ideally dynamic
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
