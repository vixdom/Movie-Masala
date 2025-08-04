import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test-setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../client/src'),
      '@shared': path.resolve(__dirname, '../../../shared'),
    },
  },
});