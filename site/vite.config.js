import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Sitio de documentación: aplicación React que consume gob-cl-tailwind como cualquier proyecto Tailwind 4.
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Dos páginas: documentación (/) y app de chat (/chat/)
    rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), chat: resolve(import.meta.dirname, 'chat/index.html') } },
  },
  server: { fs: { allow: ['..'] } },
})
