import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['shared/**/*.test.ts', 'backend/**/*.test.ts'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
      '@backend': path.resolve(__dirname, './backend'),
    },
  },
});