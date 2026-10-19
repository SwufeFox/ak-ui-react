import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/utils'

/**
 * 浮层与提示。**上游用的是原生 Popover API**（样式表里通篇 `:popover-open`），
 * 所以这里也用 `popover` 属性驱动，不做手写的定位与焦点陷阱 ——
 * 浏览器负责置顶层、Esc 关闭、点击外部关闭。
 *
 * 上游给了 `position-area` 与 `position-try-fallbacks`，所以浮层会自动贴到触发器
 * 下方并在贴边时翻转。本组件不重复实现这套。
 *
 * ⚠️ 上游 SCSS 写了 `.ak-popover` 与 `.ak-tooltip` 两套外观，但它们**共用同一批定位规则**；
 * 区别只在宽度、内边距与 `position-area`（popover 在下方、tooltip 在上方）。
 */

export type AkPopoverPlacement = 'bottom' | 'top'

interface CommonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  /** 触发器内容。 */
  trigger: ReactNode
  /** 顶部小标（`.ak-popover__eyebrow`）。 */
  eyebrow?: ReactNode
  /** 标题（`.ak-popover__title`）。 */
  title?: ReactNode
  /** 正文。 */
  content?: ReactNode
  /** 受控开合。不传则内部自管。 */
  open?: boolean
  /** 默认是否展开（非受控）。 */
  defaultOpen?: boolean
  /** 开合变化回调。 */
  onOpenChange?: (open: boolean) => void
  /** 触发器上的附加类名。 */
  triggerClassName?: string
}

export interface AkPopoverProps extends CommonProps {
  /** 外观：`popover` 是带标题的浮层，`tooltip` 是窄的气泡提示。 */
  kind?: 'popover' | 'tooltip'
}

/**
 * 浮层。点击触发器展开，再点或按 Esc 关闭。
 *
 * ```tsx
 * <AkPopover trigger={<AkButton>详情</AkButton>} eyebrow="RI / INFO" title="作战简报">
 *   正文内容
 * </AkPopover>
 * ```
 */
export function AkPopover({
  trigger,
  eyebrow,
  title,
  content,
  children,
  kind = 'popover',
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  triggerClassName,
  ...rest
}: AkPopoverProps) {
  const panelId = useId().replace(/:/g, '')
  const panelRef = useRef<HTMLDivElement>(null)
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const isControlled = open !== undefined
  const shown = isControlled ? open : uncontrolled

  const setShown = (next: boolean) => {
    if (!isControlled) setUncontrolled(next)
    onOpenChange?.(next)
  }

  // 把 React 状态同步到原生 popover。用属性而不是 class —— 样式表认的是 :popover-open。
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const supported = typeof el.showPopover === 'function'
    if (!supported) return
    try {
      if (shown && !el.matches(':popover-open')) el.showPopover()
      else if (!shown && el.matches(':popover-open')) el.hidePopover()
    } catch {
      // showPopover 在元素未挂载到文档时会抛；忽略即可，下一帧会再同步
    }
  }, [shown])

  // 用户按 Esc 或点外部时，浏览器会自己关；把状态跟回来，避免受控方失同步。
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const onToggle = (e: Event) => {
      const next = (e as ToggleEvent).newState === 'open'
      if (next !== shown) setShown(next)
    }
    el.addEventListener('toggle', onToggle as EventListener)
    return () => el.removeEventListener('toggle', onToggle as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown])

  const panelClass = kind === 'tooltip' ? 'ak-tooltip' : 'ak-popover'

  return (
    <>
      <button
        type="button"
        // React 19 原生支持 popoverTarget（小写 popovertarget 会触发 unknown-prop 警告）
        popoverTarget={panelId}
        className={cx(triggerClassName)}
        data-slot="ak-popover-trigger"
        aria-expanded={shown}
      >
        {trigger}
      </button>

      <div
        {...rest}
        id={panelId}
        ref={panelRef}
        // popover="auto" —— 让浏览器负责置顶层、Esc、点击外部关闭
        popover="auto"
        className={cx(panelClass, className)}
        data-slot={kind === 'tooltip' ? 'ak-tooltip' : 'ak-popover'}
      >
        {eyebrow ? <span className="ak-popover__eyebrow">{eyebrow}</span> : null}
        {title ? <strong className="ak-popover__title">{title}</strong> : null}
        {content ?? children ? <div className="ak-popover__content">{content ?? children}</div> : null}
      </div>
    </>
  )
}
