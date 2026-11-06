import { AkButton, AkCollapsible, AkContextMenu, AkDropdownMenu, AkMenubar, AkMenuGroup, AkMenuSeparator, AkToolbar } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue, MessageKey } from '../i18n'
import type { Tune } from '../example-tune'

const MENU_ACTIONS: Record<string, true> = {
  inspect: true,
  deploy: true,
  cancel: true,
  archive: true,
  file: true,
  edit: true,
  view: true,
}

export type MenusModel = {
  t: I18nValue['t']
  selectedCommand: string
  setSelectedCommand: Dispatch<SetStateAction<string>>
  count: number
  setCount: Dispatch<SetStateAction<number>>
}

export function renderMenus({ t, selectedCommand, setSelectedCommand, count, setCount }: MenusModel, tune: Tune) {
  return <div className="demo-stack">
    <div className="demo-row">
      {tune('dropdown-menu', <AkDropdownMenu label={t('ref.menu.open')} items={[
        { label: t('ref.menu.inspect'), onSelect: () => setSelectedCommand('inspect') },
        { label: t('ref.menu.deploy'), onSelect: () => setSelectedCommand('deploy') },
        { label: t('ref.menu.disabled'), disabled: true },
        { label: t('ref.menu.cancel'), destructive: true, onSelect: () => setSelectedCommand('cancel') },
      ]} />)}
      {MENU_ACTIONS[selectedCommand] ? (
        <span className="demo-note">
          {t('ref.menu.lastAction')}: {t(`ref.menu.${selectedCommand}` as MessageKey)}
        </span>
      ) : null}
    </div>
    {tune('menubar', <AkMenubar aria-label={t('ref.menu.scope')}>
      {(['file', 'edit', 'view'] as const).map((item) => (
        <button key={item} type="button" role="menuitem" onClick={() => setSelectedCommand(item)}>
          {t(`ref.menu.${item}` as MessageKey)}
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
