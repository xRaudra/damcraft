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
      {
        source: "/questio2",
        destination: "/questio2.html",
      },
    ];
  },
};

export default nextConfig;
