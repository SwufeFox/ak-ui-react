import type { CSSProperties } from 'react'

/**
 * 逐实例令牌覆盖。
 *
 * 键必须是组件样式里真实消费的 CSS 变量（`--ak-*`）。值原样写进 inline style，
 * 所以既可以是任意合法 CSS 值，也可以引用别的令牌（`var(--ak-signal-danger)`）。
 *
 * 这枚 prop 是整套主题系统的**逃生口**：不改 SCSS、不写新 class，就能把任何一个
 * 组件调成宿主需要的形状。组件自己的 `variant` / `size` 仍然优先于它 —— 后者是
 * 语义档位，前者是具体数值。
 *
 * ```tsx
 * <AkButton tokens={{ '--ak-button-bg': '#ff5e19', '--ak-button-cut': '14px' }} />
 * ```
 */
export type AkTokens = Record<`--${string}`, string | number>

/**
 * 把 `tokens` 合进 `style`。
 *
 * 顺序是 `tokens` → `style`，于是调用方自己传的 `style` 永远赢：显式内联样式比
 * 令牌覆盖更具体，这符合 CSS 的直觉（越靠外越具体）。
 *
 * 没有 `tokens` 也没有 `style` 时返回 `undefined`，避免给 DOM 挂一个空对象
 * （空 style 会让 React 在每次渲染时都写一次 attribute）。
 */
export function tokenStyle(
  tokens: AkTokens | undefined,
  style?: CSSProperties,
): CSSProperties | undefined {
  if (!tokens) return style
  return { ...(tokens as CSSProperties), ...style }
}
