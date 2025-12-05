import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o app automaticamente se houver nova versão
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Guardião 360° - Gestão Operacional', // Nome completo na loja/instalação
        short_name: 'Guardião 360', // Nome abaixo do ícone no celular
        description: 'Sistema de Gestão de Ocorrências e Equipes do CBM',
        theme_color: '#a20909', // Cor da barra de status (Vermelho do Sidebar)
        background_color: '#ffffff', // Cor de fundo da splash screen
        display: 'standalone', // Remove a barra de URL do navegador (App Nativo)
        orientation: 'portrait', // Tenta forçar modo retrato no celular
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Importante para ícones redondos no Android
          }
        ]
      }
    })
  ],
})