import type { HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

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
  /** 尺寸档：内距、色条宽度与字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-notice-bar': '0.5rem' }`。 */
  tokens?: AkTokens
}

export function AkNotice({ code = 'RI / INFO', role, title = '', variant = 'info', size = 'md', tokens, className, style, children, ...rest }: AkNoticeProps) {
  const semanticRole = role ?? (variant === 'danger' ? 'alert' : 'status')
  return (
    <aside
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-notice', variantClass('ak-notice', variant, 'info'), className)}
      style={tokenStyle(tokens, style)}
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
