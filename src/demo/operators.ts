import type { AkProfessionName, AkSkillLevel } from '../ak'
import type { MessageKey } from './i18n'

/**
 * 控制台视图用的假数据。
 *
 * 这里只存 i18n key，不存字符串：干员名走 `op.*.cn` / `op.*.en`（专有名词，
 * 两种语言下都同时展示），技能名与描述按当前语言取。
 */

export type RosterFilter = 'all' | 'medic' | 'caster'

export interface OperatorSkill {
  name: MessageKey
  desc: MessageKey
}

export interface Operator {
  id: string
  /** 编号小字，展示在名单条目右上角。 */
  code: string
  nameCn: MessageKey
  nameEn: MessageKey
  rarity: 4 | 5 | 6
  profession: AkProfessionName
  /** `AkProfession` 的图标节点——库里不带游戏素材，宿主给个字形即可。 */
  glyph: string
  cost: number
  elite: 0 | 1 | 2
  trust: number
  skillLevel: AkSkillLevel
  stats: { atk: number; def: number; res: number }
  skills: [OperatorSkill, OperatorSkill]
  tags: MessageKey[]
}

/** 职业色块的图标字形（纯文字，不引素材）。 */
export const PROFESSION_GLYPHS: Record<AkProfessionName, string> = {
  pioneer: '▲',
  warrior: '✚',
  tank: '▣',
  sniper: '➤',
  caster: '◇',
  medic: '+',
  support: '◎',
  special: '★',
}

/** 职业名（列表 / 详情里用，随语言变化）。 */
export const PROFESSION_KEYS: Record<AkProfessionName, MessageKey> = {
  pioneer: 'console.prof.pioneer',
  warrior: 'console.prof.warrior',
  tank: 'console.prof.tank',
  sniper: 'console.prof.sniper',
  caster: 'console.prof.caster',
  medic: 'console.prof.medic',
  support: 'console.prof.support',
  special: 'console.prof.special',
}

/** 潜能提升一览：所有干员共用同一张表，第一格标记为已生效。 */
export const POTENTIAL_STEPS: { n: number; label: MessageKey; body: MessageKey; active?: boolean }[] = [
  { n: 2, label: 'common.potential2', body: 'common.deployCostMinus', active: true },
  { n: 3, label: 'common.potential3', body: 'common.atkPlus' },
  { n: 4, label: 'common.potential4', body: 'common.redeployMinus' },
]

export const operators: Operator[] = [
  {
    id: 'amiya',
    code: 'R001',
    nameCn: 'op.amiya.cn',
    nameEn: 'op.amiya.en',
    rarity: 5,
    profession: 'caster',
    glyph: PROFESSION_GLYPHS.caster,
    cost: 18,
    elite: 2,
    trust: 200,
    skillLevel: 'M3',
    stats: { atk: 512, def: 128, res: 15 },
    skills: [
      { name: 'op.amiya.skill1', desc: 'op.amiya.skill1.desc' },
      { name: 'op.amiya.skill2', desc: 'op.amiya.skill2.desc' },
    ],
    tags: ['console.tag.dps', 'console.tag.aoe'],
  },
  {
    id: 'ifrit',
    code: 'R111',
    nameCn: 'op.ifrit.cn',
    nameEn: 'op.ifrit.en',
    rarity: 6,
    profession: 'caster',
    glyph: PROFESSION_GLYPHS.caster,
    cost: 34,
    elite: 2,
    trust: 200,
    skillLevel: 'M1',
    stats: { atk: 890, def: 140, res: 10 },
    skills: [
      { name: 'op.ifrit.skill1', desc: 'op.ifrit.skill1.desc' },
      { name: 'op.ifrit.skill2', desc: 'op.ifrit.skill2.desc' },
    ],
    tags: ['console.tag.aoe'],
  },
  {
    id: 'eyjafjalla',
    code: 'R110',
    nameCn: 'op.eyja.cn',
    nameEn: 'op.eyja.en',
    rarity: 6,
    profession: 'caster',
    glyph: PROFESSION_GLYPHS.caster,
    cost: 29,
    elite: 2,
    trust: 200,
    skillLevel: 7,
    stats: { atk: 935, def: 132, res: 10 },
    skills: [
      { name: 'op.eyja.skill1', desc: 'op.eyja.skill1.desc' },
      { name: 'op.eyja.skill2', desc: 'op.eyja.skill2.desc' },
    ],
    tags: ['console.tag.dps', 'console.tag.aoe'],
  },
  {
    id: 'kaltsit',
    code: 'R003',
    nameCn: 'op.kaltsit.cn',
    nameEn: 'op.kaltsit.en',
    rarity: 6,
    profession: 'medic',
    glyph: PROFESSION_GLYPHS.medic,
    cost: 19,
    elite: 2,
    trust: 200,
    skillLevel: 'M2',
    stats: { atk: 480, def: 190, res: 0 },
    skills: [
      { name: 'op.kaltsit.skill1', desc: 'op.kaltsit.skill1.desc' },
      { name: 'op.kaltsit.skill2', desc: 'op.kaltsit.skill2.desc' },
    ],
    tags: ['console.tag.heal'],
  },
  {
    id: 'ptilopsis',
    code: 'R026',
    nameCn: 'op.silence.cn',
    nameEn: 'op.silence.en',
    rarity: 5,
    profession: 'medic',
    glyph: PROFESSION_GLYPHS.medic,
    cost: 18,
    elite: 2,
    trust: 200,
    skillLevel: 4,
    stats: { atk: 388, def: 105, res: 0 },
    skills: [
      { name: 'op.silence.skill1', desc: 'op.silence.skill1.desc' },
      { name: 'op.silence.skill2', desc: 'op.silence.skill2.desc' },
    ],
    tags: ['console.tag.heal'],
  },
  {
    id: 'nightingale',
    code: 'R038',
    nameCn: 'op.nightingale.cn',
    nameEn: 'op.nightingale.en',
    rarity: 6,
    profession: 'medic',
    glyph: PROFESSION_GLYPHS.medic,
    cost: 24,
    elite: 1,
    trust: 200,
    skillLevel: 6,
    stats: { atk: 420, def: 148, res: 0 },
    skills: [
      { name: 'op.nightingale.skill1', desc: 'op.nightingale.skill1.desc' },
      { name: 'op.nightingale.skill2', desc: 'op.nightingale.skill2.desc' },
    ],
    tags: ['console.tag.heal', 'console.tag.defense'],
  },
  {
    id: 'exusiai',
    code: 'R033',
    nameCn: 'op.exusiai.cn',
    nameEn: 'op.exusiai.en',
    rarity: 6,
    profession: 'sniper',
    glyph: PROFESSION_GLYPHS.sniper,
    cost: 23,
    elite: 2,
    trust: 200,
    skillLevel: 7,
    stats: { atk: 812, def: 152, res: 0 },
    skills: [
      { name: 'op.exusiai.skill1', desc: 'op.exusiai.skill1.desc' },
      { name: 'op.exusiai.skill2', desc: 'op.exusiai.skill2.desc' },
    ],
    tags: ['console.tag.dps'],
  },
  {
    id: 'saria',
    code: 'R024',
    nameCn: 'op.saria.cn',
    nameEn: 'op.saria.en',
    rarity: 6,
    profession: 'tank',
    glyph: PROFESSION_GLYPHS.tank,
    cost: 26,
    elite: 2,
    trust: 200,
    skillLevel: 'M3',
    stats: { atk: 512, def: 682, res: 10 },
    skills: [
      { name: 'op.saria.skill1', desc: 'op.saria.skill1.desc' },
      { name: 'op.saria.skill2', desc: 'op.saria.skill2.desc' },
    ],
    tags: ['console.tag.defense', 'console.tag.slow'],
  },
]
