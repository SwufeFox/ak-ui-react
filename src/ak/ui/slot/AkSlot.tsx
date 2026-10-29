import type { CSSProperties, ElementType, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

export type AkSlotRole =
  | 'vanguard'
  | 'guard'
  | 'defender'
  | 'sniper'
  | 'caster'
  | 'medic'
  | 'supporter'
  | 'specialist'

export type AkSlotRarity = 1 | 2 | 3 | 4 | 5 | 6

export interface AkSlotProps extends HTMLAttributes<HTMLElement> {
  /** 渲染标签，默认为 'button'。 */
  as?: ElementType
  /** 干员名字。 */
  name?: ReactNode
  /** 职业代码大字水印（如 VNG / GRD / MED / CAS）。 */
  code?: ReactNode
  /** 稀有度等级（1 到 6 档）。 */
  rarity?: AkSlotRarity
  /** 职业类别，决定底部特征信号条颜色。 */
  role?: AkSlotRole
  /** 副信息（如代号、阵营、职能等）。 */
  meta?: ReactNode
  /** 稀有度文字标识（左上角星级小字）。 */
  rarityLabel?: ReactNode
  /** 精英化阶段（0 / 1 / 2）。 */
  elite?: 0 | 1 | 2
  /** 等级读数（数字或 'LV.80'）。 */
  level?: ReactNode
  /** 是否为空槽位（未编队/占位）。 */
  empty?: boolean
  /** 是否禁用/不可派遣。 */
  disabled?: boolean
  /** 是否播放翻牌显现入场动画。 */
  reveal?: boolean
  /** 动画延迟阶梯索引（乘 80ms）。 */
  index?: number
  /** 是否为选中状态。 */
  pressed?: boolean
  /** 尺寸档：槽位高度、字号与内边距一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-slot-signal': '#f5bd38' }`。 */
  tokens?: AkTokens
}

/**
 * 干员槽位卡片（Operator Slot）。
 *
 * 对应 `_ak-slot.scss`：底部职业信号条、顶部稀有度色轨、大字代码水印及选中态。
 */
export function AkSlot({
  as: Tag = 'button',
  name,
  code,
  rarity = 3,
  role = 'guard',
  meta,
  rarityLabel,
  elite,
  level,
  empty = false,
  disabled = false,
  reveal = false,
  index = 0,
  pressed,
  size = 'md',
  tokens,
  className,
  style,
  children,
  ...rest
}: AkSlotProps) {
  const isButton = Tag === 'button'
  const isInteractive = isButton || Boolean(rest.onClick)
  const computedStyle: CSSProperties = {
    ...tokenStyle(tokens, style),
    ...(reveal && index !== undefined ? ({ '--ak-slot-index': index } as CSSProperties) : {}),
  }

  if (empty) {
    return (
      <Tag
        {...rest}
        type={isButton ? 'button' : undefined}
        disabled={isButton ? disabled : undefined}
        aria-disabled={disabled || undefined}
        role={!isButton && isInteractive ? 'button' : undefined}
        tabIndex={isButton ? rest.tabIndex : (disabled ? -1 : (rest.tabIndex ?? (isInteractive ? 0 : undefined)))}
        {...sizeAttrs(size)}
        className={cx(
          'ak-slot',
          'ak-slot--empty',
          isInteractive && 'ak-slot--interactive',
          disabled && 'ak-slot--disabled',
          className,
        )}
        data-slot="ak-slot"
        data-empty="true"
        style={computedStyle}
        onClick={(e: MouseEvent<HTMLElement>) => {
          if (disabled) {
            e.preventDefault()
            return
          }
          playTactileSound('tap', 0.15)
          rest.onClick?.(e)
        }}
        onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
          if (!isButton && isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            if (disabled) {
              e.preventDefault()
              return
            }
            e.preventDefault()
            playTactileSound('tap', 0.15)
            rest.onClick?.(e as unknown as MouseEvent<HTMLElement>)
          }
          rest.onKeyDown?.(e)
        }}
      >
        {children ?? <span>+</span>}
      </Tag>
    )
  }

  return (
    <Tag
      {...rest}
      type={isButton ? 'button' : undefined}
      disabled={isButton ? disabled : undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={pressed}
      role={!isButton && isInteractive ? 'button' : undefined}
      tabIndex={isButton ? rest.tabIndex : (disabled ? -1 : (rest.tabIndex ?? (isInteractive ? 0 : undefined)))}
      {...sizeAttrs(size)}
      onClick={(e: MouseEvent<HTMLElement>) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        playTactileSound(rarity >= 5 ? 'pip' : 'click', 0.16)
        rest.onClick?.(e)
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (!isButton && isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          if (disabled) {
            e.preventDefault()
            return
          }
          e.preventDefault()
          playTactileSound(rarity >= 5 ? 'pip' : 'click', 0.16)
          rest.onClick?.(e as unknown as MouseEvent<HTMLElement>)
        }
        rest.onKeyDown?.(e)
      }}
      className={cx(
        'ak-slot',
        `ak-slot--${role}`,
        `ak-slot--rarity-${rarity}`,
        isInteractive && 'ak-slot--interactive',
        reveal && 'ak-slot--reveal',
        disabled && 'ak-slot--disabled',
        className,
      )}
      data-slot="ak-slot"
      data-role={role}
      data-rarity={rarity}
      data-elite={elite}
      style={computedStyle}
    >
      {code ? <span className="ak-slot__code" aria-hidden="true">{code}</span> : null}
      <div className="ak-slot__header">
        {rarityLabel ? <span className="ak-slot__rarity">{rarityLabel}</span> : null}
        {elite !== undefined ? (
          <span className="ak-slot__elite" data-elite={elite}>
            {elite === 0 ? 'E0' : elite === 1 ? 'E1' : 'E2'}
          </span>
        ) : null}
      </div>
      {level !== undefined ? (
        <span className="ak-slot__level">
          {typeof level === 'number' ? `LV.${level}` : level}
        </span>
      ) : null}
      {name ? <span className="ak-slot__name">{name}</span> : null}
      {meta ? <span className="ak-slot__meta">{meta}</span> : null}
      {children}
    </Tag>
  )
}
