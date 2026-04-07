import { defineConfig } from 'vite';
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
  build: {
    target: 'ES2020',
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
