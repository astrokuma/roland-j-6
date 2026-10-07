import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    // Offline support, so the companion works in a studio without wifi. Uses the existing site.webmanifest.
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png", "site.webmanifest"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,ico,webmanifest}"],
      },
    }),
  ],
  publicDir: "assets",
});
