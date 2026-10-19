import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

/**
 * 指令面板（command）。
 *
 * ⚠️ **上游只有样式、没有组件**：`src/scss/_ak-command.scss` 是完整实现的 335 行
 * （8 个色调/布局变体、水印、角标、当前值、hover/active/focus 态、reduced-motion、
 * 移动端断点），但仓库里**没有任何 Vue 组件**引用它。所以这批是纯「有样式、缺出口」。
 *
 * ── ⚠️⚠️ 容器单位契约（用之前必须知道）────────────────────────────────
 * 这套样式**几乎每个尺寸都用容器查询单位**：`padding: clamp(…, 1cqw, …)`、
 * `font-size: clamp(1.1rem, 2.7cqw, 2.85rem)`、`__operation` 变体更是
 * `font-size: 40cqh` / `padding: 12cqh`。
 *
 * **`cqw` 相对最近的「尺寸容器」祖先解析；没有容器祖先时回退到视口。**
 * 按上游数值反推：`cqw` 是按**满屏仪表盘**设计的
 * （1440px 宽 → 1cqw = 14.4px → label 2.7cqw ≈ 39px，正好落在 clamp 上界 2.85rem 附近）。
 *
 * 代价（这是真问题，不是理论）：**如果把它放进一个声明了 `container-type: size` 的
 * 340px 宽小容器里，cqw 解析成 1% × 340 = 3.4px，标签会缩到约 9px。**
 * 所以要么放进占满视口的外壳，要么给 `AkCommandGrid` 传 `container`，
 * 让它自己声明 `container-type: inline-size`，使 `cqw` 相对网格宽度（不会压扁自动高度）。
 * `operation` 的 `cqh` 则继续相对外层尺寸容器；要在嵌入式容器里精确缩放，
 * 请在宿主外壳上声明 `container-type: size` 并给出明确高度。
 * ─────────────────────────────────────────────────────────────────────
 */

/** 色调。`default` 不加修饰符类（走 `.ak-command` 自己的默认值）。 */
export type AkCommandTone = 'default' | 'paper' | 'primary' | 'muted' | 'dark' | 'cyan' | 'accent'

/** 布局。`operation` 是那张大字排版的操作卡（透明底、40cqh 大字、无边框底条）。 */
export type AkCommandLayout = 'default' | 'wide' | 'wide-mobile' | 'vertical' | 'operation' | 'split'

export interface AkCommandProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 主标签（`.ak-command__label`，衬线大字）。 */
  label?: ReactNode
  /** 副信息（`.ak-command__meta`，小号加字距，溢出省略号）。 */
  meta?: ReactNode
  /** 右上角角标（`.ak-command__badge`，橙底深字）。 */
  badge?: ReactNode
  /** 右上/中部当前值徽标（`.ak-command__current`）。 */
  current?: ReactNode
  /** 背景水印（`.ak-command__watermark`，旋转 -5°、透明度 .17）。 */
  watermark?: ReactNode
  /** 色调。 */
  tone?: AkCommandTone
  /** 布局。 */
  layout?: AkCommandLayout
  /**
   * 选中态。**注意样式表认的是 `aria-pressed="true"` 而不是类**
   * （`.ak-command[aria-pressed="true"]::before`）→ 底部的信号色条由它驱动。
   */
  pressed?: boolean
  /** 渲染成什么标签。默认 `button`（样式表自带 cursor:pointer 与 focus-visible 态）。 */
  as?: ElementType
  children?: ReactNode
}

/**
 * 一张指令卡。底部那条信号色条由 `pressed` 驱动（对应上游的 `aria-pressed`），
 * 不是靠额外的类名 —— 这一点照抄样式表的机制。
 */
export function AkCommand({
  label,
  meta,
  badge,
  current,
  watermark,
  tone = 'default',
  layout = 'default',
  pressed = false,
  as: Tag = 'button',
  className,
  children,
  ...rest
}: AkCommandProps) {
  // button 元素不给 type 会在 form 里变成 submit，这里补上默认值
  const tagProps = Tag === 'button' ? { type: 'button' as const } : {}

  return (
    <Tag
      {...tagProps}
      {...rest}
      className={cx(
        'ak-command',
        variantClass('ak-command', tone),
        variantClass('ak-command', layout),
        className,
      )}
      data-slot="ak-command"
      data-tone={tone}
      data-layout={layout}
      // 上游样式表用属性选择器驱动选中条，所以这里必须落到真属性上
      aria-pressed={pressed ? true : undefined}
    >
      {watermark ? <span className="ak-command__watermark">{watermark}</span> : null}
      {badge ? <span className="ak-command__badge">{badge}</span> : null}
      {current ? <span className="ak-command__current">{current}</span> : null}
      {label ? <span className="ak-command__label">{label}</span> : null}
      {meta ? <span className="ak-command__meta">{meta}</span> : null}
      {children}
    </Tag>
  )
}

export interface AkCommandGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 是否让网格自己声明 `container-type: inline-size`。
   *
   * 上游设计里容器是**满屏仪表盘**（`.ak-dashboard` 声明了 `container-type: size`）。
   * 如果在外面已经有这样的**尺寸容器**，保持 `false`（默认），`cqw` 就跟随那个外壳。
   * 如果是嵌入式用法、外面没有容器，传 `true` —— 网格声明 `container-type: inline-size`，
   * 让 `cqw` 按自身宽度计算；不会使用 `size` containment，避免自动高度坍塌。
   * `operation` 的高度单位 `cqh` 仍跟随最近的外层尺寸容器（或视口）。
   */
  container?: boolean
  children?: ReactNode
}

/**
 * 指令网格：3 列（`≤36rem` 时降为 2 列，见样式表的媒体查询），
 * 宽度 `min(34rem, 100%)`。`wide` 布局的卡片跨 2 列。
 */
export function AkCommandGrid({ container = false, className, children, style, ...rest }: AkCommandGridProps) {
  const merged: CSSProperties = container
    ? ({ containerType: 'inline-size', ...style } as CSSProperties)
    : (style as CSSProperties)

  return (
    <div
      {...rest}
      className={cx('ak-command-grid', className)}
      data-slot="ak-command-grid"
      data-container={container || undefined}
      style={merged}
    >
      {children}
    </div>
  )
}

export interface AkCommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** `recruitment` 是那条带标题栏的青色双列组（干员招募面板那种）。 */
  variant?: 'default' | 'recruitment'
  /** 组标题（`.ak-command-group__label`，仅 `recruitment` 有位置）。 */
  label?: ReactNode
  children?: ReactNode
}

/** 指令组容器。`recruitment` 变体会画顶部标题栏并把子卡片压成双列。 */
export function AkCommandGroup({ variant = 'default', label, className, children, ...rest }: AkCommandGroupProps) {
  return (
    <div
      {...rest}
      className={cx('ak-command-group', variantClass('ak-command-group', variant), className)}
      data-slot="ak-command-group"
      data-variant={variant}
    >
      {label ? <span className="ak-command-group__label">{label}</span> : null}
      {children}
    </div>
  )
}
