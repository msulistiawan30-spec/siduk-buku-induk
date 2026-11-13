import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// VITE_BASE diisi otomatis oleh GitHub Actions menjadi "/nama-repo/".
// Untuk pengembangan lokal dan domain sendiri, nilainya "/".
export default defineConfig(() => ({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  server: { port: 3000, host: '0.0.0.0', strictPort: true },
  build: {
    chunkSizeWarningLimit: 2000,
  },
}));
