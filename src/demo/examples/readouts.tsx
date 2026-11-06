import { AkCounter, AkLevel, AkSpinner, AkSan, AkSanContainer, AkSkeleton, AkButton, AkLoadingScreen, AkDialog } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'


export type ReadoutsModel = { t: I18nValue['t']; sanCurrent: number; setSanCurrent: Dispatch<SetStateAction<number>>; sanTotal: number; sanLimit: number; loadingReady: boolean; setLoadingReady: Dispatch<SetStateAction<boolean>>; dialogOpen: boolean; setDialogOpen: Dispatch<SetStateAction<boolean>> }

export function renderReadouts({ t, sanCurrent, setSanCurrent, sanTotal, sanLimit, loadingReady, setLoadingReady, dialogOpen, setDialogOpen }: ReadoutsModel, tune: Tune) {
  return <div className="demo-stack">
            <div className="demo-row" style={{ alignItems: 'center' }}>
              {tune("counter-1", <AkCounter
                prefixIcon={<span aria-hidden="true">◆</span>}
                value="1280"
                suffixIcon={<span aria-hidden="true">+</span>}
              />)}
              {tune("level-1", <AkLevel label={t('common.levelLabel')}>01-07</AkLevel>)}
              {tune("spinner-1", <AkSpinner />)}
            </div>

            {/* 理智部件：独立仪表与完整外壳容器 */}
            <div className="demo-row" style={{ alignItems: 'flex-start' }}>
              <div className="demo-panel" style={{ width: 'auto', padding: '0.75rem 1rem' }}>
                <span className="demo-eyebrow">{t('ref.data.sanStandalone')}</span>
                {tune("san-1", <AkSan
                  current={sanCurrent}
                  total={sanTotal}
                  limit={sanLimit}
                  onAdd={() => setSanCurrent((v) => Math.min(sanLimit, v + 1))}
                  addLabel={t('ref.san.add')}
                  style={{ marginTop: '0.5rem' }}
                />)}
              </div>
              {tune("san-container-1", <AkSanContainer
                eyebrow={t('ref.san.eyebrow')}
                title={t('ref.san.title')}
                current={sanCurrent}
                total={sanTotal}
                limit={sanLimit}
                onAdd={() => setSanCurrent((v) => Math.min(sanLimit, v + 1))}
                addLabel={t('ref.san.add')}
                meta={<AkLevel label={t('common.levelLabel')}>01-07</AkLevel>}
                status={t('ref.san.status')}
              />)}
              {/*
                terminal 变体是 `container-type: size` 容器，内部几何全用 cqh，
                所以**必须由父级给出确定高度**（上游挂在 .ak-dashboard__right-menu 下就是如此）。
                这里用 grid 让子元素拉伸填满 —— 早先只写 blockSize，容器高度算出来是 0，
                于是 3.35cqh 的黄条塌成 0px。图形层也要带 .ak-icon，样式是挂在这个类上的。
              */}
              <div style={{ display: 'grid', inlineSize: 'min(22rem, 100%)', blockSize: '12rem' }}>
                {tune("san-container-2", <AkSanContainer
                  variant="terminal"
                  current={sanCurrent}
                  total={sanTotal}
                  onAdd={() => setSanCurrent((v) => Math.min(sanLimit, v + 1))}
                  addLabel={t('ref.san.add')}
                  figure={<span className="ak-icon" aria-hidden="true">◆</span>}
                  watermark={<span aria-hidden="true">RHODES</span>}
                />)}
              </div>
            </div>

            {tune("skeleton-1", <AkSkeleton lines={3} />)}
            {tune("skeleton-2", <AkSkeleton variant="block" height="4rem" />)}
            {tune("skeleton-3", <AkSkeleton variant="track" height="6px" />)}

            {/*
              全屏加载画面。它 `position:absolute; inset:0; z-index:30` +
              `container-type:size`，所以必须给**有定位且高度确定**的容器，
              否则内部 cqh/cqw 会塌成 0。这里用 16/9 的固定比例框当舞台。
            */}
            <div>
              {tune("button-1", <AkButton variant="outline" onClick={() => setLoadingReady((v) => !v)}>
                {loadingReady ? t('ref.loading.replay') : t('ref.loading.finish')}
              </AkButton>)}
              <div
                style={{
                  position: 'relative',
                  marginTop: 'var(--ak-space-3, 0.75rem)',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                }}
              >
                {tune("loading-screen-1", <AkLoadingScreen
                  state={loadingReady ? 'ready' : 'loading'}
                  label={t('ref.loading.label')}
                  tip={t('ref.loading.tip')}
                  brand="AK-UI"
                  brandSuffix="REACT"
                  mark={<span className="ak-icon" aria-hidden="true">◆</span>}
                  markLabel="RHODES"
                  progressLabel={loadingReady ? 'READY' : 'LOADING'}
                />)}
              </div>
            </div>

            <div>
              {tune("button-2", <AkButton variant="action" onClick={() => setDialogOpen(true)}>
                {t('common.openDialog')}
              </AkButton>)}
              {tune("dialog-1", <AkDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                eyebrow="RI / CONFIRM"
                title={t('common.dialogTitle')}
                footer={
                  <>
                    <AkButton variant="outline" onClick={() => setDialogOpen(false)}>
                      {t('common.cancel')}
                    </AkButton>
                    <AkButton variant="action" onClick={() => setDialogOpen(false)}>
                      {t('common.confirm')}
                    </AkButton>
                  </>
                }
              >
                <p>{t('common.dialogBody')}</p>
              </AkDialog>)}
            </div>
          </div>
}
