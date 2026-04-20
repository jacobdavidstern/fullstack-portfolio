// eslint-config-overrides.cjs
module.exports = [
  {
    files: [
      'eslint.config.cjs',
      'eslint.config-overrides.cjs',
      'config/**/*.cjs',
      'prettier.config.cjs',
    ],
    rules: {
      // Turn off import ordering for config scripts
      'import/order': 'off',
      'import/no-commonjs': 'off',
    },
  },
];
