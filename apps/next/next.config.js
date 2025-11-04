/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "react-native",
    "react-native-web",
    "expo",
    "solito",
    "moti",
    "dripsy",
    "@expo/vector-icons",
    "nativewind",
    "react-native-reanimated",
    "react-native-safe-area-context",
    "react-native-gesture-handler",
    "@radar/api",
    "@radar/config",
    "@radar/features",
    "@radar/types",
    "@radar/ui",
  ],
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
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    return config;
  },
};

module.exports = nextConfig;
