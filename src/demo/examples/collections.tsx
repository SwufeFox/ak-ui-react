import { AkBreadcrumb, AkChoice, AkTable, AkAvatar, AkAvatarGroup, AkThumbnail, AkCodeId, AkScrollArea, AkOverline, AkNewsList } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type CollectionsModel = { t: I18nValue['t']; selectedTableRow: string; setSelectedTableRow: Dispatch<SetStateAction<string>>; tableStriped: boolean; setTableStriped: Dispatch<SetStateAction<boolean>>; tableTactical: boolean; setTableTactical: Dispatch<SetStateAction<boolean>>; tableSticky: boolean; setTableSticky: Dispatch<SetStateAction<boolean>>; tableSortKey: 'name' | 'atk' | 'def'; tableSortDir: 'ascending' | 'descending' | 'none'; handleTableSort: (key: 'name' | 'atk' | 'def') => void; tableData: { id: string; name: string; atk: number; def: number; role: string }[] }

export function renderCollections({ t, selectedTableRow, setSelectedTableRow, tableStriped, setTableStriped, tableTactical, setTableTactical, tableSticky, setTableSticky, tableSortKey, tableSortDir, handleTableSort, tableData }: CollectionsModel, tune: Tune) {
  return <div className="demo-stack">
            {tune("breadcrumb-1", <AkBreadcrumb
              items={[
                { label: t('common.breadcrumbHome'), href: '#shell-archive' },
                { label: t('common.breadcrumbRoster'), href: '#shell-archive' },
                { label: t('common.breadcrumbAmiya') },
              ]}
            />)}

            <div className="demo-row" style={{ alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {tune("choice-1", <AkChoice
                variant="switch"
                checked={tableTactical}
                onChange={(e) => setTableTactical(e.target.checked)}
              >
                {t('ref.table.tactical')}
              </AkChoice>)}
              {tune("choice-2", <AkChoice
                variant="switch"
                checked={tableStriped}
                onChange={(e) => setTableStriped(e.target.checked)}
              >
                {t('ref.table.striped')}
              </AkChoice>)}
              {tune("choice-3", <AkChoice
                variant="switch"
                checked={tableSticky}
                onChange={(e) => setTableSticky(e.target.checked)}
              >
                {t('ref.table.sticky')}
              </AkChoice>)}
              <span className="demo-note">
                {t('ref.table.interactiveHint')} · {t('common.commandSelected')}: {selectedTableRow}
              </span>
            </div>

            {tune("table-1", <AkTable
              scrollable
              tactical={tableTactical}
              striped={tableStriped}
              stickyHeader={tableSticky}
              hoverable
              onRowClick={(row) => setSelectedTableRow(row.id)}
              columns={[
                { key: 'name', header: t('common.colName'), sort: tableSortKey === 'name' ? tableSortDir : 'none', onSortChange: () => handleTableSort('name') },
                { key: 'atk', header: t('common.colAtk'), numeric: true, sort: tableSortKey === 'atk' ? tableSortDir : 'none', onSortChange: () => handleTableSort('atk') },
                { key: 'def', header: t('common.colDef'), numeric: true, sort: tableSortKey === 'def' ? tableSortDir : 'none', onSortChange: () => handleTableSort('def') },
                { key: 'role', header: 'ROLE' },
              ]}
              rows={tableData.map((r) => ({
                id: r.id,
                cells: { name: r.name, atk: String(r.atk), def: String(r.def), role: r.role },
                selected: selectedTableRow === r.id,
              }))}
              footer={{ name: t('common.total'), atk: '2097', def: '1018', role: '4 UNITS' }}
            />)}

            <div className="demo-row" style={{ alignItems: 'center' }}>
              {tune("avatar-1", <AkAvatar fallback="A" />)}
              {tune("avatar-2", <AkAvatar fallback="K" size="lg" cut />)}
              {tune("avatar-3", <AkAvatar fallback="I" accent size="sm" />)}
              {tune("avatar-group-1", <AkAvatarGroup>
                {tune("avatar-4", <AkAvatar fallback="A" />)}
                {tune("avatar-5", <AkAvatar fallback="B" />)}
                {tune("avatar-6", <AkAvatar fallback="C" />)}
              </AkAvatarGroup>)}
              {tune("thumbnail-1", <AkThumbnail badge="R001" />)}
              {tune("thumbnail-2", <AkThumbnail cut size="wide" />)}
            </div>

            <div>
              {tune("code-id-1", <AkCodeId>{t('common.scrollHint')}</AkCodeId>)}
              {tune("scroll-area-1", <AkScrollArea axis="y" maxHeight="6rem" style={{ border: '1px solid var(--ak-border)', marginTop: '0.5rem' }}>
                <div style={{ height: '20rem', padding: '0.75rem' }}>
                  {tune("overline-1", <AkOverline>tall content</AkOverline>)}
                </div>
              </AkScrollArea>)}
            </div>

            {/*
              公告列表：容器查询控制的 3 列 → 单列降级。
              外面套一个窄盒子，好让人一眼看到它在 34rem 以下会换成单列。
            */}
            <div>
              {tune("overline-2", <AkOverline>{t('ref.news.title')}</AkOverline>)}
              {tune("news-list-1", <AkNewsList
                label={t('ref.news.label')}
                empty={t('ref.news.empty')}
                style={{ marginTop: 'var(--ak-space-3, 0.75rem)', maxWidth: '34rem' }}
                items={[
                  {
                    category: t('ref.news.catNotice'),
                    title: t('ref.news.item1'),
                    time: '10-20',
                    dateTime: '2026-10-20',
                  },
                  {
                    category: t('ref.news.catEvent'),
                    title: t('ref.news.item2'),
                    time: '10-19',
                    dateTime: '2026-10-19',
                  },
                  { category: t('ref.news.catNotice'), title: t('ref.news.item3'), time: '10-18', dateTime: '2026-10-18' },
                ]}
              />)}
            </div>
          </div>
}
