import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound, type TactileSoundType } from '../../lib/audio'

export type AkButtonVariant = 'default' | 'outline' | 'action' | 'advanced' | 'light'

export interface AkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders a leading inline-start icon slot. */
  icon?: ReactNode
  /** Renders a trailing inline-end icon slot. */
  iconEnd?: ReactNode
  /** Stretches the button to the full width of its container. */
  block?: boolean
  /** 外观档位：default / outline / action / advanced / light。 */
  variant?: AkButtonVariant
  /** 尺寸档。默认 `md`（= 50px 高，改造前的值）。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-button-bg': '#ff5e19' }`。 */
  tokens?: AkTokens
  /** 触发点击时播放的触觉音效。传 false 禁用音效，缺省时 action 变体播 'confirm'，其余播 'click'。 */
  sound?: TactileSoundType | false
}

export function AkButton({
  block = false,
  variant = 'default',
  size = 'md',
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
  return (
    <button
      {...rest}
      type={type}
      {...sizeAttrs(size)}
      data-slot="ak-button"
      data-variant={variant}
      className={cx('ak-button', variantClass('ak-button', variant), block && 'ak-button--block', className)}
      style={tokenStyle(tokens, style)}
      onClick={(e) => {
        if (rest.disabled) {
          e.preventDefault()
          return
        }
        const soundToPlay = sound !== undefined ? sound : (variant === 'action' ? 'confirm' : 'click')
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
      <span className="ak-button__label">{children}</span>
      {iconEnd ? (
        <span className="ak-button__icon" data-icon="inline-end">
          {iconEnd}
        </span>
      ) : null}
    </button>
  )
}
