import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Sitio de documentación: aplicación React que consume gob-cl-tailwind como cualquier proyecto Tailwind 4.
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react(), tailwindcss()],
  // Las maquetas consumen la librería igual que un proyecto externo: import { … } from 'gob-cl-tailwind/react'
  resolve: { alias: { 'gob-cl-tailwind/react': resolve(import.meta.dirname, '../src/react/index.js') } },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Dos páginas: documentación (/) y app de chat (/chat/)
    rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), chat: resolve(import.meta.dirname, 'chat/index.html'), tramites: resolve(import.meta.dirname, 'tramites/index.html') } },
  },
  server: { fs: { allow: ['..'] } },
})
