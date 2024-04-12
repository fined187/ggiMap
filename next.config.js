/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

module.exports = nextConfig
