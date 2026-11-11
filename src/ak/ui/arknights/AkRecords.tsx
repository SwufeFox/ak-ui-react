'use client'

import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../../lib/utils'
import { useInstanceId } from '../../lib/useId'

/**
 * 方舟档案 / 记录类组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design —— packages/css/src/arknights/
 * （module.css · rich-text.css · voice.css · dossier.css · archive.css · dialogue.css · item.css）
 *
 * 上游的富文本会解析游戏原始标记（`<@ba.vup>…</>`），这里**不解析**：
 * `AkRichText` 是一组呈现型节点（增益 / 减益 / 数值 / 小标题 …），
 * 调用方自己给节点，组件只负责上色与排版。
 * 语音不要求音频文件：给 `src` 或 `onPlay` 才有播放钮，否则是禁用态。
 * 涂黑块是带 `aria-label` 的 span，键盘与触屏都能揭示。
 */

type DivProps = HTMLAttributes<HTMLDivElement>
type SpanProps = HTMLAttributes<HTMLSpanElement>

// ── 富文本 Rich text ────────────────────────────────────────────────────

/** 富文本节点的语义色。 */
export type AkRichTextTone =
  | 'buff'
  | 'debuff'
  | 'reminder'
  | 'keyword'
  | 'important'
  | 'enemy'
  | 'gild'
  | 'level'
  | 'potential'
  | 'term'

/** 富文本节点：呈现型，不解析任何标记。 */
export type AkRichTextNode =
  | { type: 'text'; text: string }
  | { type: 'buff'; children?: ReactNode }
  | { type: 'debuff'; children?: ReactNode }
  | { type: 'reminder'; children?: ReactNode }
  | { type: 'keyword'; children?: ReactNode }
  | { type: 'important'; children?: ReactNode }
  | { type: 'enemy'; children?: ReactNode }
  | { type: 'gild'; children?: ReactNode }
  | { type: 'level'; children?: ReactNode }
  | { type: 'potential'; children?: ReactNode }
  | { type: 'term'; children?: ReactNode; tip?: string }
  | { type: 'value'; text: string; delta?: 'up' | 'down' }
  | { type: 'heading'; text: string; level?: 2 | 3 | 4 }

const TONE_CLASS: Record<AkRichTextTone, string> = {
  buff: 'ak-rt-vup',
  debuff: 'ak-rt-vdown',
  reminder: 'ak-rt-rem',
  keyword: 'ak-rt-kw',
  important: 'ak-rt-imp',
  enemy: 'ak-rt-enemy',
  gild: 'ak-rt-gild',
  level: 'ak-rt-level',
  potential: 'ak-rt-talpu',
  term: 'ak-rt-term',
}

export interface AkRichTextProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 节点列表（呈现型，不解析标记）。 */
  nodes?: AkRichTextNode[]
  /** 整块的语义色（上游的 `variant`）。 */
  tone?: AkRichTextTone
  /** 外层元素，默认 `span`。 */
  as?: ElementType
  /** 直接给的节点（不写 `nodes` 时用）。 */
  children?: ReactNode
}

function renderNode(node: AkRichTextNode, key: number): ReactNode {
  switch (node.type) {
    case 'text':
      return node.text
    case 'term':
      return (
        <span key={key} className="ak-rt-term" data-ak-tip={node.tip} title={node.tip}>
          {node.children}
        </span>
      )
    case 'value':
      return (
        <span key={key} className={cx(node.delta === 'up' && 'ak-delta-up', node.delta === 'down' && 'ak-delta-down')}>
          {node.text}
        </span>
      )
    case 'heading': {
      const Heading = `h${node.level ?? 3}` as ElementType
      return (
        <Heading key={key} className="ak-rt-heading">
          {node.text}
        </Heading>
      )
    }
    default:
      return (
        <span key={key} className={TONE_CLASS[node.type]}>
          {node.children}
        </span>
      )
  }
}

/** 游戏内富文本：增益 / 减益 / 数值 / 小标题 的呈现层。 */
export function AkRichText({ nodes, tone, as: Tag = 'span', className, children, ...rest }: AkRichTextProps) {
  return (
    <Tag
      {...rest}
      className={cx(tone && TONE_CLASS[tone], className)}
      data-slot="ak-rich-text"
      data-tone={tone}
    >
      {nodes ? nodes.map((node, index) => renderNode(node, index)) : children}
    </Tag>
  )
}

// ── 模组 Module ─────────────────────────────────────────────────────────

/** 模组型号色（游戏模组类型底色）。 */
export type AkModuleColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple'

export interface AkModuleProps extends Omit<DivProps, 'children'> {
  /** 模组名。 */
  name: string
  /** 模组图（宿主自己的 `<img src=… />`）；不传只留中性底框。 */
  src?: ReactNode
  /** 型号文字：SWO-X / Original … */
  typeName?: string
  /** 型号图标（宿主自己的 `<img src=… />`）。 */
  typeIcon?: ReactNode
  /** 型号色；不写 = 原型证章的灰。 */
  color?: AkModuleColor
  /** 「说明 ⓘ」的悬停解释。 */
  hint?: string
  /** 故事可折叠：默认定高 5 行可滚动 +「全文阅读」开关；`false` 时全文展开。 */
  collapsible?: boolean
  /** 模组解锁任务（纯文本，一条一行）。 */
  tasks?: string[]
  /** 名称之后的附加内容。 */
  headerExtra?: ReactNode
  /** 三阶段表的行（若干 `AkModuleStage`）。 */
  stages?: ReactNode
  /** 解锁任务里额外的节点（排在 `tasks` 之后）。 */
  tasksExtra?: ReactNode
  /** 解锁需求与材料表的行（若干 `AkModuleUnlock`）。 */
  unlock?: ReactNode
  /** 故事（基础信息）。 */
  children?: ReactNode
}

/** 模组卡：型号 + 名称 + 故事 + 三阶段表 + 解锁任务 + 解锁需求与材料。 */
export function AkModule({
  name,
  src,
  typeName,
  typeIcon,
  color,
  hint,
  collapsible = true,
  tasks,
  headerExtra,
  stages,
  tasksExtra,
  unlock,
  className,
  children,
  ...rest
}: AkModuleProps) {
  const id = useInstanceId('ak-module')
  const [open, setOpen] = useState(false)
  const expanded = !collapsible || open
  const hasTasks = Boolean(tasks?.length) || Boolean(tasksExtra)

  return (
    <div
      {...rest}
      className={cx('ak-module', className)}
      data-slot="ak-module"
      data-color={color}
    >
      <div className="ak-module__img">{src}</div>
      <div className={cx('ak-module__main', expanded && 'is-open')}>
        <div className="ak-module__head">
          {(typeName || typeIcon) && (
            <span className="ak-module__type">
              {typeIcon}
              {typeName}
            </span>
          )}
          <h4 className="ak-module__name">{name}</h4>
          {hint && (
            <span className="ak-module__hint" data-ak-tip={hint} title={hint} tabIndex={0}>
              说明 ⓘ
            </span>
          )}
          {headerExtra}
        </div>
        {children !== undefined && children !== null && (
          <div id={`${id}-story`} className="ak-module__story">
            {children}
          </div>
        )}
        {collapsible && children !== undefined && children !== null && (
          <label className="ak-module__more">
            <input
              type="checkbox"
              checked={open}
              aria-controls={`${id}-story`}
              onChange={(event) => setOpen(event.target.checked)}
            />
            <span className="off">全文阅读 »</span>
            <span className="on">收起全文 «</span>
          </label>
        )}
      </div>
      {(stages || hasTasks || unlock) && (
        <div className="ak-module__body">
          {stages && (
            <table className="ak-module__stages">
              <thead>
                <tr>
                  <th scope="col">阶段</th>
                  <th scope="col">属性</th>
                  <th scope="col">特性 / 天赋变化</th>
                </tr>
              </thead>
              <tbody>{stages}</tbody>
            </table>
          )}
          {hasTasks && (
            <div className="ak-module__tasks">
              <span className="ak-overline">模组解锁任务</span>
              <ul>
                {tasks?.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
                {tasksExtra}
              </ul>
            </div>
          )}
          {unlock && (
            <table className="ak-module__unlock">
              <thead>
                <tr>
                  <th scope="col">阶段</th>
                  <th scope="col">解锁需求</th>
                  <th scope="col">材料消耗</th>
                </tr>
              </thead>
              <tbody>{unlock}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export interface AkModuleStageProps extends HTMLAttributes<HTMLTableRowElement> {
  /** 阶段 1–3：「STAGE n」+ 三段条点亮 n 段。 */
  stage: 1 | 2 | 3
  /** 属性加成（按写的顺序排，数值绿字）。 */
  stats?: Record<string, string | number>
  /** 变化类别的反色小标：特性追加 / 天赋更新。 */
  kicker?: string
  /** 特性 / 天赋变化的描述。 */
  children?: ReactNode
}

/** 模组三阶段表的一行。 */
export function AkModuleStage({ stage, stats, kicker, className, children, ...rest }: AkModuleStageProps) {
  return (
    <tr {...rest} className={className} data-slot="ak-module-stage">
      <td className="lv">
        <span className="ak-module__lv">
          STAGE {stage}
          <i aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <b key={n} className={cx(n <= stage && 'on')} />
            ))}
          </i>
        </span>
      </td>
      <td className="stats">
        <span className="ak-module__stats">
          {stats &&
            Object.entries(stats).map(([label, value]) => (
              <span key={label}>
                {label} <span className="ak-rt-vup">{value}</span>
              </span>
            ))}
        </span>
      </td>
      <td>
        {kicker && <span className="ak-module__kicker">{kicker}</span>}
        {children}
      </td>
    </tr>
  )
}

export interface AkModuleUnlockProps extends HTMLAttributes<HTMLTableRowElement> {
  /** 阶段 1–3。 */
  stage: 1 | 2 | 3
  /** 解锁需求（信赖 / 精英阶段与等级 / 任务标签）。 */
  requirement?: ReactNode
  /** 材料消耗（一排 `AkItem`）。 */
  children?: ReactNode
}

/** 模组解锁表的一行。 */
export function AkModuleUnlock({ stage, requirement, className, children, ...rest }: AkModuleUnlockProps) {
  return (
    <tr {...rest} className={className} data-slot="ak-module-unlock">
      <td className="lv">
        <span className="ak-module__lv">
          STAGE {stage}
          <i aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <b key={n} className={cx(n <= stage && 'on')} />
            ))}
          </i>
        </span>
      </td>
      <td>
        <span className="ak-module__req">{requirement}</span>
      </td>
      <td>{children}</td>
    </tr>
  )
}

// ── 语音 Voice ──────────────────────────────────────────────────────────

/** 语种选项（音频差分，单选，带 CV 名）。 */
export interface AkVoiceLanguage {
  /** 语种键。 */
  value: string
  /** 语种名。 */
  label: string
  /** CV 名。 */
  cv?: string
}

/** 文本语言选项（台词的语言，多选）。 */
export interface AkVoiceText {
  /** 文本键。 */
  value: string
  /** 文本名。 */
  label: string
}

interface AkVoiceListContextValue {
  /** 当前语种。 */
  lang?: string
  /** 文本语言选项（给了就按多选的文本键取台词）。 */
  texts: AkVoiceText[]
  /** 选中的文本语言。 */
  shownTexts: string[]
}

const VoiceListContext = createContext<AkVoiceListContextValue>({ texts: [], shownTexts: [] })

export interface AkVoiceProps extends Omit<DivProps, 'children'> {
  /** 语音标题（任命助理 / 交谈1 …）。 */
  title: string
  /** 台词：一个串，或按文本键 / 语种键给的对象。 */
  text?: string | Record<string, string>
  /** 音频地址：一个串，或按语种键给的对象；不写时播放钮禁用。 */
  src?: string | Record<string, string>
  /** 播放回调；给了就由调用方管播放（`src` 只作可用性判断）。 */
  onPlay?: () => void
  /** 播放中（受控）；不写则内部自管（自己播 `src` 时有效）。 */
  playing?: boolean
  /** 游戏内解锁 / 显示条件。 */
  unlock?: string
  /** 语种键（写 `lang` 属性用）。 */
  lang?: string
  /** 下载地址：一个串，或按语种键给的对象；给了就在播放钮旁出一枚下载钮。 */
  download?: string | Record<string, string>
  /** 下载存成的文件名。 */
  downloadName?: string
  /** 台词（不写 `text` 时用）。 */
  children?: ReactNode
}

/** 一条语音：播放钮（+ 下载钮）+ 标题 + 解锁条件 + 台词。 */
export function AkVoice({
  title,
  text,
  src,
  onPlay,
  playing,
  unlock,
  lang,
  download,
  downloadName,
  className,
  children,
  ...rest
}: AkVoiceProps) {
  const list = useContext(VoiceListContext)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [internalPlaying, setInternalPlaying] = useState(false)
  const isPlaying = playing ?? internalPlaying
  const effectiveLang = lang ?? list.lang

  // 台词：列表给了文本切换条就按选中的文本键拼（同语种一种一行），
  // 否则按当前语种取；音频 / 下载地址一律按当前语种取。
  const textValue = useMemo(() => {
    if (text === undefined) return undefined
    if (typeof text === 'string') return text
    if (list.texts.length > 0) {
      return list.shownTexts
        .map((key) => text[key])
        .filter(Boolean)
        .join('\n')
    }
    return (effectiveLang !== undefined ? text[effectiveLang] : undefined) ?? Object.values(text)[0]
  }, [text, list.texts.length, list.shownTexts, effectiveLang])

  const srcValue =
    src === undefined || typeof src === 'string'
      ? src
      : ((effectiveLang !== undefined ? src[effectiveLang] : undefined) ?? Object.values(src)[0])

  const downloadValue =
    download === undefined || typeof download === 'string'
      ? download
      : ((effectiveLang !== undefined ? download[effectiveLang] : undefined) ?? Object.values(download)[0])

  const playable = Boolean(srcValue || onPlay)

  // 卸载时停掉还在播的音频（audioRef 在 mount 时还是 null，只能在 cleanup 里读）
  useEffect(
    () => () => {
      audioRef.current?.pause()
    },
    [],
  )

  function handlePlay() {
    if (onPlay) {
      onPlay()
      return
    }
    if (!srcValue) return
    if (!audioRef.current) {
      const audio = new Audio(srcValue)
      audio.addEventListener('ended', () => setInternalPlaying(false))
      audioRef.current = audio
    }
    if (audioRef.current.paused) {
      void audioRef.current.play()
      setInternalPlaying(true)
    } else {
      audioRef.current.pause()
      setInternalPlaying(false)
    }
  }

  return (
    <div
      {...rest}
      className={cx('ak-voice', className)}
      data-slot="ak-voice"
      data-playing={isPlaying ? 'true' : undefined}
    >
      <button
        type="button"
        className={cx('ak-voice__play', isPlaying && 'is-playing')}
        aria-label={`播放 ${title}`}
        aria-pressed={isPlaying}
        disabled={!playable}
        onClick={handlePlay}
      />
      {downloadValue && (
        <a
          className="ak-voice__download"
          href={downloadValue}
          download={downloadName ?? ''}
          aria-label={`下载 ${title}`}
          title={`下载 ${title}`}
        >
          <svg className="ak-voice__download-glyph" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M8 1v8m0 0 3.5-3.5M8 9 4.5 5.5M2 12v2h12v-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
        </a>
      )}
      <div>
        <div className="ak-voice__title">
          {title}
          {isPlaying && (
            <span className="ak-voice__wave" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          )}
        </div>
        <div className="ak-voice__body">
          {unlock && <div className="ak-voice__cond">{unlock}</div>}
          <div className="ak-voice__text" lang={effectiveLang}>
            {textValue ?? children}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface AkVoiceListProps extends Omit<DivProps, 'children'> {
  /** 语种选项；不给就没有语种切换条。 */
  languages?: AkVoiceLanguage[]
  /** 文本语言选项；不给就没有文本切换条。 */
  texts?: AkVoiceText[]
  /** 当前语种（受控）；不写则内部自管（默认第一个）。 */
  lang?: string
  /** 当前语种变化。 */
  onLangChange?: (value: string) => void
  /** 选中的文本语言（受控，多选、可为空）；不写则内部自管。 */
  shownTexts?: string[]
  /** 选中的文本语言变化。 */
  onShownTextsChange?: (value: string[]) => void
  /** 若干 `AkVoice`。 */
  children?: ReactNode
}

/** 语音列表：上面的语种 / 文本切换条 + 若干 `AkVoice`。 */
export function AkVoiceList({
  languages = [],
  texts = [],
  lang,
  onLangChange,
  shownTexts,
  onShownTextsChange,
  className,
  children,
  ...rest
}: AkVoiceListProps) {
  const id = useInstanceId('ak-voice-list')
  const [internalLang, setInternalLang] = useState<string | undefined>(languages[0]?.value)
  const [internalTexts, setInternalTexts] = useState<string[]>(texts[0] ? [texts[0].value] : [])

  const current = lang ?? internalLang ?? languages[0]?.value
  const shown = shownTexts ?? internalTexts

  const context = useMemo<AkVoiceListContextValue>(
    () => ({ lang: current, texts, shownTexts: shown }),
    [current, texts, shown],
  )

  function toggleText(value: string) {
    const on = !shown.includes(value)
    const next = texts.map((text) => text.value).filter((key) => (key === value ? on : shown.includes(key)))
    if (shownTexts === undefined) setInternalTexts(next)
    onShownTextsChange?.(next)
  }

  return (
    <VoiceListContext.Provider value={context}>
      <div {...rest} className={className} data-slot="ak-voice-list">
        {(texts.length > 0 || languages.length > 0) && (
          <div className="ak-voice-toolbar">
            {texts.length > 0 && (
              <div className="ak-voice-langs" role="group" aria-labelledby={`${id}-texts`}>
                <span id={`${id}-texts`} className="ak-overline">
                  文本
                </span>
                <div className="ak-voice-langs__opts">
                  {texts.map((text) => (
                    <button
                      key={text.value}
                      type="button"
                      className={cx('ak-voice-chip', shown.includes(text.value) && 'is-active')}
                      aria-pressed={shown.includes(text.value)}
                      onClick={() => toggleText(text.value)}
                    >
                      {text.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div className="ak-voice-langs" role="group" aria-labelledby={`${id}-langs`}>
                <span id={`${id}-langs`} className="ak-overline">
                  语种
                </span>
                <div className="ak-voice-langs__opts">
                  {languages.map((language) => (
                    <button
                      key={language.value}
                      type="button"
                      className={cx('ak-voice-chip', language.value === current && 'is-active')}
                      aria-pressed={language.value === current}
                      onClick={() => {
                        if (lang === undefined) setInternalLang(language.value)
                        onLangChange?.(language.value)
                      }}
                    >
                      {language.label}
                      {language.cv && <small>{language.cv}</small>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="ak-voice-list">{children}</div>
      </div>
    </VoiceListContext.Provider>
  )
}

// ── 档案 Dossier ────────────────────────────────────────────────────────

export interface AkDossierProps extends Omit<DivProps, 'children'> {
  /** 标题（客观履历）。 */
  title: string
  /** 英文小标（Objective Record）。 */
  en?: string
  /** 解锁条件；`locked` 时也是遮罩上的文字。 */
  unlock?: string
  /** 未解锁：正文模糊、不可选，盖斜纹 + 解锁条件（文本仍在 DOM 里，可被搜索）。 */
  locked?: boolean
  /** 正文（若干 `<p>`）。 */
  children?: ReactNode
}

/** 档案条目：标题行 + 正文。 */
export function AkDossier({ title, en, unlock, locked = false, className, children, ...rest }: AkDossierProps) {
  return (
    <div
      {...rest}
      className={cx('ak-dossier', locked && 'is-locked', className)}
      data-slot="ak-dossier"
      data-unlock={locked ? unlock : undefined}
    >
      <div className="ak-dossier__title">
        {title}
        {en && <span className="ak-en">{en}</span>}
        {unlock && <span className="ak-dossier__unlock">{unlock}</span>}
      </div>
      {children}
    </div>
  )
}

export interface AkRedactedProps extends Omit<SpanProps, 'children'> {
  /** 常显（受控）；不写则内部自管（点按 / Enter / Space 切换）。 */
  revealed?: boolean
  /** 常显状态变化。 */
  onRevealedChange?: (value: boolean) => void
  /** 遮住的内容的说明（读屏念这句）；默认「已隐藏内容」。 */
  label?: string
  /** 被涂黑的文字。 */
  children?: ReactNode
}

/**
 * 涂黑文本（剧透 / 不予公开）。
 * 悬停、聚焦、点按都能揭示；遮住时是带 `aria-label` 的 span。
 */
export function AkRedacted({
  revealed,
  onRevealedChange,
  label = '已隐藏内容',
  className,
  children,
  ...rest
}: AkRedactedProps) {
  const [internal, setInternal] = useState(false)
  const isRevealed = revealed ?? internal

  function toggle() {
    const next = !isRevealed
    if (revealed === undefined) setInternal(next)
    onRevealedChange?.(next)
  }

  return (
    <span
      {...rest}
      className={cx('ak-redacted', isRevealed && 'is-revealed', className)}
      data-slot="ak-redacted"
      role="button"
      tabIndex={0}
      aria-pressed={isRevealed}
      aria-label={isRevealed ? undefined : label}
      title={isRevealed ? undefined : label}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }
      }}
    >
      {children}
    </span>
  )
}

// ── 档案类卡片 Archive ──────────────────────────────────────────────────

export interface AkArchiveProps extends Omit<DivProps, 'children'> {
  /** 标题。 */
  title: string
  /** 标题前的小标（密录 1 / 悖论模拟）。 */
  kicker?: string
  /** 解锁条件（纯文本或节点）。 */
  unlock?: ReactNode
  /** 解锁条件前的小标；传空串不出。 */
  unlockLabel?: string
  /** 页脚（`AkArchivePlay`、关卡、首通奖励 …）。 */
  footer?: ReactNode
  /** 正文（若干 `<p>`）。 */
  children?: ReactNode
}

/** 档案类卡片（干员密录 / 悖论模拟 / 未获得时的情报资料）。 */
export function AkArchive({
  title,
  kicker,
  unlock,
  unlockLabel = '解锁条件',
  footer,
  className,
  children,
  ...rest
}: AkArchiveProps) {
  return (
    <div {...rest} className={cx('ak-archive', className)} data-slot="ak-archive">
      <div className="ak-archive__head">
        {kicker && <span className="ak-archive__kicker">{kicker}</span>}
        <h4 className="ak-archive__title">{title}</h4>
        {unlock !== undefined && unlock !== null && unlock !== '' && (
          <span className="ak-archive__req">
            {unlockLabel && <span className="ak-overline">{unlockLabel}</span>}
            {unlock}
          </span>
        )}
      </div>
      <div className="ak-archive__body">{children}</div>
      {footer !== undefined && footer !== null && <div className="ak-archive__foot">{footer}</div>}
    </div>
  )
}

export interface AkArchivePlayProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 链接地址；不写就渲染成按钮。 */
  href?: string
  /** 点击回调（渲染成按钮时用）。 */
  onClick?: () => void
  /** 文字（阅读密录 · 一鼓作气）。 */
  children?: ReactNode
}

/** 档案卡页脚的「阅读 / 播放」块：黑底 + 播放三角 + 文字。 */
export function AkArchivePlay({ href, onClick, className, children, ...rest }: AkArchivePlayProps) {
  const inner = (
    <>
      <span className="ak-voice__play" aria-hidden="true" />
      {children}
    </>
  )

  if (href) {
    return (
      <a {...rest} href={href} className={cx('ak-archive__play', className)} data-slot="ak-archive-play">
        {inner}
      </a>
    )
  }

  return (
    <button
      {...rest}
      type="button"
      onClick={onClick}
      className={cx('ak-archive__play', className)}
      data-slot="ak-archive-play"
    >
      {inner}
    </button>
  )
}

// ── 剧情对话 Dialogue ───────────────────────────────────────────────────

export interface AkDialogueProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'> {
  /** 若干 `AkDialogueLine`。 */
  children?: ReactNode
}

/** 剧情对话：一个 `<dl>`，说话人一列右对齐、台词一列。 */
export function AkDialogue({ className, children, ...rest }: AkDialogueProps) {
  return (
    <dl {...rest} className={cx('ak-dialogue', className)} data-slot="ak-dialogue">
      {children}
    </dl>
  )
}

export interface AkDialogueLineProps {
  /** 说话人；不写就是旁白：说话人列写「旁白」，整句灰色斜体。 */
  speaker?: ReactNode
  /** 台词。 */
  children?: ReactNode
}

/** 剧情对话的一句：输出 `<dt>`（说话人）+ `<dd>`（台词）。 */
export function AkDialogueLine({ speaker, children }: AkDialogueLineProps) {
  const narrator = speaker === undefined || speaker === null
  return (
    <>
      <dt className={cx(narrator && 'narrator')}>{narrator ? '旁白' : speaker}</dt>
      <dd className={cx(narrator && 'narrator')}>{children}</dd>
    </>
  )
}

// ── 道具列表 Item list ──────────────────────────────────────────────────

export interface AkItemListProps extends Omit<DivProps, 'children'> {
  /** 里面道具的默认尺寸档（宿主自己的道具组件按这个走）。 */
  size?: 'sm' | 'md' | 'lg'
  /** 若干道具。 */
  children?: ReactNode
}

/**
 * 一排道具。
 *
 * ⚠️ 库里的 `AkItem`（`src/ak/ui/item/AkItem.tsx`）是**材料方块**版本，
 * 与上游的「游戏道具图标」不是一回事：上游那套底框 / 角标 / 稀有度底纹
 * 需要游戏素材，本库不移植。这里只提供列表容器，不动既有 `AkItem`。
 */
export function AkItemList({ size = 'md', className, children, ...rest }: AkItemListProps) {
  return (
    <div
      {...rest}
      className={cx('ak-item-list', className)}
      data-slot="ak-item-list"
      data-ak-size={size}
    >
      {children}
    </div>
  )
}