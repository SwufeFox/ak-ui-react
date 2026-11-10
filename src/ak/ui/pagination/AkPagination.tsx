import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

/**
 * 翻页控件。
 *
 * 上游 SCSS 的 `.ak-pagination` 早已写好（固定 16rem 宽、左上一段时间轴式的
 * 「上一 / 当前 / 下一」三段布局），但一直没有 React 组件 —— 又一个「有实现、没出口」。
 *
 * 结构照样式表来：`.prev` / `.cur`（内含 `.title` + `.label` + `.number`）/ `.next`。
 */

export interface AkPaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'> {
  /** 当前页（从 1 开始）。 */
  page: number
  /** 总页数。 */
  total: number
  /** 翻页回调，参数是目标页。 */
  onPageChange?: (page: number) => void
  /** 当前页上方的小标题（`.cur .title`）。 */
  title?: ReactNode
  /** 上一页按钮的无障碍名。 */
  previousLabel?: string
  /** 下一页按钮的无障碍名。 */
  nextLabel?: string
  /** 替换默认的箭头图标。 */
  previousIcon?: ReactNode
  nextIcon?: ReactNode
  /** 循环：到首/末页时回卷。 */
  loop?: boolean
  /**
   * 页码形态：渲染一排页码按钮（`.ak-pagination__item`）而不是「上一 / 当前 / 下一」
   * 三段式。当前页带 `.is-active`，被禁用的页码带 `.is-disabled`，中间跳过的页码
   * 用 `.ak-pagination__ellipsis` 表示。缺省仍是三段式。
   */
  numbered?: boolean
  /**
   * 页码形态下不可点的页码（缺省时全部可点）。被禁用的页码会带 `.is-disabled`。
   */
  disabledPages?: readonly number[]
  /**
   * 页码形态下导航地标的无障碍名，默认 `Pagination`。
   */
  navLabel?: string
  /** 尺寸档：整体宽高、箭头区宽度、页码字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-pagination-w': '100%' }`。 */
  tokens?: AkTokens
}

/** 页码窗口：首尾 + 当前页附近，中间用省略号收口。 */
function pageWindow(current: number, last: number): (number | 'ellipsis')[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages = new Set<number>([1, last, current])
  if (current - 1 > 1) pages.add(current - 1)
  if (current + 1 < last) pages.add(current + 1)
  const sorted = [...pages].sort((a, b) => a - b)
  const out: (number | 'ellipsis')[] = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) out.push('ellipsis')
    out.push(page)
  })
  return out
}

export function AkPagination({
  page,
  total,
  onPageChange,
  title,
  previousLabel = '上一页',
  nextLabel = '下一页',
  previousIcon,
  nextIcon,
  loop = false,
  numbered = false,
  disabledPages,
  navLabel = 'Pagination',
  size = 'md',
  tokens,
  className,
  style,
  ...rest
}: AkPaginationProps) {
  const last = Math.max(1, Math.floor(total))
  const current = Math.min(last, Math.max(1, Math.floor(page)))
  const atFirst = current <= 1
  const atLast = current >= last

  const go = (next: number) => {
    if (loop) {
      onPageChange?.(next < 1 ? last : next > last ? 1 : next)
      return
    }
    if (next < 1 || next > last) return
    onPageChange?.(next)
  }

  const disabled = (which: 'prev' | 'next') => (!loop && (which === 'prev' ? atFirst : atLast))

  const prevButton = (
    <button
      type="button"
      className="prev"
      aria-label={previousLabel}
      disabled={disabled('prev')}
      onClick={() => go(current - 1)}
    >
      {previousIcon ?? <span aria-hidden="true">‹</span>}
    </button>
  )

  const nextButton = (
    <button
      type="button"
      className="next"
      aria-label={nextLabel}
      disabled={disabled('next')}
      onClick={() => go(current + 1)}
    >
      {nextIcon ?? <span aria-hidden="true">›</span>}
    </button>
  )

  if (numbered) {
    const blocked = new Set(disabledPages ?? [])
    return (
      <div
        {...rest}
        {...sizeAttrs(size)}
        className={cx('ak-pagination', className)}
        // 页码形态下不需要三段式那块写死颜色的灰底，宽度也交给内容。
        style={tokenStyle({ '--ak-pagination-bg': 'transparent', '--ak-pagination-w': 'auto' }, tokenStyle(tokens, style))}
        data-slot="ak-pagination"
        data-variant="numbers"
        role="navigation"
        aria-label={navLabel}
      >
        {prevButton}
        {pageWindow(current, last).map((entry, index) =>
          entry === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="ak-pagination__ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              className={cx(
                'ak-pagination__item',
                entry === current && 'is-active',
                blocked.has(entry) && 'is-disabled',
              )}
              aria-current={entry === current ? 'page' : undefined}
              disabled={blocked.has(entry)}
              onClick={() => go(entry)}
            >
              {entry}
            </button>
          ),
        )}
        {nextButton}
      </div>
    )
  }

  return (
    <div
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-pagination', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-pagination"
    >
      {prevButton}

      <div className="cur">
        {title ? <span className="title">{title}</span> : null}
        {/* Live region covers only the page indicator, so the whole control
            (and its static title) is not re-announced on every page change. */}
        <span className="label" aria-live="polite" aria-atomic="true">
          {current} / {last}
        </span>
        {/* The padded number repeats the label visually; keep it out of the
            accessibility tree so the page is announced only once. */}
        <span className="number" aria-hidden="true">{String(current).padStart(2, '0')}</span>
      </div>

      {nextButton}
    </div>
  )
}
