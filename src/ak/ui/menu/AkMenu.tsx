import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

/** A selectable entry for `AkDropdownMenu` or `AkContextMenu`. */
export interface AkMenuItem {
  /** Visible menu label. */
  label: ReactNode
  /** Called after selection; the menu closes afterwards. */
  onSelect?: () => void
  /** Prevents selection and removes the entry from arrow-key navigation. */
  disabled?: boolean
  /** Applies the library's danger signal to destructive actions. */
  destructive?: boolean
  /** Optional keyboard hint shown at the trailing edge. */
  shortcut?: ReactNode
}

interface MenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  surfaceRef?: Ref<HTMLDivElement>
  returnFocusRef?: { current: HTMLElement | null }
}

function MenuSurface({ id, children, open, onOpenChange, className, surfaceRef, returnFocusRef, ...props }: MenuSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const setRef = (node: HTMLDivElement | null) => {
    ref.current = node
    if (typeof surfaceRef === 'function') surfaceRef(node)
    else if (surfaceRef) surfaceRef.current = node
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    try {
      if (open && !el.matches(':popover-open')) el.showPopover()
      if (!open && el.matches(':popover-open')) el.hidePopover()
    } catch {
      // A concurrent unmount can leave the native popover between states.
    }
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const toggle = (event: Event) => {
      const nextOpen = (event as ToggleEvent).newState === 'open'
      onOpenChange(nextOpen)
      if (!nextOpen) returnFocusRef?.current?.focus()
    }
    el.addEventListener('toggle', toggle)
    return () => el.removeEventListener('toggle', toggle)
  }, [onOpenChange, returnFocusRef])

  return (
    <div
      {...props}
      ref={setRef}
      id={id}
      popover="auto"
      className={cx('ak-menu', className)}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  )
}

function MenuEntries({ items, close }: { items: readonly AkMenuItem[]; close: () => void }) {
  return (
    <>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          role="menuitem"
          className="ak-menu__item"
          disabled={item.disabled}
          data-destructive={item.destructive || undefined}
          onClick={() => {
            item.onSelect?.()
            close()
          }}
        >
          <span>{item.label}</span>
          {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
        </button>
      ))}
    </>
  )
}

/** Props for the native-popover dropdown menu. */
export interface AkDropdownMenuProps {
  /** Trigger label. */
  label: ReactNode
  /** Menu entries, rendered in order. */
  items: readonly AkMenuItem[]
  /** Extra class for the trigger-and-menu wrapper. */
  className?: string
  /** 尺寸档：一次同时缩触发器与每条菜单项，两者不会失同步。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖（挂在 anchor 上，浮层继承）。 */
  tokens?: AkTokens
}

/**
 * A button-triggered menu backed by the browser Popover API.
 * Escape, outside dismissal, and top-layer placement remain native browser behavior.
 */
export function AkDropdownMenu({ label, items, className, size = 'md', tokens }: AkDropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const menuId = useId().replace(/:/g, '')
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const onOpenChange = (next: boolean) => setOpen(next)

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])]
    if (!options.length) return
    const current = options.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      options[(current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      options[event.key === 'Home' ? 0 : options.length - 1].focus()
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  function openAndFocus(last = false) {
    setOpen(true)
    requestAnimationFrame(() => {
      const options = panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
      options?.[last ? options.length - 1 : 0]?.focus()
    })
  }

  return (
    <span {...sizeAttrs(size)} className={cx('ak-menu-anchor', className)} style={tokenStyle(tokens)}>
      <button
        id={`${menuId}-trigger`}
        ref={triggerRef}
        type="button"
        className="ak-menu__trigger"
        popoverTarget={menuId}
        popoverTargetAction="toggle"
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={open}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); openAndFocus() }
          if (event.key === 'ArrowUp') { event.preventDefault(); openAndFocus(true) }
        }}
      >
        {label}<span aria-hidden="true">▾</span>
      </button>
      <MenuSurface id={menuId} className="ak-menu--anchored" aria-labelledby={`${menuId}-trigger`} surfaceRef={panelRef} returnFocusRef={triggerRef} open={open} onOpenChange={onOpenChange} onKeyDown={moveFocus} {...sizeAttrs(size)}>
        <MenuEntries items={items} close={() => setOpen(false)} />
      </MenuSurface>
    </span>
  )
}

/** Props for a right-click or keyboard-invoked context menu. */
export interface AkContextMenuProps {
  /** Region on which the context menu is available. */
  children: ReactNode
  /** Menu entries, rendered in order. */
  items: readonly AkMenuItem[]
  /** Accessible name for the menu. Defaults to “Context menu”. */
  label?: string
  /** Extra class for the context-sensitive region. */
  className?: string
  /** 尺寸档：一次同时缩菜单项与浮层宽度。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖（弹层在顶层，无法从外部选择器改，走 tokens 最省事）。 */
  tokens?: AkTokens
}

/**
 * A context menu using a native auto popover. Opens on right-click or the
 * Context Menu / Shift+F10 keys and clamps its initial point to the viewport.
 */
export function AkContextMenu({ children, items, label = 'Context menu', className, size = 'md', tokens }: AkContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [point, setPoint] = useState({ x: 8, y: 8 })
  const menuId = useId().replace(/:/g, '')
  const regionRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function openAt(x: number, y: number) {
    setPoint({
      x: Math.max(8, Math.min(x, window.innerWidth - 200)),
      y: Math.max(8, Math.min(y, window.innerHeight - 56)),
    })
    setOpen(true)
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus())
  }

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const rect = panelRef.current?.getBoundingClientRect()
      if (!rect) return
      setPoint((current) => {
        const x = Math.max(8, Math.min(current.x, window.innerWidth - rect.width - 8))
        const y = current.y + rect.height + 8 <= window.innerHeight
          ? current.y
          : Math.max(8, current.y - rect.height)
        return x === current.x && y === current.y ? current : { x, y }
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <div
      {...sizeAttrs(size)}
      ref={regionRef}
      tabIndex={0}
      role="group"
      aria-haspopup="menu"
      aria-controls={menuId}
      aria-expanded={open}
      className={cx('ak-context-menu', className)}
      style={tokenStyle(tokens)}
      onContextMenu={(event) => {
        event.preventDefault()
        openAt(event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
          event.preventDefault()
          const box = event.currentTarget.getBoundingClientRect()
          openAt(box.left, box.bottom)
        }
      }}
    >
      {children}
      <MenuSurface
        id={menuId}
        className="ak-menu--context"
        surfaceRef={panelRef}
        returnFocusRef={regionRef}
        open={open}
        onOpenChange={setOpen}
        aria-label={label}
        {...sizeAttrs(size)}
        // tokens 在前、定位在后：右键菜单的坐标必须赢过调用方给的任意令牌，
        // 否则 `--ak-menu-*` 里混进 left/top 之类会把弹层挪出视口。
        style={{
          ...tokenStyle(tokens),
          position: 'fixed',
          left: point.x,
          top: point.y,
          right: 'auto',
          bottom: 'auto',
          margin: 0,
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const options = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])]
            const i = options.indexOf(document.activeElement as HTMLButtonElement)
            if (options.length) {
              event.preventDefault()
              options[(i + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus()
            }
          }
        }}
      >
        <MenuEntries items={items} close={() => setOpen(false)} />
      </MenuSurface>
    </div>
  )
}

function setRovingTabStop(root: HTMLElement, selector: string, active?: HTMLElement) {
  const items = [...root.querySelectorAll<HTMLElement>(selector)].filter((item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true')
  const current = active && items.includes(active) ? active : items.find((item) => item.tabIndex === 0) ?? items[0]
  items.forEach((item) => { item.tabIndex = item === current ? 0 : -1 })
}

/** Props for the ARIA menubar container. Its child controls should use role="menuitem". */
export interface AkMenubarProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu item controls. */
  children: ReactNode
}

/** A horizontal menubar with a single tab stop and arrow/Home/End focus movement. */
export function AkMenubar({ children, className, ...props }: AkMenubarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (rootRef.current) setRovingTabStop(rootRef.current, '[role="menuitem"]') }, [children])
  return (
    <div {...props} ref={rootRef} role="menubar" className={cx('ak-menubar', className)}
      onFocusCapture={(event) => {
        props.onFocusCapture?.(event)
        if (event.target instanceof HTMLElement) setRovingTabStop(event.currentTarget, '[role="menuitem"]', event.target)
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.defaultPrevented) return
        const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')]
        const i = items.indexOf(document.activeElement as HTMLElement)
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          items[(i + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length]?.focus()
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          items[event.key === 'Home' ? 0 : items.length - 1]?.focus()
        }
      }}>
      {children}
    </div>
  )
}

/** Props for the ARIA toolbar. */
export interface AkToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name required for the toolbar landmark. */
  label: string
  /** Toolbar controls. */
  children: ReactNode
}

/** A horizontal toolbar with one tab stop and arrow/Home/End focus movement. */
export function AkToolbar({ children, label, className, ...props }: AkToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const selector = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [role="button"]'
  useEffect(() => { if (rootRef.current) setRovingTabStop(rootRef.current, selector) }, [children])
  return (
    <div {...props} ref={rootRef} role="toolbar" aria-label={label} className={cx('ak-toolbar', className)}
      onFocusCapture={(event) => {
        props.onFocusCapture?.(event)
        if (event.target instanceof HTMLElement) setRovingTabStop(event.currentTarget, selector, event.target)
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.defaultPrevented) return
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>(selector)]
        const i = controls.indexOf(document.activeElement as HTMLElement)
        const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
        const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        if (forward || backward) {
          event.preventDefault()
          controls[(i + (forward ? 1 : -1) + controls.length) % controls.length]?.focus()
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          controls[event.key === 'Home' ? 0 : controls.length - 1]?.focus()
        }
      }}>
      {children}
    </div>
  )
}

/** Props for a native disclosure element. */
export interface AkCollapsibleProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title' | 'onToggle'> {
  /** Summary shown while the disclosure is open or closed. */
  title: ReactNode
  /** Collapsible content. */
  children: ReactNode
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean
  /** Controlled open state. When provided, pair with onOpenChange. */
  open?: boolean
  /** Called when the native disclosure changes state. */
  onOpenChange?: (open: boolean) => void
}

/** A native details disclosure; supports controlled and uncontrolled state. */
export function AkCollapsible({ title, children, defaultOpen, open, onOpenChange, className, ...props }: AkCollapsibleProps) {
  return (
    <details {...props} className={cx('ak-collapsible', className)} open={open ?? defaultOpen}
      onToggle={(event) => {
        const next = event.currentTarget.open
        onOpenChange?.(next)
        if (open !== undefined && next !== open) event.currentTarget.open = open
      }}>
      <summary>{title}<span aria-hidden="true">+</span></summary>
      <div className="ak-collapsible__content">{children}</div>
    </details>
  )
}

/** A visual separator between menu groups. */
export function AkMenuSeparator() {
  return <hr className="ak-menu__separator" role="separator" />
}

/** Props for a labelled menu group. */
export interface AkMenuGroupProps {
  /** Entries in the group. */
  children: ReactNode
  /** Optional accessible name for this group. */
  label?: string
}

/** A semantic group for related menu entries. */
export function AkMenuGroup({ children, label }: AkMenuGroupProps) {
  return <div role="group" aria-label={label} className="ak-menu__group">{children}</div>
}
