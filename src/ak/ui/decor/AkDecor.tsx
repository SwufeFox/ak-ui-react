import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

/**
 * 装饰语言组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 *
 * 这组是「像明日方舟而不是通用后台」的几何语言：斜纹、半调网点、网格底纹、
 * 角标三角、HUD 括号、大写拉丁装饰字、黑白反转、双语标题、双箭头。
 * 整套系统里不出现 45° 斜边，层级与状态靠色条、黑白反转、角标三角表达。
 */

type DivProps = HTMLAttributes<HTMLDivElement>

type SlotProps<T extends HTMLElement> = HTMLAttributes<T> & { children?: ReactNode }

// ── 拉丁展示字 / 数据字 ────────────────────────────────────────────────

export interface AkDisplayProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
  /** 最大号展示字（落地页 / 区块主标题）。 */
  xl?: boolean
}

/** 大写拉丁展示字（Novecento 语言）。 */
export function AkDisplay({ as: Tag = 'span', xl = false, className, children, ...rest }: AkDisplayProps) {
  return (
    <Tag
      {...rest}
      className={cx('ak-display', xl && 'ak-display--xl', className)}
      data-slot="ak-display"
      data-variant={xl ? 'xl' : 'default'}
    >
      {children}
    </Tag>
  )
}

export interface AkNumProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
}

/** 面板 / HUD 数字：等宽数位，不进表格（表格用正文字体）。 */
export function AkNum({ as: Tag = 'span', className, children, ...rest }: AkNumProps) {
  return (
    <Tag {...rest} className={cx('ak-num', className)} data-slot="ak-num">
      {children}
    </Tag>
  )
}

export interface AkCodeIdProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
}

/** 编号小字（LM04 / R001 这类）。 */
export function AkCodeId({ as: Tag = 'span', className, children, ...rest }: AkCodeIdProps) {
  return (
    <Tag {...rest} className={cx('ak-code-id', className)} data-slot="ak-code-id">
      {children}
    </Tag>
  )
}

export interface AkWatermarkProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
}

/** 面板右下的大号水印字，5% 不透明度。 */
export function AkWatermark({ as: Tag = 'span', className, children, ...rest }: AkWatermarkProps) {
  return (
    <Tag {...rest} className={cx('ak-watermark', className)} data-slot="ak-watermark" aria-hidden="true">
      {children}
    </Tag>
  )
}

// ── 双语标题 ──────────────────────────────────────────────────────────

export interface AkBilingualProps extends SlotProps<HTMLSpanElement> {
  /** 中文主标题。 */
  cn: ReactNode
  /** 英文副标题（大写拉丁字）。 */
  en?: ReactNode
  /** 中文与英文并排一行，而不是上下两行。 */
  row?: boolean
}

/** 双语标题：CJK 主 + EN 副。 */
export function AkBilingual({ cn, en, row = false, className, ...rest }: AkBilingualProps) {
  return (
    <span {...rest} className={cx('ak-bilingual', row && 'ak-bilingual--row', className)} data-slot="ak-bilingual">
      <span className="ak-bilingual__cn">{cn}</span>
      {en ? <span className="ak-bilingual__en">{en}</span> : null}
    </span>
  )
}

// ── 交互装饰 ──────────────────────────────────────────────────────────

export interface AkChevronsProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
  /** 传 href 时渲染成链接，悬停箭头右移。 */
  href?: string
}

/** 双箭头动作标记（前往 »）。 */
export function AkChevrons({ as, href, className, children, ...rest }: AkChevronsProps) {
  const Tag = (as ?? (href ? 'a' : 'span')) as ElementType
  return (
    <Tag {...(href ? { href } : {})} {...rest} className={cx('ak-chevrons', className)} data-slot="ak-chevrons">
      {children}
    </Tag>
  )
}

export interface AkInverseProps extends SlotProps<HTMLDivElement> {
  as?: ElementType
}

/** 黑白反转块（游戏内按钮的 on/off 语言）。 */
export function AkInverse({ as: Tag = 'div', className, children, ...rest }: AkInverseProps) {
  return (
    <Tag {...rest} className={cx('ak-inverse', className)} data-slot="ak-inverse">
      {children}
    </Tag>
  )
}

export interface AkGlyphBoxProps extends SlotProps<HTMLSpanElement> {
  children?: ReactNode
}

/** 深底白线稿图标框，两主题不反相。 */
export function AkGlyphBox({ className, children, ...rest }: AkGlyphBoxProps) {
  return (
    <span {...rest} className={cx('ak-glyph-box', className)} data-slot="ak-glyph-box">
      {children}
    </span>
  )
}

// ── 底纹与角标 ────────────────────────────────────────────────────────

export type AkStripesVariant = 'default' | 'strong' | 'warning' | 'danger' | 'hazard'

export interface AkStripesProps extends DivProps {
  /** 条纹高度，默认 6px（等同上游 .ak-stripe-bar）。 */
  bar?: boolean
  variant?: AkStripesVariant
}

/** 警戒斜纹。`bar` 收成一条 6px 的分隔带。 */
export function AkStripes({ bar = false, variant = 'default', className, children, ...rest }: AkStripesProps) {
  return (
    <div
      {...rest}
      className={cx('ak-stripes', variantClass('ak-stripes', variant), bar && 'ak-stripe-bar', className)}
      data-slot="ak-stripes"
      data-variant={variant}
      aria-hidden={children ? undefined : true}
    >
      {children}
    </div>
  )
}

export type AkCornerPosition = 'tl' | 'tr'
export type AkCornerTone = 'info' | 'yellow' | 'red'

export interface AkCornerProps extends DivProps {
  /** 大号角标（18px 直角边）。 */
  large?: boolean
  position?: AkCornerPosition
  tone?: AkCornerTone
}

/** 角标三角：官网右上角三角 / 游戏内选中角标。 */
export function AkCorner({ large = false, position = 'tl', tone = 'info', className, children, ...rest }: AkCornerProps) {
  return (
    <div
      {...rest}
      className={cx(
        'ak-corner',
        position !== 'tl' && 'ak-corner--tr',
        tone !== 'info' && `ak-corner--${tone}`,
        large && 'ak-corner--lg',
        className,
      )}
      data-slot="ak-corner"
      data-position={position}
      data-tone={tone}
    >
      {children}
    </div>
  )
}

export type AkBracketsProps = DivProps

/** HUD 边角括号：只在左上 / 右下画两个细线角。 */
export function AkBrackets({ className, children, ...rest }: AkBracketsProps) {
  return (
    <div {...rest} className={cx('ak-brackets', className)} data-slot="ak-brackets">
      {children}
    </div>
  )
}

export type AkBackdropVariant = 'grid' | 'dots' | 'diag' | 'scanlines'

export interface AkGridBackdropProps extends DivProps {
  variant?: AkBackdropVariant
}

/** 蓝图网格 / 点阵 / 斜线 / 扫描线底纹，可当任意面板的底层背景。 */
export function AkGridBackdrop({ variant = 'grid', className, children, ...rest }: AkGridBackdropProps) {
  const base = variant === 'scanlines' ? 'ak-scanlines' : `ak-bg-${variant}`
  return (
    <div {...rest} className={cx(base, className)} data-slot="ak-backdrop" data-variant={variant}>
      {children}
    </div>
  )
}

// ── 半调网点 ──────────────────────────────────────────────────────────

export type AkHalftoneVariant = 'default' | 'left' | 'full'

export interface AkHalftoneProps extends DivProps {
  /** 网点自身也当容器用时打开（默认只做背景层）。 */
  as?: ElementType
  variant?: AkHalftoneVariant
}

/** 半调网点底纹（游戏内蓝色标题条的网点渐变）。 */
export function AkHalftone({ as: Tag = 'div', variant = 'default', className, children, ...rest }: AkHalftoneProps) {
  return (
    <Tag
      {...rest}
      className={cx(
        'ak-halftone',
        variant === 'left' && 'ak-halftone--l',
        variant === 'full' && 'ak-halftone--full',
        className,
      )}
      data-slot="ak-halftone"
      data-variant={variant}
    >
      {children}
    </Tag>
  )
}

export interface AkBlueBandProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
}

/** 游戏内蓝色标题条（带网点）。 */
export function AkBlueBand({ as: Tag = 'span', className, children, ...rest }: AkBlueBandProps) {
  return (
    <Tag {...rest} className={cx('ak-blue-band', 'ak-halftone', className)} data-slot="ak-blue-band">
      {children}
    </Tag>
  )
}

// ── 其他小件 ──────────────────────────────────────────────────────────

export interface AkOverlineProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
}

/** 上方小标签字（大写、加宽字距、muted 色）。 */
export function AkOverline({ as: Tag = 'span', className, children, ...rest }: AkOverlineProps) {
  return (
    <Tag {...rest} className={cx('ak-overline', className)} data-slot="ak-overline">
      {children}
    </Tag>
  )
}

export interface AkEnProps extends SlotProps<HTMLSpanElement> {
  as?: ElementType
}

/** 大写拉丁字（`ak-display` 的小字版本，用于标签）。 */
export function AkEn({ as: Tag = 'span', className, children, ...rest }: AkEnProps) {
  return (
    <Tag {...rest} className={cx('ak-en', className)} data-slot="ak-en">
      {children}
    </Tag>
  )
}

export interface AkGlyphProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** 亮色主题下不反相。 */
  keep?: boolean
  /** 始终当白色线稿处理。 */
  white?: boolean
}

/** 白色线稿图标包装（亮色主题下按需要反相）。 */
export function AkGlyph({ as: Tag = 'span', keep = false, white = false, className, children, ...rest }: AkGlyphProps) {
  return (
    <Tag
      {...rest}
      className={cx('ak-glyph', keep && 'ak-glyph--keep', white && 'ak-glyph--white', className)}
      data-slot="ak-glyph"
    >
      {children}
    </Tag>
  )
}
