import { AkGauge, AkNotice, AkNoticeStack, AkProgress, AkProgressStack, AkStatus } from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type FeedbackModel = {
  t: I18nValue['t']
}

export function renderFeedback({ t }: FeedbackModel, tune: Tune) {
  return <>
    <div className="demo-stack">
      {tune('notice-info', <AkNotice title={t('notice.info.title')} code={t('notice.code.info')}>
        {t('notice.info.body')}
      </AkNotice>)}
      {tune('notice-warning', <AkNotice variant="warning" title={t('notice.warn.title')} code={t('notice.code.warn')}>
        {t('notice.warn.body')}
      </AkNotice>)}
      {tune('notice-danger', <AkNotice variant="danger" title={t('notice.crit.title')} code={t('notice.code.crit')}>
        {t('notice.crit.body')}
      </AkNotice>)}
      {tune('notice-success', <AkNotice variant="success" title={t('notice.ok.title')} code={t('notice.code.ok')}>
        {t('notice.ok.body')}
      </AkNotice>)}
    </div>
    <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
      {tune('status-network', <AkStatus label={t('ref.feedback.status.network')} detail={t('ref.feedback.status.networkValue')} />)}
      {tune('status-reactor', <AkStatus label={t('ref.feedback.status.reactor')} detail={t('ref.feedback.status.reactorValue')} variant="warning" />)}
      {tune('status-hull', <AkStatus label={t('ref.feedback.status.hull')} detail={t('ref.feedback.status.hullValue')} variant="critical" />)}
      {tune('status-relay', <AkStatus label={t('ref.feedback.status.relay')} detail={t('ref.feedback.status.relayValue')} variant="offline" />)}
    </div>
    <div className="demo-stack" style={{ marginTop: 'var(--ak-space-4)' }}>
      {tune('progress-deploy', <AkProgress label={t('ref.feedback.progress.deploy')} value={72} />)}
      {tune('progress-integrity', <AkProgress
        label={t('ref.feedback.progress.integrity')}
        value={18}
        variant="danger"
        valueLabel={t('ref.feedback.progress.critical')}
      />)}
    </div>
    <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
      {tune('gauge-deploy', <AkGauge label={t('common.deploy')} value={64} unit={t('common.percent')} />)}
      {tune('gauge-heat', <AkGauge label={t('common.heat')} value={88} unit={t('common.percent')} variant="warning" />)}
    </div>
    <div style={{ marginTop: 'var(--ak-space-4)' }}>
      <span className="demo-eyebrow">{t('ref.feedback.stack')}</span>
      {tune('notice-stack', <AkNoticeStack style={{ marginTop: 'var(--ak-space-3, 0.75rem)' }}>
        {tune('stack-notice-info', <AkNotice title={t('notice.info.title')} code={t('notice.code.info')}>
          {t('notice.info.body')}
        </AkNotice>)}
        {tune('stack-notice-danger', <AkNotice variant="danger" title={t('notice.crit.title')} code={t('notice.code.crit')}>
          {t('notice.crit.body')}
        </AkNotice>)}
      </AkNoticeStack>)}
      {tune('progress-stack', <AkProgressStack style={{ marginTop: 'var(--ak-space-4)' }}>
        {tune('stack-progress-deploy', <AkProgress label={t('ref.feedback.progress.deploy')} value={72} />)}
        {tune('stack-progress-integrity', <AkProgress
          label={t('ref.feedback.progress.integrity')}
          value={18}
          variant="danger"
          valueLabel={t('ref.feedback.progress.critical')}
        />)}
      </AkProgressStack>)}
    </div>
  </>
}
