import { memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { AkButton, AkChoice, AkFieldLabel, AkInput, AkSelect, playTactileSound } from '../ak'
import type { BlockPropDoc } from './doc-data'
import { useI18n, type Locale } from './i18n'
import { createTuneSession, type ExampleFactory } from './example-tune'
import { pushReceipt, formatBytes } from './receipt'
import { tokenizeTsx } from './highlight'
import { CATEGORIES } from './catalogue-data'
import { StageContext } from './stage-context'
import { readViewParam, writeViewParam, type DemoView } from './view-param'

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
export const Block = memo(function Block({
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
  // 视图清单决定这一块有哪些标签页；地址栏里的 ?view= 只在清单里才算数。
  const views = ['preview', 'tune', 'code', ...(api ? ['api' as const] : [])] as const
  const [tab, setTab] = useState<DemoView>(() => {
    const wanted = readViewParam()
    const known = wanted && (views as readonly string[]).includes(wanted)
    return known ? (wanted as DemoView) : 'preview'
  })
  const [copyResult, setCopyResult] = useState<{ text: string; state: 'copied' | 'error' } | null>(null)
  const copyTimer = useRef<number | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, unknown>>({})
  const [previewExpanded, setPreviewExpanded] = useState(true)
  const [inspecting, setInspecting] = useState(false)
  const inspectButtonRef = useRef<HTMLButtonElement>(null)
  const inspectCloseRef = useRef<HTMLButtonElement>(null)
  const [resetVersion, setResetVersion] = useState(0)
  const [codeResult, setCodeResult] = useState<{ status: 'loading' | 'error' } | { status: 'ready'; text: string }>({ status: 'loading' })
  const codeCache = useRef<{ tree: ReactNode; exportCode: typeof exportCode; overrides: typeof overrides; locale: Locale; promise: Promise<string>; text?: string } | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const active = !stage || stage.active === id
  const overrideRegistry = stage?.overrides
  // 地址栏始终反映当前视图：代码页与属性页可以直接分享链接。
  useEffect(() => {
    if (!active) return
    writeViewParam(tab)
  }, [active, tab])

  // 全屏检视：支持的浏览器里用 View Transition 让预览面板「长」成整屏，
  // 面板与检视框共用同一个 view-transition-name，浏览器负责补间。
  const enterInspect = useCallback(() => {
    const start = document.startViewTransition
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof start === 'function') {
      start.call(document, () => flushSync(() => setInspecting(true)))
      return
    }
    setInspecting(true)
  }, [])
  const exitInspect = useCallback(() => {
    const start = document.startViewTransition
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof start === 'function') {
      start.call(document, () => flushSync(() => setInspecting(false)))
    } else {
      setInspecting(false)
    }
    window.setTimeout(() => inspectButtonRef.current?.focus(), 0)
  }, [])
  useEffect(() => {
    if (!inspecting) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inspectCloseRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        exitInspect()
        return
      }
      if (event.key !== 'Tab') return
      const dialog = inspectCloseRef.current?.closest<HTMLElement>('[role="dialog"]')
      if (!dialog) return
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href],area[href],button,input:not([type="hidden"]),select,textarea,summary,[tabindex],[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls]',
      )).filter((control) =>
        !control.matches(':disabled,[aria-hidden="true"],[inert]') &&
        control.tabIndex >= 0 &&
        control.getClientRects().length > 0,
      )
      const first = controls[0]
      const last = controls.at(-1)
      if (!first || !last) {
        event.preventDefault()
        return
      }
      const focusInside = dialog.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || !focusInside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !focusInside)) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey, true)
    }
  }, [inspecting, exitInspect])
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

  const copyCode = async () => {
    if (!codeReady) return
    const text = codeText
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(text)
      playTactileSound('confirm', 0.2)
      setCopyResult({ text, state: 'copied' })
      pushReceipt({ label: t('common.codeCopied'), detail: formatBytes(text.length) })
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
          <button type="button" className="demo-block__inspect" ref={inspectButtonRef} onClick={enterInspect} aria-haspopup="dialog">
            <span className="demo-block__inspect-glyph" aria-hidden="true">⤢</span>
            {t('common.inspect')}
          </button>
      </div>

      <div id={`${id}-workspace`} className="demo-tune-workspace" role="tabpanel" aria-labelledby={`${id}-tab-${tab === 'tune' ? 'tune' : 'preview'}`} data-tuning={tab === 'tune'} hidden={tab !== 'preview' && tab !== 'tune'}>
        <div className="demo-tune-preview-shell" data-expanded={previewExpanded} hidden={inspecting}>
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
          <AkButton type="button" variant="action" size="sm" sound={false} onClick={copyCode} disabled={!codeReady} aria-live="polite">{t(copyState === 'copied' ? 'common.codeCopied' : copyState === 'error' ? 'common.codeCopyError' : 'common.copyCode')}</AkButton>
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
                  <td><code className="demo-api-default" data-empty={item.default ? undefined : ''}>{item.default ?? '—'}</code></td>
                  <td className="demo-api-desc">{item.desc[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {inspecting ? (
        <div
          className="demo-inspect"
          role="dialog"
          aria-modal="true"
          aria-label={`${t('common.inspect')} — ${title}`}
          onClick={(event) => { if (event.target === event.currentTarget) exitInspect() }}
        >
          <div className="demo-inspect__frame">
            <div className="demo-inspect__bar">
              <span className="demo-inspect__eyebrow">{displayEyebrow}</span>
              <span className="demo-inspect__title">{title}</span>
              <button type="button" className="demo-inspect__close" ref={inspectCloseRef} onClick={exitInspect}>
                {t('common.close')} <span aria-hidden="true">⎋</span>
              </button>
            </div>
            <div className="demo-inspect__stage">{actualTree}</div>
          </div>
        </div>
      ) : null}
    </section>
  )
})
