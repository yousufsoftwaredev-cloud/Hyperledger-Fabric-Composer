import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/health':       'http://localhost:4000',
      '/ping':         'http://localhost:4000',
      '/participants': 'http://localhost:4000',
      '/assets':       'http://localhost:4000',
      '/transactions': 'http://localhost:4000',
      '/queries':      'http://localhost:4000',
    },
  },
})
