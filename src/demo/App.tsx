import { createContext, cloneElement, isValidElement, Fragment, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { version as packageVersion } from '../../package.json'
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
  AkBarcode,
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
  AkLaser,
  AkLevel,
  AkReticle,
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
  useTactileSound,
  playTactileSound,
} from '../ak'
import type { AkEntranceHandle, AkSkillLevel, GalleryItem, AkSlotRarity, AkSlotRole } from '../ak'
import { galleryItems } from './gallery-art'
import { useI18n, type MessageKey } from './i18n'
import { DOC_REGISTRY, type BlockPropDoc } from './doc-data'
import llmsRawText from '../../llms.txt?raw'
import type { AkMobileMenuHandle } from '../ak/ui/site/AkMobileMenu'
import './demo.css'

type Theme = 'terminal' | 'archive'

// The showcase overlays use the browser's modal focus containment and inert background.
function useShowcaseDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      trigger?.focus()
    }
  }, [open])
  return ref
}

const showcaseDialogStyle = { position: 'fixed', inset: 0, width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none', margin: 0, padding: 0, border: 0, background: 'transparent', overflow: 'auto' } as const

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
const StageContext = createContext<{ active: string } | null>(null)

/** 菜单与指令共享动作集。 */
const MENU_ACTIONS = new Set(['inspect', 'deploy', 'cancel', 'archive', 'file', 'edit', 'view'])

/** Traverse React children without invoking component implementations. */
type Tunable = { path: number[]; label: string; props: Record<string, unknown>; element: ReactElement }
function componentName(type: ReactElement['type']): string {
  if (typeof type === 'string') return type
  const component = type as unknown as {
    displayName?: string
    name?: string
    render?: { displayName?: string; name?: string }
    type?: { displayName?: string; name?: string }
  }
  return component.displayName ?? component.name ?? component.render?.displayName ?? component.render?.name ?? component.type?.displayName ?? component.type?.name ?? 'Component'
}
function isAkComponent(type: ReactElement['type']): boolean {
  return /^Ak[A-Z]/.test(componentName(type))
}
function walkTree(node: ReactNode, visit: (el: ReactElement, path: number[]) => ReactNode, path: number[] = []): ReactNode {
  if (Array.isArray(node)) {
    const next = node.map((child, i) => walkTree(child, visit, [...path, i]))
    return next.every((child, i) => child === node[i]) ? node : next
  }
  if (!isValidElement(node)) return node
  const el = node as ReactElement<{ children?: ReactNode }>
  const children = el.props.children
  const nextChildren = children === undefined ? undefined : walkTree(children, visit, [...path, 0])
  return visit(nextChildren === children ? el : cloneElement(el, {}, nextChildren), path)
}
function getTunables(tree: ReactNode): Tunable[] {
  const list: Tunable[] = []
  const counts = new Map<string, number>()
  // Read the original elements without mapping arrays or cloning ancestors.
  const visit = (node: ReactNode, path: number[]) => {
    if (Array.isArray(node)) {
      node.forEach((child, i) => visit(child, [...path, i]))
      return
    }
    if (!isValidElement(node)) return
    const el = node as ReactElement<{ children?: ReactNode }>
    if (el.props.children !== undefined) visit(el.props.children, [...path, 0])
    const name = componentName(el.type)
    if (isAkComponent(el.type)) {
      const count = (counts.get(name) ?? 0) + 1
      counts.set(name, count)
      list.push({ path, label: `${name} · ${count}`, props: el.props as Record<string, unknown>, element: el })
    }
  }
  visit(tree, [])
  return list
}
function serializeValue(value: unknown, depth = 0): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return '/* callback supplied by caller */ () => {}'
  if (isValidElement(value)) return serializeNode(value, depth)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const indent = '  '.repeat(depth)
    const childIndent = '  '.repeat(depth + 1)
    return `[\n${value.map((item) => `${childIndent}${serializeValue(item, depth + 1)}`).join(',\n')}\n${indent}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    const indent = '  '.repeat(depth)
    const childIndent = '  '.repeat(depth + 1)
    return `{\n${entries.map(([key, item]) => {
      const property = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)
      return `${childIndent}${property}: ${serializeValue(item, depth + 1)}`
    }).join(',\n')}\n${indent}}`
  }
  return 'undefined'
}
function serializeNode(node: ReactNode, depth = 0): string {
  if (Array.isArray(node)) return node.map((child) => serializeNode(child, depth)).filter(Boolean).join('\n')
  if (node == null || typeof node === 'boolean') return ''
  const indent = '  '.repeat(depth)
  if (typeof node === 'string' || typeof node === 'number') return `${indent}{${serializeValue(node)}}`
  if (!isValidElement(node)) return ''
  const el = node as ReactElement<{ children?: ReactNode }>
  if (el.type === Fragment) {
    const children = serializeNode(el.props.children, depth + 1)
    return children ? `${indent}<>\n${children}\n${indent}</>` : `${indent}<></>`
  }
  const type = componentName(el.type)
  const props = Object.entries(el.props as Record<string, unknown>).filter(([key, value]) => key !== 'children' && key !== 'key' && key !== 'ref' && value !== undefined)
  const attrs = props.map(([key, value]) => ` ${key}={${serializeValue(value, depth + 1)}}`).join('')
  const children = serializeNode(el.props.children, depth + 1)
  return children ? `${indent}<${type}${attrs}>\n${children}\n${indent}</${type}>` : `${indent}<${type}${attrs} />`
}
function getAkImports(tree: ReactNode): string[] {
  const names = new Set<string>()
  const seen = new Set<object>()
  const visit = (value: unknown) => {
    if (typeof value === 'function' || value == null) return
    if (isValidElement(value)) {
      if (isAkComponent(value.type)) names.add(componentName(value.type))
      visit(value.props)
      return
    }
    if (typeof value !== 'object' || seen.has(value)) return
    seen.add(value)
    if (Array.isArray(value)) value.forEach(visit)
    else Object.values(value).forEach(visit)
  }
  visit(tree)
  return [...names]
}

function applyOverrides(tree: ReactNode, overrides: Record<string, unknown>): ReactNode {
  const byPath = new Map<string, Record<string, unknown>>()
  for (const [key, value] of Object.entries(overrides)) {
    const [path, prop] = key.split('|')
    if (!prop) continue
    const props = byPath.get(path!) ?? {}
    props[prop] = value
    byPath.set(path!, props)
  }
  if (byPath.size === 0) return tree
  return walkTree(tree, (el, path) => {
    const props = byPath.get(path.join('.'))
    if (!props) return el
    const current = el.props as Record<string, unknown>
    return Object.entries(props).some(([key, value]) => !Object.is(current[key], value))
      ? cloneElement(el, props)
      : el
  })
}

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
  children,
}: {
  id: string
  eyebrow: string
  title: string
  note?: ReactNode
  api?: BlockPropDoc[]
  children: ReactNode
}) {
  const stage = useContext(StageContext)
  const { t } = useI18n()
  const [tab, setTab] = useState<'preview' | 'code' | 'api' | 'tune'>('preview')
  const [copyResult, setCopyResult] = useState<{ text: string; state: 'copied' | 'error' } | null>(null)
  const copyTimer = useRef<number | null>(null)
  const [selected, setSelected] = useState(0)
  const [overrides, setOverrides] = useState<Record<string, unknown>>({})
  const [previewExpanded, setPreviewExpanded] = useState(true)
  const [resetVersion, setResetVersion] = useState(0)
  const [codeText, setCodeText] = useState('')
  const active = !stage || stage.active === id
  // Keep the inspector's DOM and scroll range intact while other views are visible.
  const tunables = useMemo(() => active ? getTunables(children) : [], [active, children])
  const target = tunables[selected]
  const actualTree = useMemo(() => active ? applyOverrides(children, overrides) : children, [active, children, overrides])
  // Update before paint on entry; hidden views retain their text without serializing.
  useLayoutEffect(() => {
    if (active && tab === 'code') {
      setCodeText(`import { ${getAkImports(actualTree).join(', ')} } from '@swufefox/ak-ui-react'\n\n${serializeNode(actualTree)}`)
    }
  }, [active, tab, actualTree])
  const targetPrefix = target ? `${target.path.join('.')}|` : ''
  const modifiedCount = target ? Object.keys(overrides).filter((key) => key.startsWith(targetPrefix)).length : 0
  const hasControlledValue = Boolean(target && ['value', 'checked'].some((key) => key in target.props) && ['onValueChange', 'onChange', 'onInput'].some((key) => typeof target.props[key] === 'function'))
  const editable = target ? [...Object.entries(target.props).filter(([key, value]) => !['key','ref','children','className','style'].includes(key) && !/^on[A-Z]/.test(key) && !(['value','checked'].includes(key) && hasControlledValue) && ['string','number','boolean'].includes(typeof value)), ...(typeof target.props.children === 'string' || typeof target.props.children === 'number' ? [['children', target.props.children] as [string, unknown]] : [])] : []
  const hasCode = Boolean(children)
  const copyState = copyResult?.text === codeText ? copyResult.state : 'idle'
  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
  }, [])

  if (!active) return null

  const index = CATEGORIES.findIndex((category) => category.id === id)
  const displayEyebrow =
    index === -1 ? eyebrow : `${String(index + 1).padStart(2, '0')} / ${eyebrow.replace(/^\s*\d+\s*\/\s*/, '')}`

  const views = ['preview', 'tune', 'code', ...(api ? ['api' as const] : [])] as const
  const copyCode = async () => {
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
          <h2 id={`${id}-title`}>{title}</h2>
          {note ? <p className="demo-note">{note}</p> : null}
        </div>
        {(hasCode || api) ? (
          <div className="demo-block__tabs" role="tablist" aria-label={t('common.demoViews')}>
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
        ) : null}
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
              <AkSelect size="sm" value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
                {tunables.map((item, i) => <option key={`${item.label}-${i}`} value={i}>{item.label}</option>)}
              </AkSelect>
            </AkFieldLabel>
            <div className="demo-tune-fields" key={`${target?.path.join('.') ?? 'empty'}-${resetVersion}`}>
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
      <div id={`${id}-code`} className="demo-code-container" role="tabpanel" aria-labelledby={`${id}-tab-code`} hidden={tab !== 'code'}>
        <div className="demo-code-header">
          <span className="demo-code-title">
            <span className="demo-code-dot" />
            JSX / TSX
          </span>
          <AkButton type="button" variant="outline" size="sm" sound={false} onClick={copyCode} aria-live="polite">{t(copyState === 'copied' ? 'common.codeCopied' : copyState === 'error' ? 'common.codeCopyError' : 'common.copyCode')}</AkButton>
        </div>
        <pre className="demo-code-box" tabIndex={0}><code>{codeText}</code></pre>
      </div>

      {tab === 'api' && api && (
        <div id={`${id}-api`} className="demo-api-container" role="tabpanel" aria-labelledby={`${id}-tab-api`}>
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
                  <td className="demo-api-desc">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function CatalogueRail({ active, selectCategory }: { active: string; selectCategory: (id: string) => void }) {
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
    const revealActive = () => {
      if (list.scrollWidth <= list.clientWidth) return
      const item = list.querySelector<HTMLElement>('[aria-current="page"]')
      if (!item) return
      const rail = list.getBoundingClientRect()
      const selected = item.getBoundingClientRect()
      if (selected.left < rail.left || selected.width > list.clientWidth) {
        list.scrollLeft += selected.left - rail.left
      } else if (selected.right > rail.right) {
        list.scrollLeft += selected.right - rail.right
      }
    }
    revealActive()
    window.addEventListener('resize', revealActive)
    return () => window.removeEventListener('resize', revealActive)
  }, [active, filteredCategories])

  return (
    <nav className="demo-rail" aria-label={t('ref.catalogue.rail')}>
      <div className="demo-rail__head">
        <span className="demo-rail__eyebrow">{t('ref.catalogue.rail')}</span>
        <span className="demo-rail__count">{t('ref.catalogue.count', { n: CATEGORIES.length })}</span>
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
              selectCategory(filteredCategories[0]!.id)
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
              aria-current={active === category.id ? 'page' : undefined}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                playTactileSound('tab', 0.16)
                selectCategory(category.id)
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

interface TabSpecItem {
  value: string
  label: MessageKey
  title: MessageKey
  description: MessageKey
  icon?: string
  badge?: string
}

const tabSpec: readonly TabSpecItem[] = [
  {
    value: 'overview',
    label: 'ref.navigation.overview',
    title: 'ref.navigation.overview',
    description: 'ref.navigation.overviewDesc',
    icon: '◈',
    badge: 'NEW',
  },
  {
    value: 'skills',
    label: 'ref.navigation.skills',
    title: 'ref.navigation.skills',
    description: 'ref.navigation.skillsDesc',
    icon: '⚡',
    badge: 'M3',
  },
  {
    value: 'archive',
    label: 'ref.navigation.archive',
    title: 'ref.navigation.archive',
    description: 'ref.navigation.archiveDesc',
    icon: '▤',
  },
]

type DepotCategory = 'all' | 'materials' | 'chips' | 'operators'

interface DepotMaterial {
  kind: 'material'
  id: string
  name: string
  nameEn: string
  tier: 1 | 2 | 3 | 4 | 5 | 6
  initialCount: number
  price?: string
  subCategory: 'materials' | 'chips'
  desc: string
  formula?: string[]
  formulaCost?: string
  drops: string[]
}

interface DepotOperator {
  kind: 'operator'
  id: string
  name: string
  nameEn: string
  code: string
  role: AkSlotRole
  rarity: AkSlotRarity
  elite: 0 | 1 | 2
  level: number
  meta: string
  rarityLabel: string
  talent: string
  stats: { hp: string; atk: string; def: string; cost: number }
}

type DepotItem = DepotMaterial | DepotOperator

const DEPOT_ITEMS: DepotItem[] = [
  // Materials
  {
    kind: 'material',
    id: 'mat-originium',
    name: '源石原石',
    nameEn: 'ORIGINIUM PRIME',
    tier: 6,
    initialCount: 18,
    price: '180 龙门币',
    subCategory: 'materials',
    desc: '高浓缩天然活性源石，蕴含无尽能量但极度危险，为罗德岛最高等级战术战略储备资产。',
    drops: ['战术采购', '三星通关档案', '突袭作战评定'],
  },
  {
    kind: 'material',
    id: 'mat-d32',
    name: 'D32钢',
    nameEn: 'D32 STEEL',
    tier: 6,
    initialCount: 4,
    subCategory: 'materials',
    desc: '极其稀有的特种钢材，由数种重金属与源石晶体融合锻造，代表泰拉尖端材料工艺极限。',
    formula: ['1x 聚合剂', '1x 双极纳米片', '1x 改量装置'],
    formulaCost: '3,000 龙门币',
    drops: ['加工站合成', '主线 S4-1 极罕见'],
  },
  {
    kind: 'material',
    id: 'mat-nano',
    name: '双极纳米片',
    nameEn: 'BIPOLAR NANOFLAKE',
    tier: 5,
    initialCount: 6,
    subCategory: 'materials',
    desc: '具备超导与形态记忆特性的尖端纳米材料，用于干员最高等级潜能活化与专精升格。',
    formula: ['1x 改量装置', '2x 白马醇'],
    formulaCost: '2,500 龙门币',
    drops: ['加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-poly',
    name: '聚合剂',
    nameEn: 'POLYMERIZATION PREP',
    tier: 5,
    initialCount: 3,
    subCategory: 'materials',
    desc: '高分子聚合凝合剂，工业级精密附着介质，可极大提升异种合金界面的结构耐受力。',
    formula: ['1x 提纯源岩', '1x 异铁块'],
    formulaCost: '2,500 龙门币',
    drops: ['加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-cryst',
    name: '晶体电子单元',
    nameEn: 'CRYSTALLINE UNIT',
    tier: 5,
    initialCount: 5,
    subCategory: 'materials',
    desc: '复合源石结晶与超纯硅晶圆的高算力电子控制单元，战术终极武器装具核心。',
    formula: ['1x 晶体电路', '2x 凝胶'],
    formulaCost: '2,500 龙门币',
    drops: ['加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-device-t4',
    name: '改量装置',
    nameEn: 'MODIFIED DEVICE',
    tier: 4,
    initialCount: 12,
    subCategory: 'materials',
    desc: '精密改型电子机械装置，具备强大的信号调制能力与抗电磁干扰冗余。',
    formula: ['1x 全新装置', '2x 固源岩', '1x 研磨石'],
    formulaCost: '1,500 龙门币',
    drops: ['主线 3-4', '主线 4-10', '加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-manganese',
    name: '三水锰矿',
    nameEn: 'MANGANESE TRIHYDRATE',
    tier: 4,
    initialCount: 8,
    subCategory: 'materials',
    desc: '极为坚硬的金属矿石晶体，常用于合金催化与战术电极表层硬化涂层。',
    formula: ['2x 锰矿', '1x 聚酸酯组', '1x 炽合金'],
    formulaCost: '1,500 龙门币',
    drops: ['主线 4-7', '加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-kohl',
    name: '白马醇',
    nameEn: 'WHITE HORSE KOHL',
    tier: 4,
    initialCount: 16,
    subCategory: 'materials',
    desc: '特殊提纯发光醇类溶剂，性质极其稳定，用于高分子有机合成与源石溶液催化。',
    drops: ['主线 4-4', '主线 6-11'],
  },
  {
    kind: 'material',
    id: 'mat-orirock-t3',
    name: '固源岩组',
    nameEn: 'ORIROCK CLUSTER',
    tier: 3,
    initialCount: 142,
    subCategory: 'materials',
    desc: '成组开采的天然源石岩矿体，罗德岛基建与日常物质调配的高频消耗品。',
    formula: ['5x 固源岩'],
    formulaCost: '200 龙门币',
    drops: ['主线 1-7', '主线 2-4'],
  },
  {
    kind: 'material',
    id: 'mat-alloy',
    name: '炽合金',
    nameEn: 'INCANDESCENT ALLOY',
    tier: 3,
    initialCount: 67,
    subCategory: 'materials',
    desc: '具备高温超导性能的高纯特种合金块，可承受超极限源石技艺热冲击。',
    drops: ['主线 S3-6', '主线 S5-3'],
  },
  // Chips
  {
    kind: 'material',
    id: 'chip-grd',
    name: '近卫双芯片',
    nameEn: 'GUARD DUAL CHIP',
    tier: 5,
    initialCount: 14,
    subCategory: 'chips',
    desc: '记录近卫干员精英二阶晋升神经反射与近身格斗数据的尖端战术存储晶片。',
    formula: ['2x 近卫芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-sni',
    name: '狙击双芯片',
    nameEn: 'SNIPER DUAL CHIP',
    tier: 5,
    initialCount: 8,
    subCategory: 'chips',
    desc: '记录狙击干员远距离弹道测算、光学微光瞄准与风偏校准经验的专用晶片。',
    formula: ['2x 狙击芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-cas',
    name: '术师双芯片',
    nameEn: 'CASTER DUAL CHIP',
    tier: 5,
    initialCount: 11,
    subCategory: 'chips',
    desc: '记录术师干员源石技艺调幅回路活化与法术共振抑制协议的高阶晶片。',
    formula: ['2x 术师芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-med',
    name: '医疗双芯片',
    nameEn: 'MEDIC DUAL CHIP',
    tier: 5,
    initialCount: 9,
    subCategory: 'chips',
    desc: '记录医疗干员战场紧急生命体征维持与靶向组织再生协议的神经晶片。',
    formula: ['2x 医疗芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-vng',
    name: '先锋双芯片',
    nameEn: 'VANGUARD DUAL CHIP',
    tier: 5,
    initialCount: 7,
    subCategory: 'chips',
    desc: '记录先锋干员闪击部署机动协同与战术撤退掩护预案的高容量双晶片。',
    formula: ['2x 先锋芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  // Operators
  {
    kind: 'operator',
    id: 'op-silverash',
    name: '银灰',
    nameEn: 'SILVERASH',
    code: 'GRD',
    role: 'guard',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'TRUESILVER',
    rarityLabel: '★★★★★★',
    talent: '真银斩 // 攻击范围极大扩大，防御力降低，同时向攻击范围内的多名敌人发动高速挥砍斩击',
    stats: { hp: '4,120', atk: '890', def: '430', cost: 20 },
  },
  {
    kind: 'operator',
    id: 'op-eyja',
    name: '艾雅法拉',
    nameEn: 'EYJAFJALLA',
    code: 'CAS',
    role: 'caster',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'VOLCANO',
    rarityLabel: '★★★★★★',
    talent: '火山 // 攻击力大幅提升，攻击间隔极大缩短，随机向周围敌人连续发射熔岩爆轰',
    stats: { hp: '2,350', atk: '745', def: '125', cost: 21 },
  },
  {
    kind: 'operator',
    id: 'op-exusiai',
    name: '能天使',
    nameEn: 'EXUSIAI',
    code: 'SNI',
    role: 'sniper',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'OVERLOAD',
    rarityLabel: '★★★★★★',
    talent: '过载模式 // 攻击变为高速5连射，射速极大提升，瞬间摧毁目标防线',
    stats: { hp: '2,280', atk: '630', def: '160', cost: 14 },
  },
  {
    kind: 'operator',
    id: 'op-saria',
    name: '塞雷娅',
    nameEn: 'SARIA',
    code: 'DEF',
    role: 'defender',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'CALCIFY',
    rarityLabel: '★★★★★★',
    talent: '钙质化 // 附近所有敌人减速并受到法术易伤，持续为全场友方干员充能技力并回复生命',
    stats: { hp: '3,850', atk: '560', def: '690', cost: 22 },
  },
  {
    kind: 'operator',
    id: 'op-kaltsit',
    name: '凯尔希',
    nameEn: "KAL'TSIT",
    code: 'MED',
    role: 'medic',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'MON3TR',
    rarityLabel: '★★★★★★',
    talent: '指令：熔毁 // 召唤战术召唤物Mon3tr，获得超绝真实伤害爆发与近战拦截能力',
    stats: { hp: '2,800', atk: '590', def: '260', cost: 20 },
  },
  {
    kind: 'operator',
    id: 'op-texas',
    name: '德克萨斯',
    nameEn: 'TEXAS',
    code: 'VNG',
    role: 'vanguard',
    rarity: 5,
    elite: 2,
    level: 80,
    meta: 'SWORDRAIN',
    rarityLabel: '★★★★★',
    talent: '剑雨 // 降下光剑对范围内敌人造成群体法术伤害与强力眩晕，立即获得大量部署费用',
    stats: { hp: '2,100', atk: '570', def: '340', cost: 13 },
  },
  {
    kind: 'operator',
    id: 'op-lappland',
    name: '拉普兰德',
    nameEn: 'LAPPLAND',
    code: 'GRD',
    role: 'guard',
    rarity: 5,
    elite: 2,
    level: 80,
    meta: 'WOLFPACK',
    rarityLabel: '★★★★★',
    talent: '狼魂 // 攻击变为法术伤害并额外攻击一名目标，精神摧毁封锁目标所有特殊能力',
    stats: { hp: '2,350', atk: '685', def: '365', cost: 19 },
  },
  {
    kind: 'operator',
    id: 'op-myrtle',
    name: '桃金娘',
    nameEn: 'MYRTLE',
    code: 'VNG',
    role: 'vanguard',
    rarity: 4,
    elite: 2,
    level: 70,
    meta: 'SUPPORT',
    rarityLabel: '★★★★',
    talent: '治愈之翼 // 停止攻击持续为前线回复生命，并在极短时间内高速生产海量部署费用',
    stats: { hp: '1,720', atk: '510', def: '310', cost: 10 },
  },
]

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
  const [selectedTableRow, setSelectedTableRow] = useState('r1')
  const [tableStriped, setTableStriped] = useState(true)
  const [tableTactical, setTableTactical] = useState(true)
  const [tableSticky, setTableSticky] = useState(false)
  const [tableSortKey, setTableSortKey] = useState<'name' | 'atk' | 'def'>('atk')
  const [tableSortDir, setTableSortDir] = useState<'ascending' | 'descending' | 'none'>('descending')

  const handleTableSort = (key: 'name' | 'atk' | 'def') => {
    playTactileSound('dial', 0.15)
    if (tableSortKey !== key) {
      setTableSortKey(key)
      setTableSortDir('descending')
    } else if (tableSortDir === 'descending') {
      setTableSortDir('ascending')
    } else if (tableSortDir === 'ascending') {
      setTableSortDir('none')
    } else {
      setTableSortDir('descending')
    }
  }

  const tableData = useMemo(() => {
    const raw = [
      { id: 'r1', name: 'Amiya', atk: 512, def: 128, role: 'CASTER' },
      { id: 'r2', name: 'Kaltsit', atk: 480, def: 210, role: 'MEDIC' },
      { id: 'r3', name: 'Ifrit', atk: 620, def: 90, role: 'CASTER' },
      { id: 'r4', name: 'Saria', atk: 485, def: 590, role: 'DEFENDER' },
    ]
    if (tableSortDir === 'none') return raw
    return [...raw].sort((a, b) => {
      const valA = a[tableSortKey]
      const valB = b[tableSortKey]
      const diff = typeof valA === 'number' && typeof valB === 'number'
        ? valA - valB
        : String(valA).localeCompare(String(valB))
      return tableSortDir === 'ascending' ? diff : -diff
    })
  }, [tableSortKey, tableSortDir])
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
  const [screenNotice, setScreenNotice] = useState<string | null>(null)
  const screenNoticeTimer = useRef<number | null>(null)

  const showScreenNotice = useCallback((msg: string) => {
    if (screenNoticeTimer.current !== null) window.clearTimeout(screenNoticeTimer.current)
    setScreenNotice(msg)
    screenNoticeTimer.current = window.setTimeout(() => setScreenNotice(null), 3000)
  }, [])

  const filteredDepotItems = useMemo(() => {
    const query = screenSearch.trim().toLowerCase()
    return DEPOT_ITEMS.filter((item) => {
      if (screenCategory === 'materials' && (item.kind !== 'material' || item.subCategory !== 'materials')) return false
      if (screenCategory === 'chips' && (item.kind !== 'material' || item.subCategory !== 'chips')) return false
      if (screenCategory === 'operators' && item.kind !== 'operator') return false
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesNameEn = item.nameEn.toLowerCase().includes(query)
        const matchesCode = item.kind === 'operator' && item.code.toLowerCase().includes(query)
        return matchesName || matchesNameEn || matchesCode
      }
      return true
    })
  }, [screenCategory, screenSearch])

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
  const stageRef = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<AkEntranceHandle>(null)
  const stageValue = useMemo(() => ({ active }), [active])

  /** Switch category, recording navigation so browser back and forward work. */
  const selectCategory = useCallback((id: string) => {
    setActive(id)
    const url = `${window.location.pathname}${window.location.search}#${id}`
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', url)
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
      if (CATEGORIES.some((c) => c.id === hash) || !hash) {
        setActive(hash || CATEGORIES[0].id)
        stageRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const segmentOptions = [
    { label: t('common.all'), value: 'all', icon: <span>◈</span>, badge: '12' },
    { label: t('ref.inputs.ground'), value: 'ground', icon: <span>▼</span>, badge: '8' },
    { label: t('ref.inputs.air'), value: 'air', icon: <span>▲</span>, badge: '4' },
  ]
  const items: GalleryItem[] = galleryItems(t)
  // 画廊素材展示项
  const [albumFront, albumBack] = items

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
      <Block id="components-1" eyebrow={t('ref.actions.eyebrow')} title={t('ref.actions.title')} note={t('ref.actions.note')} api={DOC_REGISTRY['components-1']?.api}>
        {/* 这一排是「外观展台」：真实用途是让人看五个 variant 的差别，
            本来就没有业务动作。但死按钮会让人以为坏了，所以点任何一个都会
            把它的档位名写进下面的回显行 —— 有反馈，又不假装它有功能。 */}
        <div className="demo-row">
          <AkButton onClick={() => hitButton('default')}>{t('common.default')}</AkButton>
          <AkButton variant="outline" onClick={() => hitButton('outline')}>{t('common.outline')}</AkButton>
          <AkButton variant="action" onClick={() => hitButton('action')}>{t('common.action')}</AkButton>
          <AkButton variant="action" chamfer subtitle="DEPLOY" onClick={() => hitButton('action+chamfer')}>CHAMFER</AkButton>
          <AkButton variant="danger" subtitle="ABORT" onClick={() => hitButton('danger')}>RETREAT</AkButton>
          <AkButton variant="ghost" subtitle="PASSIVE" onClick={() => hitButton('ghost')}>GHOST</AkButton>
          <AkButton variant="advanced" onClick={() => hitButton('advanced')}>{t('common.advanced')}</AkButton>
          <AkButton variant="light" onClick={() => hitButton('light')}>{t('common.light')}</AkButton>
        </div>
        <div className="demo-row">
          <AkButton variant="action" chamfer subtitle="TACTICAL" icon={<span aria-hidden="true">◆</span>} onClick={() => hitButton('action+icon')}>
            {t('common.withIcon')}
          </AkButton>
          <AkButton variant="danger" chamfer subtitle="EMERGENCY" icon={<span aria-hidden="true">⚠</span>} onClick={() => hitButton('danger+icon')}>
            EMERGENCY
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

      <Block id="components-2" eyebrow={t('ref.menu.eyebrow')} title={t('ref.menu.title')} note={t('ref.menu.note')} api={DOC_REGISTRY['components-2']?.api}>
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

      <Block id="components-3" eyebrow={t('ref.surfaces.eyebrow')} title={t('ref.surfaces.title')} note={t('ref.surfaces.note')} api={DOC_REGISTRY['components-3']?.api}>
        <div className="demo-grid">
          <AkCard as="article" hoverable>
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
          <AkCard
            as="article"
            variant="outline"
            hoverable
            interactive
            selected={groupPick === 'A'}
            onClick={() => {
              playTactileSound('click')
              setGroupPick('A')
            }}
          >
            <AkCardHeader>
              <AkCardTitle>{t('card.outline.title')}</AkCardTitle>
              <AkCardDescription>interactive + selected</AkCardDescription>
            </AkCardHeader>
            {/* 这是给开发者看的 API 字面量，不是界面文案，所以不进字典。 */}
            <AkCardContent className="ak-text">
              {groupPick === 'A' ? 'SELECTED // 选中' : 'CLICK TO SELECT // 点击选中'}
            </AkCardContent>
          </AkCard>
          <AkCard as="article" variant="stripe">
            <AkCardHeader>
              <AkCardTitle>{t('card.stripe.title')}</AkCardTitle>
              <AkCardDescription>{t('card.stripe.desc')}</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">variant=&quot;stripe&quot;</AkCardContent>
          </AkCard>
          <AkCard as="article" variant="glass" chamfer hoverable>
            <AkCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AkCardTitle>HUD GLASS // 亚克力面板</AkCardTitle>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', color: 'var(--ak-signal-info)' }}>PRTS.HUD</span>
              </div>
              <AkCardDescription>variant=&quot;glass&quot; · 战术斜切 + 磨砂毛玻璃</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">
              半透明战术亚克力材质，融合 backdrop-filter 模糊与辉光边界。
            </AkCardContent>
            <AkCardFooter>
              <AkButton chamfer variant="ghost" size="sm" onClick={() => setCardDialog(true)}>
                INSPECT
              </AkButton>
            </AkCardFooter>
          </AkCard>
          <AkCard as="article" variant="tactical" chamfer hoverable>
            <AkCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AkCardTitle>TACTICAL // 战术终端</AkCardTitle>
                <AkBarcode />
              </div>
              <AkCardDescription>variant=&quot;tactical&quot; + chamfer · 4角发丝准星 + 战术光轨</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">
              搭载四角发丝级 L-Reticles、右上角切角、顶部全息信号条与深邃复合材质阴影。
            </AkCardContent>
            <AkCardFooter>
              <AkButton chamfer variant="action" size="sm" onClick={() => setCardDialog(true)}>
                TACTICAL VIEW
              </AkButton>
            </AkCardFooter>
          </AkCard>
          <AkCard as="article" variant="chassis" hoverable>
            <AkCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AkCardTitle>CHASSIS // 军工装甲板</AkCardTitle>
                <AkBarcode />
              </div>
              <AkCardDescription>variant=&quot;chassis&quot; · 边缘警戒斜纹 + 双轨金属轮廓</AkCardDescription>
            </AkCardHeader>
            <AkCardContent className="ak-text">
              军工重装机甲外壳，左侧警戒斜纹与凹刻双重金属框，专为重度工业与防暴系统设计。
            </AkCardContent>
            <AkCardFooter>
              <AkButton chamfer variant="action" size="sm" onClick={() => setCardDialog(true)}>
                ARMOR ENGAGE
              </AkButton>
            </AkCardFooter>
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

      <Block id="components-4" eyebrow={t('ref.feedback.eyebrow')} title={t('ref.feedback.title')} note={t('ref.feedback.note')} api={DOC_REGISTRY['components-4']?.api}>
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

      <Block id="components-5" eyebrow={t('ref.inputs.eyebrow')} title={t('ref.inputs.title')} note={t('ref.inputs.note')} api={DOC_REGISTRY['components-5']?.api}>
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
          <div className="demo-stack">
            <span className="demo-note">{t('ref.inputs.sizeTiers')}</span>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <AkInputNumber
                  key={s}
                  size={s}
                  value={slider}
                  max={100}
                  label={`${t('common.numberField')} ${s}`}
                  increaseLabel={t('common.increase')}
                  decreaseLabel={t('common.decrease')}
                  maxLabel={t('common.maxLabel')}
                  minLabel={t('common.minLabel')}
                  onValueChange={setSlider}
                />
              ))}
            </div>
          </div>
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

      <Block id="components-6" eyebrow={t('ref.navigation.eyebrow')} title={t('ref.navigation.title')} note={t('ref.navigation.note')} api={DOC_REGISTRY['components-6']?.api}>
        <AkTabs
          ariaLabel={t('ref.navigation.aria')}
          items={tabSpec.map((item, index) => ({
            value: item.value,
            label: t(item.label),
            icon: item.icon ? <span>{item.icon}</span> : undefined,
            badge: item.badge,
            eyebrow: t('ref.navigation.eyebrowText', { n: String(index + 1).padStart(3, '0') }),
            title: t(item.title),
            description: t(item.description),
          }))}
          value={tab}
          onValueChange={(v) => setTab(v ?? 'overview')}
          renderPanel={(item) => <p className="ak-text">{t('ref.navigation.panelBody', { value: String(item.title) })}</p>}
        />
      </Block>

      <Block id="components-7" eyebrow={t('ref.effects.eyebrow')} title={t('ref.effects.title')} note={t('ref.effects.note')} api={DOC_REGISTRY['components-7']?.api}>
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

      <Block id="components-8" eyebrow={t('ref.gallery.eyebrow')} title={t('ref.gallery.title')} note={t('ref.gallery.note')} api={DOC_REGISTRY['components-8']?.api}>
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

      <Block id="components-9" eyebrow={t('ref.site.eyebrow')} title={t('ref.site.title')} note={t('ref.site.note')} api={DOC_REGISTRY['components-9']?.api}>
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

      <Block id="components-10" eyebrow={t('ref.shell.eyebrow')} title={t('ref.shell.title')} note={t('ref.shell.note')} api={DOC_REGISTRY['components-10']?.api}>
        <SiteShellDemo />
      </Block>

      <Block id="components-11" eyebrow={t('ref.decor.eyebrow')} title={t('ref.decor.title')} note={t('ref.decor.note')} api={DOC_REGISTRY['components-11']?.api}>
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
            <AkReticle style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AkBarcode />
            </AkReticle>
            <AkReticle corners="four" tone="info" style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--ak-font-mono)', color: 'var(--ak-signal-info)' }}>LOCK // 4-RETICLE</span>
            </AkReticle>
            <AkReticle tone="action" style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--ak-font-mono)' }}>RETICLE</span>
            </AkReticle>
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
          {/* 战术全息激光线 Laser */}
          <div className="demo-stack" style={{ marginTop: 'var(--ak-space-4)', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', minWidth: '5rem', color: 'var(--ak-signal-info)' }}>LASER // INFO</span>
              <AkLaser tone="info" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', minWidth: '5rem', color: 'var(--ak-signal-action)' }}>LASER // ACTION</span>
              <AkLaser tone="action" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', minWidth: '5rem', color: 'var(--ak-signal-danger)' }}>LASER // DANGER</span>
              <AkLaser tone="danger" />
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
              <AkButton variant="outline" onClick={() => playTactileSound('click', 0.15)}>{t('common.glow')}</AkButton>
            </AkGlow>
            <AkGlow tone="action">
              <AkButton variant="action" onClick={() => playTactileSound('action', 0.2)}>{t('common.glowAction')}</AkButton>
            </AkGlow>
            <AkOutline color="var(--ak-signal-info)">
              <AkButton variant="outline" onClick={() => playTactileSound('dial', 0.15)}>{t('common.outlineRing')}</AkButton>
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

      <Block id="components-12" eyebrow={t('ref.arknights.eyebrow')} title={t('ref.arknights.title')} note={t('ref.arknights.note')} api={DOC_REGISTRY['components-12']?.api}>
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
          note={t('ref.controls.note')} api={DOC_REGISTRY['components-13']?.api}>
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

        <Block id="components-14" eyebrow={t('ref.form.eyebrow')} title={t('ref.form.title')} note={t('ref.form.note')} api={DOC_REGISTRY['components-14']?.api}>
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

        <div className="demo-row" style={{ alignItems: 'center' }}>
          <span className="demo-note">{t('ref.inputs.sizeTiers')}</span>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <AkChoice key={s} size={s} variant="switch" defaultChecked>
              {s}
            </AkChoice>
          ))}
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

        <Block id="components-15" eyebrow={t('ref.data.eyebrow')} title={t('ref.data.title')} note={t('ref.data.note')} api={DOC_REGISTRY['components-15']?.api}>
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

        <Block id="components-16" eyebrow={t('ref.collection.eyebrow')} title={t('ref.collection.title')} note={t('ref.collection.note')} api={DOC_REGISTRY['components-16']?.api}>
          <div className="demo-stack">
            <AkBreadcrumb
              items={[
                { label: t('common.breadcrumbHome'), href: '#shell-archive' },
                { label: t('common.breadcrumbRoster'), href: '#shell-archive' },
                { label: t('common.breadcrumbAmiya') },
              ]}
            />

            <div className="demo-row" style={{ alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <AkChoice
                variant="switch"
                checked={tableTactical}
                onChange={(e) => setTableTactical(e.target.checked)}
              >
                {t('ref.table.tactical')}
              </AkChoice>
              <AkChoice
                variant="switch"
                checked={tableStriped}
                onChange={(e) => setTableStriped(e.target.checked)}
              >
                {t('ref.table.striped')}
              </AkChoice>
              <AkChoice
                variant="switch"
                checked={tableSticky}
                onChange={(e) => setTableSticky(e.target.checked)}
              >
                {t('ref.table.sticky')}
              </AkChoice>
              <span className="demo-note">
                {t('ref.table.interactiveHint')} · {t('common.commandSelected')}: {selectedTableRow}
              </span>
            </div>

            <AkTable
              scrollable
              tactical={tableTactical}
              striped={tableStriped}
              stickyHeader={tableSticky}
              hoverable
              onRowClick={(row) => setSelectedTableRow(row.id)}
              columns={[
                { key: 'name', header: t('common.colName'), sort: tableSortKey === 'name' ? tableSortDir : 'none', onSortChange: () => handleTableSort('name') },
                { key: 'atk', header: t('common.colAtk'), numeric: true, sort: tableSortKey === 'atk' ? tableSortDir : 'none', onSortChange: () => handleTableSort('atk') },
                { key: 'def', header: t('common.colDef'), numeric: true, sort: tableSortKey === 'def' ? tableSortDir : 'none', onSortChange: () => handleTableSort('def') },
                { key: 'role', header: 'ROLE' },
              ]}
              rows={tableData.map((r) => ({
                id: r.id,
                cells: { name: r.name, atk: String(r.atk), def: String(r.def), role: r.role },
                selected: selectedTableRow === r.id,
              }))}
              footer={{ name: t('common.total'), atk: '2097', def: '1018', role: '4 UNITS' }}
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

      <Block id="components-17" eyebrow={t('ref.command.eyebrow')} title={t('ref.command.title')} note={t('ref.command.note')} api={DOC_REGISTRY['components-17']?.api}>
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
              icon={<span>✦</span>}
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
            <AkCommand
              label="STANDBY"
              meta="OFFLINE // 待机"
              disabled
              tone="dark"
              style={{ minHeight: '7.5rem' }}
            />
          </AkCommandGrid>

          {/* 干员槽位卡 (AkSlot) */}
          <div>
            <AkOverline>{t('ref.command.slotTitle')}</AkOverline>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(8.5rem, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <AkSlot
                name="SILVERASH"
                role="guard"
                rarity={6}
                rarityLabel="★★★★★★"
                code="GRD"
                meta="TSS // 真银斩"
                elite={2}
                level={90}
                reveal
                index={0}
                pressed={selectedSlot === 'silverash'}
                onClick={() => setSelectedSlot('silverash')}
              />
              <AkSlot
                name="AMIYA"
                role="caster"
                rarity={5}
                rarityLabel="★★★★★"
                code="CAS"
                meta="CHIMERA // 奇美拉"
                elite={1}
                level={80}
                reveal
                index={1}
                pressed={selectedSlot === 'amiya'}
                onClick={() => setSelectedSlot('amiya')}
              />
              <AkSlot
                name="SARIA"
                role="defender"
                rarity={6}
                rarityLabel="★★★★★★"
                code="DEF"
                meta="CALC // 钙质化"
                elite={2}
                level="LV.90"
                reveal
                index={2}
                pressed={selectedSlot === 'saria'}
                onClick={() => setSelectedSlot('saria')}
              />
              <AkSlot
                name="EYJA"
                role="caster"
                rarity={6}
                rarityLabel="★★★★★★"
                code="CAS"
                meta="VOLCANO // 点燃"
                elite={2}
                level={90}
                reveal
                index={3}
                pressed={selectedSlot === 'eyja'}
                onClick={() => setSelectedSlot('eyja')}
              />
              <AkSlot
                name="PURNIX"
                role="specialist"
                rarity={4}
                rarityLabel="★★★★"
                code="SPC"
                meta="REST // 休息中"
                elite={0}
                level={45}
                disabled
              />
              <AkSlot empty onClick={() => setSelectedSlot('empty')}>
                <span>+ ASSIGN</span>
              </AkSlot>
            </div>
          </div>

          {/* 材料与道具方块 (AkItem) */}
          <div>
            <AkOverline>{t('ref.command.itemTitle')}</AkOverline>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(6.5rem, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <AkItem
                tier={5}
                name="D32钢"
                count="x4"
                selected={selectedItem === 'D32'}
                onClick={() => setSelectedItem('D32')}
              />
              <AkItem
                tier={5}
                name="双极纳米片"
                count="x6"
                selected={selectedItem === 'nano'}
                onClick={() => setSelectedItem('nano')}
              />
              <AkItem
                tier={5}
                name="聚合剂"
                count="x3"
                selected={selectedItem === 'poly'}
                onClick={() => setSelectedItem('poly')}
              />
              <AkItem
                tier={4}
                name="改量装置"
                count="x12"
                selected={selectedItem === 'device'}
                onClick={() => setSelectedItem('device')}
              />
              <AkItem
                tier={3}
                name="锰矿"
                count="x28"
                selected={selectedItem === 'ore'}
                onClick={() => setSelectedItem('ore')}
              />
              <AkItem
                tier={2}
                name="糖"
                count="x84"
                disabled
              />
              <AkItem
                tier={4}
                name="龙门币"
                price="5,000"
                sold
              />
            </div>
          </div>

          {/* 终端大屏交互 (AkScreen) */}
          <div>
            <AkOverline>{t('ref.command.screenTitle')}</AkOverline>
            <div style={{ marginTop: '0.5rem' }}>
              <AkButton
                variant="action"
                icon={<span>⤢</span>}
                sound={false}
                onClick={(event) => {
                  event.currentTarget.focus()
                  setScreenOpen(true)
                }}
              >
                {t('screen.open')}
              </AkButton>
            </div>

            {screenOpen ? (
              <dialog className="demo-screen-dialog" ref={screenDialogRef} aria-label={t('screen.title')} onCancel={(event) => { event.preventDefault(); setScreenOpen(false) }} style={showcaseDialogStyle}>
                <AkScreen
                  tone="dark"
                  title="DEPOT & LOGISTICS // 罗德岛后勤与战术物资总览"
                  eyebrow="PRTS TERMINAL OS // SECTOR-07"
                  watermark="PRTS-DEPOT"
                  closeOnEsc={false}
                  status={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <AkStatus size="sm" variant="default" label="PRTS-LINKED" detail="LATENCY // 0.12ms" />
                      <span className="demo-screen-clearance">CLEARANCE: LV.4</span>
                    </div>
                  }
                  tokens={{ '--ak-screen-signal': '#ff5e19' }}
                  meta={
                    <div className="demo-screen-meta-row">
                      <div className="demo-screen-san-widget" title="SANITY // 罗德岛神经递质浓度">
                        <span className="demo-screen-san-icon" aria-hidden="true">⚡</span>
                        <span className="demo-screen-san-label">SAN</span>
                        <span className="demo-screen-san-val">{sanCurrent}/{sanTotal}</span>
                        <button
                          type="button"
                          className="demo-screen-san-btn"
                          aria-label={t('ref.san.add')}
                          onClick={() => {
                            playTactileSound('pip', 0.16)
                            setSanCurrent((v) => Math.min(sanLimit, v + 1))
                          }}
                        >
                          +
                        </button>
                      </div>
                      <AkCounter value="1,248,500" prefixIcon={<span style={{ color: '#ffd800' }}>⯁</span>} title="LMD // 龙门币" />
                      <AkCounter value="38,400" prefixIcon={<span style={{ color: '#ff5e19' }}>◆</span>} title="ORUNDUM // 合成玉" />
                      <AkCounter value="142" prefixIcon={<span style={{ color: '#4aabea' }}>◈</span>} title="ORIGINIUM // 至纯源石" />
                    </div>
                  }
                  onBack={() => {
                    setScreenOpen(false)
                  }}
                  backLabel={t('screen.back')}
                >
                  <div className="demo-screen-dashboard">
                    {/* 顶部搜索与分类过滤栏 */}
                    <div className="demo-screen-toolbar">
                      <div className="demo-screen-tabs" role="group" aria-label={t('screen.categories')}>
                        {[
                          { id: 'all' as const, label: t('screen.all'), count: DEPOT_ITEMS.length },
                          { id: 'materials' as const, label: t('screen.materials'), count: DEPOT_ITEMS.filter((i) => i.kind === 'material' && i.subCategory === 'materials').length },
                          { id: 'chips' as const, label: t('screen.chips'), count: DEPOT_ITEMS.filter((i) => i.kind === 'material' && i.subCategory === 'chips').length },
                          { id: 'operators' as const, label: t('screen.operators'), count: DEPOT_ITEMS.filter((i) => i.kind === 'operator').length },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            className={`demo-screen-tab ${screenCategory === cat.id ? 'is-active' : ''}`}
                            aria-pressed={screenCategory === cat.id}
                            onClick={() => {
                              playTactileSound('tab', 0.16)
                              setScreenCategory(cat.id)
                            }}
                          >
                            <span>{cat.label}</span>
                            <span className="demo-screen-tab__badge">{cat.count}</span>
                          </button>
                        ))}
                      </div>

                      <div className="demo-screen-search">
                        <label className="demo-screen-search-label" htmlFor="demo-screen-search">{t('screen.search')}</label>
                        <AkInput
                          id="demo-screen-search"
                          size="sm"
                          placeholder={t('screen.searchPlaceholder')}
                          value={screenSearch}
                          onChange={(e) => setScreenSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {screenNotice ? (
                      <div className="demo-screen-feedback" role="alert">
                        {screenNotice}
                      </div>
                    ) : null}

                    {/* 主体分栏：左侧资产网格，右侧战术检视面板 */}
                    <div className="ak-screen__split">
                      {/* 左侧库存网格 */}
                      <div className="demo-screen-inventory">
                        {filteredDepotItems.length === 0 ? (
                          <div className="demo-screen-empty" role="status">
                            <p>{t('screen.empty')}</p>
                            <button type="button" onClick={() => {
                              setScreenSearch('')
                              setScreenCategory('all')
                              document.getElementById('demo-screen-search')?.focus()
                            }}>{t('screen.reset')}</button>
                          </div>
                        ) : filteredDepotItems.map((item) => {
                          if (item.kind === 'material') {
                            const isSelected = selectedDepotItem?.id === item.id
                            const countVal = materialStock[item.id] ?? item.initialCount
                            return (
                              <AkItem
                                key={item.id}
                                tier={item.tier}
                                name={item.name}
                                count={`x${countVal}`}
                                price={item.price}
                                selected={isSelected}
                                onClick={() => {
                                  setSelectedDepotId(item.id)
                                }}
                              />
                            )
                          }
                          const isSelected = selectedDepotItem?.id === item.id
                          return (
                            <AkSlot
                              key={item.id}
                              role={item.role}
                              rarity={item.rarity}
                              elite={item.elite}
                              level={item.level}
                              code={item.code}
                              name={item.name}
                              rarityLabel={item.rarityLabel}
                              pressed={isSelected}
                              size="sm"
                              onClick={() => {
                                setSelectedDepotId(item.id)
                              }}
                            />
                          )
                        })}
                      </div>

                      {/* 右侧战术检视面板 */}
                      <div className="ak-screen__panel">
                        {selectedDepotItem ? (
                          <div className="demo-screen-inspect">
                            {/* 检视顶部：全息展示与主信息 */}
                            <div className="demo-screen-inspect__hero">
                              <div
                                className="demo-screen-inspect__crystal"
                                data-tier={selectedDepotItem.kind === 'material' ? selectedDepotItem.tier : undefined}
                                data-rarity={selectedDepotItem.kind === 'operator' ? selectedDepotItem.rarity : undefined}
                              >
                                {selectedDepotItem.kind === 'material' ? (
                                  <AkItem
                                    tier={selectedDepotItem.tier}
                                    name={selectedDepotItem.name}
                                    selected
                                    sound={false}
                                    style={{ border: 'none', background: 'transparent' }}
                                  />
                                ) : (
                                  <AkSlot
                                    role={selectedDepotItem.role}
                                    rarity={selectedDepotItem.rarity}
                                    elite={selectedDepotItem.elite}
                                    code={selectedDepotItem.code}
                                    pressed
                                    size="sm"
                                    sound={false}
                                    style={{ border: 'none', background: 'transparent' }}
                                  />
                                )}
                              </div>
                              <div className="demo-screen-inspect__info">
                                <div className="demo-screen-inspect__chips">
                                  {selectedDepotItem.kind === 'material' ? (
                                    <>
                                      <AkTag variant={selectedDepotItem.tier >= 5 ? 'advanced' : 'neutral'}>
                                        TIER {selectedDepotItem.tier}
                                      </AkTag>
                                      <span className="demo-screen-inspect__tag">
                                        STOCK: x{materialStock[selectedDepotItem.id] ?? selectedDepotItem.initialCount}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <AkTag variant="advanced">
                                        {selectedDepotItem.rarityLabel}
                                      </AkTag>
                                      <span className="demo-screen-inspect__tag">
                                        LV.{selectedDepotItem.level} // E{selectedDepotItem.elite}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <h3 className="demo-screen-inspect__name">{selectedDepotItem.name}</h3>
                                <span className="demo-screen-inspect__sub">
                                  {selectedDepotItem.nameEn} // ID: {selectedDepotItem.id.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {/* 物质描述或干员数值 */}
                            {selectedDepotItem.kind === 'material' ? (
                              <>
                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">SPECIFICATION ARCHIVE // 物性档案</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    {selectedDepotItem.desc}
                                  </div>
                                </div>

                                {selectedDepotItem.formula ? (
                                  <div className="demo-screen-inspect__section">
                                    <span className="demo-screen-inspect__sec-title">SYNTHESIS REQUIREMENTS // 合成配方需求</span>
                                    <div className="demo-screen-inspect__sec-body">
                                      <div>配方组合: {selectedDepotItem.formula.join(' + ')}</div>
                                      <div style={{ color: '#ffd800', marginTop: '0.2rem' }}>基础工时费用: {selectedDepotItem.formulaCost}</div>
                                    </div>
                                  </div>
                                ) : null}

                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">RECOMMENDED STAGE // 推荐产出扇区</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    {selectedDepotItem.drops.join(' · ')}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">COMBAT SPECIFICATIONS // 作战数据评定</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    生命上限: {selectedDepotItem.stats.hp} | 攻击力: {selectedDepotItem.stats.atk} | 防御力: {selectedDepotItem.stats.def} | 部署费用: {selectedDepotItem.stats.cost}
                                  </div>
                                </div>

                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">SIGNATURE TACTICAL TALENT // 核心战术专精</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    {selectedDepotItem.talent}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* 战术操作按钮组 */}
                            <div className="ak-screen__actions" style={{ marginTop: '0.5rem' }}>
                              {selectedDepotItem.kind === 'material' ? (
                                <>
                                   <AkButton
                                    variant="outline"
                                    size="sm"
                                    sound="pip"
                                    onClick={() => {
                                      showScreenNotice(`[SOURCE TRACE] 产出扇区锁定: ${selectedDepotItem.drops.join(' / ')}`)
                                    }}
                                  >
                                    TRACE SOURCE // 来源追踪
                                  </AkButton>
                                  <AkButton
                                    variant="default"
                                    size="sm"
                                    sound="confirm"
                                    onClick={() => {
                                      showScreenNotice(`[DISPATCH ORDER] 物资 ${selectedDepotItem.name} 已调拨至前线补给站`)
                                    }}
                                  >
                                    DISPATCH // 战术派遣
                                  </AkButton>
                                  <AkButton
                                    variant="action"
                                    size="sm"
                                    onClick={() => {
                                      setMaterialStock((prev) => ({
                                        ...prev,
                                        [selectedDepotItem.id]: (prev[selectedDepotItem.id] ?? 0) + 1,
                                      }))
                                      showScreenNotice(`[SYNTHESIZE SUCCESS] ${selectedDepotItem.name} +1 // 物质合成配方调配完成`)
                                    }}
                                  >
                                    SYNTHESIZE // 物质合成
                                  </AkButton>
                                </>
                              ) : (
                                <>
                                  <AkButton
                                    variant="outline"
                                    size="sm"
                                    sound="pip"
                                    onClick={() => {
                                      showScreenNotice(`[DOSSIER LINK] 档案解密完成: ${selectedDepotItem.meta} // 潜能活化正常`)
                                    }}
                                  >
                                    DOSSIER // 档案查阅
                                  </AkButton>
                                  <AkButton
                                    variant="default"
                                    size="sm"
                                    sound="elite"
                                    onClick={() => {
                                      showScreenNotice(`[ELITE UPGRADE] 干员 ${selectedDepotItem.name} 专精状态同步完成`)
                                    }}
                                  >
                                    PROMOTION // 专精强化
                                  </AkButton>
                                  <AkButton
                                    variant="action"
                                    size="sm"
                                    onClick={() => {
                                      showScreenNotice(`[DEPLOY READY] 干员 ${selectedDepotItem.name} 已入编第一战术先遣梯队`)
                                    }}
                                  >
                                    DEPLOY // 战术入队
                                  </AkButton>
                                </>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </AkScreen>
              </dialog>
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

  useEffect(() => {
    document.documentElement.dataset.akTheme = theme
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

          <details className="demo-settings">
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
