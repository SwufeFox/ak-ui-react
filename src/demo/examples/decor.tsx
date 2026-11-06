import { AkStripes, AkGridBackdrop, AkCorner, AkBrackets, AkReticle, AkBarcode, AkHalftone, AkGlyphBox, AkGlyph, AkMotion, AkInverse, AkLaser, AkStripeEdge, AkCut, AkCodeId, AkBlueBand, AkChevrons, AkDisplay, AkWatermark, AkGlow, AkButton, AkOutline, AkSkew, AkVignette, AkGrain, AkMosaic, AkBackdrop, AkOverline, AkNum, AkEn, AkBilingual, playTactileSound } from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type DecorModel = { t: I18nValue['t'] }

export function renderDecor({ t }: DecorModel, tune: Tune) {
  return <div className="demo-stack">
          <div className="demo-row">
            {tune("stripes-1", <AkStripes bar variant="warning" style={{ width: '8rem' }} />)}
            {tune("stripes-2", <AkStripes bar variant="danger" style={{ width: '8rem' }} />)}
            {tune("stripes-3", <AkStripes bar variant="hazard" style={{ width: '8rem' }} />)}
          </div>
          {tune("stripes-4", <AkStripes variant="strong" style={{ height: '2.5rem' }} />)}
          <div className="demo-row">
            {tune("grid-backdrop-1", <AkGridBackdrop
              variant="grid"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />)}
            {tune("grid-backdrop-2", <AkGridBackdrop
              variant="dots"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />)}
            {tune("grid-backdrop-3", <AkGridBackdrop
              variant="diag"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />)}
            {tune("grid-backdrop-4", <AkGridBackdrop
              variant="scanlines"
              style={{ width: '10rem', height: '5rem', backgroundColor: 'var(--ak-surface-sunken)' }}
            />)}
          </div>
          <div className="demo-row">
            {tune("corner-1", <AkCorner
              position="tr"
              tone="yellow"
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)' }}
            />)}
            {tune("corner-2", <AkCorner
              position="tl"
              tone="red"
              large
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)' }}
            />)}
            {tune("brackets-1", <AkBrackets style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)' }} />)}
            {tune("reticle-1", <AkReticle style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {tune("barcode-1", <AkBarcode />)}
            </AkReticle>)}
            {tune("reticle-2", <AkReticle corners="four" tone="info" style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--ak-font-mono)', color: 'var(--ak-signal-info)' }}>LOCK // 4-RETICLE</span>
            </AkReticle>)}
            {tune("reticle-3", <AkReticle tone="action" style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--ak-font-mono)' }}>RETICLE</span>
            </AkReticle>)}
            {tune("halftone-1", <AkHalftone variant="full" style={{ padding: 'var(--ak-space-3)' }}>
              {tune("glyph-box-1", <AkGlyphBox style={{ padding: '0.25rem' }}>G</AkGlyphBox>)}
            </AkHalftone>)}
            {/* fade 是正交的另一条类：不画网点，而是让内容朝右渐隐 */}
            {tune("halftone-2", <AkHalftone fade style={{ padding: 'var(--ak-space-3)' }}>
              {tune("glyph-box-2", <AkGlyphBox style={{ padding: '0.25rem' }}>FADE</AkGlyphBox>)}
            </AkHalftone>)}
            <div className="demo-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
              {tune("glyph-1", <AkGlyph white style={{ padding: '0.2rem 0.5rem', background: 'var(--ak-surface-sunken-2)' }}>◆</AkGlyph>)}
              {tune("glyph-2", <AkGlyph keep style={{ padding: '0.2rem 0.5rem', background: 'var(--ak-surface-sunken-2)', color: 'var(--ak-signal-info)' }}>▲</AkGlyph>)}
              {tune("motion-1", <AkMotion effect="rise" pace="base">
                {tune("inverse-1", <AkInverse style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>RISE</AkInverse>)}
              </AkMotion>)}
              {tune("motion-2", <AkMotion effect="fade" pace="slow">
                {tune("inverse-2", <AkInverse style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>FADE</AkInverse>)}
              </AkMotion>)}
            </div>
          </div>
          {/* 战术全息激光线 Laser */}
          <div className="demo-stack" style={{ marginTop: 'var(--ak-space-4)', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', minWidth: '5rem', color: 'var(--ak-signal-info)' }}>LASER // INFO</span>
              {tune("laser-1", <AkLaser tone="info" />)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', minWidth: '5rem', color: 'var(--ak-signal-action)' }}>LASER // ACTION</span>
              {tune("laser-2", <AkLaser tone="action" />)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', minWidth: '5rem', color: 'var(--ak-signal-danger)' }}>LASER // DANGER</span>
              {tune("laser-3", <AkLaser tone="danger" />)}
            </div>
          </div>
          {/* 左缘警戒斜纹：8px 斜纹条用 --ak-signal-action，所以是动作语义 */}
          <div className="demo-row" style={{ alignItems: 'stretch', marginTop: 'var(--ak-space-4)' }}>
            {tune("stripe-edge-1", <AkStripeEdge style={{ padding: '0.75rem 0.75rem 0.75rem 1.25rem', background: 'var(--ak-surface-sunken-2)' }}>
              {t('ref.decor.stripeEdge')}
            </AkStripeEdge>)}
            {tune("stripe-edge-2", <AkStripeEdge as="aside" style={{ padding: '0.75rem 0.75rem 0.75rem 1.25rem', background: 'var(--ak-surface-sunken-2)' }}>
              {t('ref.decor.stripeEdgeAs')}
            </AkStripeEdge>)}
          </div>
          <div className="demo-row" style={{ alignItems: 'flex-end' }}>
            {/* AkCut: clip-path 会裁掉自己的阴影，所以投影放外层 */}
            <div style={{ boxShadow: 'var(--ak-shadow-panel)' }}>
              {tune("cut-1", <AkCut
                size="sm"
                style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}
              >
                {tune("code-id-1", <AkCodeId>LM04</AkCodeId>)}
              </AkCut>)}
            </div>
            {tune("cut-2", <AkCut style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}>
              --md
            </AkCut>)}
            {tune("cut-3", <AkCut
              size="lg"
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}
            >
              --lg
            </AkCut>)}
            {tune("cut-4", <AkCut
              corner="all"
              size="lg"
              style={{ width: '7rem', height: '3.5rem', backgroundColor: 'var(--ak-surface-sunken-2)', padding: '0.5rem' }}
            >
              all
            </AkCut>)}
          </div>
          <div className="demo-row" style={{ alignItems: 'center' }}>
            {tune("blue-band-1", <AkBlueBand>{t('common.blueBand')}</AkBlueBand>)}
            {tune("inverse-3", <AkInverse style={{ padding: '0.375rem 0.75rem' }}>{t('common.inverse')}</AkInverse>)}
            {tune("chevrons-1", <AkChevrons href="#components-10">{t('common.proceed')}</AkChevrons>)}
          </div>
          <div style={{ position: 'relative', paddingBottom: 'var(--ak-space-4)' }}>
            {tune("display-1", <AkDisplay xl>{t('app.name')}</AkDisplay>)}
            {tune("watermark-1", <AkWatermark>{t('ref.decor.watermark')}</AkWatermark>)}
          </div>
          {/* 上游特效层：这三样才是 ak-ui 的动效语言（都是 CSS animation infinite） */}
          <div className="demo-fx-row">
            {tune("glow-1", <AkGlow>
              {tune("button-1", <AkButton variant="outline" onClick={() => playTactileSound('click', 0.15)}>{t('common.glow')}</AkButton>)}
            </AkGlow>)}
            {tune("glow-2", <AkGlow tone="action">
              {tune("button-2", <AkButton variant="action" onClick={() => playTactileSound('action', 0.2)}>{t('common.glowAction')}</AkButton>)}
            </AkGlow>)}
            {tune("outline-1", <AkOutline color="var(--ak-signal-info)">
              {tune("button-3", <AkButton variant="outline" onClick={() => playTactileSound('dial', 0.15)}>{t('common.outlineRing')}</AkButton>)}
            </AkOutline>)}
            {tune("skew-1", <AkSkew direction="left" style={{ display: 'inline-block' }}>
              {tune("inverse-4", <AkInverse style={{ padding: '0.375rem 0.75rem' }}>{t('common.skewLeft')}</AkInverse>)}
            </AkSkew>)}
            {tune("skew-2", <AkSkew direction="right" style={{ display: 'inline-block' }}>
              {tune("inverse-5", <AkInverse style={{ padding: '0.375rem 0.75rem' }}>{t('common.skewRight')}</AkInverse>)}
            </AkSkew>)}
          </div>

          {/* 焦距与底图处理（文章原则二/三/五）—— 上游 SCSS 零实现，本库增补 */}
          <div className="demo-surface-row">
            {tune("vignette-1", <AkVignette className="demo-surface">
              {tune("code-id-2", <AkCodeId>AkVignette</AkCodeId>)}
              <p>{t('ref.decor.vignetteHint')}</p>
            </AkVignette>)}

            {tune("grain-1", <AkGrain className="demo-surface">
              {tune("code-id-3", <AkCodeId>AkGrain</AkCodeId>)}
              <p>{t('ref.decor.grainHint')}</p>
            </AkGrain>)}

            <div className="demo-surface demo-surface--stack">
              {tune("code-id-4", <AkCodeId>AkMosaic</AkCodeId>)}
              <div className="demo-mosaic-host">
                {tune("mosaic-1", <AkMosaic style={{ position: 'absolute', inset: 0 }} />)}
                <span>SECURE /// 04</span>
              </div>
              <p>{t('ref.decor.mosaicHint')}</p>
            </div>

            <div className="demo-surface demo-surface--stack">
              {tune("code-id-5", <AkCodeId>AkBackdrop</AkCodeId>)}
              <div className="demo-backdrop-host">
                <span className="demo-backdrop-under">{t('ref.decor.backdropUnder')}</span>
                {tune("backdrop-1", <AkBackdrop className="demo-backdrop-over" strength="light">
                  <span>{t('ref.decor.backdropOver')}</span>
                </AkBackdrop>)}
              </div>
            </div>
          </div>

          <div className="demo-row" style={{ alignItems: 'baseline' }}>
            {tune("overline-1", <AkOverline>{t('common.overline')}</AkOverline>)}
            {tune("num-1", <AkNum>1,234,567.89</AkNum>)}
            {tune("en-1", <AkEn>{t('common.latin')}</AkEn>)}
            {tune("bilingual-1", <AkBilingual cn={t('ref.decor.arknightsCn')} en={t('ref.decor.arknightsEn')} />)}
            {tune("bilingual-2", <AkBilingual cn={t('ref.decor.terminalCn')} en={t('ref.decor.terminalEn')} row />)}
          </div>
        </div>
}
