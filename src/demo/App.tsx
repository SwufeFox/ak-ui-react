import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { version as packageVersion } from '../../package.json'
import { AkButton, AkChoice, AkDisplay, AkFieldLabel, AkInput, AkSelect, AkSegmented, useTactileSound, playTactileSound } from '../ak'
import type { AkEntranceHandle, AkSkillLevel, GalleryItem } from '../ak'
import { galleryItems } from './gallery-art'
import { useI18n, type Locale, type MessageKey } from './i18n'
import { DOC_REGISTRY, type BlockPropDoc } from './doc-data'
import llmsRawText from '../../llms.txt?raw'
import type { AkMobileMenuHandle } from '../ak/ui/site/AkMobileMenu'
import { createTuneSession, type ExampleFactory, type Tune, type TuneOverrides } from './example-tune'
import type { CommandSnapshot } from './examples/command-export'
import type { exportCategory as GenerateCategory } from './example-manifest'
import type { exportShell as GenerateShell } from './example-source'
import type { exportSite as GenerateSite } from './example-site-export'
import { renderActions } from './examples/actions'
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
import { renderControls } from './examples/controls'
import { renderForms } from './examples/forms'
import { renderReadouts } from './examples/readouts'
import { renderCollections, sortTableRows, nextTableSort } from './examples/collections'
import { DEPOT_ITEMS, filterDepotItems, renderCommand, showcaseDialogStyle, useCommandNotice, useShowcaseDialog, type DepotCategory } from './examples/command'
import { tokenizeTsx } from './highlight'
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

const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  'components-1': ['button', 'actions', 'chamfer', 'subtitle', 'danger', 'ghost', 'group', '按钮', '动作'],
  'components-2': ['menu', 'menubar', 'dropdown', 'toolbar', 'contextmenu', 'collapsible', '菜单', '工具栏', '折叠'],
  'components-3': ['card', 'glass', 'chassis', 'tactical', 'outline', 'stripe', 'place', 'surface', '卡片', '毛玻璃', '机匣', '面板'],
  'components-4': ['notice', 'alert', 'progress', 'gauge', 'laser', '通知', '公告', '进度条', '仪表盘'],
  'components-5': ['slider', 'inputnumber', 'segmented', 'step', '滑动条', '步进器', '分段器'],
  'components-6': ['tabs', 'navigation', 'breadcrumb', 'segmented', '标签页', '导航', '面包屑'],
  'components-7': ['effects', 'countup', 'depth', 'entrance', 'glow', 'skew', 'outline', '特效', '数字滚动', '景深', '入场'],
  'components-8': ['gallery', 'album', 'polaroid', 'media', '画廊', '相册', '拍立得'],
  'components-9': ['loader', 'assetloader', 'loading', '资源加载', '预加载'],
  'components-10': ['site', 'shell', 'sectionnavigator', 'mobilemenu', 'particlefield', '粒子', '整页导航', '移动端菜单'],
  'components-11': ['decor', 'laser', 'reticle', 'stripes', 'halftone', 'corner', 'cut', 'barcode', 'watermark', 'bilingual', '装饰', '准星', '斜纹', '网点', '切角', '条形码'],
  'components-12': ['arknights', 'rarity', 'profession', 'elite', 'potential', 'skilllevels', 'attrs', 'trust', '游戏数据', '稀有度', '职业', '精二', '潜能', '专精'],
  'components-13': ['popover', 'tooltip', 'dialog', 'modal', '浮层', '气泡', '提示', '对话框', '弹窗'],
  'components-14': ['form', 'input', 'field', 'textarea', 'select', 'choice', 'checkbox', 'switch', '表单', '输入框', '选择器', '开关'],
  'components-15': ['data', 'san', 'sanity', 'counter', 'level', 'skeleton', 'spinner', '理智', '计数器', '关卡', '骨架屏', '加载中'],
  'components-16': ['collection', 'table', 'avatar', 'thumbnail', 'scrollarea', 'newslist', '表格', '头像', '缩略图', '滚动区', '快讯'],
  'components-17': ['command', 'screen', 'item', 'slot', '大屏', '指令牌', '材料方块', '槽位'],
}

// Component names are indexed by their primary example, so searches lead to useful results.
const CATEGORY_COMPONENTS: Record<(typeof CATEGORIES)[number]['id'], readonly string[]> = {
  'components-1': ['AkButton'],
  'components-2': ['AkDropdownMenu', 'AkContextMenu', 'AkMenubar', 'AkToolbar', 'AkCollapsible', 'AkMenuGroup', 'AkMenuSeparator'],
  'components-3': ['AkCard', 'AkCardHeader', 'AkCardTitle', 'AkCardDescription', 'AkCardContent', 'AkCardFooter'],
  'components-4': ['AkNotice', 'AkNoticeStack', 'AkStatus', 'AkProgress', 'AkProgressStack', 'AkGauge'],
  'components-5': ['AkSlider', 'AkInputNumber', 'AkSegmented'],
  'components-6': ['AkTabs'],
  'components-7': ['AkCountUp', 'AkEntrance', 'AkDepth', 'AkDepthLayer', 'AkParticleField'],
  'components-8': ['AkMediaGallery', 'AkMediaAlbum'],
  'components-9': ['AkAssetLoader', 'AkMobileMenu'],
  'components-10': ['AkSectionNavigator'],
  'components-11': ['AkStripes', 'AkGridBackdrop', 'AkCorner', 'AkBrackets', 'AkReticle', 'AkBarcode', 'AkHalftone', 'AkGlyphBox', 'AkGlyph', 'AkMotion', 'AkInverse', 'AkLaser', 'AkStripeEdge', 'AkCut', 'AkCodeId', 'AkBlueBand', 'AkChevrons', 'AkDisplay', 'AkWatermark', 'AkGlow', 'AkOutline', 'AkSkew', 'AkVignette', 'AkGrain', 'AkMosaic', 'AkBackdrop', 'AkOverline', 'AkNum', 'AkEn', 'AkBilingual'],
  'components-12': ['AkRarity', 'AkRarityChip', 'AkRarityBar', 'AkRarityScope', 'AkProfession', 'AkProfessionLabel', 'AkElite', 'AkPotential', 'AkSpec', 'AkTrust', 'AkSkillLevels', 'AkPotList', 'AkPot', 'AkAttrs', 'AkAttr', 'AkKv', 'AkKvItem'],
  'components-13': ['AkDivider', 'AkButtonGroup', 'AkPopover', 'AkTag', 'AkTagGroup', 'AkStatusGroup', 'AkPagination'],
  'components-14': ['AkFormStack', 'AkField', 'AkFieldLabel', 'AkInput', 'AkSelect', 'AkTextarea', 'AkChoice'],
  'components-15': ['AkCounter', 'AkLevel', 'AkSpinner', 'AkSan', 'AkSanContainer', 'AkSkeleton', 'AkLoadingScreen', 'AkDialog'],
  'components-16': ['AkBreadcrumb', 'AkTable', 'AkAvatar', 'AkAvatarGroup', 'AkThumbnail', 'AkScrollArea', 'AkNewsList'],
  'components-17': ['AkCommandGrid', 'AkCommand', 'AkCommandGroup', 'AkSlot', 'AkItem', 'AkScreen'],
}

/** 舞台上下文：当前激活的分类 id。 */
const StageContext = createContext<{ active: string; overrides: { current: Record<string, Record<string, unknown>> } } | null>(null)



/** Keep incomplete numeric input (such as `1.`) intact until blur, with keyboard ArrowUp/ArrowDown stepping support. */
function TuneNumberField({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null)
  return <AkInput
    size="sm"
    inputMode="decimal"
    value={draft ?? String(value)}
    onFocus={() => setDraft(String(value))}
    onChange={(event) => {
      const text = event.target.value
      setDraft(text)
      if (text.trim() && Number.isFinite(Number(text))) onChange(Number(text))
    }}
    onKeyDown={(event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const delta = event.shiftKey ? 10 : 1
        const next = Number((value + delta).toFixed(4))
        onChange(next)
        setDraft(String(next))
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        const delta = event.shiftKey ? 10 : 1
        const next = Number((value - delta).toFixed(4))
        onChange(next)
        setDraft(String(next))
      }
    }}
    onBlur={() => setDraft(null)}
  />
}

/** 组件分类面板容器。 */
function Block({
  id,
  eyebrow,
  title,
  note,
  api,
  example,
  exportCode,
}: {
  id: string
  eyebrow: string
  title: string
  note?: ReactNode
  api?: BlockPropDoc[]
  example: ExampleFactory
  exportCode: (overrides: Record<string, unknown>) => Promise<string>
}) {
  const stage = useContext(StageContext)
  const { t, locale } = useI18n()
  const [tab, setTab] = useState<'preview' | 'code' | 'api' | 'tune'>('preview')
  const [copyResult, setCopyResult] = useState<{ text: string; state: 'copied' | 'error' } | null>(null)
  const copyTimer = useRef<number | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, unknown>>({})
  const [previewExpanded, setPreviewExpanded] = useState(true)
  const [resetVersion, setResetVersion] = useState(0)
  const [codeResult, setCodeResult] = useState<{ status: 'loading' | 'error' } | { status: 'ready'; text: string }>({ status: 'loading' })
  const codeCache = useRef<{ tree: ReactNode; exportCode: typeof exportCode; overrides: typeof overrides; locale: Locale; promise: Promise<string>; text?: string } | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const active = !stage || stage.active === id
  const overrideRegistry = stage?.overrides
  // Drive the sliding underline from the active tab's box; the indicator itself only translates.
  useLayoutEffect(() => {
    const list = tabsRef.current
    const activeTab = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!list || !activeTab) return
    // Fractional layout offsets keep the underline flush with sub-pixel tab edges; add scrollLeft
    // because the tablist itself scrolls horizontally on narrow screens.
    const listRect = list.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()
    list.style.setProperty('--demo-tab-x', `${tabRect.left - listRect.left + list.scrollLeft}px`)
    list.style.setProperty('--demo-tab-w', `${tabRect.width}px`)
    list.dataset.measured = 'true'
  }, [tab, active])
  useLayoutEffect(() => {
    if (!overrideRegistry) return
    overrideRegistry.current[id] = overrides
    return () => { delete overrideRegistry.current[id] }
  }, [id, overrideRegistry, overrides])
  // Keep the inspector's DOM and scroll range intact while other views are visible.
  const session = useMemo(() => {
    if (!active) return null
    const result = createTuneSession(overrides)
    return { tree: example(result.tune), targets: result.targets }
  }, [active, example, overrides])
  const tunables = session?.targets ?? []
  const target = tunables.find((item) => item.id === selected) ?? tunables[0]
  useLayoutEffect(() => {
    if (active && selected !== (target?.id ?? null)) setSelected(target?.id ?? null)
  }, [active, selected, target?.id])
  const actualTree = session?.tree
  const startCode = () => {
    const cached = codeCache.current
    if (cached && cached.tree === actualTree && cached.exportCode === exportCode && cached.overrides === overrides && cached.locale === locale) return cached
    let promise: Promise<string>
    try {
      // Capture the current model and shared overrides at intent time.
      promise = exportCode(overrides)
    } catch (error) {
      promise = Promise.reject(error)
    }
    const entry = { tree: actualTree, exportCode, overrides, locale, promise, text: undefined as string | undefined }
    codeCache.current = entry
    // Intent can be abandoned; handle rejection even if Code is never opened.
    void promise.then((text) => { entry.text = text }, () => {})
    return entry
  }
  useLayoutEffect(() => {
    if (!active || tab !== 'code') return
    const entry = startCode()
    if (entry.text !== undefined) {
      setCodeResult({ status: 'ready', text: entry.text })
      return
    }
    let cancelled = false
    setCodeResult({ status: 'loading' })
    entry.promise.then(
      (text) => { if (!cancelled && codeCache.current === entry) setCodeResult({ status: 'ready', text }) },
      () => {
        if (!cancelled && codeCache.current === entry) {
          codeCache.current = null
          setCodeResult({ status: 'error' })
        }
      },
    )
    return () => { cancelled = true }
  }, [active, tab, actualTree, exportCode, overrides, locale])
  const codeText = codeResult.status === 'ready' ? codeResult.text : ''
  /** Pure and linear; recompute only when the generated source changes. */
  const codeTokens = useMemo(() => tokenizeTsx(codeText), [codeText])
  const cachedCode = codeCache.current
  const codeReady = active && tab === 'code' && codeResult.status === 'ready' && cachedCode?.text === codeResult.text && cachedCode.tree === actualTree && cachedCode.exportCode === exportCode && cachedCode.overrides === overrides && cachedCode.locale === locale
  const targetPrefix = target ? `${target.id}|` : ''
  const modifiedCount = target ? Object.keys(overrides).filter((key) => key.startsWith(targetPrefix)).length : 0
  const hasControlledValue = Boolean(target && ['value', 'checked'].some((key) => key in target.props) && ['onValueChange', 'onChange', 'onInput'].some((key) => typeof target.props[key] === 'function'))
  const editable = target ? [...Object.entries(target.props).filter(([key, value]) => !['key','ref','children','className','style'].includes(key) && !/^on[A-Z]/.test(key) && !(['value','checked'].includes(key) && hasControlledValue) && ['string','number','boolean'].includes(typeof value)), ...(typeof target.props.children === 'string' || typeof target.props.children === 'number' ? [['children', target.props.children] as [string, unknown]] : [])] : []
  const copyState = copyResult?.text === codeText ? copyResult.state : 'idle'
  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
  }, [])

  if (!active) return null

  const index = CATEGORIES.findIndex((category) => category.id === id)
  const displayEyebrow = index === -1 ? eyebrow : `${String(index + 1).padStart(2, '0')} / ${eyebrow}`

  const views = ['preview', 'tune', 'code', ...(api ? ['api' as const] : [])] as const
  const copyCode = async () => {
    if (!codeReady) return
    const text = codeText
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(text)
      playTactileSound('confirm', 0.2)
      setCopyResult({ text, state: 'copied' })
    } catch {
      playTactileSound('warn', 0.2)
      setCopyResult({ text, state: 'error' })
    }
    copyTimer.current = window.setTimeout(() => setCopyResult(null), 2000)
  }

  return (
    <section id={id} className="demo-block" aria-labelledby={`${id}-title`}>
      <div className="demo-block__header">
        <div>
          <span className="demo-eyebrow">{displayEyebrow}</span>
          <h2 id={`${id}-title`} tabIndex={-1}>{title}</h2>
          {note ? <p className="demo-note">{note}</p> : null}
        </div>
          <div className="demo-block__tabs" role="tablist" aria-label={t('common.demoViews')} ref={tabsRef}>
            <span className="demo-doc-tab-indicator" aria-hidden="true" />
            {views.map((view) => (
              <button
                key={view}
                id={`${id}-tab-${view}`}
                type="button"
                role="tab"
                aria-selected={tab === view}
                aria-controls={`${id}-${view === 'preview' || view === 'tune' ? 'workspace' : view}`}
                tabIndex={tab === view ? 0 : -1}
                className={`demo-doc-tab ${tab === view ? 'is-active' : ''}`}
                onPointerEnter={() => { if (view === 'code') startCode() }}
                onFocus={() => { if (view === 'code') startCode() }}
                onClick={() => {
                  playTactileSound('tab', 0.16)
                  setTab(view)
                }}
                onKeyDown={(event) => {
                  let next = views.indexOf(view)
                  if (event.key === 'ArrowRight') next = (next + 1) % views.length
                  else if (event.key === 'ArrowLeft') next = (next - 1 + views.length) % views.length
                  else if (event.key === 'Home') next = 0
                  else if (event.key === 'End') next = views.length - 1
                  else return
                  event.preventDefault()
                  playTactileSound('tab', 0.16)
                  setTab(views[next]!)
                  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
                }}
              >
                {view === 'preview' ? t('common.preview') : view === 'tune' ? t('common.tune') : view === 'code' ? t('common.code') : t('common.apiDocs')}
              </button>
            ))}
          </div>
      </div>

      <div id={`${id}-workspace`} className="demo-tune-workspace" role="tabpanel" aria-labelledby={`${id}-tab-${tab === 'tune' ? 'tune' : 'preview'}`} data-tuning={tab === 'tune'} hidden={tab !== 'preview' && tab !== 'tune'}>
        <div className="demo-tune-preview-shell" data-expanded={previewExpanded}>
          <AkButton type="button" variant="outline" size="sm" className="demo-tune-preview-toggle" hidden={tab !== 'tune'} aria-expanded={previewExpanded} aria-controls={`${id}-preview`} onClick={() => setPreviewExpanded((value) => !value)}>
            {t(previewExpanded ? 'common.tuneHidePreview' : 'common.tuneShowPreview')}
          </AkButton>
          <div id={`${id}-preview`} className="demo-tune-preview">{actualTree}</div>
        </div>
        <div className="demo-tune-panel" hidden={tab !== 'tune'}>
          {tunables.length === 0 ? <p>{t('common.tuneEmpty')}</p> : <>
            <AkFieldLabel className="demo-tune-instance">{t('common.tuneInstance')}
              <AkSelect size="sm" value={target?.id ?? ''} onChange={(event) => setSelected(event.target.value)}>
                {tunables.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </AkSelect>
            </AkFieldLabel>
            <div className="demo-tune-fields" key={`${target?.id ?? 'empty'}-${resetVersion}`}>
              {hasControlledValue && <p className="demo-note">{t('common.tuneControlled')}</p>}
              {editable.length === 0 ? <p>{t('common.tuneEmptyProps')}</p> : editable.map(([prop, value]) => {
                const key = `${targetPrefix}${prop}`
                const current = overrides[key] ?? value
                const change = (next: unknown) => setOverrides((prev) => {
                  const nextOverrides = { ...prev }
                  if (Object.is(next, value)) delete nextOverrides[key]
                  else nextOverrides[key] = next
                  return nextOverrides
                })
                return typeof value === 'boolean'
                  ? <AkChoice key={prop} size="sm" checked={Boolean(current)} onChange={(event) => change(event.target.checked)}>{prop}</AkChoice>
                  : <AkFieldLabel key={prop}>{prop}{prop === 'size' && ['sm', 'md', 'lg'].includes(String(value))
                    ? <AkSelect size="sm" value={String(current)} onChange={(event) => change(event.target.value)}>{['sm', 'md', 'lg'].map((size) => <option key={size}>{size}</option>)}</AkSelect>
                    : typeof value === 'number'
                      ? <TuneNumberField value={Number(current)} onChange={change} />
                      : <AkInput size="sm" value={String(current)} onChange={(event) => change(event.target.value)} />}
                  </AkFieldLabel>
              })}
            </div>
            <div className="demo-tune-actions">
              <AkButton variant="outline" size="sm" sound="confirm" disabled={modifiedCount === 0} onClick={() => {
                setOverrides((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(targetPrefix))))
                setResetVersion((version) => version + 1)
              }}>{t('common.tuneReset')}</AkButton>
              <span className="demo-note" aria-live="polite">{t('common.tuneModified', { n: modifiedCount })}</span>
            </div>
          </>}
        </div>
      </div>
      <div id={`${id}-code`} className="demo-code-container" role="tabpanel" aria-labelledby={`${id}-tab-code`} aria-busy={codeResult.status === 'loading'} hidden={tab !== 'code'}>
        <div className="demo-code-header">
          <span className="demo-code-title">
            <span className="demo-code-dot" />
            JSX / TSX
          </span>
          <AkButton type="button" variant="outline" size="sm" sound={false} onClick={copyCode} disabled={!codeReady} aria-live="polite">{t(copyState === 'copied' ? 'common.codeCopied' : copyState === 'error' ? 'common.codeCopyError' : 'common.copyCode')}</AkButton>
        </div>
        {codeResult.status === 'ready' ? <pre className="demo-code-box" tabIndex={0} aria-label={t('common.code')}><code>{codeTokens.map((token, index) => token.kind === 'plain' ? token.text : <span key={index} className={`tok tok-${token.kind}`}>{token.text}</span>)}</code></pre> : <p className="demo-note" role={codeResult.status === 'error' ? 'alert' : 'status'}>{t(codeResult.status === 'error' ? 'common.codeLoadError' : 'common.codeLoading')}</p>}
      </div>

      {tab === 'api' && api && (
        <div id={`${id}-api`} className="demo-api-container" role="tabpanel" aria-labelledby={`${id}-tab-api`} tabIndex={0}>
          <table className="ak-table ak-table--tactical ak-table--hoverable">
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
                  <td><code className="demo-api-prop">{item.name}</code></td>
                  <td><code className="demo-api-type">{item.type}</code></td>
                  <td><code className="demo-api-default">{item.default ?? '—'}</code></td>
                  <td className="demo-api-desc">{item.desc[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function CatalogueRail({ active, selectCategory }: { active: string; selectCategory: (id: string, focus?: boolean) => void }) {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const categoryListRef = useRef<HTMLDivElement>(null)
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return CATEGORIES
    return CATEGORIES.filter((category, index) => {
      const num = String(index + 1).padStart(2, '0')
      const title = t(category.title).toLowerCase()
      const keywords = CATEGORY_KEYWORDS[category.id] ?? []
      return (
        num.includes(query) ||
        category.id.includes(query) ||
        title.includes(query) ||
        CATEGORY_COMPONENTS[category.id].some((name) => name.toLowerCase().includes(query)) ||
        keywords.some((kw) => kw.toLowerCase().includes(query))
      )
    })
  }, [searchQuery, t])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === '/' && !document.querySelector('dialog[open]') && !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useLayoutEffect(() => {
    const list = categoryListRef.current
    if (!list) return
    // Only the horizontal rail (≤900px) needs the active item scrolled into view. On desktop
    // these geometry reads would force layout of the category block that just mounted.
    const horizontalRail = window.matchMedia('(max-width: 900px)')
    const revealActive = () => {
      if (!horizontalRail.matches) return
      if (list.scrollWidth <= list.clientWidth) return
      const item = list.querySelector<HTMLElement>('[aria-current]')
      if (!item) return
      const rail = list.getBoundingClientRect()
      const selected = item.getBoundingClientRect()
      if (selected.left < rail.left || selected.width > list.clientWidth) {
        list.scrollLeft += selected.left - rail.left
      } else if (selected.right > rail.right) {
        list.scrollLeft += selected.right - rail.right
      }
    }
    // Run after the browser has laid out the new block instead of inside the commit.
    const frame = requestAnimationFrame(revealActive)
    window.addEventListener('resize', revealActive)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', revealActive)
    }
  }, [active, filteredCategories])

  return (
    <nav className="demo-rail" aria-label={t('ref.catalogue.rail')}>
      <div className="demo-rail__head">
        <span className="demo-rail__eyebrow">{t('ref.catalogue.rail')}</span>
        <span className="demo-rail__count" aria-live="polite">{t('ref.catalogue.count', { n: filteredCategories.length })}</span>
      </div>
      <div className="demo-rail__search-box">
        <span className="demo-rail__search-icon" aria-hidden="true">⌕</span>
        <input
          ref={searchInputRef}
          type="text"
          className="demo-rail__search-input"
          aria-label={t('ref.catalogue.search')}
          placeholder={t('ref.catalogue.searchPlaceholder')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return
            if (event.key === 'Escape') setSearchQuery('')
            if (event.key === 'Enter' && filteredCategories.length === 1) {
              event.preventDefault()
              selectCategory(filteredCategories[0]!.id, true)
            }
          }}
        />
        {searchQuery && (
          <button type="button" className="demo-rail__search-clear" aria-label={t('ref.catalogue.clearSearch')} onClick={() => {
            setSearchQuery('')
            searchInputRef.current?.focus()
          }}>
            ✕
          </button>
        )}
      </div>
      <div ref={categoryListRef} className="demo-rail__list">
        {filteredCategories.length === 0 ? (
          <div className="demo-rail__empty">
            <span className="demo-rail__empty-title">{t('ref.catalogue.empty')}</span>
            <button type="button" className="demo-rail__empty-reset" onClick={() => {
              setSearchQuery('')
              searchInputRef.current?.focus()
            }}>
              {t('ref.catalogue.reset')}
            </button>
          </div>
        ) : filteredCategories.map((category) => {
          const originalIndex = CATEGORIES.findIndex((item) => item.id === category.id)
          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="demo-rail__item"
              aria-current={active === category.id ? 'location' : undefined}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                playTactileSound('tab', 0.16)
                // Keyboard activation moves focus to the new section; mouse clicks keep focus on the rail.
                selectCategory(category.id, event.detail === 0)
              }}
            >
              <span className="demo-rail__index">{String(originalIndex + 1).padStart(2, '0')}</span>
              <span className="demo-rail__label">{t(category.title)}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}


function ReferenceView() {
  const { t, locale } = useI18n()
  const [tab, setTab] = useState('overview')
  const [segment, setSegment] = useState('all')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [slider, setSlider] = useState(42)
  const [count, setCount] = useState(1280)
  const [skillLevel, setSkillLevel] = useState<AkSkillLevel>(3)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState('deploy')
  const [selectedTableRow, setSelectedTableRow] = useState('r1')
  const [tableStriped, setTableStriped] = useState(true)
  const [tableTactical, setTableTactical] = useState(true)
  const [tableSticky, setTableSticky] = useState(false)
  const [tableSortKey, setTableSortKey] = useState<'name' | 'atk' | 'def'>('atk')
  const [tableSortDir, setTableSortDir] = useState<'ascending' | 'descending' | 'none'>('descending')

  const handleTableSort = (key: 'name' | 'atk' | 'def') => {
    playTactileSound('dial', 0.15)
    setTableSortDir(nextTableSort(tableSortKey, tableSortDir, key))
    setTableSortKey(key)
  }
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
  const hitButton = (name: string) => {
    setButtonHit(name)
    setButtonHits((n) => n + 1)
  }

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
  /** Name the open category in the tab and in shared links; the hash alone does not say what it holds. */
  useEffect(() => {
    const category = CATEGORIES[activeIndex]
    if (category) document.title = `${t(category.title)} · ak-ui`
  }, [activeIndex, t])
  const stageRef = useRef<HTMLDivElement>(null)
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
    // 滚动回分类顶部
    stageRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
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
        stageRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const items: GalleryItem[] = galleryItems(t)

  return (
    <main id="demo-main" className="demo-main" tabIndex={-1}>
      <header className="demo-hero">
        <div className="demo-hero__intro">
          <h1 className="demo-hero__title">{t('ref.catalogue.title')}</h1>
          <p className="demo-hero__desc">{t('ref.catalogue.description')}</p>
        </div>
        <button type="button" className="demo-hero__install-box" onClick={copyInstall} aria-label={t('ref.catalogue.copyInstall')}>
          <span className="demo-hero__install-prefix" aria-hidden="true">$</span>
          <code className="demo-hero__install-code">{installCmd}</code>
          <span className="demo-hero__install-btn" aria-live="polite">
            {t(installCopyState === 'copied' ? 'ref.catalogue.copied' : installCopyState === 'error' ? 'ref.catalogue.copyError' : 'ref.catalogue.copy')}
          </span>
        </button>
      </header>

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
        example={(tune: Tune) => renderActions({ t, buttonHit, buttonHits, hitButton }, tune)}
        exportCode={(overrides) => exportCategory(1, locale, overrides, { buttonHit, buttonHits })}
      />

      <Block id="components-2" eyebrow={t('ref.menu.eyebrow')} title={t('ref.menu.title')} note={t('ref.menu.note')} api={DOC_REGISTRY['components-2']?.api} example={(tune) => renderMenus({ t, selectedCommand, setSelectedCommand, count, setCount }, tune)} exportCode={(overrides) => exportCategory(2, locale, overrides, { selectedCommand, count })} />

      <Block id="components-3" eyebrow={t('ref.surfaces.eyebrow')} title={t('ref.surfaces.title')} note={t('ref.surfaces.note')} api={DOC_REGISTRY['components-3']?.api} example={(tune) => renderSurfaces({ t, groupPick, setGroupPick, cardDialog, setCardDialog }, tune)} exportCode={(overrides) => exportCategory(3, locale, overrides, { groupPick, cardDialog })} />

      <Block id="components-4" eyebrow={t('ref.feedback.eyebrow')} title={t('ref.feedback.title')} note={t('ref.feedback.note')} api={DOC_REGISTRY['components-4']?.api} example={(tune) => renderFeedback({ t }, tune)} exportCode={(overrides) => exportCategory(4, locale, overrides, {})} />

      <Block id="components-5" eyebrow={t('ref.inputs.eyebrow')} title={t('ref.inputs.title')} note={t('ref.inputs.note')} api={DOC_REGISTRY['components-5']?.api} example={(tune) => renderInputs({ t, slider, setSlider, segment, setSegment }, tune)} exportCode={(overrides) => exportCategory(5, locale, overrides, { slider, segment })} />

      <Block id="components-6" eyebrow={t('ref.navigation.eyebrow')} title={t('ref.navigation.title')} note={t('ref.navigation.note')} api={DOC_REGISTRY['components-6']?.api} example={(tune) => renderNavigation({ t, tab, setTab }, tune)} exportCode={(overrides) => exportCategory(6, locale, overrides, { tab })} />

      <Block id="components-7" eyebrow={t('ref.effects.eyebrow')} title={t('ref.effects.title')} note={t('ref.effects.note')} api={DOC_REGISTRY['components-7']?.api} example={(tune) => renderEffects({ t, count, setCount, entranceRef }, tune)} exportCode={(overrides) => exportCategory(7, locale, overrides, { count })} />

      <Block id="components-8" eyebrow={t('ref.gallery.eyebrow')} title={t('ref.gallery.title')} note={t('ref.gallery.note')} api={DOC_REGISTRY['components-8']?.api} example={(tune) => renderGallery({ t, galleryIndex, setGalleryIndex, items }, tune)} exportCode={(overrides) => exportCategory(8, locale, overrides, { galleryIndex, items })} />

      <Block id="components-9" eyebrow={t('ref.site.eyebrow')} title={t('ref.site.title')} note={t('ref.site.note')} api={DOC_REGISTRY['components-9']?.api} example={(tune) => renderSite({ t, mobileMenuRef, selectCategory }, tune)} exportCode={(overrides) => exportSite(locale, overrides, { ...overrideRegistry.current }, { buttonHit, buttonHits, count, selectedCommand, selectedSlot, selectedItem, screenOpen, screenCategory, screenSearch, selectedDepotId, materialStock, screenNotice, screenNoticeExpiresAt, sanCurrent, sanTotal, sanLimit, loadingReady, dialogOpen })} />

      <Block
        id="components-10"
        eyebrow={t('ref.shell.eyebrow')}
        title={t('ref.shell.title')}
        note={t('ref.shell.note')}
        api={DOC_REGISTRY['components-10']?.api}
        example={(tune) => renderShell({ t, current: shellCurrent, setCurrent: setShellCurrent }, tune)}
        exportCode={(overrides) => exportShell({ t, current: shellCurrent, setCurrent: setShellCurrent }, overrides)}
      />

      <Block id="components-11" eyebrow={t('ref.decor.eyebrow')} title={t('ref.decor.title')} note={t('ref.decor.note')} api={DOC_REGISTRY['components-11']?.api} example={(tune) => renderDecor({ t }, tune)} exportCode={(overrides) => exportCategory(11, locale, overrides, { shellOverrides: overrideRegistry.current['components-10'] ?? {} })} />

      <Block id="components-12" eyebrow={t('ref.arknights.eyebrow')} title={t('ref.arknights.title')} note={t('ref.arknights.note')} api={DOC_REGISTRY['components-12']?.api} example={(tune) => renderGameData({ t, skillLevel, setSkillLevel }, tune)} exportCode={(overrides) => exportCategory(12, locale, overrides, { skillLevel })} />

      <Block id="components-13" eyebrow={t('ref.controls.eyebrow')} title={t('ref.controls.title')} note={t('ref.controls.note')} api={DOC_REGISTRY['components-13']?.api} example={(tune) => renderControls({ t, groupPick, setGroupPick, pageIndex, setPageIndex }, tune)} exportCode={(overrides) => exportCategory(13, locale, overrides, { groupPick, pageIndex })} />

      <Block id="components-14" eyebrow={t('ref.form.eyebrow')} title={t('ref.form.title')} note={t('ref.form.note')} api={DOC_REGISTRY['components-14']?.api} example={(tune) => renderForms({ t, fieldName, setFieldName, selectPick, setSelectPick, noteText, setNoteText, choiceA, setChoiceA, choiceB, setChoiceB }, tune)} exportCode={(overrides) => exportCategory(14, locale, overrides, { fieldName, selectPick, noteText, choiceA, choiceB })} />

      <Block id="components-15" eyebrow={t('ref.data.eyebrow')} title={t('ref.data.title')} note={t('ref.data.note')} api={DOC_REGISTRY['components-15']?.api} example={(tune) => renderReadouts({ t, sanCurrent, setSanCurrent, sanTotal, sanLimit, loadingReady, setLoadingReady, dialogOpen, setDialogOpen }, tune)} exportCode={(overrides) => exportCategory(15, locale, overrides, { sanCurrent, sanTotal, sanLimit, loadingReady, dialogOpen })} />

      <Block id="components-16" eyebrow={t('ref.collection.eyebrow')} title={t('ref.collection.title')} note={t('ref.collection.note')} api={DOC_REGISTRY['components-16']?.api} example={(tune) => renderCollections({ t, selectedTableRow, setSelectedTableRow, tableStriped, setTableStriped, tableTactical, setTableTactical, tableSticky, setTableSticky, tableSortKey, tableSortDir, handleTableSort, tableData }, tune)} exportCode={(overrides) => exportCategory(16, locale, overrides, { selectedTableRow, tableStriped, tableTactical, tableSticky, tableSortKey, tableSortDir })} />

      <Block id="components-17" eyebrow={t('ref.command.eyebrow')} title={t('ref.command.title')} note={t('ref.command.note')} api={DOC_REGISTRY['components-17']?.api} example={(tune) => renderCommand({ t, selectedCommand, setSelectedCommand, selectedSlot, setSelectedSlot, selectedItem, setSelectedItem, screenOpen, setScreenOpen, screenDialogRef, screenCategory, setScreenCategory, screenSearch, setScreenSearch, selectedDepotItem, setSelectedDepotId, filteredDepotItems, materialStock, setMaterialStock, screenNotice, showScreenNotice, sanCurrent, setSanCurrent, sanTotal, sanLimit, showcaseDialogStyle }, tune)} exportCode={(overrides) => exportCommand({ selectedCommand, selectedSlot, selectedItem, screenOpen, screenCategory, screenSearch, selectedDepotId, materialStock, screenNotice, screenNoticeExpiresAt, sanCurrent, sanTotal, sanLimit }, overrides, locale)} />
          </StageContext.Provider>

          <div className="demo-stage__foot">
            <div className="demo-row">
              <button
                type="button"
                className="demo-stage__page"
                disabled={activeIndex === 0}
                onClick={() => {
                  playTactileSound('tab', 0.16)
                  step(-1)
                }}
              >
                {t('ref.catalogue.previous')}
              </button>
              <button
                type="button"
                className="demo-stage__page"
                disabled={activeIndex === CATEGORIES.length - 1}
                onClick={() => {
                  playTactileSound('tab', 0.16)
                  step(1)
                }}
              >
                {t('ref.catalogue.next')}
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
  const [llmCopyState, setLlmCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const llmDialogRef = useShowcaseDialog(llmModalOpen)
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'archive' ? '#eef0f1' : '#111315')
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
      llmCopyTimer.current = window.setTimeout(() => setLlmCopyState('idle'), 2000)
    } catch {
      if (generation === llmCopyGeneration.current) setLlmCopyState('error')
    }
  }

  return (
    <div className="demo-app">
      <a className="demo-skip-link" href="#demo-main">{t('app.skip')}</a>
      <header className="demo-topbar">
        <div className="demo-topbar__brand">
          <AkDisplay>{t('app.name')}</AkDisplay>
          <span className="demo-topbar__tagline">{t('app.tagline')}</span>
          <span className="demo-topbar__version">v{packageVersion}</span>
        </div>

        {/* 顶栏操作控件 */}
        <div className="demo-topbar__controls">
          <button type="button" className="demo-topbar__link" onClick={(event) => {
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
                  options={[
                    { label: t('app.theme.terminal'), value: 'terminal' },
                    { label: t('app.theme.archive'), value: 'archive' },
                  ]}
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

      <ReferenceView />

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
