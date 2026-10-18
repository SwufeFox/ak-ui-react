import type { CSSProperties, ElementType, HTMLAttributes } from 'react'
import { cx } from '../../lib/utils'

/**
 * 上游特效层（`.ak-fx-*`）的 React 外壳。
 *
 * 这三样是 ak-ui 真正的动效语言，此前只有 CSS、**没有任何组件暴露它们**：
 *   .ak-fx--glow     1.5s ease-out infinite alternate 的 box-shadow 呼吸
 *   .ak-fx--outline  0.7s ease-out infinite 的轮廓向外扩散淡出
 *   .ak-fx--skew     静态倾斜 ±10°（不是动画，是形状语言）
 *
 * 它们跑的是 CSS animation（`infinite`），不是 transition——这是与通用网页过渡最本质的
 * 区别，也是「方舟感」的来源：持续呼吸的辉光、周期性扩散的轮廓环。
 *
 * 相对定位要求：`--outline` 用 `outline-offset` 向外扩，元素本身不必是 relative；
 * 但 `--glow` 的阴影要可见，元素不能是 `overflow: hidden` 的子级。
 */

export type AkGlowTone = 'default' | 'action' | 'info' | 'danger'
export type AkSkewDirection = 'left' | 'right'

export interface AkGlowProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** 辉光色。默认取上游的 `rgba(255,255,255,.3)`；给档位则接信号色令牌。 */
  tone?: AkGlowTone
  /** 直接指定辉光色，优先于 `tone`。 */
  color?: string
}

/**
 * 呼吸辉光：无限交替的 box-shadow 动画（上游 1.5s ease-out alternate）。
 *
 * ```tsx
 * <AkGlow tone="action"><AkButton variant="action">Deploy</AkButton></AkGlow>
 * ```
 */
export function AkGlow({ as: Tag = 'span', tone = 'default', color, className, children, ...rest }: AkGlowProps) {
  const toneColor: Record<AkGlowTone, string | undefined> = {
    default: undefined,
    action: 'var(--ak-signal-action)',
    info: 'var(--ak-signal-info)',
    danger: 'var(--ak-signal-danger)',
  }
  const glow = color ?? toneColor[tone]

  return (
    <Tag
      {...rest}
      className={cx('ak-fx--glow', className)}
      data-slot="ak-glow"
      data-tone={tone}
      style={glow ? ({ '--ak-fx-glow-color': glow, ...rest.style } as CSSProperties) : rest.style}
    >
      {children}
    </Tag>
  )
}

export interface AkOutlineProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** 轮廓色。默认灰色。 */
  color?: string
}

/**
 * 扩散轮廓环：无限循环的 outline 向外扩散并淡出（上游 0.7s ease-out）。
 * 典型的「这里可以点」提示语言。
 */
export function AkOutline({ as: Tag = 'span', color, className, children, ...rest }: AkOutlineProps) {
  return (
    <Tag
      {...rest}
      className={cx('ak-fx--outline', className)}
      data-slot="ak-outline"
      style={color ? ({ '--ak-outline-color': color, ...rest.style } as CSSProperties) : rest.style}
    >
      {children}
    </Tag>
  )
}

export interface AkSkewProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** 倾斜方向：left = -10deg，right = +10deg。 */
  direction?: AkSkewDirection
}

/**
 * 静态倾斜：上游的 `skewX(±10deg)`。**是形状语言不是动画**——
 * 方舟的斜切面板靠它成形，所以和上面两个动效放在同一层。
 */
export function AkSkew({ as: Tag = 'span', direction = 'left', className, children, ...rest }: AkSkewProps) {
  // SCSS 里是 .ak-fx--skew-left / .ak-fx--skew-right（&-skew 再嵌 &-left），
  // 没有单独的 .ak-fx--skew 类——别多拼一个不存在的类名。
  return (
    <Tag
      {...rest}
      className={cx(`ak-fx--skew-${direction}`, className)}
      data-slot="ak-skew"
      data-direction={direction}
    >
      {children}
    </Tag>
  )
}
