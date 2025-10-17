import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Prettier integration (disables conflicting rules)
  prettierConfig,

  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '.wrangler/**'],
  },

  // TypeScript-specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      // Enforce type safety
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Code quality
      'no-console': 'off', // Allow console for logging in server code
      'prefer-const': 'error',
      'no-var': 'error',

      // Async/Promise best practices
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // Prevent common mistakes
      '@typescript-eslint/no-misused-promises': 'error',
      'no-unsafe-optional-chaining': 'error',
    },
  }
);
