import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/user', // default fallback
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // proxy API calls to backend
      },
    ];
  },
};

export default nextConfig;
