import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    cssChunking: true,
  },
  cacheComponents: true,
  cacheLife: {
    news: {
      stale: 1200,
      revalidate: 600,
      expire: 1800,
    },
  },
  images: {
    qualities: [40],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
