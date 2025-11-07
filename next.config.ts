import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    cssChunking: true,
  },
};

export default nextConfig;
