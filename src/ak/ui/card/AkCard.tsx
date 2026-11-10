import { isValidElement, type ElementType, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

const INTERACTIVE_TAGS: Record<string, true> = {
  a: true, audio: true, button: true, details: true, embed: true, iframe: true,
  input: true, object: true, select: true, summary: true, textarea: true, video: true,
}

const INTERACTIVE_ROLES: Record<string, true> = {
  button: true, checkbox: true, combobox: true, gridcell: true, link: true,
  menuitem: true, menuitemcheckbox: true, menuitemradio: true, option: true,
  radio: true, searchbox: true, slider: true, spinbutton: true, switch: true,
  tab: true, textbox: true, treeitem: true,
}

interface ProbeProps {
  children?: ReactNode
  role?: unknown
  onClick?: unknown
  href?: unknown
  tabIndex?: unknown
  contentEditable?: unknown
}

/**
 * Whether a card's children contain their own control. Such a card MUST keep a
 * container element: a `<button>` may not contain interactive content, and the
 * inner control's activation would be swallowed by the outer one.
 *
 * Custom components cannot be rendered here, so they are traversed through
 * their `children` and treated as controls when they carry control-shaped props
 * (onClick / href / tabIndex / an interactive role). This is conservative: a
 * missed control would produce nested `<button>` HTML, which is worse.
 */
function hasInteractiveContent(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node === 'boolean') return false
  if (typeof node === 'string' || typeof node === 'number') return false
  if (Array.isArray(node)) return node.some(hasInteractiveContent)
  if (!isValidElement<ProbeProps>(node)) return false
  const { type, props } = node
  if (props.onClick !== undefined || props.href !== undefined) return true
  if (props.tabIndex !== undefined && props.tabIndex !== null && props.tabIndex !== -1) return true
  if (typeof props.role === 'string' && INTERACTIVE_ROLES[props.role] === true) return true
  if (typeof type === 'string' && INTERACTIVE_TAGS[type] === true) return true
  if (props.contentEditable === true || props.contentEditable === 'true') return true
  return hasInteractiveContent(props.children)
}

/** Nested controls keep their own clicks/keys; the card root is not "nested". */
function isInteractiveTarget(target: EventTarget | null, root: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement) || target === root) return false
  const hit = target.closest('button, input, select, textarea, a, [role="button"], [role="checkbox"], [role="switch"]')
  return hit !== null && hit !== root
}

/**
 * 外观档位。
 *
 * `flat` 无框、换成下沉底，`inset` 是内凹面，`accent-top` 在顶边加一条信号色带；
 * 其余是本库原有的档位。
 */
export type AkCardVariant = 'default' | 'outline' | 'stripe' | 'place' | 'tactical' | 'glass' | 'chassis' | 'flat' | 'inset' | 'accent-top'

export interface AkCardProps extends HTMLAttributes<HTMLElement> {
  /** 渲染标签，例如 'div' | 'article' | 'section' | 'li'。省略时，可按压且无嵌套控件的卡片会升级为原生 `<button>`。 */
  as?: ElementType
  /** 外观档位：default / outline / stripe / place / tactical / glass / chassis / flat / inset / accent-top。 */
  variant?: AkCardVariant
  /** 尺寸档：控制内边距、子块间距与标题字号。 */
  size?: AkControlSize
  /** 是否开启右上角 45° 战术切角。 */
  chamfer?: boolean
  /**
   * 是否开启悬停提亮/浮起动效。
   * 同时发出本库的 `.ak-card--hoverable` 与上游同义的 `.ak-card--hover`。
   */
  hoverable?: boolean
  /** 是否为可交互卡片（具备鼠标指针、点击沉浸与键盘焦点）。 */
  interactive?: boolean
  /** 是否处于选中状态；可交互卡片通过 `aria-pressed` 暴露。 */
  selected?: boolean
  /** 是否禁用；禁用后不响应点击，也无法用键盘激活。 */
  disabled?: boolean
  /** 逐实例令牌覆盖，例如 `{ '--ak-card-bg': '#171a1d' }`。 */
  tokens?: AkTokens
}

export function AkCard({
  as: Tag,
  variant = 'default',
  size = 'md',
  chamfer = false,
  hoverable = false,
  interactive = false,
  selected = false,
  disabled = false,
  tokens,
  className,
  style,
  children,
  ...rest
}: AkCardProps) {
  const clickable = interactive && rest.onClick !== undefined
  // A pressable card without nested controls is a single action, so it becomes a
  // real <button> and gets native Enter/Space/click plus native disabled. Cards
  // with nested controls (or an explicit `as`) keep their element and fall back
  // to role="button" — a button may not contain interactive content.
  const autoButton = Tag === undefined && clickable && !hasInteractiveContent(children)
  const Element: ElementType = autoButton ? 'button' : Tag ?? 'div'
  const isButton = Element === 'button'
  const disabledByAttr = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true'
  const ariaDisabled = disabled || disabledByAttr
  // The `disabled` prop only surfaces as aria-disabled on actionable cards: a
  // static card's implicit generic role does not support it. An explicitly
  // passed aria-disabled is always forwarded unchanged.
  const exposeDisabled = ariaDisabled && (isButton || interactive || clickable)
  const nativeType = 'type' in rest && typeof rest.type === 'string' ? rest.type : 'button'
  // `<a href>` already turns Enter into one native click; only Space needs help.
  const nativeEnter = !isButton && Element === 'a' && 'href' in rest && rest.href !== undefined
  // UA button styles (font, colour, text centring) must not leak into the card.
  const buttonReset = autoButton
    ? ({ font: 'inherit', color: 'inherit', textAlign: 'start' } as const)
    : undefined

  return (
    <Element
      {...rest}
      type={isButton ? nativeType : undefined}
      disabled={isButton ? disabled || undefined : undefined}
      aria-disabled={exposeDisabled ? true : rest['aria-disabled']}
      {...sizeAttrs(size)}
      data-slot="ak-card"
      data-variant={variant}
      data-selected={selected || undefined}
      aria-pressed={(isButton || clickable) && selected ? true : undefined}
      role={!isButton && clickable ? 'button' : rest.role}
      tabIndex={interactive && rest.tabIndex === undefined ? 0 : rest.tabIndex}
      onClick={(e: MouseEvent<HTMLElement>) => {
        if (isInteractiveTarget(e.target, e.currentTarget)) return
        if (ariaDisabled) {
          e.preventDefault()
          return
        }
        if (interactive) playTactileSound('click', 0.15)
        rest.onClick?.(e)
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        // Only role="button" containers need the manual mapping: a native
        // <button> already emits exactly one click for Enter/Space. The mapping
        // therefore fires once, never alongside the native path.
        const activationKey = e.key === 'Enter' || e.key === ' '
        const handledNatively = isButton || (nativeEnter && e.key === 'Enter')
        if (!handledNatively && clickable && activationKey && !isInteractiveTarget(e.target, e.currentTarget)) {
          e.preventDefault()
          if (!ariaDisabled && !e.repeat) {
            playTactileSound('click', 0.15)
            rest.onClick?.(e as unknown as MouseEvent<HTMLElement>)
          }
        }
        rest.onKeyDown?.(e)
      }}
      className={cx(
        'ak-card',
        variantClass('ak-card', variant),
        chamfer && 'ak-card--chamfer',
        hoverable && 'ak-card--hoverable',
        // 上游的悬停档类名；与 --hoverable 同义，两个都发。
        hoverable && 'ak-card--hover',
        interactive && 'ak-card--interactive',
        selected && 'ak-card--selected',
        className,
      )}
      style={buttonReset ? { ...buttonReset, ...(tokenStyle(tokens, style) ?? {}) } : tokenStyle(tokens, style)}
    >
      {children}
    </Element>
  )
}

type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
  /** 逐实例令牌覆盖（例如只调标题字号 `'--ak-card-title-fs'`）。 */
  tokens?: AkTokens
}

export function AkCardHeader({ className, children, tokens, style, ...rest }: SlotProps) {
  return (
    <header {...(rest as HTMLAttributes<HTMLElement>)} className={cx('ak-card__header', className)} style={tokenStyle(tokens, style)} data-slot="ak-card-header">
      {children}
    </header>
  )
}

export function AkCardTitle({ className, children, tokens, style, ...rest }: SlotProps) {
  return (
    <h3 {...(rest as HTMLAttributes<HTMLHeadingElement>)} className={cx('ak-card__title', className)} style={tokenStyle(tokens, style)} data-slot="ak-card-title">
      {children}
    </h3>
  )
}

export function AkCardDescription({ className, children, ...rest }: SlotProps) {
  return (
    <p {...(rest as HTMLAttributes<HTMLParagraphElement>)} className={cx('ak-card__description', className)} data-slot="ak-card-description">
      {children}
    </p>
  )
}

export function AkCardContent({ className, children, ...rest }: SlotProps) {
  return (
    <div {...rest} className={cx('ak-card__content', className)} data-slot="ak-card-content">
      {children}
    </div>
  )
}

export function AkCardFooter({ className, children, ...rest }: SlotProps) {
  return (
    <footer {...rest} className={cx('ak-card__footer', className)} data-slot="ak-card-footer">
      {children}
    </footer>
  )
}
