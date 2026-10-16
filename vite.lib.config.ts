import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

/**
 * Library build. Emits ESM only, keeps the vendored framework-agnostic controllers
 * external to the bundle graph so they can be imported as `@swufefox/ak-ui-react/core/*`.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/ak/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',

    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((n) => n.endsWith('.css')) || assetInfo.name?.endsWith('.css')) return 'style.css'
          return 'assets/[name][extname]'
        },
      },
    },
    cssCodeSplit: false,
  },
})
