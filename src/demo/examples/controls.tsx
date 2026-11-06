import { AkDivider, AkButtonGroup, AkButton, AkPopover, AkTagGroup, AkTag, AkStatusGroup, AkStatus, AkPagination } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'


export type ControlsModel = { t: I18nValue['t']; groupPick: 'A' | 'B' | 'C'; setGroupPick: Dispatch<SetStateAction<'A' | 'B' | 'C'>>; pageIndex: number; setPageIndex: Dispatch<SetStateAction<number>> }

export function renderControls({ t, groupPick, setGroupPick, pageIndex, setPageIndex }: ControlsModel, tune: Tune) {
  return <div className="demo-stack">
            {tune("divider-1", <AkDivider>{t('common.sectionLabel')}</AkDivider>)}

          <div className="demo-row">
            {/* 按钮组本来就该是单选：点哪个哪个变 action 档 */}
            {tune("button-group-1", <AkButtonGroup>
              {(['A', 'B', 'C'] as const).map((k) => (
                tune(`button-1-${String(k)}`, <AkButton
                  key={k}
                  variant={groupPick === k ? 'action' : 'outline'}
                  aria-pressed={groupPick === k}
                  onClick={() => setGroupPick(k)}
                >
                  {k}
                </AkButton>)
              ))}
            </AkButtonGroup>)}

              {tune("popover-1", <AkPopover
                trigger={<AkButton variant="action">{t('common.openPanel')}</AkButton>}
                eyebrow="RI / INFO"
                title={t('ref.controls.title')}
              >
                {t('ref.controls.note')}
              </AkPopover>)}
            </div>

            {tune("tag-group-1", <AkTagGroup>
              {tune("tag-1", <AkTag>ALPHA</AkTag>)}
              {tune("tag-2", <AkTag variant="advanced">BRAVO</AkTag>)}
              {tune("tag-3", <AkTag variant="danger">CHARLIE</AkTag>)}
              {tune("tag-4", <AkTag variant="neutral">DELTA</AkTag>)}
            </AkTagGroup>)}

            {tune("status-group-1", <AkStatusGroup>
              {tune("status-1", <AkStatus label="NETWORK" detail="Stable" />)}
              {tune("status-2", <AkStatus variant="warning" label="REACTOR" detail="48%" />)}
              {tune("status-3", <AkStatus variant="critical" label="HULL" detail="Breach" />)}
              {tune("status-4", <AkStatus variant="offline" label="RELAY" detail="Down" />)}
            </AkStatusGroup>)}

          {/* 以前 onPageChange 是 `() => undefined` —— 点了页码永远不动，
              这正是「控件点了没效果」最典型的一处。 */}
          {tune("pagination-1", <AkPagination
            page={pageIndex}
            total={12}
            title={t('common.timeline')}
            onPageChange={setPageIndex}
          />)}
          </div>
}
