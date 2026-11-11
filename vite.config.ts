import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * 开发期修正自托管字体的路径。
 *
 * 库里 `ak-ui.scss` 用相对路径引字体（`url("fonts/…")`）：生产构建会把它
 * 改写成带哈希的资源地址，发布包里的 `dist/style.css` 也正好对着
 * `dist/fonts/`。但开发期 Vite 把 CSS 注入成 <style>，相对路径按文档根解析，
 * 字体请求会 404。这里只在 serve 阶段把相对前缀换成开发服务器的绝对路径。
 */
function devFontPaths(): Plugin {
  return {
    name: 'ak-dev-font-paths',
    apply: 'serve',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.(scss|css)$/.test(id) || !code.includes('url("fonts/')) return null
      return { code: code.replace(/url\("fonts\//g, 'url("/src/ak/styles/scss/fonts/'), map: null }
    },
  }
}

/** Dev + demo-app config. The library build lives in vite.lib.config.ts. */
export default defineConfig({
  plugins: [react(), devFontPaths()],
  server: {
    port: 5273,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist-demo',
  },
})
