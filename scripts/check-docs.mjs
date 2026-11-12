/**
 * 文档示例闸门：llms.txt / 指南 / README 里的 JSX 必须与真实 API 对得上。
 *
 * 为什么需要它：这份仓库的文档是手写的（只有 docs/api.md 是生成的），
 * 2.0 发布前就出现过 `AkTag as="button"`、`AkStatus variant="info"`、
 * `AkCommand tone="danger"` 这类不存在的用法 —— 编译器管不到 markdown，
 * 读者（尤其是把 llms.txt 当规范的模型）会照着抄。
 *
 * 检查三件事：
 *   1. 出现的组件名必须在公开面里（docs/api.md 的组件小节）；
 *   2. JSX 属性必须是该组件真实声明的 prop（原生属性 / aria-* / data-* 除外）；
 *   3. 属性值必须在文档里记录的联合类型之内。
 *
 * 依赖 docs/api.md：build 里排在 gen-api.mjs 之后。
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const apiPath = path.join(root, 'docs/api.md')

if (!fs.existsSync(apiPath)) {
  console.error('docs/api.md 不存在 —— 先跑 node scripts/gen-api.mjs')
  process.exit(1)
}

const api = fs.readFileSync(apiPath, 'utf8')

// ── docs/api.md → 组件 props / 联合类型 ──────────────────────────────
const props = new Map()
const sections = api.split(/\n## /).slice(1)
for (const section of sections) {
  const name = section.slice(0, section.indexOf('\n')).trim()
  if (!/^Ak/.test(name)) continue
  const set = new Set()
  for (const m of section.matchAll(/^\| `(\w+)` \|/gm)) set.add(m[1])
  props.set(name, set)
}

const unions = new Map()
for (const m of api.matchAll(/^\| `(Ak\w+)` \| `([^`]*'[^`]*)` \|/gm)) {
  unions.set(m[1], [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]))
}

/** 属性表里不出现、但任何元素都接受的东西 */
const NATIVE = new Set(
  'className style id key ref children title role tabIndex lang dir href target rel alt src type name value defaultValue checked defaultChecked disabled readOnly required placeholder onClick onChange onInput onKeyDown onKeyUp onKeyPress onFocus onBlur onMouseEnter onMouseLeave onPointerDown onPointerMove onPointerUp onSubmit onSelect onScroll htmlFor form autoComplete rows cols min max step multiple hidden draggable translate slot autoFocus'.split(
    ' ',
  ),
)

// ── 扫描 ──────────────────────────────────────────────────────────────
const sources = ['llms.txt', 'src/demo/guide-content.ts', 'README.md'].filter((rel) =>
  fs.existsSync(path.join(root, rel)),
)

const failures = []
const seen = new Map() // component → Set<attr>，用于「文档覆盖」报告

const lineOf = (text, index) => text.slice(0, index).split('\n').length

for (const rel of sources) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8')

  // 只认 JSX：`<` 前面不能是标识符 / `=`（排除 useRef<AkEntranceHandle> 这类泛型）
  for (const match of text.matchAll(/(^|[^\w=>])<(Ak\w+)([^<>]*?)\/?>/gm)) {
    const [, lead, tag, rawAttrs] = match
    const at = match.index + lead.length
    const where = `${rel}:${lineOf(text, at)}`
    const known = props.get(tag)
    if (!known) {
      failures.push(`${where}  <${tag}> 不在公开面里`)
      continue
    }
    for (const attr of rawAttrs.matchAll(/(?:^|\s)([a-zA-Z][\w-]*)\s*=/g)) {
      const name = attr[1]
      if (NATIVE.has(name) || name.startsWith('aria-') || name.startsWith('data-') || name.startsWith('on')) continue
      if (!known.has(name)) {
        failures.push(`${where}  <${tag} ${name}=…> —— 该组件没有这个 prop`)
      } else {
        if (!seen.has(tag)) seen.set(tag, new Set())
        seen.get(tag).add(name)
      }
    }
    // 联合类型取值
    for (const attr of rawAttrs.matchAll(/(\w+)="([^"]+)"/g)) {
      const [, name, value] = attr
      const row = api
        .split(/\n## /)
        .slice(1)
        .find((s) => s.startsWith(tag + '\n'))
        ?.match(new RegExp('^\\| `' + name + '` \\| `([^`]+)`', 'm'))
      if (!row) continue
      const allowed = unions.get(row[1])
      if (allowed && !allowed.includes(value)) {
        failures.push(`${where}  <${tag} ${name}="${value}"> —— ${row[1]} 允许 ${allowed.join(' | ')}`)
      }
    }
  }
}

// ── 展示页 API 页的手写行：prop 必须真实存在 ──────────────────────────
// doc-data.ts 是手写的双语说明，无法从 .d.ts 生成；但它至少不能写不存在的 prop。
const docDataPath = path.join(root, 'src/demo/doc-data.ts')
const cataloguePath = path.join(root, 'src/demo/catalogue-data.ts')
if (fs.existsSync(docDataPath) && fs.existsSync(cataloguePath)) {
  const docData = fs.readFileSync(docDataPath, 'utf8')
  const catalogue = fs.readFileSync(cataloguePath, 'utf8')
  const categoryComponents = new Map()
  for (const m of catalogue.matchAll(/'(components-\d+)':\s*\[([^\]]*)\]/g)) {
    categoryComponents.set(
      m[1],
      [...m[2].matchAll(/'(\w+)'/g)].map((x) => x[1]),
    )
  }
  const blocks = docData.split(/\n  '(components-\d+)':\s*\{/)
  for (let i = 1; i < blocks.length; i += 2) {
    const id = blocks[i]
    const body = blocks[i + 1] ?? ''
    for (const row of body.matchAll(/\{\s*(?:component: '(\w+)',\s*)?name: '(\w+)'/g)) {
      const [, explicit, prop] = row
      if (NATIVE.has(prop) || prop.startsWith('aria') || prop.startsWith('data')) continue
      if (explicit) {
        const known = props.get(explicit)
        if (!known) failures.push(`doc-data.ts ${id}  ${explicit} 不在公开面里`)
        else if (!known.has(prop)) failures.push(`doc-data.ts ${id}  ${explicit}.${prop} 不是该组件的 prop`)
        continue
      }
      const candidates = categoryComponents.get(id) ?? []
      if (!candidates.length) continue
      if (!candidates.some((component) => props.get(component)?.has(prop))) {
        failures.push(`doc-data.ts ${id}  ${prop} 不属于该分类的任何组件（${candidates.join(', ')}）`)
      }
    }
  }
}

// ── 报告 ──────────────────────────────────────────────────────────────
const unique = [...new Set(failures)]
if (unique.length) {
  console.error(`▸ docs check failed — ${unique.length} 处示例与 API 不符：`)
  for (const line of unique) console.error(`  ${line}`)
  process.exit(1)
}

console.log(
  `▸ docs check  ${sources.length} files, ${seen.size} components referenced, 0 mismatches`,
)
