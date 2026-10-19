import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/utils'

/**
 * 模态对话框。
 *
 * 上游用**原生 `<dialog>`**（`_ak-dialog.scss` 通篇 `&[open]` 与 `&::backdrop`，
 * 含 `transition-behavior: allow-discrete` + `@starting-style` 的进场过渡），
 * 所以这里也用 `showModal()` / `close()`，不手写遮罩、焦点陷阱与 Esc ——
 * 浏览器负责置顶层、惰性化背景、Esc 关闭、焦点回归。
 *
 * 上游的几何：右上角切角（`--ak-cut`）、顶部 4px 信号条、`::backdrop` 半透明黑 + 3px 背景模糊。
 * 全部来自样式表，本组件不加新样式。
 */

export interface AkDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 受控开合。 */
  open: boolean
  /** 开合变化回调。Esc 与点击遮罩关闭时也会触发（原生 dialog 的 cancel/close 事件）。 */
  onOpenChange?: (open: boolean) => void
  /** 顶部小标与标题，对应样式表的 `__eyebrow` / `__title`。 */
  eyebrow?: ReactNode
  title?: ReactNode
  /** 底部操作区。 */
  footer?: ReactNode
  /** 点遮罩是否关闭。默认 true。 */
  closeOnBackdrop?: boolean
  /** 是否禁用 Esc 关闭。默认 false。 */
  disableEscape?: boolean
  children?: ReactNode
}

export function AkDialog({
  open,
  onOpenChange,
  eyebrow,
  title,
  footer,
  closeOnBackdrop = true,
  disableEscape = false,
  className,
  children,
  ...rest
}: AkDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  // React 状态 → 原生 dialog 的开合
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const isOpen = el.hasAttribute('open')
    if (open && !isOpen) {
      // showModal 才会进置顶层并惰性化背景；show 是普通层
      if (typeof el.showModal === 'function') el.showModal()
      else el.setAttribute('open', '')
    } else if (!open && isOpen) {
      if (typeof el.close === 'function') el.close()
      else el.removeAttribute('open')
    }
  }, [open])

  // Esc 关闭走原生 cancel 事件；<dialog> 也会自己关，所以还要监听 close 把状态同步回去
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onCancel = (e: Event) => {
      if (disableEscape) e.preventDefault()
    }
    const onClose = () => onOpenChange?.(false)
    el.addEventListener('cancel', onCancel)
    el.addEventListener('close', onClose)
    return () => {
      el.removeEventListener('cancel', onCancel)
      el.removeEventListener('close', onClose)
    }
  }, [disableEscape, onOpenChange])

  // 点遮罩关闭：dialog 本体铺满视口，点在内容之外即命中 dialog 自己
  const onPointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) return
    if (e.target === ref.current) onOpenChange?.(false)
  }

  return (
    <dialog
      {...(rest as HTMLAttributes<HTMLDialogElement>)}
      ref={ref}
      className={cx('ak-dialog', className)}
      data-slot="ak-dialog"
      onPointerDown={onPointerDown}
    >
      {(eyebrow || title) ? (
        <header className="ak-dialog__header">
          {eyebrow ? <span className="ak-dialog__eyebrow">{eyebrow}</span> : null}
          {title ? <strong className="ak-dialog__title">{title}</strong> : null}
        </header>
      ) : null}
      <div className="ak-dialog__body">{children}</div>
      {footer ? <div className="ak-dialog__footer">{footer}</div> : null}
    </dialog>
  )
}
