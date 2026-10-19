import type { HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

export type AkTagVariant = 'default' | 'advanced' | 'danger' | 'neutral'
export type AkStatusVariant = 'default' | 'warning' | 'critical' | 'offline'

export interface AkTagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 语义档位。 */
  variant?: AkTagVariant
}

export function AkTag({ variant = 'default', className, children, ...rest }: AkTagProps) {
  return (
    <span {...rest} data-slot="ak-tag" data-variant={variant} className={cx('ak-tag', variantClass('ak-tag', variant), className)}>
      {children}
    </span>
  )
}

export interface AkStatusProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Secondary text shown after the signal label. */
  detail?: ReactNode
  /** Primary label. Falls back to `Online`, matching the original registry component. */
  label?: ReactNode
  /** 语义档位。 */
  variant?: AkStatusVariant
}

export function AkStatus({ detail = '', label = 'Online', variant = 'default', className, ...rest }: AkStatusProps) {
  return (
    <span
      {...rest}
      className={cx('ak-status', variantClass('ak-status', variant), className)}
      data-slot="ak-status"
      data-variant={variant}
    >
      <span className="ak-status__signal" aria-hidden="true" />
      <span className="ak-status__label">{label}</span>
      <span className="ak-status__detail">{detail}</span>
    </span>
  )
}
