import { AkSectionNavigator, AkTag } from '../../ak'
import type { Tune } from '../example-tune'

type ShellKey = 'ref.shell.command' | 'ref.shell.commandTitle' | 'ref.shell.commandBody' | 'ref.shell.archive' | 'ref.shell.archiveTitle' | 'ref.shell.archiveBody' | 'ref.shell.relay' | 'ref.shell.relayTitle' | 'ref.shell.relayBody' | 'ref.shell.headerEyebrow' | 'ref.shell.sections' | 'ref.shell.sectionLabel' | 'ref.shell.sectionTag'
const shellSections = [
  { id: 'shell-command', label: 'ref.shell.command', title: 'ref.shell.commandTitle', body: 'ref.shell.commandBody' },
  { id: 'shell-archive', label: 'ref.shell.archive', title: 'ref.shell.archiveTitle', body: 'ref.shell.archiveBody' },
  { id: 'shell-relay', label: 'ref.shell.relay', title: 'ref.shell.relayTitle', body: 'ref.shell.relayBody' },
] as const

export type ShellModel = {
  t: (key: ShellKey, vars?: Record<string, string | number>) => string
  current: string
  setCurrent: (id: string) => void
}

export function renderShell({ t, current, setCurrent }: ShellModel, tune: Tune) {
  const sections = shellSections.map((section) => ({ id: section.id, label: t(section.label), title: t(section.title), body: t(section.body) }))
  return <div className="demo-shell">
    {tune('navigator', <AkSectionNavigator syncHash={false} onChange={setCurrent}>
      <header className="ak-site__header">
        <span className="ak-site__eyebrow">{t('ref.shell.headerEyebrow')}</span>
        <nav className="ak-site__nav" aria-label={t('ref.shell.sections')}>
          {sections.map((section) => <a key={section.id} href={`#${section.id}`} data-ak-section-link aria-current={current === section.id ? 'location' : undefined}>{section.label}</a>)}
        </nav>
      </header>
      <div className="ak-site__viewport" data-ak-section-viewport>
        {sections.map((section, index) => <section key={section.id} id={section.id} className="ak-site__section" data-ak-section>
          <div data-ak-section-content>
            <span className="ak-site__eyebrow">{t('ref.shell.sectionLabel', { label: section.label })}</span>
            <h2>{section.title}</h2>
            <p className="ak-text">{section.body}</p>
            <div className="demo-row">{tune(`section-tag-${section.id}`, <AkTag variant="advanced">{t('ref.shell.sectionTag', { n: index + 1, m: sections.length })}</AkTag>)}</div>
          </div>
        </section>)}
      </div>
    </AkSectionNavigator>)}
  </div>
}
