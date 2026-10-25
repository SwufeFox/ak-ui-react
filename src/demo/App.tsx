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
  AkDropdownMenu, AkContextMenu, AkMenubar, AkToolbar, AkCollapsible, AkMenuSeparator, AkMenuGroup,
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
  AkSan,
  AkSanContainer,
  AkItem,
  AkSlot,
  AkScreen,
  AkLoadingScreen,
  AkNewsList,
  AkNoticeStack,
  AkProgressStack,
  AkDialog,
  AkLevel,
  AkSkeleton,
  AkSpinner,
  AkEntrance,
  AkDepth,
  AkDepthLayer,
  AkDisplay,
  AkElite,
  AkEn,
  AkGauge,
  AkGlyph,
  AkGlyphBox,
  AkGrain,
  AkGridBackdrop,
  AkHalftone,
  AkInputNumber,
  AkInverse,
  AkMotion,
  AkMosaic,
  AkKv,
  AkKvItem,
  AkMediaGallery,
  AkMediaAlbum,
  AkStripeEdge,
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
  AkRarityScope,
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
import type { AkEntranceHandle, AkSkillLevel, GalleryItem } from '../ak'
import { galleryItems } from './gallery-art'
import { useI18n, type MessageKey } from './i18n'
import { DOC_REGISTRY, type BlockPropDoc } from './doc-data'
import llmsRawText from '../../llms.txt?raw'
import type { AkMobileMenuHandle } from '../ak/ui/site/AkMobileMenu'
import './demo.css'

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

/** 舞台上下文：当前激活的分类 id + 切换函数。 */
const StageContext = createContext<{ active: string; select: (id: string) => void } | null>(null)

/** 菜单与指令共享动作集。 */
const MENU_ACTIONS = new Set(['inspect', 'deploy', 'cancel', 'archive', 'file', 'edit', 'view'])

/** 组件分类面板容器。 */
function Block({
  id,
  eyebrow,
  title,
  note,
  code,
  api,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  note?: ReactNode
  code?: string
  api?: BlockPropDoc[]
  children: ReactNode
}) {
  const stage = useContext(StageContext)
  const { t } = useI18n()
  const [tab, setTab] = useState<'preview' | 'code' | 'api'>('preview')
  const [copied, setCopied] = useState(false)

  if (stage && stage.active !== id) return null

  const index = CATEGORIES.findIndex((category) => category.id === id)
  const displayEyebrow =
    index === -1 ? eyebrow : `${String(index + 1).padStart(2, '0')} / ${eyebrow.replace(/^\s*\d+\s*\/\s*/, '')}`

  const copyCode = () => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id={id} className="demo-block" aria-labelledby={`${id}-title`}>
      <div className="demo-block__header">
        <div>
          <span className="demo-eyebrow">{displayEyebrow}</span>
          <h2 id={`${id}-title`}>{title}</h2>
          {note ? <p className="demo-note">{note}</p> : null}
        </div>
        {(code || api) ? (
          <div className="demo-block__tabs" role="tablist">
            <button
              type="button"
              className={`demo-doc-tab ${tab === 'preview' ? 'is-active' : ''}`}
              onClick={() => setTab('preview')}
            >
              {t('common.preview')}
            </button>
            {code ? (
              <button
                type="button"
                className={`demo-doc-tab ${tab === 'code' ? 'is-active' : ''}`}
                onClick={() => setTab('code')}
              >
                {t('common.code')}
              </button>
            ) : null}
            {api ? (
              <button
                type="button"
                className={`demo-doc-tab ${tab === 'api' ? 'is-active' : ''}`}
                onClick={() => setTab('api')}
              >
                {t('common.apiDocs')}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {tab === 'preview' && children}

      {tab === 'code' && code && (
        <div className="demo-code-container">
          <div className="demo-code-header">
            <span>JSX / TSX</span>
            <button type="button" className="demo-copy-btn" onClick={copyCode}>
              {copied ? '✓ COPIED' : 'COPY'}
            </button>
          </div>
          <pre className="demo-code-box"><code>{code}</code></pre>
        </div>
      )}

      {tab === 'api' && api && (
        <div className="demo-api-container">
          <table className="ak-table">
            <thead className="ak-table__head">
              <tr>
                <th>{t('common.propName')}</th>
                <th>{t('common.propType')}</th>
                <th>{t('common.propDefault')}</th>
                <th>{t('common.propDesc')}</th>
              </tr>
            </thead>
            <tbody className="ak-table__body">
              {api.map((item) => (
                <tr key={item.name}>
                  <td><code>{item.name}</code></td>
                  <td><code style={{ color: 'var(--ak-signal-info)' }}>{item.type}</code></td>
                  <td><code>{item.default ?? '—'}</code></td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

const POTENTIAL_STEPS: { n: number; label: MessageKey; body: MessageKey; active?: boolean }[] = [
  { n: 2, label: 'common.potential2', body: 'common.deployCostMinus', active: true },
  { n: 3, label: 'common.potential3', body: 'common.atkPlus' },
  { n: 4, label: 'common.potential4', body: 'common.redeployMinus' },
]

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
  const [skillLevel, setSkillLevel] = useState<AkSkillLevel>(3)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState('deploy')
  // 「外观展台」那排按钮的点击回显：让纯展示按钮也有反馈
  const [buttonHit, setButtonHit] = useState('')
  const [buttonHits, setButtonHits] = useState(0)
  const [groupPick, setGroupPick] = useState<'A' | 'B' | 'C'>('A')
  const [cardDialog, setCardDialog] = useState(false)
  const [pageIndex, setPageIndex] = useState(3)
  // 表单演示的受控状态：每个控件都真的受控，并在下方实时回显
  const [fieldName, setFieldName] = useState('')
  const [selectPick, setSelectPick] = useState('')
  const [noteText, setNoteText] = useState('')
  const [choiceA, setChoiceA] = useState(false)
  const [choiceB, setChoiceB] = useState(false)
  const hitButton = (name: string) => {
    setButtonHit(name)
    setButtonHits((n) => n + 1)
  }
  // 理智计数演示状态
  const [loadingReady, setLoadingReady] = useState(false)
  const [screenOpen, setScreenOpen] = useState(false)
  const mobileMenuRef = useRef<AkMobileMenuHandle>(null)
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
  const entranceRef = useRef<AkEntranceHandle>(null)
  const stageValue = useMemo(() => ({ active, select: setActive }), [active])

  /** 切换分类：写 hash（可分享）并把舞台滚回顶部（原位替换而不是继承上一块的滚动位置）。 */
  const selectCategory = useCallback((id: string) => {
    setActive(id)
    const url = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(null, '', url)
    // 滚动回分类顶部
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
  // 画廊素材展示项
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
          <div className="demo-rail__head">
            <span className="demo-rail__eyebrow">CATALOGUE // 索引</span>
            <span className="demo-rail__count">{CATEGORIES.length} MODULES</span>
          </div>
          <button
            type="button"
            className="demo-rail__llm-banner"
            onClick={() => window.dispatchEvent(new CustomEvent('ak:open-llm-spec'))}
          >
            <span className="demo-rail__llm-tag">AI SPEC</span>
            <span className="demo-rail__llm-title">llms.txt</span>
            <span className="demo-rail__llm-desc">SPECIFICATION ↗</span>
          </button>
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
      <Block id="components-1" eyebrow={t('ref.actions.eyebrow')} title={t('ref.actions.title')} note={t('ref.actions.note')} code={DOC_REGISTRY['components-1']?.code} api={DOC_REGISTRY['components-1']?.api}>
        {/* 这一排是「外观展台」：真实用途是让人看五个 variant 的差别，
            本来就没有业务动作。但死按钮会让人以为坏了，所以点任何一个都会
            把它的档位名写进下面的回显行 —— 有反馈，又不假装它有功能。 */}
        <div className="demo-row">
          <AkButton onClick={() => hitButton('default')}>{t('common.default')}</AkButton>
          <AkButton variant="outline" onClick={() => hitButton('outline')}>{t('common.outline')}</AkButton>
          <AkButton variant="action" onClick={() => hitButton('action')}>{t('common.action')}</AkButton>
          <AkButton variant="advanced" onClick={() => hitButton('advanced')}>{t('common.advanced')}</AkButton>
          <AkButton variant="light" onClick={() => hitButton('light')}>{t('common.light')}</AkButton>
          <AkTag>{t('common.tag')}</AkTag>
          <AkTag variant="advanced">{t('common.advanced')}</AkTag>
          <AkTag variant="danger">{t('common.danger')}</AkTag>
          <AkTag variant="neutral">{t('common.neutral')}</AkTag>
        </div>
        <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
          <AkButton variant="action" icon={<span aria-hidden="true">◆</span>} onClick={() => hitButton('action+icon')}>
            {t('common.withIcon')}
          </AkButton>
          <AkButton variant="outline" block style={{ maxWidth: '16rem' }} onClick={() => hitButton('block')}>
            {t('common.block')}
          </AkButton>
          <AkButton disabled>{t('common.disabled')}</AkButton>
        </div>
        {/* 回显：点了哪个档位 */}
        <p className="demo-note" aria-live="polite">
          {buttonHit ? `${t('ref.actions.hitLabel')}: ${buttonHit} · ${t('ref.actions.hitCount', { n: buttonHits })}` : t('ref.actions.hitHint')}
        </p>
      </Block>

      <Block id="components-2" eyebrow={t('ref.menu.eyebrow')} title={t('ref.menu.title')} note={t('ref.menu.note')} code={DOC_REGISTRY['components-2']?.code} api={DOC_REGISTRY['components-2']?.api}>
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

          {/* 结构化菜单项：分组与分割线 */}
          <div className="demo-panel" style={{ maxWidth: '22rem' }}>
            <AkMenuGroup label={t('ref.menu.group')}>
              <div style={{ display: 'grid', gap: '2px' }}>
                <button type="button" role="menuitem" className="ak-menu__item" onClick={() => setSelectedCommand('inspect')}>
                  <span>{t('ref.menu.inspect')}</span>
                  <kbd>⌘I</kbd>
                </button>
                <button type="button" role="menuitem" className="ak-menu__item" onClick={() => setSelectedCommand('deploy')}>
                  <span>{t('ref.menu.deploy')}</span>
                  <kbd>⌘D</kbd>
                </button>
              </div>
            </AkMenuGroup>
            <AkMenuSeparator />
            <AkMenuGroup>
              <button type="button" role="menuitem" className="ak-menu__item" data-destructive onClick={() => setSelectedCommand('cancel')}>
                <span>{t('ref.menu.cancel')}</span>
                <kbd>⎋</kbd>
              </button>
            </AkMenuGroup>
          </div>
          <AkCollapsible title={t('ref.menu.disclosure')}>
            <p>{t('ref.menu.body')}</p>
          </AkCollapsible>
        </div>
      </Block>

      <Block id="components-3" eyebrow={t('ref.surfaces.eyebrow')} title={t('ref.surfaces.title')} note={t('ref.surfaces.note')} code={DOC_REGISTRY['components-3']?.code} api={DOC_REGISTRY['components-3']?.api}>
        <div className="demo-grid">
          <AkCard as="article">
            <AkCardHeader>
              <AkCardTitle>{t('card.default.title')}</AkCardTitle>
              <AkCardDescription>{t('card.default.desc')}</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">{t('card.default.body')}</AkCardContent>
            <AkCardFooter>
              {/* 卡片底部动作是真按钮，就该真开东西 —— 这里开库自带的详情对话框 */}
              <AkButton variant="outline" onClick={() => setCardDialog(true)}>
                {t('common.inspect')}
              </AkButton>
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

        {/* 卡片里那个「查看」按钮真的会开这个对话框 —— 示例里每个动作都该有去处 */}
        <AkDialog
          open={cardDialog}
          onOpenChange={setCardDialog}
          eyebrow={t('card.default.title')}
          title={t('card.default.title')}
          footer={
            <>
              <AkButton variant="outline" size="sm" onClick={() => setCardDialog(false)}>
                {t('common.cancel')}
              </AkButton>
              <AkButton variant="action" size="sm" onClick={() => setCardDialog(false)}>
                {t('common.confirm')}
              </AkButton>
            </>
          }
        >
          {t('card.default.body')}
        </AkDialog>
      </Block>

      <Block id="components-4" eyebrow={t('ref.feedback.eyebrow')} title={t('ref.feedback.title')} note={t('ref.feedback.note')} code={DOC_REGISTRY['components-4']?.code} api={DOC_REGISTRY['components-4']?.api}>
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

      <Block id="components-5" eyebrow={t('ref.inputs.eyebrow')} title={t('ref.inputs.title')} note={t('ref.inputs.note')} code={DOC_REGISTRY['components-5']?.code} api={DOC_REGISTRY['components-5']?.api}>
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

          {/* 尺寸档对照：同一组件三档并排，肉眼可比 */}
          <div className="demo-row" style={{ alignItems: 'center' }}>
            <span className="demo-note">{t('ref.inputs.sizeTiers')}</span>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <AkSlider
                key={s}
                size={s}
                label={`volume-${s}`}
                value={slider}
                onValueChange={(v) => setSlider(Number.isFinite(v) ? v : 0)}
              />
            ))}
          </div>
        </div>
      </Block>

      <Block id="components-6" eyebrow={t('ref.navigation.eyebrow')} title={t('ref.navigation.title')} note={t('ref.navigation.note')} code={DOC_REGISTRY['components-6']?.code} api={DOC_REGISTRY['components-6']?.api}>
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

      <Block id="components-7" eyebrow={t('ref.effects.eyebrow')} title={t('ref.effects.title')} note={t('ref.effects.note')} code={DOC_REGISTRY['components-7']?.code} api={DOC_REGISTRY['components-7']?.api}>
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

          {/* 入场动效：支持 ref 控制器重播 */}
          <div className="demo-panel">
            <div className="demo-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <AkCodeId>AkEntrance</AkCodeId>
              {/* 以前用内联 style 硬改尺寸 —— 现在走 size 档。 */}
              <AkButton variant="outline" size="sm" onClick={() => entranceRef.current?.replay()}>
                {t('ref.effects.replay')}
              </AkButton>
            </div>
            <AkEntrance ref={entranceRef} style={{ marginTop: 'var(--ak-space-2, 0.5rem)' }}>
              <div style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--ak-signal-info)', background: 'var(--ak-surface-sunken-2)' }}>
                <AkDisplay>PRTS // TACTICAL ENTRANCE</AkDisplay>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--ak-text-secondary)', fontSize: '0.82rem' }}>
                  {t('ref.effects.entrance')}
                </p>
              </div>
            </AkEntrance>
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

      <Block id="components-8" eyebrow={t('ref.gallery.eyebrow')} title={t('ref.gallery.title')} note={t('ref.gallery.note')} code={DOC_REGISTRY['components-8']?.code} api={DOC_REGISTRY['components-8']?.api}>
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

      <Block id="components-9" eyebrow={t('ref.site.eyebrow')} title={t('ref.site.title')} note={t('ref.site.note')} code={DOC_REGISTRY['components-9']?.code} api={DOC_REGISTRY['components-9']?.api}>
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
            <AkButton variant="action" icon={<span>☰</span>} onClick={() => mobileMenuRef.current?.open()}>
              {t('ref.site.openMenu')} // OPEN MOBILE MENU
            </AkButton>
          </div>
          <div>
            <AkMobileMenu ref={mobileMenuRef} label={t('common.menu')} closeLabel={t('common.close')}>
              <a className="ak-nav__link" href="#components-1" onClick={() => { selectCategory('components-1'); mobileMenuRef.current?.close(); }}>
                01 // ACTIONS & BUTTONS
              </a>
              <a className="ak-nav__link" href="#components-2" onClick={() => { selectCategory('components-2'); mobileMenuRef.current?.close(); }}>
                02 // MENUS & POPOVERS
              </a>
              <a className="ak-nav__link" href="#components-4" onClick={() => { selectCategory('components-4'); mobileMenuRef.current?.close(); }}>
                04 // FEEDBACK & PROGRESS
              </a>
              <a className="ak-nav__link" href="#components-9" onClick={() => { selectCategory('components-9'); mobileMenuRef.current?.close(); }}>
                09 // SITE SHELL & LOADERS
              </a>
              <a className="ak-nav__link" href="#components-17" onClick={() => { selectCategory('components-17'); mobileMenuRef.current?.close(); }}>
                17 // COMMAND & SCREENS
              </a>
            </AkMobileMenu>
          </div>
        </div>
      </Block>

      <Block id="components-10" eyebrow={t('ref.shell.eyebrow')} title={t('ref.shell.title')} note={t('ref.shell.note')} code={DOC_REGISTRY['components-10']?.code} api={DOC_REGISTRY['components-10']?.api}>
        <SiteShellDemo />
      </Block>

      <Block id="components-11" eyebrow={t('ref.decor.eyebrow')} title={t('ref.decor.title')} note={t('ref.decor.note')} code={DOC_REGISTRY['components-11']?.code} api={DOC_REGISTRY['components-11']?.api}>
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
            {/* fade 是正交的另一条类：不画网点，而是让内容朝右渐隐 */}
            <AkHalftone fade style={{ padding: 'var(--ak-space-3)' }}>
              <AkGlyphBox style={{ padding: '0.25rem' }}>FADE</AkGlyphBox>
            </AkHalftone>
            <div className="demo-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
              <AkGlyph white style={{ padding: '0.2rem 0.5rem', background: 'var(--ak-surface-sunken-2)' }}>◆</AkGlyph>
              <AkGlyph keep style={{ padding: '0.2rem 0.5rem', background: 'var(--ak-surface-sunken-2)', color: 'var(--ak-signal-info)' }}>▲</AkGlyph>
              <AkMotion effect="rise" pace="base">
                <AkInverse style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>RISE</AkInverse>
              </AkMotion>
              <AkMotion effect="fade" pace="slow">
                <AkInverse style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>FADE</AkInverse>
              </AkMotion>
            </div>
          </div>
          {/* 左缘警戒斜纹：8px 斜纹条用 --ak-signal-action，所以是动作语义 */}
          <div className="demo-row" style={{ alignItems: 'stretch', marginTop: 'var(--ak-space-4)' }}>
            <AkStripeEdge style={{ padding: '0.75rem 0.75rem 0.75rem 1.25rem', background: 'var(--ak-surface-sunken-2)' }}>
              {t('ref.decor.stripeEdge')}
            </AkStripeEdge>
            <AkStripeEdge as="aside" style={{ padding: '0.75rem 0.75rem 0.75rem 1.25rem', background: 'var(--ak-surface-sunken-2)' }}>
              {t('ref.decor.stripeEdgeAs')}
            </AkStripeEdge>
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

      <Block id="components-12" eyebrow={t('ref.arknights.eyebrow')} title={t('ref.arknights.title')} note={t('ref.arknights.note')} code={DOC_REGISTRY['components-12']?.code} api={DOC_REGISTRY['components-12']?.api}>
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
            <AkRarityScope level={6} className="demo-row" style={{ alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.5rem', background: 'var(--ak-surface-sunken)' }}>
              <span className="ak-r-text" style={{ fontWeight: 800, fontSize: '0.8rem' }}>★6</span>
              <span className="ak-r-text" style={{ fontSize: '0.78rem' }}>{t('ref.arknights.rarityScope')}</span>
            </AkRarityScope>
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
         code={DOC_REGISTRY['components-13']?.code} api={DOC_REGISTRY['components-13']?.api}>
          <div className="demo-stack">
            <AkDivider>{t('common.sectionLabel')}</AkDivider>

          <div className="demo-row">
            {/* 按钮组本来就该是单选：点哪个哪个变 action 档 */}
            <AkButtonGroup>
              {(['A', 'B', 'C'] as const).map((k) => (
                <AkButton
                  key={k}
                  variant={groupPick === k ? 'action' : 'outline'}
                  aria-pressed={groupPick === k}
                  onClick={() => setGroupPick(k)}
                >
                  {k}
                </AkButton>
              ))}
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

          {/* 以前 onPageChange 是 `() => undefined` —— 点了页码永远不动，
              这正是「控件点了没效果」最典型的一处。 */}
          <AkPagination
            page={pageIndex}
            total={12}
            title={t('common.timeline')}
            onPageChange={setPageIndex}
          />
          </div>
        </Block>

        <Block id="components-14" eyebrow={t('ref.form.eyebrow')} title={t('ref.form.title')} note={t('ref.form.note')} code={DOC_REGISTRY['components-14']?.code} api={DOC_REGISTRY['components-14']?.api}>
        <AkFormStack>
          <AkField hint={t('common.fieldHint')}>
            <AkFieldLabel htmlFor="demo-field">{t('common.fieldName')}</AkFieldLabel>
          {/* 受控输入 + 回显：不接 value 的话，打字虽然能进去，但示例里
              看不出"这个组件真的在受控状态工作" */}
          <AkInput
            id="demo-field"
            placeholder="R001"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
        </AkField>

        <AkField>
          <AkSelect
            aria-label={t('common.selectPlaceholder')}
            value={selectPick}
            onChange={(e) => setSelectPick(e.target.value)}
          >
            <option value="" disabled>
              {t('common.selectPlaceholder')}
            </option>
            <option value="a">Alpha</option>
            <option value="b">Bravo</option>
          </AkSelect>
        </AkField>

        <AkField>
          <AkTextarea
            rows={3}
            placeholder={t('common.textareaPlaceholder')}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </AkField>

        <AkField invalid hint={t('common.fieldHint')}>
          <AkInput defaultValue="bad!" aria-invalid="true" />
        </AkField>

        <div className="demo-row">
          <AkChoice checked={choiceA} onChange={(e) => setChoiceA(e.target.checked)}>
            {t('common.choiceCheck')}
          </AkChoice>
          <AkChoice variant="radio" name="demo-deck" defaultChecked>
            {t('common.choiceRadio')}
          </AkChoice>
          <AkChoice variant="switch" checked={choiceB} onChange={(e) => setChoiceB(e.target.checked)}>
            {t('common.choiceSwitch')}
          </AkChoice>
        </div>

        {/* 实时回显：证明每个控件都真的在受控 */}
        <p className="demo-note" aria-live="polite">
          {t('ref.form.liveEcho', {
            name: fieldName || '—',
            pick: selectPick || '—',
            note: noteText || '—',
            check: choiceA ? 'on' : 'off',
            toggle: choiceB ? 'on' : 'off',
          })}
        </p>
      </AkFormStack>
      </Block>

        <Block id="components-15" eyebrow={t('ref.data.eyebrow')} title={t('ref.data.title')} note={t('ref.data.note')} code={DOC_REGISTRY['components-15']?.code} api={DOC_REGISTRY['components-15']?.api}>
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

            {/* 理智部件：独立仪表与完整外壳容器 */}
            <div className="demo-row" style={{ alignItems: 'flex-start' }}>
              <div className="demo-panel" style={{ width: 'auto', padding: '0.75rem 1rem' }}>
                <span className="demo-eyebrow">{t('ref.data.sanStandalone')}</span>
                <AkSan
                  current={sanCurrent}
                  total={sanTotal}
                  limit={sanLimit}
                  onAdd={() => setSanCurrent((v) => Math.min(sanLimit, v + 1))}
                  addLabel={t('ref.san.add')}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
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

        <Block id="components-16" eyebrow={t('ref.collection.eyebrow')} title={t('ref.collection.title')} note={t('ref.collection.note')} code={DOC_REGISTRY['components-16']?.code} api={DOC_REGISTRY['components-16']?.api}>
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

      <Block id="components-17" eyebrow={t('ref.command.eyebrow')} title={t('ref.command.title')} note={t('ref.command.note')} code={DOC_REGISTRY['components-17']?.code} api={DOC_REGISTRY['components-17']?.api}>
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

          {/* 干员槽位卡 (AkSlot) */}
          <div>
            <AkOverline>OPERATOR SLOTS // 干员卡位</AkOverline>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(8.5rem, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <AkSlot name="SILVERASH" role="guard" rarity={6} code="GRD" meta="LV.90 // S3" reveal index={0} />
              <AkSlot name="AMIYA" role="caster" rarity={5} code="CAS" meta="LV.80 // S2" reveal index={1} />
              <AkSlot name="SARIA" role="defender" rarity={6} code="DEF" meta="LV.90 // S1" reveal index={2} pressed />
              <AkSlot name="EYJA" role="caster" rarity={6} code="CAS" meta="LV.90 // S3" reveal index={3} />
              <AkSlot empty><span>+ ASSIGN</span></AkSlot>
            </div>
          </div>

          {/* 材料与道具方块 (AkItem) */}
          <div>
            <AkOverline>DEPOT MATERIAL TILES // 材料与道具方块</AkOverline>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(6rem, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <AkItem tier={5} name="D32钢" count="x4" />
              <AkItem tier={5} name="双极纳米片" count="x6" />
              <AkItem tier={4} name="改量装置" count="x12" />
              <AkItem tier={3} name="锰矿" count="x28" />
              <AkItem tier={2} name="糖" count="x84" />
              <AkItem tier={4} name="龙门币" price="5,000" sold />
            </div>
          </div>

          {/* 终端大屏交互 (AkScreen) */}
          <div>
            <AkOverline>FUNCTION SCREEN // 终端大屏模态</AkOverline>
            <div style={{ marginTop: '0.5rem' }}>
              <AkButton variant="action" icon={<span>⤢</span>} onClick={() => setScreenOpen(true)}>
                OPEN TERMINAL SCREEN // 打开终端功能大屏
              </AkButton>
            </div>

            {screenOpen ? (
              <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
                <AkScreen
                  tone="dark"
                  title="DEPOT // 仓库物资"
                  eyebrow="MANAGEMENT // 01"
                  watermark="DEPOT"
                  meta={<AkCounter value="42,850" prefixIcon={<span>◆</span>} />}
                  onBack={() => setScreenOpen(false)}
                  backLabel="RETURN"
                >
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <AkOverline>CATEGORY // ELITE MATERIALS</AkOverline>
                      <AkButton variant="outline" size="sm" onClick={() => setScreenOpen(false)}>
                        CLOSE ⎋
                      </AkButton>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.75rem' }}>
                      <AkItem tier={5} name="D32钢" count="x4" />
                      <AkItem tier={5} name="双极纳米片" count="x6" />
                      <AkItem tier={5} name="聚合剂" count="x3" />
                      <AkItem tier={4} name="改量装置" count="x12" />
                      <AkItem tier={4} name="三水锰矿" count="x8" />
                      <AkItem tier={3} name="固源岩组" count="x142" />
                    </div>
                  </div>
                </AkScreen>
              </div>
            ) : null}
          </div>
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
  const [theme, setTheme] = useState<Theme>('terminal')
  const [density, setDensity] = useState<'compact' | 'cozy' | 'spacious'>('cozy')
  const [llmModalOpen, setLlmModalOpen] = useState(false)
  const [llmCopied, setLlmCopied] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.akTheme = theme
  }, [theme])

  // 密度挂在 <html> 上，于是整个示例站点（包括每个演示块里的组件）
  // 都跟着这份档位走 —— 这正是 data-ak-density 的设计用途：子树级联。
  useEffect(() => {
    document.documentElement.dataset.akDensity = density
  }, [density])

  useEffect(() => {
    const handleOpen = () => setLlmModalOpen(true)
    window.addEventListener('ak:open-llm-spec', handleOpen)
    return () => window.removeEventListener('ak:open-llm-spec', handleOpen)
  }, [])

  const copyLlmText = () => {
    navigator.clipboard.writeText(llmsRawText)
    setLlmCopied(true)
    setTimeout(() => setLlmCopied(false), 2000)
  }

  return (
    <div className="demo-app">
      <header className="demo-topbar">
        <div className="demo-topbar__brand">
          <div className="demo-brand-badge">
            <span className="demo-brand-badge__emblem">◆</span>
            <span className="demo-brand-badge__label">PRTS // OS</span>
          </div>
          <AkDisplay>{t('app.name')}</AkDisplay>
          <span className="demo-topbar__tagline">{t('app.tagline')}</span>
          <span className="demo-topbar__version">v1.3.0</span>
        </div>

        {/* 顶栏控件全部用库自己的组件 —— 以前这里是自造的 demo-tactical-btn /
            demo-status-pill，视觉与 AkButton / AkStatus 各调各的，主题切换时先露馅。 */}
        <div className="demo-topbar__controls">
          <AkStatus size="sm" label="SYSTEM NORMAL" />

          <div className="demo-topbar__group">
            <AkButton
              size="sm"
              variant="light"
              onClick={() => setLlmModalOpen(true)}
              title="View llms.txt AI Agent Specification"
              icon={<span className="demo-spec-dot">◆</span>}
            >
              LLMS.TXT
            </AkButton>
            <AkButton
              size="sm"
              variant="light"
              onClick={() => window.open('/llms.txt', '_blank', 'noreferrer')}
              iconEnd={<span aria-hidden="true">↗</span>}
            >
              RAW
            </AkButton>
          </div>

          <AkSegmented
            size="sm"
            ariaLabel="Theme"
            options={[
              { label: 'TERMINAL', value: 'terminal' },
              { label: 'ARCHIVE', value: 'archive' },
            ]}
            value={theme}
            onValueChange={(v) => setTheme(v as 'terminal' | 'archive')}
          />

          <AkSegmented
            size="sm"
            ariaLabel="Language"
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'EN', value: 'en' },
            ]}
            value={locale}
            onValueChange={(v) => setLocale(v as 'zh-CN' | 'en')}
          />

          {/* 密度：整站的活样板 —— 切一下，下面所有演示块里的组件一起变 */}
          <AkSegmented
            size="sm"
            ariaLabel="Density"
            options={[
              { label: 'CMPT', value: 'compact' },
              { label: 'COZY', value: 'cozy' },
              { label: 'SPCS', value: 'spacious' },
            ]}
            value={density}
            onValueChange={(v) => setDensity(v as 'compact' | 'cozy' | 'spacious')}
          />

          <AkButton
            size="sm"
            variant="outline"
            onClick={() => window.open('https://github.com/swufefox/ak-ui-react', '_blank', 'noreferrer')}
            iconEnd={<span aria-hidden="true">↗</span>}
          >
            GITHUB
          </AkButton>
        </div>
      </header>

      <ReferenceView />

      {llmModalOpen ? (
        <div className="demo-llm-overlay" onClick={() => setLlmModalOpen(false)}>
          <div className="demo-llm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="demo-llm-modal__head">
              <div className="demo-llm-modal__title">
                <span className="demo-spec-dot">◆</span>
                <span>PRTS // llms.txt SPECIFICATION</span>
              </div>
              <div className="demo-llm-modal__actions">
                <button
                  type="button"
                  className="demo-copy-btn"
                  onClick={copyLlmText}
                >
                  {llmCopied ? '✓ COPIED ALL' : 'COPY ALL'}
                </button>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="demo-raw-link"
                >
                  RAW FILE ↗
                </a>
                <button
                  type="button"
                  className="demo-copy-btn"
                  onClick={() => setLlmModalOpen(false)}
                >
                  CLOSE ⎋
                </button>
              </div>
            </div>
            <pre className="demo-llm-modal__body">
              <code>{llmsRawText}</code>
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  )
}
