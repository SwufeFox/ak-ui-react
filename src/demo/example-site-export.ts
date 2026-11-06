import site from './examples/site.tsx?raw'
import actions from './examples/actions.tsx?raw'
import menus from './examples/menus.tsx?raw'
import feedback from './examples/feedback.tsx?raw'
import effects from './examples/effects.tsx?raw'
import readouts from './examples/readouts.tsx?raw'
import command from './examples/command.tsx?raw'
import type { CommandSnapshot } from './examples/command-export'
import type { Locale } from './i18n'
import type { TuneOverrides } from './example-tune'
import { buildStandalone } from './example-export'

type SiteSnapshot = CommandSnapshot & {
  buttonHit: string
  buttonHits: number
  count: number
  loadingReady: boolean
  dialogOpen: boolean
}

/** Bundle the actual destinations with the shared model captured when Code is opened. */
export function exportSite(locale: Locale, overrides: TuneOverrides, destinationOverrides: Record<string, TuneOverrides>, snapshot: SiteSnapshot): string {
  const initial = JSON.stringify(snapshot, null, 2)
  const maps = JSON.stringify(destinationOverrides, null, 2)
  const setup = `const initial = ${initial} as const
  const destinationOverrides: Record<string, TuneOverrides> = ${maps}
  const destinations = ['components-1', 'components-2', 'components-4', 'components-7', 'components-9', 'components-15', 'components-17']
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return 'components-9'
    const id = window.location.hash.slice(1)
    return destinations.includes(id) ? id : 'components-9'
  })
  const stageRef = useRef<HTMLDivElement>(null)
  const focusDestination = useRef(false)
  const [focusRequest, setFocusRequest] = useState(0)
  useLayoutEffect(() => {
    if (!focusDestination.current) return
    focusDestination.current = false
    stageRef.current?.querySelector<HTMLElement>('section')?.focus({ preventScroll: true })
  }, [active, focusRequest])
  const mobileMenuRef = useRef<AkMobileMenuHandle>(null)
  const entranceRef = useRef<AkEntranceHandle>(null)
  const [buttonHit, setButtonHit] = useState<string>(initial.buttonHit)
  const [buttonHits, setButtonHits] = useState<number>(initial.buttonHits)
  const hitButton = (name: string) => { setButtonHit(name); setButtonHits((n) => n + 1) }
  const [count, setCount] = useState<number>(initial.count)
  const [selectedCommand, setSelectedCommand] = useState<string>(initial.selectedCommand)
  const [selectedSlot, setSelectedSlot] = useState<string>(initial.selectedSlot)
  const [selectedItem, setSelectedItem] = useState<string>(initial.selectedItem)
  const [screenOpen, setScreenOpen] = useState<boolean>(initial.screenOpen)
  const screenDialogRef = useShowcaseDialog(screenOpen)
  const [screenCategory, setScreenCategory] = useState<DepotCategory>(initial.screenCategory)
  const [screenSearch, setScreenSearch] = useState<string>(initial.screenSearch)
  const [selectedDepotId, setSelectedDepotId] = useState<string>(initial.selectedDepotId)
  const [materialStock, setMaterialStock] = useState<Record<string, number>>(initial.materialStock)
  const { screenNotice, showScreenNotice } = useCommandNotice(initial.screenNotice, initial.screenNoticeExpiresAt)
  const [sanCurrent, setSanCurrent] = useState<number>(initial.sanCurrent)
  const sanTotal = initial.sanTotal
  const sanLimit = initial.sanLimit
  const [loadingReady, setLoadingReady] = useState<boolean>(initial.loadingReady)
  const [dialogOpen, setDialogOpen] = useState<boolean>(initial.dialogOpen)
  const filteredDepotItems = useMemo(() => filterDepotItems(screenCategory, screenSearch), [screenCategory, screenSearch])
  const selectedDepotItem = filteredDepotItems.find((item) => item.id === selectedDepotId) ?? filteredDepotItems[0]
  const selectCategory = (id: string, focus = false) => {
    if (!destinations.includes(id)) return
    if (focus && id !== active) { focusDestination.current = true; setFocusRequest((request) => request + 1) }
    setActive(id)
    if (window.location.hash !== '#' + id) window.history.pushState(null, '', window.location.pathname + window.location.search + '#' + id)
    stageRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }
  useEffect(() => {
    const update = () => { const id = window.location.hash.slice(1); setActive(destinations.includes(id) ? id : 'components-9') }
    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update) }
  }, [])
  const destinationTune = (id: string) => createTuneSession(destinationOverrides[id] ?? {}).tune`
  const render = `<div ref={stageRef}>
    <nav aria-label={t('ref.catalogue.title')}>
      {([
        ['components-1', t('ref.actions.title')], ['components-2', t('ref.menu.title')],
        ['components-4', t('ref.feedback.title')], ['components-7', t('ref.effects.title')],
        ['components-9', t('ref.site.title')], ['components-15', t('ref.data.title')],
        ['components-17', t('ref.command.title')],
      ] as const).map(([id, label]) => <a key={id} href={'#' + id} aria-current={active === id ? 'page' : undefined} onClick={(event) => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); selectCategory(id, event.detail === 0) } }}>{label} </a>)}
    </nav>
    <section id={active} tabIndex={-1} aria-label={t('ref.catalogue.title')}>
      {active === 'components-1' ? renderActions({ t, buttonHit, buttonHits, hitButton }, destinationTune(active))
        : active === 'components-2' ? renderMenus({ t, selectedCommand, setSelectedCommand, count, setCount }, destinationTune(active))
        : active === 'components-4' ? renderFeedback({ t }, destinationTune(active))
        : active === 'components-7' ? renderEffects({ t, count, setCount, entranceRef }, destinationTune(active))
        : active === 'components-15' ? renderReadouts({ t, sanCurrent, setSanCurrent, sanTotal, sanLimit, loadingReady, setLoadingReady, dialogOpen, setDialogOpen }, destinationTune(active))
        : active === 'components-17' ? renderCommand({ t, selectedCommand, setSelectedCommand, selectedSlot, setSelectedSlot, selectedItem, setSelectedItem, screenOpen, setScreenOpen, screenDialogRef, screenCategory, setScreenCategory, screenSearch, setScreenSearch, selectedDepotItem, setSelectedDepotId, filteredDepotItems, materialStock, setMaterialStock, screenNotice, showScreenNotice, sanCurrent, setSanCurrent, sanTotal, sanLimit, showcaseDialogStyle }, destinationTune(active))
        : renderSite({ t, mobileMenuRef, selectCategory }, tune)}
    </section>
  </div>`
  return buildStandalone({ source: site, locale, overrides, setup, render, additionalSource: [actions, menus, feedback, effects, readouts, command].join('\n'), extraKeys: ['inspect', 'deploy', 'cancel', 'archive', 'file', 'edit', 'view'].map((name) => `ref.menu.${name}`) })
}
