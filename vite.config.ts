import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Dev + demo-app config. The library build lives in vite.lib.config.ts. */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5273,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist-demo',
  },
})
