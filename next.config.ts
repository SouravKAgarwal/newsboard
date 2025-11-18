import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    cssChunking: true,
    inlineCss: true,
  },
  cacheComponents: true,
  cacheLife: {
    news: {
      stale: 60,
      revalidate: 300,
      expire: 600,
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
