/** @type {import('next').NextConfig} */
const path = require('path');

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
  // Next 16+ no longer supports the `eslint` option in next.config.js.
  // If you want to ignore ESLint during build, configure via CLI or CI.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Provide a turbopack config with an explicit root to avoid Next
  // inferring the wrong workspace root when other lockfiles exist on the
  // machine (e.g. C:\\Users\\nicole\\package-lock.json).
  turbopack: {
    root: path.resolve(__dirname, '..', '..'),
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
