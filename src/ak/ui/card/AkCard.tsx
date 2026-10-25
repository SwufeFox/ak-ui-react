import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

export type AkCardVariant = 'default' | 'outline' | 'stripe' | 'place'

export interface AkCardProps extends HTMLAttributes<HTMLElement> {
  /** Element to render as, e.g. 'div' | 'article' | 'section' | 'li'. */
  as?: ElementType
  /** 外观档位：default / outline / stripe / place。 */
  variant?: AkCardVariant
  /** 尺寸档：控制内边距、子块间距与标题字号。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-card-bg': '#171a1d' }`。 */
  tokens?: AkTokens
}

export function AkCard({
  as: Tag = 'div',
  variant = 'default',
  size = 'md',
  tokens,
  className,
  style,
  children,
  ...rest
}: AkCardProps) {
  return (
    <Tag
      {...rest}
      {...sizeAttrs(size)}
      data-slot="ak-card"
      data-variant={variant}
      className={cx('ak-card', variantClass('ak-card', variant), className)}
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
