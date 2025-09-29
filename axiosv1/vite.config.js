// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy para servir imágenes del CDN a través del dev server de Vite
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todo lo que empiece por /simpsons-cdn se reenvía al dominio real
      "/simpsons-cdn": {
        target: "https://thesimpsonsapi.com",
        changeOrigin: true,                      // finge que el origen es el destino
        secure: true,                            // permite https
        rewrite: (p) => p.replace(/^\/simpsons-cdn/, ""), // quita el prefijo del path
      },
    },
  },
});
