import commandSource from './command.tsx?raw'
import commandModelSource from './command-model.ts?raw'
import tuneSource from '../example-tune.ts?raw'
import type { DepotCategory } from './command-model'
import type { TuneOverrides } from '../example-tune'

export type CommandSnapshot = {
  selectedCommand: string
  selectedSlot: string
  selectedItem: string
  screenOpen: boolean
  screenCategory: DepotCategory
  screenSearch: string
  selectedDepotId: string
  materialStock: Record<string, number>
  screenNotice: string | null
  screenNoticeExpiresAt: number | null
  sanCurrent: number
  sanTotal: number
  sanLimit: number
}

export function exportCommand(
  snapshot: CommandSnapshot,
  overrides: TuneOverrides,
  messages: Record<string, string>,
  css: string,
): string {
  const core = tuneSource.replace(/^import[^\r\n]*\r?\n/, '')
  const example = [commandModelSource, commandSource].map((source) => source.replace(/^import[^\r\n]*\r?\n/gm, '')).join('\n')
  const initialSnapshot = JSON.stringify(snapshot, null, 2)
  const copiedMessages = JSON.stringify(messages, null, 2)
  const copiedOverrides = JSON.stringify(overrides, null, 2)
  const exampleStyles = JSON.stringify(css)

  return `import { cloneElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type ReactElement, type ReactNode, type SetStateAction } from 'react'
import { AkButton, AkCommandGrid, AkCommand, AkCommandGroup, AkOverline, AkSlot, AkItem, AkScreen, AkStatus, AkCounter, AkInput, AkTag, playTactileSound, type AkSlotRole, type AkSlotRarity } from '@swufefox/ak-ui-react'
import '@swufefox/ak-ui-react/style.css'

export type I18nValue = { t: (key: string, vars?: Record<string, string | number>) => string }
${core}
${example}
const messages: Record<string, string> = ${copiedMessages}
const overrides: TuneOverrides = ${copiedOverrides}
type CommandSnapshot = {
  selectedCommand: string
  selectedSlot: string
  selectedItem: string
  screenOpen: boolean
  screenCategory: DepotCategory
  screenSearch: string
  selectedDepotId: string
  materialStock: Record<string, number>
  screenNotice: string | null
  screenNoticeExpiresAt: number | null
  sanCurrent: number
  sanTotal: number
  sanLimit: number
}
const initialSnapshot: CommandSnapshot = ${initialSnapshot}
const exampleStyles = ${exampleStyles}

export default function Example() {
  const [selectedCommand, setSelectedCommand] = useState(initialSnapshot.selectedCommand)
  const [selectedSlot, setSelectedSlot] = useState(initialSnapshot.selectedSlot)
  const [selectedItem, setSelectedItem] = useState(initialSnapshot.selectedItem)
  const [screenOpen, setScreenOpen] = useState(initialSnapshot.screenOpen)
  const [screenCategory, setScreenCategory] = useState<DepotCategory>(initialSnapshot.screenCategory)
  const [screenSearch, setScreenSearch] = useState(initialSnapshot.screenSearch)
  const [selectedDepotId, setSelectedDepotId] = useState(initialSnapshot.selectedDepotId)
  const [materialStock, setMaterialStock] = useState<Record<string, number>>(initialSnapshot.materialStock)
  const { screenNotice, showScreenNotice } = useCommandNotice(initialSnapshot.screenNotice, initialSnapshot.screenNoticeExpiresAt)
  const [sanCurrent, setSanCurrent] = useState(initialSnapshot.sanCurrent)
  const sanTotal = initialSnapshot.sanTotal
  const sanLimit = initialSnapshot.sanLimit
  const filteredDepotItems = useMemo(() => filterDepotItems(screenCategory, screenSearch), [screenCategory, screenSearch])

  const selectedDepotItem = filteredDepotItems.find((item) => item.id === selectedDepotId) ?? filteredDepotItems[0]
  const screenDialogRef = useShowcaseDialog(screenOpen)
  const t: CommandModel['t'] = (key, vars) => (messages[key] ?? key).replace(/\\{(\\w+)\\}/g, (match, name: string) => vars && name in vars ? String(vars[name]) : match)
  const { tune } = createTuneSession(overrides)

  return <div className="example-standalone"><style>{exampleStyles}</style>{renderCommand({
    t,
    selectedCommand,
    setSelectedCommand,
    selectedSlot,
    setSelectedSlot,
    selectedItem,
    setSelectedItem,
    screenOpen,
    setScreenOpen,
    screenDialogRef,
    screenCategory,
    setScreenCategory,
    screenSearch,
    setScreenSearch,
    selectedDepotItem,
    setSelectedDepotId,
    filteredDepotItems,
    materialStock,
    setMaterialStock,
    screenNotice,
    showScreenNotice,
    sanCurrent,
    setSanCurrent,
    sanTotal,
    sanLimit,
    showcaseDialogStyle,
  }, tune)}</div>
}
`
}
