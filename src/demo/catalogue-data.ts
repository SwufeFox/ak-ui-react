import type { MessageKey } from './i18n'

/**
 * 组件目录的分类清单。顺序即编号顺序（01…17），也是「上一组 / 下一组」的遍历顺序。
 * id 与各 `Block` 的锚点一一对应，深链接 `#components-N` 仍然可用。
 */
export const CATEGORIES = [
  { id: 'components-1', title: 'ref.actions.title' },
  { id: 'components-2', title: 'ref.menu.title' },
  { id: 'components-3', title: 'ref.surfaces.title' },
  { id: 'components-4', title: 'ref.feedback.title' },
  { id: 'components-5', title: 'ref.inputs.title' },
  { id: 'components-6', title: 'ref.navigation.title' },
  { id: 'components-7', title: 'ref.effects.title' },
  { id: 'components-8', title: 'ref.gallery.title' },
  { id: 'components-9', title: 'ref.site.title' },
  { id: 'components-10', title: 'ref.shell.title' },
  { id: 'components-11', title: 'ref.decor.title' },
  { id: 'components-12', title: 'ref.arknights.title' },
  { id: 'components-13', title: 'ref.controls.title' },
  { id: 'components-14', title: 'ref.form.title' },
  { id: 'components-15', title: 'ref.data.title' },
  { id: 'components-16', title: 'ref.collection.title' },
  { id: 'components-17', title: 'ref.command.title' },
] as const satisfies readonly { id: string; title: MessageKey }[]

export const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  'components-1': ['button', 'actions', 'chamfer', 'subtitle', 'danger', 'ghost', 'group', '按钮', '动作'],
  'components-2': ['menu', 'menubar', 'dropdown', 'toolbar', 'contextmenu', 'collapsible', '菜单', '工具栏', '折叠'],
  'components-3': ['card', 'glass', 'chassis', 'tactical', 'outline', 'stripe', 'place', 'surface', '卡片', '毛玻璃', '机匣', '面板'],
  'components-4': ['notice', 'alert', 'progress', 'gauge', 'laser', '通知', '公告', '进度条', '仪表盘'],
  'components-5': ['slider', 'inputnumber', 'segmented', 'step', '滑动条', '步进器', '分段器'],
  'components-6': ['tabs', 'navigation', 'breadcrumb', 'segmented', '标签页', '导航', '面包屑'],
  'components-7': ['effects', 'countup', 'depth', 'entrance', 'glow', 'skew', 'outline', '特效', '数字滚动', '景深', '入场'],
  'components-8': ['gallery', 'album', 'polaroid', 'media', '画廊', '相册', '拍立得'],
  'components-9': ['loader', 'assetloader', 'loading', '资源加载', '预加载'],
  'components-10': ['site', 'shell', 'sectionnavigator', 'mobilemenu', 'particlefield', '粒子', '整页导航', '移动端菜单'],
  'components-11': ['decor', 'laser', 'reticle', 'stripes', 'halftone', 'corner', 'cut', 'barcode', 'watermark', 'bilingual', '装饰', '准星', '斜纹', '网点', '切角', '条形码'],
  'components-12': ['arknights', 'rarity', 'profession', 'elite', 'potential', 'skilllevels', 'attrs', 'trust', '游戏数据', '稀有度', '职业', '精二', '潜能', '专精'],
  'components-13': ['popover', 'tooltip', 'dialog', 'modal', '浮层', '气泡', '提示', '对话框', '弹窗'],
  'components-14': ['form', 'input', 'field', 'textarea', 'select', 'choice', 'checkbox', 'switch', '表单', '输入框', '选择器', '开关'],
  'components-15': ['data', 'san', 'sanity', 'counter', 'level', 'skeleton', 'spinner', '理智', '计数器', '关卡', '骨架屏', '加载中'],
  'components-16': ['collection', 'table', 'avatar', 'thumbnail', 'scrollarea', 'newslist', '表格', '头像', '缩略图', '滚动区', '快讯'],
  'components-17': ['command', 'screen', 'item', 'slot', '大屏', '指令牌', '材料方块', '槽位'],
}

// Component names are indexed by their primary example, so searches lead to useful results.
export const CATEGORY_COMPONENTS: Record<(typeof CATEGORIES)[number]['id'], readonly string[]> = {
  'components-1': ['AkButton'],
  'components-2': ['AkDropdownMenu', 'AkContextMenu', 'AkMenubar', 'AkToolbar', 'AkCollapsible', 'AkMenuGroup', 'AkMenuSeparator'],
  'components-3': ['AkCard', 'AkCardHeader', 'AkCardTitle', 'AkCardDescription', 'AkCardContent', 'AkCardFooter'],
  'components-4': ['AkNotice', 'AkNoticeStack', 'AkStatus', 'AkProgress', 'AkProgressStack', 'AkGauge'],
  'components-5': ['AkSlider', 'AkInputNumber', 'AkSegmented'],
  'components-6': ['AkTabs'],
  'components-7': ['AkCountUp', 'AkEntrance', 'AkDepth', 'AkDepthLayer', 'AkParticleField'],
  'components-8': ['AkMediaGallery', 'AkMediaAlbum'],
  'components-9': ['AkAssetLoader', 'AkMobileMenu'],
  'components-10': ['AkSectionNavigator'],
  'components-11': ['AkStripes', 'AkGridBackdrop', 'AkCorner', 'AkBrackets', 'AkReticle', 'AkBarcode', 'AkHalftone', 'AkGlyphBox', 'AkGlyph', 'AkMotion', 'AkInverse', 'AkLaser', 'AkStripeEdge', 'AkCut', 'AkCodeId', 'AkBlueBand', 'AkChevrons', 'AkDisplay', 'AkWatermark', 'AkGlow', 'AkOutline', 'AkSkew', 'AkVignette', 'AkGrain', 'AkMosaic', 'AkBackdrop', 'AkOverline', 'AkNum', 'AkEn', 'AkBilingual'],
  'components-12': ['AkRarity', 'AkRarityChip', 'AkRarityBar', 'AkRarityScope', 'AkProfession', 'AkProfessionLabel', 'AkElite', 'AkPotential', 'AkSpec', 'AkTrust', 'AkSkillLevels', 'AkPotList', 'AkPot', 'AkAttrs', 'AkAttr', 'AkKv', 'AkKvItem'],
  'components-13': ['AkDivider', 'AkButtonGroup', 'AkPopover', 'AkTag', 'AkTagGroup', 'AkStatusGroup', 'AkPagination'],
  'components-14': ['AkFormStack', 'AkField', 'AkFieldLabel', 'AkInput', 'AkSelect', 'AkTextarea', 'AkChoice'],
  'components-15': ['AkCounter', 'AkLevel', 'AkSpinner', 'AkSan', 'AkSanContainer', 'AkSkeleton', 'AkLoadingScreen', 'AkDialog'],
  'components-16': ['AkBreadcrumb', 'AkTable', 'AkAvatar', 'AkAvatarGroup', 'AkThumbnail', 'AkScrollArea', 'AkNewsList'],
  'components-17': ['AkCommandGrid', 'AkCommand', 'AkCommandGroup', 'AkSlot', 'AkItem', 'AkScreen'],
}
