import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En desarrollo, /api va a booking-api (ver ../booking-api)
    proxy: { '/api': 'http://localhost:3001' },
  },
})
