/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  allowedDevOrigins: [
    '192.168.223.70',
    '192.168.223.70:3000',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
  ],
  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/pages/assets.html', destination: '/company-assets' },
      { source: '/pages/assets', destination: '/company-assets' },
      { source: '/assets.html', destination: '/company-assets' },
      { source: '/pages/:path*.html', destination: '/:path*' },
      { source: '/:path*.html', destination: '/:path*' },
      { source: '/pages/:path*', destination: '/:path*' },
    ];
  },
};

export default nextConfig;
