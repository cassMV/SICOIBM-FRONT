import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    //host: '192.168.1.42', // Permite conexiones desde cualquier IP
    port: 5173, // Cambia el puerto si lo necesitas
  },
})
