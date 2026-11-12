import type {
  ElementType,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  TableHTMLAttributes,
} from 'react'
import { useState } from 'react'
import { cx } from '../../lib/utils'

/**
 * 方舟技能 / 天赋组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design —— packages/css/src/arknights/
 * （skill.css · skill-matrix.css · skill-sheet.css · sp.css · talent.css · talent-table.css）
 *
 * 与上游的差别只有一处：上游的富文本会解析游戏原始标记（`<@ba.vup>…</>`），
 * 这里不做解析——描述一律由调用方给 React 节点（见 `AkRichText`）。
 * 其余结构、类名与配色一律照搬上游，图标 / 图片全部由宿主传入。
 */

type DivProps = HTMLAttributes<HTMLDivElement>
type SpanProps = HTMLAttributes<HTMLSpanElement>

// ── SP 类型 / 触发方式 / 数值芯片 ──────────────────────────────────────

/** 技力回复方式：自动回复 · 攻击回复 · 受击回复 · 被动回复 · 被动。 */
export type AkSpType = 'auto' | 'attack' | 'hit' | 'passive-recovery' | 'passive'

/** 触发方式：手动触发 / 自动触发。 */
export type AkSpTriggerType = 'manual' | 'auto'

/** SP 数值芯片的种类：消耗 / 初始 / 持续。 */
export type AkSpValueKind = 'cost' | 'init' | 'duration'

const SP_TYPE_TEXT: Record<AkSpType, string> = {
  auto: '自动回复',
  attack: '攻击回复',
  hit: '受击回复',
  'passive-recovery': '被动回复',
  passive: '被动',
}

/** 游戏内的技力说明（悬停提示）；被动技能没有技力，不给。 */
const SP_TYPE_TIP: Record<AkSpType, string | undefined> = {
  auto: '每秒回复1点技力',
  attack: '每次攻击回复1点技力',
  hit: '每次受到攻击回复1点技力',
  'passive-recovery': '仅在特殊条件下回复技力',
  passive: undefined,
}

const TRIGGER_TEXT: Record<AkSpTriggerType, string> = {
  manual: '手动触发',
  auto: '自动触发',
}

const TRIGGER_TIP: Record<AkSpTriggerType, string> = {
  manual: '技力达到需求并满足开启条件后，需要玩家手动开启的技能',
  auto: '技力达到需求并满足开启条件后，自动开启的技能',
}

const SP_VALUE_CLASS: Record<AkSpValueKind, string> = {
  cost: 'ak-sp-cost',
  init: 'ak-sp-init',
  duration: 'ak-sp-dur',
}

/** 读屏用的名字（芯片的图形是 CSS mask，读不出来）。 */
const SP_VALUE_NAME: Record<AkSpValueKind, string> = {
  cost: '消耗',
  init: '初始',
  duration: '持续',
}

const SP_VALUE_TIP: Record<AkSpValueKind, string> = {
  cost: '消耗：该技能所需要消耗的技力数',
  init: '初始：干员部署后预置的技力数（每次部署仅一次）',
  duration: '持续：该技能的持续时间（秒）',
}

export interface AkSpProps extends Omit<SpanProps, 'children'> {
  /** 技力回复方式，决定底色与文字。 */
  spType?: AkSpType
  /** 悬停提示；默认是游戏内的说明，`false` 关掉。 */
  tip?: string | false
  /** 芯片里的字；默认是「自动回复」「攻击回复」… */
  children?: ReactNode
}

/** SP 类型标签（游戏内：绿=自动 · 橙=攻击 · 黄=受击 · 紫=被动回复 · 灰=被动）。 */
export function AkSp({ spType = 'auto', tip, className, children, ...rest }: AkSpProps) {
  const tipText = tip === false ? undefined : (tip ?? SP_TYPE_TIP[spType])
  return (
    <span
      {...rest}
      className={cx('ak-sp', spType !== 'auto' && `ak-sp--${spType}`, className)}
      data-slot="ak-sp"
      data-ak-tip={tipText}
      title={tipText}
    >
      {children ?? SP_TYPE_TEXT[spType]}
    </span>
  )
}

export interface AkSpTriggerProps extends Omit<SpanProps, 'children'> {
  /** 自动触发（灰底）；默认手动触发。 */
  auto?: boolean
  /** 悬停提示；默认是游戏内的说明，`false` 关掉。 */
  tip?: string | false
  /** 芯片里的字；默认「手动触发」/「自动触发」。 */
  children?: ReactNode
}

/** 触发方式标签（手动 / 自动）。 */
export function AkSpTrigger({ auto = false, tip, className, children, ...rest }: AkSpTriggerProps) {
  const mode: AkSpTriggerType = auto ? 'auto' : 'manual'
  const tipText = tip === false ? undefined : (tip ?? TRIGGER_TIP[mode])
  return (
    <span
      {...rest}
      className={cx('ak-sp-trigger', auto && 'ak-sp-trigger--auto', className)}
      data-slot="ak-sp-trigger"
      data-ak-tip={tipText}
      title={tipText}
    >
      {children ?? TRIGGER_TEXT[mode]}
    </span>
  )
}

export interface AkSpValueProps extends Omit<SpanProps, 'children'> {
  /** 哪一枚芯片：消耗 · 初始 · 持续。 */
  kind: AkSpValueKind
  /** 数值；不写时只出图形（表头图例写「消耗」「初始」这类字时用 `children`）。 */
  value?: number | string
  /** 悬停提示；默认是这一项的说明，`false` 关掉。 */
  tip?: string | false
  /** 芯片里的字（代替 `value`）；给了就不再补读屏用的名字。 */
  children?: ReactNode
}

/** SP 数值芯片（荧光绿闪电 / ▶ / ⏱）。 */
export function AkSpValue({ kind, value, tip, className, children, ...rest }: AkSpValueProps) {
  const tipText = tip === false ? undefined : (tip ?? SP_VALUE_TIP[kind])
  return (
    <span
      {...rest}
      className={cx(SP_VALUE_CLASS[kind], className)}
      data-slot="ak-sp-value"
      data-kind={kind}
      data-ak-tip={tipText}
      title={tipText}
    >
      {children ?? (
        <>
          <span className="ak-sr-only">{SP_VALUE_NAME[kind]}</span>
          {value}
        </>
      )}
    </span>
  )
}

// ── 技能卡 Skill ────────────────────────────────────────────────────────

/** 技能名后的别名：英文名（Bender 大写）+ 日文名。 */
export interface AkSkillAlias {
  /** 英文名。 */
  en?: string
  /** 日文名。 */
  ja?: string
}

export interface AkSkillProps extends Omit<DivProps, 'children'> {
  /** 技能名。 */
  name: string
  /** 别名，跟在技能名后的灰色小字。 */
  alias?: AkSkillAlias
  /** 技能图标（宿主自己的 `<img src=… />`）；不传只保留图标框。 */
  icon?: ReactNode
  /** 技力回复方式：决定图标描边、底条色与 SP 标签。 */
  spType?: AkSpType
  /** 触发方式；不写不显示（被动技能）。 */
  trigger?: AkSpTriggerType
  /** 技力消耗；不写不显示。 */
  cost?: number | string
  /** 初始技力；不写不显示。 */
  init?: number | string
  /** 持续时间：数字按秒写成「25s」，字符串原样（「—」）；不写不显示。 */
  duration?: number | string
  /** 开放条件（「技能2 · 精英一开放」），显示在右侧槽。 */
  unlock?: string
  /** 开放条件前的图标（宿主自己的 `<img src=… />`）。 */
  unlockIcon?: ReactNode
  /** 选中（蓝框 + 左上角标）。 */
  selected?: boolean
  /** 未解锁：图标灰化 + 锁。 */
  locked?: boolean
  /** 技能名的标题级别（正文里一般是 4）。 */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** 名称行末尾的附加内容（「未解锁」标签等）。 */
  headerExtra?: ReactNode
  /** 右侧槽（开放条件之后）：技能范围等；写了就是三栏的宽卡。 */
  aside?: ReactNode
  /** 技能描述。 */
  children?: ReactNode
}

/** 技能卡：图标 + 名称 + SP 类型 + 触发方式 + 数值 + 描述。 */
export function AkSkill({
  name,
  alias,
  icon,
  spType = 'auto',
  trigger,
  cost,
  init,
  duration,
  unlock,
  unlockIcon,
  selected = false,
  locked = false,
  headingLevel = 4,
  headerExtra,
  aside,
  className,
  children,
  ...rest
}: AkSkillProps) {
  const Heading = `h${headingLevel}` as ElementType
  const hasAlias = Boolean(alias?.en || alias?.ja)
  const wide = Boolean(unlock || aside)
  const hasStats = cost !== undefined || init !== undefined || duration !== undefined
  const durationText = typeof duration === 'number' ? `${duration}s` : duration

  return (
    <div
      {...rest}
      className={cx('ak-skill', wide && 'ak-skill--wide', selected && 'is-selected', className)}
      data-slot="ak-skill"
    >
      <div className={cx('ak-skill__icon', `ak-skill__icon--${spType}`, locked && 'is-locked')}>
        {icon}
      </div>
      <div>
        <div className="ak-skill__head">
          <Heading className="ak-skill__name">{name}</Heading>
          {hasAlias && (
            <span className="ak-skill__alias">
              {alias?.en && (
                <span className="ak-en" lang="en">
                  {alias.en}
                </span>
              )}
              {alias?.ja && <span lang="ja">{alias.ja}</span>}
            </span>
          )}
          <AkSp spType={spType} />
          {trigger && <AkSpTrigger auto={trigger === 'auto'} />}
          {headerExtra}
        </div>
        {hasStats && (
          <div className="ak-skill__stats">
            {cost !== undefined && (
              <span>
                <AkSpValue kind="cost" value={cost} />
              </span>
            )}
            {init !== undefined && (
              <span>
                <AkSpValue kind="init" value={init} />
              </span>
            )}
            {duration !== undefined && (
              <span>
                持续 <b>{durationText}</b>
              </span>
            )}
          </div>
        )}
      </div>
      {wide && (
        <div className="ak-skill__aside">
          {unlock && (
            <span className="ak-skill__open">
              {unlockIcon}
              {unlock}
            </span>
          )}
          {aside}
        </div>
      )}
      {children !== undefined && children !== null && <div className="ak-skill__desc">{children}</div>}
    </div>
  )
}

// ── 技能全等级表 Skill sheet ────────────────────────────────────────────

/** 一个技能等级（第 i 项 = 等级 i+1，第 8–10 项 = 专精 Ⅰ–Ⅲ）。 */
export interface AkSkillSheetLevel {
  /** 描述（宿主自己渲染的 React 节点）。 */
  description: ReactNode
  /** 初始技力。 */
  init?: number | string
  /** 技力消耗。 */
  cost?: number | string
  /** 持续时间（秒）；没有就空着（表里显示「—」）。 */
  duration?: number | string
}

export interface AkSkillSheetProps extends Omit<DivProps, 'children'> {
  /** 各级数据：1–7 级，之后是专精 Ⅰ–Ⅲ。 */
  levels: AkSkillSheetLevel[]
  /** 高亮一行（当前等级，1–10）。 */
  highlight?: number
  /** 专精 Ⅰ–Ⅲ 的图标地址（宿主自己的素材）；不给时写 M1–M3。 */
  masteryIcons?: readonly string[]
  /** 表格的可访问名（如「鞘击 · 各等级数据」）。 */
  label?: string
  /** 表头卡（一般是 `AkSkill`）。 */
  header?: ReactNode
  /** 表下的注释（「※不可对空」）。 */
  footer?: ReactNode
}

const MASTERY_NUMERALS = ['Ⅰ', 'Ⅱ', 'Ⅲ']

/** 等级写法：1–7 是数字，8–10 是专精 Ⅰ–Ⅲ。 */
function levelLabel(level: number, icons?: readonly string[]): ReactNode {
  if (level <= 7) return <>{level}</>
  const index = level - 8
  const icon = icons?.[index]
  if (icon) {
    return (
      <>
        <img src={icon} alt={`专精${index + 1}`} />
        <span aria-hidden="true">{MASTERY_NUMERALS[index]}</span>
      </>
    )
  }
  return (
    <>
      <span aria-hidden="true">M{index + 1}</span>
      <span className="ak-sr-only">专精{index + 1}</span>
    </>
  )
}

/** 技能全等级表：一张表看完 1–7 + 专精 Ⅰ–Ⅲ。 */
export function AkSkillSheet({
  levels,
  highlight,
  masteryIcons,
  label,
  header,
  footer,
  className,
  ...rest
}: AkSkillSheetProps) {
  return (
    <div {...rest} className={cx('ak-skill-sheet', className)} data-slot="ak-skill-sheet">
      {header}
      <table className="ak-skill-table" aria-label={label}>
        <thead>
          <tr>
            <th className="lv" scope="col">
              等级
            </th>
            <th className="desc" scope="col">
              描述
            </th>
            <th className="num" scope="col">
              <AkSpValue kind="init">初始</AkSpValue>
            </th>
            <th className="num" scope="col">
              <AkSpValue kind="cost">消耗</AkSpValue>
            </th>
            <th className="num" scope="col">
              <AkSpValue kind="duration">持续</AkSpValue>
            </th>
          </tr>
        </thead>
        <tbody>
          {levels.map((row, index) => {
            const level = index + 1
            const isMastery = level > 7
            return (
              <tr
                key={level}
                className={cx(isMastery && 'is-mastery', level === highlight && 'is-hl')}
                aria-current={level === highlight ? 'true' : undefined}
              >
                <td className="lv">{levelLabel(level, masteryIcons)}</td>
                <td className="desc">{row.description}</td>
                <td className="num">{row.init ?? ''}</td>
                <td className="num">{row.cost ?? ''}</td>
                <td className="num">{row.duration ?? ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {footer !== undefined && footer !== null && <div className="ak-skill-sheet__note">{footer}</div>}
    </div>
  )
}

// ── 技能参数矩阵 Skill matrix ──────────────────────────────────────────

/** 矩阵的一行：一个参数在各级的值。 */
export interface AkSkillMatrixRow {
  /** 描述模板里的占位符名（`{key}`）；写了这一行就对应描述里的一个变量位。 */
  key?: string
  /** 参数名（「伤害倍率」「晕眩（秒）」）。 */
  label: string
  /** 用 SP 芯片当参数名：初始 · 消耗 · 持续。 */
  sp?: AkSpValueKind
  /** 各级的值（「200%」）：第 i 项 = 等级 i+1，第 8–10 项 = 专精 Ⅰ–Ⅲ。 */
  values: (number | string)[]
}

/** 描述渲染函数拿到的上下文。 */
export interface AkSkillMatrixRenderContext {
  /** 当前预览 / 钉住的等级（1–10）；没有时 `undefined`。 */
  level?: number
  /** 取某一行的区间 / 当级取值。 */
  value: (key: string) => string
  /** 画一个变量位（`.ak-var`）：给 `key` 就能拿到此刻该显示的字。 */
  Var: (key: string) => ReactNode
}

export interface AkSkillMatrixProps extends Omit<DivProps, 'children'> {
  /** 参数行。 */
  rows: AkSkillMatrixRow[]
  /** 描述：给节点直接渲染，或给一个函数按当前列算出变量位。 */
  description?: ReactNode | ((ctx: AkSkillMatrixRenderContext) => ReactNode)
  /** 专精 Ⅰ–Ⅲ 的图标地址；不给时写 M1–M3。 */
  masteryIcons?: readonly string[]
  /** 表格的可访问名（如「鞘击 · 各等级参数」）。 */
  label?: string
  /** 钉住的等级（受控）；不写则内部自管。 */
  level?: number
  /** 钉住 / 取消钉住某一列。 */
  onLevelChange?: (level: number | undefined) => void
  /** 表头卡（一般是 `AkSkill`）。 */
  header?: ReactNode
  /** 表下的注释。 */
  footer?: ReactNode
}

/**
 * 技能参数矩阵：等级横着放、参数竖着放。
 * 悬停 / 键盘聚焦某一列 → 整列高亮、描述里的变量位换成该级的值；
 * 点一次把该列钉住，再点取消。
 */
export function AkSkillMatrix({
  rows,
  description,
  masteryIcons,
  label,
  level,
  onLevelChange,
  header,
  footer,
  className,
  ...rest
}: AkSkillMatrixProps) {
  const [hovered, setHovered] = useState<number | undefined>(undefined)
  const [pinned, setPinned] = useState<number | undefined>(undefined)
  const [focused, setFocused] = useState<number | undefined>(undefined)

  const active = level !== undefined ? level : pinned
  const shown = hovered ?? active
  const count = rows.reduce((max, row) => Math.max(max, row.values.length), 0)
  const levels = Array.from({ length: count }, (_, index) => index + 1)
  const tabStop = focused ?? active ?? 1

  function valueOf(key: string): string {
    const row = rows.find((item) => item.key?.toLowerCase() === key.toLowerCase())
    if (!row) return `{${key}}`
    if (shown) return String(row.values[shown - 1] ?? '')
    const first = String(row.values[0] ?? '')
    const last = String(row.values[row.values.length - 1] ?? '')
    return first === last ? first : `${first}→${last}`
  }

  function setActive(next: number | undefined) {
    if (level === undefined) setPinned(next)
    onLevelChange?.(next)
  }

  function columnOf(target: EventTarget | null): number | null {
    if (!(target instanceof Element)) return null
    const cell = target.closest('th, td')
    if (!(cell instanceof HTMLTableCellElement)) return null
    return cell.cellIndex > 0 && cell.cellIndex <= count ? cell.cellIndex : null
  }

  function onMove(event: MouseEvent<HTMLTableElement>) {
    const column = columnOf(event.target)
    if (column) setHovered(column)
  }

  function onClick(event: MouseEvent<HTMLTableElement>) {
    const column = columnOf(event.target)
    if (column) setActive(active === column ? undefined : column)
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, levelIndex: number) {
    const to =
      event.key === 'ArrowRight'
        ? (levelIndex % count) + 1
        : event.key === 'ArrowLeft'
          ? ((levelIndex - 2 + count) % count) + 1
          : event.key === 'Home'
            ? 1
            : event.key === 'End'
              ? count
              : undefined
    if (!to) return
    event.preventDefault()
    const row = event.currentTarget.closest('tr')
    const next = row?.cells[to]?.querySelector('button')
    if (next instanceof HTMLElement) next.focus()
  }

  function isUp(row: AkSkillMatrixRow, index: number): boolean {
    return index === 0 || String(row.values[index]) !== String(row.values[index - 1])
  }

  const Var = (key: string) => (
    <span className="ak-var" data-var={key}>
      {valueOf(key)}
    </span>
  )

  const renderedDescription =
    typeof description === 'function'
      ? description({ level: shown, value: valueOf, Var })
      : description

  return (
    <div {...rest} className={cx('ak-skill-sheet', className)} data-slot="ak-skill-matrix">
      {header}
      {renderedDescription !== undefined && renderedDescription !== null && (
        <div className="ak-skill-sheet__tpl">{renderedDescription}</div>
      )}
      <table
        className="ak-skill-matrix"
        aria-label={label}
        onMouseOver={onMove}
        onMouseLeave={() => setHovered(undefined)}
        onClick={onClick}
      >
        <colgroup>
          <col className="label" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">等级</th>
            {levels.map((lv) => (
              <th
                key={lv}
                scope="col"
                className={cx(
                  lv === 8 && 'm-start',
                  lv === shown && 'is-hl',
                  lv > 7 && 'is-mastery',
                )}
              >
                <button
                  type="button"
                  aria-pressed={active === lv}
                  tabIndex={lv === tabStop ? 0 : -1}
                  onFocus={() => {
                    setFocused(lv)
                    setHovered(lv)
                  }}
                  onBlur={() => {
                    setFocused(undefined)
                    setHovered(undefined)
                  }}
                  onKeyDown={(event) => onKeyDown(event, lv)}
                >
                  {levelLabel(lv, masteryIcons)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} data-var={row.key}>
              <th scope="row">
                {row.sp ? <AkSpValue kind={row.sp}>{row.label}</AkSpValue> : row.label}
              </th>
              {levels.map((lv) => (
                <td
                  key={lv}
                  className={cx(lv === 8 && 'm-start', lv === shown && 'is-hl', isUp(row, lv - 1) && 'is-up')}
                >
                  {row.values[lv - 1]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer !== undefined && footer !== null && <div className="ak-skill-sheet__note">{footer}</div>}
    </div>
  )
}

// ── 天赋 Talent ─────────────────────────────────────────────────────────

/** 一条解锁条件：图标 + 字。 */
export interface AkTalentRequirement {
  /** 图标（宿主自己的 `<img src=… />`）。 */
  icon?: ReactNode
  /** 「精英二 · 1级」「潜能5」。 */
  text: string
}

export interface AkTalentProps extends Omit<DivProps, 'children'> {
  /** 天赋名。 */
  name: string
  /** 解锁条件，跟在名字后面（小号标签字）。 */
  requirements?: AkTalentRequirement[]
  /** 描述。 */
  children?: ReactNode
}

/** 天赋卡：左侧色条 + 名称 + 解锁条件 + 描述。 */
export function AkTalent({ name, requirements = [], className, children, ...rest }: AkTalentProps) {
  return (
    <div {...rest} className={cx('ak-talent', className)} data-slot="ak-talent">
      <div className="ak-talent__name">
        {name}
        {requirements.map((requirement, index) => (
          <span key={index} className="ak-talent__req">
            {requirement.icon}
            {requirement.text}
          </span>
        ))}
      </div>
      {children !== undefined && children !== null && <div className="ak-talent__desc">{children}</div>}
    </div>
  )
}

// ── 算法标记 Calc ───────────────────────────────────────────────────────

/** 进公式的方式：直接加算 · 直接乘算 · 最终加算 · 最终乘算。 */
export type AkCalcKind = 'add' | 'mul' | 'fadd' | 'fmul'

const CALC_TEXT: Record<AkCalcKind, string> = {
  add: '直接加算',
  mul: '直接乘算',
  fadd: '最终加算',
  fmul: '最终乘算',
}

export interface AkCalcProps extends HTMLAttributes<HTMLElement> {
  /** 进公式的方式。 */
  kind: AkCalcKind
}

/** 算法标记：紧贴在数值前的小方块，只在 `AkTalentTable` 打开「算法」开关时显示。 */
export function AkCalc({ kind, className, ...rest }: AkCalcProps) {
  return (
    <i
      {...rest}
      className={cx('ak-calc', `ak-calc--${kind}`, className)}
      data-slot="ak-calc"
      role="img"
      aria-label={CALC_TEXT[kind]}
      title={CALC_TEXT[kind]}
    />
  )
}

// ── 天赋条件表 Talent table ─────────────────────────────────────────────

/** 天赋表的一行：一个条件下的效果。 */
export interface AkTalentRow {
  /** 天赋名；相邻几行同名时合并成一格。 */
  name: string
  /** 条件（「精英二 · Y模组 2级」）。 */
  condition?: ReactNode
  /** 描述。 */
  description: ReactNode
  /** 潜能加成后的描述；不写就没有潜能版。 */
  potential?: ReactNode
}

export interface AkTalentTableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  /** 第一列的列头（「第一天赋」「第二天赋」）。 */
  title: string
  /** 各条件下的效果。 */
  rows: AkTalentRow[]
  /** 潜能开关上写的潜能等级（「潜能5」）。 */
  potentialRank?: number
  /** 潜能开关上的潜能图标（宿主自己的 `<img src=… />`）。 */
  potentialIcon?: ReactNode
  /** 表头显示「算法」开关；打开后表尾有图例行。 */
  calcToggle?: boolean
  /** 潜能加成开关（受控）；不写则内部自管。 */
  potential?: boolean
  /** 潜能加成开关变化。 */
  onPotentialChange?: (value: boolean) => void
  /** 算法标记开关（受控）；不写则内部自管。 */
  calc?: boolean
  /** 算法标记开关变化。 */
  onCalcChange?: (value: boolean) => void
  /** 自己画条件格（放精英化图标等）。 */
  renderCondition?: (row: AkTalentRow, index: number) => ReactNode
  /** 自己画描述（要标 `AkCalc` 时用）。 */
  renderDescription?: (row: AkTalentRow, index: number, potential: boolean) => ReactNode
  /** 图例行末尾的附加内容。 */
  legend?: ReactNode
}

const CALC_LEGEND: { kind: AkCalcKind; text: string; note?: string }[] = [
  { kind: 'add', text: '直接加算' },
  { kind: 'mul', text: '直接乘算', note: '（直接乘算之间为加法计算）' },
  { kind: 'fadd', text: '最终加算' },
  { kind: 'fmul', text: '最终乘算' },
]

/** 天赋条件表：精英阶段 / 模组等级 × 描述 的对比表。 */
export function AkTalentTable({
  title,
  rows,
  potentialRank,
  potentialIcon,
  calcToggle = false,
  potential,
  onPotentialChange,
  calc,
  onCalcChange,
  renderCondition,
  renderDescription,
  legend,
  className,
  ...rest
}: AkTalentTableProps) {
  const [internalPotential, setInternalPotential] = useState(false)
  const [internalCalc, setInternalCalc] = useState(false)
  const showPotential = potential ?? internalPotential
  const showCalc = calc ?? internalCalc
  const hasPotential = rows.some((row) => row.potential !== undefined)

  // 同名相邻行合并：每组第一行记组长，其余记 0（不画名字格）
  const spans = rows.map((row, index) => {
    if (index > 0 && rows[index - 1].name === row.name) return 0
    let span = 1
    while (rows[index + span]?.name === row.name) span += 1
    return span
  })

  return (
    <table
      {...rest}
      className={cx('ak-talent-table', showPotential && 'is-pot', showCalc && 'is-calc', className)}
      data-slot="ak-talent-table"
    >
      <thead>
        <tr>
          <th className="name" scope="col">
            {title}
          </th>
          <th className="cond" scope="col">
            条件
          </th>
          <th className="desc" scope="col">
            描述
            {hasPotential && (
              <label className="ak-talent-table__toggle">
                <input
                  type="checkbox"
                  checked={showPotential}
                  onChange={(event) => {
                    const next = event.target.checked
                    if (potential === undefined) setInternalPotential(next)
                    onPotentialChange?.(next)
                  }}
                />
                {potentialIcon && <span className="ak-potential ak-potential--bare">{potentialIcon}</span>}
                潜能{potentialRank}
                <span className="ak-sr-only">加成</span>
              </label>
            )}
            {calcToggle && (
              <label className="ak-talent-table__toggle">
                <input
                  type="checkbox"
                  checked={showCalc}
                  onChange={(event) => {
                    const next = event.target.checked
                    if (calc === undefined) setInternalCalc(next)
                    onCalcChange?.(next)
                  }}
                />
                算法
              </label>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {spans[index] > 0 && (
              <td className="name" rowSpan={spans[index] > 1 ? spans[index] : undefined}>
                {row.name}
              </td>
            )}
            <td className="cond">{renderCondition ? renderCondition(row, index) : row.condition}</td>
            <td className="desc">
              {row.potential !== undefined ? (
                <>
                  <span className="ak-talent-table__base">
                    {renderDescription
                      ? renderDescription(row, index, false)
                      : row.description}
                  </span>
                  <span className="ak-talent-table__pot">
                    {renderDescription ? renderDescription(row, index, true) : row.potential}
                  </span>
                </>
              ) : renderDescription ? (
                renderDescription(row, index, false)
              ) : (
                row.description
              )}
            </td>
          </tr>
        ))}
      </tbody>
      {calcToggle && (
        <tfoot>
          <tr className="ak-talent-table__legend">
            <td colSpan={3}>
              {CALC_LEGEND.map((item) => (
                <span key={item.kind}>
                  <i className={cx('ak-calc', `ak-calc--${item.kind}`)} aria-hidden="true" />
                  {item.text}
                  {item.note && <small>{item.note}</small>}
                </span>
              ))}
              {legend}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  )
}
