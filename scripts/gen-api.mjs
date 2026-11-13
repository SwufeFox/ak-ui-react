/**
 * 从构建产物 dist/ui 与 dist/lib 下的所有 .d.ts 生成 API 参考，输出 docs/api.md。
 *
 * 为什么是生成而不是手写：这份库有 60+ 个组件、每个 6-10 个 prop。
 * 手写的 API 表一定会漂移——本仓库已经有过一次教训：`AkVignetteProps.size` 的
 * 注释写着「默认 22%」，而令牌早就改成了 55%。只要文档和源码是两处人写的，
 * 就迟早会对不上。d.ts 里的 JSDoc 是**唯一的真相来源**，所以从这里生成。
 *
 * 公开面以包根 barrel（dist/index.d.ts）为准：barrel 里没有的名字不写进文档，
 * 内部实现也不会漏出去。因此组件之外的东西——useToast 这类 Hook、
 * AkTokens / AkControlSize 这类共享类型、GalleryItem 这类公共数据类型——
 * 同样有文档，不至于只在组件的 prop 表里露个名字。
 *
 * 接在 build 之后跑（见 package.json），产物与文档永远同源。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(root, 'dist')
const distUi = path.join(distRoot, 'ui')
const distLib = path.join(distRoot, 'lib')
const outFile = path.join(root, 'docs/api.md')

if (!fs.existsSync(distUi)) {
  console.error('dist/ui 不存在 —— 先跑 npm run build')
  process.exit(1)
}

// ── 收集 d.ts ────────────────────────────────────────────────────────
const files = []
const walk = (d) => {
  if (!fs.existsSync(d)) return
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.d.ts') || e.name.endsWith('.d.mts')) files.push(p)
  }
}
walk(distUi)
walk(distLib)
// core 里的选项类型（EntranceOptions / ParticleOptions …）是组件的基接口，
// 不扫它们，文档里就只剩一句「Extends X」。
walk(path.join(distRoot, 'core'))

// ── 公开面：包根 barrel 导出了哪些名字 ───────────────────────────────
const publicNames = new Set()
const barrelPath = path.join(distRoot, 'index.d.ts')
if (fs.existsSync(barrelPath)) {
  const barrel = fs.readFileSync(barrelPath, 'utf8')
  for (const m of barrel.matchAll(/export\s+(?:type\s+)?\{([\s\S]*?)\}\s*from/g)) {
    for (const part of m[1].split(',')) {
      const item = part.trim().replace(/^type\s+/, '')
      if (!item) continue
      const name = item.includes(' as ') ? item.split(/\s+as\s+/)[1].trim() : item
      if (name) publicNames.add(name)
    }
  }
}
const isPublic = (name) => publicNames.size === 0 || publicNames.has(name)

// ── 解析 ──────────────────────────────────────────────────────────────

/** 把一段 JSDoc 正文（已剥掉注释定界符）压成单行 */
const flattenDoc = (lines) =>
  lines
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter((l) => l && l !== '/')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

/** 取紧挨在某个位置之前的那段 JSDoc（没有就返回空串） */
const leadDoc = (src, index) => {
  const prefix = src.slice(0, index)
  const leadEnd = prefix.lastIndexOf('*/')
  const leadStart = prefix.lastIndexOf('/**', leadEnd)
  if (leadEnd < 0 || leadStart < 0) return ''
  if (!/^\s*$/.test(prefix.slice(leadEnd + 2))) return ''
  return flattenDoc(prefix.slice(leadStart, leadEnd + 2).replace(/^\/\*\*|\*\/$/g, '').split('\n'))
}

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

/** 读到声明最外层的分号；对象成员内的分号和字符串内容不结束类型。 */
const scanType = (src, index) => {
  let depth = 0
  let quote = ''
  let i = index
  for (; i < src.length; i++) {
    const ch = src[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = ''
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch
    else if (ch === '{' || ch === '(' || ch === '[') depth++
    else if (ch === '}' || ch === ')' || ch === ']') depth--
    else if (ch === ';' && depth === 0) break
  }
  return src.slice(index, i).replace(/\s+/g, ' ').trim()
}

/**
 * 读一个 `export declare function` 声明：名字、参数、返回类型。
 *
 * 返回类型可能是一个对象字面量（useTactileSound 就是），所以不能只读到第一个
 * 分号——按括号深度扫，深度归零时的分号才是声明结束。
 */
const scanFunction = (src, index) => {
  const head = /^export declare function (\w+)\s*\(/.exec(src.slice(index))
  if (!head) return null
  const name = head[1]
  let i = index + head[0].length - 1
  let depth = 0
  let params = ''
  for (; i < src.length; i++) {
    const ch = src[i]
    if (ch === '(') depth++
    else if (ch === ')') {
      depth--
      if (depth === 0) break
    } else params += ch
  }
  let j = i + 1
  let returns = 'void'
  const retHead = /^\s*:\s*/.exec(src.slice(j))
  if (retHead) {
    j += retHead[0].length
    returns = scanType(src, j)
  }
  return { name, params: params.replace(/\s+/g, ' ').trim(), returns }
}

const allInterfaces = [] // 所有接口（含未导出与 core 里的基类型），用于摊平 extends
const functions = [] // { name, params, returns, doc, file }
const typeAliases = [] // { name, type, doc, file }

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  const rel = path.relative(distRoot, f)

  // 接口：导出的 Ak* 进文档，其余（CommonProps / EntranceOptions …）只用于摊平继承。
  // 单行声明（core 里的 ParticleOptions 就是）与多行声明分两趟扫，互不重叠。
  for (const one of src.matchAll(/(?:^|\n)[ \t]*(export )?interface (\w+)(?:\s+extends\s+([^{\n]+?))?\s*\{([^\n{}]*)\}/g)) {
    const [, exported, name, ext, body] = one
    const declStart = one.index + one[0].indexOf(exported ? 'export' : 'interface')
    allInterfaces.push({
      name,
      exported: Boolean(exported),
      extends: (ext || '').trim(),
      doc: leadDoc(src, declStart),
      props: parseInterfaceBody(body.replace(/;/g, ';\n')),
      file: rel,
    })
  }
  // 空接口（`{\n}`）要让「空 body」这一支匹配，否则它会被非贪婪规则吞到下一个接口的收尾；
  // 同时容忍 CRLF —— core 下手工维护的 .d.mts 是 CRLF，ui 下的 tsc 产物是 LF。
  const re = /(?:^|\n)[ \t]*(export )?interface (\w+)(?:\s+extends\s+([^{]+?))?\s*\{\r?\n(?:([\s\S]*?)\r?\n)??\}/g
  let m
  while ((m = re.exec(src))) {
    const [, exported, name, ext, body] = m
    const declStart = m.index + m[0].indexOf(exported ? 'export' : 'interface')
    const doc = leadDoc(src, declStart)
    allInterfaces.push({
      name,
      exported: Boolean(exported),
      extends: (ext || '').trim(),
      doc,
      props: parseInterfaceBody(body || ''),
      file: rel,
    })
  }

  // export declare function …
  for (const fm of src.matchAll(/export declare function /g)) {
    const fn = scanFunction(src, fm.index)
    if (!fn) continue
    functions.push({ ...fn, doc: leadDoc(src, fm.index), file: rel })
  }

  // forwardRef 组件：tsc 发成 `const` 声明而不是 function。漏掉这一类，
  // AkEntrance / AkCountUp / AkMobileMenu / AkSectionNavigator 就没有组件小节，
  // 它们的 props 只会掉进「附加 prop 类型」里。
  for (const cm of src.matchAll(/export declare const (\w+): ([\s\S]*?);\n/g)) {
    const [, name, type] = cm
    if (!/ForwardRefExoticComponent|NamedExoticComponent/.test(type)) continue
    functions.push({ name, params: '', returns: '', doc: leadDoc(src, cm.index), file: rel })
  }

  // export type X = …（变体枚举、共享类型）
  for (const tm of src.matchAll(/export type (\w+) = /g)) {
    const name = tm[1]
    const type = scanType(src, tm.index + tm[0].length)
    typeAliases.push({ name, type, doc: leadDoc(src, tm.index), file: rel })
  }
}

// 公开接口：导出的、名字以 Ak 开头的那些。
const interfaces = allInterfaces.filter((i) => i.exported && /^Ak/.test(i.name))

/**
 * 把 `extends` 指向本地接口的部分摊平。
 *
 * 文档里只写「Extends `CommonProps`」等于没写 —— 读者查不到 CommonProps 里有什么。
 * 纯名字才摊平（`Omit<…>` 这类工具类型保持原样，目标是明确写的「这些原生属性不重复列出」）。
 * 子接口的同名 prop 覆盖父接口。
 */
const interfaceByName = new Map(allInterfaces.map((i) => [i.name, i]))
const expandProps = (iface, seen = new Set()) => {
  if (!iface.extends || seen.has(iface.name)) return iface.props
  seen.add(iface.name)
  const base = /^([A-Za-z_]\w*)$/.exec(iface.extends)
  const parent = base ? interfaceByName.get(base[1]) : undefined
  if (!parent) return iface.props
  const merged = [...expandProps(parent, seen), ...iface.props]
  const byName = new Map(merged.map((p) => [p.name, p]))
  return [...byName.values()]
}
for (const iface of interfaces) iface.props = expandProps(iface)

// ── 组织成文档 ────────────────────────────────────────────────────────
// 组件名 → 它的 *Props 接口。函数名与接口名去掉 Props/字段后对上即可。
const propsByName = new Map(interfaces.map((i) => [i.name, i]))

const componentOf = (fnName) => {
  for (const key of [fnName + 'Props', fnName + 'PropsBase']) {
    if (propsByName.has(key)) return propsByName.get(key)
  }
  return null
}

const publicFunctions = functions.filter((f) => isPublic(f.name))
const sortedFns = [...new Set(publicFunctions.map((f) => f.name))].sort()
const componentFns = sortedFns.filter((n) => n.startsWith('Ak'))
const utilityFns = sortedFns.filter((n) => !n.startsWith('Ak'))

const boundInterfaces = new Set()
for (const fn of sortedFns) {
  const iface = componentOf(fn)
  if (iface) boundInterfaces.add(iface.name)
}

const orphans = interfaces
  .filter((i) => isPublic(i.name))
  .filter((i) => !boundInterfaces.has(i.name))
  .filter((i) => /Props$/.test(i.name))
  .sort((a, b) => a.name.localeCompare(b.name))

// 公共数据类型：既不是某组件的 props、也不是 *Props 的公开接口。
const dataInterfaces = interfaces
  .filter((i) => isPublic(i.name))
  .filter((i) => !boundInterfaces.has(i.name))
  .filter((i) => !/Props$/.test(i.name))
  .sort((a, b) => a.name.localeCompare(b.name))

const publicAliases = typeAliases.filter((t) => isPublic(t.name)).sort((a, b) => a.name.localeCompare(b.name))

const esc = (s) => String(s).replace(/\|/g, '\\|')

/** 已经在组件小节里出现过的说明文字 */
const componentDocs = new Set()

const lines = []
lines.push('# API reference')
lines.push('')
lines.push('> **Generated file — do not edit by hand.** Run `npm run build:api` (or `npm run build`,')
lines.push('> which calls it) to regenerate from the JSDoc in the `dist/{ui,lib,core}` declarations.')
lines.push('')
lines.push('Every public component, hook and shared type. `?` marks an optional prop. Props inherited')
lines.push("from React's `HTMLAttributes` are not repeated here — they pass through unchanged.")
lines.push('')
lines.push('The public surface is the package root: nothing that the root barrel does not export is')
lines.push('listed here.')
lines.push('')
lines.push('## Index')
lines.push('')
const cols = 4
for (let i = 0; i < componentFns.length; i += cols) {
  const row = componentFns
    .slice(i, i + cols)
    .map((n) => `[\`${n}\`](#${n.toLowerCase()})`)
    .join(' · ')
  lines.push('- ' + row)
}
lines.push('')
lines.push('- [Public hooks and utilities](#public-hooks-and-utilities)')
lines.push('- [Shared types](#shared-types)')
lines.push('- [Public data types](#public-data-types)')
if (orphans.length) lines.push('- [Additional prop types](#additional-prop-types)')
lines.push('')

const emitProps = (iface) => {
  if (iface.extends) {
    lines.push(`Extends \`${iface.extends}\`.`)
    lines.push('')
  }
  if (!iface.props.length) {
    lines.push('_(no props of its own)_')
    lines.push('')
    return
  }
  // 全是方法成员的接口（Handle / Api）用「Member」表头，其余是「Prop」。
  const allCallables = iface.props.every((p) => p.type.includes('=>'))
  const key = allCallables ? 'Member' : 'Prop'
  lines.push(`| ${key} | Type | Optional | Description |`)
  lines.push('| --- | --- | --- | --- |')
  for (const p of iface.props) {
    lines.push(`| \`${p.name}\` | \`${esc(p.type)}\` | ${p.optional ? 'yes' : 'no'} | ${esc(p.doc) || '—'} |`)
  }
  lines.push('')
}

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
  emitProps(iface)
}

for (const fn of componentFns) {
  const iface = componentOf(fn)
  emit(fn, iface, [fn])
  // 组件说明常写在紧邻的类型声明之前（源码里就是这样排的），记住它，
  // 免得同一段说明在数据类型那节里又冒出来一次。
  if (iface?.doc) componentDocs.add(iface.doc)
}

// ── 公开的 Hook 与工具函数 ────────────────────────────────────────────
/** 已经在 Hook 小节里写过的类型，公共数据类型那节不再重复 */
const documentedTypes = new Set()
if (utilityFns.length) {
  lines.push('## Public hooks and utilities')
  lines.push('')
  lines.push('Exported from the package root next to the components.')
  lines.push('')
  for (const name of utilityFns) {
    const fn = publicFunctions.find((f) => f.name === name)
    lines.push(`### ${name}`)
    lines.push('')
    if (fn.doc) {
      lines.push(fn.doc)
      lines.push('')
    }
    lines.push('```ts')
    lines.push(`function ${name}(${fn.params}): ${fn.returns}`)
    lines.push('```')
    lines.push('')
    // 返回的是公开接口时，把它的成员一并写出来。
    const returned = propsByName.get(fn.returns)
    const referenced = new Set()
    if (returned && isPublic(returned.name)) {
      documentedTypes.add(returned.name)
      lines.push(`Returns \`${returned.name}\`:`)
      lines.push('')
      emitProps(returned)
      for (const p of returned.props) {
        for (const candidate of dataInterfaces) {
          if (p.type.includes(candidate.name)) referenced.add(candidate.name)
        }
      }
    }
    // Hook 参数或返回接口里引用到的公开类型也补上（AkToastOptions / AkToastHandle）。
    for (const candidate of dataInterfaces) {
      if (documentedTypes.has(candidate.name)) continue
      if (!referenced.has(candidate.name) && !fn.params.includes(candidate.name)) continue
      documentedTypes.add(candidate.name)
      lines.push(`### ${candidate.name}`)
      lines.push('')
      if (candidate.doc && !componentDocs.has(candidate.doc)) {
        lines.push(candidate.doc)
        lines.push('')
      }
      emitProps(candidate)
    }
  }
}

// ── 共享类型 ──────────────────────────────────────────────────────────
if (publicAliases.length) {
  lines.push('## Shared types')
  lines.push('')
  lines.push('Types shared by many components.')
  lines.push('')
  lines.push('| Type | Definition | Description |')
  lines.push('| --- | --- | --- |')
  for (const t of publicAliases) {
    lines.push(`| \`${t.name}\` | \`${esc(t.type)}\` | ${esc(t.doc) || '—'} |`)
  }
  lines.push('')
}

// ── 公共数据类型 ──────────────────────────────────────────────────────
if (dataInterfaces.length) {
  lines.push('## Public data types')
  lines.push('')
  lines.push('Structured values passed to components — item shapes, row shapes, option records.')
  lines.push('')
  for (const iface of dataInterfaces) {
    if (documentedTypes.has(iface.name)) continue
    lines.push(`### ${iface.name}`)
    lines.push('')
    if (iface.doc && !componentDocs.has(iface.doc)) {
      lines.push(iface.doc)
      lines.push('')
    }
    emitProps(iface)
  }
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
  `▸ api       docs/api.md  ${componentFns.length} components, ${utilityFns.length} hooks, ` +
    `${publicAliases.length} shared types, ${dataInterfaces.length} data types, ` +
    `${(bytes / 1024).toFixed(1)} KB`,
)
