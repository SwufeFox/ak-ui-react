import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'

/**
 * 焦距与底图处理（文章原则二 / 三 / 五）。
 *
 * 这一组与 decor 其余部分的来源不同，**必须交代清楚**：
 * `_ak-decor.scss` / `_ak-arknights.scss` 移植自 prts-design；
 * 而这里是按《明日方舟 UI 拆解》那篇文章补的 —— 三个关键词
 * （vignette / noise / mosaic）在**上游 SCSS 里零命中**，毛玻璃全库也只有 1 处
 * （dialog 遮罩）。所以它是本库自己的增补，不是移植。
 *
 * 出处逐条对应文章：
 *   vignette —— 原则三「一圈内投影布于页面周围…突出页面中心的信息」（章节选择页）
 *   grain    —— 原则五「噪点与漫画网点纸风格的底图处理方法…用在基础组件上可以使留白不显得单薄」
 *   mosaic   —— 原则五「局部不稳定马赛克化，营造出带梗的信息暗示」/「失去同步」
 *   backdrop —— 原则二「背景模糊…色彩结合更加柔和」「覆盖特性…让玩家窥见之前的页面」
 */

// ── 毛玻璃 / 亚克力 ─────────────────────────────────────────────────

export type AkBackdropStrength = 'light' | 'heavy'

export interface AkBackdropProps extends HTMLAttributes<HTMLElement> {
  /** 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 */
  as?: ElementType
  /** `light` 对齐上游 dialog 的 3px；`heavy` 12px，用于整层覆盖。 */
  strength?: AkBackdropStrength
  /** 直接给模糊半径，覆盖 `strength`。 */
  blur?: number
  /** 玻璃底色。默认取 `--ak-surface-raised`。 */
  surface?: string
  /** 子内容。 */
  children?: ReactNode
}

/**
 * 毛玻璃层。**模糊的是背后**的内容（`backdrop-filter`），所以它必须盖在别的内容之上，
 * 否则看不出效果 —— 这正是文章说的「覆盖特性」：让人窥见下层页面，降低层级跳转的抗拒。
 *
 * ⚠️ 模糊半径 3px 取自上游 dialog 遮罩那唯一一处，不是另调的。
 */
export function AkBackdrop({
  as: Tag = 'div',
  strength = 'light',
  blur,
  surface,
  className,
  children,
  ...rest
}: AkBackdropProps) {
  const style: CSSProperties = {
    ...(typeof blur === 'number' ? { '--ak-backdrop-blur': `${blur}px` } : {}),
    ...(surface ? { '--ak-backdrop-surface': surface } : {}),
    ...rest.style,
  } as CSSProperties

  return (
    <Tag
      {...rest}
      className={cx('ak-backdrop', `ak-backdrop--${strength}`, className)}
      data-slot="ak-backdrop"
      data-strength={strength}
      style={style}
    >
      {children}
    </Tag>
  )
}

// ── 暗角 ────────────────────────────────────────────────────────────

export interface AkVignetteProps extends HTMLAttributes<HTMLElement> {
  /** 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 */
  as?: ElementType
  /** 内投影扩散范围，默认 22%（令牌 `--ak-vignette-size`）。 */
  size?: string
  /** 暗角色，默认取 `--ak-vignette-color`。 */
  color?: string
  /** 子内容。 */
  children?: ReactNode
}

/**
 * 暗角（热点效应）：四周内投影，把视线压向画面中心。
 *
 * 内容会被自动抬到暗角之上（`> * { z-index: 2 }`），所以直接当容器用即可。
 * 刻意不给宿主元素加 `box-shadow` —— 用的是 `::after`，宿主的阴影槽保持可用。
 */
export function AkVignette({ as: Tag = 'div', size, color, className, children, ...rest }: AkVignetteProps) {
  const style: CSSProperties = {
    ...(size ? { '--ak-vignette-size': size } : {}),
    ...(color ? { '--ak-vignette-color': color } : {}),
    ...rest.style,
  } as CSSProperties

  return (
    <Tag {...rest} className={cx('ak-vignette', className)} data-slot="ak-vignette" style={style}>
      {children}
    </Tag>
  )
}

// ── 噪点 ────────────────────────────────────────────────────────────

export interface AkGrainProps extends HTMLAttributes<HTMLElement> {
  /** 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 */
  as?: ElementType
  /** 颗粒尺寸，默认 3px。 */
  size?: string
  /** 颗粒色，默认取 `--ak-grain-color`。 */
  color?: string
  /** 子内容。 */
  children?: ReactNode
}

/**
 * 噪点层。文章原话：网点纸「用在基础组件（如按钮上）可以使留白不显得单薄」。
 * grain 是比半点网更细、密度更低的版本，适合整块面板打底。
 */
export function AkGrain({ as: Tag = 'div', size, color, className, children, ...rest }: AkGrainProps) {
  const style: CSSProperties = {
    ...(size ? { '--ak-grain-size': size } : {}),
    ...(color ? { '--ak-grain-color': color } : {}),
    ...rest.style,
  } as CSSProperties

  return (
    <Tag {...rest} className={cx('ak-grain', className)} data-slot="ak-grain" style={style}>
      {children}
    </Tag>
  )
}

// ── 失同步马赛克 ────────────────────────────────────────────────────

export interface AkMosaicProps extends HTMLAttributes<HTMLElement> {
  /** 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 */
  as?: ElementType
  /** 马赛克块尺寸，默认 5px（令牌 `--ak-mosaic-size`）。 */
  size?: string
  /** 像素块颜色。 */
  color?: string
  /** 让被盖住的内容轻微失焦，更像「信号不稳」而不是「贴了格子」。 */
  blur?: boolean
  /** 子内容。 */
  children?: ReactNode
}

/**
 * 失同步马赛克。文章讲的是「局部不稳定马赛克化，营造出带梗的信息暗示」
 * —— 出处是《刺客信条》的记忆不同步，方舟用在干员报道与剿灭作战背景里。
 *
 * 当遮罩用：盖在图片或文字上表示「这段数据不稳定 / 未解锁 / 正在接入」。
 */
export function AkMosaic({ as: Tag = 'div', size, color, blur = false, className, children, ...rest }: AkMosaicProps) {
  const style: CSSProperties = {
    ...(size ? { '--ak-mosaic-size': size } : {}),
    ...(color ? { '--ak-mosaic-color': color } : {}),
    ...rest.style,
  } as CSSProperties

  return (
    <Tag
      {...rest}
      className={cx('ak-mosaic', blur && 'ak-mosaic--blur', className)}
      data-slot="ak-mosaic"
      style={style}
    >
      {children}
    </Tag>
  )
}
