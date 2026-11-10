import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { useMemo, useRef } from 'react'
import { cx, variantClass } from '../../lib/utils'

/**
 * 阵营 / 攻击范围 / 精英阶段 / 材料表 / 快讯横幅
 *
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 * —— packages/css/src/arknights/camp.css · range.css · phase-tabs.css ·
 *    materials.css · news.css
 *
 * 图片一律由宿主通过 props 传入；不引用任何游戏素材。
 */

type DivProps = HTMLAttributes<HTMLDivElement>
type SpanProps = HTMLAttributes<HTMLSpanElement>

// ── 阵营 / 势力 Camp ──────────────────────────────────────────────────

export type AkCampSize = 'md' | 'lg'
export type AkCampVariant = 'default' | 'box'

export interface AkCampProps extends SpanProps {
  /** 势力徽标图片地址（白色线稿，亮色主题下由 CSS 反相）。 */
  src: string
  /** 势力名：显示在徽标右侧；`logoOnly` 时作图片 alt 与悬停提示。 */
  name: ReactNode
  /** 徽标高度：md 28 · lg 48（px）。 */
  size?: AkCampSize
  /** 外观：default 线稿跟主题反相 · box 深底方块、原色白线稿。 */
  variant?: AkCampVariant
  /** 只显示徽标（名字进 alt 与悬停提示）。 */
  logoOnly?: boolean
}

/** 阵营 / 势力徽标 + 名字。 */
export function AkCamp({
  src,
  name,
  size = 'md',
  variant = 'default',
  logoOnly = false,
  className,
  ...rest
}: AkCampProps) {
  const nameText = typeof name === 'string' || typeof name === 'number' ? String(name) : ''

  return (
    <span
      {...rest}
      className={cx(
        'ak-camp',
        variantClass('ak-camp', size, 'md'),
        variantClass('ak-camp', variant, 'default'),
        className,
      )}
      data-slot="ak-camp"
      data-variant={variant}
      {...(logoOnly ? { title: rest.title ?? nameText } : {})}
    >
      <img src={src} alt={logoOnly ? nameText : ''} />
      {logoOnly ? null : <span className="ak-camp__name">{name}</span>}
    </span>
  )
}

// ── 攻击范围 Range ────────────────────────────────────────────────────

/** 一格：相对自身的行 / 列（= 游戏 range_table 的 grids 项），或写成 `[row, col]`。 */
export type AkRangeGrid = { row: number; col: number } | readonly [row: number, col: number]

export type AkRangeSize = 'sm' | 'md' | 'lg'

export interface AkRangeProps extends Omit<DivProps, 'children'> {
  /** 可攻击的格子（相对自身）；col 向前为正，自身 (0, 0) 写不写都行。 */
  grids: readonly AkRangeGrid[]
  /** 尺寸：sm 14 · md 22 · lg 28（px 格边）。 */
  size?: AkRangeSize
  /** 可访问名（aria-label）；默认「攻击范围：自身之外 N 格」。 */
  label?: string
}

/**
 * 攻击范围格。
 *
 * 只铺范围的外接矩形（含自身）：自身 = 实心方块，可攻击格 = 空心描边，
 * 范围外的格子不画（1-1 就是 1×2，不补空格撑成 3×3）。
 */
export function AkRange({ grids, size = 'md', label, className, style, ...rest }: AkRangeProps) {
  const layout = useMemo(() => {
    const on = new Set<string>()
    for (const grid of grids) {
      on.add('row' in grid ? `${grid.row},${grid.col}` : `${grid[0]},${grid[1]}`)
    }
    on.delete('0,0')

    const points: [number, number][] = [[0, 0]]
    for (const key of on) {
      const [row, col] = key.split(',').map(Number)
      points.push([row, col])
    }

    const rows = points.map((point) => point[0])
    const cols = points.map((point) => point[1])
    const r0 = Math.min(...rows)
    const r1 = Math.max(...rows)
    const c0 = Math.min(...cols)
    const c1 = Math.max(...cols)

    const cells: ('self' | 'on' | undefined)[] = []
    for (let row = r0; row <= r1; row += 1) {
      for (let col = c0; col <= c1; col += 1) {
        cells.push(row === 0 && col === 0 ? 'self' : on.has(`${row},${col}`) ? 'on' : undefined)
      }
    }

    return { cols: c1 - c0 + 1, cells, count: on.size }
  }, [grids])

  return (
    <div
      {...rest}
      className={cx('ak-range', variantClass('ak-range', size, 'md'), className)}
      data-slot="ak-range"
      data-size={size}
      role="img"
      aria-label={label ?? `攻击范围：自身之外 ${layout.count} 格`}
      style={{ '--cols': layout.cols, ...style } as CSSProperties}
    >
      {layout.cells.map((cell, index) => (
        <i key={index} className={cell} />
      ))}
    </div>
  )
}

// ── 精英阶段选择器 Phase tabs ────────────────────────────────────────

export interface AkPhaseTabsProps extends Omit<DivProps, 'children'> {
  /** 当前精英阶段 0–2。 */
  value: number
  /** 阶段变化回调（受控）。 */
  onValueChange?: (value: number) => void
  /** 最高精英阶段：只画到这一阶（三星干员 1，一 / 二星 0）。 */
  max?: 0 | 1 | 2
  /** 各阶段图标地址，下标 = 阶段；不传只有文字。 */
  icons?: readonly string[]
  /** 读屏用的组名。 */
  label?: string
}

/**
 * 精英阶段选择器（E0 / E1 / E2）。
 *
 * 语义是单选组（WAI-ARIA Radio Group）而不是页签：它不切换面板，只改一个值，
 * 下游数据跟着重算。方向键在阶段间移动并选中，首尾循环。
 */
export function AkPhaseTabs({
  value,
  onValueChange,
  max = 2,
  icons,
  label = '精英阶段',
  className,
  ...rest
}: AkPhaseTabsProps) {
  const phases = useMemo(() => Array.from({ length: max + 1 }, (_, index) => index), [max])
  const current = Math.min(Math.max(value, 0), max)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const total = phases.length
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (current + 1) % total
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (current - 1 + total) % total
          : undefined
    if (next === undefined) return
    event.preventDefault()
    onValueChange?.(next)
    buttons.current[next]?.focus()
  }

  return (
    <div
      {...rest}
      className={cx('ak-phase-tabs', className)}
      data-slot="ak-phase-tabs"
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {phases.map((phase) => (
        <button
          key={phase}
          type="button"
          role="radio"
          className={cx(phase === current && 'is-active')}
          aria-checked={phase === current}
          tabIndex={phase === current ? 0 : -1}
          ref={(element) => {
            buttons.current[phase] = element
          }}
          onClick={() => onValueChange?.(phase)}
        >
          {icons?.[phase] ? <img src={icons[phase]} alt="" /> : null}
          E{phase}
        </button>
      ))}
    </div>
  )
}

// ── 材料表 Materials ──────────────────────────────────────────────────

export interface AkMaterialsProps extends DivProps {}

/** 材料表容器：左列阶段 / 等级，右列这一步要的材料。 */
export function AkMaterials({ className, children, ...rest }: AkMaterialsProps) {
  return (
    <div {...rest} className={cx('ak-materials', className)} data-slot="ak-materials">
      {children}
    </div>
  )
}

export interface AkMaterialsRowProps extends Omit<SpanProps, 'children'> {
  /** 左列文字（「1 → 2」「精英阶段 0→1」）。 */
  label?: ReactNode
  /** 左列自定义内容，覆盖 `label`。 */
  labelContent?: ReactNode
  /** 这一步要的材料（通常是若干 `AkItem`）。 */
  children?: ReactNode
}

/**
 * 材料表的一行：输出网格的两格——左列标签 + 右列材料。
 *
 * 上游这一行是两个根元素（Vue 的多根 fragment），React 这边也返回 fragment，
 * 所以它只能直接放进 `AkMaterials` 里。
 */
export function AkMaterialsRow({ label, labelContent, className, children, ...rest }: AkMaterialsRowProps) {
  return (
    <>
      <span {...rest} className={cx('ak-materials__label', className)} data-slot="ak-materials-label">
        {labelContent ?? label}
      </span>
      <span className="ak-item-list" data-slot="ak-materials-items">
        {children}
      </span>
    </>
  )
}

export interface AkMaterialsDividerProps extends SpanProps {
  /** 说明文字（「达到精英阶段 1 后解锁」）。 */
  children?: ReactNode
}

/** 材料表里横跨两列的分段说明。 */
export function AkMaterialsDivider({ className, children, ...rest }: AkMaterialsDividerProps) {
  return (
    <span {...rest} className={cx('ak-materials__divider', className)} data-slot="ak-materials-divider">
      {children}
    </span>
  )
}

// ── 快讯横幅 News ─────────────────────────────────────────────────────

export interface AkNewsProps extends Omit<DivProps, 'title'> {
  /** 红块里的字（Bender 大写）。 */
  title?: ReactNode
}

/**
 * Breaking news 横幅（游戏主界面那条）：左边矩形红块 + 反色底的一行正文，
 * 太长时省略号截断。天然只装一条。
 */
export function AkNews({ title = 'Breaking News', className, children, ...rest }: AkNewsProps) {
  return (
    <div {...rest} className={cx('ak-news', className)} data-slot="ak-news">
      <span className="ak-news__label">{title}</span>
      <span className="ak-news__text">{children}</span>
    </div>
  )
}
