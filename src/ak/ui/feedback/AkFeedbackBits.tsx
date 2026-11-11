'use client'

import type { ButtonHTMLAttributes, CSSProperties, FocusEvent as ReactFocusEvent, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactElement, ReactNode } from 'react'
import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../../lib/utils'
import { useInstanceId } from '../../lib/useId'
import { useControllableState } from '../../lib/useControllableState'
import { sizeAttrs, type AkControlSize } from '../../lib/size'

/**
 * 反馈小件族组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 *
 * 覆盖：计数徽标（AkBadge）、筛选芯片（AkChip）、时间线（AkTimeline /
 * AkTimelineItem）、轻提示（AkToastProvider + useToast）、文字提示（AkTooltip）、
 * 搜索框（AkSearch）、键帽（AkKbd）、作用域根（AkScope）。
 *
 * ⚠️ 提示气泡用的是 `.ak-tip`（上游同族），**不是** `.ak-tooltip` —— 后者
 * 已被本库的 AkPopover（原生 popover API）占用，两套外观不能共用一个类名。
 */

/** 定时器句柄：浏览器返回数字，Node 运行时返回 Timeout 对象。 */
type TimerHandle = ReturnType<typeof setTimeout>

// ── Badge（计数徽标 / 未读点） ─────────────────────────────────────────

export type AkBadgeVariant = 'default' | 'accent' | 'danger'

export interface AkBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 数字或短串；数字为 0 时默认不显示（见 `showZero`）。 */
  value?: number | string
  /** 封顶：`value` 按数字大于它时显示「max+」（99+）。 */
  max?: number
  /** 圆点：不显示数字，只提示「有新的」。 */
  dot?: boolean
  /** 是否显示徽标；`false` 时只剩包住的内容。 */
  show?: boolean
  /** `value` 为 0 时也显示。 */
  showZero?: boolean
  /** 颜色：`default` 黄（未读计数 / 点）· `accent` 主色 · `danger` 红（只给回退 / 权限变更这类 alerts）。 */
  variant?: AkBadgeVariant
  /** 读屏文本（「3 条未读通知」）：写了就把数字对读屏隐藏、改念这句；圆点徽标一定要写。 */
  label?: string
  /** 被标记的内容（头像、图标按钮…）：徽标骑在它右上角；不写就是独立的行内徽标。 */
  children?: ReactNode
}

/** 计数徽标 / 未读点。 */
export function AkBadge({
  value,
  max,
  dot = false,
  show = true,
  showZero = false,
  variant = 'default',
  label,
  className,
  children,
  ...rest
}: AkBadgeProps) {
  const visible = show && (dot || (value !== undefined && value !== '' && (showZero || !(Number(value) <= 0))))

  const text = dot ? '' : max !== undefined && Number(value) > max ? `${max}+` : String(value ?? '')

  const badge = visible ? (
    <span
      className={cx('ak-badge', variant !== 'default' && `ak-badge--${variant}`, dot && 'ak-badge--dot')}
      data-slot="ak-badge"
      data-variant={variant}
    >
      {label !== undefined ? (
        <>
          {text ? (
            <span aria-hidden="true">{text}</span>
          ) : null}
          <span className="ak-sr-only">{label}</span>
        </>
      ) : (
        text
      )}
    </span>
  ) : null

  if (children === undefined) {
    return badge
  }

  return (
    <span {...rest} className={cx('ak-badge-wrap', className)} data-slot="ak-badge-wrap">
      {children}
      {badge}
    </span>
  )
}

// ── Chip（可交互的筛选芯片） ──────────────────────────────────────────

export interface AkChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  /** 文字前的图标。 */
  icon?: ReactNode
  /** 受控选中状态。 */
  checked?: boolean
  /** 非受控模式下的初始选中状态。 */
  defaultChecked?: boolean
  /** 选中状态变化时回调。 */
  onCheckedChange?: (checked: boolean) => void
  /** 芯片文字。 */
  children?: ReactNode
}

/**
 * 筛选芯片：一个开关按钮，点一下选中 / 取消，`aria-pressed` 报状态。
 *
 * 选中 = 主色实底 + 左上角三角角标。
 */
export function AkChip({
  icon,
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  children,
  onClick,
  ...rest
}: AkChipProps) {
  const [isChecked, setChecked] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange)

  return (
    <button
      {...rest}
      type="button"
      className={cx('ak-chip', isChecked && 'is-active', className)}
      data-slot="ak-chip"
      aria-pressed={isChecked}
      onClick={(event) => {
        setChecked(!isChecked)
        onClick?.(event)
      }}
    >
      {icon}
      {children}
    </button>
  )
}

// ── Timeline（时间线） ────────────────────────────────────────────────

export interface AkTimelineProps extends HTMLAttributes<HTMLUListElement> {
  /** 若干 `AkTimelineItem`，从早到晚。 */
  children?: ReactNode
}

/** 时间线：左侧一条竖线 + 菱形节点。 */
export function AkTimeline({ className, children, ...rest }: AkTimelineProps) {
  return (
    <ul {...rest} className={cx('ak-timeline', className)} data-slot="ak-timeline">
      {children}
    </ul>
  )
}

export type AkTimelineStatus = 'wait' | 'active' | 'done'

export interface AkTimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children' | 'title' | 'content'> {
  /** 时间（小字，在标题上方）。 */
  time?: ReactNode
  /** 标题。 */
  title?: ReactNode
  /** 说明文字（也可以写在 children 里）。 */
  content?: ReactNode
  /** 节点状态：`wait` 空心菱形（默认）· `active` 当前 · `done` 已发生（后两者都是主色实心）。 */
  status?: AkTimelineStatus
  /** 说明文字（代替 `content`）。 */
  children?: ReactNode
}

/** 时间线的一项。 */
export function AkTimelineItem({ time, title, content, status = 'wait', className, children, ...rest }: AkTimelineItemProps) {
  return (
    <li
      {...rest}
      className={cx(status !== 'wait' && `is-${status}`, className)}
      data-slot="ak-timeline-item"
      data-status={status}
    >
      {time !== undefined ? <span className="ak-timeline__date">{time}</span> : null}
      {title !== undefined ? <div className="ak-timeline__title">{title}</div> : null}
      {content !== undefined || children !== undefined ? <div className="ak-timeline__desc">{children ?? content}</div> : null}
    </li>
  )
}

// ── Toast（轻提示） ───────────────────────────────────────────────────

export type AkToastVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AkToastOptions {
  /** 标题。 */
  title?: ReactNode
  /** 外观档位。 */
  variant?: AkToastVariant
  /** 停留时长（ms），0 = 不自动消失；不给则用 provider 的默认值。 */
  duration?: number
  /** 是否显示 ✕ 关闭按钮；不给则用 provider 的默认值。 */
  closable?: boolean
  /** 这条提示消失时回调。 */
  onClose?: () => void
}

/** 一条提示的句柄。 */
export interface AkToastHandle {
  /** 立刻关掉这条提示。 */
  destroy: () => void
}

/** 弹提示的接口（`useToast()` 拿到它）。 */
export interface AkToastApi {
  /** 弹一条提示。 */
  create: (content: ReactNode, options?: AkToastOptions) => AkToastHandle
  /** 信息档提示。 */
  info: (content: ReactNode, options?: AkToastOptions) => AkToastHandle
  /** 成功档提示。 */
  success: (content: ReactNode, options?: AkToastOptions) => AkToastHandle
  /** 警告档提示。 */
  warning: (content: ReactNode, options?: AkToastOptions) => AkToastHandle
  /** 错误档提示。 */
  error: (content: ReactNode, options?: AkToastOptions) => AkToastHandle
  /** 关掉全部提示。 */
  destroyAll: () => void
}

interface ToastItem {
  key: number
  content: ReactNode
  variant: AkToastVariant
  title?: ReactNode
  duration: number
  closable: boolean
  onClose?: () => void
  paused: boolean
  /** 剩余时长（暂停时扣掉已走的）与本轮开始计时的时刻。 */
  remaining: number
  started: number
}

const ToastContext = createContext<AkToastApi | null>(null)

export interface AkToastProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 默认停留时长（ms），0 = 不自动消失；单条可以在选项里改。 */
  duration?: number
  /** 默认显示 ✕ 关闭按钮。 */
  closable?: boolean
  /** 鼠标悬停 / 键盘聚焦在某条上时暂停它的倒计时。 */
  keepAliveOnHover?: boolean
  /** 最多同时显示几条，多了先关最早的。 */
  max?: number
  /** 读屏里提示栈的名字。 */
  label?: string
  /** 应用内容：里面的组件可以 `useToast()`。 */
  children?: ReactNode
}

/**
 * 轻提示的容器：包在应用最外层，里面的组件用 `useToast()` 弹提示。
 *
 * 提示栈固定在视口右下角，是一个 `aria-live="polite"` 的区域：新弹出的提示
 * 读屏会念，不打断当前朗读。
 */
export function AkToastProvider({
  duration = 5000,
  closable = true,
  keepAliveOnHover = true,
  max,
  label = '通知',
  className,
  children,
  ...rest
}: AkToastProviderProps) {
  const [, setVersion] = useState(0)
  const items = useRef<ToastItem[]>([])
  const timers = useRef(new Map<number, TimerHandle>())
  const seq = useRef(0)

  const commit = useCallback((next: ToastItem[]) => {
    items.current = next
    setVersion((version) => version + 1)
  }, [])

  const clearTimer = useCallback((key: number) => {
    const timer = timers.current.get(key)
    if (timer === undefined) return
    clearTimeout(timer)
    timers.current.delete(key)
  }, [])

  const destroy = useCallback(
    (key: number) => {
      const target = items.current.find((item) => item.key === key)
      if (!target) return
      clearTimer(key)
      commit(items.current.filter((item) => item.key !== key))
      target.onClose?.()
    },
    [clearTimer, commit],
  )

  const run = useCallback(
    (item: ToastItem) => {
      clearTimer(item.key)
      if (item.duration <= 0) return
      item.started = Date.now()
      timers.current.set(
        item.key,
        setTimeout(() => destroy(item.key), item.remaining),
      )
    },
    [clearTimer, destroy],
  )

  const api = useMemo<AkToastApi>(() => {
    const create = (content: ReactNode, options: AkToastOptions = {}): AkToastHandle => {
      const item: ToastItem = {
        key: (seq.current += 1),
        content,
        variant: options.variant ?? 'info',
        title: options.title,
        duration: options.duration ?? duration,
        closable: options.closable ?? closable,
        onClose: options.onClose,
        paused: false,
        remaining: options.duration ?? duration,
        started: 0,
      }
      let next = [...items.current, item]
      if (max !== undefined && next.length > max) {
        const oldest = next[0]
        clearTimer(oldest.key)
        oldest.onClose?.()
        next = next.slice(1)
      }
      commit(next)
      run(item)
      return { destroy: () => destroy(item.key) }
    }

    return {
      create,
      info: (content, options) => create(content, { ...options, variant: 'info' }),
      success: (content, options) => create(content, { ...options, variant: 'success' }),
      warning: (content, options) => create(content, { ...options, variant: 'warning' }),
      error: (content, options) => create(content, { ...options, variant: 'danger' }),
      destroyAll: () => {
        items.current.forEach((item) => {
          clearTimer(item.key)
          item.onClose?.()
        })
        commit([])
      },
    }
  }, [clearTimer, closable, commit, destroy, duration, max, run])

  // 卸载时把定时器清干净
  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((timer) => clearTimeout(timer))
      pending.clear()
    }
  }, [])

  function hold(item: ToastItem, on: boolean) {
    if (!keepAliveOnHover || item.duration <= 0) return
    if (item.paused === on) return
    item.paused = on
    if (on) {
      clearTimer(item.key)
      item.remaining = Math.max(0, item.remaining - (Date.now() - item.started))
    } else {
      run(item)
    }
    commit([...items.current])
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        {...rest}
        className={cx('ak-toasts', className)}
        data-slot="ak-toasts"
        role="region"
        aria-label={label}
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.current.map((item) => (
          <div
            key={item.key}
            className={cx('ak-toast', item.variant !== 'info' && `ak-toast--${item.variant}`, item.paused && 'is-paused')}
            data-slot="ak-toast"
            style={item.duration > 0 ? ({ '--_dur': `${item.duration}ms` } as CSSProperties) : undefined}
            onMouseEnter={() => hold(item, true)}
            onMouseLeave={() => hold(item, false)}
            onFocus={() => hold(item, true)}
            onBlur={() => hold(item, false)}
          >
            <div className="ak-toast__body">
              {item.title !== undefined ? <div className="ak-toast__title">{item.title}</div> : null}
              <div>{item.content}</div>
            </div>
            {item.closable ? (
              <button type="button" className="ak-toast__close" aria-label="关闭" onClick={() => destroy(item.key)}>
                ✕
              </button>
            ) : null}
            {item.duration > 0 ? <i className="ak-toast__progress" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/**
 * 拿轻提示的接口。
 *
 * 必须在 `AkToastProvider` 里面用；不在里面时返回一个空实现（不抛错）。
 */
export function useToast(): AkToastApi {
  const api = useContext(ToastContext)
  const fallback = useMemo<AkToastApi>(
    () => ({
      create: () => ({ destroy: () => {} }),
      info: () => ({ destroy: () => {} }),
      success: () => ({ destroy: () => {} }),
      warning: () => ({ destroy: () => {} }),
      error: () => ({ destroy: () => {} }),
      destroyAll: () => {},
    }),
    [],
  )
  return api ?? fallback
}

// ── Tooltip（文字提示） ───────────────────────────────────────────────

export type AkTooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
export type AkTooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'

export interface AkTooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'content'> {
  /** 提示内容。 */
  content?: ReactNode
  /** 出现在触发元素的哪一边。 */
  placement?: AkTooltipPlacement
  /** 触发方式：`hover` 悬停 + 键盘聚焦（默认）· `focus` 只看聚焦 · `click` 点击开合 · `manual` 只由 `open` 定。 */
  trigger?: AkTooltipTrigger
  /** 悬停多久后出现（ms）。 */
  delay?: number
  /** 移开多久后消失（ms）。 */
  duration?: number
  /** 禁用：不再出现。 */
  disabled?: boolean
  /** 宽版：允许折行、上限 280px。 */
  wide?: boolean
  /** 受控显示状态。 */
  open?: boolean
  /** 非受控模式下的初始显示状态。 */
  defaultOpen?: boolean
  /** 显示状态变化时回调。 */
  onOpenChange?: (open: boolean) => void
  /** 触发元素（单个）。 */
  children?: ReactNode
}

/**
 * 文字提示：触发元素 + 气泡。
 *
 * 定位不依赖任何 JS 定位库：气泡用 CSS 绝对定位贴在触发元素的一边
 * （`placement` 决定方向与对齐），外层 `.ak-tip-anchor` 给定位上下文。
 */
export function AkTooltip({
  content,
  placement = 'top',
  trigger = 'hover',
  delay = 100,
  duration = 100,
  disabled = false,
  wide = false,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: AkTooltipProps) {
  const instanceId = useInstanceId('ak-tip')
  const bubbleId = `${instanceId}-bubble`
  const [isOpen, setOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange)
  const timer = useRef<TimerHandle | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current === null) return
    clearTimeout(timer.current)
    timer.current = null
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const show = useCallback(
    (wait: number) => {
      if (disabled) return
      clearTimer()
      timer.current = setTimeout(() => setOpen(true), wait)
    },
    [clearTimer, disabled, setOpen],
  )

  const hide = useCallback(
    (wait: number) => {
      clearTimer()
      timer.current = setTimeout(() => setOpen(false), wait)
    },
    [clearTimer, setOpen],
  )

  const child = isValidElement(children) ? (children as ReactElement<Record<string, unknown>>) : null
  const childProps = child?.props ?? {}
  const describedBy = [childProps['aria-describedby'], bubbleId].filter(Boolean).join(' ')

  const childHandlers: Record<string, unknown> = { 'aria-describedby': describedBy }

  if (trigger === 'hover' || trigger === 'focus') {
    childHandlers.onMouseEnter = (event: ReactMouseEvent) => {
      ;(childProps.onMouseEnter as ((e: ReactMouseEvent) => void) | undefined)?.(event)
      show(delay)
    }
    childHandlers.onMouseLeave = (event: ReactMouseEvent) => {
      ;(childProps.onMouseLeave as ((e: ReactMouseEvent) => void) | undefined)?.(event)
      hide(duration)
    }
    childHandlers.onFocus = (event: ReactFocusEvent) => {
      ;(childProps.onFocus as ((e: ReactFocusEvent) => void) | undefined)?.(event)
      show(0)
    }
    childHandlers.onBlur = (event: ReactFocusEvent) => {
      ;(childProps.onBlur as ((e: ReactFocusEvent) => void) | undefined)?.(event)
      hide(0)
    }
  }

  if (trigger === 'click') {
    childHandlers.onClick = (event: ReactMouseEvent) => {
      ;(childProps.onClick as ((e: ReactMouseEvent) => void) | undefined)?.(event)
      if (disabled) return
      setOpen(!isOpen)
    }
  }

  // 触发元素不可聚焦时补一个 tabindex，键盘才够得着
  if (child && childProps.tabIndex === undefined && !['button', 'a', 'input', 'select', 'textarea'].includes(String(child.type))) {
    childHandlers.tabIndex = 0
  }

  const cloned = child ? cloneElement(child, childHandlers) : null

  return (
    <span {...rest} className={cx('ak-tip-anchor', className)} data-slot="ak-tip">
      {cloned}
      <span id={bubbleId} role="tooltip" className={cx('ak-tip', `ak-tip--${placement}`, wide && 'ak-tip--wide')} data-slot="ak-tip-bubble" hidden={!isOpen}>
        {content}
      </span>
    </span>
  )
}

// ── Search（搜索框） ──────────────────────────────────────────────────

export interface AkSearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** 占位提示。 */
  placeholder?: string
  /** 尺寸档。 */
  size?: AkControlSize
  /** 禁用。 */
  disabled?: boolean
  /** 可访问名（`aria-label`）。 */
  label?: string
  /** 聚焦快捷键（单个按键，如 `/`）：右侧显示键帽，在页面上别处按下它就聚焦到这里。 */
  shortcut?: string
  /** 受控的搜索词。 */
  value?: string
  /** 非受控模式下的初始搜索词。 */
  defaultValue?: string
  /** 搜索词变化时回调。 */
  onValueChange?: (value: string) => void
  /** 在输入框里按了回车。 */
  onSearch?: (query: string) => void
}

/** 搜索框：左侧放大镜 + `input[type=search]`（+ 右侧快捷键键帽）。 */
export function AkSearch({
  placeholder,
  size = 'md',
  disabled = false,
  label = '搜索',
  shortcut,
  value,
  defaultValue = '',
  onValueChange,
  onSearch,
  className,
  ...rest
}: AkSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useControllableState<string>(value, defaultValue, onValueChange)

  useEffect(() => {
    if (!shortcut) return
    const doc = inputRef.current?.ownerDocument ?? (typeof document === 'undefined' ? null : document)
    if (!doc) return
    function onDocKey(event: KeyboardEvent) {
      if (event.key !== shortcut || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    doc.addEventListener('keydown', onDocKey)
    return () => doc.removeEventListener('keydown', onDocKey)
  }, [shortcut])

  return (
    <div {...rest} className={cx('ak-search', className)} data-slot="ak-search">
      <span className="ak-search__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" focusable="false">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      </span>
      <input
        {...sizeAttrs(size)}
        ref={inputRef}
        type="search"
        className="ak-input"
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        aria-label={label}
        aria-keyshortcuts={shortcut}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            onSearch?.(query)
          }
        }}
      />
      {shortcut && !query ? (
        <kbd className="ak-search__kbd" aria-hidden="true">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  )
}

// ── Kbd（键帽） ───────────────────────────────────────────────────────

export interface AkKbdProps extends HTMLAttributes<HTMLElement> {
  /** 键名：`Ctrl`、`K`、`Esc`、`↵`、`/` … */
  children?: ReactNode
}

/** 键帽：快捷键提示（面板页脚、触发器右侧、行内说明）。 */
export function AkKbd({ className, children, ...rest }: AkKbdProps) {
  return (
    <kbd {...rest} className={cx('ak-kbd', className)} data-slot="ak-kbd">
      {children}
    </kbd>
  )
}

// ── Scope（作用域根） ─────────────────────────────────────────────────

export type AkScopeTheme = 'terminal' | 'archive'

export interface AkScopeProps extends HTMLAttributes<HTMLDivElement> {
  /** 局部主题：`terminal` 终端（暗）· `archive` 档案（亮）；不传 = 跟随宿主页面。 */
  theme?: AkScopeTheme
  /** 根元素标签。 */
  tag?: 'div' | 'section' | 'article' | 'main' | 'aside'
  /** 作用域里的内容。 */
  children?: ReactNode
}

/**
 * 作用域根：把本库的令牌挂到这一层（`data-ak-theme`），于是这一块子树
 * 换一套配色，而不用给每个组件单独改。
 */
export function AkScope({ theme, tag = 'div', className, children, ...rest }: AkScopeProps) {
  const Tag = tag
  return (
    <Tag {...rest} className={cx('ak-scope', className)} data-slot="ak-scope" data-ak-theme={theme}>
      {children}
    </Tag>
  )
}
