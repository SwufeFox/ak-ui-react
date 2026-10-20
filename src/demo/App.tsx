import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  AkAssetLoader,
  AkAvatar,
  AkAvatarGroup,
  AkBreadcrumb,
  AkScrollArea,
  AkTable,
  AkThumbnail,
  AkAttr,
  AkAttrs,
  AkBackdrop,
  AkBilingual,
  AkBlueBand,
  AkBrackets,
  AkButton,
  AkButtonGroup,
  AkChoice,
  AkDivider,
  AkField,
  AkFieldLabel,
  AkFormStack,
  AkInput,
  AkPagination,
  AkPopover,
  AkDropdownMenu, AkContextMenu, AkMenubar, AkToolbar, AkCollapsible,
  AkSelect,
  AkStatusGroup,
  AkTagGroup,
  AkTextarea,
  AkCard,
  AkCardContent,
  AkCardDescription,
  AkCardFooter,
  AkCardHeader,
  AkCardTitle,
  AkChevrons,
  AkCodeId,
  AkCommand,
  AkCommandGrid,
  AkCommandGroup,
  AkCorner,
  AkCountUp,
  AkCut,
  AkCounter,
  AkSanContainer,
  AkLoadingScreen,
  AkNewsList,
  AkNoticeStack,
  AkProgressStack,
  AkDialog,
  AkLevel,
  AkSkeleton,
  AkSpinner,
  AkDepth,
  AkDepthLayer,
  AkDisplay,
  AkElite,
  AkEn,
  AkGauge,
  AkGlyphBox,
  AkGrain,
  AkGridBackdrop,
  AkHalftone,
  AkInputNumber,
  AkInverse,
  AkMosaic,
  AkKv,
  AkKvItem,
  AkMediaGallery,
  AkMediaAlbum,
  AkMobileMenu,
  AkGlow,
  AkOutline,
  AkSkew,
  AkNotice,
  AkNum,
  AkOverline,
  AkParticleField,
  AkPot,
  AkPotList,
  AkPotential,
  AkProfession,
  AkProfessionLabel,
  AkProgress,
  AkRarity,
  AkRarityBar,
  AkRarityChip,
  AkSectionNavigator,
  AkSegmented,
  AkSkillLevels,
  AkSlider,
  AkSpec,
  AkStatus,
  AkStripes,
  AkTabs,
  AkTag,
  AkTrust,
  AkVignette,
  AkWatermark,
} from '../ak'
import type { AkSkillLevel, GalleryItem } from '../ak'
import { galleryItems } from './gallery-art'
import { useI18n, type MessageKey } from './i18n'
import { operators, POTENTIAL_STEPS, PROFESSION_KEYS, type Operator, type RosterFilter } from './operators'
import './demo.css'

type View = 'console' | 'reference'
type Theme = 'terminal' | 'archive'

/**
 * 组件目录的分类清单。顺序即编号顺序（01…17），也是「上一组 / 下一组」的遍历顺序。
 * id 与各 `Block` 的锚点一一对应，深链接 `#components-N` 仍然可用。
 */
const CATEGORIES = [
  { id: 'components-1', title: 'ref.actions.title' },
  { id: 'components-2', title: 'ref.menu.title' },
  { id: 'components-3', title: 'ref.surfaces.title' },
  { id: 'components-4', title: 'ref.feedback.title' },
  { id: 'components-5', title: 'ref.inputs.title' },
  { id: 'components-6', title: 'ref.navigation.title' },
  { id: 'components-7', title: 'ref.effects.title' },
  { id: 'components-8', title: 'ref.gallery.title' },
  { id: 'components-9', title: 'ref.site.title' },
  { id: 'components-10', title: 'ref.shell.title' },
  { id: 'components-11', title: 'ref.decor.title' },
  { id: 'components-12', title: 'ref.arknights.title' },
  { id: 'components-13', title: 'ref.controls.title' },
  { id: 'components-14', title: 'ref.form.title' },
  { id: 'components-15', title: 'ref.data.title' },
  { id: 'components-16', title: 'ref.collection.title' },
  { id: 'components-17', title: 'ref.command.title' },
] as const satisfies readonly { id: string; title: MessageKey }[]

/**
 * 舞台上下文：当前激活的分类 id + 切换函数。
 *
 * 用 context 而不是把 `active` 逐层透传，是因为 17 个 `Block` 是平铺在 JSX 里的
 * （有的还包了闭包变量），透传会改动每一个调用点。context 让调用点保持原样。
 */
const StageContext = createContext<{ active: string; select: (id: string) => void } | null>(null)

/**
 * `selectedCommand` 是全局共用的一份状态，菜单、工具栏、指令面板都会写它。
 * 只有下面这几个值在字典里有 `ref.menu.*` 键，回显时据此过滤。
 */
const MENU_ACTIONS = new Set(['inspect', 'deploy', 'cancel', 'archive', 'file', 'edit', 'view'])

/**
 * 参考视图的分类面板。
 *
 * 关键行为：**只有激活的那一块真正渲染**（互斥面板，对应方舟「原位替换而非窗口堆叠」），
 * 其余 16 块完全不进 DOM —— 这正是「浅而广」里那个「广」字的落点：
 * 单屏信息密度靠分类栏承载，而不是靠把 17 个区块摞成一万五千像素的长页。
 */
function Block({ id, eyebrow, title, note, children }: { id: string; eyebrow: string; title: string; note?: ReactNode; children: ReactNode }) {
  const stage = useContext(StageContext)
  if (stage && stage.active !== id) return null

  /*
    编号只认一个真相来源：`CATEGORIES` 里的顺序（也就是左侧分类栏显示的那个）。
    字典里的 eyebrow 还带着早期顺序的硬编码编号（06 之后直接跳 12），
    两套编号同屏打架会让「13 / 表单」和「14 表单控件」互相矛盾。
    这里把字典里的旧编号剥掉，改用 CATEGORIES 的顺序重新生成，漂移从此不可能发生。
  */
  const index = CATEGORIES.findIndex((category) => category.id === id)
  const displayEyebrow =
    index === -1 ? eyebrow : `${String(index + 1).padStart(2, '0')} / ${eyebrow.replace(/^\s*\d+\s*\/\s*/, '')}`

  return (
    <section id={id} className="demo-block" aria-labelledby={`${id}-title`}>
      <span className="demo-eyebrow">{displayEyebrow}</span>
      <h2 id={`${id}-title`}>{title}</h2>
      {note ? <p className="demo-note">{note}</p> : null}
      {children}
    </section>
  )
}

/** A quiet console surface; decorative treatments belong to individual content, not every panel. */
function Panel({ className, children }: { className: string; children: ReactNode }) {
  return <section className={`demo-panel ${className}`}>{children}</section>
}

/** 时间戳固定用 24 小时制，避免 12 小时制下的 AM/PM 混进界面文案。 */
function stamp(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

// ── 控制台视图 ────────────────────────────────────────────────────────

interface LogEntry {
  id: number
  time: string
  kind: 'deploy' | 'recall'
  operatorId: string
}

function ConsoleView() {
  const { locale, t } = useI18n()
  const [filter, setFilter] = useState<RosterFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(operators[0]?.id ?? null)
  const [deployed, setDeployed] = useState<string[]>([])
  const [log, setLog] = useState<LogEntry[]>([])
  const [skillLevel, setSkillLevel] = useState<AkSkillLevel>(operators[0]?.skillLevel ?? 1)

  const selected = operators.find((op) => op.id === selectedId) ?? null

  const roster = filter === 'all' ? operators : operators.filter((op) => op.profession === filter)

  // 换干员时把技能等级同步到该干员自己的档位（否则会带着上一人的 M3 过去）。
  useEffect(() => {
    setSkillLevel(selected?.skillLevel ?? 1)
  }, [selected?.id, selected?.skillLevel])

  const funds = useMemo(
    () => operators.reduce((total, op) => (deployed.includes(op.id) ? total - op.cost : total), 1280),
    [deployed],
  )

  function nameOf(op: Operator): string {
    return locale === 'zh-CN' ? t(op.nameCn) : t(op.nameEn)
  }

  function appendLog(kind: LogEntry['kind'], operatorId: string) {
    setLog((entries) => [...entries, { id: entries.length + 1, time: stamp(), kind, operatorId }])
  }

  function deploy(op: Operator) {
    if (deployed.includes(op.id)) return
    setDeployed((ids) => [...ids, op.id])
    appendLog('deploy', op.id)
  }

  function recall(op: Operator) {
    if (!deployed.includes(op.id)) return
    setDeployed((ids) => ids.filter((id) => id !== op.id))
    appendLog('recall', op.id)
  }

  return (
    <div className="demo-console">
      <header className="demo-console__head">
        <span className="demo-eyebrow">{t('console.eyebrow')}</span>
        <AkDisplay as="h2">{t('console.title')}</AkDisplay>
        <p className="demo-note">{t('console.note')}</p>
      </header>

        <div className="demo-console__summary" role="group" aria-label={t('console.summary.label')}>
        <div className="demo-summary__item">
          <AkOverline>{locale === 'zh-CN' ? '扇区 / SECTOR' : 'SECTOR / 扇区'}</AkOverline>
          <strong>{t('console.rail.sectorValue')}</strong>
        </div>
        <div className="demo-summary__item">
          <AkOverline>{locale === 'zh-CN' ? '行动 / OPERATION' : 'OPERATION / 行动'}</AkOverline>
          <strong>{t('console.rail.operationValue')}</strong>
        </div>
        <div className="demo-summary__item">
          <AkOverline>{locale === 'zh-CN' ? '部署 / DEPLOYED' : 'DEPLOYED / 部署'}</AkOverline>
          <strong><AkNum>{deployed.length}</AkNum> / <AkNum>{operators.length}</AkNum></strong>
        </div>
        <div className="demo-summary__item">
          <AkOverline>{locale === 'zh-CN' ? '调度点 / COST' : 'COST / 调度点'}</AkOverline>
          <strong><AkNum>{funds}</AkNum></strong>
        </div>
        <AkStatus label={t('console.status.online')} detail={t('console.status.detail')} />
      </div>

      <div className="demo-console__body">
        <Panel className="demo-console__roster">
          <div className="demo-roster__head">
            <AkOverline>{t('console.roster.title')}</AkOverline>
            <AkSegmented
              ariaLabel={t('console.roster.filter')}
              options={[
                { label: t('console.roster.all'), value: 'all' },
                { label: t('console.roster.medic'), value: 'medic' },
                { label: t('console.roster.caster'), value: 'caster' },
              ]}
              value={filter}
              onValueChange={(next) => setFilter(next === 'medic' || next === 'caster' ? next : 'all')}
            />
            <span className="demo-roster__count">{t('console.roster.count', { n: roster.length })}</span>
          </div>

          {roster.length === 0 ? (
            <p className="demo-empty ak-text">{t('console.roster.empty')}</p>
          ) : (
            <ul className="demo-roster">
              {roster.map((op) => {
                const isSelected = op.id === selectedId
                return (
                  <li key={op.id}>
                    <AkRarityBar level={op.rarity} className={isSelected ? 'demo-roster__row is-selected' : 'demo-roster__row'}>
                      {/* `as="button"` 让整条名单成为一个可聚焦的选块；不在表单里，默认 submit 无副作用 */}
                      <AkCard
                        as="button"
                        className="demo-roster__card"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(op.id)}
                      >
                        <span className="demo-roster__line">
                          <AkRarity level={op.rarity} aria-label={t('common.rarityAria', { n: op.rarity })} />
                          <AkCodeId>{op.code}</AkCodeId>
                        </span>
                        <AkBilingual cn={t(op.nameCn)} en={t(op.nameEn)} row />
                        <span className="demo-roster__meta">
                          <AkProfession name={op.profession} icon={<b>{op.glyph}</b>} outline size="sm" />
                          <AkEn>{t(PROFESSION_KEYS[op.profession])}</AkEn>
                          <AkNum>{op.cost}</AkNum>
                        </span>
                        <span className="demo-roster__tags">
                          {op.tags.map((tag) => (
                            <AkTag key={tag} variant="neutral">
                              {t(tag)}
                            </AkTag>
                          ))}
                        </span>
                      </AkCard>
                    </AkRarityBar>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        {/* 右：详情 */}
        <Panel className="demo-console__detail">
          <AkOverline>{t('console.detail.title')}</AkOverline>
          {selected ? (
            <div className="demo-detail">
              <div className="demo-detail__id">
                <AkBilingual cn={t(selected.nameCn)} en={t(selected.nameEn)} />
                <AkRarity level={selected.rarity} aria-label={t('common.rarityAria', { n: selected.rarity })} />
              </div>

              <div className="demo-detail__meta">
                <AkProfession name={selected.profession} icon={<b>{selected.glyph}</b>} boxed />
                <AkTag variant="advanced">{t(PROFESSION_KEYS[selected.profession])}</AkTag>
                <AkElite
                  level={selected.elite}
                  icon={<b>{`E${selected.elite}`}</b>}
                  title={t('console.detail.eliteTitle', { n: selected.elite })}
                />
                <AkTrust value={t('console.detail.trustValue', { n: selected.trust })} />
              </div>

              <AkKv variant="inline">
                <AkKvItem label={t('console.detail.classLabel')}>{t(PROFESSION_KEYS[selected.profession])}</AkKvItem>
                <AkKvItem label={t('console.detail.rarityLabel')}>
                  <AkNum>{selected.rarity}</AkNum>
                </AkKvItem>
                <AkKvItem label={t('console.detail.cost')}>
                  <AkNum>{selected.cost}</AkNum>
                </AkKvItem>
              </AkKv>

              <div className="demo-section">
                <AkOverline>{t('console.detail.attrs')}</AkOverline>
                <AkAttrs>
                  <AkAttr label={t('common.atk')} labelCn={t('common.attack')} value={<AkNum>{selected.stats.atk}</AkNum>} accent />
                  <AkAttr label={t('common.def')} labelCn={t('common.defense')} value={<AkNum>{selected.stats.def}</AkNum>} />
                  <AkAttr label={t('common.rst')} labelCn={t('common.resist')} value={<AkNum>{selected.stats.res}</AkNum>} />
                </AkAttrs>
              </div>

              <div className="demo-section">
                <AkOverline>{t('console.detail.skills')}</AkOverline>
                {selected.skills.map((skill) => (
                  <div className="demo-skill" key={skill.name}>
                    <span className="demo-skill__name">{t(skill.name)}</span>
                    <span className="demo-skill__desc">{t(skill.desc)}</span>
                  </div>
                ))}
                <AkSkillLevels
                  value={skillLevel}
                  onValueChange={setSkillLevel}
                  max="M3"
                  ariaLabel={t('common.skillLevelAria')}
                />
              </div>

              <AkCollapsible title={t('console.detail.potential')}>
                <AkPotList>
                  {POTENTIAL_STEPS.map((step) => (
                    <AkPot
                      key={step.label}
                      index={<b>{t('common.potentialShort')}{step.n}</b>}
                      label={t(step.label)}
                      active={step.active}
                    >
                      {t(step.body)}
                    </AkPot>
                  ))}
                </AkPotList>
              </AkCollapsible>

              <div className="demo-detail__actions">
                <AkButton variant="action" disabled={deployed.includes(selected.id)} onClick={() => deploy(selected)}>
                  {t('console.action.deploy')}
                </AkButton>
                <AkButton variant="outline" disabled={!deployed.includes(selected.id)} onClick={() => recall(selected)}>
                  {t('console.action.recall')}
                </AkButton>
              </div>
            </div>
          ) : (
            <p className="demo-empty ak-text">{t('console.detail.select')}</p>
          )}
        </Panel>
      </div>

      <AkCollapsible title={t('console.log.title')} className="demo-console__log">
        <Panel className="demo-log__surface">
          <div className="demo-log__head">
            <span className="demo-log__count">{t('console.log.count', { n: log.length })}</span>
            <AkButton variant="outline" disabled={log.length === 0} onClick={() => setLog([])}>
              {t('console.log.clear')}
            </AkButton>
          </div>

          {log.length === 0 ? (
            <p className="demo-empty ak-text">{t('console.log.empty')}</p>
          ) : (
            <ol className="demo-log__list">
              {log.map((entry, index) => {
                const op = operators.find((item) => item.id === entry.operatorId)
                return (
                  <li className="demo-log__row" key={entry.id}>
                    <AkNum className="demo-log__index">{String(index + 1).padStart(2, '0')}</AkNum>
                    <AkNum className="demo-log__time">{entry.time}</AkNum>
                    <AkTag variant={entry.kind === 'deploy' ? 'advanced' : 'neutral'}>
                      {t(entry.kind === 'deploy' ? 'console.action.deployed' : 'console.action.recalled')}
                    </AkTag>
                    <span className="demo-log__text">
                      {t(entry.kind === 'deploy' ? 'console.log.entry.deploy' : 'console.log.entry.recall', {
                        name: op ? nameOf(op) : entry.operatorId,
                      })}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </Panel>
      </AkCollapsible>
    </div>
  )
}

// ── 参考视图（原来的 11 个区块）───────────────────────────────────────

const shellSectionSpec = [
  { id: 'shell-command', label: 'ref.shell.command', title: 'ref.shell.commandTitle', body: 'ref.shell.commandBody' },
  { id: 'shell-archive', label: 'ref.shell.archive', title: 'ref.shell.archiveTitle', body: 'ref.shell.archiveBody' },
  { id: 'shell-relay', label: 'ref.shell.relay', title: 'ref.shell.relayTitle', body: 'ref.shell.relayBody' },
] as const satisfies readonly { id: string; label: MessageKey; title: MessageKey; body: MessageKey }[]

/** Demonstrates the real contract: a viewport wrapping uniquely identified sections. */
function SiteShellDemo() {
  const { t } = useI18n()
  const sections = shellSectionSpec.map((section) => ({
    id: section.id,
    label: t(section.label),
    title: t(section.title),
    body: t(section.body),
  }))
  const [current, setCurrent] = useState<string>(sections[0]?.id ?? '')

  return (
    <div className="demo-shell">
      <AkSectionNavigator syncHash={false} onChange={(id) => setCurrent(id)}>
        <header className="ak-site__header">
          <span className="ak-site__eyebrow">{t('ref.shell.headerEyebrow')}</span>
          <nav className="ak-site__nav" aria-label={t('ref.shell.sections')}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                data-ak-section-link
                aria-current={current === section.id ? 'location' : undefined}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </header>
        <div className="ak-site__viewport" data-ak-section-viewport>
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="ak-site__section" data-ak-section>
              <div data-ak-section-content>
                <span className="ak-site__eyebrow">{t('ref.shell.sectionLabel', { label: section.label })}</span>
                <h2>{section.title}</h2>
                <p className="ak-text">{section.body}</p>
                <div className="demo-row">
                  <AkTag variant="advanced">{t('ref.shell.sectionTag', { n: index + 1, m: sections.length })}</AkTag>
                </div>
              </div>
            </section>
          ))}
        </div>
      </AkSectionNavigator>
    </div>
  )
}

const tabSpec = [
  {
    value: 'overview',
    label: 'ref.navigation.overview',
    title: 'ref.navigation.overview',
    description: 'ref.navigation.overviewDesc',
  },
  { value: 'skills', label: 'ref.navigation.skills', title: 'ref.navigation.skills', description: 'ref.navigation.skillsDesc' },
  { value: 'archive', label: 'ref.navigation.archive', title: 'ref.navigation.archive', description: 'ref.navigation.archiveDesc' },
] as const satisfies readonly { value: string; label: MessageKey; title: MessageKey; description: MessageKey }[]

function ReferenceView() {
  const { t } = useI18n()
  const [tab, setTab] = useState('overview')
  const [segment, setSegment] = useState('all')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [slider, setSlider] = useState(42)
  const [count, setCount] = useState(1280)
  const [menuOpen, setMenuOpen] = useState(false)
  const [skillLevel, setSkillLevel] = useState<AkSkillLevel>(3)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState('deploy')
  // 理智计数器：加号按钮真的能加，上限用满后不再涨（避免演示看起来像假的）
  const [loadingReady, setLoadingReady] = useState(false)
  const [sanCurrent, setSanCurrent] = useState(41)
  const sanLimit = 135
  const [sanTotal] = useState(135)

  /**
   * 当前激活的分类。初始值从 hash 推导，所以 `#components-14` 这样的深链接可以直接落到对应面板。
   * 注意这里读的是**初始值**，不是每次 hash 变化都跟随 —— 面板切换本身会写 hash，
   * 若再反向同步会形成回环。
   */
  const [active, setActive] = useState<string>(() => {
    if (typeof window === 'undefined') return CATEGORIES[0].id
    const hash = window.location.hash.replace(/^#/, '')
    return CATEGORIES.some((c) => c.id === hash) ? hash : CATEGORIES[0].id
  })
  const activeIndex = Math.max(0, CATEGORIES.findIndex((c) => c.id === active))
  const stageRef = useRef<HTMLDivElement>(null)
  const stageValue = useMemo(() => ({ active, select: setActive }), [active])

  /** 切换分类：写 hash（可分享）并把舞台滚回顶部（原位替换而不是继承上一块的滚动位置）。 */
  const selectCategory = useCallback((id: string) => {
    setActive(id)
    const url = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(null, '', url)
    // 面板顶部对齐：区块标题不该被吸顶栏压住，靠 .demo-stage 的 scroll-margin 兜住
    stageRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }, [])

  const step = useCallback(
    (delta: number) => {
      const next = CATEGORIES[activeIndex + delta]
      if (next) selectCategory(next.id)
    },
    [activeIndex, selectCategory],
  )

  /** 浏览器前进/后退或者直接改 hash 时跟随。（只处理落在已知分类上的 hash。） */
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (CATEGORIES.some((c) => c.id === hash)) setActive(hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const segmentOptions = [
    { label: t('common.all'), value: 'all' },
    { label: t('ref.inputs.ground'), value: 'ground' },
    { label: t('ref.inputs.air'), value: 'air' },
  ]
  const items: GalleryItem[] = galleryItems(t)
  // 相册演示复用画廊素材；显式取两项并守卫（noUncheckedIndexedAccess 下 items[0] 是可能 undefined 的）
  const [albumFront, albumBack] = items

  return (
    <main className="demo-main">
      <header className="demo-reference__intro">
        <span className="demo-eyebrow">{t('ref.catalogue.eyebrow')}</span>
        <h1>{t('ref.catalogue.title')}</h1>
        <p className="demo-note">{t('ref.catalogue.note')}</p>
      </header>

      <div className="demo-catalogue">
        <nav className="demo-rail" aria-label={t('ref.catalogue.rail')}>
          {CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              type="button"
              className="demo-rail__item"
              aria-current={active === category.id ? 'true' : undefined}
              onClick={() => selectCategory(category.id)}
            >
              <span className="demo-rail__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="demo-rail__label">{t(category.title)}</span>
            </button>
          ))}
        </nav>

        <div className="demo-stage" ref={stageRef}>
          <StageContext.Provider value={stageValue}>
      <Block id="components-1" eyebrow={t('ref.actions.eyebrow')} title={t('ref.actions.title')} note={t('ref.actions.note')}>
        <div className="demo-row">
          <AkButton>{t('common.default')}</AkButton>
          <AkButton variant="outline">{t('common.outline')}</AkButton>
          <AkButton variant="action">{t('common.action')}</AkButton>
          <AkButton variant="advanced">{t('common.advanced')}</AkButton>
          <AkButton variant="light">{t('common.light')}</AkButton>
          <AkTag>{t('common.tag')}</AkTag>
          <AkTag variant="advanced">{t('common.advanced')}</AkTag>
          <AkTag variant="danger">{t('common.danger')}</AkTag>
          <AkTag variant="neutral">{t('common.neutral')}</AkTag>
        </div>
        <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
          <AkButton variant="action" icon={<span aria-hidden="true">◆</span>}>
            {t('common.withIcon')}
          </AkButton>
          <AkButton variant="outline" block style={{ maxWidth: '16rem' }}>
            {t('common.block')}
          </AkButton>
          <AkButton disabled>{t('common.disabled')}</AkButton>
        </div>
      </Block>

      <Block id="components-2" eyebrow="12 / MENU" title={t('ref.menu.title')} note={t('ref.menu.note')}>
        <div className="demo-stack">
          <div className="demo-row">
            <AkDropdownMenu label={t('ref.menu.open')} items={[
              { label: t('ref.menu.inspect'), onSelect: () => setSelectedCommand('inspect') },
              { label: t('ref.menu.deploy'), onSelect: () => setSelectedCommand('deploy') },
              { label: t('ref.menu.disabled'), disabled: true },
              { label: t('ref.menu.cancel'), destructive: true, onSelect: () => setSelectedCommand('cancel') },
            ]} />
            {/* 读一条“最近操作”，否则点菜单什么也不会发生，演示等于死的。
                selectedCommand 也被别的区块复用（slot-1 / operation …），
                那些值在字典里没有对应键，直接拼接会渲染成 undefined，所以只在白名单内回显。 */}
            {MENU_ACTIONS.has(selectedCommand) ? (
              <span className="demo-note">
                {t('ref.menu.lastAction')}: {t(`ref.menu.${selectedCommand}` as MessageKey)}
              </span>
            ) : null}
          </div>
          {/* menubar：一条 roving tab stop + 方向键/Home/End 移动焦点（组件已实现） */}
          <AkMenubar aria-label={t('ref.menu.scope')}>
            {(['file', 'edit', 'view'] as const).map((item) => (
              <button key={item} type="button" role="menuitem" onClick={() => setSelectedCommand(item)}>
                {t(`ref.menu.${item}`)}
              </button>
            ))}
          </AkMenubar>
          {/* toolbar：工具条内的按钮也是 roving tab stop，但保留普通按钮语义 */}
          <AkToolbar label={t('ref.menu.scope')}>
            <AkButton variant="outline" onClick={() => setCount((value) => value + 1)}>{t('ref.menu.bold')}</AkButton>
            <AkButton variant="outline" onClick={() => setSelectedCommand('archive')}>{t('ref.menu.archive')}</AkButton>
            <span className="demo-note">{t('ref.menu.toolbarCount', { n: count })}</span>
          </AkToolbar>
          <AkContextMenu items={[{ label: t('ref.menu.inspect'), onSelect: () => setSelectedCommand('inspect') }, { label: t('ref.menu.archive'), onSelect: () => setSelectedCommand('archive') }]}>
            <div className="demo-menu-target">
              <span>{t('ref.menu.context')}</span>
              <em>{t('ref.menu.contextHint')}</em>
            </div>
          </AkContextMenu>
          <AkCollapsible title={t('ref.menu.disclosure')}>
            <p>{t('ref.menu.body')}</p>
          </AkCollapsible>
        </div>
      </Block>

      <Block id="components-3" eyebrow={t('ref.surfaces.eyebrow')} title={t('ref.surfaces.title')} note={t('ref.surfaces.note')}>
        <div className="demo-grid">
          <AkCard as="article">
            <AkCardHeader>
              <AkCardTitle>{t('card.default.title')}</AkCardTitle>
              <AkCardDescription>{t('card.default.desc')}</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">{t('card.default.body')}</AkCardContent>
            <AkCardFooter>
              <AkButton variant="outline">{t('common.inspect')}</AkButton>
            </AkCardFooter>
          </AkCard>
          <AkCard as="article" variant="outline">
            <AkCardHeader>
              <AkCardTitle>{t('card.outline.title')}</AkCardTitle>
              <AkCardDescription>{t('card.outline.desc')}</AkCardDescription>
            </AkCardHeader>
            {/* 这是给开发者看的 API 字面量，不是界面文案，所以不进字典。 */}
            <AkCardContent className="ak-text">variant=&quot;outline&quot;</AkCardContent>
          </AkCard>
          <AkCard as="article" variant="stripe">
            <AkCardHeader>
              <AkCardTitle>{t('card.stripe.title')}</AkCardTitle>
              <AkCardDescription>{t('card.stripe.desc')}</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">variant=&quot;stripe&quot;</AkCardContent>
          </AkCard>
        </div>
      </Block>

      <Block id="components-4" eyebrow={t('ref.feedback.eyebrow')} title={t('ref.feedback.title')} note={t('ref.feedback.note')}>
        <div className="demo-stack">
          <AkNotice title={t('notice.info.title')} code={t('notice.code.info')}>
            {t('notice.info.body')}
          </AkNotice>
          <AkNotice variant="warning" title={t('notice.warn.title')} code={t('notice.code.warn')}>
            {t('notice.warn.body')}
          </AkNotice>
          <AkNotice variant="danger" title={t('notice.crit.title')} code={t('notice.code.crit')}>
            {t('notice.crit.body')}
          </AkNotice>
          <AkNotice variant="success" title={t('notice.ok.title')} code={t('notice.code.ok')}>
            {t('notice.ok.body')}
          </AkNotice>
        </div>
        <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
          <AkStatus label={t('ref.feedback.status.network')} detail={t('ref.feedback.status.networkValue')} />
          <AkStatus label={t('ref.feedback.status.reactor')} detail={t('ref.feedback.status.reactorValue')} variant="warning" />
          <AkStatus label={t('ref.feedback.status.hull')} detail={t('ref.feedback.status.hullValue')} variant="critical" />
          <AkStatus label={t('ref.feedback.status.relay')} detail={t('ref.feedback.status.relayValue')} variant="offline" />
        </div>
        <div className="demo-stack" style={{ marginTop: 'var(--ak-space-4)' }}>
          <AkProgress label={t('ref.feedback.progress.deploy')} value={72} />
          <AkProgress
            label={t('ref.feedback.progress.integrity')}
            value={18}
            variant="danger"
            valueLabel={t('ref.feedback.progress.critical')}
          />
        </div>
        <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
          <AkGauge label={t('common.deploy')} value={64} unit={t('common.percent')} />
          <AkGauge label={t('common.heat')} value={88} unit={t('common.percent')} variant="warning" />
        </div>

        {/* 两个 stack 只是布局壳；这里用它们把上面两类东西各自成组，顺便证明能混装 */}
        <div style={{ marginTop: 'var(--ak-space-4)' }}>
          <span className="demo-eyebrow">{t('ref.feedback.stack')}</span>
          <AkNoticeStack style={{ marginTop: 'var(--ak-space-3, 0.75rem)' }}>
            <AkNotice title={t('notice.info.title')} code={t('notice.code.info')}>
              {t('notice.info.body')}
            </AkNotice>
            <AkNotice variant="danger" title={t('notice.crit.title')} code={t('notice.code.crit')}>
              {t('notice.crit.body')}
            </AkNotice>
          </AkNoticeStack>
          <AkProgressStack style={{ marginTop: 'var(--ak-space-4)' }}>
            <AkProgress label={t('ref.feedback.progress.deploy')} value={72} />
            <AkProgress
              label={t('ref.feedback.progress.integrity')}
              value={18}
              variant="danger"
              valueLabel={t('ref.feedback.progress.critical')}
            />
          </AkProgressStack>
        </div>
      </Block>

      <Block id="components-5" eyebrow={t('ref.inputs.eyebrow')} title={t('ref.inputs.title')} note={t('ref.inputs.note')}>
        <div className="demo-stack">
          <AkSlider label={t('ref.inputs.volume')} value={slider} onValueChange={(v) => setSlider(Number.isFinite(v) ? v : 0)} />
          <span className="ak-text">{t('ref.inputs.sliderValue', { n: slider })}</span>
          <AkInputNumber
            value={slider}
            max={100}
            label={t('common.numberField')}
            increaseLabel={t('common.increase')}
            decreaseLabel={t('common.decrease')}
            maxLabel={t('common.maxLabel')}
            minLabel={t('common.minLabel')}
            onValueChange={setSlider}
          />
          <AkSegmented
            ariaLabel={t('console.roster.filter')}
            options={segmentOptions}
            value={segment}
            onValueChange={(v) => setSegment(v ?? 'all')}
          />
          <span className="ak-text">
            {t('ref.inputs.selected', { value: segmentOptions.find((option) => option.value === segment)?.label ?? segment })}
          </span>
        </div>
      </Block>

      <Block id="components-6" eyebrow={t('ref.navigation.eyebrow')} title={t('ref.navigation.title')} note={t('ref.navigation.note')}>
        <AkTabs
          ariaLabel={t('ref.navigation.aria')}
          items={tabSpec.map((item, index) => ({
            value: item.value,
            label: t(item.label),
            eyebrow: t('ref.navigation.eyebrowText', { n: String(index + 1).padStart(3, '0') }),
            title: t(item.title),
            description: t(item.description),
          }))}
          value={tab}
          onValueChange={(v) => setTab(v ?? 'overview')}
          renderPanel={(item) => <p className="ak-text">{t('ref.navigation.panelBody', { value: String(item.title) })}</p>}
        />
      </Block>

      <Block id="components-7" eyebrow={t('ref.effects.eyebrow')} title={t('ref.effects.title')} note={t('ref.effects.note')}>
        <div className="demo-stack">
          <div className="demo-row">
            <span style={{ fontSize: '2rem' }}>
              <AkCountUp value={count} duration={900} />
            </span>
            <AkButton variant="outline" onClick={() => setCount((c) => c + 256)}>
              +256
            </AkButton>
            <AkButton variant="outline" onClick={() => setCount(0)}>
              {t('common.reset')}
            </AkButton>
          </div>
          <div className="demo-canvas">
            <AkParticleField count={70} pattern="orbit" renderer="auto" />
            <span className="demo-canvas-label">{t('ref.effects.canvas')}</span>
          </div>

          {/* 景深：指针驱动的视差。把指针移进这块面板，三层会按各自 depth 反向位移。 */}
          <div>
            <AkCodeId>AkDepth</AkCodeId>
            <AkDepth
              className="demo-depth"
              variant="stage"
              threeD
              style={{ marginTop: 'var(--ak-space-2, 0.5rem)' }}
            >
              <AkDepthLayer className="demo-depth__grid" depth={0.4} />
              <AkDepthLayer className="demo-depth__glyph" depth={1}>
                <AkDisplay xl>PRTS</AkDisplay>
              </AkDepthLayer>
              <AkDepthLayer className="demo-depth__hud" depth={2}>
                <AkBrackets style={{ width: '4rem', height: '3rem' }} />
              </AkDepthLayer>
            </AkDepth>
            <div className="demo-hint">{t('ref.effects.depthHint')}</div>
          </div>
        </div>
      </Block>

      <Block id="components-8" eyebrow={t('ref.gallery.eyebrow')} title={t('ref.gallery.title')} note={t('ref.gallery.note')}>
        <AkMediaGallery
          items={items}
          value={galleryIndex}
          onValueChange={setGalleryIndex}
          label={t('media.gallery')}
          previousLabel={t('media.previous')}
          nextLabel={t('media.next')}
          expandLabel={t('media.expand')}
          closeLabel={t('media.close')}
          emptyLabel={t('media.empty')}
          roleDescription={t('media.carousel')}
        />
        <p className="demo-note" style={{ marginTop: 'var(--ak-space-4)', marginBottom: 0 }}>
          {t('ref.gallery.activeIndex', { n: galleryIndex })}
        </p>

        {/*
          拍立得相册：同一份素材，左边旧版（底片是伪元素画的纯色块）、
          右边新版（layered + splitEnter，两片各走独立动画时间线）。
          两侧并排是为了让人一眼看出「底片能不能换图」这个区别。
        */}
        <div style={{ marginTop: 'var(--ak-space-5, 1.5rem)' }}>
          <AkOverline>{t('ref.album.title')}</AkOverline>
          {/* 显式守卫而不是 `?? ''`：空 src 会让浏览器去请求页面自身 */}
          {albumFront?.image ? (
            <div className="demo-row" style={{ marginTop: 'var(--ak-space-3, 0.75rem)', alignItems: 'flex-start' }}>
              <figure style={{ margin: 0 }}>
                <AkMediaAlbum src={albumFront.image} alt={albumFront.alt} style={{ width: '11rem' }} />
                <figcaption className="demo-note">{t('ref.album.legacy')}</figcaption>
              </figure>
              <figure style={{ margin: 0 }}>
                <AkMediaAlbum
                  src={albumFront.image}
                  alt={albumFront.alt}
                  backSrc={albumBack?.image}
                  layered
                  splitEnter
                  style={{ width: '11rem' }}
                />
                <figcaption className="demo-note">{t('ref.album.layered')}</figcaption>
              </figure>
            </div>
          ) : null}
        </div>
      </Block>

      <Block id="components-9" eyebrow={t('ref.site.eyebrow')} title={t('ref.site.title')} note={t('ref.site.note')}>
        <div className="demo-stack">
          <AkAssetLoader
            label={t('common.resources')}
            retryLabel={t('common.retry')}
            statusLabels={{
              idle: t('common.status.idle'),
              loading: t('common.status.loading'),
              ready: t('common.status.ready'),
              error: t('common.status.error'),
              cancelled: t('common.status.cancelled'),
            }}
            tasks={[
              () => new Promise((resolve) => setTimeout(resolve, 400)),
              () => new Promise((resolve) => setTimeout(resolve, 900)),
              () => new Promise((resolve) => setTimeout(resolve, 1500)),
            ]}
          />
          <div>
            <AkButton variant="outline" onClick={() => setMenuOpen(true)}>
              {t('ref.site.openMenu')}
            </AkButton>
            {menuOpen ? <span className="ak-text"> {t('ref.site.menuHint')}</span> : null}
          </div>
          <div>
            <AkMobileMenu label={t('common.menu')} closeLabel={t('common.close')}>
              <a className="ak-nav__link" href="#shell-command">
                {t('ref.shell.command')}
              </a>
              <a className="ak-nav__link" href="#shell-archive">
                {t('ref.shell.archive')}
              </a>
              <a className="ak-nav__link" href="#shell-relay">
                {t('ref.shell.relay')}
              </a>
            </AkMobileMenu>
          </div>
        </div>
      </Block>

      <Block id="components-10" eyebrow={t('ref.shell.eyebrow')} title={t('ref.shell.title')} note={t('ref.shell.note')}>
        <SiteShellDemo />
      </Block>

      <Block id="components-11" eyebrow={t('ref.decor.eyebrow')} title={t('ref.decor.title')} note={t('ref.decor.note')}>
        <div className="demo-stack">
          <div className="demo-row">
            <AkStripes bar variant="warning" style={{ width: '8rem' }} />
            <AkStripes bar variant="danger" style={{ width: '8rem' }} />
            <AkStripes bar variant="hazard" style={{ width: '8rem' }} />
          </div>
          <AkStripes variant="strong" style={{ height: '2.5rem' }} />
          <div className="demo-row">
            <AkGridBackdrop
              variant="grid"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />
            <AkGridBackdrop
              variant="dots"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />
            <AkGridBackdrop
              variant="diag"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />
            <AkGridBackdrop
              variant="scanlines"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />
          </div>
          <div className="demo-row">
            <AkCorner
              position="tr"
              tone="yellow"
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)' }}
            />
            <AkCorner
              position="tl"
              tone="red"
              large
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)' }}
            />
            <AkBrackets style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)' }} />
            <AkHalftone variant="full" style={{ padding: 'var(--ak-space-3)' }}>
              <AkGlyphBox style={{ padding: '0.25rem' }}>G</AkGlyphBox>
            </AkHalftone>
          </div>
          <div className="demo-row" style={{ alignItems: 'flex-end' }}>
            {/* AkCut: clip-path 会裁掉自己的阴影，所以投影放外层 */}
            <div style={{ boxShadow: 'var(--ak-shadow-panel)' }}>
              <AkCut
                size="sm"
                style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}
              >
                <AkCodeId>LM04</AkCodeId>
              </AkCut>
            </div>
            <AkCut style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}>
              --md
            </AkCut>
            <AkCut
              size="lg"
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}
            >
              --lg
            </AkCut>
            <AkCut
              corner="all"
              size="lg"
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}
            >
              all
            </AkCut>
          </div>
          <div className="demo-row" style={{ alignItems: 'center' }}>
            <AkBlueBand>{t('common.blueBand')}</AkBlueBand>
            <AkInverse style={{ padding: '0.375rem 0.75rem' }}>{t('common.inverse')}</AkInverse>
            {/* 指向真实存在的锚点（shellSectionSpec 里定义的 id），不留死链接 */}
            <AkChevrons href="#shell-archive">{t('common.proceed')}</AkChevrons>
          </div>
          <div style={{ position: 'relative', paddingBottom: 'var(--ak-space-4)' }}>
            <AkDisplay xl>{t('app.name')}</AkDisplay>
            <AkWatermark>{t('ref.decor.watermark')}</AkWatermark>
          </div>
          {/* 上游特效层：这三样才是 ak-ui 的动效语言（都是 CSS animation infinite） */}
          <div className="demo-fx-row">
            <AkGlow>
              <AkButton variant="outline">{t('common.glow')}</AkButton>
            </AkGlow>
            <AkGlow tone="action">
              <AkButton variant="action">{t('common.glowAction')}</AkButton>
            </AkGlow>
            <AkOutline color="var(--ak-signal-info)">
              <AkButton variant="outline">{t('common.outlineRing')}</AkButton>
            </AkOutline>
            <AkSkew direction="left" style={{ display: 'inline-block' }}>
              <AkInverse style={{ padding: '0.375rem 0.75rem' }}>{t('common.skewLeft')}</AkInverse>
            </AkSkew>
            <AkSkew direction="right" style={{ display: 'inline-block' }}>
              <AkInverse style={{ padding: '0.375rem 0.75rem' }}>{t('common.skewRight')}</AkInverse>
            </AkSkew>
          </div>

          {/* 焦距与底图处理（文章原则二/三/五）—— 上游 SCSS 零实现，本库增补 */}
          <div className="demo-surface-row">
            <AkVignette className="demo-surface">
              <AkCodeId>AkVignette</AkCodeId>
              <p>{t('ref.decor.vignetteHint')}</p>
            </AkVignette>

            <AkGrain className="demo-surface">
              <AkCodeId>AkGrain</AkCodeId>
              <p>{t('ref.decor.grainHint')}</p>
            </AkGrain>

            <div className="demo-surface demo-surface--stack">
              <AkCodeId>AkMosaic</AkCodeId>
              <div className="demo-mosaic-host">
                <AkMosaic style={{ position: 'absolute', inset: 0 }} />
                <span>SECURE /// 04</span>
              </div>
              <p>{t('ref.decor.mosaicHint')}</p>
            </div>

            <div className="demo-surface demo-surface--stack">
              <AkCodeId>AkBackdrop</AkCodeId>
              <div className="demo-backdrop-host">
                <span className="demo-backdrop-under">{t('ref.decor.backdropUnder')}</span>
                <AkBackdrop className="demo-backdrop-over" strength="light">
                  <span>{t('ref.decor.backdropOver')}</span>
                </AkBackdrop>
              </div>
            </div>
          </div>

          <div className="demo-row" style={{ alignItems: 'baseline' }}>
            <AkOverline>{t('common.overline')}</AkOverline>
            <AkNum>1,234,567.89</AkNum>
            <AkEn>{t('common.latin')}</AkEn>
            <AkBilingual cn={t('ref.decor.arknightsCn')} en={t('ref.decor.arknightsEn')} />
            <AkBilingual cn={t('ref.decor.terminalCn')} en={t('ref.decor.terminalEn')} row />
          </div>
        </div>
      </Block>

      <Block id="components-12" eyebrow={t('ref.arknights.eyebrow')} title={t('ref.arknights.title')} note={t('ref.arknights.note')}>
        <div className="demo-stack">
          <div className="demo-row" style={{ alignItems: 'center' }}>
            <AkRarity level={6} aria-label={t('common.rarityAria', { n: 6 })} />
            <AkRarity level={5} size="lg" aria-label={t('common.rarityAria', { n: 5 })} />
            <AkRarity level={2} variant="white" aria-label={t('common.rarityAria', { n: 2 })} />
            <AkRarity level={3} size="sm" aria-label={t('common.rarityAria', { n: 3 })} />
            <AkRarityChip level={6}>R6</AkRarityChip>
            <AkRarityBar level={4} style={{ padding: 'var(--ak-space-2)', backgroundColor: 'var(--ak-surface-sunken)' }}>
              <span className="ak-r-text">R4 {t('common.rail')}</span>
            </AkRarityBar>
          </div>

          <div className="demo-row" style={{ alignItems: 'center' }}>
            <AkProfession name="medic" boxed size="lg" icon={<span aria-hidden="true">+</span>} />
            <AkProfession name="caster" outline icon={<span aria-hidden="true">◇</span>} />
            <AkProfessionLabel
              name={t('common.medic')}
              en={t('common.medicLatin')}
              prof="medic"
              subProf={<span aria-hidden="true">✚</span>}
              subProfLabel={t('ref.arknights.subProf')}
            />
            <AkElite level={2} icon={<b>E2</b>} title={t('console.detail.eliteTitle', { n: 2 })} />
            <AkPotential label={t('common.potentialN', { n: 6 })} icon={<b>S3</b>} />
            <AkSpec label={t('common.mastery3')} icon={<b>S3</b>} bare />
            <AkTrust value={t('console.detail.trustValue', { n: 200 })} />
          </div>

          <AkSkillLevels value={skillLevel} onValueChange={setSkillLevel} max="M3" ariaLabel={t('common.skillLevelAria')} />

          <AkPotList>
            {POTENTIAL_STEPS.map((step) => (
              <AkPot
                key={step.label}
                index={
                  <b>
                    {t('common.potentialShort')}
                    {step.n}
                  </b>
                }
                label={t(step.label)}
                active={step.active}
              >
                {t(step.body)}
              </AkPot>
            ))}
          </AkPotList>

          <AkAttrs>
            <AkAttr label={t('common.atk')} labelCn={t('common.attack')} value="1234" hint="+90" accent />
            <AkAttr label={t('common.def')} labelCn={t('common.defense')} value="312" />
            <AkAttr label={t('common.rst')} labelCn={t('common.resist')} value="0" />
          </AkAttrs>

          <AkKv>
            <AkKvItem label={t('common.faction')}>{t('common.rhodes')}</AkKvItem>
            <AkKvItem label={t('common.released')}>2019-05-01</AkKvItem>
          </AkKv>
        </div>
      </Block>

        <Block
          id="components-13"
          eyebrow={t('ref.controls.eyebrow')}
          title={t('ref.controls.title')}
          note={t('ref.controls.note')}
        >
          <div className="demo-stack">
            <AkDivider>{t('common.sectionLabel')}</AkDivider>

            <div className="demo-row">
              <AkButtonGroup>
                <AkButton variant="action">A</AkButton>
                <AkButton variant="outline">B</AkButton>
                <AkButton variant="outline">C</AkButton>
              </AkButtonGroup>

              <AkPopover
                trigger={<AkButton variant="action">{t('common.openPanel')}</AkButton>}
                eyebrow="RI / INFO"
                title={t('ref.controls.title')}
              >
                {t('ref.controls.note')}
              </AkPopover>
            </div>

            <AkTagGroup>
              <AkTag>ALPHA</AkTag>
              <AkTag variant="advanced">BRAVO</AkTag>
              <AkTag variant="danger">CHARLIE</AkTag>
              <AkTag variant="neutral">DELTA</AkTag>
            </AkTagGroup>

            <AkStatusGroup>
              <AkStatus label="NETWORK" detail="Stable" />
              <AkStatus variant="warning" label="REACTOR" detail="48%" />
              <AkStatus variant="critical" label="HULL" detail="Breach" />
              <AkStatus variant="offline" label="RELAY" detail="Down" />
            </AkStatusGroup>

            <AkPagination
              page={3}
              total={12}
              title={t('common.timeline')}
              onPageChange={() => undefined}
            />
          </div>
        </Block>

        <Block id="components-14" eyebrow={t('ref.form.eyebrow')} title={t('ref.form.title')} note={t('ref.form.note')}>
          <AkFormStack>
            <AkField hint={t('common.fieldHint')}>
              <AkFieldLabel htmlFor="demo-field">{t('common.fieldName')}</AkFieldLabel>
              <AkInput id="demo-field" placeholder="R001" />
            </AkField>

            <AkField>
              <AkSelect aria-label={t('common.selectPlaceholder')} defaultValue="">
                <option value="" disabled>
                  {t('common.selectPlaceholder')}
                </option>
                <option value="a">Alpha</option>
                <option value="b">Bravo</option>
              </AkSelect>
            </AkField>

            <AkField>
              <AkTextarea rows={3} placeholder={t('common.textareaPlaceholder')} />
            </AkField>

            <AkField invalid hint={t('common.fieldHint')}>
              <AkInput defaultValue="bad!" aria-invalid="true" />
            </AkField>

            <div className="demo-row">
              <AkChoice>{t('common.choiceCheck')}</AkChoice>
              <AkChoice variant="radio" name="demo-deck">
                {t('common.choiceRadio')}
              </AkChoice>
              <AkChoice variant="switch">{t('common.choiceSwitch')}</AkChoice>
            </div>
          </AkFormStack>
        </Block>

        <Block id="components-15" eyebrow={t('ref.data.eyebrow')} title={t('ref.data.title')} note={t('ref.data.note')}>
          <div className="demo-stack">
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <AkCounter
                prefixIcon={<span aria-hidden="true">◆</span>}
                value="1280"
                suffixIcon={<span aria-hidden="true">+</span>}
              />
              <AkLevel label={t('common.levelLabel')}>01-07</AkLevel>
              <AkSpinner />
            </div>

            {/* 理智部件：_ak-san.scss 的两代结构里，这里展示现代版（compact / terminal） */}
            <div className="demo-row" style={{ alignItems: 'flex-start' }}>
              <AkSanContainer
                eyebrow={t('ref.san.eyebrow')}
                title={t('ref.san.title')}
                current={sanCurrent}
                total={sanTotal}
                limit={sanLimit}
                onAdd={() => setSanCurrent((v) => Math.min(sanLimit, v + 1))}
                addLabel={t('ref.san.add')}
                meta={<AkLevel label={t('common.levelLabel')}>01-07</AkLevel>}
                status={t('ref.san.status')}
              />
              {/*
                terminal 变体是 `container-type: size` 容器，内部几何全用 cqh，
                所以**必须由父级给出确定高度**（上游挂在 .ak-dashboard__right-menu 下就是如此）。
                这里用 grid 让子元素拉伸填满 —— 早先只写 blockSize，容器高度算出来是 0，
                于是 3.35cqh 的黄条塌成 0px。图形层也要带 .ak-icon，样式是挂在这个类上的。
              */}
              <div style={{ display: 'grid', inlineSize: 'min(22rem, 100%)', blockSize: '12rem' }}>
                <AkSanContainer
                  variant="terminal"
                  current={sanCurrent}
                  total={sanTotal}
                  onAdd={() => setSanCurrent((v) => Math.min(sanLimit, v + 1))}
                  addLabel={t('ref.san.add')}
                  figure={<span className="ak-icon" aria-hidden="true">◆</span>}
                  watermark={<span aria-hidden="true">RHODES</span>}
                />
              </div>
            </div>

            <AkSkeleton lines={3} />
            <AkSkeleton variant="block" height="4rem" />
            <AkSkeleton variant="track" height="6px" />

            {/*
              全屏加载画面。它 `position:absolute; inset:0; z-index:30` +
              `container-type:size`，所以必须给**有定位且高度确定**的容器，
              否则内部 cqh/cqw 会塌成 0。这里用 16/9 的固定比例框当舞台。
            */}
            <div>
              <AkButton variant="outline" onClick={() => setLoadingReady((v) => !v)}>
                {loadingReady ? t('ref.loading.replay') : t('ref.loading.finish')}
              </AkButton>
              <div
                style={{
                  position: 'relative',
                  marginTop: 'var(--ak-space-3, 0.75rem)',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                }}
              >
                <AkLoadingScreen
                  state={loadingReady ? 'ready' : 'loading'}
                  label={t('ref.loading.label')}
                  tip={t('ref.loading.tip')}
                  brand="AK-UI"
                  brandSuffix="REACT"
                  mark={<span className="ak-icon" aria-hidden="true">◆</span>}
                  markLabel="RHODES"
                  progressLabel={loadingReady ? 'READY' : 'LOADING'}
                />
              </div>
            </div>

            <div>
              <AkButton variant="action" onClick={() => setDialogOpen(true)}>
                {t('common.openDialog')}
              </AkButton>
              <AkDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                eyebrow="RI / CONFIRM"
                title={t('common.dialogTitle')}
                footer={
                  <>
                    <AkButton variant="outline" onClick={() => setDialogOpen(false)}>
                      {t('common.cancel')}
                    </AkButton>
                    <AkButton variant="action" onClick={() => setDialogOpen(false)}>
                      {t('common.confirm')}
                    </AkButton>
                  </>
                }
              >
                <p>{t('common.dialogBody')}</p>
              </AkDialog>
            </div>
          </div>
        </Block>

        <Block id="components-16" eyebrow={t('ref.collection.eyebrow')} title={t('ref.collection.title')} note={t('ref.collection.note')}>
          <div className="demo-stack">
            <AkBreadcrumb
              items={[
                { label: t('common.breadcrumbHome'), href: '#shell-archive' },
                { label: t('common.breadcrumbRoster'), href: '#shell-archive' },
                { label: t('common.breadcrumbAmiya') },
              ]}
            />

            <AkTable
              scrollable
              columns={[
                { key: 'name', header: t('common.colName') },
                { key: 'atk', header: t('common.colAtk'), numeric: true, sort: 'descending' },
                { key: 'def', header: t('common.colDef'), numeric: true },
              ]}
              rows={[
                { id: 'r1', cells: { name: 'Amiya', atk: '512', def: '128' }, selected: true },
                { id: 'r2', cells: { name: 'Kaltsit', atk: '480', def: '210' } },
                { id: 'r3', cells: { name: 'Ifrit', atk: '620', def: '90' } },
              ]}
              footer={{ name: t('common.total'), atk: '1612', def: '428' }}
            />

            <div className="demo-row" style={{ alignItems: 'center' }}>
              <AkAvatar fallback="A" />
              <AkAvatar fallback="K" size="lg" cut />
              <AkAvatar fallback="I" accent size="sm" />
              <AkAvatarGroup>
                <AkAvatar fallback="A" />
                <AkAvatar fallback="B" />
                <AkAvatar fallback="C" />
              </AkAvatarGroup>
              <AkThumbnail badge="R001" />
              <AkThumbnail cut size="wide" />
            </div>

            <div>
              <AkCodeId>{t('common.scrollHint')}</AkCodeId>
              <AkScrollArea axis="y" maxHeight="6rem" style={{ border: '1px solid var(--ak-border)', marginTop: '0.5rem' }}>
                <div style={{ height: '20rem', padding: '0.75rem' }}>
                  <AkOverline>tall content</AkOverline>
                </div>
              </AkScrollArea>
            </div>

            {/*
              公告列表：容器查询控制的 3 列 → 单列降级。
              外面套一个窄盒子，好让人一眼看到它在 34rem 以下会换成单列。
            */}
            <div>
              <AkOverline>{t('ref.news.title')}</AkOverline>
              <AkNewsList
                label={t('ref.news.label')}
                empty={t('ref.news.empty')}
                style={{ marginTop: 'var(--ak-space-3, 0.75rem)', maxWidth: '34rem' }}
                items={[
                  {
                    category: t('ref.news.catNotice'),
                    title: t('ref.news.item1'),
                    time: '10-20',
                    dateTime: '2026-10-20',
                  },
                  {
                    category: t('ref.news.catEvent'),
                    title: t('ref.news.item2'),
                    time: '10-19',
                    dateTime: '2026-10-19',
                  },
                  { category: t('ref.news.catNotice'), title: t('ref.news.item3'), time: '10-18', dateTime: '2026-10-18' },
                ]}
              />
            </div>
          </div>
        </Block>

      <Block id="components-17" eyebrow={t('ref.command.eyebrow')} title={t('ref.command.title')} note={t('ref.command.note')}>
        <div className="demo-stack">
          <AkCommandGrid style={{ gridAutoRows: '7.5rem' }}>
            <AkCommand
              label={t('common.commandDeploy')}
              meta="OPERATOR / 01"
              watermark={<span aria-hidden="true">01</span>}
              badge={t('common.commandLive')}
              current={selectedCommand === 'deploy' ? t('common.commandSelected') : undefined}
              tone="paper"
              pressed={selectedCommand === 'deploy'}
              onClick={() => setSelectedCommand('deploy')}
              aria-label={t('common.commandDeploy')}
              style={{ minHeight: '7.5rem' }}
            />
            <AkCommand
              label={t('common.commandWithdraw')}
              meta="OPERATOR / 02"
              watermark={<span aria-hidden="true">02</span>}
              tone="dark"
              pressed={selectedCommand === 'withdraw'}
              onClick={() => setSelectedCommand('withdraw')}
              style={{ minHeight: '7.5rem' }}
            />
            <AkCommand
              label={t('common.commandSkill')}
              meta="SP / 24"
              watermark={<span aria-hidden="true">SP</span>}
              tone="cyan"
              layout="vertical"
              pressed={selectedCommand === 'skill'}
              onClick={() => setSelectedCommand('skill')}
              style={{ minHeight: '7.5rem' }}
            />
          </AkCommandGrid>

          <AkCommandGroup variant="recruitment" label={t('common.commandRecruit')}>
            <AkCommand
              label={t('common.commandSlot')}
              meta="TAG / 01"
              tone="accent"
              layout="split"
              pressed={selectedCommand === 'slot-1'}
              onClick={() => setSelectedCommand('slot-1')}
              style={{ minHeight: '5rem' }}
            />
            <AkCommand
              label={t('common.commandSlot')}
              meta="TAG / 02"
              tone="accent"
              layout="split"
              pressed={selectedCommand === 'slot-2'}
              onClick={() => setSelectedCommand('slot-2')}
              style={{ minHeight: '5rem' }}
            />
          </AkCommandGroup>

          <AkCommandGrid style={{ gridAutoRows: '7.5rem' }}>
            <AkCommand
              label="OPERATION"
              current="01-07"
              meta="STORY / CHAPTER 01"
              tone="paper"
              layout="wide"
              pressed={selectedCommand === 'operation'}
              onClick={() => setSelectedCommand('operation')}
              style={{ minHeight: '7.5rem' }}
            />
            <AkCommand
              label="ARCHIVE"
              meta="RECORD / 08"
              tone="muted"
              pressed={selectedCommand === 'archive'}
              onClick={() => setSelectedCommand('archive')}
              style={{ minHeight: '7.5rem' }}
            />
          </AkCommandGrid>
        </div>
      </Block>
          </StageContext.Provider>

          <div className="demo-stage__foot">
            <span className="demo-note">
              {t('ref.catalogue.position', { n: activeIndex + 1, m: CATEGORIES.length })}
            </span>
            <div className="demo-row">
              <AkButton variant="outline" disabled={activeIndex === 0} onClick={() => step(-1)}>
                {t('ref.catalogue.previous')}
              </AkButton>
              <AkButton variant="outline" disabled={activeIndex === CATEGORIES.length - 1} onClick={() => step(1)}>
                {t('ref.catalogue.next')}
              </AkButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// ── 应用外壳 ──────────────────────────────────────────────────────────

export function App() {
  const { locale, setLocale, t } = useI18n()
  const [view, setView] = useState<View>('reference')
  const [theme, setTheme] = useState<Theme>('terminal')

  useEffect(() => {
    document.documentElement.dataset.akTheme = theme
  }, [theme])

  return (
    <div className="demo-app">
      <header className="demo-topbar">
        <div className="demo-topbar__brand">
          <AkDisplay>{t('app.name')}</AkDisplay>
          <span className="demo-topbar__tagline">{t('app.tagline')}</span>
          <span className="demo-topbar__subtitle">{t('app.subtitle')}</span>
        </div>

        <div className="demo-topbar__controls">
          <AkSegmented
            ariaLabel={t('app.view.label')}
            options={[
              { label: t('app.view.reference'), value: 'reference' },
              { label: t('app.view.console'), value: 'console' },
            ]}
            value={view}
            onValueChange={(next) => setView(next === 'reference' ? 'reference' : 'console')}
          />

          <AkDropdownMenu
            className="demo-topbar__settings"
            label={`${t('app.settings.label')} · ${locale === 'zh-CN' ? t('app.lang.zh-cn') : t('app.lang.en')} · ${t(theme === 'terminal' ? 'app.theme.terminal' : 'app.theme.archive')}`}
            items={[
              { label: t('app.lang.zh-cn'), onSelect: () => setLocale('zh-CN') },
              { label: t('app.lang.en'), onSelect: () => setLocale('en') },
              { label: t('app.theme.terminal'), onSelect: () => setTheme('terminal') },
              { label: t('app.theme.archive'), onSelect: () => setTheme('archive') },
            ]}
          />
        </div>
      </header>

      {view === 'console' ? <ConsoleView /> : <ReferenceView />}
    </div>
  )
}
