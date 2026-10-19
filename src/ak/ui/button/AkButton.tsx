import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

export type AkButtonVariant = 'default' | 'outline' | 'action' | 'advanced' | 'light'

export interface AkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders a leading inline-start icon slot. */
  icon?: ReactNode
  /** Stretches the button to the full width of its container. */
  block?: boolean
  /** 外观档位：default / outline / action / advanced / light。 */
  variant?: AkButtonVariant
}

export function AkButton({
  block = false,
  variant = 'default',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: AkButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      data-slot="ak-button"
      data-variant={variant}
      className={cx('ak-button', variantClass('ak-button', variant), block && 'ak-button--block', className)}
    >
      {icon ? (
        <span className="ak-button__icon" data-icon="inline-start">
          {icon}
        </span>
      ) : null}
      <span className="ak-button__label">{children}</span>
    </button>
  )
}
