import type { ButtonHTMLAttributes, ElementType, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound, type TactileSoundType } from '../../lib/audio'

export type AkItemTier = 1 | 2 | 3 | 4 | 5 | 6

export interface AkItemProps extends Omit<ButtonHTMLAttributes<HTMLElement>, 'name'> {
  /** 渲染标签，默认为 'button'。 */
  as?: ElementType
  /** 品质/稀有度等级（1 到 6 档）。对应样式表 `--ak-rarity-*`。 */
  tier?: AkItemTier
  /** 物品图标节点；若缺省且无子节点，自动绘制 45° 旋转晶体。 */
  icon?: ReactNode
  /** 物品名称。 */
  name?: ReactNode
  /** 右上角数量角标。 */
  count?: ReactNode
  /** 价格（商店场景）。 */
  price?: ReactNode
  /** 是否处于已售罄或置灰状态。 */
  sold?: boolean
  /** 是否处于选中状态。 */
  selected?: boolean
  /** 是否禁用。 */
  disabled?: boolean
  /** 尺寸档：图标边长、内距与文字字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-item-tier': '#ff9433' }`。 */
  tokens?: AkTokens
  /** 触发点击时播放的触觉音效。传 false 禁用音效，缺省时 5/6 阶播 'pip'，其余播 'select'。 */
  sound?: TactileSoundType | false
}

/**
 * 道具 / 材料方块（Material Tile）。
 *
 * 对应 `_ak-item.scss`：高光底板、品质阶层色条、45° 晶体光晕与角标数量。
 */
export function AkItem({
  as: Tag = 'button',
  tier = 1,
  icon,
  name,
  count,
  price,
  sold = false,
  selected = false,
  disabled = false,
  size = 'md',
  tokens,
  className,
  style,
  children,
  type,
  sound,
  ...rest
}: AkItemProps) {
  const isButton = Tag === 'button'
  const buttonType = isButton ? type ?? 'button' : undefined
  const itemSound = sound !== undefined ? sound : (tier >= 5 ? 'pip' : 'select')

  return (
    <Tag
      {...rest}
      type={buttonType}
      disabled={isButton ? disabled : undefined}
      aria-disabled={disabled || undefined}
      aria-selected={selected || undefined}
      {...sizeAttrs(size)}
      className={cx(
        'ak-item',
        `ak-item--tier-${tier}`,
        sold && 'ak-item--sold',
        selected && 'ak-item--selected',
        disabled && 'ak-item--disabled',
        className,
      )}
      style={tokenStyle(tokens, style)}
      data-slot="ak-item"
      data-tier={tier}
      tabIndex={isButton ? rest.tabIndex : (disabled ? -1 : (rest.tabIndex ?? (rest.onClick ? 0 : undefined)))}
      onClick={(e: MouseEvent<HTMLElement>) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        if (itemSound) {
          playTactileSound(itemSound, 0.16)
        }
        rest.onClick?.(e)
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (!isButton && rest.onClick && (e.key === 'Enter' || e.key === ' ')) {
          if (disabled) {
            e.preventDefault()
            return
          }
          e.preventDefault()
          if (itemSound) {
            playTactileSound(itemSound, 0.16)
          }
          rest.onClick(e as unknown as MouseEvent<HTMLElement>)
        }
        rest.onKeyDown?.(e)
      }}
    >
      <div className="ak-item__icon">
        {icon ?? children}
      </div>

      {count !== undefined ? <span className="ak-item__count">{count}</span> : null}
      {name ? <span className="ak-item__name">{name}</span> : null}
      {price !== undefined ? <span className="ak-item__price">{price}</span> : null}
    </Tag>
  )
}
