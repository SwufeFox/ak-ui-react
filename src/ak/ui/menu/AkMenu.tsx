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
}

/**
 * A button-triggered menu backed by the browser Popover API.
 * Escape, outside dismissal, and top-layer placement remain native browser behavior.
 */
export function AkDropdownMenu({ label, items, className }: AkDropdownMenuProps) {
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
    <span className={cx('ak-menu-anchor', className)}>
      <button
        ref={triggerRef}
        type="button"
        className="ak-menu__trigger"
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => open ? setOpen(false) : openAndFocus()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); openAndFocus() }
          if (event.key === 'ArrowUp') { event.preventDefault(); openAndFocus(true) }
        }}
      >
        {label}<span aria-hidden="true">▾</span>
      </button>
      <MenuSurface id={menuId} surfaceRef={panelRef} returnFocusRef={triggerRef} open={open} onOpenChange={onOpenChange} onKeyDown={moveFocus}>
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
}

/**
 * A context menu using a native auto popover. Opens on right-click or the
 * Context Menu / Shift+F10 keys and clamps its initial point to the viewport.
 */
export function AkContextMenu({ children, items, label = 'Context menu', className }: AkContextMenuProps) {
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

  return (
    <div
      ref={regionRef}
      tabIndex={0}
      role="group"
      aria-haspopup="menu"
      aria-controls={menuId}
      className={cx('ak-context-menu', className)}
      onContextMenu={(event) => {
        event.preventDefault()
        openAt(event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        if ((event.shiftKey && event.key === 'F10') || event.key === 'AkContextMenu') {
          event.preventDefault()
          const box = event.currentTarget.getBoundingClientRect()
          openAt(box.left, box.bottom)
        }
      }}
    >
      {children}
      <MenuSurface
        id={menuId}
        surfaceRef={panelRef}
        returnFocusRef={regionRef}
        open={open}
        onOpenChange={setOpen}
        aria-label={label}
        style={{ position: 'fixed', left: point.x, top: point.y, right: 'auto', bottom: 'auto', margin: 0 }}
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

/** Props for the ARIA menubar container. Its child controls should use role="menuitem". */
export interface AkMenubarProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu item controls. */
  children: ReactNode
}

/** A horizontal menubar with arrow and Home/End focus movement. */
export function AkMenubar({ children, className, ...props }: AkMenubarProps) {
  return (
    <div
      {...props}
      role="menubar"
      className={cx('ak-menubar', className)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.defaultPrevented) return
        const buttons = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')]
        const i = buttons.indexOf(document.activeElement as HTMLElement)
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          buttons[(i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length]?.focus()
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          buttons[event.key === 'Home' ? 0 : buttons.length - 1]?.focus()
        }
      }}
    >
      {children}
    </div>
  )
}

/** Props for the ARIA toolbar. */
export interface AkToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name required for the toolbar landmark. */
  label: string
  /** AkToolbar controls. */
  children: ReactNode
}

/** A horizontal toolbar with arrow and Home/End focus movement. */
export function AkToolbar({ children, label, className, ...props }: AkToolbarProps) {
  return (
    <div
      {...props}
      role="toolbar"
      aria-label={label}
      className={cx('ak-toolbar', className)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.defaultPrevented) return
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]')]
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
      }}
    >
      {children}
    </div>
  )
}

/** Props for a native disclosure element. */
export interface AkCollapsibleProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title' | 'onToggle'> {
  /** Summary shown while the disclosure is open or closed. */
  title: ReactNode
  /** AkCollapsible content. */
  children: ReactNode
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean
  /** Controlled open state. When provided, pair with `onOpenChange`. */
  open?: boolean
  /** Called when the native disclosure changes state. */
  onOpenChange?: (open: boolean) => void
}

/** A native `<details>` disclosure; supports both controlled and uncontrolled state. */
export function AkCollapsible({ title, children, defaultOpen, open, onOpenChange, className, ...props }: AkCollapsibleProps) {
  return (
    <details
      {...props}
      className={cx('ak-collapsible', className)}
      open={open ?? defaultOpen}
      onToggle={(event) => onOpenChange?.(event.currentTarget.open)}
    >
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
