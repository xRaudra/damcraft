import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/brandhtmlfile",
        destination: "/brandhtmlfile.html",
      },
      {
        source: "/question",
        destination: "/question.html",
      },
    ];
  },
};

export default nextConfig;
