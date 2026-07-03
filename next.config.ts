import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    return [
      {
        source: '/personalapp',
        destination: '/personalapp/index.html',
      },
    ]
  },
}

export default nextConfig
