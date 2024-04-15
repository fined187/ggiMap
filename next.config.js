/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'localhost:3000',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.iconfinder.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ggi.co.kr',
      },
      {
        protocol: 'http',
        hostname: 'file.ggi.co.kr',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://api.vworld.kr/:path*',
      },
    ]
  },
}

module.exports = nextConfig
