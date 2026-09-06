import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/life/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: '삶 관리',
        short_name: '삶 관리',
        description: '인테리어, 대출/혼인신고 등 개인 라이프 관리 앱',
        lang: 'ko',
        theme_color: '#b4784a',
        background_color: '#faf9f7',
        display: 'standalone',
        start_url: '/life/',
        scope: '/life/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
  ],
})
