import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // CloudFlare Pages用の設定
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined
};

export default nextConfig;
