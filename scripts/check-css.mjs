/**
 * 样式闸门：编译产物与文档里的令牌表必须彼此对得上。
 *
 * 三条规则：
 *   1. 没有回退值的 `var(--ak-*)` 必须在样式表里真的被定义过
 *      （拼错一个字母，声明会被浏览器整条丢弃且不报错）；
 *   2. llms.txt「Tuning Reference」表里列出的每个令牌都必须真的被样式表消费
 *      （改完 SCSS 忘了改文档，读者会去调一个不存在的旋钮）；
 *   3. 2.0 已移除的 `data-theme=` 别名不能复活。
 *
 * 依赖 dist/style.css：build 里排在 sass 之后。
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const cssPath = path.join(root, 'dist/style.css')
const llmsPath = path.join(root, 'llms.txt')

if (!fs.existsSync(cssPath)) {
  console.error('dist/style.css 不存在 —— 先跑 node scripts/build.mjs')
  process.exit(1)
}

const css = fs.readFileSync(cssPath, 'utf8')
const failures = []

// ── 1. 无回退的令牌必须已定义 ────────────────────────────────────────
const defined = new Set([...css.matchAll(/(--ak-[\w-]+)\s*:/g)].map((m) => m[1]))
for (const m of css.matchAll(/var\(\s*(--ak-[\w-]+)\s*([^)]*)\)/g)) {
  if (m[2].includes(',')) continue
  if (!defined.has(m[1])) failures.push(`未定义且无回退：var(${m[1]})`)
}

// ── 2. 文档里列的调参令牌必须被消费 ──────────────────────────────────
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8')
  const start = llms.indexOf('## 4. Tuning Reference')
  const end = llms.indexOf('\n## ', start + 4)
  const table = start >= 0 ? llms.slice(start, end < 0 ? undefined : end) : ''
  for (const m of table.matchAll(/`(--ak-[\w-]+)`/g)) {
    if (!css.includes(`var(${m[1]}`)) failures.push(`文档列出但样式未消费：${m[1]}`)
  }
}

// ── 3. 已移除的旧主题别名 ────────────────────────────────────────────
if (/\[data-theme[=\]]/.test(css)) failures.push('产物里仍有 data-theme 选择器（2.0 已移除）')

const unique = [...new Set(failures)]
if (unique.length) {
  console.error(`▸ css check failed — ${unique.length} 处：`)
  for (const line of unique.slice(0, 40)) console.error(`  ${line}`)
  if (unique.length > 40) console.error(`  … 还有 ${unique.length - 40} 处`)
  process.exit(1)
}

console.log(`▸ css check   dist/style.css  ${defined.size} tokens defined, 0 issues`)
