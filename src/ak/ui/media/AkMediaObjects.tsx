import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

/**
 * 头像 / 缩略图 / 横滑区，以及面包屑。
 *
 * ⚠️ **上游都没有这几样**（只有 `.ak-r-avatar`，那是稀有度色轨垫在头像下的那层，
 * 被 `AkAvatar` 复用了）。所以这一组是本库补的，几何全部取自既有语汇。
 *
 * ⚠️ `AkAvatar` **刻意不做圆形**：本库的几何语言是直角
 * （decor 层注释原文：「不做圆角，不做辉光，也没有切角/斜切/斜带」）。
 * 圆形头像是通用后台语汇，不属于这里。要圆就自己给 `border-radius`，
 * 但默认不该是。
 */

// ── 头像 ────────────────────────────────────────────────────────────

export type AkAvatarSize = 'sm' | 'default' | 'lg' | 'xl'

export interface AkAvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 图片地址。给了就渲染 `<img>`，否则用 `fallback`。 */
  src?: string
  /** 图片替代文字，同时作为无障碍名。 */
  alt?: string
  /** 无图时的回退内容（通常是一个拉丁首字母）。 */
  fallback?: ReactNode
  size?: AkAvatarSize
  /** 右上角切角（复用全局 `--ak-cut`）。 */
  cut?: boolean
  /** 信号色描边（在线/告警那种）。 */
  accent?: boolean
  /** 压淡（离线/失效）。 */
  muted?: boolean
}

export function AkAvatar({
  src,
  alt,
  fallback,
  size = 'default',
  cut = false,
  accent = false,
  muted = false,
  className,
  ...rest
}: AkAvatarProps) {
  return (
    <span
      {...rest}
      className={cx(
        'ak-avatar',
        variantClass('ak-avatar', size),
        cut && 'ak-avatar--cut',
        accent && 'ak-avatar--accent',
        muted && 'ak-avatar--muted',
        className,
      )}
      data-slot="ak-avatar"
      data-size={size}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img className="ak-avatar__img" src={src} alt="" />
      ) : (
        <span className="ak-avatar__fallback" aria-hidden="true">
          {fallback}
        </span>
      )}
    </span>
  )
}

export interface AkAvatarGroupProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/** 叠放头像组。后面的压在前面的上面。 */
export function AkAvatarGroup({ className, children, ...rest }: AkAvatarGroupProps) {
  return (
    <span {...rest} className={cx('ak-avatar-group', className)} data-slot="ak-avatar-group">
      {children}
    </span>
  )
}

// ── 缩略图 ──────────────────────────────────────────────────────────

export interface AkThumbnailProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  src?: string
  alt?: string
  /** 无图时显示的内容。不传则只有斜纹底（明显是占位）。 */
  fallback?: ReactNode
  /** 左下角角标（编号那种）。 */
  badge?: ReactNode
  /** 右上角切角。 */
  cut?: boolean
  size?: 'default' | 'wide' | 'lg'
}

export function AkThumbnail({
  src,
  alt,
  fallback,
  badge,
  cut = false,
  size = 'default',
  className,
  ...rest
}: AkThumbnailProps) {
  return (
    <div
      {...rest}
      className={cx(
        'ak-thumbnail',
        size === 'wide' && 'ak-thumbnail--wide',
        size === 'lg' && 'ak-thumbnail--lg',
        cut && 'ak-thumbnail--cut',
        className,
      )}
      data-slot="ak-thumbnail"
      data-size={size}
    >
      {src ? <img className="ak-thumbnail__img" src={src} alt={alt ?? ''} /> : fallback}
      {badge ? <span className="ak-thumbnail__badge">{badge}</span> : null}
    </div>
  )
}

// ── 横滑区 ──────────────────────────────────────────────────────────

export type AkScrollAxis = 'y' | 'x' | 'both'

export interface AkScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** 哪个方向可滚。默认 `y`。 */
  axis?: AkScrollAxis
  /** `y` / `both` 时的最大高度，默认 20rem（令牌 `--ak-scroll-max`）。 */
  maxHeight?: string
  children?: ReactNode
}

/**
 * 横滑/纵滑容器。**只做主题化滚动条与溢出控制，不自绘滚动条** ——
 * 自绘要接管键盘与拖拽，很容易做得比原生差。
 */
export function AkScrollArea({ axis = 'y', maxHeight, className, style, children, ...rest }: AkScrollAreaProps) {
  const merged: CSSProperties = {
    ...(axis !== 'x' && maxHeight ? { '--ak-scroll-max': maxHeight } : {}),
    ...style,
  } as CSSProperties

  return (
    <div
      {...rest}
      // ⚠️ 不能用 variantClass(..., 'y')：它把默认值当 fallback，于是 axis='y' 时
      //    不生成修饰符类，而 max-height 只写在 --y 上 → max-height 静默失效（实测 none）。
      className={cx('ak-scroll-area', `ak-scroll-area--${axis}`, className)}
      data-slot="ak-scroll-area"
      data-axis={axis}
      style={merged}
    >
      {children}
    </div>
  )
}

// ── 面包屑 ──────────────────────────────────────────────────────────

export interface AkBreadcrumbItem {
  /** 显示文字。 */
  label: ReactNode
  /** 链接地址。最后一项（当前页）通常不给。 */
  href?: string
}

export interface AkBreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: AkBreadcrumbItem[]
  /** 读屏名。 */
  ariaLabel?: string
}

/**
 * 层级路径。分隔符用拉丁双箭头 `»` —— 本库已经在用这个字符表示路径/动作
 * （见 `AkChevrons`），不用 `/` 或 `>`。
 *
 * 最后一项渲染成当前页（非链接、加粗）。
 */
export function AkBreadcrumb({ items, ariaLabel = 'Breadcrumb', className, ...rest }: AkBreadcrumbProps) {
  return (
    <nav {...rest} className={className} data-slot="ak-breadcrumb" aria-label={ariaLabel}>
      {/* 列表属性（list-style / padding / 布局）都在 ol 上，nav 只当语义外壳 */}
      <ol className="ak-breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="ak-breadcrumb__item">
              {isLast || !item.href ? (
                <span className="ak-breadcrumb__current" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a className="ak-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
