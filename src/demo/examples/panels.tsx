import {
  AkBadge,
  AkBackTop,
  AkChip,
  AkCbox,
  AkCollapse,
  AkCollapseItem,
  AkEmpty,
  AkHeading,
  AkKbd,
  AkMessage,
  AkPanel,
  AkPathNav,
  AkScope,
  AkSearch,
  AkStat,
  AkStatRow,
  AkStep,
  AkSteps,
  AkTimeline,
  AkTimelineItem,
  AkToastProvider,
  AkTooltip,
  useToast,
} from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

/** 提示条演示：一个自己挂 toast 的小组件。 */
function ToastDemo() {
  const toast = useToast()
  return (
    <button type="button" className="ak-button ak-button--outline" onClick={() => toast.success('档案已写入终端。', { title: '上传完成' })}>
      触发提示
    </button>
  )
}

export type PanelsModel = {
  t: I18nValue['t']
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

export function renderPanels({ t, panelOpen, setPanelOpen }: PanelsModel, tune: Tune) {
  return <div className="demo-stack">
          {tune('panel-1', <div style={{ maxWidth: '40rem' }}>
            {tune('panel-1-a', <AkPanel title="作战记录" en="Operation Record" titleTag="h3">
              面板本体沿用终端口径：标题栏 + 细发丝边，正文区留白由内容决定。
            </AkPanel>)}
          </div>)}

          {tune('panel-2', <div style={{ maxWidth: '40rem' }}>
            {tune('panel-2-a', <AkPanel title="可折叠面板" en="Collapsible" collapsible expanded={panelOpen} onExpandedChange={setPanelOpen} headerExtra={<AkBadge value={1} variant="accent" />}>
              折叠时只留标题栏；展开后正文按需显示。
            </AkPanel>)}
          </div>)}

          {tune('collapse-1', <div style={{ maxWidth: '40rem' }}>
            {tune('collapse-1-a', <AkCollapse accordion>
              <AkCollapseItem name="stage-1" title="阶段一 · 接入">
                干员接入终端的记录。
              </AkCollapseItem>
              <AkCollapseItem name="stage-2" title="阶段二 · 校准">
                神经连接校准记录。
              </AkCollapseItem>
              <AkCollapseItem name="stage-3" title="阶段三 · 封存" disabled>
                尚未开放。
              </AkCollapseItem>
            </AkCollapse>)}
          </div>)}

          {tune('heading-1', <div style={{ maxWidth: '40rem' }}>
            {tune('heading-1-a', <AkHeading title={t('ref.panels.title')} en="Panels & Feedback" level={2} variant="bar" extra={<AkBadge value={2} variant="accent" />}>
              标题下方的说明段落。
            </AkHeading>)}
          </div>)}

          {tune('cbox-1', <div style={{ maxWidth: '40rem' }}>
            {tune('cbox-1-a', <AkCbox level="warning" title="注意">
              这条提示用于说明风险，不承载主要操作。
            </AkCbox>)}
          </div>)}

          {tune('message-1', <div style={{ maxWidth: '40rem' }}>
            {tune('message-1-a', <AkMessage variant="danger" title="连接中断" stripes>
              与罗德岛主服务器的连接已中断，正在重试。
            </AkMessage>)}
          </div>)}

          {tune('empty-1', <div style={{ maxWidth: '40rem' }}>
            {tune('empty-1-a', <AkEmpty title="没有记录" description="该分类下还没有任何档案。" code="ERR_EMPTY_204" />)}
          </div>)}

          {tune('stat-1', <div style={{ maxWidth: '40rem' }}>
            {tune('stat-1-a', <AkStatRow>
              <AkStat label="干员总数" value="128" delta="+6" trend="up" />
              <AkStat label="活跃终端" value="42" delta="-3" trend="down" />
              <AkStat label="平均理智" value="19.4" inline />
            </AkStatRow>)}
          </div>)}

          {tune('pathnav-1', <div style={{ maxWidth: '40rem' }}>
            {tune('pathnav-1-a', <AkPathNav here="密录 1" upHref="#components-19" upLabel="上一层" homeHref="#components-1" homeLabel="首页" />)}
          </div>)}

          {tune('badge-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {tune('badge-1-a', <AkBadge value={9} />)}
            {tune('badge-1-b', <AkBadge value={128} max={99} variant="accent" />)}
            {tune('badge-1-c', <AkBadge dot variant="danger" />)}
          </div>)}

          {tune('chip-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {tune('chip-1-a', <AkChip defaultChecked>精英二</AkChip>)}
            {tune('chip-1-b', <AkChip>医疗</AkChip>)}
          </div>)}

          {tune('timeline-1', <div style={{ maxWidth: '34rem' }}>
            {tune('timeline-1-a', <AkTimeline>
              <AkTimelineItem time="2026.08.08" title="接入终端" status="done">完成基础校准。</AkTimelineItem>
              <AkTimelineItem time="2026.08.09" title="作战记录" status="active">当前阶段。</AkTimelineItem>
              <AkTimelineItem time="2026.09.01" title="封存" status="wait">待开放。</AkTimelineItem>
            </AkTimeline>)}
          </div>)}

          {tune('tooltip-1', <div className="demo-row" style={{ alignItems: 'center', gap: '1rem' }}>
            {tune('tooltip-1-a', <AkTooltip content="技力达到需求后开启" placement="top">
              <button type="button" className="ak-button ak-button--ghost">悬停看说明</button>
            </AkTooltip>)}
            {tune('tooltip-1-b', <AkTooltip content="密录未解锁" placement="bottom" wide>
              <button type="button" className="ak-button ak-button--ghost">宽版说明</button>
            </AkTooltip>)}
          </div>)}

          {tune('search-1', <div style={{ maxWidth: '24rem' }}>
            {tune('search-1-a', <AkSearch placeholder="搜索干员 / 档案" label="搜索" shortcut="/" onSearch={() => {}} />)}
          </div>)}

          {tune('kbd-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.35rem' }}>
            {tune('kbd-1-a', <AkKbd>Ctrl</AkKbd>)}
            {tune('kbd-1-b', <AkKbd>K</AkKbd>)}
          </div>)}

          {tune('steps-1', <div style={{ maxWidth: '34rem' }}>
            {tune('steps-1-a', <AkSteps current={1} label="部署流程">
              <AkStep title="接入" status="done" />
              <AkStep title="校准" status="active" />
              <AkStep title="部署" status="wait" />
            </AkSteps>)}
          </div>)}

          {tune('backtop-1', <div style={{ maxWidth: '34rem' }}>
            {tune('backtop-1-a', <AkBackTop defaultVisible onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />)}
          </div>)}

          {tune('scope-1', <div style={{ maxWidth: '40rem' }}>
            {tune('scope-1-a', <AkScope theme="archive">
              <AkCbox level="info" title="亮色作用域">
                这个子树被强制切成 archive 主题，其余页面不受影响。
              </AkCbox>
            </AkScope>)}
          </div>)}

          {tune('toast-1', <div style={{ maxWidth: '40rem' }}>
            {tune('toast-1-a', <AkToastProvider>
              <ToastDemo />
            </AkToastProvider>)}
          </div>)}
        </div>
}
