import { AkBrackets, AkButton, AkCodeId, AkCountUp, AkDepth, AkDepthLayer, AkDisplay, AkEntrance, AkParticleField } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { AkEntranceHandle } from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type EffectsModel = {
  t: I18nValue['t']
  count: number
  setCount: Dispatch<SetStateAction<number>>
  entranceRef: { current: AkEntranceHandle | null }
}

export function renderEffects({ t, count, setCount, entranceRef }: EffectsModel, tune: Tune) {
  return <div className="demo-stack">
    <div className="demo-row">
      <span style={{ fontSize: '2rem' }}>
        {tune('count-up', <AkCountUp value={count} duration={900} />)}
      </span>
      {tune('count-up-add', <AkButton variant="outline" onClick={() => setCount((value) => value + 256)}>+256</AkButton>)}
      {tune('count-up-reset', <AkButton variant="outline" onClick={() => setCount(0)}>{t('common.reset')}</AkButton>)}
    </div>
    <div className="demo-canvas">
      {tune('particle-field', <AkParticleField count={70} pattern="orbit" renderer="auto" />)}
      <span className="demo-canvas-label">{t('ref.effects.canvas')}</span>
    </div>
    <div className="demo-panel">
      <div className="demo-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {tune('entrance-code-id', <AkCodeId>AkEntrance</AkCodeId>)}
        {tune('entrance-replay', <AkButton variant="outline" size="sm" onClick={() => entranceRef.current?.replay()}>
          {t('ref.effects.replay')}
        </AkButton>)}
      </div>
      {tune('entrance', <AkEntrance ref={entranceRef} style={{ marginTop: 'var(--ak-space-2, 0.5rem)' }}>
        <div style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--ak-signal-info)', background: 'var(--ak-surface-sunken-2)' }}>
          {tune('entrance-display', <AkDisplay>PRTS // TACTICAL ENTRANCE</AkDisplay>)}
          <p style={{ margin: '0.35rem 0 0', color: 'var(--ak-text-secondary)', fontSize: '0.82rem' }}>
            {t('ref.effects.entrance')}
          </p>
        </div>
      </AkEntrance>)}
    </div>
    <div>
      {tune('depth-code-id', <AkCodeId>AkDepth</AkCodeId>)}
      {tune('depth', <AkDepth
        className="demo-depth"
        variant="stage"
        threeD
        style={{ marginTop: 'var(--ak-space-2, 0.5rem)' }}
      >
        {tune('depth-grid', <AkDepthLayer className="demo-depth__grid" depth={0.4} />)}
        {tune('depth-glyph', <AkDepthLayer className="demo-depth__glyph" depth={1}>
          {tune('depth-display', <AkDisplay xl>PRTS</AkDisplay>)}
        </AkDepthLayer>)}
        {tune('depth-hud', <AkDepthLayer className="demo-depth__hud" depth={2}>
          {tune('depth-brackets', <AkBrackets style={{ width: '4rem', height: '3rem' }} />)}
        </AkDepthLayer>)}
      </AkDepth>)}
      <div className="demo-hint">{t('ref.effects.depthHint')}</div>
    </div>
  </div>
}
