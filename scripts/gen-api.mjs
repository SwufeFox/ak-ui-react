/**
 * 从构建产物 dist/ui 下的所有 .d.ts 生成 API 参考，输出 docs/api.md。
 *
 * 为什么是生成而不是手写：这份库有 60+ 个组件、每个 6-10 个 prop。
 * 手写的 API 表一定会漂移——本仓库已经有过一次教训：`AkVignetteProps.size` 的
 * 注释写着「默认 22%」，而令牌早就改成了 55%。只要文档和源码是两处人写的，
 * 就迟早会对不上。d.ts 里的 JSDoc 是**唯一的真相来源**，所以从这里生成。
 *
 * 接在 build 之后跑（见 package.json），产物与文档永远同源。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distUi = path.join(root, 'dist/ui')
const outFile = path.join(root, 'docs/api.md')

if (!fs.existsSync(distUi)) {
  console.error('dist/ui 不存在 —— 先跑 npm run build')
  process.exit(1)
}

// ── 收集 d.ts ────────────────────────────────────────────────────────
const files = []
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.d.ts')) files.push(p)
  }
}
walk(distUi)

// ── 解析 ──────────────────────────────────────────────────────────────

/** 把一段 JSDoc 正文（已剥掉注释定界符）压成单行 */
const flattenDoc = (lines) =>
  lines
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter((l) => l && l !== '/')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

/** 抽一个 interface 的 props（含每条的 JSDoc） */
const parseInterfaceBody = (body) => {
  const props = []
  let doc = []
  let inDoc = false
  for (const raw of body.split('\n')) {
    const l = raw.trim()
    if (!l) continue

    if (l.startsWith('/**')) {
      inDoc = true
      const rest = l.replace(/^\/\*\*/, '')
      if (rest.includes('*/')) {
        inDoc = false
        doc.push(rest.replace(/\*\/.*$/, ''))
      } else doc.push(rest)
      continue
    }
    if (inDoc) {
      if (l.includes('*/')) {
        inDoc = false
        doc.push(l.replace(/\*\/.*$/, ''))
      } else doc.push(l)
      continue
    }

    const m = l.match(/^(\w+)(\??):\s*(.+?);?$/)
    if (m) {
      props.push({
        name: m[1],
        optional: m[2] === '?',
        type: m[3].replace(/;$/, '').trim(),
        doc: flattenDoc(doc),
      })
      doc = []
    }
  }
  return props
}

const interfaces = [] // { name, extends, doc, props }
const functions = [] // { name, file }

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  const rel = path.relative(path.join(root, 'dist'), f)

  // 每个 export interface Ak* { ... }（extends 可选）
  const re = /(?:^|\n)[ \t]*export interface (Ak\w+)(?:\s+extends\s+([^{]+?))?\s*\{([\s\S]*?)\n\}/g
  let m
  while ((m = re.exec(src))) {
    const [, name, ext, body] = m
    const exportStart = m.index + m[0].indexOf('export interface')
    const prefix = src.slice(0, exportStart)
    const leadEnd = prefix.lastIndexOf('*/')
    const leadStart = prefix.lastIndexOf('/**', leadEnd)
    const lead = leadEnd >= 0 && leadStart >= 0 && /^\s*$/.test(prefix.slice(leadEnd + 2))
      ? prefix.slice(leadStart, leadEnd + 2)
      : ''
    const doc = lead ? flattenDoc(lead.replace(/^\/\*\*|\*\/$/g, '').split('\n')) : ''
    interfaces.push({ name, extends: (ext || '').trim(), doc, props: parseInterfaceBody(body), file: rel })
  }

  for (const fm of src.matchAll(/export declare function (Ak\w+)/g)) {
    functions.push({ name: fm[1], file: rel })
  }
}

// ── 组织成文档 ────────────────────────────────────────────────────────
// 组件名 → 它的 *Props 接口。函数名与接口名去掉 Props/字段后对上即可。
const propsByName = new Map(interfaces.map((i) => [i.name, i]))

const componentOf = (fnName) => {
  for (const key of [fnName + 'Props', fnName + 'PropsBase']) {
    if (propsByName.has(key)) return propsByName.get(key)
  }
  return null
}

const sortedFns = [...new Set(functions.map((f) => f.name))].sort()
const orphans = interfaces
  .filter((i) => !sortedFns.some((fn) => componentOf(fn)?.name === i.name))
  .filter((i) => /Props$/.test(i.name))
  .sort((a, b) => a.name.localeCompare(b.name))

const esc = (s) => String(s).replace(/\|/g, '\\|')

const lines = []
lines.push('# API reference')
lines.push('')
lines.push('> **Generated file — do not edit by hand.** Run `npm run build:api` (or `npm run build`,' + '')
lines.push('> which calls it) to regenerate from the JSDoc in `dist/ui/**/*.d.ts`.')
lines.push('')
lines.push('Every component and its props. `?` marks an optional prop. Props inherited from')
lines.push("React's `HTMLAttributes` are not repeated here — they pass through unchanged.")
lines.push('')
lines.push('## Index')
lines.push('')
const cols = 4
for (let i = 0; i < sortedFns.length; i += cols) {
  const row = sortedFns
    .slice(i, i + cols)
    .map((n) => `[\`${n}\`](#${n.toLowerCase()})`)
    .join(' · ')
  lines.push('- ' + row)
}
lines.push('')

const emit = (title, iface, fnNames) => {
  lines.push(`## ${title}`)
  lines.push('')
  if (iface?.doc) {
    lines.push(iface.doc)
    lines.push('')
  }
  if (fnNames.length > 1) {
    lines.push(`Exports: ${fnNames.map((n) => '`' + n + '`').join(', ')}`)
    lines.push('')
  }
  if (!iface) {
    lines.push('_(no props of its own)_')
    lines.push('')
    return
  }
  if (iface.extends) {
    lines.push(`Extends \`${iface.extends}\`.`)
    lines.push('')
  }
  if (!iface.props.length) {
    lines.push('_(no props of its own)_')
    lines.push('')
    return
  }
  lines.push('| Prop | Type | Optional | Description |')
  lines.push('| --- | --- | --- | --- |')
  for (const p of iface.props) {
    lines.push(`| \`${p.name}\` | \`${esc(p.type)}\` | ${p.optional ? 'yes' : 'no'} | ${esc(p.doc) || '—'} |`)
  }
  lines.push('')
}

for (const fn of sortedFns) {
  emit(fn, componentOf(fn), [fn])
}

if (orphans.length) {
  lines.push('## Additional prop types')
  lines.push('')
  lines.push('Interfaces not bound to a single exported function (slot components, variants).')
  lines.push('')
  for (const o of orphans) emit(o.name, o, [])
}

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, lines.join('\n') + '\n', 'utf8')

const bytes = fs.statSync(outFile).size
console.log(
  `▸ api       docs/api.md  ${sortedFns.length} components, ${interfaces.length} interfaces, ` +
    `${(bytes / 1024).toFixed(1)} KB`,
)
