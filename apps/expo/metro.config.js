const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

config.resolver.alias = {
  '@radar/api': path.resolve(workspaceRoot, 'packages/api'),
  '@radar/config': path.resolve(workspaceRoot, 'packages/config'),
  '@radar/features': path.resolve(workspaceRoot, 'packages/features'),
  '@radar/types': path.resolve(workspaceRoot, 'packages/types'),
  '@radar/ui': path.resolve(workspaceRoot, 'packages/ui'),
}

module.exports = config
