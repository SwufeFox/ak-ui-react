import type { CSSProperties, InputHTMLAttributes } from 'react'
import { clampRange, finite } from '../../lib/utils'

export interface AkSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  /** Accessible name for the range input. */
  label: string
  /** 区间下限。 */
  min?: number
  /** 区间上限。 */
  max?: number
  /** 步长。 */
  step?: number
  /** 当前值。 */
  value: number
  /** 拖动时回调。 */
  onValueChange?: (value: number) => void
}

export function AkSlider({ label, min = 0, max = 100, step = 1, value, onValueChange, disabled = false, className, style, ...rest }: AkSliderProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 100))
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const current = clampRange(value, lower, upper)
  const fill = upper === lower ? 0 : ((current - lower) / (upper - lower)) * 100

  return (
    <input
      {...rest}
      className={className ? `ak-slider ${className}` : 'ak-slider'}
      data-slot="ak-slider"
      type="range"
      aria-label={label}
      min={lower}
      max={upper}
      step={increment}
      value={current}
      disabled={disabled}
      style={{ ...style, '--ak-slider-fill': `${fill}%` } as CSSProperties}
      onChange={(event) => {
        if (!disabled) onValueChange?.(event.target.valueAsNumber)
      }}
    />
  )
}
