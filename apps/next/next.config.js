/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: [
    // Do not transpile 'react-native' itself in Next; alias to 'react-native-web' below.
    // This prevents Next/SWC from parsing RN's internal TS/Flow syntax.
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
    "react-native-screens",
    "react-native-svg",
    "lucide-react-native",
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
      // Ensure web resolves RN imports to RNW
      "react-native$": "react-native-web",
    };

    // Prioritize web-specific entry points before generic TS/JS
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...config.resolve.extensions,
    ];

    return config;
  },
};

module.exports = nextConfig;
