import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@radar/api", "@radar/config", "@radar/features", "@radar/types", "@radar/ui"],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
