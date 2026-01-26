/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  test: {
    globals: true,             // allows using describe, it, expect without importing them
    environment: 'happy-dom',      // simulates the browser
    setupFiles: './src/setupTests.ts', 
    css: true,
  },
})
