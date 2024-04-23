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
        source: '/req:path*',
        destination: 'https://api.vworld.kr/req:path*',
      },
      {
        source: '/ggi/api/map/:path*',
        destination: `https://dev-api.ggi.co.kr:8443/ggi/api/map/:path*`,
      },
      {
        source: '/ggi/api/auth/:path*',
        destination: `https://dev-api.ggi.co.kr:8443/ggi/api/auth/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
