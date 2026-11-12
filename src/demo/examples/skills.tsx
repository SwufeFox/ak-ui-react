import {
  AkArchive,
  AkArchivePlay,
  AkCalc,
  AkDialogue,
  AkDialogueLine,
  AkDossier,
  AkItem,
  AkItemList,
  AkModule,
  AkModuleStage,
  AkModuleUnlock,
  AkRedacted,
  AkRichText,
  AkSkill,
  AkSkillMatrix,
  AkSkillSheet,
  AkSp,
  AkSpTrigger,
  AkSpValue,
  AkTalent,
  AkTalentTable,
  AkVoice,
  AkVoiceList,
  type AkRichTextNode,
  type AkSkillMatrixRow,
  type AkSkillSheetLevel,
  type AkTalentRow,
} from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

const LEVELS: AkSkillSheetLevel[] = [
  { description: '攻击范围扩大至 3 格，攻击力 +12%。', init: 0, cost: 25, duration: 30 },
  { description: '攻击范围扩大至 3 格，攻击力 +18%。', init: 0, cost: 25, duration: 30 },
  { description: '攻击范围扩大至 4 格，攻击力 +25%。', init: 5, cost: 28, duration: 30 },
]

const MATRIX_ROWS: AkSkillMatrixRow[] = [
  { key: 'atk', label: '攻击力', values: ['100%', '120%', '140%', '160%', '180%', '200%', '220%', '240%', '260%', '280%'] },
  { key: 'interval', label: '攻击间隔', values: ['1.0s', '1.0s', '1.0s', '0.9s', '0.9s', '0.9s', '0.8s', '0.8s', '0.8s', '0.7s'] },
  { key: 'sp', label: '技力消耗', sp: 'init', values: ['—', '—', '—', '—', '—', '—', '—', '—', '—', '—'] },
]

const TALENT_ROWS: AkTalentRow[] = [
  { name: '应急部署', condition: '精英二 · 1级', description: '部署费用 -3。', potential: '部署费用 -4。' },
  { name: '应急部署', condition: '精英二 · 2级', description: '部署费用 -3。', potential: '部署费用 -4。' },
]

const RICH: AkRichTextNode[] = [
  { type: 'text', text: '部署后立即获得 ' },
  { type: 'value', text: '3', delta: 'up' },
  { type: 'text', text: ' 点 ' },
  { type: 'buff', children: '攻击力' },
  { type: 'text', text: '，持续 ' },
  { type: 'term', children: '25 秒', tip: '结束时进入 30 秒冷却。' },
  { type: 'text', text: '。' },
]

export type SkillsModel = { t: I18nValue['t'] }

export function renderSkills({ t }: SkillsModel, tune: Tune) {
  return <div className="demo-stack">
          {tune('skill-1', <div style={{ maxWidth: '30rem' }}>
            {tune('skill-1-a', <AkSkill
              name="鞘击"
              alias={{ en: 'Sheer Strike' }}
              spType="auto"
              trigger="auto"
              cost={25}
              init={0}
              duration="25s"
              unlock="技能2 · 精英一开放"
            >
              <AkSp spType="auto" />
            </AkSkill>)}
          </div>)}

          {tune('sp-1', <div className="demo-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {tune('sp-1-a', <AkSp spType="auto" />)}
            {tune('sp-1-b', <AkSp spType="attack" />)}
            {tune('sp-1-c', <AkSp spType="hit" />)}
            {tune('sp-1-d', <AkSp spType="passive-recovery" />)}
            {tune('sp-1-e', <AkSp spType="passive" />)}
          </div>)}

          {tune('sp-2', <div className="demo-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {tune('sp-2-a', <AkSpTrigger />)}
            {tune('sp-2-b', <AkSpTrigger auto />)}
            {tune('sp-2-c', <AkSpValue kind="cost" value={25} />)}
            {tune('sp-2-d', <AkSpValue kind="init" value={0} />)}
            {tune('sp-2-e', <AkSpValue kind="duration" value={30} />)}
          </div>)}

          {tune('skill-sheet-1', <div style={{ maxWidth: '42rem' }}>
            {tune('skill-sheet-1-a', <AkSkillSheet levels={LEVELS} highlight={3} label={`${t('ref.skills.title')} · 鞘击`} footer="※ 不可对空" />)}
          </div>)}

          {tune('skill-matrix-1', <div style={{ maxWidth: '46rem' }}>
            {tune('skill-matrix-1-a', <AkSkillMatrix
              rows={MATRIX_ROWS}
              label="鞘击 · 各等级参数"
              description={(context) => (
                <span>
                  攻击力提升至 <b>{context.Var('atk')}</b>，攻击间隔缩短至 <b>{context.Var('interval')}</b>。
                </span>
              )}
            />)}
          </div>)}

          {tune('talent-1', <div style={{ maxWidth: '30rem' }}>
            {tune('talent-1-a', <AkTalent name="应急部署" requirements={[{ text: '精英二 · 1级' }]}>
              部署费用 -3。
            </AkTalent>)}
          </div>)}

          {tune('talent-table-1', <div style={{ maxWidth: '46rem' }}>
            {tune('talent-table-1-a', <AkTalentTable
              title="第一天赋"
              rows={TALENT_ROWS}
              potentialRank={5}
              calcToggle
              renderDescription={(row, withPotential) => (
                <>
                  {withPotential ? row.potential : row.description}
                  {withPotential ? <AkCalc kind="add" /> : null}
                </>
              )}
            />)}
          </div>)}

          {tune('rich-text-1', <p style={{ maxWidth: '34rem' }}>
            {tune('rich-text-1-a', <AkRichText nodes={RICH} />)}
          </p>)}

          {tune('module-1', <div style={{ maxWidth: '40rem' }}>
            {tune('module-1-a', <AkModule
              name="原型机 · SWO-X"
              typeName="SWO-X"
              tasks={['完成 1-7 章节', '收集 12 枚源石碎片']}
              stages={[
                <AkModuleStage key="s1" stage={1} stats={{ 攻击力: '+30', 防御力: '+10' }}>
                  追加特性「战术储备」。
                </AkModuleStage>,
                <AkModuleStage key="s2" stage={2} stats={{ 攻击力: '+60' }} kicker="特性追加">
                  追加特性「过载」。
                </AkModuleStage>,
              ]}
              unlock={[
                <AkModuleUnlock key="u1" stage={1} requirement="信赖 200 · 精英阶段 2 · 等级 30">
                  <AkItem tier={3} name="D32" size="sm" sound={false} />
                </AkModuleUnlock>,
              ]}
            />)}
          </div>)}

          {tune('dossier-1', <div style={{ maxWidth: '38rem' }}>
            {tune('dossier-1-a', <AkDossier title="客观履历" en="Objective Record" unlock="完成 1-7 后开放" locked>
              <p>干员编号 002_EXIUS，隶属罗德岛医疗部门。</p>
              <p>部署费用 <AkRedacted>—</AkRedacted>。</p>
            </AkDossier>)}
          </div>)}

          {tune('archive-1', <div style={{ maxWidth: '38rem' }}>
            {tune('archive-1-a', <AkArchive title="密录 1" kicker="密录" unlock="成就「第一滴血」后开放" footer={<AkArchivePlay href="#components-19">阅读密录</AkArchivePlay>}>
              <p>密录内容在解锁后显示；未解锁时保留占位，避免空白。</p>
            </AkArchive>)}
          </div>)}

          {tune('dialogue-1', <div style={{ maxWidth: '38rem' }}>
            {tune('dialogue-1-a', <AkDialogue>
              <AkDialogueLine speaker="凯尔希">终端接入完成。</AkDialogueLine>
              <AkDialogueLine>舱门开启，白光涌入。</AkDialogueLine>
            </AkDialogue>)}
          </div>)}

          {tune('voice-1', <div style={{ maxWidth: '38rem' }}>
            {tune('voice-1-a', <AkVoiceList
              languages={[{ value: 'zh', label: '中文', cv: 'CV 竹本' }]}
              texts={[{ value: 'greet', label: '任命助理' }]}
            >
              <AkVoice title="任命助理" text="需要我做什么？" lang="zh" unlock="主线 1-7 后开放" />
            </AkVoiceList>)}
          </div>)}

          {tune('item-list-1', <AkItemList size="sm">
            <AkItem tier={3} name="D32" size="sm" sound={false} />
            <AkItem tier={4} name="E2" size="sm" sound={false} />
            <AkItem tier={5} name="O3" size="sm" sound={false} />
          </AkItemList>)}
        </div>
}
