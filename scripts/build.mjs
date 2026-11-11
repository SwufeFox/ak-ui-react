import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)
const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const run = (cmd, args) => {
  console.log(`\n$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' })
}

console.log('▸ 1/4  typecheck')
run('npx', ['tsc', '--noEmit'])

console.log('\n▸ 2/4  bundle ESM (vite lib mode)')
run('npx', ['vite', 'build', '--config', 'vite.lib.config.ts'])

console.log('\n▸ 3/4  emit type declarations')
run('npx', ['tsc', '-p', 'tsconfig.build.json'])

console.log('\n▸ 4/4  compile stylesheet + vendor SCSS')
const sass = require('sass')
const result = sass.compile(resolve(root, 'src/ak/styles/ak-ui.scss'), {
  style: 'compressed',
  loadPaths: [resolve(root, 'src/ak/styles/scss')],
})
mkdirSync(dist, { recursive: true })
// dart-sass 只要输出里含非 ASCII 字符（我们的 .ak-chevrons 有 »）就在开头加一个
// U+FEFF BOM。用 <link> 加载时浏览器会替我们剥掉，但被宿主内联进 <style> 时
// BOM 会变成选择器里的 U+FEFF，紧随其后的 :root 规则会整条失效、所有 CSS 变量
// 归零。发布产物不该带 BOM，这里统一去掉。
const css = result.css.charCodeAt(0) === 0xfeff ? result.css.slice(1) : result.css
writeFileSync(resolve(dist, 'style.css'), css, 'utf8')
cpSync(resolve(root, 'src/ak/styles/scss'), resolve(dist, 'scss'), { recursive: true })
// 自托管字体随包发布：编译产物在 dist/style.css，字体放 dist/fonts/；
// 重新编译 SCSS 的宿主在 dist/scss/ 旁边也放一份，url("fonts/…") 两条路都通。
cpSync(resolve(root, 'src/ak/styles/scss/fonts'), resolve(dist, 'fonts'), { recursive: true })
cpSync(resolve(root, 'src/ak/styles/scss/fonts'), resolve(dist, 'scss/fonts'), { recursive: true })

// Ship the framework-agnostic controllers next to the declarations that describe them,
// so `@swufefox/ak-ui-react/core/*` resolves in the published package.
const coreSrc = resolve(root, 'src/ak/core')
const coreDest = resolve(dist, 'core')
if (existsSync(coreDest)) rmSync(coreDest, { recursive: true })
mkdirSync(coreDest, { recursive: true })
for (const file of ['effects.mjs', 'effects.d.mts', 'site.mjs', 'site.d.mts', 'dashboard-depth.mjs', 'dashboard-depth.d.mts']) {
  cpSync(resolve(coreSrc, file), resolve(coreDest, file))
}
cpSync(resolve(coreSrc, 'site'), resolve(coreDest, 'site'), { recursive: true })

// Sync llms.txt to public/llms.txt for web access
cpSync(resolve(root, 'llms.txt'), resolve(root, 'public/llms.txt'))

// The package entry must stay a client boundary: the components use React
// state/effects and five modules create contexts at module scope. If a bundler
// ever drops the entry directive, a Next.js server component importing this
// package evaluates it on the server and the build dies on createContext.
// Assert it here rather than finding out from a consumer's build log.
const entry = readFileSync(resolve(dist, 'index.js'), 'utf8')
if (!/^\s*(["'])use client\1;?/.test(entry)) {
  throw new Error('dist/index.js lost its "use client" directive — the package would crash RSC consumers')
}

console.log('\n✅ build complete → dist/')
