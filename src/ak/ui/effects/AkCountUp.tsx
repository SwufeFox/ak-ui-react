import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createCountUp, type CountUpController } from '../../core/effects.mjs'

export interface AkCountUpProps {
  /** 目标数值。 */
  value: number
  /** 起始数值。 */
  from?: number
  /** 滚动时长（毫秒）。 */
  duration?: number
  /** 开始前延迟（毫秒）。 */
  delay?: number
  /** Clamp of decimal places rendered. */
  decimals?: number
  /** 为真时直接跳到目标值。 */
  disabled?: boolean
  /** 挂载后自动播放。 */
  autoplay?: boolean
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
}

export interface AkCountUpHandle {
  replay: () => void
}

const clampDigits = (value: number | undefined) => Math.min(20, Math.max(0, Math.trunc(Number.isFinite(value) ? (value as number) : 0)))

export const AkCountUp = forwardRef<AkCountUpHandle, AkCountUpProps>(function AkCountUp(
  { value, from = 0, duration = 1000, delay = 0, decimals = 0, disabled = false, autoplay = true, className },
  ref,
) {
  const target = Number.isFinite(value) ? value : 0
  const digits = clampDigits(decimals)
  const [displayed, setDisplayed] = useState(target)
  const controllerRef = useRef<CountUpController | null>(null)
  const optionsRef = useRef({ from, duration, delay, disabled })

  optionsRef.current = { from, duration, delay, disabled }

  useEffect(() => {
    const controller = createCountUp((next) => setDisplayed(next), { from, duration, delay, disabled, value: target })
    controllerRef.current = controller
    if (autoplay) controller.play({ from, duration, delay, disabled, value: target })
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // The controller is recreated only when the target/duration/delay/disabled inputs change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, disabled, duration, delay])

  useImperativeHandle(ref, () => ({
    replay: () => {
      const controller = controllerRef.current
      if (!controller) return
      const options = optionsRef.current
      controller.play({ ...options, value: target })
    },
  }), [target])

  return (
    <span className={className ? `ak-count-up ${className}` : 'ak-count-up'}>
      <span aria-hidden="true">{displayed.toFixed(digits)}</span>
      <span className="ak-count-up__accessible">{target.toFixed(digits)}</span>
    </span>
  )
})
