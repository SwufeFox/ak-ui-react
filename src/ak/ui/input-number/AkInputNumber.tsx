import { useCallback, useEffect, useRef, type InputHTMLAttributes } from 'react'
import { clampRange, finite } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

export interface AkInputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max' | 'step' | 'size'> {
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
  /** 尺寸档：高度、左右快捷按钮和步进图标一起缩放。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖；可用 `--ak-input-number-width` 调整整体宽度。 */
  tokens?: AkTokens
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
  size = 'md',
  tokens,
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

  // 长按连按手感优化：按住连续步进，松开即停，单次点击不重复触发。
  const valueRef = useRef(normalizedValue)
  valueRef.current = normalizedValue
  const stepRef = useRef(normalizedStep)
  stepRef.current = normalizedStep
  const boundsRef = useRef({ lower, upper })
  boundsRef.current = { lower, upper }
  const updateRef = useRef(updateValue)
  updateRef.current = updateValue

  const timerRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const pointerHandledRef = useRef(false)

  const clearRepeat = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => clearRepeat, [clearRepeat])

  const startRepeat = (dir: 1 | -1) => {
    if (disabled) return
    clearRepeat()
    pointerHandledRef.current = true

    const doStep = () => {
      const cur = valueRef.current
      const stepVal = stepRef.current
      const { lower: minVal, upper: maxVal } = boundsRef.current
      const next = cur + dir * stepVal
      if ((dir > 0 && cur >= maxVal) || (dir < 0 && cur <= minVal)) {
        playTactileSound('warn', 0.1)
        clearRepeat()
        return
      }
      playTactileSound('step', 0.12)
      updateRef.current(next)
    }

    doStep()
    // 350ms 后开启快速连按（每 65ms 一步）
    timerRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(doStep, 65)
    }, 350)
  }

  const handlePointerDown = (dir: 1 | -1) => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || disabled) return
    event.preventDefault()
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {}
    startRepeat(dir)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {}
    clearRepeat()
  }

  const handleClick = (dir: 1 | -1) => () => {
    if (pointerHandledRef.current) {
      pointerHandledRef.current = false
      return
    }
    if ((dir > 0 && normalizedValue >= upper) || (dir < 0 && normalizedValue <= lower)) {
      playTactileSound('warn', 0.1)
      return
    }
    playTactileSound('step', 0.12)
    updateValue(normalizedValue + dir * normalizedStep)
  }

  return (
    <div
      className={className ? `ak-input-number ${className}` : 'ak-input-number'}
      {...sizeAttrs(size)}
      data-slot="ak-input-number"
      data-disabled={disabled || undefined}
      style={tokenStyle(tokens)}
    >
      <button
        type="button"
        className="ak-input-number__increase"
        aria-label={increaseLabel}
        disabled={disabled || normalizedValue >= upper}
        onPointerDown={handlePointerDown(1)}
        onPointerUp={handlePointerUp}
        onPointerLeave={clearRepeat}
        onPointerCancel={handlePointerUp}
        onClick={handleClick(1)}
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
        onPointerDown={handlePointerDown(-1)}
        onPointerUp={handlePointerUp}
        onPointerLeave={clearRepeat}
        onPointerCancel={handlePointerUp}
        onClick={handleClick(-1)}
      >
        <svg className="ak-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 11h14v2H5z" />
        </svg>
      </button>
      <button
        type="button"
        className="ak-input-number__max"
        disabled={disabled || normalizedValue >= upper}
        onClick={() => {
          playTactileSound('toggle', 0.14)
          updateValue(upper)
        }}
      >
        {maxLabel}
      </button>
      <button
        type="button"
        className="ak-input-number__min"
        disabled={disabled || normalizedValue <= lower}
        onClick={() => {
          playTactileSound('toggle', 0.14)
          updateValue(lower)
        }}
      >
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
          playTactileSound('step', 0.1)
          updateValue(parsed)
        }}
      />
    </div>
  )
}
