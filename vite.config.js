import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Pour le développement local
  },
  preview: {
    port: 4173,
    host: true, // Pour que Docker expose en externe
  },
  optimizeDeps: {
    include: ['react-leaflet'],
  },
});
