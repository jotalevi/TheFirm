/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'backend'],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100';
    return [
      {
        source: '/api/:path*',
        destination: apiUrl + '/:path*'
      },
    ]
  }
};

export default nextConfig; 