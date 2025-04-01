import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Specify the host
    port: 5173,       // Specify the port (match what you're using)
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173      // Must match your dev server port
    }
  },
  // Optional: If you're using a proxy for API calls
  /* proxy: {
    '/api': {
      target: 'http://your-api-server.com',
      changeOrigin: true,
      secure: false
    }
  } */
})