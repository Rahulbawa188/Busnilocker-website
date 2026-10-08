/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
