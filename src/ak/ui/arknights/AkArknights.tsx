import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { useInstanceId } from '../../lib/useId'

/**
 * 方舟游戏数据组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 *
 * 只覆盖「不依赖游戏图片素材」的部分。图标一律由宿主传入，没传就不渲染、
 * 也不占位——不存在只有游戏素材才能撑起来的空壳。
 */

type DivProps = HTMLAttributes<HTMLDivElement>
type SpanProps = HTMLAttributes<HTMLSpanElement>

// ── 稀有度 ────────────────────────────────────────────────────────────

export type AkRarityLevel = 1 | 2 | 3 | 4 | 5 | 6
export type AkRaritySize = 'sm' | 'default' | 'lg'

export interface AkRarityProps extends Omit<SpanProps, 'children'> {
  /** 星级，决定星形颜色（1 灰 → 6 橙）。 */
  level?: AkRarityLevel
  /** 尺寸档位。 */
  size?: AkRaritySize
  /** `white` 用纯白星，忽略星级配色。 */
  variant?: 'default' | 'white'
  /** 覆盖星数；默认等于 `level`。 */
  count?: number
}

/** 稀有度星级，用 clip-path 画五角星，不需要素材。 */
export function AkRarity({ level = 6, size = 'default', variant = 'default', count, className, ...rest }: AkRarityProps) {
  const stars = Math.max(0, Math.min(6, count ?? level))

  // 本地化：调用方可用 aria-label 覆盖（此前字面量写在 {...rest} 之后，传了也会被静默覆盖）
  const accessibleLabel = rest['aria-label'] ?? `${stars} 星`

  return (
    <span
      {...rest}
      className={cx(
        'ak-rarity',
        variant === 'white' ? 'ak-rarity--white' : `ak-rarity--r${level}`,
        size !== 'default' && `ak-rarity--${size}`,
        className,
      )}
      data-slot="ak-rarity"
      data-level={level}
      data-variant={variant}
      role="img"
      aria-label={accessibleLabel}
    >
      {Array.from({ length: stars }, (_, index) => (
        <i key={index} aria-hidden="true" />
      ))}
    </span>
  )
}

export interface AkRarityScopeProps extends DivProps {
  /** 给后代开启 `--ak-r` / `--ak-r-text` 色轨。 */
  level: AkRarityLevel
}

/**
 * 稀有度色轨作用域：给容器挂 `data-rarity`，后代用 `.ak-r-text` /
 * `.ak-r-bg` / `.ak-r-bar` / `.ak-r-chip` 取色。
 */
export function AkRarityScope({ level, className, children, ...rest }: AkRarityScopeProps) {
  return (
    <div {...rest} className={className} data-slot="ak-rarity-scope" data-rarity={level}>
      {children}
    </div>
  )
}

export interface AkRarityChipProps extends SpanProps {
  /** 芯片底色的稀有度档位。 */
  level: AkRarityLevel
}

/** 稀有度芯片：底色随星级，深色字。 */
export function AkRarityChip({ level, className, children, ...rest }: AkRarityChipProps) {
  return (
    <span {...rest} className={cx('ak-r-chip', className)} data-slot="ak-rarity-chip" data-rarity={level}>
      {children}
    </span>
  )
}

export interface AkRarityBarProps extends DivProps {
  /** 左缘色条的稀有度档位。 */
  level: AkRarityLevel
}

/** 左侧稀有度色条包装（卡片 / 列表行的左缘色轨）。 */
export function AkRarityBar({ level, className, children, ...rest }: AkRarityBarProps) {
  return (
    <div {...rest} className={cx('ak-r-bar', className)} data-slot="ak-rarity-bar" data-rarity={level}>
      {children}
    </div>
  )
}

// ── 职业 ──────────────────────────────────────────────────────────────

export type AkProfessionName = 'pioneer' | 'warrior' | 'tank' | 'sniper' | 'caster' | 'medic' | 'support' | 'special'
export type AkProfessionSize = 'sm' | 'default' | 'lg' | 'xl'

export interface AkProfessionProps extends Omit<SpanProps, 'children'> {
  /** 图标节点，通常是宿主自己的 `<img src=… />`。不传只保留占位框与职业色。 */
  icon?: ReactNode
  /** 职业名，决定 `--ak-p` 职业色。 */
  name: AkProfessionName
  /** 深底白图标框，两主题都不反相。 */
  boxed?: boolean
  /** 加细边框。 */
  outline?: boolean
  /** 图标框尺寸：sm / default / lg / xl。 */
  size?: AkProfessionSize
}

/** 职业图标框 + 职业色。 */
export function AkProfession({
  icon,
  name,
  boxed = false,
  outline = false,
  size = 'default',
  className,
  ...rest
}: AkProfessionProps) {
  return (
    <span
      {...rest}
      className={cx(
        'ak-prof',
        size !== 'default' && `ak-prof--${size}`,
        boxed && 'ak-prof--box',
        outline && 'ak-prof--outline',
        className,
      )}
      data-slot="ak-profession"
      data-prof={name}
      style={{ '--ak-p': `var(--ak-prof-${name})`, ...rest.style } as CSSProperties}
    >
      {icon}
    </span>
  )
}

export interface AkProfessionLabelProps extends Omit<SpanProps, 'children'> {
  /** 中文职业名。 */
  name: ReactNode
  /** 英文职业名（大写拉丁字）。 */
  en?: ReactNode
  /** 职业图标节点，由宿主传入。 */
  icon?: ReactNode
  /**
   * 子职业图标；给出后会套上 `.ak-subprof`（26px 的图标槽，图缩到 90% 并套
   * `--ak-glyph-filter`）。与 `icon` 是**两个不同的槽**，可以同时出现。
   */
  subProf?: ReactNode
  /** 子职业槽的无障碍名（槽本身是装饰性的，给了才播报）。 */
  subProfLabel?: string
  /** 职业名；给出后带上对应的 `--ak-p` 职业色。 */
  prof?: AkProfessionName
}

/** 职业标签：图标 + 中文名 + 英文名，可带子职业图标槽。 */
export function AkProfessionLabel({
  name,
  en,
  icon,
  subProf,
  subProfLabel,
  prof,
  className,
  ...rest
}: AkProfessionLabelProps) {
  return (
    <span
      {...rest}
      className={cx('ak-prof-label', className)}
      data-slot="ak-profession-label"
      {...(prof ? { 'data-prof': prof } : {})}
    >
      {icon}
      {/*
        `.ak-subprof` 是固定的 26px 图标槽，样式挂在它自己身上（含 > img 的 90% 缩放）。
        ⚠️ 它**不是** `.ak-prof-label` 的修饰符，所以必须真的多一层元素；
        把图标直接塞进 label 不会得到那个尺寸。
      */}
      {subProf ? (
        <span className="ak-subprof" aria-label={subProfLabel} aria-hidden={subProfLabel ? undefined : true}>
          {subProf}
        </span>
      ) : null}
      {name}
      {en ? <span className="ak-en">{en}</span> : null}
    </span>
  )
}

// ── 精英化 / 潜能 / 专精 ──────────────────────────────────────────────

export interface AkEliteProps extends Omit<SpanProps, 'children'> {
  /** 精英阶段 0 / 1 / 2。 */
  level: 0 | 1 | 2
  /** 精英图标，通常是宿主传入的图片。 */
  icon?: ReactNode
  /** 大号。 */
  large?: boolean
}

/** 精英化标记。 */
export function AkElite({ level, icon, large = false, className, ...rest }: AkEliteProps) {
  // 本地化：调用方可用 title 覆盖（此前字面量写在 {...rest} 之后，传了也会被静默覆盖）
  const hint = rest.title ?? `精英 ${level}`

  return (
    <span
      {...rest}
      className={cx('ak-elite', large && 'ak-elite--lg', className)}
      data-slot="ak-elite"
      data-level={level}
      title={hint}
    >
      {icon}
    </span>
  )
}

export interface AkPotentialProps extends Omit<SpanProps, 'children'> {
  /** 潜能图标。 */
  icon?: ReactNode
  /** 去掉深色底框，只留图标。 */
  bare?: boolean
  /** 可读标签，用于无障碍。 */
  label?: string
}

/** 潜能标记。 */
export function AkPotential({ icon, bare = false, label, className, ...rest }: AkPotentialProps) {
  return (
    <span
      {...rest}
      className={cx('ak-potential', bare && 'ak-potential--bare', className)}
      data-slot="ak-potential"
      {...(label ? { 'aria-label': label, role: 'img' } : {})}
    >
      {icon}
    </span>
  )
}

export interface AkSpecProps extends Omit<SpanProps, 'children'> {
  /** 专精图标。 */
  icon?: ReactNode
  /** 去掉深色底框，只留图标。 */
  bare?: boolean
  /** 无障碍名。 */
  label?: string
}

/** 专精标记。 */
export function AkSpec({ icon, bare = false, label, className, ...rest }: AkSpecProps) {
  return (
    <span
      {...rest}
      className={cx('ak-spec', bare && 'ak-spec--bare', className)}
      data-slot="ak-spec"
      {...(label ? { 'aria-label': label, role: 'img' } : {})}
    >
      {icon}
    </span>
  )
}

// ── 潜能提升一览 ──────────────────────────────────────────────────────

export interface AkPotListProps extends DivProps {}

/** 潜能提升一览：五格自动铺排，格与格之间 1px 线由格子自己画。 */
export function AkPotList({ className, children, ...rest }: AkPotListProps) {
  return (
    <div {...rest} className={cx('ak-pot-list', className)} data-slot="ak-pot-list">
      {children}
    </div>
  )
}

export interface AkPotProps extends DivProps {
  /** 左列内容，通常是潜能图标。 */
  index?: ReactNode
  /** 小标签（潜能 2 / 3 / 4 / 5 / 6）。 */
  label?: ReactNode
  /** 当前潜能已生效的项：顶部 3px 信号条 + 标签变色。 */
  active?: boolean
}

/** 潜能提升的一格。 */
export function AkPot({ index, label, active = false, className, children, ...rest }: AkPotProps) {
  return (
    <div
      {...rest}
      className={cx('ak-pot', active && 'is-on', className)}
      data-slot="ak-pot"
      data-active={active || undefined}
    >
      {index}
      <div>
        {label ? <span className="ak-pot__label">{label}</span> : null}
        {children}
      </div>
    </div>
  )
}

// ── 技能等级选择条 ────────────────────────────────────────────────────

export type AkSkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'M1' | 'M2' | 'M3'

const SKILL_LEVELS: AkSkillLevel[] = [1, 2, 3, 4, 5, 6, 7, 'M1', 'M2', 'M3']

export interface AkSkillLevelsProps {
  /** 当前等级（1-7 或 M1-M3）。 */
  value?: AkSkillLevel
  /** 等级变化时回调。 */
  onValueChange?: (value: AkSkillLevel) => void
  /** 只显示到这一级为止（例如未精英化时锁 1-7）。 */
  max?: AkSkillLevel
  /** 禁用整组。 */
  disabled?: boolean
  /** 自定义专精档的图标（M1/M2/M3）。 */
  masteryIcon?: ReactNode
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
  /** 整组的读屏名，默认「技能等级」。 */
  ariaLabel?: string
}

function levelIndex(level: AkSkillLevel): number {
  return SKILL_LEVELS.indexOf(level)
}

function isMastery(level: AkSkillLevel): boolean {
  return typeof level === 'string'
}

/**
 * 技能等级选择条：1-7 + M1-M3。
 * 受控组件，键盘左右方向键 / Home / End 可切换。
 */
export function AkSkillLevels({
  value = 1,
  onValueChange,
  max = 'M3',
  disabled = false,
  masteryIcon,
  className,
  ariaLabel,
}: AkSkillLevelsProps) {
  const instanceId = useInstanceId('ak-skill-levels')
  const maxIndex = levelIndex(max)
  const levels = SKILL_LEVELS.slice(0, maxIndex >= 0 ? maxIndex + 1 : SKILL_LEVELS.length)

  function onKeydown(index: number, event: React.KeyboardEvent<HTMLButtonElement>) {
    const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (!offset && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const nextIndex =
      event.key === 'Home' ? 0 : event.key === 'End' ? levels.length - 1 : (index + offset + levels.length) % levels.length
    const next = levels[nextIndex]
    if (next === undefined) return
    onValueChange?.(next)
    window.requestAnimationFrame(() => document.getElementById(`${instanceId}-${String(next)}`)?.focus())
  }

  return (
    <div
      className={cx('ak-skill-levels', className)}
      data-slot="ak-skill-levels"
      role="group"
      aria-label={ariaLabel || '技能等级'}
    >
      {levels.map((level, index) => {
        const mastery = isMastery(level)
        return (
          <button
            key={String(level)}
            id={`${instanceId}-${String(level)}`}
            type="button"
            className={cx(mastery && 'is-mastery', value === level && 'is-active')}
            disabled={disabled}
            aria-pressed={value === level}
            onClick={() => onValueChange?.(level)}
            onKeyDown={(event) => onKeydown(index, event)}
          >
            {mastery && masteryIcon ? masteryIcon : String(level)}
          </button>
        )
      })}
    </div>
  )
}

// ── 属性面板 ──────────────────────────────────────────────────────────

export interface AkAttrsProps extends DivProps {
  /** 压成「标签 | 值」两端对齐的一行行，而不是竖排大数字。 */
  compact?: boolean
}

/** 属性面板：等宽网格，格与格之间 1px 线。 */
export function AkAttrs({ compact = false, className, children, ...rest }: AkAttrsProps) {
  return (
    <div
      {...rest}
      className={cx('ak-attrs', compact && 'ak-attrs--compact', className)}
      data-slot="ak-attrs"
      data-variant={compact ? 'compact' : 'default'}
    >
      {children}
    </div>
  )
}

export interface AkAttrProps extends Omit<DivProps, 'children'> {
  /** 属性名（大写拉丁标签）。 */
  label: ReactNode
  /** 中文名，排在英文标签后面，不做大写转换。 */
  labelCn?: ReactNode
  /** 属性值。 */
  value?: ReactNode
  /** 值后面的小字单位 / 附注。 */
  hint?: ReactNode
  /** 顶部 2px 强调条（如已选中的属性）。 */
  accent?: boolean
  /** 自定义值内容，覆盖 `value` / `hint`。 */
  children?: ReactNode
}

/** 属性面板中的一格。 */
export function AkAttr({ label, labelCn, value, hint, accent = false, className, children, ...rest }: AkAttrProps) {
  return (
    <div {...rest} className={cx('ak-attr', accent && 'ak-attr--accent', className)} data-slot="ak-attr">
      <span className="ak-attr__label">
        {label}
        {labelCn ? <span className="cn">{labelCn}</span> : null}
      </span>
      {children ?? (
        <span className="ak-attr__value">
          {value}
          {hint ? <small>{hint}</small> : null}
        </span>
      )}
    </div>
  )
}

// ── 键值表 ────────────────────────────────────────────────────────────

export type AkKvVariant = 'default' | 'boxed' | 'inline'

const KvVariantContext = createContext<AkKvVariant>('default')

export interface AkKvProps extends HTMLAttributes<HTMLElement> {
  /** 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 */
  as?: ElementType
  /** 版式：default / boxed / inline。 */
  variant?: AkKvVariant
}

/**
 * 键值表（信息栏）。
 * `inline` 变体下每项包一层 `div`，因为内联版是 flex 换行布局。
 */
export function AkKv({ as: Tag = 'dl', variant = 'default', className, children, ...rest }: AkKvProps) {
  return (
    <KvVariantContext.Provider value={variant}>
      <Tag
        {...rest}
        className={cx('ak-kv', variantClass('ak-kv', variant), className)}
        data-slot="ak-kv"
        data-variant={variant}
      >
        {children}
      </Tag>
    </KvVariantContext.Provider>
  )
}

export interface AkKvItemProps {
  /** 键（标签列）。 */
  label: ReactNode
  /** 值。 */
  children?: ReactNode
}

/** 键值表的一行。在 `inline` 变体下会自动包一层 `div`。 */
export function AkKvItem({ label, children }: AkKvItemProps) {
  const variant = useContext(KvVariantContext)

  if (variant === 'inline') {
    return (
      <div data-slot="ak-kv-item">
        <dt>{label}</dt>
        <dd>{children}</dd>
      </div>
    )
  }

  return (
    <>
      <dt data-slot="ak-kv-item-key">{label}</dt>
      <dd data-slot="ak-kv-item-value">{children}</dd>
    </>
  )
}

// ── 信赖 ──────────────────────────────────────────────────────────────

export interface AkTrustProps extends SpanProps {
  /** 图标地址。经 CSS 变量喂给 `::before`，不传就不出图标、也不占位。 */
  iconSrc?: string
  /** 显示在图标后的文字，例如「信赖 200」。 */
  value?: ReactNode
}

/** 信赖标记。图标可选，没有素材时只显示文字。 */
export function AkTrust({ iconSrc, value, className, children, style, ...rest }: AkTrustProps) {
  return (
    <span
      {...rest}
      className={cx('ak-trust', className)}
      data-slot="ak-trust"
      style={
        iconSrc
          ? ({
              '--ak-trust-icon': `url("${iconSrc}")`,
              '--ak-trust-content': '""',
              ...style,
            } as CSSProperties)
          : style
      }
    >
      {children ?? value}
    </span>
  )
}
