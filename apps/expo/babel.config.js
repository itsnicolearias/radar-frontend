module.exports = (api) => {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@radar/api": "../../packages/api",
            "@radar/config": "../../packages/config",
            "@radar/features": "../../packages/features",
            "@radar/types": "../../packages/types",
            "@radar/ui": "../../packages/ui",
          },
        },
      ],
    ],
  }
}
