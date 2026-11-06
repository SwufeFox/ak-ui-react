import { AkButton } from '../../ak'
import type { Tune } from '../example-tune'

type ActionsKey = 'common.default' | 'common.outline' | 'common.action' | 'common.advanced' | 'common.light' | 'common.withIcon' | 'common.block' | 'common.disabled' | 'ref.actions.hitLabel' | 'ref.actions.hitCount' | 'ref.actions.hitHint'

export type ActionsModel = {
  t: (key: ActionsKey, vars?: Record<string, string | number>) => string
  buttonHit: string
  buttonHits: number
  hitButton: (name: string) => void
}

export function renderActions({ t, buttonHit, buttonHits, hitButton }: ActionsModel, tune: Tune) {
  return <>
    <div className="demo-row">
      {tune('default', <AkButton onClick={() => hitButton('default')}>{t('common.default')}</AkButton>)}
      {tune('outline', <AkButton variant="outline" onClick={() => hitButton('outline')}>{t('common.outline')}</AkButton>)}
      {tune('action', <AkButton variant="action" onClick={() => hitButton('action')}>{t('common.action')}</AkButton>)}
      {tune('chamfer', <AkButton variant="action" chamfer subtitle="DEPLOY" onClick={() => hitButton('action+chamfer')}>CHAMFER</AkButton>)}
      {tune('danger', <AkButton variant="danger" subtitle="ABORT" onClick={() => hitButton('danger')}>RETREAT</AkButton>)}
      {tune('ghost', <AkButton variant="ghost" subtitle="PASSIVE" onClick={() => hitButton('ghost')}>GHOST</AkButton>)}
      {tune('advanced', <AkButton variant="advanced" onClick={() => hitButton('advanced')}>{t('common.advanced')}</AkButton>)}
      {tune('light', <AkButton variant="light" onClick={() => hitButton('light')}>{t('common.light')}</AkButton>)}
    </div>
    <div className="demo-row">
      {tune('action-icon', <AkButton variant="action" chamfer subtitle="TACTICAL" icon={<span aria-hidden="true">◆</span>} onClick={() => hitButton('action+icon')}>
        {t('common.withIcon')}
      </AkButton>)}
      {tune('danger-icon', <AkButton variant="danger" chamfer subtitle="EMERGENCY" icon={<span aria-hidden="true">⚠</span>} onClick={() => hitButton('danger+icon')}>
        EMERGENCY
      </AkButton>)}
      {tune('block', <AkButton variant="outline" block style={{ maxWidth: '16rem' }} onClick={() => hitButton('block')}>
        {t('common.block')}
      </AkButton>)}
      {tune('disabled', <AkButton disabled>{t('common.disabled')}</AkButton>)}
    </div>
    <p className="demo-note" aria-live="polite">
      {buttonHit ? `${t('ref.actions.hitLabel')}: ${buttonHit} · ${t('ref.actions.hitCount', { n: buttonHits })}` : t('ref.actions.hitHint')}
    </p>
  </>
}
