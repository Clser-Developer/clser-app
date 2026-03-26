import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
        VitePWA({
          registerType: 'prompt',
          includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192.png', 'pwa-512.png'],
          manifest: {
            id: '/',
            name: 'Clser',
            short_name: 'Clser',
            description: 'Plataforma de comunidade e experiencias exclusivas entre artistas e fas.',
            theme_color: '#ff6648',
            background_color: '#120c08',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            lang: 'pt-BR',
            icons: [
              {
                src: 'pwa-192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'pwa-512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'pwa-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
              },
            ],
          },
          workbox: {
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: false,
            navigateFallback: '/index.html',
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/i\.ibb\.co\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'remote-images-ibb',
                  expiration: {
                    maxEntries: 120,
                    maxAgeSeconds: 60 * 60 * 24 * 7,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: /^https:\/\/www\.transparenttextures\.com\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'remote-textures',
                  expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 * 24 * 30,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
            ],
          },
          devOptions: {
            enabled: false,
            type: 'module',
          },
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              react: ['react', 'react-dom'],
            },
          },
        },
      }
    };
});
