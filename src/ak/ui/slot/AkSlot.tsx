import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'

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
  /** 副信息（如等级 LV.50、代号等）。 */
  meta?: ReactNode
  /** 稀有度文字标识（左上角星级小字）。 */
  rarityLabel?: ReactNode
  /** 是否为空槽位（未编队/占位）。 */
  empty?: boolean
  /** 是否播放翻牌显现入场动画。 */
  reveal?: boolean
  /** 动画延迟阶梯索引（乘 80ms）。 */
  index?: number
  /** 是否为选中状态。 */
  pressed?: boolean
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
  empty = false,
  reveal = false,
  index = 0,
  pressed,
  className,
  style,
  children,
  ...rest
}: AkSlotProps) {
  const isButton = Tag === 'button'
  const computedStyle: CSSProperties = {
    ...style,
    ...(reveal && index !== undefined ? ({ '--ak-slot-index': index } as CSSProperties) : {}),
  }

  if (empty) {
    return (
      <Tag
        {...rest}
        type={isButton ? 'button' : undefined}
        className={cx('ak-slot', 'ak-slot--empty', className)}
        data-slot="ak-slot"
        data-empty="true"
        style={computedStyle}
      >
        {children ?? <span>+</span>}
      </Tag>
    )
  }

  return (
    <Tag
      {...rest}
      type={isButton ? 'button' : undefined}
      aria-pressed={pressed}
      className={cx(
        'ak-slot',
        `ak-slot--${role}`,
        `ak-slot--rarity-${rarity}`,
        reveal && 'ak-slot--reveal',
        className,
      )}
      data-slot="ak-slot"
      data-role={role}
      data-rarity={rarity}
      style={computedStyle}
    >
      {code ? <span className="ak-slot__code" aria-hidden="true">{code}</span> : null}
      {rarityLabel ? <span className="ak-slot__rarity">{rarityLabel}</span> : null}
      {name ? <span className="ak-slot__name">{name}</span> : null}
      {meta ? <span className="ak-slot__meta">{meta}</span> : null}
      {children}
    </Tag>
  )
}
