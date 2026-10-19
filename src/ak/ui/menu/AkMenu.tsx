import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { cx } from '../../lib/utils'

export interface MenuItem {
  label: ReactNode
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
  shortcut?: ReactNode
}

interface MenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  surfaceRef?: Ref<HTMLDivElement>
}

function MenuSurface({ children, open, onOpenChange, className, surfaceRef, ...props }: MenuSurfaceProps) {
  const id = useId().replace(/:/g, '')
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
    } catch { /* The element may be between mounts. */ }
  }, [open])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const toggle = (event: Event) => onOpenChange((event as ToggleEvent).newState === 'open')
    el.addEventListener('toggle', toggle)
    return () => el.removeEventListener('toggle', toggle)
  }, [onOpenChange])
  return <div {...props} ref={setRef} id={id} popover="auto" className={cx('ak-menu', className)} role="menu">{children}</div>
}

function MenuEntries({ items, close }: { items: readonly MenuItem[]; close: () => void }) {
  return <>{items.map((item, index) => <button key={index} type="button" role="menuitem" className="ak-menu__item" disabled={item.disabled} data-destructive={item.destructive || undefined} onClick={() => { item.onSelect?.(); close() }}><span>{item.label}</span>{item.shortcut ? <kbd>{item.shortcut}</kbd> : null}</button>)}</>
}

export interface DropdownMenuProps {
  label: ReactNode
  items: readonly MenuItem[]
  className?: string
}

export function DropdownMenu({ label, items, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const onOpenChange = (next: boolean) => setOpen(next)
  function moveFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    const options = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])]
    if (!options.length) return
    const current = options.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); options[(current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); options[event.key === 'Home' ? 0 : options.length - 1].focus()
    } else if (event.key === 'Escape') { setOpen(false) }
  }
  return <span className={cx('ak-menu-anchor', className)}><button type="button" className="ak-menu__trigger" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { setOpen(true); requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus()) } }}>{label}<span aria-hidden="true">▾</span></button><MenuSurface surfaceRef={panelRef} open={open} onOpenChange={onOpenChange} onKeyDown={moveFocus}><MenuEntries items={items} close={() => setOpen(false)} /></MenuSurface></span>
}

export interface ContextMenuProps {
  children: ReactNode
  items: readonly MenuItem[]
  label?: string
  className?: string
}

export function ContextMenu({ children, items, label = 'Context menu', className }: ContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [point, setPoint] = useState({ x: 0, y: 0 })
  return <div tabIndex={0} className={cx('ak-context-menu', className)} onContextMenu={(event) => { event.preventDefault(); setPoint({ x: event.clientX, y: event.clientY }); setOpen(true) }} onKeyDown={(event) => { if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') { event.preventDefault(); const box = event.currentTarget.getBoundingClientRect(); setPoint({ x: box.left, y: box.bottom }); setOpen(true) } }}>{children}<MenuSurface open={open} onOpenChange={setOpen} aria-label={label} style={{ position: 'fixed', left: point.x, top: point.y, right: 'auto', bottom: 'auto', margin: 0 }}><MenuEntries items={items} close={() => setOpen(false)} /></MenuSurface></div>
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode }
export function Menubar({ children, className, ...props }: MenubarProps) {
  return <div {...props} role="menubar" className={cx('ak-menubar', className)} onKeyDown={(event) => { const buttons = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')]; const i = buttons.indexOf(document.activeElement as HTMLElement); if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); buttons[(i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length]?.focus() } if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); buttons[event.key === 'Home' ? 0 : buttons.length - 1]?.focus() } }}>{children}</div>
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; label: string }
export function Toolbar({ children, label, className, ...props }: ToolbarProps) {
  return <div {...props} role="toolbar" aria-label={label} className={cx('ak-toolbar', className)} onKeyDown={(event) => { const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]')]; const i = controls.indexOf(document.activeElement as HTMLElement); const horizontal = event.key === 'ArrowRight' || event.key === 'ArrowLeft'; const vertical = event.key === 'ArrowDown' || event.key === 'ArrowUp'; if (horizontal || vertical) { event.preventDefault(); controls[(i + ((event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : -1) + controls.length) % controls.length]?.focus() } if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); controls[event.key === 'Home' ? 0 : controls.length - 1]?.focus() } }}>{children}</div>
}

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> { title: ReactNode; children: ReactNode; defaultOpen?: boolean }
export function Collapsible({ title, children, defaultOpen, className, ...props }: CollapsibleProps) {
  return <details {...props} className={cx('ak-collapsible', className)} open={defaultOpen}><summary>{title}<span aria-hidden="true">+</span></summary><div className="ak-collapsible__content">{children}</div></details>
}

export function MenuSeparator() { return <hr className="ak-menu__separator" role="separator" /> }
export function MenuGroup({ children, label }: { children: ReactNode; label?: string }) { return <div role="group" aria-label={label} className="ak-menu__group">{children}</div> }
