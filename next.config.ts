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
        source: "/question2",
        destination: "/question2.html",
      },
    ];
  },
};

export default nextConfig;
