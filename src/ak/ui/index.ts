export { AkButton } from './button/AkButton'
export { AkCard, AkCardContent, AkCardDescription, AkCardFooter, AkCardHeader, AkCardTitle } from './card/AkCard'
export { AkStatus, AkTag } from './status/AkStatus'
export { AkNotice } from './notice/AkNotice'
export { AkGauge, AkProgress } from './progress/AkProgress'
export { AkSlider } from './slider/AkSlider'
export { AkInputNumber } from './input-number/AkInputNumber'
export { AkSegmented, AkTabs } from './tabs/AkTabs'
export { AkCountUp } from './effects/AkCountUp'
// 上游 .ak-fx-* 特效层（glow / outline / skew）——此前只有 CSS，没有组件暴露
export { AkGlow, AkOutline, AkSkew } from './effects/AkFx'
// 景深：把上游孤儿控制器 createDashboardDepth 与它的 CSS 消费规则接起来
export { AkDepth, AkDepthLayer } from './effects/AkDepth'
export { AkEntrance } from './effects/AkEntrance'
export { AkAssetLoader } from './site/AkAssetLoader'
export { AkMediaGallery } from './site/AkMediaGallery'
export { AkMobileMenu } from './site/AkMobileMenu'
export { AkParticleField } from './site/AkParticleField'
export { AkSectionNavigator } from './site/AkSectionNavigator'

// decor —— 方舟几何装饰语言（移植自 prts-design, MIT）
export {
  AkBilingual,
  AkBlueBand,
  AkBrackets,
  AkChevrons,
  AkCodeId,
  AkCorner,
  AkCut,
  AkDisplay,
  AkEn,
  AkGlyph,
  AkGlyphBox,
  AkGridBackdrop,
  AkHalftone,
  AkInverse,
  AkMotion,
  AkNum,
  AkOverline,
  AkStripes,
  AkWatermark,
} from './decor/AkDecor'

// arknights —— 游戏数据组件（移植自 prts-design, MIT）
export {
  AkAttr,
  AkAttrs,
  AkElite,
  AkKv,
  AkKvItem,
  AkPot,
  AkPotList,
  AkPotential,
  AkProfession,
  AkProfessionLabel,
  AkRarity,
  AkRarityBar,
  AkRarityChip,
  AkRarityScope,
  AkSkillLevels,
  AkSpec,
  AkTrust,
} from './arknights/AkArknights'

