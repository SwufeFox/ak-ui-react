import tuneSource from './example-tune.ts?raw'
import shellSource from './examples/shell.tsx?raw'
import type { ShellModel } from './examples/shell'
import type { TuneOverrides } from './example-tune'

const shellKeys = ['ref.shell.command', 'ref.shell.commandTitle', 'ref.shell.commandBody', 'ref.shell.archive', 'ref.shell.archiveTitle', 'ref.shell.archiveBody', 'ref.shell.relay', 'ref.shell.relayTitle', 'ref.shell.relayBody', 'ref.shell.headerEyebrow', 'ref.shell.sections', 'ref.shell.sectionLabel', 'ref.shell.sectionTag'] as const

export function exportShell(model: ShellModel, overrides: TuneOverrides): string {
  const messages = Object.fromEntries(shellKeys.map((key) => [key, model.t(key)]))
  const core = tuneSource.replace(/^import .*\n/, '')
  const example = shellSource.replace(/^import .*\n/gm, '')
  return `import { cloneElement, useEffect, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { AkSectionNavigator, AkTag } from '@swufefox/ak-ui-react'
import '@swufefox/ak-ui-react/style.css'

${core}
${example}
const messages: Record<string, string> = ${JSON.stringify(messages, null, 2)}
const overrides: TuneOverrides = ${JSON.stringify(overrides, null, 2)}

export default function Example() {
  const initial = useRef(${JSON.stringify(model.current)})
  const restoring = useRef(initial.current !== 'shell-command')
  const root = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(initial.current)
  const t: ShellModel['t'] = (key, vars) => (messages[key] ?? key).replace(/\\{(\\w+)\\}/g, (match, name: string) => vars && name in vars ? String(vars[name]) : match)
  const onChange = (id: string) => {
    if (restoring.current && id !== initial.current) return
    restoring.current = false
    setCurrent(id)
  }
  useLayoutEffect(() => {
    if (!restoring.current) return
    const viewport = root.current?.querySelector<HTMLElement>('[data-ak-section-viewport]')
    const section = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-ak-section]') ?? []).find((item) => item.id === initial.current)
    if (viewport && section) viewport.scrollTop += section.getBoundingClientRect().top - viewport.getBoundingClientRect().top - viewport.clientTop
  }, [])
  useEffect(() => {
    if (restoring.current) root.current?.querySelector('[data-ak-section-viewport]')?.dispatchEvent(new Event('scroll'))
  }, [])
  const { tune } = createTuneSession(overrides)
  return <div className="example-standalone" ref={root}><style>{':where(.example-standalone) .demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ak-space-3, 0.75rem); }'}</style>{renderShell({ t, current, setCurrent: onChange }, tune)}</div>
}
`
}
