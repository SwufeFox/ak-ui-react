import {
  AkCamp,
  AkCountdown,
  AkEnemy,
  AkEvent,
  AkHero,
  AkItem,
  AkMaterials,
  AkMaterialsDivider,
  AkMaterialsRow,
  AkNews,
  AkOpCard,
  AkOpGrid,
  AkOpRow,
  AkPhaseTabs,
  AkRange,
  AkSanity,
  AkStage,
  AkStageCode,
} from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

/** 势力徽标：一个自绘的几何标记，不是游戏素材。 */
const CAMP_MARK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2 22 12 12 22 2 12Z' fill='none' stroke='%23ffffff' stroke-width='2'/></svg>"

export type OperatorsModel = {
  t: I18nValue['t']
  phase: number
  setPhase: (phase: number) => void
}

export function renderOperators({ t, phase, setPhase }: OperatorsModel, tune: Tune) {
  return <div className="demo-stack">
          {tune('hero-1', <AkHero
            eyebrow="PRTS.WIKI // OPERATOR DOSSIER"
            title="OPERATOR ARCHIVE"
            subtitle="干员档案 · 罗德岛人事终端"
            description="从作战记录到密录封存：档案面板按终端口径排版，锁定区仍然可读、可检索。"
          />)}

          {tune('op-grid-1', <AkOpGrid>
            {tune('op-card-1', <AkOpCard name="EXIUS" sub="EXIUS // 医疗 · 精英二" rarity={6} elite={2} size="md" />)}
            {tune('op-card-2', <AkOpCard name="AMIYA" sub="AMIYA // 术师 · 精英二" rarity={5} elite={2} size="md" variant="rail" current />)}
            {tune('op-card-3', <AkOpCard name="MUMEN" sub="MUMEN // 重装 · 精英一" rarity={4} elite={1} size="md" />)}
            {tune('op-card-4', <AkOpCard name="EMBER" sub="EMBER // 狙击 · 精英一" rarity={4} elite={1} size="sm" avatarOnly avatarAlt="EMBER" />)}
          </AkOpGrid>)}

          {tune('op-row-1', <div className="demo-stack" style={{ gap: '0.35rem' }}>
            {tune('op-row-1-a', <AkOpRow name="EXIUS" rarity={6} stars meta="医疗 // 精英二" />)}
            {tune('op-row-1-b', <AkOpRow name="AMIYA" rarity={5} stars meta="术师 // 精英二" />)}
            {tune('op-row-1-c', <AkOpRow name="MUMEN" rarity={4} stars meta="重装 // 精英一" />)}
          </div>)}

          {tune('enemy-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {tune('enemy-1-a', <AkEnemy name="首领" code="B003" variant="boss" level={5} levelMax={5} />)}
            {tune('enemy-1-b', <AkEnemy name="术师单元" code="E020" variant="elite" level={3} levelMax={5} />)}
            {tune('enemy-1-c', <AkEnemy name="源石虫" code="N001" level={1} levelMax={5} />)}
          </div>)}

          {tune('stage-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {tune('stage-1-a', <AkStage code="1-7" name="通往罗德岛" caption="Main · Chapter 1" level="LV.30" sanity={1} />)}
            {tune('stage-1-b', <AkStage code="H6-4" name="风暴之心" caption="Hard · Chapter 6" variant="hard" level="E2 LV.40" sanity={18} />)}
            {tune('stage-1-c', <AkStage code="TO-EX-1" name="余像" caption="Ex · Event" variant="ex" sanity={30} />)}
          </div>)}

          {tune('stage-code-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {tune('stage-code-1-a', <AkStageCode>1-7</AkStageCode>)}
            {tune('stage-code-1-b', <AkStageCode variant="hard">H6-4</AkStageCode>)}
            {tune('stage-code-1-c', <AkSanity value={18} />)}
          </div>)}

          {tune('event-1', <div style={{ maxWidth: '34rem' }}>
            {tune('event-1-a', <AkEvent
              title="如梦似幻"
              kind="Side Story · 进行中"
              time="2026.08.08 16:00 — 09.07 03:59"
              status="live"
            />)}
          </div>)}

          {tune('countdown-1', <div className="demo-row" style={{ alignItems: 'center', gap: '1rem' }}>
            {tune('countdown-1-a', <AkCountdown remaining={2 * 86400 + 3 * 3600 + 42 * 60} label={t('ref.operators.countdown')} />)}
          </div>)}

          {tune('camp-1', <div className="demo-row" style={{ alignItems: 'center', gap: '1rem' }}>
            {tune('camp-1-a', <AkCamp src={CAMP_MARK} name="RHODES ISLAND" />)}
            {tune('camp-1-b', <AkCamp src={CAMP_MARK} name="KAL'THIAT" size="lg" variant="box" />)}
            {tune('camp-1-c', <AkCamp src={CAMP_MARK} name="SIRACUSA" logoOnly />)}
          </div>)}

          {tune('range-1', <div className="demo-row" style={{ alignItems: 'center', gap: '1rem' }}>
            {tune('range-1-a', <AkRange grids={[{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: -1, col: 1 }]} size="md" />)}
            {tune('range-1-b', <AkRange grids={[[0, 1], [0, 2], [1, 1]]} size="sm" />)}
          </div>)}

          {tune('phase-tabs-1', <AkPhaseTabs value={phase} onValueChange={setPhase} max={2} label={t('ref.operators.phaseLabel')} />)}

          {tune('materials-1', <AkMaterials>
            {tune('materials-1-a', <AkMaterialsRow label="精英阶段 0 → 1">
              <AkItem tier={3} name="D32" size="sm" sound={false} />
            </AkMaterialsRow>)}
            {tune('materials-1-b', <AkMaterialsRow label="精英阶段 1 → 2">
              <AkItem tier={3} name="D32" size="sm" sound={false} />
              <AkItem tier={4} name="E2" size="sm" sound={false} />
            </AkMaterialsRow>)}
            {tune('materials-1-c', <AkMaterialsDivider>达到精英阶段 1 后解锁模组</AkMaterialsDivider>)}
          </AkMaterials>)}

          {tune('news-1', <AkNews title="PRTS" />)}
        </div>
}
