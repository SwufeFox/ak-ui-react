import { AkAssetLoader, AkButton, AkMobileMenu, type AkMobileMenuHandle } from '../../ak'
import type { MouseEvent } from 'react'
import type { Tune } from '../example-tune'

type SiteKey = 'common.resources' | 'common.retry' | 'common.status.idle' | 'common.status.loading' | 'common.status.ready' | 'common.status.error' | 'common.status.cancelled' | 'ref.site.openMenu' | 'common.menu' | 'common.close'
export type SiteModel = {
  t: (key: SiteKey) => string
  mobileMenuRef: { current: AkMobileMenuHandle | null }
  selectCategory: (id: string, focusDestination?: boolean) => void
}

export function renderSite({ t, mobileMenuRef, selectCategory }: SiteModel, tune: Tune) {
  const navigate = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    selectCategory(id, event.detail === 0)
    mobileMenuRef.current?.close()
  }
  return <div className="demo-stack">
    {tune('loader', <AkAssetLoader
      label={t('common.resources')}
      retryLabel={t('common.retry')}
      statusLabels={{ idle: t('common.status.idle'), loading: t('common.status.loading'), ready: t('common.status.ready'), error: t('common.status.error'), cancelled: t('common.status.cancelled') }}
      tasks={[
        () => new Promise((resolve) => setTimeout(resolve, 400)),
        () => new Promise((resolve) => setTimeout(resolve, 900)),
        () => new Promise((resolve) => setTimeout(resolve, 1500)),
      ]}
    />)}
    <div>
      {tune('open-menu', <AkButton variant="action" icon={<span>☰</span>} onClick={() => mobileMenuRef.current?.open()}>
        {t('ref.site.openMenu')} // OPEN MOBILE MENU
      </AkButton>)}
    </div>
    <div>
      {tune('mobile-menu', <AkMobileMenu ref={mobileMenuRef} label={t('common.menu')} closeLabel={t('common.close')}>
        <a className="ak-nav__link" href="#components-1" onClick={navigate('components-1')}>01 // ACTIONS &amp; BUTTONS</a>
        <a className="ak-nav__link" href="#components-2" onClick={navigate('components-2')}>02 // MENUS &amp; POPOVERS</a>
        <a className="ak-nav__link" href="#components-4" onClick={navigate('components-4')}>04 // FEEDBACK &amp; PROGRESS</a>
        <a className="ak-nav__link" href="#components-9" onClick={navigate('components-9')}>09 // SITE SHELL &amp; LOADERS</a>
        <a className="ak-nav__link" href="#components-17" onClick={navigate('components-17')}>17 // COMMAND &amp; SCREENS</a>
      </AkMobileMenu>)}
    </div>
  </div>
}
