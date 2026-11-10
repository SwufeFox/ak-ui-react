import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cx, variantClass } from '../../lib/utils'

/**
 * 关卡 / 活动 / 倒计时 / 页头横幅
 *
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 * —— packages/css/src/arknights/stage.css · event.css · hero.css
 *
 * 倒计时不依赖墙钟：`remaining` 由调用方驱动，`until` 只在客户端挂载后起跑，
 * 服务端首帧与客户端首帧渲染结果一致（SSR / 测试不炸）。
 */

type DivProps = HTMLAttributes<HTMLDivElement>
type SpanProps = HTMLAttributes<HTMLSpanElement>

// ── 关卡 Stage ────────────────────────────────────────────────────────

export type AkStageVariant = 'default' | 'hard' | 'ex' | 'story'

export interface AkStageProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 关卡编号（1-7 / H6-4 / TO-EX-1）。 */
  code: ReactNode
  /** 关卡名。 */
  name?: ReactNode
  /** 编号下的小字：章节 / 类型（Main · Chapter 1 / Hard / Story）。 */
  caption?: ReactNode
  /** 左侧类型色条：hard 磨难红 · ex 深红 · story 灰；default 无色条。 */
  variant?: AkStageVariant
  /** 理智消耗：元信息行里的六边形 + 数字。 */
  sanity?: number | string
  /** 推荐等级（LV.30 / E2 LV.40），显示为「推荐 LV.30」。 */
  level?: ReactNode
  /** 链接到关卡页：整张卡是链接。 */
  href?: string
  /** 元信息行末尾追加的项（剧情关卡 / 前往关卡页 »）。 */
  meta?: ReactNode
}

/**
 * 关卡卡。
 *
 * 没有元信息行时，关卡名直接占网格第二列（紧凑格：名字可以单独省略号截断）。
 */
export function AkStage({
  code,
  name,
  caption,
  variant = 'default',
  sanity,
  level,
  href,
  meta,
  className,
  ...rest
}: AkStageProps) {
  const Tag = (href ? 'a' : 'div') as ElementType
  const hasMeta = sanity !== undefined || level !== undefined || meta !== undefined

  return (
    <Tag
      {...rest}
      {...(href ? { href } : {})}
      className={cx(
        'ak-stage',
        variantClass('ak-stage', variant, 'default'),
        href && 'ak-not-prose',
        className,
      )}
      data-slot="ak-stage"
      data-variant={variant}
    >
      <span className="ak-stage__code">
        {code}
        {caption ? <small>{caption}</small> : null}
      </span>

      {hasMeta ? (
        <span className="ak-stage__body">
          {name ? <span className="ak-stage__name">{name}</span> : null}
          <span className="ak-stage__meta">
            {sanity !== undefined ? <AkSanity value={sanity} /> : null}
            {level !== undefined ? (
              <span>
                推荐 <b>{level}</b>
              </span>
            ) : null}
            {meta}
          </span>
        </span>
      ) : name ? (
        <span className="ak-stage__name">{name}</span>
      ) : null}
    </Tag>
  )
}

export type AkStageCodeVariant = 'default' | 'hard'

export interface AkStageCodeProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** hard = 红底（磨难 / 险地关卡号）。 */
  variant?: AkStageCodeVariant
  /** 链接到关卡页；不传渲染成 `span`。 */
  href?: string
  /** 关卡号（5-8 / H6-4）。 */
  children?: ReactNode
}

/** 行内关卡号：黑白反转的小方块（展示字），放在正文 / 解锁条件里。 */
export function AkStageCode({
  variant = 'default',
  href,
  className,
  children,
  ...rest
}: AkStageCodeProps) {
  const Tag = (href ? 'a' : 'span') as ElementType

  return (
    <Tag
      {...rest}
      {...(href ? { href } : {})}
      className={cx(
        'ak-stage-code',
        variantClass('ak-stage-code', variant, 'default'),
        href && 'ak-not-prose',
        className,
      )}
      data-slot="ak-stage-code"
      data-variant={variant}
    >
      {children}
    </Tag>
  )
}

// ── 理智消耗 Sanity ───────────────────────────────────────────────────

export interface AkSanityProps extends SpanProps {
  /** 消耗的理智。 */
  value: number | string
}

/**
 * 理智消耗：六边形 + 数字（剪影，不用图片）。
 *
 * ⚠️ 与 `src/ak/ui/san/AkSan.tsx` 的 `AkSan` **不是同一个东西**：
 * `AkSan` 是带加号按钮与量表语义（`role="meter"`）的理智**计数器**，
 * `AkSanity` 是关卡卡里那一枚只读的小读数（上游 `AkSanity.vue`）。
 * 类名也不同（`.ak-san` vs `.ak-sanity`），两枚可以同时出现在一屏上。
 */
export function AkSanity({ value, className, ...rest }: AkSanityProps) {
  return (
    <span {...rest} className={cx('ak-sanity', className)} data-slot="ak-sanity">
      <span className="ak-sanity__sr">理智 </span>
      {value}
    </span>
  )
}

// ── 活动 Event ────────────────────────────────────────────────────────

export type AkEventStatus = 'default' | 'live' | 'ended'

export interface AkEventProps extends Omit<DivProps, 'title'> {
  /** 活动名。 */
  title: ReactNode
  /** 标题上方的类型行（Side Story · 进行中 / 寻访 · 已结束）。 */
  kind?: ReactNode
  /** 起止时间（2026.08.08 16:00 — 09.07 03:59）。 */
  time?: ReactNode
  /** 横幅图地址（21:9 裁切铺满）；不传时留一块主题化占位块。 */
  cover?: string
  /** 状态：live 进行中（类型行前闪烁红点）· ended 已结束（类型行转灰）。 */
  status?: AkEventStatus
}

/** 活动卡：横幅 + 类型行 + 标题 + 时间。 */
export function AkEvent({
  title,
  kind,
  time,
  cover,
  status = 'default',
  className,
  children,
  ...rest
}: AkEventProps) {
  return (
    <div
      {...rest}
      className={cx(
        'ak-event',
        status === 'live' && 'is-live',
        status === 'ended' && 'is-ended',
        className,
      )}
      data-slot="ak-event"
      data-status={status}
    >
      {cover ? (
        <img className="ak-event__banner" src={cover} alt="" />
      ) : (
        <span className="ak-event__banner ak-event__banner--placeholder" aria-hidden="true" />
      )}

      <div className="ak-event__body">
        {kind ? <div className="ak-event__type">{kind}</div> : null}
        <div className="ak-event__title">{title}</div>
        {time ? <div className="ak-event__time">{time}</div> : null}
        {children}
      </div>
    </div>
  )
}

// ── 倒计时 Countdown ──────────────────────────────────────────────────

export type AkCountdownPrecision = 'min' | 'sec'

const COUNTDOWN_UNITS = [
  { ms: 864e5, mod: Infinity, unit: 'day', zh: '天' },
  { ms: 36e5, mod: 24, unit: 'hr', zh: '小时' },
  { ms: 6e4, mod: 60, unit: 'min', zh: '分' },
  { ms: 1e3, mod: 60, unit: 'sec', zh: '秒' },
] as const

export interface AkCountdownProps extends Omit<SpanProps, 'children'> {
  /**
   * 剩余**秒**数：由调用方驱动，组件只渲染、不倒数。
   * 与 `until` 同时给时以 `until` 为准。
   */
  remaining?: number
  /**
   * 截止时刻（ISO 串 / 时间戳 / Date）：客户端挂载后才起跑倒数，
   * 服务端首帧不出内容（避免首帧与客户端不一致）。
   */
  until?: string | number | Date
  /** 是否走字（只对 `until` 生效；停下时读数补到此刻）。 */
  active?: boolean
  /** 最小单位：min 到分（默认，每分钟刷新）· sec 到秒。 */
  precision?: AkCountdownPrecision
  /** 最多显示几格，从最大的单位数起；不写则一直显示到 `precision`。 */
  parts?: number
  /** 倒数到 0 时回调（只触发一次）。 */
  onFinish?: () => void
  /** 读屏名；不传时按中文单位拼「剩余 …」。 */
  label?: string
}

/**
 * 倒计时读数（天 / 小时 / 分 / 秒）。
 *
 * 两条驱动方式，互不依赖墙钟：
 *   · `remaining`——调用方驱动，组件纯渲染（SSR / 单测最稳）；
 *   · `until`——组件自己在客户端倒数，首帧（服务端）不出内容。
 */
export function AkCountdown({
  remaining,
  until,
  active = true,
  precision = 'min',
  parts,
  onFinish,
  label,
  className,
  ...rest
}: AkCountdownProps) {
  const [deadline, setDeadline] = useState<number | null>(null)
  const [left, setLeft] = useState<number | null>(null)
  const finished = useRef(false)
  const finishRef = useRef(onFinish)
  finishRef.current = onFinish

  // 截止时刻只在客户端解析：服务端没有可信的「现在」，也不该在首帧读时钟。
  useEffect(() => {
    if (until === undefined) {
      setDeadline(null)
      return
    }
    const target = new Date(until).getTime()
    setDeadline(Number.isFinite(target) ? target : null)
  }, [until])

  useEffect(() => {
    if (deadline === null) return

    const unit = precision === 'sec' ? 1000 : 60000
    let timer = 0
    finished.current = false

    const tick = () => {
      const diff = deadline - Date.now()
      setLeft(Math.max(0, diff))
      if (diff <= 0) {
        if (!finished.current) {
          finished.current = true
          finishRef.current?.()
        }
        return
      }
      if (!active) return
      timer = window.setTimeout(tick, (diff % unit || unit) + 20)
    }

    tick()
    return () => {
      window.clearTimeout(timer)
    }
  }, [deadline, active, precision])

  const total = until !== undefined ? left : remaining !== undefined ? Math.max(0, remaining * 1000) : null

  const cells = useMemo(() => {
    if (total === null) return []
    const all = COUNTDOWN_UNITS.map((unit) => ({
      ...unit,
      value: Math.floor(total / unit.ms) % unit.mod,
    }))
    const shown = all.slice(all[0].value ? 0 : 1, precision === 'sec' ? 4 : 3)
    return parts ? shown.slice(0, parts) : shown
  }, [total, precision, parts])

  if (!cells.length) return null

  const spoken = `剩余 ${cells.map((cell) => `${cell.value} ${cell.zh}`).join(' ')}`

  return (
    <span
      {...rest}
      className={cx('ak-countdown', className)}
      data-slot="ak-countdown"
      role="timer"
      aria-label={label ?? spoken}
    >
      {cells.map((cell) => (
        <span key={cell.unit} aria-hidden="true">
          <b>{String(cell.value).padStart(2, '0')}</b>
          <small>{cell.value === 1 ? cell.unit : `${cell.unit}s`}</small>
        </span>
      ))}
    </span>
  )
}

// ── 页头横幅 Hero ─────────────────────────────────────────────────────

export interface AkHeroProps extends Omit<DivProps, 'title'> {
  /** 大标题（展示字、全大写）。 */
  title: ReactNode
  /** 标题下的中文副标。 */
  subtitle?: ReactNode
  /** 标题上方的青色小字（PRTS.WIKI · NEW SKIN DESIGN SYSTEM）。 */
  eyebrow?: ReactNode
  /** 说明文字（最宽 60 字，70% 白）。 */
  description?: ReactNode
  /** 标题下的青色横条。 */
  bar?: boolean
  /** 右侧竖直青色色面。 */
  side?: boolean
  /** 标题渲染成什么标签；默认 `h2`。 */
  titleAs?: ElementType
}

/**
 * 大标题横幅（官网风）：黑底 + 青色 overline + 大号拉丁标题（中文副标）+ 青色横条 + 说明。
 * 两套主题下都是黑底白字——这是静态的「页头横幅」，不是轮播。
 */
export function AkHero({
  title,
  subtitle,
  eyebrow,
  description,
  bar = true,
  side = true,
  titleAs = 'h2',
  className,
  children,
  ...rest
}: AkHeroProps) {
  const Heading = titleAs as ElementType

  return (
    <div {...rest} className={cx('ak-hero', className)} data-slot="ak-hero">
      {eyebrow ? <div className="ak-hero__eyebrow">{eyebrow}</div> : null}

      <Heading className="ak-hero__title">
        {title}
        {subtitle ? <span className="cn">{subtitle}</span> : null}
      </Heading>

      {bar ? <div className="ak-hero__bar" /> : null}

      {description ? <p className="ak-hero__desc">{description}</p> : null}

      {children}

      {side ? <div className="ak-hero__side" aria-hidden="true" /> : null}
    </div>
  )
}
