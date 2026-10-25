import type { HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

export type AkTagVariant = 'default' | 'advanced' | 'danger' | 'neutral'
export type AkStatusVariant = 'default' | 'warning' | 'critical' | 'offline'

export interface AkTagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 语义档位。 */
  variant?: AkTagVariant
  /** 尺寸档。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkTag({ variant = 'default', size = 'md', tokens, className, style, children, ...rest }: AkTagProps) {
  return (
    <span
      {...rest}
      {...sizeAttrs(size)}
      data-slot="ak-tag"
      data-variant={variant}
      className={cx('ak-tag', variantClass('ak-tag', variant), className)}
      style={tokenStyle(tokens, style)}
    >
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
  /** 尺寸档：信号点直径与字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkStatus({ detail = '', label = 'Online', variant = 'default', size = 'md', tokens, className, style, ...rest }: AkStatusProps) {
  return (
    <span
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-status', variantClass('ak-status', variant), className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-status"
      data-variant={variant}
    >
      <span className="ak-status__signal" aria-hidden="true" />
      <span className="ak-status__label">{label}</span>
      <span className="ak-status__detail">{detail}</span>
    </span>
  )
}
