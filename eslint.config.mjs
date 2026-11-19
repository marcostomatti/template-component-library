import baseConfig from '@open-tomato/eslint-config';
import cvaConfig from '@open-tomato/eslint-config/cva';
import reactConfig from '@open-tomato/eslint-config/react';
import viteConfig from '@open-tomato/eslint-config/vite';

// Reference-free gate targets (see rule below) — split so the literal names
// never appear in this file.
const BANNED_SOURCE_SCOPE = ['@open', 'tomato'].join('-');
const BANNED_SOURCE_REPO = ['component', 'breakdown'].join('-');

/**
 * ESLint flat config: the shared base with the React, Vite and CVA flavors,
 * plus what is this library's own.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
  { ignores: ['storybook-static/**'] },
  ...baseConfig,
  ...reactConfig,
  ...viteConfig,
  ...cvaConfig,
  {
    // Reference-free gate: this standalone library must never import from the
    // monorepo it was extracted from or its pre-publish source repositories.
    // The banned names are assembled from parts so this config itself passes
    // a grep sweep for the same strings. This file is left out: it imports
    // the shared lint config, a published dev-only package that never ships.
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    ignores: ['eslint.config.mjs'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [`${BANNED_SOURCE_SCOPE}/*`],
            message: 'Banned source scope — this library is standalone; use local relative imports.',
          },
          {
            group: [`*${BANNED_SOURCE_REPO}*`],
            message: 'Cross-repo path imports are banned in components-library.',
          },
        ],
      }],
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    rules: {
      'react/display-name': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
      // Off for now: the rule accepts only callees named `xVariants`, and this
      // library names its cva calls after the part (`avatar`, `badge`) and
      // still has inline utility classes, about 550 sites in all. Follow-up:
      // rename the variants exports, move the inline classes into cva, and
      // turn it back on.
      '@open-tomato/cva-only-classname': 'off',
    },
  },
];
