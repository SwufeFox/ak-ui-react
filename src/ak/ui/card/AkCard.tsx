import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

export type AkCardVariant = 'default' | 'outline' | 'stripe' | 'place'

export interface AkCardProps extends HTMLAttributes<HTMLElement> {
  /** Element to render as, e.g. 'div' | 'article' | 'section' | 'li'. */
  as?: ElementType
  /** 外观档位：default / outline / stripe / place。 */
  variant?: AkCardVariant
}

export function AkCard({ as: Tag = 'div', variant = 'default', className, children, ...rest }: AkCardProps) {
  return (
    <Tag
      {...rest}
      data-slot="ak-card"
      data-variant={variant}
      className={cx('ak-card', variantClass('ak-card', variant), className)}
    >
      {children}
    </Tag>
  )
}

type SlotProps = HTMLAttributes<HTMLElement> & { children?: ReactNode }

export function AkCardHeader({ className, children, ...rest }: SlotProps) {
  return (
    <header {...(rest as HTMLAttributes<HTMLElement>)} className={cx('ak-card__header', className)} data-slot="ak-card-header">
      {children}
    </header>
  )
}

export function AkCardTitle({ className, children, ...rest }: SlotProps) {
  return (
    <h3 {...(rest as HTMLAttributes<HTMLHeadingElement>)} className={cx('ak-card__title', className)} data-slot="ak-card-title">
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
