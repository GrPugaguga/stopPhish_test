import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

for (const line of readFileSync('.env.example', 'utf-8').split('\n')) {
  if (line && !line.startsWith('#')) {
    const [key, ...rest] = line.split('=');
    process.env[key.trim()] = rest.join('=').trim();
  }
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['shared/**/*.test.ts', 'backend/**/*.test.ts'],
    passWithNoTests: true,
    setupFiles: ['reflect-metadata'],
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
      '@backend': path.resolve(__dirname, './backend'),
    },
  },
});
