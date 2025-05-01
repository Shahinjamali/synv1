import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/user',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: isProd
          ? 'https://synix.ca/api/:path*' // 🟢 Use public domain in prod
          : 'http://localhost:5000/api/:path*', // ✅ Local in dev
      },
    ];
  },
};

export default nextConfig;
