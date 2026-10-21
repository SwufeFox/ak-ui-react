import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties, type ReactNode } from 'react'
import { createEntrance, type EntranceController, type EntranceOptions } from '../../core/effects.mjs'

export interface AkEntranceProps extends EntranceOptions {
  /** 挂载后自动播放。 */
  autoplay?: boolean
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
  /** 根节点行内样式。 */
  style?: CSSProperties
  /** 子内容。 */
  children?: ReactNode
}

export interface AkEntranceHandle {
  replay: () => void
}

export const AkEntrance = forwardRef<AkEntranceHandle, AkEntranceProps>(function AkEntrance(
  { autoplay = true, className, style, children, ...options },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<EntranceController | null>(null)
  const optionsRef = useRef(options)

  optionsRef.current = options

  useEffect(() => {
    const element = rootRef.current
    if (!element) return
    const controller = createEntrance(element, optionsRef.current)
    controllerRef.current = controller
    if (autoplay) controller.play(optionsRef.current)
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay])

  useEffect(() => {
    if (options.disabled) controllerRef.current?.cancel()
  }, [options.disabled])

  useImperativeHandle(ref, () => ({
    replay: () => controllerRef.current?.play(optionsRef.current),
  }), [])

  return (
    <div ref={rootRef} style={style} className={className ? `ak-entrance ${className}` : 'ak-entrance'}>
      {children}
    </div>
  )
})
