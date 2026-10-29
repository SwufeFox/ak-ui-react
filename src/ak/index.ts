// 可调层：尺寸档与逐实例令牌。所有组件共享这两枚类型。
export type { AkControlSize } from './lib/size'
export type { AkTokens } from './lib/tokens'

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
export { AkNotice, AkNoticeStack, type AkNoticeProps, type AkNoticeVariant } from './ui/notice/AkNotice'
export { AkGauge, AkProgress, AkProgressStack, type AkGaugeProps, type AkGaugeVariant, type AkProgressProps, type AkProgressVariant } from './ui/progress/AkProgress'
export { AkSlider, type AkSliderProps } from './ui/slider/AkSlider'
export { AkInputNumber, type AkInputNumberProps } from './ui/input-number/AkInputNumber'
export { AkSegmented, AkTabs, type AkSegmentedOption, type AkSegmentedProps, type AkTabsItem, type AkTabsProps } from './ui/tabs/AkTabs'
export { AkCountUp, type AkCountUpHandle, type AkCountUpProps } from './ui/effects/AkCountUp'
export { AkEntrance, type AkEntranceHandle, type AkEntranceProps } from './ui/effects/AkEntrance'
// 景深：上游 createDashboardDepth 控制器 + 它的 CSS 消费规则，此前两半没接上
export {
  AkDepth,
  AkDepthLayer,
  type AkDepthLayerProps,
  type AkDepthProps,
  type AkDepthVariant,
} from './ui/effects/AkDepth'
// 焦距与底图处理：暗角 / 噪点 / 失同步马赛克 / 毛玻璃
export {
  AkBackdrop,
  AkGrain,
  AkMosaic,
  AkStripeEdge,
  AkVignette,
  type AkBackdropProps,
  type AkBackdropStrength,
  type AkGrainProps,
  type AkMosaicProps,
  type AkStripeEdgeProps,
  type AkVignetteProps,
} from './ui/decor/AkSurfaces'
// 上游 .ak-fx-* 特效层（真正的 ak-ui 动效语言：呼吸辉光 / 扩散轮廓环 / ±10° 斜切）
export {
  AkGlow,
  AkOutline,
  AkSkew,
  type AkGlowProps,
  type AkGlowTone,
  type AkOutlineProps,
  type AkSkewDirection,
  type AkSkewProps,
} from './ui/effects/AkFx'
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
  type AkBackdropVariant,
  type AkBilingualProps,
  type AkBlueBandProps,
  type AkBracketsProps,
  type AkChevronsProps,
  type AkCodeIdProps,
  type AkCornerPosition,
  type AkCornerProps,
  type AkCornerTone,
  type AkCutCorner,
  type AkCutProps,
  type AkCutSize,
  type AkDisplayProps,
  type AkEnProps,
  type AkGlyphBoxProps,
  type AkGlyphProps,
  type AkGridBackdropProps,
  type AkHalftoneProps,
  type AkHalftoneVariant,
  type AkInverseProps,
  type AkMotionEffect,
  type AkMotionPace,
  type AkMotionProps,
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

// 上游 SCSS 早已写好、但一直没有组件出口的那批（纯包装，无新样式）
export { AkButtonGroup, AkDivider, AkStatusGroup, AkTagGroup } from './ui/group/AkGroups'
export { AkPopover } from './ui/popover/AkPopover'
export { AkDropdownMenu, AkContextMenu, AkMenubar, AkToolbar, AkCollapsible, AkMenuSeparator, AkMenuGroup, type AkMenuItem, type AkDropdownMenuProps, type AkContextMenuProps, type AkMenubarProps, type AkToolbarProps, type AkCollapsibleProps, type AkMenuGroupProps } from './ui/menu/AkMenu'
export { AkPagination } from './ui/pagination/AkPagination'
export { AkChoice, AkField, AkFieldLabel, AkFormStack, AkInput, AkSelect, AkTextarea } from './ui/field/AkField'

// 上游 SCSS 已有、但一直没有组件出口的第二批（纯包装）
export { AkDialog, type AkDialogProps } from './ui/dialog/AkDialog'
export {
  AkCounter,
  AkLevel,
  AkSkeleton,
  AkSpinner,
  type AkCounterProps,
  type AkLevelProps,
  type AkSkeletonProps,
  type AkSpinnerProps,
} from './ui/data/AkData'

// 拍立得相册：_ak-media.scss 134 行两代结构，此前无出口
export { AkMediaAlbum, type AkMediaAlbumProps } from './ui/media/AkMediaAlbum'

// 公告列表：_ak-news-list.scss 规格完整（含容器查询降级），此前无出口
export { AkNewsList, type AkNewsListProps, type AkNewsListItem } from './ui/news/AkNewsList'

// 全屏加载画面：_ak-loading.scss 里唯一没有出口的那块
export {
  AkLoadingScreen,
  type AkLoadingScreenProps,
  type AkLoadingScreenState,
} from './ui/loading/AkLoadingScreen'

// 理智（SAN）部件：_ak-san.scss 有 431 行完整样式，此前零组件出口
export {
  AkSan,
  AkSanContainer,
  type AkSanProps,
  type AkSanContainerProps,
  type AkSanVariant,
} from './ui/san/AkSan'

// 上游没有、本库补的那批（用既有语汇，非新造视觉）
export {
  AkTable,
  type AkTableColumn,
  type AkTableProps,
  type AkTableRow,
  type AkTableSortDirection,
} from './ui/table/AkTable'
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
} from './ui/media/AkMediaObjects'

// 上游只有样式、没有组件的那批（纯包装）
export {
  AkCommand,
  AkCommandGrid,
  AkCommandGroup,
  type AkCommandGridProps,
  type AkCommandGroupProps,
  type AkCommandLayout,
  type AkCommandProps,
  type AkCommandTone,
} from './ui/command/AkCommand'

// 同步自 YunYouJun/ak-ui 最新更新：终端功能大屏、干员槽位卡与材料方块
export { AkItem, type AkItemProps, type AkItemTier } from './ui/item/AkItem'
export { AkSlot, type AkSlotProps, type AkSlotRarity, type AkSlotRole } from './ui/slot/AkSlot'
export { AkScreen, type AkScreenProps, type AkScreenTone } from './ui/screen/AkScreen'

// 战术触觉微音效合成引擎（纯前端零依赖 Web Audio）
export {
  playTactileSound,
  setTactileSoundEnabled,
  isTactileSoundEnabled,
  useTactileSound,
  type TactileSoundType,
} from './lib/audio'
