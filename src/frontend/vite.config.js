import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
    },
    server: {
        https: {
          key: './certs/localhost-key.pem', // Path to your private key
          cert: './certs/localhost.pem',     // Path to your certificate
        },
        host: 'localhost', // Ensure Vite listens on localhost
      },
});