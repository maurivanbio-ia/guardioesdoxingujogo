import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'client',
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      
      // Cache strategy: precache small files, runtime cache large files
      workbox: {
        // Precache only small assets (JS, CSS, small images)
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,ttf,eot}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB max for precache
        
        // Runtime caching for large files (3D models, audio)
        runtimeCaching: [
          {
            urlPattern: /\.(glb|gltf|wav|mp3|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'large-assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      
      // Include small static assets only for precaching
      includeAssets: ['**/*.{png,jpg,jpeg,svg,ico,woff,woff2,ttf,eot}'],
      
      // Web App Manifest
      manifest: {
        name: 'Guardião do Xingu - A Jornada do Biólogo de Campo',
        short_name: 'Guardião do Xingu',
        description: 'Jogo educativo de conservação de tartarugas amazônicas no rio Xingu',
        theme_color: '#10B981',
        background_color: '#047857',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'any',
        icons: [
          {
            src: '/pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      
      // Enable dev mode testing
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    host: true,
    port: 5000,
    strictPort: false,
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '../attached_assets'
    }
  },
  publicDir: '../public'
});
