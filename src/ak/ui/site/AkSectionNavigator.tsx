import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { createSectionNavigation, type SectionController } from '../../core/site.mjs'

export interface AkSectionNavigatorProps {
  syncHash?: boolean
  duration?: number
  onChange?: (id: string, index: number) => void
  className?: string
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
