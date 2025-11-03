

const nextConfig = {
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
