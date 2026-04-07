import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/systems': path.resolve(__dirname, './src/systems'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/ui': path.resolve(__dirname, './src/ui'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
