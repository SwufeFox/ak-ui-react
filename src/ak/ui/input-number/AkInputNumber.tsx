import { useEffect, type InputHTMLAttributes } from 'react'
import { clampRange, finite } from '../../lib/utils'

export interface AkInputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max' | 'step'> {
  /** 无障碍名，读屏会念。默认「数值」。 */
  label?: string
  /** 增加按钮的无障碍名。默认「增加」。 */
  increaseLabel?: string
  /** 减少按钮的无障碍名。默认「减少」。 */
  decreaseLabel?: string
  /** 允许的最大值。 */
  max?: number
  /** 「最大」按钮文字。 */
  maxLabel?: string
  /** 允许的最小值。 */
  min?: number
  /** 「最小」按钮文字。 */
  minLabel?: string
  /** 每次增减的步长。 */
  step?: number
  /** 当前值；越界会立刻写回夹紧值。 */
  value?: number
  /** 值变化时回调。 */
  onValueChange?: (value: number) => void
}

export function AkInputNumber({
  disabled = false,
  increaseLabel = '增加',
  decreaseLabel = '减少',
  label = '数值',
  max = 99,
  maxLabel = '最多',
  min = 0,
  minLabel = '最少',
  step = 1,
  value = 0,
  onValueChange,
  className,
  ...rest
}: AkInputNumberProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 99))
  const normalizedValue = clampRange(value, lower, upper)
  const normalizedStep = Number.isFinite(step) ? Math.abs(step) || 1 : 1

  // Mirrors the original's immediate watcher: an out-of-range value is written back clamped.
  useEffect(() => {
    if (normalizedValue !== value) onValueChange?.(normalizedValue)
  }, [normalizedValue, value, onValueChange])

  const updateValue = (next: number) => {
    if (disabled) return
    onValueChange?.(Number(clampRange(next, lower, upper).toFixed(12)))
  }

  return (
    <div className={className ? `ak-input-number ${className}` : 'ak-input-number'} data-slot="ak-input-number" data-disabled={disabled || undefined}>
      <button
        type="button"
        className="ak-input-number__increase"
        aria-label={increaseLabel}
        disabled={disabled || normalizedValue >= upper}
        onClick={() => updateValue(normalizedValue + normalizedStep)}
      >
        <svg className="ak-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
        </svg>
      </button>
      <button
        type="button"
        className="ak-input-number__decrease"
        aria-label={decreaseLabel}
        disabled={disabled || normalizedValue <= lower}
        onClick={() => updateValue(normalizedValue - normalizedStep)}
      >
        <svg className="ak-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 11h14v2H5z" />
        </svg>
      </button>
      <button type="button" className="ak-input-number__max" disabled={disabled || normalizedValue >= upper} onClick={() => updateValue(upper)}>
        {maxLabel}
      </button>
      <button type="button" className="ak-input-number__min" disabled={disabled || normalizedValue <= lower} onClick={() => updateValue(lower)}>
        {minLabel}
      </button>
      <input
        {...rest}
        className="ak-input-number__inner"
        type="number"
        aria-label={label}
        disabled={disabled}
        max={upper}
        min={lower}
        step={normalizedStep}
        value={normalizedValue}
        onChange={(event) => {
          const parsed = Number(event.target.value)
          if (Number.isNaN(parsed)) return
          updateValue(parsed)
        }}
      />
    </div>
  )
}
