import { AkCommandGrid, AkCommand, AkCommandGroup, AkOverline, AkSlot, AkItem, AkButton, AkScreen, AkStatus, AkCounter, AkInput, AkTag, playTactileSound, type AkSlotRole, type AkSlotRarity } from '../../ak'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type DepotCategory = 'all' | 'materials' | 'chips' | 'operators'

interface DepotMaterial {
  kind: 'material'
  id: string
  name: string
  nameEn: string
  tier: 1 | 2 | 3 | 4 | 5 | 6
  initialCount: number
  price?: string
  subCategory: 'materials' | 'chips'
  desc: string
  formula?: string[]
  formulaCost?: string
  drops: string[]
}

interface DepotOperator {
  kind: 'operator'
  id: string
  name: string
  nameEn: string
  code: string
  role: AkSlotRole
  rarity: AkSlotRarity
  elite: 0 | 1 | 2
  level: number
  meta: string
  rarityLabel: string
  talent: string
  stats: { hp: string; atk: string; def: string; cost: number }
}

export type DepotItem = DepotMaterial | DepotOperator

export const DEPOT_ITEMS: DepotItem[] = [
  // Materials
  {
    kind: 'material',
    id: 'mat-originium',
    name: '源石原石',
    nameEn: 'ORIGINIUM PRIME',
    tier: 6,
    initialCount: 18,
    price: '180 龙门币',
    subCategory: 'materials',
    desc: '高浓缩天然活性源石，蕴含无尽能量但极度危险，为罗德岛最高等级战术战略储备资产。',
    drops: ['战术采购', '三星通关档案', '突袭作战评定'],
  },
  {
    kind: 'material',
    id: 'mat-d32',
    name: 'D32钢',
    nameEn: 'D32 STEEL',
    tier: 6,
    initialCount: 4,
    subCategory: 'materials',
    desc: '极其稀有的特种钢材，由数种重金属与源石晶体融合锻造，代表泰拉尖端材料工艺极限。',
    formula: ['1x 聚合剂', '1x 双极纳米片', '1x 改量装置'],
    formulaCost: '3,000 龙门币',
    drops: ['加工站合成', '主线 S4-1 极罕见'],
  },
  {
    kind: 'material',
    id: 'mat-nano',
    name: '双极纳米片',
    nameEn: 'BIPOLAR NANOFLAKE',
    tier: 5,
    initialCount: 6,
    subCategory: 'materials',
    desc: '具备超导与形态记忆特性的尖端纳米材料，用于干员最高等级潜能活化与专精升格。',
    formula: ['1x 改量装置', '2x 白马醇'],
    formulaCost: '2,500 龙门币',
    drops: ['加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-poly',
    name: '聚合剂',
    nameEn: 'POLYMERIZATION PREP',
    tier: 5,
    initialCount: 3,
    subCategory: 'materials',
    desc: '高分子聚合凝合剂，工业级精密附着介质，可极大提升异种合金界面的结构耐受力。',
    formula: ['1x 提纯源岩', '1x 异铁块'],
    formulaCost: '2,500 龙门币',
    drops: ['加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-cryst',
    name: '晶体电子单元',
    nameEn: 'CRYSTALLINE UNIT',
    tier: 5,
    initialCount: 5,
    subCategory: 'materials',
    desc: '复合源石结晶与超纯硅晶圆的高算力电子控制单元，战术终极武器装具核心。',
    formula: ['1x 晶体电路', '2x 凝胶'],
    formulaCost: '2,500 龙门币',
    drops: ['加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-device-t4',
    name: '改量装置',
    nameEn: 'MODIFIED DEVICE',
    tier: 4,
    initialCount: 12,
    subCategory: 'materials',
    desc: '精密改型电子机械装置，具备强大的信号调制能力与抗电磁干扰冗余。',
    formula: ['1x 全新装置', '2x 固源岩', '1x 研磨石'],
    formulaCost: '1,500 龙门币',
    drops: ['主线 3-4', '主线 4-10', '加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-manganese',
    name: '三水锰矿',
    nameEn: 'MANGANESE TRIHYDRATE',
    tier: 4,
    initialCount: 8,
    subCategory: 'materials',
    desc: '极为坚硬的金属矿石晶体，常用于合金催化与战术电极表层硬化涂层。',
    formula: ['2x 锰矿', '1x 聚酸酯组', '1x 炽合金'],
    formulaCost: '1,500 龙门币',
    drops: ['主线 4-7', '加工站合成'],
  },
  {
    kind: 'material',
    id: 'mat-kohl',
    name: '白马醇',
    nameEn: 'WHITE HORSE KOHL',
    tier: 4,
    initialCount: 16,
    subCategory: 'materials',
    desc: '特殊提纯发光醇类溶剂，性质极其稳定，用于高分子有机合成与源石溶液催化。',
    drops: ['主线 4-4', '主线 6-11'],
  },
  {
    kind: 'material',
    id: 'mat-orirock-t3',
    name: '固源岩组',
    nameEn: 'ORIROCK CLUSTER',
    tier: 3,
    initialCount: 142,
    subCategory: 'materials',
    desc: '成组开采的天然源石岩矿体，罗德岛基建与日常物质调配的高频消耗品。',
    formula: ['5x 固源岩'],
    formulaCost: '200 龙门币',
    drops: ['主线 1-7', '主线 2-4'],
  },
  {
    kind: 'material',
    id: 'mat-alloy',
    name: '炽合金',
    nameEn: 'INCANDESCENT ALLOY',
    tier: 3,
    initialCount: 67,
    subCategory: 'materials',
    desc: '具备高温超导性能的高纯特种合金块，可承受超极限源石技艺热冲击。',
    drops: ['主线 S3-6', '主线 S5-3'],
  },
  // Chips
  {
    kind: 'material',
    id: 'chip-grd',
    name: '近卫双芯片',
    nameEn: 'GUARD DUAL CHIP',
    tier: 5,
    initialCount: 14,
    subCategory: 'chips',
    desc: '记录近卫干员精英二阶晋升神经反射与近身格斗数据的尖端战术存储晶片。',
    formula: ['2x 近卫芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-sni',
    name: '狙击双芯片',
    nameEn: 'SNIPER DUAL CHIP',
    tier: 5,
    initialCount: 8,
    subCategory: 'chips',
    desc: '记录狙击干员远距离弹道测算、光学微光瞄准与风偏校准经验的专用晶片。',
    formula: ['2x 狙击芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-cas',
    name: '术师双芯片',
    nameEn: 'CASTER DUAL CHIP',
    tier: 5,
    initialCount: 11,
    subCategory: 'chips',
    desc: '记录术师干员源石技艺调幅回路活化与法术共振抑制协议的高阶晶片。',
    formula: ['2x 术师芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-med',
    name: '医疗双芯片',
    nameEn: 'MEDIC DUAL CHIP',
    tier: 5,
    initialCount: 9,
    subCategory: 'chips',
    desc: '记录医疗干员战场紧急生命体征维持与靶向组织再生协议的神经晶片。',
    formula: ['2x 医疗芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  {
    kind: 'material',
    id: 'chip-vng',
    name: '先锋双芯片',
    nameEn: 'VANGUARD DUAL CHIP',
    tier: 5,
    initialCount: 7,
    subCategory: 'chips',
    desc: '记录先锋干员闪击部署机动协同与战术撤退掩护预案的高容量双晶片。',
    formula: ['2x 先锋芯片组', '1x 芯片助剂'],
    formulaCost: '2,000 龙门币',
    drops: ['制造站制造'],
  },
  // Operators
  {
    kind: 'operator',
    id: 'op-silverash',
    name: '银灰',
    nameEn: 'SILVERASH',
    code: 'GRD',
    role: 'guard',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'TRUESILVER',
    rarityLabel: '★★★★★★',
    talent: '真银斩 // 攻击范围极大扩大，防御力降低，同时向攻击范围内的多名敌人发动高速挥砍斩击',
    stats: { hp: '4,120', atk: '890', def: '430', cost: 20 },
  },
  {
    kind: 'operator',
    id: 'op-eyja',
    name: '艾雅法拉',
    nameEn: 'EYJAFJALLA',
    code: 'CAS',
    role: 'caster',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'VOLCANO',
    rarityLabel: '★★★★★★',
    talent: '火山 // 攻击力大幅提升，攻击间隔极大缩短，随机向周围敌人连续发射熔岩爆轰',
    stats: { hp: '2,350', atk: '745', def: '125', cost: 21 },
  },
  {
    kind: 'operator',
    id: 'op-exusiai',
    name: '能天使',
    nameEn: 'EXUSIAI',
    code: 'SNI',
    role: 'sniper',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'OVERLOAD',
    rarityLabel: '★★★★★★',
    talent: '过载模式 // 攻击变为高速5连射，射速极大提升，瞬间摧毁目标防线',
    stats: { hp: '2,280', atk: '630', def: '160', cost: 14 },
  },
  {
    kind: 'operator',
    id: 'op-saria',
    name: '塞雷娅',
    nameEn: 'SARIA',
    code: 'DEF',
    role: 'defender',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'CALCIFY',
    rarityLabel: '★★★★★★',
    talent: '钙质化 // 附近所有敌人减速并受到法术易伤，持续为全场友方干员充能技力并回复生命',
    stats: { hp: '3,850', atk: '560', def: '690', cost: 22 },
  },
  {
    kind: 'operator',
    id: 'op-kaltsit',
    name: '凯尔希',
    nameEn: "KAL'TSIT",
    code: 'MED',
    role: 'medic',
    rarity: 6,
    elite: 2,
    level: 90,
    meta: 'MON3TR',
    rarityLabel: '★★★★★★',
    talent: '指令：熔毁 // 召唤战术召唤物Mon3tr，获得超绝真实伤害爆发与近战拦截能力',
    stats: { hp: '2,800', atk: '590', def: '260', cost: 20 },
  },
  {
    kind: 'operator',
    id: 'op-texas',
    name: '德克萨斯',
    nameEn: 'TEXAS',
    code: 'VNG',
    role: 'vanguard',
    rarity: 5,
    elite: 2,
    level: 80,
    meta: 'SWORDRAIN',
    rarityLabel: '★★★★★',
    talent: '剑雨 // 降下光剑对范围内敌人造成群体法术伤害与强力眩晕，立即获得大量部署费用',
    stats: { hp: '2,100', atk: '570', def: '340', cost: 13 },
  },
  {
    kind: 'operator',
    id: 'op-lappland',
    name: '拉普兰德',
    nameEn: 'LAPPLAND',
    code: 'GRD',
    role: 'guard',
    rarity: 5,
    elite: 2,
    level: 80,
    meta: 'WOLFPACK',
    rarityLabel: '★★★★★',
    talent: '狼魂 // 攻击变为法术伤害并额外攻击一名目标，精神摧毁封锁目标所有特殊能力',
    stats: { hp: '2,350', atk: '685', def: '365', cost: 19 },
  },
  {
    kind: 'operator',
    id: 'op-myrtle',
    name: '桃金娘',
    nameEn: 'MYRTLE',
    code: 'VNG',
    role: 'vanguard',
    rarity: 4,
    elite: 2,
    level: 70,
    meta: 'SUPPORT',
    rarityLabel: '★★★★',
    talent: '治愈之翼 // 停止攻击持续为前线回复生命，并在极短时间内高速生产海量部署费用',
    stats: { hp: '1,720', atk: '510', def: '310', cost: 10 },
  },
]

export const showcaseDialogStyle = { position: 'fixed', inset: 0, width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none', margin: 0, padding: 0, border: 0, background: 'transparent', overflow: 'auto' } as const

export function useShowcaseDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      trigger?.focus()
    }
  }, [open])
  return ref
}

export function filterDepotItems(category: DepotCategory, search: string): DepotItem[] {
  const query = search.trim().toLowerCase()
  return DEPOT_ITEMS.filter((item) => {
    if (category === 'materials' && (item.kind !== 'material' || item.subCategory !== 'materials')) return false
    if (category === 'chips' && (item.kind !== 'material' || item.subCategory !== 'chips')) return false
    if (category === 'operators' && item.kind !== 'operator') return false
    if (!query) return true
    return item.name.toLowerCase().includes(query) || item.nameEn.toLowerCase().includes(query) || (item.kind === 'operator' && item.code.toLowerCase().includes(query))
  })
}

export function useCommandNotice(initialNotice: string | null = null, initialExpiresAt: number | null = null) {
  const [screenNotice, setScreenNotice] = useState(initialNotice)
  const [screenNoticeExpiresAt, setScreenNoticeExpiresAt] = useState(initialExpiresAt)
  const showScreenNotice = useCallback((message: string) => {
    setScreenNotice(message)
    setScreenNoticeExpiresAt(Date.now() + 3000)
  }, [])
  useEffect(() => {
    if (screenNotice === null || screenNoticeExpiresAt === null) return
    const timer = window.setTimeout(() => {
      setScreenNotice(null)
      setScreenNoticeExpiresAt(null)
    }, Math.max(0, screenNoticeExpiresAt - Date.now()))
    return () => window.clearTimeout(timer)
  }, [screenNotice, screenNoticeExpiresAt])
  return { screenNotice, screenNoticeExpiresAt, showScreenNotice }
}


export type CommandModel = { t: I18nValue['t']; selectedCommand: string; setSelectedCommand: Dispatch<SetStateAction<string>>; selectedSlot: string; setSelectedSlot: Dispatch<SetStateAction<string>>; selectedItem: string; setSelectedItem: Dispatch<SetStateAction<string>>; screenOpen: boolean; setScreenOpen: Dispatch<SetStateAction<boolean>>; screenDialogRef: { current: HTMLDialogElement | null }; screenCategory: DepotCategory; setScreenCategory: Dispatch<SetStateAction<DepotCategory>>; screenSearch: string; setScreenSearch: Dispatch<SetStateAction<string>>; selectedDepotItem: DepotItem | undefined; setSelectedDepotId: Dispatch<SetStateAction<string>>; filteredDepotItems: DepotItem[]; materialStock: Record<string, number>; setMaterialStock: Dispatch<SetStateAction<Record<string, number>>>; screenNotice: string | null; showScreenNotice: (msg: string) => void; sanCurrent: number; setSanCurrent: Dispatch<SetStateAction<number>>; sanTotal: number; sanLimit: number; showcaseDialogStyle: CSSProperties }

export function renderCommand({ t, selectedCommand, setSelectedCommand, selectedSlot, setSelectedSlot, selectedItem, setSelectedItem, screenOpen, setScreenOpen, screenDialogRef, screenCategory, setScreenCategory, screenSearch, setScreenSearch, selectedDepotItem, setSelectedDepotId, filteredDepotItems, materialStock, setMaterialStock, screenNotice, showScreenNotice, sanCurrent, setSanCurrent, sanTotal, sanLimit, showcaseDialogStyle }: CommandModel, tune: Tune) {
  return <div className="demo-stack">
          {tune("command-grid-1", <AkCommandGrid style={{ gridAutoRows: '7.5rem' }}>
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

          {tune("command-grid-2", <AkCommandGrid style={{ gridAutoRows: '7.5rem' }}>
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
                  tokens={{ '--ak-screen-signal': '#ff5e19' }}
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
                      <AkCounter value="1,248,500" prefixIcon={<span style={{ color: '#ffd800' }}>⯁</span>} title="LMD // 龙门币" />
                      <AkCounter value="38,400" prefixIcon={<span style={{ color: '#ff5e19' }}>◆</span>} title="ORUNDUM // 合成玉" />
                      <AkCounter value="142" prefixIcon={<span style={{ color: '#4aabea' }}>◈</span>} title="ORIGINIUM // 至纯源石" />
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
                                      <div style={{ color: '#ffd800', marginTop: '0.2rem' }}>基础工时费用: {selectedDepotItem.formulaCost}</div>
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
