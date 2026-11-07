/**
 * Minimal TSX colorizer for the showcase Code panel.
 *
 * 为什么不引 shiki / prism:它们为「完整语法树 + 主题系统」付体积,而这里只需要
 * 「扫一眼能区分出字符串、注释、标签、属性、关键字」。一个 60 行的状态机就够,
 * 而且不会把 Code 面板的首次渲染变成异步加载。
 *
 * 已知取舍:模板字符串整段按字符串着色(`${}` 内部不细分),泛型参数 `<string>`
 * 会被当成标签名。两者都只是颜色偏差,不会漏字符或错位 —— 这个函数必须保证
 * `tokens.map(t => t.text).join('') === code`,代码内容永远原样输出。
 */

export type TokenKind = 'plain' | 'comment' | 'string' | 'tag' | 'attr' | 'keyword' | 'number'

export interface Token {
  text: string
  kind: TokenKind
}

const KEYWORDS: Record<string, true> = {
  import: true, from: true, export: true, default: true, const: true, let: true, var: true,
  function: true, return: true, type: true, interface: true, extends: true, implements: true,
  if: true, else: true, for: true, of: true, in: true, new: true, async: true, await: true,
  class: true, as: true, satisfies: true, typeof: true, instanceof: true, void: true,
  null: true, undefined: true, true: true, false: true, this: true, throw: true, try: true,
  catch: true, finally: true, switch: true, case: true, break: true, continue: true,
  delete: true, yield: true, readonly: true, enum: true, declare: true, namespace: true,
  keyof: true, infer: true, static: true, get: true, set: true,
}

const IDENT_START = /[A-Za-z_$]/
const IDENT_PART = /[A-Za-z0-9_$]/
const DIGIT = /[0-9]/

/** Split TSX source into colored tokens whose concatenated text equals the input. */
export function tokenizeTsx(code: string): Token[] {
  const tokens: Token[] = []
  let plain = ''

  const flushPlain = () => {
    if (plain) {
      tokens.push({ text: plain, kind: 'plain' })
      plain = ''
    }
  }
  const push = (kind: TokenKind, text: string) => {
    flushPlain()
    tokens.push({ text, kind })
  }

  let index = 0
  let inTag = false
  let expectTagName = false

  while (index < code.length) {
    const char = code[index]!

    if (char === '/' && code[index + 1] === '/') {
      const newline = code.indexOf('\n', index)
      const end = newline === -1 ? code.length : newline
      push('comment', code.slice(index, end))
      index = end
      continue
    }

    if (char === '/' && code[index + 1] === '*') {
      const close = code.indexOf('*/', index + 2)
      const end = close === -1 ? code.length : close + 2
      push('comment', code.slice(index, end))
      index = end
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      let end = index + 1
      while (end < code.length) {
        if (code[end] === '\\') {
          end += 2
          continue
        }
        if (code[end] === char) {
          end += 1
          break
        }
        end += 1
      }
      push('string', code.slice(index, end))
      index = end
      continue
    }

    if (char === '<' && (IDENT_START.test(code[index + 1] ?? '') || code[index + 1] === '/')) {
      inTag = true
      expectTagName = true
      plain += char
      index += 1
      continue
    }

    if (char === '>' && inTag) {
      inTag = false
      expectTagName = false
      plain += char
      index += 1
      continue
    }

    if (inTag && IDENT_START.test(char)) {
      let end = index + 1
      while (end < code.length && IDENT_PART.test(code[end]!)) end += 1
      push(expectTagName ? 'tag' : 'attr', code.slice(index, end))
      expectTagName = false
      index = end
      continue
    }

    if (IDENT_START.test(char)) {
      let end = index + 1
      while (end < code.length && IDENT_PART.test(code[end]!)) end += 1
      const word = code.slice(index, end)
      if (KEYWORDS[word]) push('keyword', word)
      else plain += word
      index = end
      continue
    }

    if (DIGIT.test(char)) {
      let end = index + 1
      while (end < code.length && /[0-9A-Za-z._]/.test(code[end]!)) end += 1
      push('number', code.slice(index, end))
      index = end
      continue
    }

    plain += char
    index += 1
  }

  flushPlain()
  return tokens
}
