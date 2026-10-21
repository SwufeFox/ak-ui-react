import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { cx } from '../../lib/utils'

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
  className,
  children,
  type,
  ...rest
}: AkItemProps) {
  const isButton = Tag === 'button'
  const buttonType = isButton ? type ?? 'button' : undefined

  return (
    <Tag
      {...rest}
      type={buttonType}
      className={cx(
        'ak-item',
        `ak-item--tier-${tier}`,
        sold && 'ak-item--sold',
        className,
      )}
      data-slot="ak-item"
      data-tier={tier}
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
