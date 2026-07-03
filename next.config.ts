import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Personal app lives at /personalapp — handled by Vercel routing rules separately
}

export default nextConfig
