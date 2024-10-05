module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
  };





// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     [
//       'module:react-native-dotenv',
//       {
//         envName: 'APP_ENV',
//         moduleName: '@env',
//         path: '.env',
//         blocklist: null,
//         allowlist: null,
//         blacklist: null, // DEPRECATED
//         whitelist: null, // DEPRECATED
//         safe: false,
//         allowUndefined: true,
//         verbose: false,
//       },
//     ],
//   ],
// };
