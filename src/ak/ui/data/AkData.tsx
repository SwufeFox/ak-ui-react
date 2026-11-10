import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

/**
 * 读数与状态小件。
 *
 * 这一组同样来自「上游 SCSS 早已写好、但没有组件出口」：
 * `.ak-counter` / `.ak-level` / `.ak-loading` / `.ak-loading-track` 在样式表里是完整的
 * （含动画、旋转、字号层级），只是从没被暴露出来。本文件不加新样式。
 *
 * 注意 `.ak-loading` 是**方舟自己的加载形状**——一个旋转 45° 的方框 + `ak-radio` 动画，
 * 不是通用的圆环 spinner。所以它叫 `AkSpinner` 但外观是上游那套。
 */

// ── 数值读数（带前后缀图标）────────────────────────────────────────

export interface AkCounterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  /** 前置图标节点（`.ak-counter__prefix`）。 */
  prefixIcon?: ReactNode
  /** 主数值。 */
  value?: ReactNode
  /** 后置图标节点（`.ak-counter__suffix`），常用于加减按钮。 */
  suffixIcon?: ReactNode
}

/**
 * 计数读数：大字号数值 + 两侧图标位。上游给数值加了 text-shadow，
 * 所以它设计上是压在有画面的底上的（资源条那种）。
 */
export function AkCounter({ prefixIcon, value, suffixIcon, className, children, ...rest }: AkCounterProps) {
  return (
    <span {...rest} className={cx('ak-counter', className)} data-slot="ak-counter">
      {prefixIcon ? <span className="ak-counter__prefix">{prefixIcon}</span> : null}
      <span className="ak-counter__content">{value ?? children}</span>
      {suffixIcon ? <span className="ak-counter__suffix">{suffixIcon}</span> : null}
    </span>
  )
}

// ── 等级/关卡标签 ───────────────────────────────────────────────────

export interface AkLevelProps extends HTMLAttributes<HTMLDivElement> {
  /** 上方的标签文字（`.ak-level__label`，样式表默认值是 `OPERATION`）。 */
  label?: ReactNode
  /** 主内容，通常是等级数字或关卡代号。 */
  children?: ReactNode
  /** 内容前的图标位（`.ak-level__prefix-icon`）。 */
  prefixIcon?: ReactNode
}

/**
 * 等级标签：上方一条深色标签带 + 下方白底内容块。
 *
 * 上游的标签文字是通过 `--level-label-text` 变量灌进 `::before` 的（默认 `OPERATION`），
 * 这里把它做成显式节点，同时保留变量名以便宿主覆盖。
 */
export function AkLevel({ label, children, prefixIcon, className, ...rest }: AkLevelProps) {
  return (
    <div {...rest} className={cx('ak-level', className)} data-slot="ak-level">
      {/*
        标签带必须永远渲染：样式表用 `.ak-level__label:empty::before` 在无 label 时
        兜底显示默认的 "OPERATION"。条件渲染掉它会让兜底永远落空。
      */}
      <div className="ak-level__label">{label}</div>
      <div className="ak-level__content">
        {prefixIcon ? <span className="ak-level__prefix-icon">{prefixIcon}</span> : null}
        {children}
      </div>
    </div>
  )
}

// ── 加载 ────────────────────────────────────────────────────────────

/**
 * 加载指示器的形态档位。
 *
 * `default` 是本库的方舟方框（`.ak-loading`），`ripple` 是上游的菱形涟漪
 * （`.ak-spinner`），`bars` 是上游的三根跳条（`.ak-loader`）。
 */
export type AkSpinnerVariant = 'default' | 'ripple' | 'bars'

/**
 * 上游的单枚占位形状。
 *
 * `text` 一行文字、`rect` 长块、`square` 方块、`circle` 圆片，
 * 分别发出 `.ak-skeleton--text` / `--rect` / `--square` / `--circle`。
 */
export type AkSkeletonShape = 'default' | 'text' | 'rect' | 'square' | 'circle'

export interface AkSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** 颜色，喂给 `--ak-loading-color`。 */
  color?: string
  /** 无障碍名。默认 `Loading`。 */
  label?: string
  /**
   * 指示器形态：
   * `default` 是本库的方舟方框（`.ak-loading`），`ripple` 是上游的菱形涟漪（`.ak-spinner`），
   * `bars` 是上游的三根跳条（`.ak-loader`）。
   */
  variant?: AkSpinnerVariant
  /**
   * 指示器下方的说明文字。给了就把指示器与说明竖排包进 `.ak-spin`。
   */
  description?: ReactNode
}

/**
 * 加载指示器。**外观来自上游**：一个 45° 旋转的方框叠一个旋转的方框（`ak-radio` 动画），
 * 不是通用圆环。想换圆环是这个库没有的东西，别假设它有。
 *
 * `variant="ripple"` / `variant="bars"` 是上游并列的另两枚指示器（菱形涟漪 / 三根跳条）。
 */
export function AkSpinner({ color, label = 'Loading', variant = 'default', description, className, style, ...rest }: AkSpinnerProps) {
  const indicatorStyle = tokenStyle(
    color ? ({ '--ak-loading-color': color, '--ak-spinner-color': color } as AkTokens) : undefined,
    style,
  )

  if (variant === 'ripple' || variant === 'bars') {
    if (variant === 'ripple') {
      return (
        <span
          {...rest}
          className={cx('ak-spinner', className)}
          data-slot="ak-spinner"
          role="status"
          aria-label={label}
          style={indicatorStyle}
        />
      )
    }
    return (
      <span
        {...rest}
        className={cx('ak-loader', className)}
        data-slot="ak-loader"
        role="status"
        aria-label={label}
        style={indicatorStyle}
      >
        <i />
        <i />
        <i />
      </span>
    )
  }

  if (description) {
    return (
      <span
        {...rest}
        className={cx('ak-spin', className)}
        data-slot="ak-spin"
        role="status"
        aria-label={label}
        style={indicatorStyle}
      >
        <span className="ak-loading" />
        <span className="ak-spin__desc">{description}</span>
      </span>
    )
  }

  return (
    <span
      {...rest}
      className={cx('ak-loading', className)}
      data-slot="ak-spinner"
      role="status"
      aria-label={label}
      style={indicatorStyle}
    />
  )
}

export interface AkSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** 占位形状。`text` 一行高，`block` 一个方块，`track` 用上游的进度轨占位。 */
  variant?: 'text' | 'block' | 'track'
  /**
   * 上游的单枚占位形状（`.ak-skeleton--text` / `--rect` / `--square` / `--circle`）。
   *
   * ⚠️ 与 `variant` 分开：`variant="text"` 是本库的**多行**占位容器，
   *    `.ak-skeleton--text` 是上游的**单行**占位 —— 两个类名长得像但不是一回事。
   *    给了 `shape` 时以 `shape` 为准。
   */
  shape?: AkSkeletonShape
  /** 行数（仅 `text`）。 */
  lines?: number
  width?: string
  height?: string
}

/**
 * 骨架占位。
 *
 * ⚠️ 上游**没有**通用 skeleton 的样式（`.ak-skeleton` 不存在）。这里提供两种：
 * `track` 用的是上游真实存在的 `.ak-loading-track`；`text` / `block` 是本库补的，
 * 用的是已有令牌（`--ak-surface-sunken` / `--ak-loading-track-color`），不是新造概念。
 */
export function AkSkeleton({ variant = 'text', shape = 'default', lines = 1, width, height, className, style, ...rest }: AkSkeletonProps) {
  const base: React.CSSProperties = { width, height, ...style }

  if (shape !== 'default') {
    return (
      <div
        {...rest}
        className={cx(`ak-skeleton--${shape}`, className)}
        data-slot="ak-skeleton"
        data-variant={shape}
        data-shape={shape}
        style={base}
        role="presentation"
      />
    )
  }

  if (variant === 'track') {
    return (
      <div
        {...rest}
        className={cx('ak-loading-track', className)}
        data-slot="ak-skeleton"
        data-variant="track"
        style={base}
        role="presentation"
      />
    )
  }

  if (variant === 'block') {
    return <div {...rest} className={cx('ak-skeleton-block', className)} data-slot="ak-skeleton" data-variant="block" style={base} role="presentation" />
  }

  return (
    <div {...rest} className={cx('ak-skeleton-text', className)} data-slot="ak-skeleton" data-variant="text" style={base} role="presentation">
      {Array.from({ length: Math.max(1, lines) }, (_, i) => (
        <span key={i} className="ak-skeleton-text__line" />
      ))}
    </div>
  )
}
