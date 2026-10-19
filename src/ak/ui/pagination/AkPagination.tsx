import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'

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
  className,
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

  return (
    <div {...rest} className={cx('ak-pagination', className)} data-slot="ak-pagination">
      <button
        type="button"
        className="prev"
        aria-label={previousLabel}
        disabled={disabled('prev')}
        onClick={() => go(current - 1)}
      >
        {previousIcon ?? <span aria-hidden="true">‹</span>}
      </button>

      <div className="cur" aria-live="polite">
        {title ? <span className="title">{title}</span> : null}
        <span className="label">
          {current} / {last}
        </span>
        <span className="number">{String(current).padStart(2, '0')}</span>
      </div>

      <button
        type="button"
        className="next"
        aria-label={nextLabel}
        disabled={disabled('next')}
        onClick={() => go(current + 1)}
      >
        {nextIcon ?? <span aria-hidden="true">›</span>}
      </button>
    </div>
  )
}
