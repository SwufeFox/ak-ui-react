export { AkButton, type AkButtonProps, type AkButtonVariant } from './ui/button/AkButton'
export {
  AkCard,
  AkCardContent,
  AkCardDescription,
  AkCardFooter,
  AkCardHeader,
  AkCardTitle,
  type AkCardProps,
  type AkCardVariant,
} from './ui/card/AkCard'
export { AkStatus, AkTag, type AkStatusProps, type AkStatusVariant, type AkTagProps, type AkTagVariant } from './ui/status/AkStatus'
export { AkNotice, type AkNoticeProps, type AkNoticeVariant } from './ui/notice/AkNotice'
export { AkGauge, AkProgress, type AkGaugeProps, type AkGaugeVariant, type AkProgressProps, type AkProgressVariant } from './ui/progress/AkProgress'
export { AkSlider, type AkSliderProps } from './ui/slider/AkSlider'
export { AkInputNumber, type AkInputNumberProps } from './ui/input-number/AkInputNumber'
export { AkSegmented, AkTabs, type AkSegmentedOption, type AkSegmentedProps, type AkTabsItem, type AkTabsProps } from './ui/tabs/AkTabs'
export { AkCountUp, type AkCountUpHandle, type AkCountUpProps } from './ui/effects/AkCountUp'
export { AkEntrance, type AkEntranceHandle, type AkEntranceProps } from './ui/effects/AkEntrance'
export { AkAssetLoader, type AkAssetLoaderProps } from './ui/site/AkAssetLoader'
export { AkMediaGallery, type AkMediaGalleryProps, type GalleryItem } from './ui/site/AkMediaGallery'
export { AkMobileMenu, type AkMobileMenuHandle, type AkMobileMenuProps } from './ui/site/AkMobileMenu'
export { AkParticleField, type AkParticleFieldProps } from './ui/site/AkParticleField'
export { AkSectionNavigator, type AkSectionNavigatorHandle, type AkSectionNavigatorProps } from './ui/site/AkSectionNavigator'

// ==== 以下两层移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）====
// https://github.com/MooncellWiki/prts-design

// decor —— 方舟几何装饰语言
export {
  AkBilingual,
  AkBlueBand,
  AkBrackets,
  AkChevrons,
  AkCodeId,
  AkCorner,
  AkDisplay,
  AkEn,
  AkGlyph,
  AkGlyphBox,
  AkGridBackdrop,
  AkHalftone,
  AkInverse,
  AkNum,
  AkOverline,
  AkStripes,
  AkWatermark,
  type AkBackdropVariant,
  type AkBilingualProps,
  type AkBlueBandProps,
  type AkBracketsProps,
  type AkChevronsProps,
  type AkCodeIdProps,
  type AkCornerPosition,
  type AkCornerProps,
  type AkCornerTone,
  type AkDisplayProps,
  type AkEnProps,
  type AkGlyphBoxProps,
  type AkGlyphProps,
  type AkGridBackdropProps,
  type AkHalftoneProps,
  type AkHalftoneVariant,
  type AkInverseProps,
  type AkNumProps,
  type AkOverlineProps,
  type AkStripesProps,
  type AkStripesVariant,
  type AkWatermarkProps,
} from './ui/decor/AkDecor'

// arknights —— 游戏数据组件
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
  type AkAttrProps,
  type AkAttrsProps,
  type AkEliteProps,
  type AkKvItemProps,
  type AkKvProps,
  type AkKvVariant,
  type AkPotListProps,
  type AkPotProps,
  type AkPotentialProps,
  type AkProfessionLabelProps,
  type AkProfessionName,
  type AkProfessionProps,
  type AkProfessionSize,
  type AkRarityBarProps,
  type AkRarityChipProps,
  type AkRarityLevel,
  type AkRarityProps,
  type AkRarityScopeProps,
  type AkRaritySize,
  type AkSkillLevel,
  type AkSkillLevelsProps,
  type AkSpecProps,
  type AkTrustProps,
} from './ui/arknights/AkArknights'

