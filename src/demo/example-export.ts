import tuneSource from './example-tune.ts?raw'
// Process the entry's ordered @imports before selecting rules from its CSSOM.
import demoStyles from './demo.css?inline'
import { getLocaleMessages, type Locale } from './i18n'
import type { TuneOverrides } from './example-tune'

/** Scope comma-separated selectors without splitting inside functions or attributes. */
function scopeSelectors(selectors: string): string {
  const parts: string[] = []
  let start = 0
  let depth = 0
  let quote = ''
  for (let i = 0; i < selectors.length; i++) {
    const char = selectors[i]!
    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = ''
    } else if (char === '"' || char === "'") quote = char
    else if (char === '(' || char === '[') depth++
    else if (char === ')' || char === ']') depth--
    else if (char === ',' && depth === 0) {
      parts.push(selectors.slice(start, i).trim())
      start = i + 1
    }
  }
  parts.push(selectors.slice(start).trim())
  return parts.map((part) => `:where(.example-standalone) ${part}`).join(', ')
}

const styleCache = new Map<string, string>()
let showcaseRules: CSSRule[] | undefined

function getShowcaseRules(): CSSRule[] {
  if (showcaseRules) return showcaseRules
  const style = document.createElement('style')
  style.media = 'not all'
  style.textContent = demoStyles
  document.head.appendChild(style)
  try {
    if (!style.sheet) throw new Error('Unable to read example styles')
    showcaseRules = Array.from(style.sheet.cssRules)
  } finally {
    style.remove()
  }
  return showcaseRules
}

/** Copy matching compiled showcase rules, scoped to the standalone root. */
export function standaloneCss(source: string): string {
  const classes = new Set(source.match(/\bdemo-[\w-]+/g) ?? [])
  const key = [...classes].sort().join('|')
  const cached = styleCache.get(key)
  if (cached !== undefined) return cached
  const keyframes: CSSKeyframesRule[] = []
  const select = (rules: Iterable<CSSRule>): string[] => Array.from(rules).flatMap((rule) => {
    if (rule instanceof CSSStyleRule) {
      if (rule.selectorText === ':root') {
        const variables = Array.from(rule.style).filter((name) => name.startsWith('--demo-')).map((name) => `${name}: ${rule.style.getPropertyValue(name)};`).join(' ')
        return variables ? [`.example-standalone { ${variables} }`] : []
      }
      const names = rule.selectorText.match(/\.demo-[\w-]+/g)?.map((name) => name.slice(1)) ?? []
      return names.some((name) => classes.has(name)) ? [`${scopeSelectors(rule.selectorText)} { ${rule.style.cssText} }`] : []
    }
    if (rule instanceof CSSKeyframesRule) {
      keyframes.push(rule)
      return []
    }
    if ('cssRules' in rule && /^(?:@media|@supports|@container)\b/.test(rule.cssText)) {
      const children = select((rule as CSSGroupingRule).cssRules)
      return children.length ? [`${rule.cssText.slice(0, rule.cssText.indexOf('{'))}{${children.join('\n')}}`] : []
    }
    return []
  })
  const selected = select(getShowcaseRules()).join('\n')
  const animations = keyframes.filter((rule) => selected.includes(rule.name)).map((rule) => rule.cssText).join('\n')
  const result = `${selected}\n${animations}\n.example-standalone > :not(style) ~ :not(style) { margin-block-start: 1rem; }`
  styleCache.set(key, result)
  return result
}

export function exampleMessages(locale: Locale, source: string, extraKeys: readonly string[] = []): Record<string, string> {
  const dictionary = getLocaleMessages(locale)
  const keys = new Set(extraKeys)
  for (const match of source.matchAll(/(['"])([\w.-]+)\1/g)) {
    if (Object.hasOwn(dictionary, match[2]!)) keys.add(match[2]!)
  }
  return Object.fromEntries([...keys].map((key) => [key, dictionary[key as keyof typeof dictionary] ?? key]))
}

/**
 * 去掉源文件里的 import 语句。
 *
 * 只按行删第一行是不够的：多行 import 块（`import {` 换行写一串名字）会被
 * 删掉开头、留下悬空的 `A, B } from '../../ak'`，生成的独立示例直接语法错误。
 */
function stripImports(source: string): string {
  const lines = source.split('\n')
  const kept: string[] = []
  for (let index = 0; index < lines.length; index++) {
    let line = lines[index]!
    if (!/^import\b/.test(line)) {
      kept.push(line)
      continue
    }
    // 一条 import 语句要么自己写完（`import x from 'y'`），要么跨行到收尾。
    while (
      index + 1 < lines.length &&
      !/from\s+['"][^'"]+['"];?\s*$/.test(line) &&
      !/^import\s+['"][^'"]+['"];?\s*$/.test(line)
    ) {
      index += 1
      line = lines[index]!
    }
  }
  return kept.join('\n')
}

/** Assemble the authored example, real state setup, and the same override adapter. */
export function buildStandalone({ source, locale, overrides, setup, render, extraKeys = [], additionalSource = '' }: {
  source: string
  locale: Locale
  overrides: TuneOverrides
  setup: string
  render: string
  extraKeys?: readonly string[]
  additionalSource?: string
}): string {
  const allSource = `${source}\n${additionalSource}`
  const imports = new Map<string, string>()
  for (const match of allSource.matchAll(/^import\s+(type\s+)?\{([^}]+)\}\s+from\s+['"]\.\.\/\.\.\/ak['"]\s*$/gm)) {
    for (const part of match[2]!.split(',')) {
      const specifier = part.trim()
      if (!specifier) continue
      const typeOnly = Boolean(match[1]) || specifier.startsWith('type ')
      const name = specifier.replace(/^type\s+/, '').trim()
      const binding = name.split(/\s+as\s+/).at(-1)!
      const previous = imports.get(binding)
      if (!previous || (previous.startsWith('type ') && !typeOnly)) imports.set(binding, `${typeOnly ? 'type ' : ''}${name}`)
    }
  }
  const body = stripImports(allSource)
  const core = stripImports(tuneSource)
  const used = `${body}\n${setup}\n${render}\n${core}`
  const values = ['cloneElement', 'useState', 'useRef', 'useEffect', 'useLayoutEffect', 'useMemo', 'useCallback'].filter((name) => new RegExp(`\\b${name}\\b`).test(used))
  const types = ['ReactElement', 'ReactNode', 'Dispatch', 'SetStateAction', 'RefObject', 'CSSProperties', 'MouseEvent'].filter((name) => new RegExp(`\\b${name}\\b`).test(used))
  const messages = exampleMessages(locale, `${allSource}\n${setup}\n${render}`, extraKeys)
  const css = standaloneCss(allSource)
  return `import { ${[...values, ...types.map((name) => `type ${name}`)].join(', ')} } from 'react'\nimport { ${[...imports.values()].join(', ')} } from '@swufefox/ak-ui-react'\nimport '@swufefox/ak-ui-react/style.css'\n\nexport type MessageKey = string\nexport type I18nValue = { t: (key: MessageKey, vars?: Record<string, string | number>) => string }\n${core}\n${body}\nconst messages: Record<string, string> = ${JSON.stringify(messages, null, 2)}\nconst overrides: TuneOverrides = ${JSON.stringify(overrides, null, 2)}\nconst styles = ${JSON.stringify(css)}\n\nexport default function Example() {\n  const t: I18nValue['t'] = (key, vars) => (messages[key] ?? key).replace(/\\{(\\w+)\\}/g, (match, name: string) => vars && name in vars ? String(vars[name]) : match)\n  ${setup}\n  const { tune } = createTuneSession(overrides)\n  return <div className="example-standalone"><style>{styles}</style>${render}</div>\n}\n`
}
