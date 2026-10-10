import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['.next/**', 'out/**', 'coverage/**', 'node_modules/**', '_data/**', 'public/**', 'next-env.d.ts'],
  },
  react.configs.flat.recommended,
  {
    settings: { react: { version: '19.3' } },
  },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-shadow': ['warn', { ignoreOnInitialization: true }],
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      'no-console': ['warn', { allow: ['info', 'warn', 'error', 'group', 'groupCollapsed', 'groupEnd'] }],
      'no-param-reassign': 'warn',
      'react/display-name': 'off',
      'react/function-component-definition': [2, { namedComponents: ['arrow-function'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'prefer-destructuring': [
        'warn',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
      ],
      'prefer-template': 'warn',
    },
  },
]
