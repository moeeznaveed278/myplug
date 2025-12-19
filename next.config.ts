import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows ALL images (Be careful in production)
      },
    ],
  },
};

export default nextConfig;