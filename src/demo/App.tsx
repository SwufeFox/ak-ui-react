import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { version as packageVersion, peerDependencies } from '../../package.json'
import { AkDisplay, AkSegmented, useTactileSound, playTactileSound } from '../ak'
import type { AkEntranceHandle, AkSkillLevel, GalleryItem } from '../ak'
import { galleryItems } from './gallery-art'
import { useI18n, type Locale, type MessageKey } from './i18n'
import { DOC_REGISTRY } from './doc-data'
import { Block } from './block'
import { CATEGORIES } from './catalogue-data'
import { CatalogueRail } from './catalogue-rail'
import { StageContext } from './stage-context'
import llmsRawText from '../../llms.txt?raw'
import type { AkMobileMenuHandle } from '../ak/ui/site/AkMobileMenu'
import type { ExampleFactory, Tune, TuneOverrides } from './example-tune'
import type { CommandSnapshot } from './examples/command-export'
import type { exportCategory as GenerateCategory } from './example-manifest'
import type { exportShell as GenerateShell } from './example-source'
import type { exportSite as GenerateSite } from './example-site-export'
import { renderActions } from './examples/actions'
import { BootSequence } from './boot'
import { HudReticle } from './hud'
import { StageProgress, SystemStatus } from './status'
import { pushReceipt, Receipts, formatBytes } from './receipt'
import { GuideView } from './guide'
import { renderShell } from './examples/shell'
import { renderSite } from './examples/site'
import { renderMenus } from './examples/menus'
import { renderSurfaces } from './examples/surfaces'
import { renderFeedback } from './examples/feedback'
import { renderInputs } from './examples/inputs'
import { renderNavigation } from './examples/navigation'
import { renderEffects } from './examples/effects'
import { renderGallery } from './examples/gallery'
import { renderDecor } from './examples/decor'
import { renderGameData } from './examples/game-data'
import { renderOperators } from './examples/operators'
import { renderSkills } from './examples/skills'
import { renderPanels } from './examples/panels'
import { renderControls } from './examples/controls'
import { renderForms } from './examples/forms'
import { renderReadouts } from './examples/readouts'
import { renderCollections, sortTableRows, nextTableSort } from './examples/collections'
import { DEPOT_ITEMS, filterDepotItems, renderCommand, showcaseDialogStyle, useCommandNotice, useShowcaseDialog, type DepotCategory } from './examples/command'
import './demo.css'

const loadCategory = () => import('./example-manifest')
const loadShell = () => import('./example-source')
const loadSite = () => import('./example-site-export')
const loadCommand = () => Promise.all([import('./examples/command-export'), import('./example-export'), import('./examples/command.tsx?raw')])


const exportCategory = (...args: Parameters<typeof GenerateCategory>) =>
  loadCategory().then(({ exportCategory: generate }) => generate(...args))
const exportShell = (...args: Parameters<typeof GenerateShell>) =>
  loadShell().then(({ exportShell: generate }) => generate(...args))
const exportSite = (...args: Parameters<typeof GenerateSite>) =>
  loadSite().then(({ exportSite: generate }) => generate(...args))
const exportCommand = (snapshot: CommandSnapshot, overrides: TuneOverrides, locale: Locale) =>
  loadCommand().then(([command, helpers, source]) => command.exportCommand(snapshot, overrides, helpers.exampleMessages(locale, source.default), helpers.standaloneCss(source.default)))

type Theme = 'terminal' | 'archive'

/** 可选主题：设置面板与首屏读数共用这一份，主题名也从这张表取。 */
const THEMES = ['terminal', 'archive'] as const satisfies readonly Theme[]

const THEME_LABELS: Record<Theme, MessageKey> = {
  terminal: 'app.theme.terminal',
  archive: 'app.theme.archive',
}

/** peerDependencies 里 React 的最低主版本，用于首屏读数。 */
const REACT_PEER_MAJOR = /(\d+)/.exec(peerDependencies.react)?.[1] ?? '18'

/** 开机序列打的都是真数据：版本号与分类数都从上面的常量取。 */
const BOOT_LINES = [
  'PRTS TERMINAL OS // SECTOR-07',
  `MOUNTING ${CATEGORIES.length} CATEGORIES`,
  `LIB @swufefox/ak-ui-react v${packageVersion}`,
  'ALL SYSTEMS NOMINAL',
] as const


function ReferenceView({ theme, topbarRef, navGuardUntil }: { theme: Theme; topbarRef: RefObject<HTMLElement | null>; navGuardUntil: RefObject<number> }) {
  const { t, locale } = useI18n()
  const [tab, setTab] = useState('overview')
  const [segment, setSegment] = useState('all')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [slider, setSlider] = useState(42)
  const [count, setCount] = useState(1280)
  const [skillLevel, setSkillLevel] = useState<AkSkillLevel>(3)
  const [operatorPhase, setOperatorPhase] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState('deploy')
  const [selectedTableRow, setSelectedTableRow] = useState('r1')
  const [tableStriped, setTableStriped] = useState(true)
  const [tableTactical, setTableTactical] = useState(true)
  const [tableSticky, setTableSticky] = useState(false)
  const [tableSortKey, setTableSortKey] = useState<'name' | 'atk' | 'def'>('atk')
  const [tableSortDir, setTableSortDir] = useState<'ascending' | 'descending' | 'none'>('descending')

  const handleTableSort = useCallback((key: 'name' | 'atk' | 'def') => {
    playTactileSound('dial', 0.15)
    setTableSortDir(nextTableSort(tableSortKey, tableSortDir, key))
    setTableSortKey(key)
  }, [tableSortKey, tableSortDir])

  const tableData = useMemo(() => sortTableRows(tableSortKey, tableSortDir), [tableSortKey, tableSortDir])
  const [selectedItem, setSelectedItem] = useState('D32')
  const [selectedSlot, setSelectedSlot] = useState('silverash')
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
  const hitButton = useCallback((name: string) => {
    setButtonHit(name)
    setButtonHits((n) => n + 1)
  }, [setButtonHit, setButtonHits])


  const [installCopyState, setInstallCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const installCopyTimer = useRef<number | null>(null)
  const installCmd = 'npm install @swufefox/ak-ui-react'

  useEffect(() => () => {
    if (installCopyTimer.current !== null) window.clearTimeout(installCopyTimer.current)
  }, [])

  const copyInstall = useCallback(async () => {
    if (installCopyTimer.current !== null) window.clearTimeout(installCopyTimer.current)
    try {
      await navigator.clipboard.writeText(installCmd)
      playTactileSound('confirm', 0.2)
      setInstallCopyState('copied')
      pushReceipt({ label: t('ref.catalogue.copied'), detail: installCmd.replace(/^npm install /, '') })
    } catch {
      setInstallCopyState('error')
    }
    installCopyTimer.current = window.setTimeout(() => setInstallCopyState('idle'), 2000)
  }, [])

  // 理智计数演示状态
  const [loadingReady, setLoadingReady] = useState(false)
  const [screenOpen, setScreenOpen] = useState(false)
  const screenDialogRef = useShowcaseDialog(screenOpen)
  const [screenCategory, setScreenCategory] = useState<DepotCategory>('all')
  const [screenSearch, setScreenSearch] = useState('')
  const [selectedDepotId, setSelectedDepotId] = useState<string>('mat-d32')
  const [materialStock, setMaterialStock] = useState<Record<string, number>>(() => {
    const stock: Record<string, number> = {}
    DEPOT_ITEMS.forEach((item) => {
      if (item.kind === 'material') {
        stock[item.id] = item.initialCount
      }
    })
    return stock
  })
  const { screenNotice, screenNoticeExpiresAt, showScreenNotice } = useCommandNotice()
  const filteredDepotItems = useMemo(() => filterDepotItems(screenCategory, screenSearch), [screenCategory, screenSearch])

  const selectedDepotItem = filteredDepotItems.find((item) => item.id === selectedDepotId) ?? filteredDepotItems[0]
  const mobileMenuRef = useRef<AkMobileMenuHandle>(null)
  const [sanCurrent, setSanCurrent] = useState(41)
  const sanLimit = 135
  const [sanTotal] = useState(135)

  /** Initialize the active category from a shareable deep link. */
  const [active, setActive] = useState<string>(() => {
    if (typeof window === 'undefined') return CATEGORIES[0].id
    const hash = window.location.hash.replace(/^#/, '')
    return CATEGORIES.some((c) => c.id === hash) ? hash : CATEGORIES[0].id
  })
  const activeIndex = Math.max(0, CATEGORIES.findIndex((c) => c.id === active))
  const prevCategory = activeIndex > 0 ? CATEGORIES[activeIndex - 1] : undefined
  const nextCategory = activeIndex < CATEGORIES.length - 1 ? CATEGORIES[activeIndex + 1] : undefined
  // 分类切换的方向感：新块从来路方向滑入，而不是每次都往上冒一次。
  const previousIndex = useRef(activeIndex)
  /** Name the open category in the tab and in shared links; the hash alone does not say what it holds. */
  useEffect(() => {
    const category = CATEGORIES[activeIndex]
    if (category) document.title = `${t(category.title)} · ak-ui`
  }, [activeIndex, t])
  const stageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  // 方向写进舞台的自定义属性：CSS 用它决定新块从哪边滑入。
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--demo-stage-dir', activeIndex >= previousIndex.current ? '1' : '-1')
    previousIndex.current = activeIndex
  }, [activeIndex])
  const focusDestination = useRef<string | null>(null)
  const [focusRequest, setFocusRequest] = useState(0)
  useLayoutEffect(() => {
    if (focusDestination.current !== active) return
    focusDestination.current = null
    stageRef.current?.querySelector<HTMLElement>(`#${active}-title`)?.focus({ preventScroll: true })
  }, [active, focusRequest])
  const entranceRef = useRef<AkEntranceHandle>(null)
  const overrideRegistry = useRef<Record<string, Record<string, unknown>>>({})
  const stageValue = useMemo(() => ({ active, overrides: overrideRegistry }), [active])
  const [shellCurrent, setShellCurrent] = useState('shell-command')
  useEffect(() => {
    if (active !== 'components-10') setShellCurrent('shell-command')
  }, [active])

  /** Switch category, recording navigation so browser back and forward work. */
  const selectCategory = useCallback((id: string, focus = false) => {
    if (focus && id !== active) {
      focusDestination.current = id
      setFocusRequest((request) => request + 1)
    }
    setActive(id)
    const url = `${window.location.pathname}${window.location.search}#${id}`
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', url)
    // 滚动回分类顶部；跳转期间顶栏保持收起，否则短页面上首屏读数条会
    // 停在顶栏下面，或者顶栏盖住新分类的标题。
    navGuardUntil.current = performance.now() + 900
    topbarRef.current?.setAttribute('data-hidden', '')
    document.documentElement.dataset.chrome = 'hidden'
    stageRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [active])

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
      if (CATEGORIES.some((c) => c.id === hash) || !hash) {
        setActive(hash || CATEGORIES[0].id)
        navGuardUntil.current = performance.now() + 900
        topbarRef.current?.setAttribute('data-hidden', '')
        document.documentElement.dataset.chrome = 'hidden'
        stageRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const items = useMemo<GalleryItem[]>(() => galleryItems(t), [t])
  const actionCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderActions({ t, buttonHit, buttonHits, hitButton }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(1, locale, overrides, { buttonHit, buttonHits }),
  }), [t, locale, buttonHit, buttonHits, hitButton])
  const menuCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderMenus({ t, selectedCommand, setSelectedCommand, count, setCount }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(2, locale, overrides, { selectedCommand, count }),
  }), [t, locale, selectedCommand, setSelectedCommand, count, setCount])
  const surfaceCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderSurfaces({ t, groupPick, setGroupPick, cardDialog, setCardDialog }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(3, locale, overrides, { groupPick, cardDialog }),
  }), [t, locale, groupPick, setGroupPick, cardDialog, setCardDialog])
  const feedbackCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderFeedback({ t }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(4, locale, overrides, {}),
  }), [t, locale])
  const inputCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderInputs({ t, slider, setSlider, segment, setSegment }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(5, locale, overrides, { slider, segment }),
  }), [t, locale, slider, setSlider, segment, setSegment])
  const navigationCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderNavigation({ t, tab, setTab }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(6, locale, overrides, { tab }),
  }), [t, locale, tab, setTab])
  const effectCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderEffects({ t, count, setCount, entranceRef }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(7, locale, overrides, { count }),
  }), [t, locale, count, setCount, entranceRef])
  const galleryCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderGallery({ t, galleryIndex, setGalleryIndex, items }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(8, locale, overrides, { galleryIndex, items }),
  }), [t, locale, galleryIndex, setGalleryIndex, items])
  const siteExample = useCallback<ExampleFactory>(
    (tune) => renderSite({ t, mobileMenuRef, selectCategory }, tune),
    [t, mobileMenuRef, selectCategory],
  )
  const siteExporter = useCallback((overrides: Record<string, unknown>) => exportSite(
    locale,
    overrides,
    { ...overrideRegistry.current },
    { buttonHit, buttonHits, count, selectedCommand, selectedSlot, selectedItem, screenOpen, screenCategory, screenSearch, selectedDepotId, materialStock, screenNotice, screenNoticeExpiresAt, sanCurrent, sanTotal, sanLimit, loadingReady, dialogOpen },
  ), [locale, overrideRegistry, buttonHit, buttonHits, count, selectedCommand, selectedSlot, selectedItem, screenOpen, screenCategory, screenSearch, selectedDepotId, materialStock, screenNotice, screenNoticeExpiresAt, sanCurrent, sanTotal, sanLimit, loadingReady, dialogOpen])
  const shellCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderShell({ t, current: shellCurrent, setCurrent: setShellCurrent }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportShell({ t, current: shellCurrent, setCurrent: setShellCurrent }, overrides),
  }), [t, shellCurrent, setShellCurrent])
  const decorCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderDecor({ t }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(11, locale, overrides, { shellOverrides: overrideRegistry.current['components-10'] ?? {} }),
  }), [t, locale, overrideRegistry])
  const gameDataCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderGameData({ t, skillLevel, setSkillLevel }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(12, locale, overrides, { skillLevel }),
  }), [t, locale, skillLevel, setSkillLevel])
  const operatorCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderOperators({ t, phase: operatorPhase, setPhase: setOperatorPhase }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(18, locale, overrides, { operatorPhase }),
  }), [t, locale, operatorPhase, setOperatorPhase])
  const skillCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderSkills({ t }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(19, locale, overrides, {}),
  }), [t, locale])
  const panelCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderPanels({ t, panelOpen, setPanelOpen }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(20, locale, overrides, { panelOpen }),
  }), [t, locale, panelOpen, setPanelOpen])
  const controlCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderControls({ t, groupPick, setGroupPick, pageIndex, setPageIndex }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(13, locale, overrides, { groupPick, pageIndex }),
  }), [t, locale, groupPick, setGroupPick, pageIndex, setPageIndex])
  const formCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderForms({ t, fieldName, setFieldName, selectPick, setSelectPick, noteText, setNoteText, choiceA, setChoiceA, choiceB, setChoiceB }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(14, locale, overrides, { fieldName, selectPick, noteText, choiceA, choiceB }),
  }), [t, locale, fieldName, setFieldName, selectPick, setSelectPick, noteText, setNoteText, choiceA, setChoiceA, choiceB, setChoiceB])
  const readoutCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderReadouts({ t, sanCurrent, setSanCurrent, sanTotal, sanLimit, loadingReady, setLoadingReady, dialogOpen, setDialogOpen }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(15, locale, overrides, { sanCurrent, sanTotal, sanLimit, loadingReady, dialogOpen }),
  }), [t, locale, sanCurrent, setSanCurrent, sanTotal, sanLimit, loadingReady, setLoadingReady, dialogOpen, setDialogOpen])
  const collectionCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderCollections({ t, selectedTableRow, setSelectedTableRow, tableStriped, setTableStriped, tableTactical, setTableTactical, tableSticky, setTableSticky, tableSortKey, tableSortDir, handleTableSort, tableData }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCategory(16, locale, overrides, { selectedTableRow, tableStriped, tableTactical, tableSticky, tableSortKey, tableSortDir }),
  }), [t, locale, selectedTableRow, setSelectedTableRow, tableStriped, setTableStriped, tableTactical, setTableTactical, tableSticky, setTableSticky, tableSortKey, tableSortDir, handleTableSort, tableData])
  const commandCallbacks = useMemo(() => ({
    example: (tune: Tune) => renderCommand({ t, selectedCommand, setSelectedCommand, selectedSlot, setSelectedSlot, selectedItem, setSelectedItem, screenOpen, setScreenOpen, screenDialogRef, screenCategory, setScreenCategory, screenSearch, setScreenSearch, selectedDepotItem, setSelectedDepotId, filteredDepotItems, materialStock, setMaterialStock, screenNotice, showScreenNotice, sanCurrent, setSanCurrent, sanTotal, sanLimit, showcaseDialogStyle }, tune),
    exportCode: (overrides: Record<string, unknown>) => exportCommand({ selectedCommand, selectedSlot, selectedItem, screenOpen, screenCategory, screenSearch, selectedDepotId, materialStock, screenNotice, screenNoticeExpiresAt, sanCurrent, sanTotal, sanLimit }, overrides, locale),
  }), [t, locale, selectedCommand, setSelectedCommand, selectedSlot, setSelectedSlot, selectedItem, setSelectedItem, screenOpen, setScreenOpen, screenDialogRef, screenCategory, setScreenCategory, screenSearch, setScreenSearch, selectedDepotItem, setSelectedDepotId, filteredDepotItems, materialStock, setMaterialStock, screenNotice, showScreenNotice, screenNoticeExpiresAt, sanCurrent, setSanCurrent, sanTotal, sanLimit, showcaseDialogStyle])


  return (
    <main id="demo-main" className="demo-main" tabIndex={-1}>
      <header className="demo-hero" ref={heroRef}>
        <div className="demo-hero__intro">
          <p className="demo-hero__kicker">
            <span>RHODES ISLAND</span>
            <span aria-hidden="true">//</span>
            <span>COMPONENT SYSTEM</span>
            <span className="demo-hero__kicker-build" translate="no">BUILD {packageVersion}</span>
          </p>
          <h1 className="demo-hero__title">{t('ref.catalogue.title')}</h1>
          <p className="demo-hero__desc">{t('ref.catalogue.description')}</p>
          <button type="button" className="demo-hero__install-box" onClick={copyInstall} aria-label={t('ref.catalogue.copyInstall')}>
            <span className="demo-hero__install-prefix" aria-hidden="true">$</span>
            <code className="demo-hero__install-code" translate="no">{installCmd}</code>
            <span className="demo-hero__install-btn" aria-live="polite">
              {t(installCopyState === 'copied' ? 'ref.catalogue.copied' : installCopyState === 'error' ? 'ref.catalogue.copyError' : 'ref.catalogue.copy')}
            </span>
          </button>
        </div>
        {/* 测绘阵列：网格、三层装甲板与核心。纯静态几何，不再跟随指针。 */}
        <div className="demo-hero__array" aria-hidden="true">
          <span className="demo-hero__array-ghost" translate="no">{String(CATEGORIES.length).padStart(2, '0')}</span>
          <div className="demo-hero__array-frame">
            <span className="demo-hero__array-grid" />
            <span className="demo-hero__array-plate demo-hero__array-plate--far" />
            <span className="demo-hero__array-plate demo-hero__array-plate--mid" />
            <span className="demo-hero__array-plate demo-hero__array-plate--near" />
            <span className="demo-hero__array-core">PRTS</span>
            <span className="demo-hero__array-sweep" />
          </div>
          <span className="demo-hero__array-caption">
            <span>SURVEY ARRAY</span>
            <span className="demo-hero__array-state">LIVE</span>
            <span>SECTOR 07</span>
          </span>
        </div>
        {/* 读数条：把分类数、当前主题、React 版本摆成事实，填掉标题右侧的空档。 */}
        <dl className="demo-hero__readout">
          <div className="demo-hero__stat">
            <dt>{t('ref.catalogue.statCategories')}</dt>
            <dd>{CATEGORIES.length}</dd>
          </div>
          <div className="demo-hero__stat">
            <dt>{t('ref.catalogue.statTheme')}</dt>
            <dd>{t(THEME_LABELS[theme])}</dd>
          </div>
          <div className="demo-hero__stat">
            <dt>{t('ref.catalogue.statReact')}</dt>
            <dd>{REACT_PEER_MAJOR}+</dd>
          </div>
        </dl>
      </header>

      <StageProgress target={stageRef} />

      <div className="demo-catalogue">
        <CatalogueRail active={active} selectCategory={selectCategory} />

        <div className="demo-stage" ref={stageRef}>
          <StageContext.Provider value={stageValue}>
            <Block
              id="components-1"
              eyebrow={t('ref.actions.eyebrow')}
              title={t('ref.actions.title')}
              note={t('ref.actions.note')}
              api={DOC_REGISTRY['components-1']?.api}
              example={actionCallbacks.example}
              exportCode={actionCallbacks.exportCode}
            />
            <Block id="components-2" eyebrow={t('ref.menu.eyebrow')} title={t('ref.menu.title')} note={t('ref.menu.note')} api={DOC_REGISTRY['components-2']?.api} example={menuCallbacks.example} exportCode={menuCallbacks.exportCode} />
            <Block id="components-3" eyebrow={t('ref.surfaces.eyebrow')} title={t('ref.surfaces.title')} note={t('ref.surfaces.note')} api={DOC_REGISTRY['components-3']?.api} example={surfaceCallbacks.example} exportCode={surfaceCallbacks.exportCode} />
            <Block id="components-4" eyebrow={t('ref.feedback.eyebrow')} title={t('ref.feedback.title')} note={t('ref.feedback.note')} api={DOC_REGISTRY['components-4']?.api} example={feedbackCallbacks.example} exportCode={feedbackCallbacks.exportCode} />
            <Block id="components-5" eyebrow={t('ref.inputs.eyebrow')} title={t('ref.inputs.title')} note={t('ref.inputs.note')} api={DOC_REGISTRY['components-5']?.api} example={inputCallbacks.example} exportCode={inputCallbacks.exportCode} />
            <Block id="components-6" eyebrow={t('ref.navigation.eyebrow')} title={t('ref.navigation.title')} note={t('ref.navigation.note')} api={DOC_REGISTRY['components-6']?.api} example={navigationCallbacks.example} exportCode={navigationCallbacks.exportCode} />
            <Block id="components-7" eyebrow={t('ref.effects.eyebrow')} title={t('ref.effects.title')} note={t('ref.effects.note')} api={DOC_REGISTRY['components-7']?.api} example={effectCallbacks.example} exportCode={effectCallbacks.exportCode} />
            <Block id="components-8" eyebrow={t('ref.gallery.eyebrow')} title={t('ref.gallery.title')} note={t('ref.gallery.note')} api={DOC_REGISTRY['components-8']?.api} example={galleryCallbacks.example} exportCode={galleryCallbacks.exportCode} />
            <Block id="components-9" eyebrow={t('ref.site.eyebrow')} title={t('ref.site.title')} note={t('ref.site.note')} api={DOC_REGISTRY['components-9']?.api} example={siteExample} exportCode={siteExporter} />
            <Block
              id="components-10"
              eyebrow={t('ref.shell.eyebrow')}
              title={t('ref.shell.title')}
              note={t('ref.shell.note')}
              api={DOC_REGISTRY['components-10']?.api}
              example={shellCallbacks.example}
              exportCode={shellCallbacks.exportCode}
            />
            <Block id="components-11" eyebrow={t('ref.decor.eyebrow')} title={t('ref.decor.title')} note={t('ref.decor.note')} api={DOC_REGISTRY['components-11']?.api} example={decorCallbacks.example} exportCode={decorCallbacks.exportCode} />
            <Block id="components-12" eyebrow={t('ref.arknights.eyebrow')} title={t('ref.arknights.title')} note={t('ref.arknights.note')} api={DOC_REGISTRY['components-12']?.api} example={gameDataCallbacks.example} exportCode={gameDataCallbacks.exportCode} />
            <Block id="components-13" eyebrow={t('ref.controls.eyebrow')} title={t('ref.controls.title')} note={t('ref.controls.note')} api={DOC_REGISTRY['components-13']?.api} example={controlCallbacks.example} exportCode={controlCallbacks.exportCode} />
            <Block id="components-14" eyebrow={t('ref.form.eyebrow')} title={t('ref.form.title')} note={t('ref.form.note')} api={DOC_REGISTRY['components-14']?.api} example={formCallbacks.example} exportCode={formCallbacks.exportCode} />
            <Block id="components-15" eyebrow={t('ref.data.eyebrow')} title={t('ref.data.title')} note={t('ref.data.note')} api={DOC_REGISTRY['components-15']?.api} example={readoutCallbacks.example} exportCode={readoutCallbacks.exportCode} />
            <Block id="components-16" eyebrow={t('ref.collection.eyebrow')} title={t('ref.collection.title')} note={t('ref.collection.note')} api={DOC_REGISTRY['components-16']?.api} example={collectionCallbacks.example} exportCode={collectionCallbacks.exportCode} />
            <Block id="components-17" eyebrow={t('ref.command.eyebrow')} title={t('ref.command.title')} note={t('ref.command.note')} api={DOC_REGISTRY['components-17']?.api} example={commandCallbacks.example} exportCode={commandCallbacks.exportCode} />
            <Block id="components-18" eyebrow={t('ref.operators.eyebrow')} title={t('ref.operators.title')} note={t('ref.operators.note')} example={operatorCallbacks.example} exportCode={operatorCallbacks.exportCode} />
            <Block id="components-19" eyebrow={t('ref.skills.eyebrow')} title={t('ref.skills.title')} note={t('ref.skills.note')} example={skillCallbacks.example} exportCode={skillCallbacks.exportCode} />
            <Block id="components-20" eyebrow={t('ref.panels.eyebrow')} title={t('ref.panels.title')} note={t('ref.panels.note')} example={panelCallbacks.example} exportCode={panelCallbacks.exportCode} />
          </StageContext.Provider>

          <div className="demo-stage__foot">
            <p className="demo-stage__index">
              <span className="demo-stage__index-num">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span aria-hidden="true">/</span>
              <span>{CATEGORIES.length}</span>
              <span className="demo-stage__index-title">{t(CATEGORIES[activeIndex]!.title)}</span>
            </p>
            <div className="demo-row">
              <button
                type="button"
                className="demo-stage__page"
                disabled={!prevCategory}
                aria-label={prevCategory ? `${t('ref.catalogue.previous')}: ${t(prevCategory.title)}` : t('ref.catalogue.previous')}
                onClick={() => {
                  playTactileSound('tab', 0.16)
                  step(-1)
                }}
              >
                {prevCategory ? t('ref.catalogue.prevNamed', { name: t(prevCategory.title) }) : '‹'}
              </button>
              <button
                type="button"
                className="demo-stage__page"
                disabled={!nextCategory}
                aria-label={nextCategory ? `${t('ref.catalogue.next')}: ${t(nextCategory.title)}` : t('ref.catalogue.next')}
                onClick={() => {
                  playTactileSound('tab', 0.16)
                  step(1)
                }}
              >
                {nextCategory ? t('ref.catalogue.nextNamed', { name: t(nextCategory.title) }) : '›'}
              </button>
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
  const { enabled: soundEnabled, toggle: toggleSound } = useTactileSound()
  const [theme, setTheme] = useState<Theme>('terminal')
  const [density, setDensity] = useState<'compact' | 'cozy' | 'spacious'>('cozy')
  const [llmModalOpen, setLlmModalOpen] = useState(false)
  const [booting, setBooting] = useState(true)
  // 指南是叠在目录之上的文档层：目录保持挂载，示例状态与调参结果都不会丢。
  const [guideOpen, setGuideOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#guide')
  const guideDialogRef = useShowcaseDialog(guideOpen)
  const lastHash = useRef('#components-1')
  const [llmCopyState, setLlmCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const llmDialogRef = useShowcaseDialog(llmModalOpen)
  const topbarRef = useRef<HTMLElement>(null)
  // 分类跳转后的短暂窗口内不允许顶栏回弹：否则向上跳转时顶栏会盖住分类标题。
  const navGuardUntil = useRef(0)
  const llmCopyTimer = useRef<number | null>(null)
  const llmCopyGeneration = useRef(0)
  const settingsRef = useRef<HTMLDetailsElement>(null)

  /**
   * `<details>` only closes by clicking its summary. A settings panel that floats over the
   * page also needs Escape and light dismiss, the way a popover behaves.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const details = settingsRef.current
      if (!details?.open || event.key !== 'Escape') return
      details.open = false
      details.querySelector('summary')?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      const details = settingsRef.current
      if (!details?.open || details.contains(event.target as Node)) return
      details.open = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.akTheme = theme
    // Keep the mobile browser chrome in step with the canvas instead of flashing a stale color.
    // 读令牌而不是写死两套十六进制：新增主题时这一行不用跟着改。
    const meta = document.querySelector('meta[name="theme-color"]')
    const canvas = getComputedStyle(document.documentElement).getPropertyValue('--ak-surface-canvas').trim()
    if (meta && canvas) meta.setAttribute('content', canvas)
  }, [theme])

  // 密度挂在 <html> 上，于是整个示例站点（包括每个演示块里的组件）
  // 都跟着这份档位走 —— 这正是 data-ak-density 的设计用途：子树级联。
  useEffect(() => {
    document.documentElement.dataset.akDensity = density
  }, [density])

  useEffect(() => () => {
    llmCopyGeneration.current += 1
    if (llmCopyTimer.current !== null) window.clearTimeout(llmCopyTimer.current)
  }, [])

  // 顶栏随滚动方向收起：向下滚动把阅读空间让出来，向上滚动立刻回来。
  // 直接改 DOM 属性而不用 React 状态：一次状态更新会把 17 个示例树全部重渲染。
  useEffect(() => {
    const topbar = topbarRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const now = window.scrollY
      const delta = now - last
      last = now
      if (Math.abs(delta) < 4) return
      if (performance.now() < navGuardUntil.current) return
      if (settingsRef.current?.open) return
      // 降级动效时顶栏常驻：位移本身就是要被关掉的那类运动。
      if (reduceMotion.matches) return
      const next = delta > 0 && now > 120
      // 翻转基准读 DOM 而不是闭包标志：分类跳转会直接写 data-hidden，
      // 以 DOM 为准才不会出现「向上滚动顶栏不回来」的失同步。
      const isHidden = topbar?.hasAttribute('data-hidden') ?? false
      if (next === isHidden) return
      if (next) {
        topbar?.setAttribute('data-hidden', '')
        document.documentElement.dataset.chrome = 'hidden'
      } else {
        topbar?.removeAttribute('data-hidden')
        document.documentElement.dataset.chrome = 'shown'
      }
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const openGuide = useCallback(() => {
    lastHash.current = window.location.hash || '#components-1'
    window.history.pushState(null, '', '#guide')
    setGuideOpen(true)
  }, [])
  const closeGuide = useCallback(() => {
    setGuideOpen(false)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${lastHash.current}`)
  }, [])
  // 浏览器后退把 hash 带走时，指南要跟着收起。
  useEffect(() => {
    const onPop = () => { if (window.location.hash !== '#guide') setGuideOpen(false) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const closeLlmModal = () => {
    llmCopyGeneration.current += 1
    if (llmCopyTimer.current !== null) window.clearTimeout(llmCopyTimer.current)
    setLlmCopyState('idle')
    setLlmModalOpen(false)
  }

  const copyLlmText = async () => {
    const generation = ++llmCopyGeneration.current
    if (llmCopyTimer.current !== null) window.clearTimeout(llmCopyTimer.current)
    try {
      await navigator.clipboard.writeText(llmsRawText)
      if (generation !== llmCopyGeneration.current) return
      setLlmCopyState('copied')
      pushReceipt({ label: t('app.llm.copied'), detail: formatBytes(llmsRawText.length) })
      llmCopyTimer.current = window.setTimeout(() => setLlmCopyState('idle'), 2000)
    } catch {
      if (generation === llmCopyGeneration.current) setLlmCopyState('error')
    }
  }

  return (
    <div className="demo-app">
      {booting ? <BootSequence lines={BOOT_LINES} onDone={() => setBooting(false)} /> : null}
      <HudReticle />
      <Receipts />
      <a className="demo-skip-link" href="#demo-main">{t('app.skip')}</a>
      <header className="demo-topbar" ref={topbarRef}>
        <div className="demo-topbar__brand">
          <AkDisplay translate="no">{t('app.name')}</AkDisplay>
          <span className="demo-topbar__tagline">{t('app.tagline')}</span>
          <span className="demo-topbar__version" translate="no">v{packageVersion}</span>
        </div>

        <SystemStatus />

        {/* 顶栏操作控件 */}
        <div className="demo-topbar__controls">
          <button type="button" className="demo-topbar__link" onClick={(event) => {
            playTactileSound('click', 0.16)
            event.currentTarget.focus()
            openGuide()
          }}>
            {t('app.guide')}
          </button>
          <button type="button" className="demo-topbar__link" translate="no" onClick={(event) => {
            playTactileSound('click', 0.16)
            event.currentTarget.focus()
            setLlmModalOpen(true)
          }}>
            llms.txt
          </button>

          <AkSegmented
            size="sm"
            className="demo-topbar__language"
            ariaLabel={t('app.lang.label')}
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'EN', value: 'en' },
            ]}
            value={locale}
            onValueChange={(v) => setLocale(v as 'zh-CN' | 'en')}
          />

          <details className="demo-settings" ref={settingsRef}>
            <summary>{t('app.settings.label')}</summary>
            <div className="demo-settings__panel">
              <div className="demo-settings__group">
                <span>{t('app.theme.label')}</span>
                <AkSegmented
                  size="sm"
                  ariaLabel={t('app.theme.label')}
                  options={THEMES.map((value) => ({ label: t(THEME_LABELS[value]), value }))}
                  value={theme}
                  onValueChange={(v) => setTheme(v as Theme)}
                />
              </div>
              <div className="demo-settings__group">
                <span>{t('app.density.label')}</span>
                <AkSegmented
                  size="sm"
                  ariaLabel={t('app.density.label')}
                  options={[
                    { label: t('app.density.compact'), value: 'compact' },
                    { label: t('app.density.cozy'), value: 'cozy' },
                    { label: t('app.density.spacious'), value: 'spacious' },
                  ]}
                  value={density}
                  onValueChange={(v) => setDensity(v as 'compact' | 'cozy' | 'spacious')}
                />
              </div>
              <button type="button" className="demo-settings__sound" onClick={toggleSound} aria-label={t('app.sound.label')} aria-pressed={soundEnabled}>
                {soundEnabled ? t('app.sound.on') : t('app.sound.off')}
              </button>
            </div>
          </details>

          <a className="demo-topbar__link" href="https://github.com/swufefox/ak-ui-react" target="_blank" rel="noreferrer" onClick={() => playTactileSound('click', 0.16)}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <ReferenceView theme={theme} topbarRef={topbarRef} navGuardUntil={navGuardUntil} />

      {guideOpen ? (
        <dialog
          className="demo-guide-dialog"
          ref={guideDialogRef}
          aria-label={t('app.guide')}
          onCancel={(event) => { event.preventDefault(); closeGuide() }}
          style={showcaseDialogStyle}
        >
          <div className="demo-guide-overlay" onClick={closeGuide}>
            <div className="demo-guide-panel" onClick={(event) => event.stopPropagation()}>
              <GuideView onBack={closeGuide} />
            </div>
          </div>
        </dialog>
      ) : null}

      {llmModalOpen ? (
        <dialog className="demo-llm-dialog" ref={llmDialogRef} aria-labelledby="demo-llm-title" onCancel={(event) => { event.preventDefault(); closeLlmModal() }} style={showcaseDialogStyle} onClick={(event) => { if (event.target === event.currentTarget) closeLlmModal() }}>
        <div className="demo-llm-overlay" onClick={closeLlmModal}>
          <div className="demo-llm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="demo-llm-modal__head">
              <div className="demo-llm-modal__title">
                <span className="demo-spec-dot" aria-hidden="true">◆</span>
                <span id="demo-llm-title">{t('app.llm.title')}</span>
              </div>
              <div className="demo-llm-modal__actions">
                <button
                  type="button"
                  className="demo-copy-btn"
                  onClick={copyLlmText}
                >
                  {t(llmCopyState === 'copied' ? 'app.llm.copied' : 'app.llm.copy')}
                </button>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="demo-raw-link"
                >
                  {t('app.llm.raw')} ↗
                </a>
                <button
                  type="button"
                  className="demo-copy-btn"
                  onClick={closeLlmModal}
                >
                  {t('app.llm.close')} ⎋
                </button>
              </div>
            </div>
            <div className="demo-llm-modal__feedback" aria-live="polite">{llmCopyState === 'error' ? t('app.llm.error') : llmCopyState === 'copied' ? t('app.llm.copied') : ''}</div>
            <pre className="demo-llm-modal__body">
              <code>{llmsRawText}</code>
            </pre>
          </div>
        </div>
        </dialog>
      ) : null}
    </div>
  )
}
