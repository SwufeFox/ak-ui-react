import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { createMobileMenu, type MenuController } from '../../core/site.mjs'
import { useInstanceId } from '../../lib/useId'

export interface AkMobileMenuProps {
  /** 触发按钮与对话框的读屏名，默认 `Menu`。 */
  label?: string
  /** 关闭按钮文字，默认 `Close menu`。 */
  closeLabel?: string
  /** 子内容。 */
  children?: React.ReactNode
}

export interface AkMobileMenuHandle {
  open: () => void
  close: () => void
}

export const AkMobileMenu = forwardRef<AkMobileMenuHandle, AkMobileMenuProps>(function AkMobileMenu(
  { label = 'Menu', closeLabel = 'Close menu', children },
  ref,
) {
  const id = useInstanceId('ak-menu')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const controllerRef = useRef<MenuController | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = triggerRef.current
    if (!dialog || !trigger) return
    const controller = createMobileMenu(dialog, { trigger })
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useImperativeHandle(ref, () => ({
    open: () => controllerRef.current?.open(),
    close: () => controllerRef.current?.close(),
  }), [])

  return (
    <>
      <button
        ref={triggerRef}
        className="ak-site-control ak-site__menu-trigger"
        type="button"
        aria-controls={id}
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        {label}
      </button>
      <dialog id={id} ref={dialogRef} className="ak-site-menu" aria-label={label}>
        <button className="ak-site-control" type="button" data-ak-menu-close autoFocus>
          {closeLabel}
        </button>
        <nav aria-label={label}>{children}</nav>
      </dialog>
    </>
  )
})
