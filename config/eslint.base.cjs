// ./config/eslint.base.cjs — Flat Config fragment, CJS-safe, ESM-safe
const path = require('node:path');
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');
const markdownPlugin = require('@eslint/markdown');
const globals = require('globals'); // modern env globals

// Absolute path to Prettier config in repo root
const prettierConfigPath = path.resolve(__dirname, '../prettier.config.cjs');
const prettierConfig = require(prettierConfigPath);

module.exports = [
  // 1. Ignore build artifacts and dependencies
  { ignores: ['dist/', 'node_modules/'] },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. Disable ESLint rules that conflict with Prettier
  eslintConfigPrettier,

  // 4. Main source files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // overridden in CJS repo config if needed
      globals: {
        ...globals.browser,
        ...globals.node,
        console: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      markdown: require('@eslint/markdown'), // unused unless overidden
    },
    rules: {
      // Enforce Prettier formatting using your Prettier config
      // 'prettier/prettier': ['warn', prettierConfig],
      'prettier/prettier': 'error',

      // Example ESLint rules
      'comma-dangle': 'off',
      quotes: 'off',
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': 'warn',
    },
  },
  // 5. Markdown override, un/comment entire block for markdown plugin
  // {
  //   files: ['**/*.md'],
  //   plugins: {
  //     markdown: require('@eslint/markdown'),
  //     prettier: prettierPlugin,
  //   },
  //   processor: '@eslint/markdown/markdown',
  //   rules: {
  //     // Apply your Prettier config to Markdown
  //     'prettier/prettier': ['warn', prettierConfig],
  //     // Disable rules that break inside Markdown code fences
  //     'no-undef': 'off',
  //     'no-unused-vars': 'off',
  //   },
  // },
];
