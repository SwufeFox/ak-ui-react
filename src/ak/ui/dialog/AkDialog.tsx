import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { useControllableState } from '../../lib/useControllableState'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

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
  /**
   * Controlled open state. When defined the dialog is controlled and this value
   * wins; when `undefined` the component is uncontrolled and owns the state.
   */
  open?: boolean
  /**
   * Initial open state in uncontrolled mode. Ignored whenever `open` is defined.
   * Defaults to `false`.
   */
  defaultOpen?: boolean
  /**
   * Called with the requested state in both modes: close button, backdrop click,
   * Esc and the native `close` event all funnel through it.
   */
  onOpenChange?: (open: boolean) => void
  /** 顶部小标与标题，对应样式表的 `__eyebrow` / `__title`。 */
  eyebrow?: ReactNode
  title?: ReactNode
  /** 底部操作区。 */
  footer?: ReactNode
  /** 是否显示右上角关闭按钮，默认 true。 */
  closable?: boolean
  /** 点遮罩是否关闭。默认 true。 */
  closeOnBackdrop?: boolean
  /** 是否禁用 Esc 关闭。默认 false。 */
  disableEscape?: boolean
  /**
   * 是否使用上游的满屏档（`.ak-dialog--full`：96vw × 92vh，近乎铺满视口）。
   * 满屏档会压过 `size` 给出的宽度档位。
   */
  full?: boolean
  /** 尺寸档：宽度上限、最大高度、内距与字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-dialog-w': '52rem' }`。 */
  tokens?: AkTokens
  children?: ReactNode
}

export function AkDialog({
  open,
  defaultOpen,
  onOpenChange,
  eyebrow,
  title,
  footer,
  closable = true,
  closeOnBackdrop = true,
  disableEscape = false,
  full = false,
  size = 'md',
  tokens,
  className,
  style,
  children,
  ...rest
}: AkDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [shown, setOpen] = useControllableState<boolean>(open, defaultOpen ?? false, onOpenChange)
  // 原生 close 事件会在 effect 关闭 dialog 时同步触发；用 ref 记录本次提交的状态，
  // 避免「受控 false → effect close → close 事件」重复回调 onOpenChange。
  const shownRef = useRef(shown)

  // React 状态 → 原生 dialog 的开合
  useEffect(() => {
    shownRef.current = shown
    const el = ref.current
    if (!el) return
    const isOpen = el.hasAttribute('open')
    if (shown && !isOpen) {
      // showModal 才会进置顶层并惰性化背景；show 是普通层
      if (typeof el.showModal === 'function') el.showModal()
      else el.setAttribute('open', '')
    } else if (!shown && isOpen) {
      if (typeof el.close === 'function') el.close()
      else el.removeAttribute('open')
    }
  }, [shown])

  // Esc 关闭走原生 cancel 事件；<dialog> 也会自己关，所以还要监听 close 把状态同步回去
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onCancel = (e: Event) => {
      if (disableEscape) e.preventDefault()
    }
    const onClose = () => {
      // 只有「原生关闭时状态仍为开」才是用户发起的关闭（Esc 等）；
      // effect 因受控 false 主动 close 时状态已经是 false，不再重复通知。
      if (shownRef.current) setOpen(false)
    }
    el.addEventListener('cancel', onCancel)
    el.addEventListener('close', onClose)
    return () => {
      el.removeEventListener('cancel', onCancel)
      el.removeEventListener('close', onClose)
    }
  }, [disableEscape, setOpen])

  // 点遮罩关闭：dialog 本体铺满视口，点在内容之外即命中 dialog 自己
  const onPointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) return
    if (e.target === ref.current) setOpen(false)
  }

  return (
    <dialog
      {...(rest as HTMLAttributes<HTMLDialogElement>)}
      ref={ref}
      {...sizeAttrs(size)}
      className={cx('ak-dialog', full && 'ak-dialog--full', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-dialog"
      data-full={full || undefined}
      onPointerDown={onPointerDown}
    >
      {(eyebrow || title || closable) ? (
        <header className="ak-dialog__header">
          <div className="ak-dialog__header-content">
            {eyebrow ? <span className="ak-dialog__eyebrow">{eyebrow}</span> : null}
            {title ? <strong className="ak-dialog__title">{title}</strong> : null}
          </div>
          {closable ? (
            <button
              type="button"
              className="ak-dialog__close"
              aria-label="Close dialog"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          ) : null}
        </header>
      ) : null}
      <div className="ak-dialog__body">{children}</div>
      {footer ? <div className="ak-dialog__footer">{footer}</div> : null}
    </dialog>
  )
}
