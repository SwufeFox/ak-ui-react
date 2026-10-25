import type { CSSProperties, InputHTMLAttributes } from 'react'
import { clampRange, finite } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

// ⚠️ 原生 <input> 的 `size` 是字符数（number），我们这枚是外观档位（string）。
// 不 Omit 会报 TS2430。
export interface AkSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'size'> {
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
  /** 尺寸档：控件高度、轨道粗细与拇指尺寸一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-slider-accent': '#ff5e19' }`。 */
  tokens?: AkTokens
}

export function AkSlider({ label, min = 0, max = 100, step = 1, value, onValueChange, disabled = false, size = 'md', tokens, className, style, ...rest }: AkSliderProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 100))
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const current = clampRange(value, lower, upper)
  const fill = upper === lower ? 0 : ((current - lower) / (upper - lower)) * 100

  return (
    <input
      {...rest}
      {...sizeAttrs(size)}
      className={className ? `ak-slider ${className}` : 'ak-slider'}
      data-slot="ak-slider"
      type="range"
      aria-label={label}
      min={lower}
      max={upper}
      step={increment}
      value={current}
      disabled={disabled}
      // 填充比例是功能状态，必须排在 tokens/style 之后，不允许被覆盖
      style={{ ...tokenStyle(tokens, style), '--ak-slider-fill': `${fill}%` } as CSSProperties}
      onChange={(event) => {
        if (!disabled) onValueChange?.(event.target.valueAsNumber)
      }}
    />
  )
}
