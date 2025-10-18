import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    allowedHosts: true, // Disable host check completely
    hmr: {
      clientPort: 443, // Use HTTPS port for ngrok
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})

