import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
      'unused-imports': unusedImports,
      'import': importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': 'warn',
      'import/no-unused-modules': [
        'error',
        {
          unusedExports: true,
          src: ['src/**/*.{ts,tsx}'],
          ignoreExports: [
            'src/main.tsx',
            'src/App.tsx',
            'src/components/**/*.tsx',
            'src/contexts/**/*.tsx',
            'src/components/ui/**/*.{ts,tsx}',
            'src/mocks/**/*.{ts,tsx}',
          ],
        },
      ],
    },
  },
  {
    ignores: ['build/', 'dist/', 'node_modules/', 'vite.config.ts'],
  }
);