import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
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
writeFileSync(resolve(dist, 'style.css'), result.css, 'utf8')
cpSync(resolve(root, 'src/ak/styles/scss'), resolve(dist, 'scss'), { recursive: true })

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

console.log('\n✅ build complete → dist/')
