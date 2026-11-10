import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { AkRarity, type AkRarityLevel } from './AkArknights'

/**
 * 干员 / 敌人数据卡组件
 *
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 * —— packages/css/src/arknights/op-card.css · op-row.css · enemy.css
 *
 * 图片一律由宿主通过 props 传入；没有图片时留一块主题化占位块，
 * 不引用任何游戏素材，也不留「点了没反应」的假控件。
 */

type DivProps = HTMLAttributes<HTMLDivElement>

/** 稀有度的中文读法（角标 alt / 精英化 alt 用）。 */
const CN = ['零', '一', '二', '三', '四', '五', '六']

/** 取 ReactNode 里的纯文本（做 alt / title 用）；非字符串返回空串。 */
function textOf(node: ReactNode): string {
  return typeof node === 'string' || typeof node === 'number' ? String(node) : ''
}

// ── 干员卡 Op card ────────────────────────────────────────────────────

export type AkOpCardSize = 'sm' | 'md' | 'lg'
export type AkOpCardVariant = 'default' | 'rail'

export interface AkOpCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 干员名。 */
  name: ReactNode
  /** 名字下的小字（英文名 · 编号 / 生日 / 获得方式）。 */
  sub?: ReactNode
  /** 头像图片地址（正方形）。不传时留一块主题化占位块。 */
  avatar?: string
  /** 头像的替代文本；`avatarOnly` 时同时用作读屏名。 */
  avatarAlt?: string
  /** 稀有度 1–6：头像底色 + 右下角星级。 */
  rarity: AkRarityLevel
  /** 右下角星级图片地址；不传时用 CSS 星形（`AkRarity`）。 */
  rarityIcon?: string
  /** 左上角职业图标的替代文本。 */
  profession?: string
  /** 左上角职业图标地址；不传不显示该角标。 */
  professionIcon?: string
  /** 左下角精英化阶段 0–2。 */
  elite?: 0 | 1 | 2
  /** 左下角精英化图标地址；不传不显示该角标。 */
  eliteIcon?: string
  /** 尺寸档：sm 88 · md 128 · lg 180（px 宽）。 */
  size?: AkOpCardSize
  /** 外观：default 稀有度只看头像底 · rail 另加稀有度色左边条。 */
  variant?: AkOpCardVariant
  /** 链接到干员页；不传渲染成 `div`。 */
  href?: string
  /** 当前项：强调色描边 + `aria-current="page"`。 */
  current?: boolean
  /** 纯头像：不显示名字栏，名字改作读屏名与悬停提示。 */
  avatarOnly?: boolean
  /** 头像右上角的额外角标。 */
  badge?: ReactNode
}

/**
 * 干员卡（游戏内干员列表卡）。
 *
 * 整块可点击：`href` 存在时渲染成 `a`，否则是 `div`。
 * 头像图片可选——不给图时画一块中性占位块，头像底仍是稀有度色。
 */
export function AkOpCard({
  name,
  sub,
  avatar,
  avatarAlt,
  rarity,
  rarityIcon,
  profession,
  professionIcon,
  elite,
  eliteIcon,
  size = 'md',
  variant = 'default',
  href,
  current = false,
  avatarOnly = false,
  badge,
  className,
  ...rest
}: AkOpCardProps) {
  const Tag = (href ? 'a' : 'div') as ElementType
  const nameText = textOf(name)

  return (
    <Tag
      {...rest}
      {...(href ? { href } : {})}
      className={cx(
        'ak-op-card',
        'ak-not-prose',
        variantClass('ak-op-card', size, 'md'),
        variant === 'rail' && 'ak-op-card--rail',
        current && 'is-current',
        className,
      )}
      data-slot="ak-op-card"
      data-rarity={rarity}
      data-size={size}
      data-variant={variant}
      {...(current ? { 'aria-current': 'page' as const } : {})}
      {...(avatarOnly ? { title: rest.title ?? nameText } : {})}
    >
      <span className="ak-op-card__portrait">
        {avatar ? (
          <img src={avatar} alt={avatarOnly ? avatarAlt || nameText : ''} />
        ) : (
          <span className="ak-op-card__portrait-placeholder" aria-hidden="true" />
        )}

        <span className="ak-op-card__rarity">
          {rarityIcon ? (
            <img src={rarityIcon} alt={`${CN[rarity]}星`} />
          ) : (
            <AkRarity level={rarity} />
          )}
        </span>

        {professionIcon ? (
          <span className="ak-op-card__prof">
            <img src={professionIcon} alt={profession ?? ''} />
          </span>
        ) : null}

        {eliteIcon ? (
          <span className="ak-op-card__elite">
            <img src={eliteIcon} alt={elite === undefined ? '' : `精英${CN[elite]}`} />
          </span>
        ) : null}

        {badge ? <span className="ak-op-card__badge">{badge}</span> : null}
      </span>

      {avatarOnly ? null : (
        <span className="ak-op-card__name">
          {name}
          {sub ? <span className="ak-op-card__sub">{sub}</span> : null}
        </span>
      )}
    </Tag>
  )
}

export interface AkOpGridProps extends DivProps {}

/** 干员卡网格：每列最窄 112px，卡片宽度由网格定。 */
export function AkOpGrid({ className, children, ...rest }: AkOpGridProps) {
  return (
    <div {...rest} className={cx('ak-op-grid', className)} data-slot="ak-op-grid">
      {children}
    </div>
  )
}

// ── 干员横向条目 Op row ───────────────────────────────────────────────

export interface AkOpRowProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 干员名。 */
  name: ReactNode
  /** 头像图片地址（正方形，36px 显示）；不传时显示名字首字母。 */
  avatar?: string
  /** 稀有度 1–6：头像底色；给 `stars` 时第二行的星也按它画。 */
  rarity?: AkRarityLevel
  /** 第二行小字：分支 / 职业 / 获得方式。 */
  meta?: ReactNode
  /** 在第二行前面画稀有度星（需要 `rarity`）。 */
  stars?: boolean
  /** 链接到干员页；不传渲染成 `span`。 */
  href?: string
}

/** 干员横向条目：列表 / 表格里一行一位——头像 + 名字 + 第二行小字。 */
export function AkOpRow({
  name,
  avatar,
  rarity,
  meta,
  stars = false,
  href,
  className,
  ...rest
}: AkOpRowProps) {
  const Tag = (href ? 'a' : 'span') as ElementType
  const nameText = textOf(name)
  const initial = nameText.trim().slice(0, 1).toUpperCase()

  return (
    <Tag
      {...rest}
      {...(href ? { href } : {})}
      className={cx('ak-op-row', 'ak-not-prose', className)}
      data-slot="ak-op-row"
    >
      <span className="ak-avatar" {...(rarity ? { 'data-rarity': rarity } : {})}>
        {avatar ? (
          <img className="ak-avatar__img" src={avatar} alt="" />
        ) : initial ? (
          <span className="ak-avatar__fallback" aria-hidden="true">
            {initial}
          </span>
        ) : null}
      </span>

      <span className="ak-op-row__body">
        <span className="ak-op-row__name">{name}</span>
        {meta || (stars && rarity) ? (
          <span className="ak-op-row__meta">
            {stars && rarity ? <AkRarity level={rarity} size="sm" /> : null}
            {meta}
          </span>
        ) : null}
      </span>
    </Tag>
  )
}

// ── 敌人卡 Enemy ──────────────────────────────────────────────────────

export type AkEnemyRank = 'normal' | 'elite' | 'boss'

const ENEMY_RANK: Record<AkEnemyRank, string> = { normal: 'NORMAL', elite: 'ELITE', boss: 'BOSS' }

export interface AkEnemyProps extends DivProps {
  /** 敌人名。 */
  name: ReactNode
  /** 编号（B003 / E020 / N001），显示在级别后面：「BOSS · B003」。 */
  code?: ReactNode
  /** 级别：normal 普通 · elite 精英（橙色条）· boss 领袖（红色条）。 */
  variant?: AkEnemyRank
  /** 头像图片地址（方图，裁成 64px 圆）；不传时是深色空圆。 */
  src?: string
  /** 威胁度：点亮几枚菱形。 */
  level?: number
  /** 菱形总数。 */
  levelMax?: number
}

/** 敌人卡：头像 + 编号 + 名字 + 威胁度菱形。 */
export function AkEnemy({
  name,
  code,
  variant = 'normal',
  src,
  level,
  levelMax = 4,
  className,
  children,
  ...rest
}: AkEnemyProps) {
  const rank = ENEMY_RANK[variant]
  const codeText = [rank, textOf(code)].filter(Boolean).join(' · ')

  return (
    <div
      {...rest}
      className={cx('ak-enemy', variant !== 'normal' && `ak-enemy--${variant}`, className)}
      data-slot="ak-enemy"
      data-variant={variant}
    >
      {src ? (
        <img className="ak-enemy__img" src={src} alt="" />
      ) : (
        <span className="ak-enemy__img" aria-hidden="true" />
      )}

      <div>
        <div className="ak-enemy__code">{codeText}</div>
        <div className="ak-enemy__name">{name}</div>
        {level !== undefined ? (
          <div className="ak-enemy__level" role="img" aria-label={`威胁度 ${level} / ${levelMax}`}>
            {Array.from({ length: levelMax }, (_, index) => (
              <i key={index} className={index < level ? 'on' : undefined} />
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  )
}
