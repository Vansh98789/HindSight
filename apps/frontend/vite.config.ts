import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true
  }
})