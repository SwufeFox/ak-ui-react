import actions from './examples/actions.tsx?raw'
import menus from './examples/menus.tsx?raw'
import surfaces from './examples/surfaces.tsx?raw'
import feedback from './examples/feedback.tsx?raw'
import inputs from './examples/inputs.tsx?raw'
import navigation from './examples/navigation.tsx?raw'
import effects from './examples/effects.tsx?raw'
import gallery from './examples/gallery.tsx?raw'
import decor from './examples/decor.tsx?raw'
import shell from './examples/shell.tsx?raw'
import gameData from './examples/game-data.tsx?raw'
import controls from './examples/controls.tsx?raw'
import forms from './examples/forms.tsx?raw'
import readouts from './examples/readouts.tsx?raw'
import collections from './examples/collections.tsx?raw'
import { buildStandalone } from './example-export'
import type { Locale } from './i18n'
import type { TuneOverrides } from './example-tune'
const sources: Record<number, string> = { 1: actions, 2: menus, 3: surfaces, 4: feedback, 5: inputs, 6: navigation, 7: effects, 8: gallery, 11: decor, 12: gameData, 13: controls, 14: forms, 15: readouts, 16: collections }


/** The values are explicit snapshots of the long-lived showcase model. */
export function exportCategory(id: number, locale: Locale, overrides: TuneOverrides, snapshot: Record<string, unknown>): string {
  const value = (key: string) => JSON.stringify(snapshot[key])
  let setup = ''
  let render = ''
  let additionalSource = ''
  let extraKeys: string[] = []
  switch (id) {
    case 1:
      setup = `const [buttonHit, setButtonHit] = useState(${value('buttonHit')}); const [buttonHits, setButtonHits] = useState(${value('buttonHits')}); const hitButton = (name: string) => { setButtonHit(name); setButtonHits((count) => count + 1) }`
      render = `{renderActions({ t, buttonHit, buttonHits, hitButton }, tune)}`
      break
    case 2:
      setup = `const [selectedCommand, setSelectedCommand] = useState(${value('selectedCommand')}); const [count, setCount] = useState(${value('count')})`
      render = `{renderMenus({ t, selectedCommand, setSelectedCommand, count, setCount }, tune)}`
      extraKeys = ['inspect', 'deploy', 'cancel', 'archive', 'file', 'edit', 'view'].map((name) => `ref.menu.${name}`)
      break
    case 3:
      setup = `const [groupPick, setGroupPick] = useState<'A' | 'B' | 'C'>(${value('groupPick')}); const [cardDialog, setCardDialog] = useState(${value('cardDialog')})`
      render = `{renderSurfaces({ t, groupPick, setGroupPick, cardDialog, setCardDialog }, tune)}`
      break
    case 4:
      render = `{renderFeedback({ t }, tune)}`
      break
    case 5:
      setup = `const [slider, setSlider] = useState(${value('slider')}); const [segment, setSegment] = useState(${value('segment')})`
      render = `{renderInputs({ t, slider, setSlider, segment, setSegment }, tune)}`
      break
    case 6:
      setup = `const [tab, setTab] = useState(${value('tab')})`
      render = `{renderNavigation({ t, tab, setTab }, tune)}`
      break
    case 7:
      setup = `const [count, setCount] = useState(${value('count')}); const entranceRef = useRef<AkEntranceHandle>(null)`
      render = `{renderEffects({ t, count, setCount, entranceRef }, tune)}`
      break
    case 8:
      setup = `const [galleryIndex, setGalleryIndex] = useState(${value('galleryIndex')}); const items: GalleryItem[] = ${value('items')}`
      render = `{renderGallery({ t, galleryIndex, setGalleryIndex, items }, tune)}`
      break
    case 11:
      additionalSource = shell
      setup = `const [current, setCurrent] = useState('shell-command'); const [showShell, setShowShell] = useState(() => typeof window !== 'undefined' && window.location.hash === '#components-10'); useEffect(() => { const update = () => setShowShell(window.location.hash === '#components-10'); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])`
      render = `{showShell ? <section id="components-10">{renderShell({ t, current, setCurrent }, createTuneSession(${value('shellOverrides')}).tune)}</section> : renderDecor({ t }, tune)}`
      break
    case 12:
      setup = `const [skillLevel, setSkillLevel] = useState<AkSkillLevel>(${value('skillLevel')})`
      render = `{renderGameData({ t, skillLevel, setSkillLevel }, tune)}`
      break
    case 13:
      setup = `const [groupPick, setGroupPick] = useState<'A' | 'B' | 'C'>(${value('groupPick')}); const [pageIndex, setPageIndex] = useState(${value('pageIndex')})`
      render = `{renderControls({ t, groupPick, setGroupPick, pageIndex, setPageIndex }, tune)}`
      break
    case 14:
      setup = `const [fieldName, setFieldName] = useState(${value('fieldName')}); const [selectPick, setSelectPick] = useState(${value('selectPick')}); const [noteText, setNoteText] = useState(${value('noteText')}); const [choiceA, setChoiceA] = useState(${value('choiceA')}); const [choiceB, setChoiceB] = useState(${value('choiceB')})`
      render = `{renderForms({ t, fieldName, setFieldName, selectPick, setSelectPick, noteText, setNoteText, choiceA, setChoiceA, choiceB, setChoiceB }, tune)}`
      break
    case 15:
      setup = `const [sanCurrent, setSanCurrent] = useState(${value('sanCurrent')}); const sanTotal = ${value('sanTotal')}; const sanLimit = ${value('sanLimit')}; const [loadingReady, setLoadingReady] = useState(${value('loadingReady')}); const [dialogOpen, setDialogOpen] = useState(${value('dialogOpen')})`
      render = `{renderReadouts({ t, sanCurrent, setSanCurrent, sanTotal, sanLimit, loadingReady, setLoadingReady, dialogOpen, setDialogOpen }, tune)}`
      break
    case 16:
      additionalSource = `import { playTactileSound } from '../../ak'\n`
      setup = `const [selectedTableRow, setSelectedTableRow] = useState(${value('selectedTableRow')}); const [tableStriped, setTableStriped] = useState(${value('tableStriped')}); const [tableTactical, setTableTactical] = useState(${value('tableTactical')}); const [tableSticky, setTableSticky] = useState(${value('tableSticky')}); const [tableSortKey, setTableSortKey] = useState<'name' | 'atk' | 'def'>(${value('tableSortKey')}); const [tableSortDir, setTableSortDir] = useState<'ascending' | 'descending' | 'none'>(${value('tableSortDir')}); const tableData = sortTableRows(tableSortKey, tableSortDir); const handleTableSort = (key: 'name' | 'atk' | 'def') => { playTactileSound('dial', 0.15); setTableSortDir(nextTableSort(tableSortKey, tableSortDir, key)); setTableSortKey(key) }`
      render = `{renderCollections({ t, selectedTableRow, setSelectedTableRow, tableStriped, setTableStriped, tableTactical, setTableTactical, tableSticky, setTableSticky, tableSortKey, tableSortDir, handleTableSort, tableData }, tune)}`
      break
    default: throw new Error(`No standalone example for category ${id}`)
  }
  const source = sources[id]
  if (!source) throw new Error(`No authored source for category ${id}`)
  return buildStandalone({ source, locale, overrides, setup, render, extraKeys, additionalSource })
}
