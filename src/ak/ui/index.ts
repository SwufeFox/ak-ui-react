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
// 焦距与底图处理（文章原则二/三/五）——上游 SCSS 零实现，本库增补
export { AkBackdrop, AkGrain, AkMosaic, AkVignette } from './decor/AkSurfaces'
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

// 上游 SCSS 早已写好、但一直没有组件出口的那批（纯包装，无新样式）
export { AkButtonGroup, AkDivider, AkStatusGroup, AkTagGroup } from './group/AkGroups'
export { AkPopover } from './popover/AkPopover'
export { AkPagination } from './pagination/AkPagination'
export { AkChoice, AkField, AkFieldLabel, AkFormStack, AkInput, AkSelect, AkTextarea, useFieldId } from './field/AkField'

// 上游 SCSS 已有、但一直没有组件出口的第二批
export { AkDialog } from './dialog/AkDialog'
export { AkCounter, AkLevel, AkSkeleton, AkSpinner } from './data/AkData'

// 上游没有、本库补的那批（用既有语汇，非新造视觉）
export { AkTable, type AkTableColumn, type AkTableProps, type AkTableRow, type AkTableSortDirection } from './table/AkTable'
export {
  AkAvatar,
  AkAvatarGroup,
  AkBreadcrumb,
  AkScrollArea,
  AkThumbnail,
  type AkAvatarGroupProps,
  type AkAvatarProps,
  type AkAvatarSize,
  type AkBreadcrumbItem,
  type AkBreadcrumbProps,
  type AkScrollAreaProps,
  type AkScrollAxis,
  type AkThumbnailProps,
} from './media/AkMediaObjects'

// 上游只有样式、没有组件的那批
export { AkCommand, AkCommandGrid, AkCommandGroup, type AkCommandGridProps, type AkCommandGroupProps, type AkCommandLayout, type AkCommandProps, type AkCommandTone } from './command/AkCommand'

// Native-popover menu family and disclosure primitives
export { AkDropdownMenu, AkContextMenu, AkMenubar, AkToolbar, AkCollapsible, AkMenuSeparator, AkMenuGroup, type AkMenuItem, type AkDropdownMenuProps, type AkContextMenuProps, type AkMenubarProps, type AkToolbarProps, type AkCollapsibleProps, type AkMenuGroupProps } from './menu/AkMenu'

// 终端功能大屏、干员槽位与材料方块（同步自 YunYouJun/ak-ui 最新更新）
export { AkItem, type AkItemProps, type AkItemTier } from './item/AkItem'
export { AkSlot, type AkSlotProps, type AkSlotRarity, type AkSlotRole } from './slot/AkSlot'
export { AkScreen, type AkScreenProps, type AkScreenTone } from './screen/AkScreen'
