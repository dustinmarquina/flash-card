// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // If deploying to GitHub Pages under /your-repo/, set base: '/your-repo/'.
  // base: '/flashcards-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // SW updates in background
      includeAssets: ["favicon.svg", "robots.txt"],
      devOptions: { enabled: true }, // set true only if you want SW in dev
      manifest: {
        name: "Flashcards PWA",
        short_name: "Flashcards",
        start_url: ".", // important for GH Pages
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#535bf2",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html", // SPA deep-link fallback
        runtimeCaching: [
          // Fonts (example)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // Static images (optional)
          {
            urlPattern: /\/.*\.(png|jpg|jpeg|gif|svg|webp)$/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "images" },
          },
          // Later, if you add an API:
          // {
          //   urlPattern: /\/api\/.*$/i,
          //   handler: 'NetworkFirst',
          //   options: { cacheName: 'api', networkTimeoutSeconds: 3 }
          // },
        ],
      },
    }),
  ],
});
