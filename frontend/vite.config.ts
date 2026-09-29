/// <reference types="vitest/config" />
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // "@/components/ui/button" means "src/components/ui/button", from any file.
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // Settings for the automated tests (npm test).
  test: {
    environment: 'jsdom', // a simulated browser, so components can be drawn without a real one
    setupFiles: ['./src/test/setup.ts'],
  },
})
