import { useEffect, type CSSProperties, type InputHTMLAttributes } from 'react'
import { clampRange, finite } from '../../lib/utils'
import { useControllableState } from '../../lib/useControllableState'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

// ⚠️ 原生 <input> 的 `size` 是字符数（number），我们这枚是外观档位（string）。
// 不 Omit 会报 TS2430。
export interface AkSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  /**
   * Accessible name for the range input, exposed as `aria-label`. Optional when
   * the input is named by a visible `<label>` or a native `aria-label`; the
   * native `aria-label` wins when both are provided.
   */
  label?: string
  /** 区间下限。 */
  min?: number
  /** 区间上限。 */
  max?: number
  /** 正数步长；无效值按 1 处理。值按 min 对齐到最近的步点，恰好居中时取较大值。 */
  step?: number
  /**
   * Controlled value. When defined the slider is controlled and this value
   * wins. Values are clamped and aligned to the native step grid for both
   * the input and fill; normalization does not call `onValueChange`.
   */
  value?: number
  /**
   * Initial value in uncontrolled mode. Ignored whenever `value` is defined.
   * Defaults to `min`. Bounds/step changes persist the normalized value and
   * notify `onValueChange`, so expanding the range cannot restore stale values.
   */
  defaultValue?: number
  /** Called with the normalized value on user input or uncontrolled bounds/step correction. */
  onValueChange?: (value: number) => void
  /** 禁止鼠标、触摸和键盘修改；保持可聚焦并参与表单提交。 */
  readOnly?: boolean
  /** 尺寸档：控件高度、轨道粗细与拇指尺寸一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-slider-accent': '#ff5e19' }`。 */
  tokens?: AkTokens
}

function decimalPlaces(value: number): number {
  const text = String(value)
  const exponentAt = text.indexOf('e')
  const decimalAt = text.indexOf('.')
  const end = exponentAt < 0 ? text.length : exponentAt
  const fraction = decimalAt < 0 ? 0 : end - decimalAt - 1
  return Math.max(0, fraction - (exponentAt < 0 ? 0 : Number(text.slice(exponentAt + 1))))
}

function normalizeValue(value: number | undefined, lower: number, upper: number, step: number): number {
  const clamped = clampRange(value, lower, upper)
  const position = (clamped - lower) / step
  // Keep decimal half-steps from rounding down because of binary division error.
  const steps = Math.round(position + Number.EPSILON * Math.abs(position))
  if (!Number.isFinite(steps)) return clamped
  const precision = Math.max(decimalPlaces(lower), decimalPlaces(step))
  let next = lower + steps * step
  if (precision <= 100) next = Number(next.toFixed(precision))
  if (next > upper) {
    next = lower + (steps - 1) * step
    if (precision <= 100) next = Number(next.toFixed(precision))
  }
  return clampRange(next, lower, upper)
}

export function AkSlider({ label, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, disabled = false, readOnly = false, size = 'md', tokens, className, style, onPointerDown, onKeyDown, ...rest }: AkSliderProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 100))
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const [stateValue, setValue] = useControllableState<number>(
    value,
    normalizeValue(defaultValue, lower, upper, increment),
    onValueChange,
  )
  const current = normalizeValue(stateValue, lower, upper, increment)
  const fill = upper === lower ? 0 : ((current - lower) / (upper - lower)) * 100

  useEffect(() => {
    if (value === undefined && current !== stateValue) setValue(current)
  }, [value, current, stateValue, setValue])

  return (
    <input
      {...rest}
      {...sizeAttrs(size)}
      className={className ? `ak-slider ${className}` : 'ak-slider'}
      data-slot="ak-slider"
      type="range"
      aria-label={rest['aria-label'] ?? label}
      aria-readonly={readOnly || rest['aria-readonly']}
      min={lower}
      max={upper}
      step={increment}
      value={current}
      disabled={disabled}
      readOnly={readOnly}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (readOnly) event.preventDefault()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (readOnly && (
          event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
          event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
          event.key === 'Home' || event.key === 'End' ||
          event.key === 'PageUp' || event.key === 'PageDown'
        )) {
          event.preventDefault()
        }
      }}
      // 填充比例是功能状态，必须排在 tokens/style 之后，不允许被覆盖
      style={{ ...tokenStyle(tokens, style), '--ak-slider-fill': `${fill}%` } as CSSProperties}
      onChange={(event) => {
        if (disabled || readOnly) {
          event.currentTarget.value = String(current)
          return
        }
        playTactileSound('step', 0.1)
        setValue(normalizeValue(event.target.valueAsNumber, lower, upper, increment))
      }}
    />
  )
}
