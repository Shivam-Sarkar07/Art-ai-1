module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@config': './src/config',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@components': './src/components',
          '@services': './src/services',
          '@store': './src/store',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@theme': './src/theme',
          '@types': './src/types',
        },
      },
    ],
  ],
};
