import { AkButton, AkCollapsible, AkContextMenu, AkDropdownMenu, AkMenubar, AkMenuGroup, AkMenuSeparator, AkToolbar } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue, MessageKey } from '../i18n'
import type { Tune } from '../example-tune'

/**
 * Menu actions map to translation keys explicitly so renaming a key breaks the build.
 * `selectedCommand` is shared with the command deck and holds values that have no menu
 * label, so unknown actions must resolve to `undefined` rather than a made-up key.
 */
const MENU_ACTION_LABELS: Partial<Record<string, MessageKey>> = {
  inspect: 'ref.menu.inspect',
  deploy: 'ref.menu.deploy',
  cancel: 'ref.menu.cancel',
  archive: 'ref.menu.archive',
  file: 'ref.menu.file',
  edit: 'ref.menu.edit',
  view: 'ref.menu.view',
}

const MENUBAR_ITEMS = [
  { action: 'file', label: 'ref.menu.file' },
  { action: 'edit', label: 'ref.menu.edit' },
  { action: 'view', label: 'ref.menu.view' },
] as const satisfies readonly { action: string; label: MessageKey }[]

export type MenusModel = {
  t: I18nValue['t']
  selectedCommand: string
  setSelectedCommand: Dispatch<SetStateAction<string>>
  count: number
  setCount: Dispatch<SetStateAction<number>>
}

export function renderMenus({ t, selectedCommand, setSelectedCommand, count, setCount }: MenusModel, tune: Tune) {
  const lastActionLabel = MENU_ACTION_LABELS[selectedCommand]
  return <div className="demo-stack">
    <div className="demo-row">
      {tune('dropdown-menu', <AkDropdownMenu label={t('ref.menu.open')} items={[
        { label: t('ref.menu.inspect'), onSelect: () => setSelectedCommand('inspect') },
        { label: t('ref.menu.deploy'), onSelect: () => setSelectedCommand('deploy') },
        { label: t('ref.menu.disabled'), disabled: true },
        { label: t('ref.menu.cancel'), destructive: true, onSelect: () => setSelectedCommand('cancel') },
      ]} />)}
      {lastActionLabel ? (
        <span className="demo-note">
          {t('ref.menu.lastAction')}: {t(lastActionLabel)}
        </span>
      ) : null}
    </div>
    {tune('menubar', <AkMenubar aria-label={t('ref.menu.scope')}>
      {MENUBAR_ITEMS.map(({ action, label }) => (
        <button key={action} type="button" role="menuitem" onClick={() => setSelectedCommand(action)}>
          {t(label)}
        </button>
      ))}
    </AkMenubar>)}
    {tune('toolbar', <AkToolbar label={t('ref.menu.scope')}>
      {tune('toolbar-bold', <AkButton variant="outline" onClick={() => setCount((value) => value + 1)}>{t('ref.menu.bold')}</AkButton>)}
      {tune('toolbar-archive', <AkButton variant="outline" onClick={() => setSelectedCommand('archive')}>{t('ref.menu.archive')}</AkButton>)}
      <span className="demo-note">{t('ref.menu.toolbarCount', { n: count })}</span>
    </AkToolbar>)}
    {tune('context-menu', <AkContextMenu items={[
      { label: t('ref.menu.inspect'), onSelect: () => setSelectedCommand('inspect') },
      { label: t('ref.menu.archive'), onSelect: () => setSelectedCommand('archive') },
    ]}>
      <div className="demo-menu-target">
        <span>{t('ref.menu.context')}</span>
        <em>{t('ref.menu.contextHint')}</em>
      </div>
    </AkContextMenu>)}
    <div className="demo-panel" style={{ maxWidth: '22rem' }}>
      {tune('menu-group-primary', <AkMenuGroup label={t('ref.menu.group')}>
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
      </AkMenuGroup>)}
      {tune('menu-separator', <AkMenuSeparator />)}
      {tune('menu-group-destructive', <AkMenuGroup>
        <button type="button" role="menuitem" className="ak-menu__item" data-destructive onClick={() => setSelectedCommand('cancel')}>
          <span>{t('ref.menu.cancel')}</span>
          <kbd>⎋</kbd>
        </button>
      </AkMenuGroup>)}
    </div>
    {tune('collapsible', <AkCollapsible title={t('ref.menu.disclosure')}>
      <p>{t('ref.menu.body')}</p>
    </AkCollapsible>)}
  </div>
}
