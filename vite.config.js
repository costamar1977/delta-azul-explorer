import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "Delta del Azul Explorer",
        short_name: "Delta Azul",
        description: "Guía offline de flora y fauna del Parque Nacional Lago Puelo",
        theme_color: "#2f5233",
        background_color: "#f6f3ec",
        display: "standalone",
        start_url: "/",
        lang: "es",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precachea el catálogo (JSON) y todo el bundle para uso 100% offline
        globPatterns: ["**/*.{js,css,html,json,svg,png,ico}"],
        runtimeCaching: [
          {
            // Las fotos que el usuario suba quedan cacheadas si vuelve a verlas
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: { cacheName: "imagenes-especies", expiration: { maxEntries: 100 } },
          },
        ],
      },
    }),
  ],
});
