import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { createSectionNavigation, type SectionController } from '../../core/site.mjs'

export interface AkSectionNavigatorProps {
  /** 是否把当前区块写进地址栏 hash。 */
  syncHash?: boolean
  /** 切换动画时长（毫秒）。 */
  duration?: number
  /** 切换时回调，给出区块 id 与序号。 */
  onChange?: (id: string, index: number) => void
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
  /** 视口内容；必须含 `[data-ak-section-viewport]` 与带唯一 id 的区块。 */
  children?: React.ReactNode
}

export interface AkSectionNavigatorHandle {
  navigate: (id: string) => void
}

export const AkSectionNavigator = forwardRef<AkSectionNavigatorHandle, AkSectionNavigatorProps>(function AkSectionNavigator(
  { syncHash = true, duration = 650, onChange, className, children },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SectionController | null>(null)
  const onChangeRef = useRef(onChange)

  onChangeRef.current = onChange

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = createSectionNavigation(root, {
      syncHash,
      duration,
      onChange: (id, index) => onChangeRef.current?.(id, index),
    })
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({
    navigate: (id: string) => controllerRef.current?.navigate(id),
  }), [])

  return (
    <div ref={rootRef} className={className ? `ak-site ${className}` : 'ak-site'}>
      {children}
    </div>
  )
})
