import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/brandhtmlfile",
        destination: "/brandhtmlfile.html",
      },
    ];
  },
};

export default nextConfig;
