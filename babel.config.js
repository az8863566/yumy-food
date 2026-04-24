module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: ['babel-preset-expo'],
    plugins: isTest
      ? ['react-native-reanimated/plugin']
      : [
          require('react-native-css-interop/dist/babel-plugin').default,
          'react-native-reanimated/plugin',
        ],
  };
};
