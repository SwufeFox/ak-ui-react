import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'

/**
 * 理智（SAN）部件。
 *
 * `_ak-san.scss` 早已写好、但**零组件出口** —— 431 行样式从来没有任何 React 消费者。
 * 这个文件补的就是那个出口，几何与结构全部照样式表，没有新样式。
 *
 * ⚠️ 样式表里有**两代内部结构**：
 *   · 旧版（`.brain` / `.add` / `.cur` / `.total`）只在裸 `.ak-san` 下定义，
 *     是早期那套 11rem 的小部件；
 *   · 现代版（`.ak-san__figure` / `__add` / `__current` / `__total`）**在 `--compact`
 *     与 `--terminal` 两个变体下都有完整定义**。
 * 这里采用现代版 BEM 结构 —— 两代不能混用，混了必然一半没样式。
 */

/** 容器外观：`compact` 是仪表盘用的浅色卡片，`terminal` 是自适应容器尺寸的大面板。 */
export type AkSanVariant = 'compact' | 'terminal'

export interface AkSanProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 当前理智值。 */
  current: number | string
  /** 理智上限；用于 `role="meter"` 的 `aria-valuemax`。 */
  total?: number | string
  /** `total` 缺省时给读屏用的上限，不影响渲染。 */
  limit?: number
  /** 加号按钮的动作。不传则不渲染按钮，避免出现「看着能点其实没反应」的假 UI。 */
  onAdd?: () => void
  /** 加号按钮的无障碍名，默认「增加理智」。 */
  addLabel?: string
  /** 图形层内容（`.ak-san__figure`），通常传一个图标。 */
  figure?: ReactNode
  /** 部件的无障碍名。 */
  label?: string
}

/**
 * 理智计数器本体。
 *
 * 结构照 `_ak-san.scss` 的现代版：`figure`（背景图形）→ `add`（加号）→
 * `current`（大数字）→ `total`（底部深色条）。
 */
export function AkSan({
  current,
  total,
  limit,
  onAdd,
  addLabel = '增加理智',
  figure,
  label = '理智',
  className,
  ...rest
}: AkSanProps) {
  // 数字才有 meter 语义；字符串（如「--」）时退回普通分组，避免 aria-valuenow 变成 NaN
  const numeric = typeof current === 'number' ? current : Number(current)
  const isNumeric = Number.isFinite(numeric)
  const max = limit ?? (Number.isFinite(Number(total)) ? Number(total) : undefined)

  return (
    <div
      {...rest}
      className={cx('ak-san', className)}
      data-slot="ak-san"
      {...(isNumeric
        ? {
            role: 'meter' as const,
            'aria-valuenow': numeric,
            'aria-valuemin': 0,
            ...(max !== undefined ? { 'aria-valuemax': max } : {}),
            'aria-label': label,
          }
        : { role: 'group' as const, 'aria-label': label })}
    >
      {figure ? (
        <div className="ak-san__figure" aria-hidden="true">
          {figure}
        </div>
      ) : null}

      {onAdd ? (
        <button type="button" className="ak-san__add" aria-label={addLabel} onClick={onAdd}>
          <span className="ak-icon" aria-hidden="true">
            +
          </span>
        </button>
      ) : null}

      <div className="ak-san__current">{current}</div>
      {total !== undefined ? <div className="ak-san__total">{total}</div> : null}
    </div>
  )
}

/*
 * ⚠️ 必须 Omit 掉 `title`：HTMLAttributes 把它声明为 `string`，
 * 而这里要放 ReactNode。直接 extends 会 TS2430（AkPopover / AkPagination 踩过同一个坑）。
 */
export interface AkSanContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 外观，见 {@link AkSanVariant}。默认 `compact`。 */
  variant?: AkSanVariant
  /** 顶部小标（`.ak-san-container__eyebrow`，仅 compact 有）。 */
  eyebrow?: ReactNode
  /** 标题（`.ak-san-container__title`，仅 compact 有）。 */
  title?: ReactNode
  /** 标题下方一行，通常放 `AkLevel` 等读数（仅 compact 有）。 */
  meta?: ReactNode
  /** 状态文字（`.ak-san-container__status`，仅 compact 有）。 */
  status?: ReactNode
  /** 水印图形（`.ak-san-container__watermark`，仅 terminal 有）。 */
  watermark?: ReactNode
  /** 计数器的当前值。 */
  current: number | string
  /** 计数器上限。 */
  total?: number | string
  /** `total` 缺省或非数字时给读屏用的上限（透传给内部 `AkSan`）。 */
  limit?: number
  /** 计数器的加号动作。 */
  onAdd?: () => void
  /** 加号按钮的无障碍名。 */
  addLabel?: string
  /** 计数器图形层。 */
  figure?: ReactNode
}

/**
 * 理智面板外壳。
 *
 * ⚠️ 两种变体的 DOM 结构**是不同的**（照样式表，不是照直觉）：
 *   · `compact`  → `.ak-san` 与 `.ak-san-container__info` 是**兄弟**，靠 grid 两列排布
 *   · `terminal` → 外面还有一层 `.ak-san-container__content`（两列 grid），
 *                  水印挂在这一层里，`::after` 画黄条
 * 把两者合并成一套 DOM 会有一半规则落空，所以这里按变体分别渲染。
 */
export function AkSanContainer({
  variant = 'compact',
  eyebrow,
  title,
  meta,
  status,
  watermark,
  current,
  total,
  limit,
  onAdd,
  addLabel,
  figure,
  className,
  children,
  ...rest
}: AkSanContainerProps) {
  const san = (
    <AkSan
      current={current}
      total={total}
      limit={limit}
      onAdd={onAdd}
      addLabel={addLabel}
      figure={figure}
    />
  )

  if (variant === 'terminal') {
    return (
      <div
        {...rest}
        className={cx('ak-san-container', 'ak-san-container--terminal', className)}
        data-slot="ak-san-container"
      >
        <div className="ak-san-container__content">
          {san}
          {watermark ? (
            <div className="ak-san-container__watermark" aria-hidden="true">
              {watermark}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      {...rest}
      className={cx('ak-san-container', 'ak-san-container--compact', className)}
      data-slot="ak-san-container"
    >
      {san}
      <div className="ak-san-container__info">
        {eyebrow ? <div className="ak-san-container__eyebrow">{eyebrow}</div> : null}
        {title ? <div className="ak-san-container__title">{title}</div> : null}
        {meta || status ? (
          <div className="ak-san-container__meta">
            {meta}
            {status ? <div className="ak-san-container__status">{status}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  )
}
