import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

/**
 * 标签档位。
 *
 * - `default` / `advanced` / `danger` / `neutral` 是本库原有的语义档；
 * - `outline` / `accent` / `accent-soft` 是上游 tag.css 的三个色调档
 *   （透明底+强边框 / 信号色实底 / 信号色淡底）。
 */
export type AkTagVariant = 'default' | 'advanced' | 'danger' | 'neutral' | 'outline' | 'accent' | 'accent-soft'
export type AkStatusVariant = 'default' | 'warning' | 'critical' | 'offline'

export interface AkTagProps extends HTMLAttributes<HTMLElement> {
  /**
   * 渲染成什么标签。默认 `span` —— 纯标签不是控件。
   *
   * 需要「可点选的筛选标签」时传 `button`：样式表里的 `button.ak-tag`
   * 已经有悬停 / 按压 / 禁用 / `:focus-visible`，选中态由 `aria-pressed` 驱动。
   * 更上层的选择器（带分组语义、勾选图标）用 `AkChip`。
   */
  as?: ElementType
  /** `as="button"` 时的原生按钮类型，默认 `button`（避免在表单里意外提交）。 */
  type?: 'button' | 'submit' | 'reset'
  /** `as="button"` 时的禁用态；其他标签下忽略。 */
  disabled?: boolean
  /** 语义档位。 */
  variant?: AkTagVariant
  /** 尺寸档。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkTag({
  as: Tag = 'span',
  variant = 'default',
  size = 'md',
  type,
  disabled,
  tokens,
  className,
  style,
  children,
  ...rest
}: AkTagProps) {
  const isButton = Tag === 'button'
  return (
    <Tag
      {...rest}
      {...(isButton ? { type: type ?? 'button', disabled } : {})}
      {...sizeAttrs(size)}
      data-slot="ak-tag"
      data-variant={variant}
      className={cx('ak-tag', variantClass('ak-tag', variant), className)}
      style={tokenStyle(tokens, style)}
    >
      {children}
    </Tag>
  )
}

export interface AkStatusProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Secondary text shown after the signal label. */
  detail?: ReactNode
  /** Primary label. Falls back to `Online`, matching the original registry component. */
  label?: ReactNode
  /** 语义档位。 */
  variant?: AkStatusVariant
  /** 尺寸档：信号点直径与字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkStatus({ detail = '', label = 'Online', variant = 'default', size = 'md', tokens, className, style, ...rest }: AkStatusProps) {
  return (
    <span
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-status', variantClass('ak-status', variant), className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-status"
      data-variant={variant}
    >
      <span className="ak-status__signal" aria-hidden="true" />
      <span className="ak-status__label">{label}</span>
      <span className="ak-status__detail">{detail}</span>
    </span>
  )
}
