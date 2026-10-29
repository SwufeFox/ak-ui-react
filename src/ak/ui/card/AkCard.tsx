import type { ElementType, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest('button, input, select, textarea, a, [role="button"], [role="checkbox"], [role="switch"]'),
  )
}

export type AkCardVariant = 'default' | 'outline' | 'stripe' | 'place'

export interface AkCardProps extends HTMLAttributes<HTMLElement> {
  /** Element to render as, e.g. 'div' | 'article' | 'section' | 'li'. */
  as?: ElementType
  /** 外观档位：default / outline / stripe / place。 */
  variant?: AkCardVariant
  /** 尺寸档：控制内边距、子块间距与标题字号。 */
  size?: AkControlSize
  /** 是否开启悬停提亮/浮起动效。 */
  hoverable?: boolean
  /** 是否为可交互卡片（具备鼠标指针、点击沉浸与键盘焦点）。 */
  interactive?: boolean
  /** 是否处于选中状态。 */
  selected?: boolean
  /** 逐实例令牌覆盖，例如 `{ '--ak-card-bg': '#171a1d' }`。 */
  tokens?: AkTokens
}

export function AkCard({
  as: Tag = 'div',
  variant = 'default',
  size = 'md',
  hoverable = false,
  interactive = false,
  selected = false,
  tokens,
  className,
  style,
  children,
  ...rest
}: AkCardProps) {
  const isButton = Tag === 'button'
  return (
    <Tag
      {...rest}
      {...sizeAttrs(size)}
      data-slot="ak-card"
      data-variant={variant}
      data-selected={selected || undefined}
      aria-selected={selected || undefined}
      role={!isButton && interactive && rest.onClick ? 'button' : rest.role}
      tabIndex={interactive && rest.tabIndex === undefined ? 0 : rest.tabIndex}
      onClick={(e: MouseEvent<HTMLElement>) => {
        if (isInteractiveTarget(e.target)) return
        if (interactive) playTactileSound('click', 0.15)
        rest.onClick?.(e)
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (!isButton && interactive && rest.onClick && (e.key === 'Enter' || e.key === ' ')) {
          if (isInteractiveTarget(e.target)) return
          e.preventDefault()
          playTactileSound('click', 0.15)
          rest.onClick(e as unknown as MouseEvent<HTMLElement>)
        }
        rest.onKeyDown?.(e)
      }}
      className={cx(
        'ak-card',
        variantClass('ak-card', variant),
        hoverable && 'ak-card--hoverable',
        interactive && 'ak-card--interactive',
        selected && 'ak-card--selected',
        className,
      )}
      style={tokenStyle(tokens, style)}
    >
      {children}
    </Tag>
  )
}

type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
  /** 逐实例令牌覆盖（例如只调标题字号 `'--ak-card-title-fs'`）。 */
  tokens?: AkTokens
}

export function AkCardHeader({ className, children, tokens, style, ...rest }: SlotProps) {
  return (
    <header {...(rest as HTMLAttributes<HTMLElement>)} className={cx('ak-card__header', className)} style={tokenStyle(tokens, style)} data-slot="ak-card-header">
      {children}
    </header>
  )
}

export function AkCardTitle({ className, children, tokens, style, ...rest }: SlotProps) {
  return (
    <h3 {...(rest as HTMLAttributes<HTMLHeadingElement>)} className={cx('ak-card__title', className)} style={tokenStyle(tokens, style)} data-slot="ak-card-title">
      {children}
    </h3>
  )
}

export function AkCardDescription({ className, children, ...rest }: SlotProps) {
  return (
    <p {...(rest as HTMLAttributes<HTMLParagraphElement>)} className={cx('ak-card__description', className)} data-slot="ak-card-description">
      {children}
    </p>
  )
}

export function AkCardContent({ className, children, ...rest }: SlotProps) {
  return (
    <div {...rest} className={cx('ak-card__content', className)} data-slot="ak-card-content">
      {children}
    </div>
  )
}

export function AkCardFooter({ className, children, ...rest }: SlotProps) {
  return (
    <footer {...rest} className={cx('ak-card__footer', className)} data-slot="ak-card-footer">
      {children}
    </footer>
  )
}
