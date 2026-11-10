import type { ComponentPropsWithoutRef, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import { cx } from '../../lib/utils'
import { useInstanceId } from '../../lib/useId'
import { useControllableState } from '../../lib/useControllableState'

/**
 * 面板族组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 *
 * 覆盖：手风琴（AkCollapse / AkCollapseItem）、面板（AkPanel）、区块标题
 * （AkHeading）、正文提示框（AkCbox）、反馈条（AkMessage）、空状态（AkEmpty）、
 * 统计（AkStat / AkStatRow）、路径条（AkPathNav）。
 *
 * 图标一律由宿主传入（`icon` prop 或 children）；组件自带的只是几个通用的
 * 几何线稿（信息 / 警告 / 对勾），没有游戏素材。
 */

type DivProps = HTMLAttributes<HTMLDivElement>

// ── 通用线稿图标（几何图形，非游戏素材） ────────────────────────────────

interface GlyphProps {
  /** 线稿路径。 */
  path: string
  /** 额外的圆 / 线。 */
  extra?: string
}

/** 20×20 的通用线稿图标。 */
function Glyph({ path, extra }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={path} />
      {extra ? <path d={extra} /> : null}
    </svg>
  )
}

const GLYPH_INFO = { path: 'M12 11v5', extra: 'M12 7.4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' }
const GLYPH_CHECK = { path: 'm4.5 12.5 5 5 10-11' }
const GLYPH_WARN = { path: 'M12 10v4', extra: 'M12 17.4h.01M12 3.6 22 20.4H2Z' }
const GLYPH_ARROW = { path: 'M5 12h13M13 6l6 6-6 6' }
const GLYPH_NEUTRAL = { path: 'M8.5 12h7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' }
const GLYPH_EMPTY = { path: 'M4 8.5 12 4l8 4.5v7L12 20l-8-4.5Z', extra: 'M4 8.5 12 13l8-4.5M12 13v7' }

// ── Accordion（手风琴） ─────────────────────────────────────────────────

interface CollapseContextValue {
  /** 该项当前是否展开。 */
  isOpen: (name: string) => boolean
  /** 切换该项。 */
  toggle: (name: string) => void
}

const CollapseContext = createContext<CollapseContextValue | null>(null)

export interface AkCollapseProps extends Omit<DivProps, 'children' | 'onChange'> {
  /** 手风琴模式：同一时间只展开一项（展开一项会收起其余）。 */
  accordion?: boolean
  /** 受控：当前展开项的 `name` 列表。给了就是受控模式，此值恒胜。 */
  expanded?: string[]
  /** 非受控模式下的初始展开项。 */
  defaultExpanded?: string[]
  /** 展开项变化时回调（受控 / 非受控都触发）。 */
  onExpandedChange?: (expanded: string[]) => void
  /** 若干 `AkCollapseItem`。 */
  children?: ReactNode
}

/**
 * 折叠面板组：放若干 `AkCollapseItem`。
 *
 * 键盘：↑ / ↓ / Home / End 在各项标题之间移动焦点（WAI-ARIA Accordion 的
 * 可选键盘支持）；开合由各项自己的 `Enter` / `空格` 完成。
 */
export function AkCollapse({
  accordion = false,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  className,
  children,
  onKeyDown,
  ...rest
}: AkCollapseProps) {
  const [current, setCurrent] = useControllableState<string[]>(expanded, defaultExpanded, onExpandedChange)

  const context = useMemo<CollapseContextValue>(
    () => ({
      isOpen: (name) => current.includes(name),
      toggle: (name) => {
        const isOpen = current.includes(name)
        const others = current.filter((item) => item !== name)
        setCurrent(isOpen ? others : accordion ? [name] : [...others, name])
      },
    }),
    [current, accordion, setCurrent],
  )

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const target = event.target as HTMLElement
    if (target.tagName !== 'SUMMARY') return
    const heads = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(':scope > details > summary'))
    const index = heads.indexOf(target)
    if (index < 0) return
    const next =
      event.key === 'ArrowDown'
        ? heads[(index + 1) % heads.length]
        : event.key === 'ArrowUp'
          ? heads[(index - 1 + heads.length) % heads.length]
          : event.key === 'Home'
            ? heads[0]
            : heads[heads.length - 1]
    if (!next) return
    event.preventDefault()
    next.focus()
  }

  return (
    <div {...rest} className={cx('ak-collapse', className)} data-slot="ak-collapse" onKeyDown={handleKeyDown}>
      <CollapseContext.Provider value={context}>{children}</CollapseContext.Provider>
    </div>
  )
}

export interface AkCollapseItemProps extends Omit<ComponentPropsWithoutRef<'details'>, 'open' | 'title' | 'children' | 'onToggle'> {
  /** 标识：放进 `AkCollapse` 的 `expanded` 数组里用；不写则自动生成（只能靠点击开合）。 */
  name?: string
  /** 标题。 */
  title?: ReactNode
  /** 受控展开状态（只在**不放在** `AkCollapse` 里时生效）。 */
  open?: boolean
  /** 非受控模式下的初始展开状态。 */
  defaultOpen?: boolean
  /** 展开状态变化时回调。 */
  onOpenChange?: (open: boolean) => void
  /** 禁用：不能展开 / 收起。 */
  disabled?: boolean
  /** 展开后的内容。 */
  children?: ReactNode
}

/**
 * 折叠面板的一项：原生 `<details>` + `<summary>` + 正文区。
 *
 * 放在 `AkCollapse` 里时开合由组统一管；单独用时自己记状态。
 */
export function AkCollapseItem({
  name,
  title,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...rest
}: AkCollapseItemProps) {
  const group = useContext(CollapseContext)
  const instanceId = useInstanceId('ak-collapse')
  const key = name ?? instanceId
  const [standaloneOpen, setStandaloneOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange)
  const isOpen = group ? group.isOpen(key) : standaloneOpen

  const toggle = useCallback(() => {
    if (disabled) return
    const next = !isOpen
    if (group) {
      group.toggle(key)
      onOpenChange?.(next)
    } else {
      setStandaloneOpen(next)
    }
  }, [disabled, isOpen, group, key, onOpenChange, setStandaloneOpen])

  return (
    <details
      {...rest}
      className={cx('ak-details', className)}
      open={isOpen}
      data-slot="ak-collapse-item"
      data-name={key}
      data-disabled={disabled || undefined}
    >
      <summary
        id={`${instanceId}-head`}
        aria-controls={`${instanceId}-body`}
        aria-expanded={isOpen}
        onClick={(event) => {
          // 开合交给 React：拦掉浏览器的默认切换，状态只有一处真相
          event.preventDefault()
          toggle()
        }}
      >
        {title}
      </summary>
      <div id={`${instanceId}-body`} className="ak-details__body">
        {children}
      </div>
    </details>
  )
}

// ── Panel（带标题栏的面板） ────────────────────────────────────────────

export type AkPanelTitleTag = 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface AkPanelProps extends Omit<DivProps, 'children' | 'title'> {
  /** 标题。 */
  title?: ReactNode
  /** 标题后的拉丁小标（如 `Notice`）。 */
  en?: ReactNode
  /** 标题元素标签：默认 `div`；面板是页面大纲里的一节时用 `h2`–`h6`。 */
  titleTag?: AkPanelTitleTag
  /** 标题栏反色（亮色下黑底白字、暗色下白底黑字）。 */
  inverse?: boolean
  /** 可折叠：点标题栏收起 / 展开正文。 */
  collapsible?: boolean
  /** 受控展开状态（`collapsible` 时有效）。 */
  expanded?: boolean
  /** 非受控模式下的初始展开状态。 */
  defaultExpanded?: boolean
  /** 展开状态变化时回调。 */
  onExpandedChange?: (expanded: boolean) => void
  /** 标题栏右侧的内容（标签、日期、按钮）。 */
  headerExtra?: ReactNode
  /** 面板正文。 */
  children?: ReactNode
}

/**
 * 面板：页面上一块有名字的区域（带标题栏的容器）。
 *
 * 与卡片分工：卡片是一件可并列 / 可点的东西，面板是页面上一块有名字的区域。
 */
export function AkPanel({
  title,
  en,
  titleTag = 'div',
  inverse = false,
  collapsible = false,
  expanded,
  defaultExpanded = true,
  onExpandedChange,
  headerExtra,
  className,
  children,
  ...rest
}: AkPanelProps) {
  const instanceId = useInstanceId('ak-panel')
  const toggleRef = useRef<HTMLSpanElement | null>(null)
  const [isExpanded, setExpanded] = useControllableState<boolean>(expanded, defaultExpanded, onExpandedChange)
  const collapsed = collapsible && !isExpanded
  const bodyId = `${instanceId}-body`
  const hasHead = title !== undefined || en !== undefined || headerExtra !== undefined
  const TitleTag = titleTag

  function toggle() {
    if (!collapsible) return
    setExpanded(!isExpanded)
  }

  function onHeadClick(event: MouseEvent<HTMLDivElement>) {
    if (!collapsible) return
    // 标题栏里别的链接 / 按钮自己的点击不算
    const hit = (event.target as Element).closest('a, button, input, select, textarea, label, [role="button"]')
    if (hit && hit !== toggleRef.current) return
    toggle()
  }

  function onHeadKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    toggle()
  }

  return (
    <div
      {...rest}
      className={cx('ak-panel', collapsible && 'ak-panel--collapsible', collapsed && 'is-collapsed', className)}
      data-slot="ak-panel"
      data-collapsed={collapsed || undefined}
    >
      {hasHead ? (
        <div className={cx('ak-panel__head', inverse && 'ak-panel__head--inverse')} onClick={onHeadClick}>
          {title !== undefined || en !== undefined ? (
            <TitleTag className="ak-panel__title">
              {collapsible ? (
                <span
                  ref={toggleRef}
                  className="ak-panel__toggle"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={bodyId}
                  onKeyDown={onHeadKeyDown}
                >
                  {title}
                  {en !== undefined ? (
                    <span className="ak-en" lang="en">
                      {en}
                    </span>
                  ) : null}
                </span>
              ) : (
                <>
                  {title}
                  {en !== undefined ? (
                    <span className="ak-en" lang="en">
                      {en}
                    </span>
                  ) : null}
                </>
              )}
            </TitleTag>
          ) : null}
          {headerExtra}
        </div>
      ) : null}
      <div id={bodyId} className="ak-panel__body">
        {children}
      </div>
    </div>
  )
}

// ── Heading（区块标题） ────────────────────────────────────────────────

export type AkHeadingVariant = 'bar' | 'underline'
export type AkHeadingSize = 'md' | 'lg'
export type AkHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface AkHeadingProps extends Omit<DivProps, 'children' | 'title'> {
  /** 标题内容（也可以写在 children 里）。 */
  title?: ReactNode
  /** 拉丁副题（大写灰字）。`stack` 时叠在标题上方当眉题。 */
  en?: ReactNode
  /** 标题级别，渲染成 `h1`–`h6`。 */
  level?: AkHeadingLevel
  /** 外观：`bar` 左侧主色粗竖条（默认）· `underline` 底线 + 左段主色粗线。 */
  variant?: AkHeadingVariant
  /** 英文副题叠在标题上方。 */
  stack?: boolean
  /** 尺寸：`md` = 标题字号（默认）· `lg` = 展示字号。 */
  size?: AkHeadingSize
  /** 右侧附加（链接、开关），推到最右。 */
  extra?: ReactNode
  /** 标题内容（代替 `title`）。 */
  children?: ReactNode
}

/**
 * 区块标题：中文标题 + 左侧主色粗竖条，可带拉丁大写副题与右侧附加。
 *
 * 标题元素是真正的 `h1`–`h6`，进页面大纲。
 */
export function AkHeading({
  title,
  en,
  level = 2,
  variant = 'bar',
  stack = false,
  size = 'md',
  extra,
  className,
  children,
  ...rest
}: AkHeadingProps) {
  const TitleTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return (
    <div
      {...rest}
      className={cx('ak-heading', variant !== 'bar' && `ak-heading--${variant}`, size !== 'md' && `ak-heading--${size}`, stack && 'ak-heading--stack', className)}
      data-slot="ak-heading"
    >
      {en !== undefined && stack ? (
        <span className="ak-heading__en" lang="en">
          {en}
        </span>
      ) : null}
      <TitleTag className="ak-heading__title">{children !== undefined ? children : title}</TitleTag>
      {en !== undefined && !stack ? (
        <span className="ak-heading__en" lang="en">
          {en}
        </span>
      ) : null}
      {extra !== undefined ? <span className="ak-heading__aside">{extra}</span> : null}
    </div>
  )
}

// ── Cbox（正文提示框） ─────────────────────────────────────────────────

export type AkCboxLevel = 'tip' | 'info' | 'warning' | 'danger' | 'neutral'

const CBOX_GLYPH: Record<AkCboxLevel, GlyphProps> = {
  tip: GLYPH_ARROW,
  info: GLYPH_INFO,
  warning: GLYPH_WARN,
  danger: GLYPH_WARN,
  neutral: GLYPH_NEUTRAL,
}

export interface AkCboxProps extends Omit<DivProps, 'children' | 'title'> {
  /** 等级：`tip` 绿「另见 / 提示」· `info` 蓝（默认）· `warning` 黄 · `danger` 红 · `neutral` 灰。 */
  level?: AkCboxLevel
  /** 加粗的标题行（等级色）。 */
  title?: ReactNode
  /** 图标井里的图标；不传则按等级给一个通用线稿。 */
  icon?: ReactNode
  /** 最宽 640px。 */
  narrow?: boolean
  /** 提示正文。 */
  children?: ReactNode
}

/**
 * 正文提示框：左侧图标井 + 右侧正文。
 *
 * 与 `AkMessage` 的分工：`AkMessage` 是界面 / 系统反馈（横幅、可关闭），
 * `AkCbox` 是编辑写在正文里的提示（「另见 xx 页面」「本节内容已删除仅作存档」）。
 */
export function AkCbox({ level = 'info', title, icon, narrow = false, role, className, children, ...rest }: AkCboxProps) {
  return (
    <div
      {...rest}
      className={cx('ak-cbox', level !== 'info' && `ak-cbox--${level}`, narrow && 'ak-cbox--narrow', className)}
      data-slot="ak-cbox"
      data-level={level}
      role={role ?? 'note'}
    >
      <span className="ak-cbox__icon">{icon ?? <Glyph {...CBOX_GLYPH[level]} />}</span>
      <div className="ak-cbox__body">
        {title !== undefined ? <div className="ak-cbox__title">{title}</div> : null}
        {children}
      </div>
    </div>
  )
}

// ── Message（界面反馈条） ──────────────────────────────────────────────

export type AkMessageVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent'

const MESSAGE_GLYPH: Record<AkMessageVariant, GlyphProps> = {
  info: GLYPH_INFO,
  success: GLYPH_CHECK,
  warning: GLYPH_WARN,
  danger: GLYPH_WARN,
  neutral: GLYPH_INFO,
  accent: GLYPH_INFO,
}

export interface AkMessageProps extends Omit<DivProps, 'children' | 'title'> {
  /** 外观（等级色）：`info`（默认）· `success` · `warning` · `danger` · `neutral` · `accent`。 */
  variant?: AkMessageVariant
  /** 加粗的标题行（等级色）。 */
  title?: ReactNode
  /** 图标；不传则按 `variant` 给一个通用线稿。 */
  icon?: ReactNode
  /** 显示图标（默认显示）。 */
  showIcon?: boolean
  /** 显示右上角 ✕ 关闭按钮。 */
  closable?: boolean
  /** 横幅：顶边色条、文字居中。 */
  banner?: boolean
  /** 叠斜纹（危险横幅常用）。 */
  stripes?: boolean
  /** 受控显示状态。 */
  open?: boolean
  /** 非受控模式下的初始显示状态。 */
  defaultOpen?: boolean
  /** 显示状态变化时回调。 */
  onOpenChange?: (open: boolean) => void
  /** 点了关闭按钮时回调（在 `onOpenChange` 之后触发）。 */
  onClose?: () => void
  /** 提示正文。 */
  children?: ReactNode
}

/**
 * 界面 / 系统反馈的提示条：左色条 + 淡底。
 *
 * 警告 / 危险是 `role="alert"`（动态插入时读屏立刻念），其余是 `role="status"`
 * （礼貌播报）。
 */
export function AkMessage({
  variant = 'info',
  title,
  icon,
  showIcon = true,
  closable = false,
  banner = false,
  stripes = false,
  open,
  defaultOpen = true,
  onOpenChange,
  onClose,
  role,
  className,
  children,
  ...rest
}: AkMessageProps) {
  const [isOpen, setOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange)
  if (!isOpen) return null

  const semanticRole = role ?? (variant === 'warning' || variant === 'danger' ? 'alert' : 'status')

  return (
    <div
      {...rest}
      className={cx('ak-message', variant !== 'info' && `ak-message--${variant}`, banner && 'ak-message--banner', stripes && 'ak-message--stripes', className)}
      data-slot="ak-message"
      data-variant={variant}
      role={semanticRole}
    >
      {showIcon ? <span className="ak-message__icon">{icon ?? <Glyph {...MESSAGE_GLYPH[variant]} />}</span> : null}
      <div className="ak-message__body">
        {title !== undefined ? <div className="ak-message__title">{title}</div> : null}
        {children}
      </div>
      {closable ? (
        <button
          type="button"
          className="ak-message__close"
          aria-label="关闭"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}

// ── Empty（空状态） ────────────────────────────────────────────────────

export interface AkEmptyProps extends Omit<DivProps, 'children' | 'title'> {
  /** 标题（粗体一行）；传空串不显示。 */
  title?: ReactNode
  /** 说明文字（标题下一行）。 */
  description?: ReactNode
  /** 大号状态码（404 / 403）：放在图标的位置，写了就不显示图标。 */
  code?: ReactNode
  /** 图标（48px 半透明线稿）；传 `null` 不显示。 */
  icon?: ReactNode
  /** 说明下方的操作（按钮 / 链接）。 */
  extra?: ReactNode
  /** 说明文字（代替 `description`）。 */
  children?: ReactNode
}

/** 空状态：虚线框里居中一枚线稿图标 + 标题 + 说明 + 可选操作。 */
export function AkEmpty({
  title = '暂无数据',
  description,
  code,
  icon,
  extra,
  className,
  children,
  ...rest
}: AkEmptyProps) {
  return (
    <div {...rest} className={cx('ak-empty', className)} data-slot="ak-empty">
      {code !== undefined ? (
        <span className="ak-empty__code">{code}</span>
      ) : icon === null ? null : (
        <span className="ak-empty__icon">{icon ?? <Glyph {...GLYPH_EMPTY} />}</span>
      )}
      {title !== '' ? <div className="ak-empty__title">{title}</div> : null}
      {description !== undefined || children !== undefined ? <div className="ak-empty__desc">{children ?? description}</div> : null}
      {extra !== undefined ? <div className="ak-empty__extra">{extra}</div> : null}
    </div>
  )
}

// ── Stat（统计数字） ───────────────────────────────────────────────────

export type AkStatTrend = 'up' | 'down'

export interface AkStatProps extends Omit<DivProps, 'children' | 'title' | 'prefix'> {
  /** 名称（小号大写 overline）。 */
  label?: ReactNode
  /** 数值（原样显示，千分位等格式由调用方先排好）。 */
  value?: ReactNode
  /** 变化量（「+4 本月」「-12%」）。 */
  delta?: ReactNode
  /** 变化方向；不写时按 `delta` 开头的 `+` / `-` 判断。 */
  trend?: AkStatTrend
  /** 行内：一行「名称 数值」，不要卡片框。 */
  inline?: boolean
  /** 数值前面的内容（货币符号、图标）。 */
  prefix?: ReactNode
  /** 数值后面的小字单位。 */
  suffix?: ReactNode
  /** 数值（代替 `value`）。 */
  children?: ReactNode
}

/** 统计数字：小号大写的名称 + 大号等宽数字 + 可选变化量。 */
export function AkStat({ label, value, delta, trend, inline = false, prefix, suffix, className, children, ...rest }: AkStatProps) {
  const deltaText = typeof delta === 'string' ? delta : undefined
  const direction: AkStatTrend | undefined =
    trend ?? (deltaText && deltaText.startsWith('+') ? 'up' : deltaText && /^[-−]/.test(deltaText) ? 'down' : undefined)

  return (
    <div {...rest} className={cx('ak-stat', inline && 'ak-stat--inline', className)} data-slot="ak-stat" data-trend={direction}>
      {label !== undefined ? <span className="ak-stat__label">{label}</span> : null}
      <span className="ak-stat__value">
        {prefix}
        {children !== undefined ? children : value}
        {suffix !== undefined ? <small>{suffix}</small> : null}
      </span>
      {delta !== undefined ? <span className={cx('ak-stat__delta', direction && `ak-stat__delta--${direction}`)}>{delta}</span> : null}
    </div>
  )
}

export interface AkStatRowProps extends DivProps {
  /** 若干 `AkStat`。 */
  children?: ReactNode
}

/** 一排统计卡片：自动铺满（每格至少 120px，放不下就换行）。 */
export function AkStatRow({ className, children, ...rest }: AkStatRowProps) {
  return (
    <div {...rest} className={cx('ak-stat-row', className)} data-slot="ak-stat-row">
      {children}
    </div>
  )
}

// ── PathNav（正文首行的路径条） ────────────────────────────────────────

export interface AkPathNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 首页链接的地址。 */
  homeHref?: string
  /** 首页链接的无障碍名（图标是 CSS 画的，文字给读屏）。 */
  homeLabel?: string
  /** 首页图标（不传则用 CSS 画的线稿房子）。 */
  homeIcon?: ReactNode
  /** 「所属一览」链接的地址。 */
  upHref?: string
  /** 「所属一览」的文字。 */
  upLabel?: ReactNode
  /** 「本页」文字（不是链接）。 */
  here?: ReactNode
  /** 读屏用的路径条名字。 */
  ariaLabel?: string
}

/**
 * 路径条：正文第一行的「首页 · 所属一览 · 本页」。
 *
 * 与面包屑分工：面包屑是页面头里的小灰字（子页面层级），这一条在正文里、
 * 是按钮（回首页 / 回所属一览）。
 */
export function AkPathNav({
  homeHref,
  homeLabel = '首页',
  homeIcon,
  upHref,
  upLabel,
  here,
  ariaLabel = '路径导航',
  className,
  ...rest
}: AkPathNavProps) {
  return (
    <nav {...rest} className={cx('ak-pathnav', className)} data-slot="ak-pathnav" aria-label={ariaLabel}>
      <span className="ak-pathnav__home">
        <a href={homeHref}>
          {homeIcon}
          <span className="ak-sr-only">{homeLabel}</span>
        </a>
      </span>
      {upHref !== undefined || upLabel !== undefined ? (
        <span className="ak-pathnav__up">
          <a href={upHref}>{upLabel}</a>
        </span>
      ) : null}
      {here !== undefined ? <span className="ak-pathnav__here">{here}</span> : null}
    </nav>
  )
}
