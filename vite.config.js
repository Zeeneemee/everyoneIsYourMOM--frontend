import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    // HMR configuration - use default for local dev
    // For ngrok/tunneling, set clientPort to 443
    hmr: process.env.USE_NGROK 
      ? { clientPort: 443 }
      : true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})

