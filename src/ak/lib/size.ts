/**
 * 控件尺寸档。
 *
 * 三档刻意只映射到**控制高度令牌**，不映射字号/字距 —— 排版归 `tokens` 管，
 * 档位只负责"占多大的位"。这样 `size` 与 `tokens` 互不打架：
 * `size="sm"` 缩矮，`tokens={{ '--ak-fs-sm': '0.7rem' }}` 缩字，两者可以同时用。
 */
export type AkControlSize = 'sm' | 'md' | 'lg'

/**
 * 把尺寸档转成 `data-ak-size` 属性值。
 *
 * ⚠️ 用 data 属性而不是 BEM 修饰类（`--sm`）：样式表里尺寸是**共享的**一组
 * `[data-ak-size]` 规则，挂在任何 `[data-slot]` 上都能生效。这样新增组件
 * 只要写上 `{...sizeAttrs(size)}` 就自动获得三档，不必再补一条 `&--sm`。
 */
export function sizeAttrs(size: AkControlSize = 'md'): { 'data-ak-size': AkControlSize } {
  return { 'data-ak-size': size }
}
