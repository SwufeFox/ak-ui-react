import type { HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

export type AkNoticeVariant = 'info' | 'warning' | 'danger' | 'success'

export interface AkNoticeProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Registry-style routing code shown in the left gutter. */
  code?: ReactNode
  /** Overrides the semantic role derived from `variant`. */
  role?: 'alert' | 'status'
  /** 通知标题。 */
  title?: ReactNode
  /** 语义档位，决定左侧色条与路由码颜色。 */
  variant?: AkNoticeVariant
}

export function AkNotice({ code = 'RI / INFO', role, title = '', variant = 'info', className, children, ...rest }: AkNoticeProps) {
  const semanticRole = role ?? (variant === 'danger' ? 'alert' : 'status')
  return (
    <aside
      {...rest}
      className={cx('ak-notice', variantClass('ak-notice', variant, 'info'), className)}
      data-slot="ak-notice"
      data-variant={variant}
      role={semanticRole}
    >
      <span className="ak-notice__code">{code}</span>
      <div className="ak-notice__body">
        <strong className="ak-notice__title">{title}</strong>
        <p className="ak-notice__message">{children}</p>
      </div>
    </aside>
  )
}

/**
 * 通知堆叠容器（`.ak-notice-stack`：grid + min(40rem, 100%) + 0.9rem 间距）。
 *
 * 只是布局壳 —— 别在它身上加语义：每条 `AkNotice` 自己已经是 `role="status"|"alert"`，
 * 外壳再声明一次会把同一件事播报两遍。
 */
export function AkNoticeStack({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={cx('ak-notice-stack', className)} data-slot="ak-notice-stack">
      {children}
    </div>
  )
}
