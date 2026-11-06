import { AkTabs } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue, MessageKey } from '../i18n'
import type { Tune } from '../example-tune'

export type NavigationModel = {
  t: I18nValue['t']
  tab: string
  setTab: Dispatch<SetStateAction<string>>
}

type TabSpecItem = {
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

export function renderNavigation({ t, tab, setTab }: NavigationModel, tune: Tune) {
  return tune('tabs-main', <AkTabs
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
    onValueChange={(value) => setTab(value ?? 'overview')}
    renderPanel={(item) => <p className="ak-text">{t('ref.navigation.panelBody', { value: String(item.title) })}</p>}
  />)
}
