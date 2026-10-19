import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { clampRange, cx, finite, toPercent, variantClass } from '../../lib/utils'

export type AkProgressVariant = 'default' | 'warning' | 'danger'
export type AkGaugeVariant = 'default' | 'warning'

export interface AkProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 名称，同时用于 `aria-label`，默认 `Progress`。 */
  label?: ReactNode
  /** 区间上限。 */
  max?: number
  /** 区间下限。 */
  min?: number
  /** 当前值，会夹到区间内。 */
  value?: number
  /** Custom text for the right-hand value readout. Defaults to the rounded percentage. */
  valueLabel?: ReactNode
  /** 外观档位。 */
  variant?: AkProgressVariant
}

export function AkProgress({ label = 'Progress', max = 100, min = 0, value = 0, valueLabel = '', variant = 'default', className, style, ...rest }: AkProgressProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 100))
  const normalized = clampRange(value, lower, upper)
  const percentage = toPercent(normalized, lower, upper)

  return (
    <div
      {...rest}
      className={cx('ak-progress', variantClass('ak-progress', variant), className)}
      data-slot="ak-progress"
      role="progressbar"
      aria-label={typeof label === 'string' ? label : undefined}
      aria-valuemax={upper}
      aria-valuemin={lower}
      aria-valuenow={normalized}
      data-variant={variant}
      style={{ ...style, '--ak-progress-value': `${percentage}%` } as CSSProperties}
    >
      <div className="ak-progress__header">
        <span>{label}</span>
        <span className="ak-progress__value">{valueLabel || `${Math.round(percentage)}%`}</span>
      </div>
      <div className="ak-progress__track">
        <span className="ak-progress__fill" />
      </div>
    </div>
  )
}

export interface AkGaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 名称，同时用于 `aria-label`，默认 `Deploy`。 */
  label?: ReactNode
  /** 区间上限。 */
  max?: number
  /** 区间下限。 */
  min?: number
  /** 数值单位后缀，默认 `percent`。 */
  unit?: ReactNode
  /** 当前值，会夹到区间内。 */
  value?: number
  /** 外观档位。 */
  variant?: AkGaugeVariant
}

export function AkGauge({ label = 'Deploy', max = 100, min = 0, unit = 'percent', value = 0, variant = 'default', className, style, ...rest }: AkGaugeProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 100))
  const normalized = clampRange(value, lower, upper)
  const percentage = toPercent(normalized, lower, upper)

  return (
    <div
      {...rest}
      className={cx('ak-gauge', variantClass('ak-gauge', variant), className)}
      data-slot="ak-gauge"
      role="progressbar"
      aria-label={typeof label === 'string' ? label : undefined}
      aria-valuemax={upper}
      aria-valuemin={lower}
      aria-valuenow={normalized}
      data-variant={variant}
      style={{ ...style, '--ak-gauge-value': `${percentage}%` } as CSSProperties}
    >
      <div className="ak-gauge__content">
        <span className="ak-gauge__label">{label}</span>
        <strong className="ak-gauge__value">{normalized}</strong>
        <span className="ak-gauge__unit">{unit}</span>
      </div>
    </div>
  )
}
