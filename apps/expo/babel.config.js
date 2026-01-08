module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@radar/api': '../../packages/api',
            '@radar/config': '../../packages/config',
            '@radar/features': '../../packages/features',
            '@radar/types': '../../packages/types',
            '@radar/ui': '../../packages/ui',
            '@radar/utils': '../../lib/utils',
          },
        },
      ],
    ],
  }
}
