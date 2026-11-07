import { AkRarity, AkRarityChip, AkRarityBar, AkRarityScope, AkProfession, AkProfessionLabel, AkElite, AkPotential, AkSpec, AkTrust, AkSkillLevels, AkPotList, AkPot, AkAttrs, AkAttr, AkKv, AkKvItem, type AkSkillLevel } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue, MessageKey } from '../i18n'
import type { Tune } from '../example-tune'

const POTENTIAL_STEPS: { n: number; label: MessageKey; body: MessageKey; active?: boolean }[] = [
  { n: 2, label: 'common.potential2', body: 'common.deployCostMinus', active: true },
  { n: 3, label: 'common.potential3', body: 'common.atkPlus' },
  { n: 4, label: 'common.potential4', body: 'common.redeployMinus' },
]

export type GameDataModel = { t: I18nValue['t']; skillLevel: AkSkillLevel; setSkillLevel: Dispatch<SetStateAction<AkSkillLevel>> }

export function renderGameData({ t, skillLevel, setSkillLevel }: GameDataModel, tune: Tune) {
  return <div className="demo-stack">
          <div className="demo-row" style={{ alignItems: 'center' }}>
            {tune("rarity-1", <AkRarity level={6} aria-label={t('common.rarityAria', { n: 6 })} />)}
            {tune("rarity-2", <AkRarity level={5} size="lg" aria-label={t('common.rarityAria', { n: 5 })} />)}
            {tune("rarity-3", <AkRarity level={2} variant="white" aria-label={t('common.rarityAria', { n: 2 })} />)}
            {tune("rarity-4", <AkRarity level={3} size="sm" aria-label={t('common.rarityAria', { n: 3 })} />)}
            {tune("rarity-chip-1", <AkRarityChip level={6}>R6</AkRarityChip>)}
            {tune("rarity-bar-1", <AkRarityBar level={4} style={{ padding: 'var(--ak-space-2)', backgroundColor: 'var(--ak-surface-sunken)' }}>
              <span className="ak-r-text">R4 {t('common.rail')}</span>
            </AkRarityBar>)}
            {tune("rarity-scope-1", <AkRarityScope level={6} className="demo-row" style={{ alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.5rem', background: 'var(--ak-surface-sunken)' }}>
              <span className="ak-r-text" style={{ fontWeight: 800, fontSize: '0.8rem' }}>★6</span>
              <span className="ak-r-text" style={{ fontSize: '0.78rem' }}>{t('ref.arknights.rarityScope')}</span>
            </AkRarityScope>)}
          </div>

          <div className="demo-row" style={{ alignItems: 'center' }}>
            {tune("profession-1", <AkProfession name="medic" boxed size="lg" icon={<span aria-hidden="true">+</span>} />)}
            {tune("profession-2", <AkProfession name="caster" outline icon={<span aria-hidden="true">◇</span>} />)}
            {tune("profession-label-1", <AkProfessionLabel
              name={t('common.medic')}
              en={t('common.medicLatin')}
              prof="medic"
              subProf={<span aria-hidden="true">✚</span>}
              subProfLabel={t('ref.arknights.subProf')}
            />)}
            {tune("elite-1", <AkElite level={2} icon={<b>E2</b>} title={t('common.eliteTitle', { n: 2 })} />)}
            {tune("potential-1", <AkPotential label={t('common.potentialN', { n: 6 })} icon={<b>S3</b>} />)}
            {tune("spec-1", <AkSpec label={t('common.mastery3')} icon={<b>S3</b>} bare />)}
            {tune("trust-1", <AkTrust value={t('common.trustValue', { n: 200 })} />)}
          </div>

          {tune("skill-levels-1", <AkSkillLevels value={skillLevel} onValueChange={setSkillLevel} max="M3" ariaLabel={t('common.skillLevelAria')} />)}

          {tune("pot-list-1", <AkPotList>
            {POTENTIAL_STEPS.map((step) => (
              tune(`pot-1-${String(step.label)}`, <AkPot
                key={step.label}
                index={
                  <b>
                    {t('common.potentialShort')}
                    {step.n}
                  </b>
                }
                label={t(step.label)}
                active={step.active}
              >
                {t(step.body)}
              </AkPot>)
            ))}
          </AkPotList>)}

          {tune("attrs-1", <AkAttrs>
            {tune("attr-1", <AkAttr label={t('common.atk')} labelCn={t('common.attack')} value="1234" hint="+90" accent />)}
            {tune("attr-2", <AkAttr label={t('common.def')} labelCn={t('common.defense')} value="312" />)}
            {tune("attr-3", <AkAttr label={t('common.rst')} labelCn={t('common.resist')} value="0" />)}
          </AkAttrs>)}

          {tune("kv-1", <AkKv>
            {tune("kv-item-1", <AkKvItem label={t('common.faction')}>{t('common.rhodes')}</AkKvItem>)}
            {tune("kv-item-2", <AkKvItem label={t('common.released')}>2019-05-01</AkKvItem>)}
          </AkKv>)}
        </div>
}
