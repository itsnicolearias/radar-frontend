// Source - https://stackoverflow.com/a
// Posted by anonym, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-22, License - CC BY-SA 4.0


const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Add shared packages to watchFolders
config.watchFolders = [monorepoRoot];

// Ensure Metro resolves packages from the monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Add extra node modules for proper polyfill resolution
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-url-polyfill': path.resolve(projectRoot, 'node_modules/react-native-url-polyfill'),
};

config.resolver.unstable_enablePackageExports = false;


config.resolver.alias = {
  '@radar/api': path.resolve(monorepoRoot, 'packages/api'),
  '@radar/config': path.resolve(monorepoRoot, 'packages/config'),
  '@radar/features': path.resolve(monorepoRoot, 'packages/features'),
  '@radar/types': path.resolve(monorepoRoot, 'packages/types'),
  '@radar/ui': path.resolve(monorepoRoot, 'packages/ui'),
}

module.exports = config
