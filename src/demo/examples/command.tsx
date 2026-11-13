import { AkCommandGrid, AkCommand, AkCommandGroup, AkOverline, AkSlot, AkItem, AkButton, AkScreen, AkStatus, AkCounter, AkInput, AkTag, playTactileSound } from '../../ak'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'
import { DEPOT_ITEMS, type DepotCategory, type DepotItem } from './command-model'

export type CommandModel = { t: I18nValue['t']; selectedCommand: string; setSelectedCommand: Dispatch<SetStateAction<string>>; selectedSlot: string; setSelectedSlot: Dispatch<SetStateAction<string>>; selectedItem: string; setSelectedItem: Dispatch<SetStateAction<string>>; screenOpen: boolean; setScreenOpen: Dispatch<SetStateAction<boolean>>; screenDialogRef: { current: HTMLDialogElement | null }; screenCategory: DepotCategory; setScreenCategory: Dispatch<SetStateAction<DepotCategory>>; screenSearch: string; setScreenSearch: Dispatch<SetStateAction<string>>; selectedDepotItem: DepotItem | undefined; setSelectedDepotId: Dispatch<SetStateAction<string>>; filteredDepotItems: DepotItem[]; materialStock: Record<string, number>; setMaterialStock: Dispatch<SetStateAction<Record<string, number>>>; screenNotice: string | null; showScreenNotice: (msg: string) => void; sanCurrent: number; setSanCurrent: Dispatch<SetStateAction<number>>; sanTotal: number; sanLimit: number; showcaseDialogStyle: CSSProperties }

export function renderCommand({ t, selectedCommand, setSelectedCommand, selectedSlot, setSelectedSlot, selectedItem, setSelectedItem, screenOpen, setScreenOpen, screenDialogRef, screenCategory, setScreenCategory, screenSearch, setScreenSearch, selectedDepotItem, setSelectedDepotId, filteredDepotItems, materialStock, setMaterialStock, screenNotice, showScreenNotice, sanCurrent, setSanCurrent, sanTotal, sanLimit, showcaseDialogStyle }: CommandModel, tune: Tune) {
  return <div className="demo-stack">
          {tune("command-grid-1", <AkCommandGrid style={{ gridAutoRows: '7.5rem', width: 'min(50rem, 100%)' }}>
            {tune("command-1", <AkCommand
              label={t('common.commandDeploy')}
              meta="OPERATOR / 01"
              watermark={<span aria-hidden="true">01</span>}
              badge={t('common.commandLive')}
              current={selectedCommand === 'deploy' ? t('common.commandSelected') : undefined}
              tone="paper"
              pressed={selectedCommand === 'deploy'}
              onClick={() => setSelectedCommand('deploy')}
              aria-label={t('common.commandDeploy')}
              style={{ minHeight: '7.5rem' }}
            />)}
            {tune("command-2", <AkCommand
              label={t('common.commandWithdraw')}
              meta="OPERATOR / 02"
              watermark={<span aria-hidden="true">02</span>}
              tone="dark"
              pressed={selectedCommand === 'withdraw'}
              onClick={() => setSelectedCommand('withdraw')}
              style={{ minHeight: '7.5rem' }}
            />)}
            {tune("command-3", <AkCommand
              label={t('common.commandSkill')}
              meta="SP / 24"
              watermark={<span aria-hidden="true">SP</span>}
              tone="cyan"
              layout="vertical"
              pressed={selectedCommand === 'skill'}
              onClick={() => setSelectedCommand('skill')}
              style={{ minHeight: '7.5rem' }}
            />)}
          </AkCommandGrid>)}

          {tune("command-group-1", <AkCommandGroup variant="recruitment" label={t('common.commandRecruit')}>
            {tune("command-4", <AkCommand
              label={t('common.commandSlot')}
              meta="TAG / 01"
              tone="accent"
              layout="split"
              pressed={selectedCommand === 'slot-1'}
              onClick={() => setSelectedCommand('slot-1')}
              style={{ minHeight: '5rem' }}
            />)}
            {tune("command-5", <AkCommand
              label={t('common.commandSlot')}
              meta="TAG / 02"
              tone="accent"
              layout="split"
              pressed={selectedCommand === 'slot-2'}
              onClick={() => setSelectedCommand('slot-2')}
              style={{ minHeight: '5rem' }}
            />)}
          </AkCommandGroup>)}

          {tune("command-grid-2", <AkCommandGrid style={{ gridAutoRows: '7.5rem', width: 'min(50rem, 100%)' }}>
            {tune("command-6", <AkCommand
              label="OPERATION"
              current="01-07"
              meta="STORY / CHAPTER 01"
              tone="paper"
              layout="wide"
              icon={<span>✦</span>}
              pressed={selectedCommand === 'operation'}
              onClick={() => setSelectedCommand('operation')}
              style={{ minHeight: '7.5rem' }}
            />)}
            {tune("command-7", <AkCommand
              label="ARCHIVE"
              meta="RECORD / 08"
              tone="muted"
              pressed={selectedCommand === 'archive'}
              onClick={() => setSelectedCommand('archive')}
              style={{ minHeight: '7.5rem' }}
            />)}
            {tune("command-8", <AkCommand
              label="STANDBY"
              meta="OFFLINE // 待机"
              disabled
              tone="dark"
              style={{ minHeight: '7.5rem' }}
            />)}
          </AkCommandGrid>)}

          {/* 干员槽位卡 (AkSlot) */}
          <div>
            {tune("overline-1", <AkOverline>{t('ref.command.slotTitle')}</AkOverline>)}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(8.5rem, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {tune("slot-1", <AkSlot
                name="SILVERASH"
                role="guard"
                rarity={6}
                rarityLabel="★★★★★★"
                code="GRD"
                meta="TSS // 真银斩"
                elite={2}
                level={90}
                reveal
                index={0}
                pressed={selectedSlot === 'silverash'}
                onClick={() => setSelectedSlot('silverash')}
              />)}
              {tune("slot-2", <AkSlot
                name="AMIYA"
                role="caster"
                rarity={5}
                rarityLabel="★★★★★"
                code="CAS"
                meta="CHIMERA // 奇美拉"
                elite={1}
                level={80}
                reveal
                index={1}
                pressed={selectedSlot === 'amiya'}
                onClick={() => setSelectedSlot('amiya')}
              />)}
              {tune("slot-3", <AkSlot
                name="SARIA"
                role="defender"
                rarity={6}
                rarityLabel="★★★★★★"
                code="DEF"
                meta="CALC // 钙质化"
                elite={2}
                level="LV.90"
                reveal
                index={2}
                pressed={selectedSlot === 'saria'}
                onClick={() => setSelectedSlot('saria')}
              />)}
              {tune("slot-4", <AkSlot
                name="EYJA"
                role="caster"
                rarity={6}
                rarityLabel="★★★★★★"
                code="CAS"
                meta="VOLCANO // 点燃"
                elite={2}
                level={90}
                reveal
                index={3}
                pressed={selectedSlot === 'eyja'}
                onClick={() => setSelectedSlot('eyja')}
              />)}
              {tune("slot-5", <AkSlot
                name="PURNIX"
                role="specialist"
                rarity={4}
                rarityLabel="★★★★"
                code="SPC"
                meta="REST // 休息中"
                elite={0}
                level={45}
                disabled
              />)}
              {tune("slot-6", <AkSlot empty onClick={() => setSelectedSlot('empty')}>
                <span>+ ASSIGN</span>
              </AkSlot>)}
            </div>
          </div>

          {/* 材料与道具方块 (AkItem) */}
          <div>
            {tune("overline-2", <AkOverline>{t('ref.command.itemTitle')}</AkOverline>)}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(6.5rem, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {tune("item-1", <AkItem
                tier={5}
                name="D32钢"
                count="x4"
                selected={selectedItem === 'D32'}
                onClick={() => setSelectedItem('D32')}
              />)}
              {tune("item-2", <AkItem
                tier={5}
                name="双极纳米片"
                count="x6"
                selected={selectedItem === 'nano'}
                onClick={() => setSelectedItem('nano')}
              />)}
              {tune("item-3", <AkItem
                tier={5}
                name="聚合剂"
                count="x3"
                selected={selectedItem === 'poly'}
                onClick={() => setSelectedItem('poly')}
              />)}
              {tune("item-4", <AkItem
                tier={4}
                name="改量装置"
                count="x12"
                selected={selectedItem === 'device'}
                onClick={() => setSelectedItem('device')}
              />)}
              {tune("item-5", <AkItem
                tier={3}
                name="锰矿"
                count="x28"
                selected={selectedItem === 'ore'}
                onClick={() => setSelectedItem('ore')}
              />)}
              {tune("item-6", <AkItem
                tier={2}
                name="糖"
                count="x84"
                disabled
              />)}
              {tune("item-7", <AkItem
                tier={4}
                name="龙门币"
                price="5,000"
                sold
              />)}
            </div>
          </div>

          {/* 终端大屏交互 (AkScreen) */}
          <div>
            {tune("overline-3", <AkOverline>{t('ref.command.screenTitle')}</AkOverline>)}
            <div style={{ marginTop: '0.5rem' }}>
              {tune("button-1", <AkButton
                variant="action"
                icon={<span>⤢</span>}
                sound={false}
                onClick={(event) => {
                  event.currentTarget.focus()
                  setScreenOpen(true)
                }}
              >
                {t('screen.open')}
              </AkButton>)}
            </div>

            {screenOpen ? (
              <dialog className="demo-screen-dialog" ref={screenDialogRef} aria-label={t('screen.title')} onCancel={(event) => { event.preventDefault(); setScreenOpen(false) }} style={showcaseDialogStyle}>
                {tune("screen-1", <AkScreen
                  tone="dark"
                  title="DEPOT & LOGISTICS // 罗德岛后勤与战术物资总览"
                  eyebrow="PRTS TERMINAL OS // SECTOR-07"
                  watermark="PRTS-DEPOT"
                  closeOnEsc={false}
                  status={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <AkStatus size="sm" variant="default" label="PRTS-LINKED" detail="LATENCY // 0.12ms" />
                      <span className="demo-screen-clearance">CLEARANCE: LV.4</span>
                    </div>
                  }
                  tokens={{ '--ak-screen-signal': 'var(--ak-terminal-accent)' }}
                  meta={
                    <div className="demo-screen-meta-row">
                      <div className="demo-screen-san-widget" title="SANITY // 罗德岛神经递质浓度">
                        <span className="demo-screen-san-icon" aria-hidden="true">⚡</span>
                        <span className="demo-screen-san-label">SAN</span>
                        <span className="demo-screen-san-val">{sanCurrent}/{sanTotal}</span>
                        <button
                          type="button"
                          className="demo-screen-san-btn"
                          aria-label={t('ref.san.add')}
                          onClick={() => {
                            playTactileSound('pip', 0.16)
                            setSanCurrent((v) => Math.min(sanLimit, v + 1))
                          }}
                        >
                          +
                        </button>
                      </div>
                      <AkCounter value="1,248,500" prefixIcon={<span style={{ color: 'var(--ak-signal-action)' }}>⯁</span>} title="LMD // 龙门币" />
                      <AkCounter value="38,400" prefixIcon={<span style={{ color: 'var(--ak-terminal-accent)' }}>◆</span>} title="ORUNDUM // 合成玉" />
                      <AkCounter value="142" prefixIcon={<span style={{ color: 'var(--ak-signal-info)' }}>◈</span>} title="ORIGINIUM // 至纯源石" />
                    </div>
                  }
                  onBack={() => {
                    setScreenOpen(false)
                  }}
                  backLabel={t('screen.back')}
                >
                  <div className="demo-screen-dashboard">
                    {/* 顶部搜索与分类过滤栏 */}
                    <div className="demo-screen-toolbar">
                      <div className="demo-screen-tabs" role="group" aria-label={t('screen.categories')}>
                        {[
                          { id: 'all' as const, label: t('screen.all'), count: DEPOT_ITEMS.length },
                          { id: 'materials' as const, label: t('screen.materials'), count: DEPOT_ITEMS.filter((i) => i.kind === 'material' && i.subCategory === 'materials').length },
                          { id: 'chips' as const, label: t('screen.chips'), count: DEPOT_ITEMS.filter((i) => i.kind === 'material' && i.subCategory === 'chips').length },
                          { id: 'operators' as const, label: t('screen.operators'), count: DEPOT_ITEMS.filter((i) => i.kind === 'operator').length },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            className={`demo-screen-tab ${screenCategory === cat.id ? 'is-active' : ''}`}
                            aria-pressed={screenCategory === cat.id}
                            onClick={() => {
                              playTactileSound('tab', 0.16)
                              setScreenCategory(cat.id)
                            }}
                          >
                            <span>{cat.label}</span>
                            <span className="demo-screen-tab__badge">{cat.count}</span>
                          </button>
                        ))}
                      </div>

                      <div className="demo-screen-search">
                        <label className="demo-screen-search-label" htmlFor="demo-screen-search">{t('screen.search')}</label>
                        {tune("input-1", <AkInput
                          id="demo-screen-search"
                          size="sm"
                          placeholder={t('screen.searchPlaceholder')}
                          value={screenSearch}
                          onChange={(e) => setScreenSearch(e.target.value)}
                        />)}
                      </div>
                    </div>

                    {screenNotice ? (
                      <div className="demo-screen-feedback" role="alert">
                        {screenNotice}
                      </div>
                    ) : null}

                    {/* 主体分栏：左侧资产网格，右侧战术检视面板 */}
                    <div className="ak-screen__split">
                      {/* 左侧库存网格 */}
                      <div className="demo-screen-inventory">
                        {filteredDepotItems.length === 0 ? (
                          <div className="demo-screen-empty" role="status">
                            <p>{t('screen.empty')}</p>
                            <button type="button" onClick={() => {
                              setScreenSearch('')
                              setScreenCategory('all')
                              document.getElementById('demo-screen-search')?.focus()
                            }}>{t('screen.reset')}</button>
                          </div>
                        ) : filteredDepotItems.map((item) => {
                          if (item.kind === 'material') {
                            const isSelected = selectedDepotItem?.id === item.id
                            const countVal = materialStock[item.id] ?? item.initialCount
                            return (
                              tune(`item-8-${String(item.id)}`, <AkItem
                                key={item.id}
                                tier={item.tier}
                                name={item.name}
                                count={`x${countVal}`}
                                price={item.price}
                                selected={isSelected}
                                onClick={() => {
                                  setSelectedDepotId(item.id)
                                }}
                              />)
                            )
                          }
                          const isSelected = selectedDepotItem?.id === item.id
                          return (
                            tune(`slot-7-${String(item.id)}`, <AkSlot
                              key={item.id}
                              role={item.role}
                              rarity={item.rarity}
                              elite={item.elite}
                              level={item.level}
                              code={item.code}
                              name={item.name}
                              rarityLabel={item.rarityLabel}
                              pressed={isSelected}
                              size="sm"
                              onClick={() => {
                                setSelectedDepotId(item.id)
                              }}
                            />)
                          )
                        })}
                      </div>

                      {/* 右侧战术检视面板 */}
                      <div className="ak-screen__panel">
                        {selectedDepotItem ? (
                          <div className="demo-screen-inspect">
                            {/* 检视顶部：全息展示与主信息 */}
                            <div className="demo-screen-inspect__hero">
                              <div
                                className="demo-screen-inspect__crystal"
                                data-tier={selectedDepotItem.kind === 'material' ? selectedDepotItem.tier : undefined}
                                data-rarity={selectedDepotItem.kind === 'operator' ? selectedDepotItem.rarity : undefined}
                              >
                                {selectedDepotItem.kind === 'material' ? (
                                  tune("item-9", <AkItem
                                    tier={selectedDepotItem.tier}
                                    name={selectedDepotItem.name}
                                    selected
                                    sound={false}
                                    style={{ border: 'none', background: 'transparent' }}
                                  />)
                                ) : (
                                  tune("slot-8", <AkSlot
                                    role={selectedDepotItem.role}
                                    rarity={selectedDepotItem.rarity}
                                    elite={selectedDepotItem.elite}
                                    code={selectedDepotItem.code}
                                    pressed
                                    size="sm"
                                    sound={false}
                                    style={{ border: 'none', background: 'transparent' }}
                                  />)
                                )}
                              </div>
                              <div className="demo-screen-inspect__info">
                                <div className="demo-screen-inspect__chips">
                                  {selectedDepotItem.kind === 'material' ? (
                                    <>
                                      {tune("tag-1", <AkTag variant={selectedDepotItem.tier >= 5 ? 'advanced' : 'neutral'}>
                                        TIER {selectedDepotItem.tier}
                                      </AkTag>)}
                                      <span className="demo-screen-inspect__tag">
                                        STOCK: x{materialStock[selectedDepotItem.id] ?? selectedDepotItem.initialCount}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {tune("tag-2", <AkTag variant="advanced">
                                        {selectedDepotItem.rarityLabel}
                                      </AkTag>)}
                                      <span className="demo-screen-inspect__tag">
                                        LV.{selectedDepotItem.level} // E{selectedDepotItem.elite}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <h3 className="demo-screen-inspect__name">{selectedDepotItem.name}</h3>
                                <span className="demo-screen-inspect__sub">
                                  {selectedDepotItem.nameEn} // ID: {selectedDepotItem.id.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {/* 物质描述或干员数值 */}
                            {selectedDepotItem.kind === 'material' ? (
                              <>
                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">SPECIFICATION ARCHIVE // 物性档案</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    {selectedDepotItem.desc}
                                  </div>
                                </div>

                                {selectedDepotItem.formula ? (
                                  <div className="demo-screen-inspect__section">
                                    <span className="demo-screen-inspect__sec-title">SYNTHESIS REQUIREMENTS // 合成配方需求</span>
                                    <div className="demo-screen-inspect__sec-body">
                                      <div>配方组合: {selectedDepotItem.formula.join(' + ')}</div>
                                      <div style={{ color: 'var(--ak-signal-action)', marginTop: '0.2rem' }}>基础工时费用: {selectedDepotItem.formulaCost}</div>
                                    </div>
                                  </div>
                                ) : null}

                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">RECOMMENDED STAGE // 推荐产出扇区</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    {selectedDepotItem.drops.join(' · ')}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">COMBAT SPECIFICATIONS // 作战数据评定</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    生命上限: {selectedDepotItem.stats.hp} | 攻击力: {selectedDepotItem.stats.atk} | 防御力: {selectedDepotItem.stats.def} | 部署费用: {selectedDepotItem.stats.cost}
                                  </div>
                                </div>

                                <div className="demo-screen-inspect__section">
                                  <span className="demo-screen-inspect__sec-title">SIGNATURE TACTICAL TALENT // 核心战术专精</span>
                                  <div className="demo-screen-inspect__sec-body">
                                    {selectedDepotItem.talent}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* 战术操作按钮组 */}
                            <div className="ak-screen__actions" style={{ marginTop: '0.5rem' }}>
                              {selectedDepotItem.kind === 'material' ? (
                                <>
                                   {tune("button-2", <AkButton
                                    variant="outline"
                                    size="sm"
                                    sound="pip"
                                    onClick={() => {
                                      showScreenNotice(`[SOURCE TRACE] 产出扇区锁定: ${selectedDepotItem.drops.join(' / ')}`)
                                    }}
                                  >
                                    TRACE SOURCE // 来源追踪
                                  </AkButton>)}
                                  {tune("button-3", <AkButton
                                    variant="default"
                                    size="sm"
                                    sound="confirm"
                                    onClick={() => {
                                      showScreenNotice(`[DISPATCH ORDER] 物资 ${selectedDepotItem.name} 已调拨至前线补给站`)
                                    }}
                                  >
                                    DISPATCH // 战术派遣
                                  </AkButton>)}
                                  {tune("button-4", <AkButton
                                    variant="action"
                                    size="sm"
                                    onClick={() => {
                                      setMaterialStock((prev) => ({
                                        ...prev,
                                        [selectedDepotItem.id]: (prev[selectedDepotItem.id] ?? 0) + 1,
                                      }))
                                      showScreenNotice(`[SYNTHESIZE SUCCESS] ${selectedDepotItem.name} +1 // 物质合成配方调配完成`)
                                    }}
                                  >
                                    SYNTHESIZE // 物质合成
                                  </AkButton>)}
                                </>
                              ) : (
                                <>
                                  {tune("button-5", <AkButton
                                    variant="outline"
                                    size="sm"
                                    sound="pip"
                                    onClick={() => {
                                      showScreenNotice(`[DOSSIER LINK] 档案解密完成: ${selectedDepotItem.meta} // 潜能活化正常`)
                                    }}
                                  >
                                    DOSSIER // 档案查阅
                                  </AkButton>)}
                                  {tune("button-6", <AkButton
                                    variant="default"
                                    size="sm"
                                    sound="elite"
                                    onClick={() => {
                                      showScreenNotice(`[ELITE UPGRADE] 干员 ${selectedDepotItem.name} 专精状态同步完成`)
                                    }}
                                  >
                                    PROMOTION // 专精强化
                                  </AkButton>)}
                                  {tune("button-7", <AkButton
                                    variant="action"
                                    size="sm"
                                    onClick={() => {
                                      showScreenNotice(`[DEPLOY READY] 干员 ${selectedDepotItem.name} 已入编第一战术先遣梯队`)
                                    }}
                                  >
                                    DEPLOY // 战术入队
                                  </AkButton>)}
                                </>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </AkScreen>)}
              </dialog>
            ) : null}
          </div>
        </div>
}
