import path from 'path';
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
          ? 'https://synix.ca/api/:path*'
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: isProd ? 'https' : 'http',
        hostname: isProd ? 'server1.synix.ca' : 'localhost',
        port: isProd ? '' : '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

export default nextConfig;
