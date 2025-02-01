import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Vite's default output directory
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
