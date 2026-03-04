import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ['frontend'],
    proxy: {
      "/api": {
        target: "http://backend:3310",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true, // Améliore le hot reloading
      interval: 200,   // Fréquence de vérification des changements
    },
    hmr: {
      port: 3000,
      path: "/hmr"
    },
  },
})
