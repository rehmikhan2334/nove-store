import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  define: { __MEMORY_ROUTER__: 'true' },
  build: { outDir: 'dist-preview', cssCodeSplit: false, rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'app.js', assetFileNames: 'app[extname]' } } },
})
