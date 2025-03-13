import { NextConfig } from "next";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} satisfies NextConfig;

export default nextConfig;
