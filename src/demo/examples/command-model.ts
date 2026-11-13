import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { AkSlotRole, AkSlotRarity } from '../../ak'

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


