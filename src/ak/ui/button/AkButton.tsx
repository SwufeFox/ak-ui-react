import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound, type TactileSoundType } from '../../lib/audio'

export type AkButtonVariant = 'default' | 'outline' | 'action' | 'advanced' | 'light' | 'danger' | 'ghost'

export interface AkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders a leading inline-start icon slot. */
  icon?: ReactNode
  /** Renders a trailing inline-end icon slot. */
  iconEnd?: ReactNode
  /** Stretches the button to the full width of its container. */
  block?: boolean
  /** 外观档位：default / outline / action / advanced / light / danger / ghost。 */
  variant?: AkButtonVariant
  /** 尺寸档。默认 `md`（= 50px 高，改造前的值）。 */
  size?: AkControlSize
  /** 是否开启方舟经典右上角斜切角。 */
  chamfer?: boolean
  /**
   * 药丸形按钮（`.ak-button--pill`：两端全圆角）。
   */
  pill?: boolean
  /**
   * 文字链形态（`.ak-button--link`：无底无框，悬停下划线）。
   */
  link?: boolean
  /**
   * 仅图标形态（`.ak-button--icon`：正方形，宽 = 高，无横向内距）。
   * 按钮仍需自带可访问名（`children` 或 `aria-label`）。
   */
  iconOnly?: boolean
  /**
   * 加载态（`.ak-button--loading` / `.is-loading`）：置 `aria-busy`、禁用激活，
   * 并显示一枚居中的转圈指示。文字仍在 DOM 里（视觉上被转圈盖住），无障碍名不变。
   */
  loading?: boolean
  /** 副标题 / 战术代号（大写等宽小字，常用于双语排版如「部署 // DEPLOY」）。 */
  subtitle?: ReactNode
  /** 逐实例令牌覆盖，例如 `{ '--ak-button-bg': '#ff5e19' }`。 */
  tokens?: AkTokens
  /** 触发点击时播放的触觉音效。传 false 禁用音效，缺省时 action/danger 变体播 'confirm'，其余播 'click'。 */
  sound?: TactileSoundType | false
}

export function AkButton({
  block = false,
  variant = 'default',
  size = 'md',
  chamfer = false,
  pill = false,
  link = false,
  iconOnly = false,
  loading = false,
  subtitle,
  icon,
  iconEnd,
  tokens,
  className,
  children,
  type = 'button',
  style,
  sound,
  ...rest
}: AkButtonProps) {
  const isDisabled = loading || Boolean(rest.disabled)

  return (
    <button
      {...rest}
      type={type}
      disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...sizeAttrs(size)}
      data-slot="ak-button"
      data-variant={variant}
      data-loading={loading || undefined}
      className={cx(
        'ak-button',
        variantClass('ak-button', variant),
        block && 'ak-button--block',
        chamfer && 'ak-button--chamfer',
        pill && 'ak-button--pill',
        link && 'ak-button--link',
        iconOnly && 'ak-button--icon',
        loading && 'ak-button--loading',
        // 上游的加载态写法（`.ak-button.is-loading`），与本库的修饰类同义。
        loading && 'is-loading',
        Boolean(subtitle) && 'ak-button--with-subtitle',
        className,
      )}
      style={tokenStyle(tokens, style)}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault()
          return
        }
        const soundToPlay =
          sound !== undefined ? sound : (variant === 'action' || variant === 'danger' ? 'confirm' : 'click')
        if (soundToPlay) {
          playTactileSound(soundToPlay, 0.16)
        }
        rest.onClick?.(e)
      }}
    >
      {icon ? (
        <span className="ak-button__icon" data-icon="inline-start">
          {icon}
        </span>
      ) : null}
      {subtitle ? (
        <span className="ak-button__content">
          <span className="ak-button__label">{children}</span>
          <span className="ak-button__subtitle">{subtitle}</span>
        </span>
      ) : (
        <span className="ak-button__label">{children}</span>
      )}
      {iconEnd ? (
        <span className="ak-button__icon" data-icon="inline-end">
          {iconEnd}
        </span>
      ) : null}
    </button>
  )
}
