// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

export default defineConfig([...nextVitals, ...nextTs, prettier, globalIgnores([
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
  '**/node_modules/**',
  'public/**',
]), ...storybook.configs["flat/recommended"]])
