# API reference

> **Generated file — do not edit by hand.** Run `npm run build:api` (or `npm run build`,
> which calls it) to regenerate from the JSDoc in `dist/ui/**/*.d.ts`.

Every public component, hook and shared type. `?` marks an optional prop. Props inherited
from React's `HTMLAttributes` are not repeated here — they pass through unchanged.

The public surface is the package root: nothing that the root barrel does not export is
listed here.

## Index

- [`AkArchive`](#akarchive) · [`AkArchivePlay`](#akarchiveplay) · [`AkAssetLoader`](#akassetloader) · [`AkAttr`](#akattr)
- [`AkAttrs`](#akattrs) · [`AkAvatar`](#akavatar) · [`AkAvatarGroup`](#akavatargroup) · [`AkBackTop`](#akbacktop)
- [`AkBackdrop`](#akbackdrop) · [`AkBadge`](#akbadge) · [`AkBarcode`](#akbarcode) · [`AkBilingual`](#akbilingual)
- [`AkBlueBand`](#akblueband) · [`AkBrackets`](#akbrackets) · [`AkBreadcrumb`](#akbreadcrumb) · [`AkButton`](#akbutton)
- [`AkButtonGroup`](#akbuttongroup) · [`AkCalc`](#akcalc) · [`AkCamp`](#akcamp) · [`AkCard`](#akcard)
- [`AkCardContent`](#akcardcontent) · [`AkCardDescription`](#akcarddescription) · [`AkCardFooter`](#akcardfooter) · [`AkCardHeader`](#akcardheader)
- [`AkCardTitle`](#akcardtitle) · [`AkCbox`](#akcbox) · [`AkChevrons`](#akchevrons) · [`AkChip`](#akchip)
- [`AkChoice`](#akchoice) · [`AkCodeId`](#akcodeid) · [`AkCollapse`](#akcollapse) · [`AkCollapseItem`](#akcollapseitem)
- [`AkCollapsible`](#akcollapsible) · [`AkCommand`](#akcommand) · [`AkCommandGrid`](#akcommandgrid) · [`AkCommandGroup`](#akcommandgroup)
- [`AkContextMenu`](#akcontextmenu) · [`AkCorner`](#akcorner) · [`AkCountUp`](#akcountup) · [`AkCountdown`](#akcountdown)
- [`AkCounter`](#akcounter) · [`AkCut`](#akcut) · [`AkDepth`](#akdepth) · [`AkDepthLayer`](#akdepthlayer)
- [`AkDialog`](#akdialog) · [`AkDialogue`](#akdialogue) · [`AkDialogueLine`](#akdialogueline) · [`AkDisplay`](#akdisplay)
- [`AkDivider`](#akdivider) · [`AkDossier`](#akdossier) · [`AkDropdownMenu`](#akdropdownmenu) · [`AkElite`](#akelite)
- [`AkEmpty`](#akempty) · [`AkEn`](#aken) · [`AkEnemy`](#akenemy) · [`AkEntrance`](#akentrance)
- [`AkEvent`](#akevent) · [`AkField`](#akfield) · [`AkFieldLabel`](#akfieldlabel) · [`AkFormStack`](#akformstack)
- [`AkGauge`](#akgauge) · [`AkGlow`](#akglow) · [`AkGlyph`](#akglyph) · [`AkGlyphBox`](#akglyphbox)
- [`AkGrain`](#akgrain) · [`AkGridBackdrop`](#akgridbackdrop) · [`AkHalftone`](#akhalftone) · [`AkHeading`](#akheading)
- [`AkHero`](#akhero) · [`AkInput`](#akinput) · [`AkInputNumber`](#akinputnumber) · [`AkInverse`](#akinverse)
- [`AkItem`](#akitem) · [`AkItemList`](#akitemlist) · [`AkKbd`](#akkbd) · [`AkKv`](#akkv)
- [`AkKvItem`](#akkvitem) · [`AkLaser`](#aklaser) · [`AkLevel`](#aklevel) · [`AkLoadingScreen`](#akloadingscreen)
- [`AkMaterials`](#akmaterials) · [`AkMaterialsDivider`](#akmaterialsdivider) · [`AkMaterialsRow`](#akmaterialsrow) · [`AkMediaAlbum`](#akmediaalbum)
- [`AkMediaGallery`](#akmediagallery) · [`AkMenuGroup`](#akmenugroup) · [`AkMenuSeparator`](#akmenuseparator) · [`AkMenubar`](#akmenubar)
- [`AkMessage`](#akmessage) · [`AkMobileMenu`](#akmobilemenu) · [`AkModule`](#akmodule) · [`AkModuleStage`](#akmodulestage)
- [`AkModuleUnlock`](#akmoduleunlock) · [`AkMosaic`](#akmosaic) · [`AkMotion`](#akmotion) · [`AkNews`](#aknews)
- [`AkNewsList`](#aknewslist) · [`AkNotice`](#aknotice) · [`AkNoticeStack`](#aknoticestack) · [`AkNum`](#aknum)
- [`AkOpCard`](#akopcard) · [`AkOpGrid`](#akopgrid) · [`AkOpRow`](#akoprow) · [`AkOutline`](#akoutline)
- [`AkOverline`](#akoverline) · [`AkPagination`](#akpagination) · [`AkPanel`](#akpanel) · [`AkParticleField`](#akparticlefield)
- [`AkPathNav`](#akpathnav) · [`AkPhaseTabs`](#akphasetabs) · [`AkPopover`](#akpopover) · [`AkPot`](#akpot)
- [`AkPotList`](#akpotlist) · [`AkPotential`](#akpotential) · [`AkProfession`](#akprofession) · [`AkProfessionLabel`](#akprofessionlabel)
- [`AkProgress`](#akprogress) · [`AkProgressStack`](#akprogressstack) · [`AkRange`](#akrange) · [`AkRarity`](#akrarity)
- [`AkRarityBar`](#akraritybar) · [`AkRarityChip`](#akraritychip) · [`AkRarityScope`](#akrarityscope) · [`AkRedacted`](#akredacted)
- [`AkReticle`](#akreticle) · [`AkRichText`](#akrichtext) · [`AkSan`](#aksan) · [`AkSanContainer`](#aksancontainer)
- [`AkSanity`](#aksanity) · [`AkScope`](#akscope) · [`AkScreen`](#akscreen) · [`AkScrollArea`](#akscrollarea)
- [`AkSearch`](#aksearch) · [`AkSectionNavigator`](#aksectionnavigator) · [`AkSegmented`](#aksegmented) · [`AkSelect`](#akselect)
- [`AkSkeleton`](#akskeleton) · [`AkSkew`](#akskew) · [`AkSkill`](#akskill) · [`AkSkillLevels`](#akskilllevels)
- [`AkSkillMatrix`](#akskillmatrix) · [`AkSkillSheet`](#akskillsheet) · [`AkSlider`](#akslider) · [`AkSlot`](#akslot)
- [`AkSp`](#aksp) · [`AkSpTrigger`](#aksptrigger) · [`AkSpValue`](#akspvalue) · [`AkSpec`](#akspec)
- [`AkSpinner`](#akspinner) · [`AkStage`](#akstage) · [`AkStageCode`](#akstagecode) · [`AkStat`](#akstat)
- [`AkStatRow`](#akstatrow) · [`AkStatus`](#akstatus) · [`AkStatusGroup`](#akstatusgroup) · [`AkStep`](#akstep)
- [`AkSteps`](#aksteps) · [`AkStripeEdge`](#akstripeedge) · [`AkStripes`](#akstripes) · [`AkTable`](#aktable)
- [`AkTabs`](#aktabs) · [`AkTag`](#aktag) · [`AkTagGroup`](#aktaggroup) · [`AkTalent`](#aktalent)
- [`AkTalentTable`](#aktalenttable) · [`AkTextarea`](#aktextarea) · [`AkThumbnail`](#akthumbnail) · [`AkTimeline`](#aktimeline)
- [`AkTimelineItem`](#aktimelineitem) · [`AkToastProvider`](#aktoastprovider) · [`AkToolbar`](#aktoolbar) · [`AkTooltip`](#aktooltip)
- [`AkTrust`](#aktrust) · [`AkVignette`](#akvignette) · [`AkVoice`](#akvoice) · [`AkVoiceList`](#akvoicelist)
- [`AkWatermark`](#akwatermark)

- [Public hooks and utilities](#public-hooks-and-utilities)
- [Shared types](#shared-types)
- [Public data types](#public-data-types)

## AkArchive

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `string` | no | 标题。 |
| `kicker` | `string` | yes | 标题前的小标（密录 1 / 悖论模拟）。 |
| `unlock` | `ReactNode` | yes | 解锁条件（纯文本或节点）。 |
| `unlockLabel` | `string` | yes | 解锁条件前的小标；传空串不出。 |
| `footer` | `ReactNode` | yes | 页脚（`AkArchivePlay`、关卡、首通奖励 …）。 |
| `children` | `ReactNode` | yes | 正文（若干 `<p>`）。 |

## AkArchivePlay

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `href` | `string` | yes | 链接地址；不写就渲染成按钮。 |
| `onClick` | `() => void` | yes | 点击回调（渲染成按钮时用）。 |
| `children` | `ReactNode` | yes | 文字（阅读密录 · 一鼓作气）。 |

## AkAssetLoader

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `tasks` | `AssetTask[]` | no | 要执行的异步任务，按顺序跑。 |
| `label` | `string` | yes | 进度条读屏名与状态行前缀，默认 `Resources`。 |
| `retryLabel` | `string` | yes | 重试按钮文字，默认 `Retry`。 |
| `onChange` | `(state: AssetState) => void` | yes | 状态变化时回调。 |
| `children` | `(state: AssetState) => ReactNode` | yes | Renders the status line. Defaults to `label · status · completed/total`. |
| `statusLabels` | `Partial<Record<AssetState['status'], string>>` | yes | 默认状态行里状态词的本地化表。控制器给的是英文枚举 （`idle` / `loading` / `ready` / `error` / `cancelled`）， 不传就用枚举原文——所以默认状态行是英文的。 ```tsx <AkAssetLoader label="资源" statusLabels={{ loading: '加载中', ready: '就绪' }} /> ``` |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkAttr

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | 属性名（大写拉丁标签）。 |
| `labelCn` | `ReactNode` | yes | 中文名，排在英文标签后面，不做大写转换。 |
| `value` | `ReactNode` | yes | 属性值。 |
| `hint` | `ReactNode` | yes | 值后面的小字单位 / 附注。 |
| `accent` | `boolean` | yes | 顶部 2px 强调条（如已选中的属性）。 |
| `children` | `ReactNode` | yes | 自定义值内容，覆盖 `value` / `hint`。 |

## AkAttrs

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `compact` | `boolean` | yes | 压成「标签 \| 值」两端对齐的一行行，而不是竖排大数字。 |

## AkAvatar

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `src` | `string` | yes | 图片地址。给了就渲染 `<img>`，否则用 `fallback`。 |
| `alt` | `string` | yes | 图片替代文字，同时作为无障碍名。 |
| `fallback` | `ReactNode` | yes | 无图时的回退内容（通常是一个拉丁首字母）。 |
| `size` | `AkAvatarSize` | yes | 尺寸档：xs 24 · sm 28 · default 40 · lg 56 · xl 80（px）。 |
| `cut` | `boolean` | yes | 右上角切角（复用全局 `--ak-cut`）。 |
| `round` | `boolean` | yes | 圆形。默认仍是本库的直角几何，只有确需时才开（与 `--cut` 互斥）。 |
| `status` | `boolean` | yes | 右下角状态点（在线 / 可用）。纯视觉，含义要在旁边的文字里说出来。 |
| `accent` | `boolean` | yes | 信号色描边（在线/告警那种）。 |
| `muted` | `boolean` | yes | 压淡（离线/失效）。 |

## AkAvatarGroup

Extends `HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

## AkBackTop

Extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | yes | 受控显示状态：给了就是受控模式，此值恒胜。 |
| `defaultVisible` | `boolean` | yes | 非受控模式下的初始显示状态。 |
| `onVisibleChange` | `(visible: boolean) => void` | yes | 显示状态变化时回调（自接滚动时由组件自己更新）。 |
| `onClick` | `() => void` | yes | 点了按钮时回调（在滚动回顶之后触发）。 |
| `label` | `string` | yes | 可访问名（`aria-label`，同时作 `title`）。 |
| `icon` | `ReactNode` | yes | 图标（不传则给一枚通用向上箭头）。 |
| `listenTo` | `HTMLElement \| string \| null` | yes | 监听、并滚回顶部的滚动容器（元素或选择器）；不写 = 整页。 |
| `visibilityHeight` | `number \| false` | yes | 滚动超过多少 px 出现；`false` = 不看滚动，显隐完全由 `visible` 定。 |
| `position` | `AkBackTopPosition` | yes | 定位：`fixed` 贴视口右下（默认）· `absolute` 贴最近的定位祖先右下。 |

## AkBackdrop

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `strength` | `AkBackdropStrength` | yes | 叠层厚度：`light` 为轻覆盖，`heavy` 为整层覆盖。 |
| `surface` | `string` | yes | 覆盖层底色。默认取 `--ak-surface-raised`。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkBadge

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | yes | 数字或短串；数字为 0 时默认不显示（见 `showZero`）。 |
| `max` | `number` | yes | 封顶：`value` 按数字大于它时显示「max+」（99+）。 |
| `dot` | `boolean` | yes | 圆点：不显示数字，只提示「有新的」。 |
| `show` | `boolean` | yes | 是否显示徽标；`false` 时只剩包住的内容。 |
| `showZero` | `boolean` | yes | `value` 为 0 时也显示。 |
| `variant` | `AkBadgeVariant` | yes | 颜色：`default` 黄（未读计数 / 点）· `accent` 主色 · `danger` 红（只给回退 / 权限变更这类 alerts）。 |
| `label` | `string` | yes | 读屏文本（「3 条未读通知」）：写了就把数字对读屏隐藏、改念这句；圆点徽标一定要写。 |
| `children` | `ReactNode` | yes | 被标记的内容（头像、图标按钮…）：徽标骑在它右上角；不写就是独立的行内徽标。 |

## AkBarcode

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | — |

## AkBilingual

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `cn` | `ReactNode` | no | 中文主标题。 |
| `en` | `ReactNode` | yes | 英文副标题（大写拉丁字）。 |
| `row` | `boolean` | yes | 中文与英文并排一行，而不是上下两行。 |

## AkBlueBand

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkBrackets

_(no props of its own)_

## AkBreadcrumb

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `items` | `AkBreadcrumbItem[]` | no | — |
| `ariaLabel` | `string` | yes | 读屏名。 |
| `separator` | `AkBreadcrumbSeparator` | yes | 分隔符形态：`arrow` 是本库默认的拉丁双箭头 `»`， `chevron` 是上游那种 CSS 画的小折角。 |

## AkButton

Extends `ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | Renders a leading inline-start icon slot. |
| `iconEnd` | `ReactNode` | yes | Renders a trailing inline-end icon slot. |
| `block` | `boolean` | yes | Stretches the button to the full width of its container. |
| `variant` | `AkButtonVariant` | yes | 外观档位：default / outline / action / advanced / light / danger / ghost。 |
| `size` | `AkControlSize` | yes | 尺寸档。默认 `md`（= 50px 高，改造前的值）。 |
| `chamfer` | `boolean` | yes | 是否开启方舟经典右上角斜切角。 |
| `pill` | `boolean` | yes | 药丸形按钮（`.ak-button--pill`：两端全圆角）。 |
| `link` | `boolean` | yes | 文字链形态（`.ak-button--link`：无底无框，悬停下划线）。 |
| `iconOnly` | `boolean` | yes | 仅图标形态（`.ak-button--icon`：正方形，宽 = 高，无横向内距）。 按钮仍需自带可访问名（`children` 或 `aria-label`）。 |
| `loading` | `boolean` | yes | 加载态（`.ak-button--loading` / `.is-loading`）：置 `aria-busy`、禁用激活， 并显示一枚居中的转圈指示。文字仍在 DOM 里（视觉上被转圈盖住），无障碍名不变。 |
| `subtitle` | `ReactNode` | yes | 副标题 / 战术代号（大写等宽小字，常用于双语排版如「部署 // DEPLOY」）。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-button-bg': '#ff5e19' }`。 |
| `sound` | `TactileSoundType \| false` | yes | 触发点击时播放的触觉音效。传 false 禁用音效，缺省时 action/danger 变体播 'confirm'，其余播 'click'。 |

## AkButtonGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkButtonGroupVariant` | yes | — |
| `children` | `ReactNode` | yes | — |

## AkCalc

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `kind` | `AkCalcKind` | no | 进公式的方式。 |

## AkCamp

Extends `SpanProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `src` | `string` | no | 势力徽标图片地址（白色线稿，亮色主题下由 CSS 反相）。 |
| `name` | `ReactNode` | no | 势力名：显示在徽标右侧；`logoOnly` 时作图片 alt 与悬停提示。 |
| `size` | `AkCampSize` | yes | 徽标高度：md 28 · lg 48（px）。 |
| `variant` | `AkCampVariant` | yes | 外观：default 线稿跟主题反相 · box 深底方块、原色白线稿。 |
| `logoOnly` | `boolean` | yes | 只显示徽标（名字进 alt 与悬停提示）。 |

## AkCard

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染标签，例如 'div' \| 'article' \| 'section' \| 'li'。省略时，可按压且无嵌套控件的卡片会升级为原生 `<button>`。 |
| `variant` | `AkCardVariant` | yes | 外观档位：default / outline / stripe / place / tactical / glass / chassis / flat / inset / accent-top。 |
| `size` | `AkControlSize` | yes | 尺寸档：控制内边距、子块间距与标题字号。 |
| `chamfer` | `boolean` | yes | 是否开启右上角 45° 战术切角。 |
| `hoverable` | `boolean` | yes | 是否开启悬停提亮/浮起动效。 同时发出本库的 `.ak-card--hoverable` 与上游同义的 `.ak-card--hover`。 |
| `interactive` | `boolean` | yes | 是否为可交互卡片（具备鼠标指针、点击沉浸与键盘焦点）。 |
| `selected` | `boolean` | yes | 是否处于选中状态；可交互卡片通过 `aria-pressed` 暴露。 |
| `disabled` | `boolean` | yes | 是否禁用；禁用后不响应点击，也无法用键盘激活。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-card-bg': '#171a1d' }`。 |

## AkCardContent

_(no props of its own)_

## AkCardDescription

_(no props of its own)_

## AkCardFooter

_(no props of its own)_

## AkCardHeader

_(no props of its own)_

## AkCardTitle

_(no props of its own)_

## AkCbox

Extends `Omit<DivProps, 'children' | 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `AkCboxLevel` | yes | 等级：`tip` 绿「另见 / 提示」· `info` 蓝（默认）· `warning` 黄 · `danger` 红 · `neutral` 灰。 |
| `title` | `ReactNode` | yes | 加粗的标题行（等级色）。 |
| `icon` | `ReactNode` | yes | 图标井里的图标；不传则按等级给一个通用线稿。 |
| `narrow` | `boolean` | yes | 最宽 640px。 |
| `children` | `ReactNode` | yes | 提示正文。 |

## AkChevrons

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `href` | `string` | yes | 传 href 时渲染成链接，悬停箭头右移。 |

## AkChip

Extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | 文字前的图标。 |
| `checked` | `boolean` | yes | 受控选中状态。 |
| `defaultChecked` | `boolean` | yes | 非受控模式下的初始选中状态。 |
| `onCheckedChange` | `(checked: boolean) => void` | yes | 选中状态变化时回调。 |
| `children` | `ReactNode` | yes | 芯片文字。 |

## AkChoice

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkChoiceVariant` | yes | 外观：勾选框 / 单选圆点 / 开关滑块。样式表里对应 `.ak-choice--radio` / `--switch`。 |
| `children` | `ReactNode` | yes | 控件右侧的文字。 |
| `name` | `string` | yes | 输入控件的 `name`（单选组需要）。 |
| `size` | `AkControlSize` | yes | 尺寸档：图标尺寸、开关宽度、间距与字号。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-choice-fill': '#ff5e19' }`。 |

## AkCodeId

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkCollapse

Extends `Omit<DivProps, 'children' | 'onChange'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `accordion` | `boolean` | yes | 手风琴模式：同一时间只展开一项（展开一项会收起其余）。 |
| `expanded` | `string[]` | yes | 受控：当前展开项的 `name` 列表。给了就是受控模式，此值恒胜。 |
| `defaultExpanded` | `string[]` | yes | 非受控模式下的初始展开项。 |
| `onExpandedChange` | `(expanded: string[]) => void` | yes | 展开项变化时回调（受控 / 非受控都触发）。 |
| `children` | `ReactNode` | yes | 若干 `AkCollapseItem`。 |

## AkCollapseItem

Extends `Omit<ComponentPropsWithoutRef<'details'>, 'open' | 'title' | 'children' | 'onToggle'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | 标识：放进 `AkCollapse` 的 `expanded` 数组里用；不写则自动生成（只能靠点击开合）。 |
| `title` | `ReactNode` | yes | 标题。 |
| `open` | `boolean` | yes | 受控展开状态（只在**不放在** `AkCollapse` 里时生效）。 |
| `defaultOpen` | `boolean` | yes | 非受控模式下的初始展开状态。 |
| `onOpenChange` | `(open: boolean) => void` | yes | 展开状态变化时回调。 |
| `disabled` | `boolean` | yes | 禁用：不能展开 / 收起。 |
| `children` | `ReactNode` | yes | 展开后的内容。 |

## AkCollapsible

Props for a native disclosure element.

Extends `Omit<HTMLAttributes<HTMLDetailsElement>, 'title' | 'onToggle'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | no | Summary shown while the disclosure is open or closed. |
| `children` | `ReactNode` | no | Collapsible content. |
| `defaultOpen` | `boolean` | yes | Initial open state for uncontrolled use. |
| `open` | `boolean` | yes | Controlled open state. When provided, pair with onOpenChange. |
| `onOpenChange` | `(open: boolean) => void` | yes | Called when the native disclosure changes state. |

## AkCommand

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 主标签（`.ak-command__label`，衬线大字）。 |
| `meta` | `ReactNode` | yes | 副信息（`.ak-command__meta`，小号加字距，溢出省略号）。 |
| `icon` | `ReactNode` | yes | 前置或装饰图标（`.ak-command__icon`）。 |
| `badge` | `ReactNode` | yes | 右上角角标（`.ak-command__badge`，橙底深字）。 |
| `current` | `ReactNode` | yes | 右上/中部当前值徽标（`.ak-command__current`）。 |
| `watermark` | `ReactNode` | yes | 背景水印（`.ak-command__watermark`，旋转 -5°、透明度 .17）。 |
| `tone` | `AkCommandTone` | yes | 色调。 |
| `layout` | `AkCommandLayout` | yes | 布局。 |
| `pressed` | `boolean` | yes | 选中态。**注意样式表认的是 `aria-pressed="true"` 而不是类** （`.ak-command[aria-pressed="true"]::before`）→ 底部的信号色条由它驱动。 |
| `disabled` | `boolean` | yes | 是否禁用。 |
| `as` | `ElementType` | yes | 渲染成什么标签。默认 `button`（样式表自带 cursor:pointer 与 focus-visible 态）。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-command-signal': '#f5bd38' }`。 |
| `children` | `ReactNode` | yes | — |

## AkCommandGrid

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `container` | `boolean` | yes | 是否让网格自己声明 `container-type: inline-size`。 上游设计里容器是**满屏仪表盘**（`.ak-dashboard` 声明了 `container-type: size`）。 如果在外面已经有这样的**尺寸容器**，保持 `false`（默认），`cqw` 就跟随那个外壳。 如果是嵌入式用法、外面没有容器，传 `true` —— 网格声明 `container-type: inline-size`， 让 `cqw` 按自身宽度计算；不会使用 `size` containment，避免自动高度坍塌。 `operation` 的高度单位 `cqh` 仍跟随最近的外层尺寸容器（或视口）。 |
| `children` | `ReactNode` | yes | — |

## AkCommandGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'recruitment'` | yes | `recruitment` 是那条带标题栏的青色双列组（干员招募面板那种）。 |
| `label` | `ReactNode` | yes | 组标题（`.ak-command-group__label`，仅 `recruitment` 有位置）。 |
| `children` | `ReactNode` | yes | — |

## AkContextMenu

Props for a right-click or keyboard-invoked context menu.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Region on which the context menu is available. |
| `items` | `readonly AkMenuItem[]` | no | Menu entries, rendered in order. |
| `label` | `string` | yes | Accessible name for the menu. Defaults to “Context menu”. |
| `className` | `string` | yes | Extra class for the context-sensitive region. |
| `size` | `AkControlSize` | yes | 尺寸档：一次同时缩菜单项与浮层宽度。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖（弹层在顶层，无法从外部选择器改，走 tokens 最省事）。 |

## AkCorner

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `large` | `boolean` | yes | 大号角标（18px 直角边）。 |
| `position` | `AkCornerPosition` | yes | 角标在哪个角：`tl`（默认）或 `tr`。 |
| `tone` | `AkCornerTone` | yes | 角标色调：`info`（默认）/ `yellow` / `red`。 |

## AkCountUp

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `number` | no | 目标数值。 |
| `from` | `number` | yes | 起始数值。 |
| `duration` | `number` | yes | 滚动时长（毫秒）。 |
| `delay` | `number` | yes | 开始前延迟（毫秒）。 |
| `decimals` | `number` | yes | Clamp of decimal places rendered. |
| `disabled` | `boolean` | yes | 为真时直接跳到目标值。 |
| `autoplay` | `boolean` | yes | 挂载后自动播放。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkCountdown

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `remaining` | `number` | yes | 剩余**秒**数：由调用方驱动，组件只渲染、不倒数。 与 `until` 同时给时以 `until` 为准。 |
| `until` | `string \| number \| Date` | yes | 截止时刻（ISO 串 / 时间戳 / Date）：客户端挂载后才起跑倒数， 服务端首帧不出内容（避免首帧与客户端不一致）。 |
| `active` | `boolean` | yes | 是否走字（只对 `until` 生效；停下时读数补到此刻）。 |
| `precision` | `AkCountdownPrecision` | yes | 最小单位：min 到分（默认，每分钟刷新）· sec 到秒。 |
| `parts` | `number` | yes | 最多显示几格，从最大的单位数起；不写则一直显示到 `precision`。 |
| `onFinish` | `() => void` | yes | 倒数到 0 时回调（只触发一次）。 |
| `label` | `string` | yes | 读屏名；不传时按中文单位拼「剩余 …」。 |

## AkCounter

读数与状态小件。 这一组同样来自「上游 SCSS 早已写好、但没有组件出口」： `.ak-counter` / `.ak-level` / `.ak-loading` / `.ak-loading-track` 在样式表里是完整的 （含动画、旋转、字号层级），只是从没被暴露出来。本文件不加新样式。 注意 `.ak-loading` 是**方舟自己的加载形状**——一个旋转 45° 的方框 + `ak-radio` 动画， 不是通用的圆环 spinner。所以它叫 `AkSpinner` 但外观是上游那套。

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `prefixIcon` | `ReactNode` | yes | 前置图标节点（`.ak-counter__prefix`）。 |
| `value` | `ReactNode` | yes | 主数值。 |
| `suffixIcon` | `ReactNode` | yes | 后置图标节点（`.ak-counter__suffix`），常用于加减按钮。 |

## AkCut

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `corner` | `AkCutCorner` | yes | 切哪个角，默认右上（方舟面板的常规斜切方向）。`all` 四角全切。 |
| `size` | `AkCutSize` | yes | 半径档位，取 `--ak-cut-sm/md/lg`（默认 `md`）。 |
| `radius` | `string` | yes | 直接给半径，覆盖 `size`（例如 `'1.25rem'`）。 |

## AkDepth

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `variant` | `AkDepthVariant` | yes | 透视配方，三者都来自上游： - `flat`（默认）不设透视，只做位移 - `stage` ← `_ak-object.scss` 的 `.perspective`（`perspective: 100rem`，origin `50% 125%`） - `tilt` ← `_ak-panel.scss` 的 `.ak-panel-right`（`perspective(50rem) rotateY(-10deg)`） |
| `threeD` | `boolean` | yes | 打开 3D 上下文（`transform-style: preserve-3d`），同上游 `.ak-dashboard`。 |
| `pointerEnabled` | `boolean` | yes | 关掉指针监听（例如由外部时间轴驱动 `render()`）。透传给控制器。 |
| `maxX` | `number` | yes | 横向最大位移（px）。上游默认 130。 |
| `maxY` | `number` | yes | 纵向最大位移（px）。上游默认 70。 |
| `layerSelector` | `string` | yes | 被驱动的层怎么选。默认 `[data-depth]`，与上游控制器一致。 |
| `children` | `ReactNode` | yes | 若干 `AkDepthLayer`。 |

## AkDepthLayer

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `depth` | `number` | yes | 该层的深度。控制器据此算位移：`offset × maxRaw × depth`。 上游默认 `maxX: 130` / `maxY: 70`，所以 `depth: 1` 的满偏量就是那个数。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkDialog

模态对话框。 上游用**原生 `<dialog>`**（`_ak-dialog.scss` 通篇 `&[open]` 与 `&::backdrop`， 含 `transition-behavior: allow-discrete` + `@starting-style` 的进场过渡）， 所以这里也用 `showModal()` / `close()`，不手写遮罩、焦点陷阱与 Esc —— 浏览器负责置顶层、惰性化背景、Esc 关闭、焦点回归。 上游的几何：右上角切角（`--ak-cut`）、顶部 4px 信号条、`::backdrop` 半透明黑 + 3px 背景模糊。 全部来自样式表，本组件不加新样式。

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | yes | Controlled open state. When defined the dialog is controlled and this value wins; when `undefined` the component is uncontrolled and owns the state. |
| `defaultOpen` | `boolean` | yes | Initial open state in uncontrolled mode. Ignored whenever `open` is defined. Defaults to `false`. |
| `onOpenChange` | `(open: boolean) => void` | yes | Called with the requested state in both modes: close button, backdrop click, Esc and the native `close` event all funnel through it. |
| `eyebrow` | `ReactNode` | yes | 顶部小标与标题，对应样式表的 `__eyebrow` / `__title`。 |
| `title` | `ReactNode` | yes | — |
| `footer` | `ReactNode` | yes | 底部操作区。 |
| `closable` | `boolean` | yes | 是否显示右上角关闭按钮，默认 true。 |
| `closeOnBackdrop` | `boolean` | yes | 点遮罩是否关闭。默认 true。 |
| `disableEscape` | `boolean` | yes | 是否禁用 Esc 关闭。默认 false。 |
| `full` | `boolean` | yes | 是否使用上游的满屏档（`.ak-dialog--full`：96vw × 92vh，近乎铺满视口）。 满屏档会压过 `size` 给出的宽度档位。 |
| `size` | `AkControlSize` | yes | 尺寸档：宽度上限、最大高度、内距与字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-dialog-w': '52rem' }`。 |
| `children` | `ReactNode` | yes | — |

## AkDialogue

Extends `Omit<HTMLAttributes<HTMLDListElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 若干 `AkDialogueLine`。 |

## AkDialogueLine

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `speaker` | `ReactNode` | yes | 说话人；不写就是旁白：说话人列写「旁白」，整句灰色斜体。 |
| `children` | `ReactNode` | yes | 台词。 |

## AkDisplay

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `xl` | `boolean` | yes | 最大号展示字（落地页 / 区块主标题）。 |

## AkDivider

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 居中的标签或图标。不传则只有两条不同宽度的横线。 |
| `variant` | `AkDividerVariant` | yes | 形态档位：`default` / `accent` / `stripes` / `text` / `vertical`。 分别发出 `.ak-divider--accent` / `.ak-divider--stripes` / `.ak-divider--text` / `.ak-divider--vertical`。`vertical` 与 `stripes` 形态下标签没有位置，会被隐藏。 |

## AkDossier

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `string` | no | 标题（客观履历）。 |
| `en` | `string` | yes | 英文小标（Objective Record）。 |
| `unlock` | `string` | yes | 解锁条件；`locked` 时也是遮罩上的文字。 |
| `locked` | `boolean` | yes | 未解锁：正文模糊、不可选，盖斜纹 + 解锁条件（文本仍在 DOM 里，可被搜索）。 |
| `children` | `ReactNode` | yes | 正文（若干 `<p>`）。 |

## AkDropdownMenu

Props for the native-popover dropdown menu.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | Trigger label. |
| `items` | `readonly AkMenuItem[]` | no | Menu entries, rendered in order. |
| `align` | `'start' \| 'right'` | yes | 浮层对齐方式：`start` 靠触发器左缘，`right` 靠右（`.ak-menu--right`）。 |
| `className` | `string` | yes | Extra class for the trigger-and-menu wrapper. |
| `size` | `AkControlSize` | yes | 尺寸档：一次同时缩触发器与每条菜单项，两者不会失同步。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖（挂在 anchor 上，浮层继承）。 |

## AkElite

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `0 \| 1 \| 2` | no | 精英阶段 0 / 1 / 2。 |
| `icon` | `ReactNode` | yes | 精英图标，通常是宿主传入的图片。 |
| `large` | `boolean` | yes | 大号。 |

## AkEmpty

Extends `Omit<DivProps, 'children' | 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes | 标题（粗体一行）；传空串不显示。 |
| `description` | `ReactNode` | yes | 说明文字（标题下一行）。 |
| `code` | `ReactNode` | yes | 大号状态码（404 / 403）：放在图标的位置，写了就不显示图标。 |
| `icon` | `ReactNode` | yes | 图标（48px 半透明线稿）；传 `null` 不显示。 |
| `extra` | `ReactNode` | yes | 说明下方的操作（按钮 / 链接）。 |
| `children` | `ReactNode` | yes | 说明文字（代替 `description`）。 |

## AkEn

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkEnemy

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `ReactNode` | no | 敌人名。 |
| `code` | `ReactNode` | yes | 编号（B003 / E020 / N001），显示在级别后面：「BOSS · B003」。 |
| `variant` | `AkEnemyRank` | yes | 级别：normal 普通 · elite 精英（橙色条）· boss 领袖（红色条）。 |
| `src` | `string` | yes | 头像图片地址（方图，裁成 64px 圆）；不传时是深色空圆。 |
| `level` | `number` | yes | 威胁度：点亮几枚菱形。 |
| `levelMax` | `number` | yes | 菱形总数。 |

## AkEntrance

Extends `EntranceOptions`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `autoplay` | `boolean` | yes | 挂载后自动播放。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `style` | `CSSProperties` | yes | 根节点行内样式。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkEvent

Extends `Omit<DivProps, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | no | 活动名。 |
| `kind` | `ReactNode` | yes | 标题上方的类型行（Side Story · 进行中 / 寻访 · 已结束）。 |
| `time` | `ReactNode` | yes | 起止时间（2026.08.08 16:00 — 09.07 03:59）。 |
| `cover` | `string` | yes | 横幅图地址（21:9 裁切铺满）；不传时留一块主题化占位块。 |
| `status` | `AkEventStatus` | yes | 状态：live 进行中（类型行前闪烁红点）· ended 已结束（类型行转灰）。 |

## AkField

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | 字段内的控件。 |
| `hint` | `ReactNode` | yes | 字段下方的提示或错误文字。 |
| `help` | `ReactNode` | yes | 控件下方的说明文字（上游写法 `.ak-help`）。出错时追加 `.ak-help--error`（红字）。 与 `hint` 各占一格：`hint` 走本库的 `.ak-field__hint`，`help` 走上游的 `.ak-help`。 |
| `invalid` | `boolean` | yes | 给出错误时把提示标成错误态，并把信号色接到字段上。 |
| `required` | `boolean` | yes | 字段是否必填。字段本身记 `data-required`；其中的标签自动加 `.ak-label--required` （自带一颗红星），其中的控件自动带上原生 `required`。 |
| `size` | `AkControlSize` | yes | 尺寸档：字段内控件的统一高度档（同时下发到子控件）。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-field-signal': '#e33b3b' }`。 |

## AkFieldLabel

Extends `LabelHTMLAttributes<HTMLLabelElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |
| `required` | `boolean` | yes | 是否必填。为真时加上 `.ak-label--required`（标签后自带一颗红星）。 放在 `AkField` 内时继承字段的 `required`。 |

## AkFormStack

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | — |
| `className` | `string` | yes | — |

## AkGauge

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 名称，同时用于 `aria-label`，默认 `Deploy`。 |
| `max` | `number` | yes | 区间上限。 |
| `min` | `number` | yes | 区间下限。 |
| `unit` | `ReactNode` | yes | 数值单位后缀，默认 `percent`。 |
| `value` | `number` | yes | 当前值，会夹到区间内。 |
| `variant` | `AkGaugeVariant` | yes | 外观档位：`default` / `warning` / `yellow` / `success`。 `yellow` 与 `success` 分别发出 `.ak-gauge--yellow` / `.ak-gauge--success`。 |
| `size` | `AkControlSize` | yes | 尺寸档：直径、数值字号与内孔一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-gauge-hole': '#0b0d0f' }`。 |

## AkGlow

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `tone` | `AkGlowTone` | yes | 辉光色。默认取上游的 `rgba(255,255,255,.3)`；给档位则接信号色令牌。 |
| `color` | `string` | yes | 直接指定辉光色，优先于 `tone`。 |

## AkGlyph

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `keep` | `boolean` | yes | 亮色主题下不反相。 |
| `white` | `boolean` | yes | 始终当白色线稿处理。 |

## AkGlyphBox

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 图标内容。深底白线稿，两主题都不反相。 |

## AkGrain

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `size` | `string` | yes | 颗粒尺寸，默认 3px。 |
| `color` | `string` | yes | 颗粒色，默认取 `--ak-grain-color`。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkGridBackdrop

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkBackdropVariant` | yes | 底纹类型：grid / dots / diag / scanlines。 |

## AkHalftone

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 网点自身也当容器用时打开（默认只做背景层）。 |
| `variant` | `AkHalftoneVariant` | yes | 网点遮罩方向：default / left / full。 |
| `fade` | `boolean` | yes | 额外叠上 `.ak-halftone-fade` 的渐隐遮罩（与 variant 正交）。 |

## AkHeading

Extends `Omit<DivProps, 'children' | 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes | 标题内容（也可以写在 children 里）。 |
| `en` | `ReactNode` | yes | 拉丁副题（大写灰字）。`stack` 时叠在标题上方当眉题。 |
| `level` | `AkHeadingLevel` | yes | 标题级别，渲染成 `h1`–`h6`。 |
| `variant` | `AkHeadingVariant` | yes | 外观：`bar` 左侧主色粗竖条（默认）· `underline` 底线 + 左段主色粗线。 |
| `stack` | `boolean` | yes | 英文副题叠在标题上方。 |
| `size` | `AkHeadingSize` | yes | 尺寸：`md` = 标题字号（默认）· `lg` = 展示字号。 |
| `extra` | `ReactNode` | yes | 右侧附加（链接、开关），推到最右。 |
| `children` | `ReactNode` | yes | 标题内容（代替 `title`）。 |

## AkHero

Extends `Omit<DivProps, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | no | 大标题（展示字、全大写）。 |
| `subtitle` | `ReactNode` | yes | 标题下的中文副标。 |
| `eyebrow` | `ReactNode` | yes | 标题上方的青色小字（PRTS.WIKI · NEW SKIN DESIGN SYSTEM）。 |
| `description` | `ReactNode` | yes | 说明文字（最宽 60 字，70% 白）。 |
| `bar` | `boolean` | yes | 标题下的青色横条。 |
| `side` | `boolean` | yes | 右侧竖直青色色面。 |
| `titleAs` | `ElementType` | yes | 标题渲染成什么标签；默认 `h2`。 |

## AkInput

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | 无障碍名；未给 `id` 与外部标签时用它。 |
| `invalid` | `boolean` | yes | 是否校验失败。为真时加 `.is-invalid`（红边）并置 `aria-invalid`。 放在 `AkField` 内时继承字段的 `invalid`。 |
| `valid` | `boolean` | yes | 是否校验通过。为真时加 `.is-valid`（绿边）。与 `invalid` 同时给出时以 `invalid` 为准。 |
| `required` | `boolean` | yes | 是否必填。为真时带上原生 `required`。 放在 `AkField` 内时继承字段的 `required`。 |
| `size` | `AkControlSize` | yes | 尺寸档：高度、内距与字号。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖。 |

## AkInputNumber

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max' | 'step' | 'size'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | 无障碍名，读屏会念。默认「数值」。 原生 `aria-label` 优先；两者都传时 `aria-label` 覆盖 `label`。 |
| `increaseLabel` | `string` | yes | 增加按钮的无障碍名。默认「增加」。 |
| `decreaseLabel` | `string` | yes | 减少按钮的无障碍名。默认「减少」。 |
| `max` | `number` | yes | 允许的最大值。 |
| `maxLabel` | `string` | yes | 「最大」按钮文字。 |
| `min` | `number` | yes | 允许的最小值。 |
| `minLabel` | `string` | yes | 「最小」按钮文字。 |
| `step` | `number` | yes | 每次增减的步长。 |
| `value` | `number` | yes | Controlled value. When defined the field is controlled and this value wins; when `undefined` the component is uncontrolled. Out-of-range values are written back clamped through `onValueChange`. |
| `defaultValue` | `number` | yes | Initial value in uncontrolled mode. Ignored whenever `value` is defined. Out-of-range values are clamped on mount. Defaults to `min`. |
| `onValueChange` | `(value: number) => void` | yes | 值变化时回调；受控与非受控模式都会触发。 |
| `size` | `AkControlSize` | yes | 尺寸档：高度、左右快捷按钮和步进图标一起缩放。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖；可用 `--ak-input-number-width` 调整整体宽度。 |

## AkInverse

Extends `SlotProps<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkItem

Extends `Omit<ButtonHTMLAttributes<HTMLElement>, 'name'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染标签，默认为 'button'。 |
| `tier` | `AkItemTier` | yes | 品质/稀有度等级（1 到 6 档）。对应样式表 `--ak-rarity-*`。 |
| `icon` | `ReactNode` | yes | 物品图标节点；若缺省且无子节点，自动绘制 45° 旋转晶体。 |
| `name` | `ReactNode` | yes | 物品名称。 |
| `count` | `ReactNode` | yes | 右上角数量角标。 |
| `price` | `ReactNode` | yes | 价格（商店场景）。 |
| `sold` | `boolean` | yes | 是否处于已售罄或置灰状态。 |
| `selected` | `boolean` | yes | 是否处于选中状态；可交互条目通过 `aria-pressed` 暴露。 |
| `disabled` | `boolean` | yes | 是否禁用。 |
| `size` | `AkControlSize` | yes | 尺寸档：图标边长、内距与文字字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-item-tier': '#ff9433' }`。 |
| `sound` | `TactileSoundType \| false` | yes | 触发点击时播放的触觉音效。传 false 禁用音效，缺省时 5/6 阶播 'pip'，其余播 'select'。 |

## AkItemList

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | yes | 里面道具的默认尺寸档（宿主自己的道具组件按这个走）。 |
| `children` | `ReactNode` | yes | 若干道具。 |

## AkKbd

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 键名：`Ctrl`、`K`、`Esc`、`↵`、`/` … |

## AkKv

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `variant` | `AkKvVariant` | yes | 版式：default / boxed / inline。 |

## AkKvItem

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | 键（标签列）。 |
| `children` | `ReactNode` | yes | 值。 |

## AkLaser

Extends `SlotProps<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'action' \| 'danger'` | yes | 激光色调：info（默认青色）/ action（黄色）/ danger（红色）。 |
| `glow` | `boolean` | yes | 是否开启全息发光辉光投影。默认 true。 |
| `animated` | `boolean` | yes | 是否开启激光呼吸明暗动效。默认 false。 |
| `direction` | `'horizontal' \| 'vertical'` | yes | 激光方向：horizontal（水平光带，默认）/ vertical（垂直光带）。 |

## AkLevel

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 上方的标签文字（`.ak-level__label`，样式表默认值是 `OPERATION`）。 |
| `children` | `ReactNode` | yes | 主内容，通常是等级数字或关卡代号。 |
| `prefixIcon` | `ReactNode` | yes | 内容前的图标位（`.ak-level__prefix-icon`）。 |

## AkLoadingScreen

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `state` | `AkLoadingScreenState` | yes | 当前状态，写入 `data-state`（样式表认的就是这个属性）。 |
| `backdrop` | `string` | yes | 背景图 URL，走 `.ak-loading-screen__backdrop`（会自动模糊 + 压暗 + 放大 1.015）。 |
| `tip` | `ReactNode` | yes | 左上角提示语（`.ak-loading-screen__tip`）。 |
| `brand` | `ReactNode` | no | 主标题，渲染成 `strong`（样式表的元素选择器认标签）。 |
| `brandSuffix` | `ReactNode` | yes | 主标题后缀，渲染成 `small`。 |
| `mark` | `ReactNode` | yes | 标记图形（`.ak-loading-screen__mark`），需自行带 `.ak-icon` 类。 |
| `markLabel` | `ReactNode` | yes | 标记下方小字。 |
| `progressLabel` | `ReactNode` | yes | 进度条右侧标签。 |
| `label` | `string` | yes | 无障碍名；加载中会以 `role="status"` 播报。 |

## AkMaterials

Extends `DivProps`.

_(no props of its own)_

## AkMaterialsDivider

Extends `SpanProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 说明文字（「达到精英阶段 1 后解锁」）。 |

## AkMaterialsRow

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 左列文字（「1 → 2」「精英阶段 0→1」）。 |
| `labelContent` | `ReactNode` | yes | 左列自定义内容，覆盖 `label`。 |
| `children` | `ReactNode` | yes | 这一步要的材料（通常是若干 `AkItem`）。 |

## AkMediaAlbum

拍立得相册 / 图层媒体。 `_ak-media.scss` 134 行、两代结构，一个 React 组件都没有。这里按样式表原样接出来。 ⚠️ 两代结构的区别（照样式表，不是照直觉）： · **旧版（默认）**：底片与白边都是根元素的伪元素画的 （`::before` = 歪斜的底片、`::after` = 前景白边）。**没有子元素**。 底片是**纯色**（`--ak-media-album-bgcolor`），不是图 —— 所以 `backSrc` 在这代里无处可用。 · **新版（`--layered`）**：伪元素被 `content: none` 关掉，改用真实子元素 `.ak-media__sheet--front` / `--back`。前片扛布局、后片绝对定位垫在后面， 两张各有独立的动画时间线（`--split-enter`）。 ⚠️ 入场动画的互斥：`--enter` 是「整册一起入场」，`--split-enter` 是「两片各自入场」。 样式表里 `--split-enter` 会把根元素 `animation` 置为 none（优先级高于 `--enter`）， 但两者同时挂上会先跑一轮再被覆盖，所以这里在组件层就做成互斥： `splitEnter` 隐含 `layered`，并且不再输出 `--enter`。

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `src` | `string` | no | 前景图。 |
| `alt` | `string` | yes | 前景图的 alt。**默认空串（当装饰）** —— 有信息量的图请显式传。 |
| `backSrc` | `string` | yes | 底片图。**只在 `layered` 下有效**：旧版的底片是伪元素画的纯色块，塞不进图。 |
| `backAlt` | `string` | yes | 底片图的 alt，默认空串（底片通常纯装饰）。 |
| `layered` | `boolean` | yes | 启用真实双片结构（`.ak-media--layered`），才能分别给前后片上图。 |
| `enter` | `boolean` | yes | 整册入场动画（`.ak-media--enter`）。与 `splitEnter` 互斥。 |
| `splitEnter` | `boolean` | yes | 分层入场：两片各走独立时间线（`.ak-media--split-enter`）。隐含 `layered`。 |

## AkMediaGallery

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `items` | `GalleryItem[]` | no | 画廊条目；每项含 `id` 与可选 `title` / `image` / `alt`。 |
| `label` | `string` | yes | 区域与选择器组的读屏名，默认 `Media gallery`。 |
| `loop` | `boolean` | yes | 到最后一张后是否回到第一张。 |
| `previousLabel` | `string` | yes | 上一张按钮读屏名。 |
| `nextLabel` | `string` | yes | 下一张按钮读屏名。 |
| `expandLabel` | `string` | yes | 放大按钮文字与对话框读屏名。 |
| `closeLabel` | `string` | yes | 关闭按钮文字。 |
| `emptyLabel` | `string` | yes | 空态占位文字。 |
| `roleDescription` | `string` | yes | 轮播角色的读屏描述。默认 `carousel`。 |
| `value` | `number` | yes | Controlled active index. Omit for uncontrolled. |
| `onValueChange` | `(index: number) => void` | yes | 序号变化时回调。 |
| `renderMedia` | `(item: GalleryItem, index: number) => ReactNode` | yes | Custom slide media, replacing the default <img>. |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkMenuGroup

Props for a labelled menu group.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Entries in the group. |
| `label` | `string` | yes | Optional accessible name for this group. |
| `title` | `ReactNode` | yes | 分组小标题（`.ak-menu__label`）：一组条目上方的说明行。 |
| `head` | `ReactNode` | yes | 抬头（`.ak-menu__head`）：组顶部的一行主体内容（用户菜单里的用户名那一行）。 |

## AkMenuSeparator

_(no props of its own)_

## AkMenubar

Props for the ARIA menubar container. Its child controls should use role="menuitem".

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Menu item controls. |

## AkMessage

Extends `Omit<DivProps, 'children' | 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkMessageVariant` | yes | 外观（等级色）：`info`（默认）· `success` · `warning` · `danger` · `neutral` · `accent`。 |
| `title` | `ReactNode` | yes | 加粗的标题行（等级色）。 |
| `icon` | `ReactNode` | yes | 图标；不传则按 `variant` 给一个通用线稿。 |
| `showIcon` | `boolean` | yes | 显示图标（默认显示）。 |
| `closable` | `boolean` | yes | 显示右上角 ✕ 关闭按钮。 |
| `banner` | `boolean` | yes | 横幅：顶边色条、文字居中。 |
| `stripes` | `boolean` | yes | 叠斜纹（危险横幅常用）。 |
| `open` | `boolean` | yes | 受控显示状态。 |
| `defaultOpen` | `boolean` | yes | 非受控模式下的初始显示状态。 |
| `onOpenChange` | `(open: boolean) => void` | yes | 显示状态变化时回调。 |
| `onClose` | `() => void` | yes | 点了关闭按钮时回调（在 `onOpenChange` 之后触发）。 |
| `children` | `ReactNode` | yes | 提示正文。 |

## AkMobileMenu

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | 触发按钮与对话框的读屏名，默认 `Menu`。 |
| `closeLabel` | `string` | yes | 关闭按钮文字，默认 `Close menu`。 |
| `children` | `React.ReactNode` | yes | 子内容。 |

## AkModule

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `string` | no | 模组名。 |
| `src` | `ReactNode` | yes | 模组图（宿主自己的 `<img src=… />`）；不传只留中性底框。 |
| `typeName` | `string` | yes | 型号文字：SWO-X / Original … |
| `typeIcon` | `ReactNode` | yes | 型号图标（宿主自己的 `<img src=… />`）。 |
| `color` | `AkModuleColor` | yes | 型号色；不写 = 原型证章的灰。 |
| `hint` | `string` | yes | 「说明 ⓘ」的悬停解释。 |
| `collapsible` | `boolean` | yes | 故事可折叠：默认定高 5 行可滚动 +「全文阅读」开关；`false` 时全文展开。 |
| `tasks` | `string[]` | yes | 模组解锁任务（纯文本，一条一行）。 |
| `headerExtra` | `ReactNode` | yes | 名称之后的附加内容。 |
| `stages` | `ReactNode` | yes | 三阶段表的行（若干 `AkModuleStage`）。 |
| `tasksExtra` | `ReactNode` | yes | 解锁任务里额外的节点（排在 `tasks` 之后）。 |
| `unlock` | `ReactNode` | yes | 解锁需求与材料表的行（若干 `AkModuleUnlock`）。 |
| `children` | `ReactNode` | yes | 故事（基础信息）。 |

## AkModuleStage

Extends `HTMLAttributes<HTMLTableRowElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `stage` | `1 \| 2 \| 3` | no | 阶段 1–3：「STAGE n」+ 三段条点亮 n 段。 |
| `stats` | `Record<string, string \| number>` | yes | 属性加成（按写的顺序排，数值绿字）。 |
| `kicker` | `string` | yes | 变化类别的反色小标：特性追加 / 天赋更新。 |
| `children` | `ReactNode` | yes | 特性 / 天赋变化的描述。 |

## AkModuleUnlock

Extends `HTMLAttributes<HTMLTableRowElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `stage` | `1 \| 2 \| 3` | no | 阶段 1–3。 |
| `requirement` | `ReactNode` | yes | 解锁需求（信赖 / 精英阶段与等级 / 任务标签）。 |
| `children` | `ReactNode` | yes | 材料消耗（一排 `AkItem`）。 |

## AkMosaic

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `size` | `string` | yes | 马赛克块尺寸，默认 5px（令牌 `--ak-mosaic-size`）。 |
| `color` | `string` | yes | 像素块颜色。 |
| `blur` | `boolean` | yes | 让被盖住的内容轻微失焦，更像「信号不稳」而不是「贴了格子」。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkMotion

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `pace` | `AkMotionPace` | yes | 节奏档，取 `--ak-motion-fast/base/slow`（默认 `base`）。 |
| `effect` | `AkMotionEffect` | yes | 过渡属性 —— **必须给**，否则节奏档无处生效（只写 transition-duration 而不写 transition-property 是什么都不做的空类）。 |
| `emphasized` | `boolean` | yes | 用强调曲线 `--ak-ease-emphasized`（入场 / 需要重量感的过渡）。 |

## AkNews

Extends `Omit<DivProps, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes | 红块里的字（Bender 大写）。 |

## AkNewsList

Extends `Omit<HTMLAttributes<HTMLUListElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `items` | `readonly AkNewsListItem[]` | no | 列表项，按顺序渲染。 |
| `empty` | `ReactNode` | yes | 空态文案；`items` 为空时显示。 |
| `label` | `string` | yes | 列表的无障碍名。 |

## AkNotice

Extends `Omit<HTMLAttributes<HTMLElement>, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `code` | `ReactNode` | yes | Registry-style routing code shown in the left gutter. |
| `role` | `'alert' \| 'status'` | yes | Overrides the semantic role derived from `variant`. |
| `title` | `ReactNode` | yes | 通知标题。 |
| `variant` | `AkNoticeVariant` | yes | 语义档位，决定左侧色条与路由码颜色。 |
| `size` | `AkControlSize` | yes | 尺寸档：内距、色条宽度与字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-notice-bar': '0.5rem' }`。 |

## AkNoticeStack

_(no props of its own)_

## AkNum

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkOpCard

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `ReactNode` | no | 干员名。 |
| `sub` | `ReactNode` | yes | 名字下的小字（英文名 · 编号 / 生日 / 获得方式）。 |
| `avatar` | `string` | yes | 头像图片地址（正方形）。不传时留一块主题化占位块。 |
| `avatarAlt` | `string` | yes | 头像的替代文本；`avatarOnly` 时同时用作读屏名。 |
| `rarity` | `AkRarityLevel` | no | 稀有度 1–6：头像底色 + 右下角星级。 |
| `rarityIcon` | `string` | yes | 右下角星级图片地址；不传时用 CSS 星形（`AkRarity`）。 |
| `profession` | `string` | yes | 左上角职业图标的替代文本。 |
| `professionIcon` | `string` | yes | 左上角职业图标地址；不传不显示该角标。 |
| `elite` | `0 \| 1 \| 2` | yes | 左下角精英化阶段 0–2。 |
| `eliteIcon` | `string` | yes | 左下角精英化图标地址；不传不显示该角标。 |
| `size` | `AkOpCardSize` | yes | 尺寸档：sm 88 · md 128 · lg 180（px 宽）。 |
| `variant` | `AkOpCardVariant` | yes | 外观：default 稀有度只看头像底 · rail 另加稀有度色左边条。 |
| `href` | `string` | yes | 链接到干员页；不传渲染成 `div`。 |
| `current` | `boolean` | yes | 当前项：强调色描边 + `aria-current="page"`。 |
| `avatarOnly` | `boolean` | yes | 纯头像：不显示名字栏，名字改作读屏名与悬停提示。 |
| `badge` | `ReactNode` | yes | 头像右上角的额外角标。 |

## AkOpGrid

Extends `DivProps`.

_(no props of its own)_

## AkOpRow

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `ReactNode` | no | 干员名。 |
| `avatar` | `string` | yes | 头像图片地址（正方形，36px 显示）；不传时显示名字首字母。 |
| `rarity` | `AkRarityLevel` | yes | 稀有度 1–6：头像底色；给 `stars` 时第二行的星也按它画。 |
| `meta` | `ReactNode` | yes | 第二行小字：分支 / 职业 / 获得方式。 |
| `stars` | `boolean` | yes | 在第二行前面画稀有度星（需要 `rarity`）。 |
| `href` | `string` | yes | 链接到干员页；不传渲染成 `span`。 |

## AkOutline

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `color` | `string` | yes | 轮廓色。默认灰色。 |

## AkOverline

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkPagination

翻页控件。 上游 SCSS 的 `.ak-pagination` 早已写好（固定 16rem 宽、左上一段时间轴式的 「上一 / 当前 / 下一」三段布局），但一直没有 React 组件 —— 又一个「有实现、没出口」。 结构照样式表来：`.prev` / `.cur`（内含 `.title` + `.label` + `.number`）/ `.next`。

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `page` | `number` | no | 当前页（从 1 开始）。 |
| `total` | `number` | no | 总页数。 |
| `onPageChange` | `(page: number) => void` | yes | 翻页回调，参数是目标页。 |
| `title` | `ReactNode` | yes | 当前页上方的小标题（`.cur .title`）。 |
| `previousLabel` | `string` | yes | 上一页按钮的无障碍名。 |
| `nextLabel` | `string` | yes | 下一页按钮的无障碍名。 |
| `previousIcon` | `ReactNode` | yes | 替换默认的箭头图标。 |
| `nextIcon` | `ReactNode` | yes | — |
| `loop` | `boolean` | yes | 循环：到首/末页时回卷。 |
| `numbered` | `boolean` | yes | 页码形态：渲染一排页码按钮（`.ak-pagination__item`）而不是「上一 / 当前 / 下一」 三段式。当前页带 `.is-active`，被禁用的页码带 `.is-disabled`，中间跳过的页码 用 `.ak-pagination__ellipsis` 表示。缺省仍是三段式。 |
| `disabledPages` | `readonly number[]` | yes | 页码形态下不可点的页码（缺省时全部可点）。被禁用的页码会带 `.is-disabled`。 |
| `navLabel` | `string` | yes | 页码形态下导航地标的无障碍名，默认 `Pagination`。 |
| `size` | `AkControlSize` | yes | 尺寸档：整体宽高、箭头区宽度、页码字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-pagination-w': '100%' }`。 |

## AkPanel

Extends `Omit<DivProps, 'children' | 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes | 标题。 |
| `en` | `ReactNode` | yes | 标题后的拉丁小标（如 `Notice`）。 |
| `titleTag` | `AkPanelTitleTag` | yes | 标题元素标签：默认 `div`；面板是页面大纲里的一节时用 `h2`–`h6`。 |
| `inverse` | `boolean` | yes | 标题栏反色（亮色下黑底白字、暗色下白底黑字）。 |
| `collapsible` | `boolean` | yes | 可折叠：点标题栏收起 / 展开正文。 |
| `expanded` | `boolean` | yes | 受控展开状态（`collapsible` 时有效）。 |
| `defaultExpanded` | `boolean` | yes | 非受控模式下的初始展开状态。 |
| `onExpandedChange` | `(expanded: boolean) => void` | yes | 展开状态变化时回调。 |
| `headerExtra` | `ReactNode` | yes | 标题栏右侧的内容（标签、日期、按钮）。 |
| `children` | `ReactNode` | yes | 面板正文。 |

## AkParticleField

Extends `ParticleOptions`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkPathNav

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `homeHref` | `string` | yes | 首页链接的地址。 |
| `homeLabel` | `string` | yes | 首页链接的无障碍名（图标是 CSS 画的，文字给读屏）。 |
| `homeIcon` | `ReactNode` | yes | 首页图标（不传则用 CSS 画的线稿房子）。 |
| `upHref` | `string` | yes | 「所属一览」链接的地址。 |
| `upLabel` | `ReactNode` | yes | 「所属一览」的文字。 |
| `here` | `ReactNode` | yes | 「本页」文字（不是链接）。 |
| `ariaLabel` | `string` | yes | 读屏用的路径条名字。 |

## AkPhaseTabs

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `number` | no | 当前精英阶段 0–2。 |
| `onValueChange` | `(value: number) => void` | yes | 阶段变化回调（受控）。 |
| `max` | `0 \| 1 \| 2` | yes | 最高精英阶段：只画到这一阶（三星干员 1，一 / 二星 0）。 |
| `icons` | `readonly string[]` | yes | 各阶段图标地址，下标 = 阶段；不传只有文字。 |
| `label` | `string` | yes | 读屏用的组名。 |

## AkPopover

Extends `CommonProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `kind` | `'popover' \| 'tooltip'` | yes | 外观：`popover` 是带标题的浮层，`tooltip` 是窄的气泡提示。 |

## AkPot

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `index` | `ReactNode` | yes | 左列内容，通常是潜能图标。 |
| `label` | `ReactNode` | yes | 小标签（潜能 2 / 3 / 4 / 5 / 6）。 |
| `active` | `boolean` | yes | 当前潜能已生效的项：顶部 3px 信号条 + 标签变色。 |

## AkPotList

Extends `DivProps`.

_(no props of its own)_

## AkPotential

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | 潜能图标。 |
| `bare` | `boolean` | yes | 去掉深色底框，只留图标。 |
| `label` | `string` | yes | 可读标签，用于无障碍。 |

## AkProfession

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | 图标节点，通常是宿主自己的 `<img src=… />`。不传只保留占位框与职业色。 |
| `name` | `AkProfessionName` | no | 职业名，决定 `--ak-p` 职业色。 |
| `boxed` | `boolean` | yes | 深底白图标框，两主题都不反相。 |
| `outline` | `boolean` | yes | 加细边框。 |
| `size` | `AkProfessionSize` | yes | 图标框尺寸：sm / default / lg / xl。 |

## AkProfessionLabel

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `ReactNode` | no | 中文职业名。 |
| `en` | `ReactNode` | yes | 英文职业名（大写拉丁字）。 |
| `icon` | `ReactNode` | yes | 职业图标节点，由宿主传入。 |
| `subProf` | `ReactNode` | yes | 子职业图标；给出后会套上 `.ak-subprof`（26px 的图标槽，图缩到 90% 并套 `--ak-glyph-filter`）。与 `icon` 是**两个不同的槽**，可以同时出现。 |
| `subProfLabel` | `string` | yes | 子职业槽的无障碍名（槽本身是装饰性的，给了才播报）。 |
| `prof` | `AkProfessionName` | yes | 职业名；给出后带上对应的 `--ak-p` 职业色。 |

## AkProgress

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 名称，同时用于 `aria-label`，默认 `Progress`。 |
| `max` | `number` | yes | 区间上限。 |
| `min` | `number` | yes | 区间下限。 |
| `value` | `number` | yes | 当前值，会夹到区间内。 |
| `valueLabel` | `ReactNode` | yes | Custom text for the right-hand value readout. Defaults to the rounded percentage. |
| `variant` | `AkProgressVariant` | yes | 外观档位：`default` / `warning` / `danger` / `yellow` / `success`。 `yellow` 与 `success` 分别发出 `.ak-progress--yellow` / `.ak-progress--success`。 |
| `size` | `AkControlSize` | yes | 尺寸档：内距、轨道粗细与字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-progress-track-h': '1.25rem' }`。 |

## AkProgressStack

_(no props of its own)_

## AkRange

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `grids` | `readonly AkRangeGrid[]` | no | 可攻击的格子（相对自身）；col 向前为正，自身 (0, 0) 写不写都行。 |
| `size` | `AkRangeSize` | yes | 尺寸：sm 14 · md 22 · lg 28（px 格边）。 |
| `label` | `string` | yes | 可访问名（aria-label）；默认「攻击范围：自身之外 N 格」。 |

## AkRarity

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `AkRarityLevel` | yes | 星级，决定星形颜色（1 灰 → 6 橙）。 |
| `size` | `AkRaritySize` | yes | 尺寸档位。 |
| `variant` | `'default' \| 'white'` | yes | `white` 用纯白星，忽略星级配色。 |
| `count` | `number` | yes | 覆盖星数；默认等于 `level`。 |

## AkRarityBar

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `AkRarityLevel` | no | 左缘色条的稀有度档位。 |

## AkRarityChip

Extends `SpanProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `AkRarityLevel` | no | 芯片底色的稀有度档位。 |

## AkRarityScope

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `AkRarityLevel` | no | 给后代开启 `--ak-r` / `--ak-r-text` 色轨。 |

## AkRedacted

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `revealed` | `boolean` | yes | 常显（受控）；不写则内部自管（点按 / Enter / Space 切换）。 |
| `onRevealedChange` | `(value: boolean) => void` | yes | 常显状态变化。 |
| `label` | `string` | yes | 遮住的内容的说明（读屏念这句）；默认「已隐藏内容」。 |
| `children` | `ReactNode` | yes | 被涂黑的文字。 |

## AkReticle

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'action' \| 'danger'` | yes | 准星色调：info（默认青色）/ action（黄色）/ danger（红色） |
| `corners` | `'two' \| 'four'` | yes | 准星角位：two（对角两角标，默认）/ four（四角锁定框）。 |

## AkRichText

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `nodes` | `AkRichTextNode[]` | yes | 节点列表（呈现型，不解析标记）。 |
| `tone` | `AkRichTextTone` | yes | 整块的语义色（上游的 `variant`）。 |
| `as` | `ElementType` | yes | 外层元素，默认 `span`。 |
| `children` | `ReactNode` | yes | 直接给的节点（不写 `nodes` 时用）。 |

## AkSan

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `current` | `number \| string` | no | 当前理智值。 |
| `total` | `number \| string` | yes | 理智上限；用于 `role="meter"` 的 `aria-valuemax`。 |
| `limit` | `number` | yes | `total` 缺省时给读屏用的上限，不影响渲染。 |
| `onAdd` | `() => void` | yes | 加号按钮的动作。不传则不渲染按钮，避免出现「看着能点其实没反应」的假 UI。 |
| `addLabel` | `string` | yes | 加号按钮的无障碍名，默认「增加理智」。 |
| `figure` | `ReactNode` | yes | 图形层内容（`.ak-san__figure`），通常传一个图标。 |
| `label` | `string` | yes | 部件的无障碍名。 |

## AkSanContainer

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkSanVariant` | yes | 外观，见 {@link AkSanVariant}。默认 `compact`。 |
| `eyebrow` | `ReactNode` | yes | 顶部小标（`.ak-san-container__eyebrow`，仅 compact 有）。 |
| `title` | `ReactNode` | yes | 标题（`.ak-san-container__title`，仅 compact 有）。 |
| `meta` | `ReactNode` | yes | 标题下方一行，通常放 `AkLevel` 等读数（仅 compact 有）。 |
| `status` | `ReactNode` | yes | 状态文字（`.ak-san-container__status`，仅 compact 有）。 |
| `watermark` | `ReactNode` | yes | 水印图形（`.ak-san-container__watermark`，仅 terminal 有）。 |
| `current` | `number \| string` | no | 计数器的当前值。 |
| `total` | `number \| string` | yes | 计数器上限。 |
| `limit` | `number` | yes | `total` 缺省或非数字时给读屏用的上限（透传给内部 `AkSan`）。 |
| `onAdd` | `() => void` | yes | 计数器的加号动作。 |
| `addLabel` | `string` | yes | 加号按钮的无障碍名。 |
| `figure` | `ReactNode` | yes | 计数器图形层。 |

## AkSanity

Extends `SpanProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | no | 消耗的理智。 |

## AkScope

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `theme` | `AkScopeTheme` | yes | 局部主题：`terminal` 终端（暗）· `archive` 档案（亮）；不传 = 跟随宿主页面。 |
| `tag` | `'div' \| 'section' \| 'article' \| 'main' \| 'aside'` | yes | 根元素标签。 |
| `children` | `ReactNode` | yes | 作用域里的内容。 |

## AkScreen

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `tone` | `AkScreenTone` | yes | 终端色调修饰符，对应命令色彩方案：'dark' \| 'paper' \| 'muted' \| 'cyan'。 |
| `title` | `ReactNode` | no | 顶栏主标题。 |
| `eyebrow` | `ReactNode` | yes | 标题上方的小标/分类代码。 |
| `meta` | `ReactNode` | yes | 顶栏右侧的资源信息槽位（理智、龙门币、合成玉等读数）。 |
| `status` | `ReactNode` | yes | 顶栏状态指示槽位（如信号状态、连接状态、运行指标）。 |
| `backLabel` | `ReactNode` | yes | 返回按钮标签，默认为 'BACK'。 |
| `onBack` | `() => void` | yes | 点击返回按钮的回调。若不传则不渲染返回按钮。 |
| `closeOnEsc` | `boolean` | yes | 是否监听 Escape 键自动触发 onBack。默认为 false。 |
| `watermark` | `ReactNode` | yes | 右下角装饰水印。 |
| `leaving` | `boolean` | yes | 正在退场状态（播放离场动画）。 |
| `sound` | `boolean` | yes | 是否启用入场与返回触觉音效（默认 true）。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-screen-signal': '#ff5e19' }`。 |
| `children` | `ReactNode` | yes | 屏幕内部主体内容。 |

## AkScrollArea

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `axis` | `AkScrollAxis` | yes | 哪个方向可滚。默认 `y`。 |
| `maxHeight` | `string` | yes | `y` / `both` 时的最大高度，默认 20rem（令牌 `--ak-scroll-max`）。 |
| `children` | `ReactNode` | yes | — |

## AkSearch

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | yes | 占位提示。 |
| `size` | `AkControlSize` | yes | 尺寸档。 |
| `disabled` | `boolean` | yes | 禁用。 |
| `label` | `string` | yes | 可访问名（`aria-label`）。 |
| `shortcut` | `string` | yes | 聚焦快捷键（单个按键，如 `/`）：右侧显示键帽，在页面上别处按下它就聚焦到这里。 |
| `value` | `string` | yes | 受控的搜索词。 |
| `defaultValue` | `string` | yes | 非受控模式下的初始搜索词。 |
| `onValueChange` | `(value: string) => void` | yes | 搜索词变化时回调。 |
| `onSearch` | `(query: string) => void` | yes | 在输入框里按了回车。 |

## AkSectionNavigator

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `syncHash` | `boolean` | yes | 是否把当前区块写进地址栏 hash。 |
| `duration` | `number` | yes | 切换动画时长（毫秒）。 |
| `onChange` | `(id: string, index: number) => void` | yes | 切换时回调，给出区块 id 与序号。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `children` | `React.ReactNode` | yes | 视口内容；必须含 `[data-ak-section-viewport]` 与带唯一 id 的区块。 |

## AkSegmented

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | yes | 读屏标签，默认 `Options`。 @deprecated Use the native `aria-label` prop instead. When both are set, `aria-label` wins; `ariaLabel` is only the fallback. |
| `options` | `AkSegmentedOption[]` | no | 选项列表，每项 `label` + `value`。 |
| `value` | `string` | yes | Controlled selected value. When defined the segmented control is controlled and this value wins; when `undefined` the component is uncontrolled. An unmatched value falls back to the first enabled option. |
| `defaultValue` | `string` | yes | Initial selected value in uncontrolled mode. Ignored whenever `value` is defined. Defaults to the first enabled option. |
| `onValueChange` | `(value: string) => void` | yes | Called with the next value on click and keyboard navigation, in both modes. |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `large` | `boolean` | yes | 是否使用上游的加大档（`.ak-segmented--lg`：36px 高 / 56px 起步 / 正文号）。 ⚠️ 与 `size` 分开：`size` 走本库的 `data-ak-size` 尺寸系统（sm/md/lg）， 这一枚是上游形态档的**显式选择**，两者正交 —— 写 `size="lg"` 不会自动 发出 `--lg`，因为那会改动现有调用方的渲染结果。 |
| `size` | `AkControlSize` | yes | 尺寸档：每项的最小宽高、内边距与字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-segmented-inset': '0' }`。 |

## AkSelect

Extends `Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | — |
| `children` | `ReactNode` | yes | — |
| `invalid` | `boolean` | yes | 是否校验失败。为真时加 `.is-invalid`（红边）并置 `aria-invalid`。 放在 `AkField` 内时继承字段的 `invalid`。 |
| `valid` | `boolean` | yes | 是否校验通过。为真时加 `.is-valid`（绿边）。与 `invalid` 同时给出时以 `invalid` 为准。 |
| `required` | `boolean` | yes | 是否必填。为真时带上原生 `required`。 放在 `AkField` 内时继承字段的 `required`。 |
| `size` | `AkControlSize` | yes | 尺寸档：高度、内距与字号。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖。 |

## AkSkeleton

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'block' \| 'track'` | yes | 占位形状。`text` 一行高，`block` 一个方块，`track` 用上游的进度轨占位。 |
| `shape` | `AkSkeletonShape` | yes | 上游的单枚占位形状（`.ak-skeleton--text` / `--rect` / `--square` / `--circle`）。 ⚠️ 与 `variant` 分开：`variant="text"` 是本库的**多行**占位容器， `.ak-skeleton--text` 是上游的**单行**占位 —— 两个类名长得像但不是一回事。 给了 `shape` 时以 `shape` 为准。 |
| `lines` | `number` | yes | 行数（仅 `text`）。 |
| `width` | `string` | yes | — |
| `height` | `string` | yes | — |

## AkSkew

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `direction` | `AkSkewDirection` | yes | 倾斜方向：left = -10deg，right = +10deg。 |

## AkSkill

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `string` | no | 技能名。 |
| `alias` | `AkSkillAlias` | yes | 别名，跟在技能名后的灰色小字。 |
| `icon` | `ReactNode` | yes | 技能图标（宿主自己的 `<img src=… />`）；不传只保留图标框。 |
| `spType` | `AkSpType` | yes | 技力回复方式：决定图标描边、底条色与 SP 标签。 |
| `trigger` | `AkSpTriggerType` | yes | 触发方式；不写不显示（被动技能）。 |
| `cost` | `number \| string` | yes | 技力消耗；不写不显示。 |
| `init` | `number \| string` | yes | 初始技力；不写不显示。 |
| `duration` | `number \| string` | yes | 持续时间：数字按秒写成「25s」，字符串原样（「—」）；不写不显示。 |
| `unlock` | `string` | yes | 开放条件（「技能2 · 精英一开放」），显示在右侧槽。 |
| `unlockIcon` | `ReactNode` | yes | 开放条件前的图标（宿主自己的 `<img src=… />`）。 |
| `selected` | `boolean` | yes | 选中（蓝框 + 左上角标）。 |
| `locked` | `boolean` | yes | 未解锁：图标灰化 + 锁。 |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | yes | 技能名的标题级别（正文里一般是 4）。 |
| `headerExtra` | `ReactNode` | yes | 名称行末尾的附加内容（「未解锁」标签等）。 |
| `aside` | `ReactNode` | yes | 右侧槽（开放条件之后）：技能范围等；写了就是三栏的宽卡。 |
| `children` | `ReactNode` | yes | 技能描述。 |

## AkSkillLevels

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `AkSkillLevel` | yes | 当前等级（1-7 或 M1-M3）。 |
| `onValueChange` | `(value: AkSkillLevel) => void` | yes | 等级变化时回调。 |
| `max` | `AkSkillLevel` | yes | 只显示到这一级为止（例如未精英化时锁 1-7）。 |
| `disabled` | `boolean` | yes | 禁用整组。 |
| `masteryIcon` | `ReactNode` | yes | 自定义专精档的图标（M1/M2/M3）。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `ariaLabel` | `string` | yes | 整组的读屏名，默认「技能等级」。 |

## AkSkillMatrix

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `rows` | `AkSkillMatrixRow[]` | no | 参数行。 |
| `description` | `ReactNode \| ((ctx: AkSkillMatrixRenderContext) => ReactNode)` | yes | 描述：给节点直接渲染，或给一个函数按当前列算出变量位。 |
| `masteryIcons` | `readonly string[]` | yes | 专精 Ⅰ–Ⅲ 的图标地址；不给时写 M1–M3。 |
| `label` | `string` | yes | 表格的可访问名（如「鞘击 · 各等级参数」）。 |
| `level` | `number` | yes | 钉住的等级（受控）；不写则内部自管。 |
| `onLevelChange` | `(level: number \| undefined) => void` | yes | 钉住 / 取消钉住某一列。 |
| `header` | `ReactNode` | yes | 表头卡（一般是 `AkSkill`）。 |
| `footer` | `ReactNode` | yes | 表下的注释。 |

## AkSkillSheet

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `levels` | `AkSkillSheetLevel[]` | no | 各级数据：1–7 级，之后是专精 Ⅰ–Ⅲ。 |
| `highlight` | `number` | yes | 高亮一行（当前等级，1–10）。 |
| `masteryIcons` | `readonly string[]` | yes | 专精 Ⅰ–Ⅲ 的图标地址（宿主自己的素材）；不给时写 M1–M3。 |
| `label` | `string` | yes | 表格的可访问名（如「鞘击 · 各等级数据」）。 |
| `header` | `ReactNode` | yes | 表头卡（一般是 `AkSkill`）。 |
| `footer` | `ReactNode` | yes | 表下的注释（「※不可对空」）。 |

## AkSlider

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | Accessible name for the range input, exposed as `aria-label`. Optional when the input is named by a visible `<label>` or a native `aria-label`; the native `aria-label` wins when both are provided. |
| `min` | `number` | yes | 区间下限。 |
| `max` | `number` | yes | 区间上限。 |
| `step` | `number` | yes | 步长。 |
| `value` | `number` | yes | Controlled value. When defined the slider is controlled and this value wins; when `undefined` the component is uncontrolled. Out-of-range values are displayed clamped. |
| `defaultValue` | `number` | yes | Initial value in uncontrolled mode. Ignored whenever `value` is defined. Out-of-range values are clamped. Defaults to `min`. |
| `onValueChange` | `(value: number) => void` | yes | Called with the clamped value while dragging, in both modes. |
| `size` | `AkControlSize` | yes | 尺寸档：控件高度、轨道粗细与拇指尺寸一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-slider-accent': '#ff5e19' }`。 |

## AkSlot

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染标签，默认为 'button'。 |
| `name` | `ReactNode` | yes | 干员名字。 |
| `code` | `ReactNode` | yes | 职业代码大字水印（如 VNG / GRD / MED / CAS）。 |
| `rarity` | `AkSlotRarity` | yes | 稀有度等级（1 到 6 档）。 |
| `role` | `AkSlotRole` | yes | 职业类别，决定底部特征信号条颜色。 |
| `meta` | `ReactNode` | yes | 副信息（如代号、阵营、职能等）。 |
| `rarityLabel` | `ReactNode` | yes | 稀有度文字标识（左上角星级小字）。 |
| `elite` | `0 \| 1 \| 2` | yes | 精英化阶段（0 / 1 / 2）。 |
| `level` | `ReactNode` | yes | 等级读数（数字或 'LV.80'）。 |
| `empty` | `boolean` | yes | 是否为空槽位（未编队/占位）。 |
| `disabled` | `boolean` | yes | 是否禁用/不可派遣。 |
| `reveal` | `boolean` | yes | 是否播放翻牌显现入场动画。 |
| `index` | `number` | yes | 动画延迟阶梯索引（乘 80ms）。 |
| `pressed` | `boolean` | yes | 是否为选中状态。 |
| `size` | `AkControlSize` | yes | 尺寸档：槽位高度、字号与内边距一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-slot-signal': '#f5bd38' }`。 |
| `sound` | `TactileSoundType \| false` | yes | 触发点击时播放的触觉音效。传 false 禁用音效，缺省时 5/6 星播 'elite'，其余播 'select'，空槽位播 'tap'。 |

## AkSp

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `spType` | `AkSpType` | yes | 技力回复方式，决定底色与文字。 |
| `tip` | `string \| false` | yes | 悬停提示；默认是游戏内的说明，`false` 关掉。 |
| `children` | `ReactNode` | yes | 芯片里的字；默认是「自动回复」「攻击回复」… |

## AkSpTrigger

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `auto` | `boolean` | yes | 自动触发（灰底）；默认手动触发。 |
| `tip` | `string \| false` | yes | 悬停提示；默认是游戏内的说明，`false` 关掉。 |
| `children` | `ReactNode` | yes | 芯片里的字；默认「手动触发」/「自动触发」。 |

## AkSpValue

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `kind` | `AkSpValueKind` | no | 哪一枚芯片：消耗 · 初始 · 持续。 |
| `value` | `number \| string` | yes | 数值；不写时只出图形（表头图例写「消耗」「初始」这类字时用 `children`）。 |
| `tip` | `string \| false` | yes | 悬停提示；默认是这一项的说明，`false` 关掉。 |
| `children` | `ReactNode` | yes | 芯片里的字（代替 `value`）；给了就不再补读屏用的名字。 |

## AkSpec

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | 专精图标。 |
| `bare` | `boolean` | yes | 去掉深色底框，只留图标。 |
| `label` | `string` | yes | 无障碍名。 |

## AkSpinner

Extends `HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `color` | `string` | yes | 颜色，喂给 `--ak-loading-color`。 |
| `label` | `string` | yes | 无障碍名。默认 `Loading`。 |
| `variant` | `AkSpinnerVariant` | yes | 指示器形态： `default` 是本库的方舟方框（`.ak-loading`），`ripple` 是上游的菱形涟漪（`.ak-spinner`）， `bars` 是上游的三根跳条（`.ak-loader`）。 |
| `description` | `ReactNode` | yes | 指示器下方的说明文字。给了就把指示器与说明竖排包进 `.ak-spin`。 |

## AkStage

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `code` | `ReactNode` | no | 关卡编号（1-7 / H6-4 / TO-EX-1）。 |
| `name` | `ReactNode` | yes | 关卡名。 |
| `caption` | `ReactNode` | yes | 编号下的小字：章节 / 类型（Main · Chapter 1 / Hard / Story）。 |
| `variant` | `AkStageVariant` | yes | 左侧类型色条：hard 磨难红 · ex 深红 · story 灰；default 无色条。 |
| `sanity` | `number \| string` | yes | 理智消耗：元信息行里的六边形 + 数字。 |
| `level` | `ReactNode` | yes | 推荐等级（LV.30 / E2 LV.40），显示为「推荐 LV.30」。 |
| `href` | `string` | yes | 链接到关卡页：整张卡是链接。 |
| `meta` | `ReactNode` | yes | 元信息行末尾追加的项（剧情关卡 / 前往关卡页 »）。 |

## AkStageCode

Extends `Omit<HTMLAttributes<HTMLElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkStageCodeVariant` | yes | hard = 红底（磨难 / 险地关卡号）。 |
| `href` | `string` | yes | 链接到关卡页；不传渲染成 `span`。 |
| `children` | `ReactNode` | yes | 关卡号（5-8 / H6-4）。 |

## AkStat

Extends `Omit<DivProps, 'children' | 'title' | 'prefix'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 名称（小号大写 overline）。 |
| `value` | `ReactNode` | yes | 数值（原样显示，千分位等格式由调用方先排好）。 |
| `delta` | `ReactNode` | yes | 变化量（「+4 本月」「-12%」）。 |
| `trend` | `AkStatTrend` | yes | 变化方向；不写时按 `delta` 开头的 `+` / `-` 判断。 |
| `inline` | `boolean` | yes | 行内：一行「名称 数值」，不要卡片框。 |
| `prefix` | `ReactNode` | yes | 数值前面的内容（货币符号、图标）。 |
| `suffix` | `ReactNode` | yes | 数值后面的小字单位。 |
| `children` | `ReactNode` | yes | 数值（代替 `value`）。 |

## AkStatRow

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 若干 `AkStat`。 |

## AkStatus

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `detail` | `ReactNode` | yes | Secondary text shown after the signal label. |
| `label` | `ReactNode` | yes | Primary label. Falls back to `Online`, matching the original registry component. |
| `variant` | `AkStatusVariant` | yes | 语义档位。 |
| `size` | `AkControlSize` | yes | 尺寸档：信号点直径与字号一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖。 |

## AkStatusGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

## AkStep

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes | 步骤名（也可以写在 children 里）。 |
| `status` | `AkStepStatus` | yes | 状态：`wait` 未到 · `active` 当前 · `done` 已完成；不写时按 `AkSteps` 的 `current` 推算。 |
| `children` | `ReactNode` | yes | 步骤名（代替 `title`）。 |

## AkSteps

Extends `Omit<HTMLAttributes<HTMLOListElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `current` | `number` | yes | 当前步骤（从 1 数）：之前的已完成、这一步是当前、之后未到；超过步数 = 全部完成；不写则各步按自己的 status。 |
| `label` | `string` | yes | 读屏用的列表名（如「精英化进度」）。 |
| `children` | `ReactNode` | yes | 若干 `AkStep`。 |

## AkStripeEdge

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 当容器用时指定标签，默认 `div`。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkStripes

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `bar` | `boolean` | yes | 条纹高度，默认 6px（等同上游 .ak-stripe-bar）。 |
| `variant` | `AkStripesVariant` | yes | 斜纹类型：default / strong / warning / danger / hazard。 |

## AkTable

Extends `Omit<HTMLAttributes<HTMLTableElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `columns` | `AkTableColumn[]` | no | 表格列配置列表。 |
| `rows` | `AkTableRow[]` | no | 表格数据行列表。 |
| `footer` | `Record<string, ReactNode>` | yes | 表尾汇总行（与 columns 对齐）。 |
| `emptyLabel` | `ReactNode` | yes | 无数据时的占位文字。 |
| `onRowClick` | `(row: AkTableRow, index: number) => void` | yes | 点击行时的回调。开启后行具备悬停反馈与键盘 Enter/Space 点击。 |
| `hoverable` | `boolean` | yes | 是否开启行悬停高亮，默认为 true。 |
| `striped` | `boolean` | yes | 是否开启斑马纹交替底色，默认为 false。 |
| `tactical` | `boolean` | yes | 是否开启战术深色沉浸式指挥台风格。 |
| `stickyHeader` | `boolean` | yes | 是否开启表头粘性吸顶，默认为 false。 |
| `compact` | `boolean` | yes | 是否使用上游的紧凑档（`.ak-table--compact`：更小的单元格内距）。 与 `size` 正交：`size` 走本库的 `data-ak-size` 尺寸系统，这一枚是上游形态档。 |
| `scrollable` | `boolean` | yes | 外层是否套一层横滑容器（列多时建议开）。 |
| `size` | `AkControlSize` | yes | 尺寸档：控制单元格内边距与整表字号。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-table-pad-y': '0.25rem' }`。 |

## AkTabs

Extends `Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | yes | 读屏标签，默认 `Tabs`。 @deprecated Use the native `aria-label` prop instead. When both are set, `aria-label` wins; `ariaLabel` is only the fallback. |
| `items` | `AkTabsItem[]` | no | 标签列表；每项含 `value` / `label` / `title`。 |
| `value` | `string` | yes | Controlled active tab value. When defined the tabs are controlled and this value wins; when `undefined` the component is uncontrolled. An unmatched value falls back to the first enabled item without firing `onValueChange`. |
| `defaultValue` | `string` | yes | Initial active value in uncontrolled mode. Ignored whenever `value` is defined. Defaults to the first enabled item. |
| `onValueChange` | `(value: string) => void` | yes | Called with the next value on click and keyboard navigation, in both modes. |
| `renderPanel` | `(item: AkTabsItem) => ReactNode` | yes | Per-panel content, keyed by tab value. |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `variant` | `AkTabsVariant` | yes | 形态档位：`default` / `pill` / `block` / `vertical`。 分别发出 `.ak-tabs--pill` / `.ak-tabs--block` / `.ak-tabs--vertical`。 |
| `size` | `AkControlSize` | yes | 尺寸档：标签高度、内边距、字号与面板内距一起缩。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖，例如 `{ '--ak-tabs-width': '100%' }`。 |

## AkTag

Extends `HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkTagVariant` | yes | 语义档位。 |
| `size` | `AkControlSize` | yes | 尺寸档。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖。 |

## AkTagGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

## AkTalent

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `string` | no | 天赋名。 |
| `requirements` | `AkTalentRequirement[]` | yes | 解锁条件，跟在名字后面（小号标签字）。 |
| `children` | `ReactNode` | yes | 描述。 |

## AkTalentTable

Extends `Omit<TableHTMLAttributes<HTMLTableElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `string` | no | 第一列的列头（「第一天赋」「第二天赋」）。 |
| `rows` | `AkTalentRow[]` | no | 各条件下的效果。 |
| `potentialRank` | `number` | yes | 潜能开关上写的潜能等级（「潜能5」）。 |
| `potentialIcon` | `ReactNode` | yes | 潜能开关上的潜能图标（宿主自己的 `<img src=… />`）。 |
| `calcToggle` | `boolean` | yes | 表头显示「算法」开关；打开后表尾有图例行。 |
| `potential` | `boolean` | yes | 潜能加成开关（受控）；不写则内部自管。 |
| `onPotentialChange` | `(value: boolean) => void` | yes | 潜能加成开关变化。 |
| `calc` | `boolean` | yes | 算法标记开关（受控）；不写则内部自管。 |
| `onCalcChange` | `(value: boolean) => void` | yes | 算法标记开关变化。 |
| `renderCondition` | `(row: AkTalentRow, index: number) => ReactNode` | yes | 自己画条件格（放精英化图标等）。 |
| `renderDescription` | `(row: AkTalentRow, index: number, potential: boolean) => ReactNode` | yes | 自己画描述（要标 `AkCalc` 时用）。 |
| `legend` | `ReactNode` | yes | 图例行末尾的附加内容。 |

## AkTextarea

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | — |
| `invalid` | `boolean` | yes | 是否校验失败。为真时加 `.is-invalid`（红边）并置 `aria-invalid`。 放在 `AkField` 内时继承字段的 `invalid`。 |
| `valid` | `boolean` | yes | 是否校验通过。为真时加 `.is-valid`（绿边）。与 `invalid` 同时给出时以 `invalid` 为准。 |
| `required` | `boolean` | yes | 是否必填。为真时带上原生 `required`。 放在 `AkField` 内时继承字段的 `required`。 |
| `size` | `AkControlSize` | yes | 尺寸档：内距与字号（高度由 `rows` 决定）。 |
| `tokens` | `AkTokens` | yes | 逐实例令牌覆盖。 |

## AkThumbnail

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `src` | `string` | yes | — |
| `alt` | `string` | yes | — |
| `fallback` | `ReactNode` | yes | 无图时显示的内容。不传则只有斜纹底（明显是占位）。 |
| `badge` | `ReactNode` | yes | 左下角角标（编号那种）。 |
| `cut` | `boolean` | yes | 右上角切角。 |
| `size` | `'default' \| 'wide' \| 'lg'` | yes | — |

## AkTimeline

Extends `HTMLAttributes<HTMLUListElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 若干 `AkTimelineItem`，从早到晚。 |

## AkTimelineItem

Extends `Omit<HTMLAttributes<HTMLLIElement>, 'children' | 'title' | 'content'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `time` | `ReactNode` | yes | 时间（小字，在标题上方）。 |
| `title` | `ReactNode` | yes | 标题。 |
| `content` | `ReactNode` | yes | 说明文字（也可以写在 children 里）。 |
| `status` | `AkTimelineStatus` | yes | 节点状态：`wait` 空心菱形（默认）· `active` 当前 · `done` 已发生（后两者都是主色实心）。 |
| `children` | `ReactNode` | yes | 说明文字（代替 `content`）。 |

## AkToastProvider

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `duration` | `number` | yes | 默认停留时长（ms），0 = 不自动消失；单条可以在选项里改。 |
| `closable` | `boolean` | yes | 默认显示 ✕ 关闭按钮。 |
| `keepAliveOnHover` | `boolean` | yes | 鼠标悬停 / 键盘聚焦在某条上时暂停它的倒计时。 |
| `max` | `number` | yes | 最多同时显示几条，多了先关最早的。 |
| `label` | `string` | yes | 读屏里提示栈的名字。 |
| `children` | `ReactNode` | yes | 应用内容：里面的组件可以 `useToast()`。 |

## AkToolbar

Props for the ARIA toolbar.

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | no | Accessible name required for the toolbar landmark. |
| `children` | `ReactNode` | no | Toolbar controls. |

## AkTooltip

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'content'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | yes | 提示内容。 |
| `placement` | `AkTooltipPlacement` | yes | 出现在触发元素的哪一边。 |
| `trigger` | `AkTooltipTrigger` | yes | 触发方式：`hover` 悬停 + 键盘聚焦（默认）· `focus` 只看聚焦 · `click` 点击开合 · `manual` 只由 `open` 定。 |
| `delay` | `number` | yes | 悬停多久后出现（ms）。 |
| `duration` | `number` | yes | 移开多久后消失（ms）。 |
| `disabled` | `boolean` | yes | 禁用：不再出现。 |
| `wide` | `boolean` | yes | 宽版：允许折行、上限 280px。 |
| `open` | `boolean` | yes | 受控显示状态。 |
| `defaultOpen` | `boolean` | yes | 非受控模式下的初始显示状态。 |
| `onOpenChange` | `(open: boolean) => void` | yes | 显示状态变化时回调。 |
| `children` | `ReactNode` | yes | 触发元素（单个）。 |

## AkTrust

Extends `SpanProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `iconSrc` | `string` | yes | 图标地址。经 CSS 变量喂给 `::before`，不传就不出图标、也不占位。 |
| `value` | `ReactNode` | yes | 显示在图标后的文字，例如「信赖 200」。 |

## AkVignette

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `size` | `string` | yes | 内投影扩散范围，默认 22%（令牌 `--ak-vignette-size`）。 |
| `color` | `string` | yes | 暗角色，默认取 `--ak-vignette-color`。 |
| `children` | `ReactNode` | yes | 子内容。 |

## AkVoice

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `string` | no | 语音标题（任命助理 / 交谈1 …）。 |
| `text` | `string \| Record<string, string>` | yes | 台词：一个串，或按文本键 / 语种键给的对象。 |
| `src` | `string \| Record<string, string>` | yes | 音频地址：一个串，或按语种键给的对象；不写时播放钮禁用。 |
| `onPlay` | `() => void` | yes | 播放回调；给了就由调用方管播放（`src` 只作可用性判断）。 |
| `playing` | `boolean` | yes | 播放中（受控）；不写则内部自管（自己播 `src` 时有效）。 |
| `unlock` | `string` | yes | 游戏内解锁 / 显示条件。 |
| `lang` | `string` | yes | 语种键（写 `lang` 属性用）。 |
| `download` | `string \| Record<string, string>` | yes | 下载地址：一个串，或按语种键给的对象；给了就在播放钮旁出一枚下载钮。 |
| `downloadName` | `string` | yes | 下载存成的文件名。 |
| `children` | `ReactNode` | yes | 台词（不写 `text` 时用）。 |

## AkVoiceList

Extends `Omit<DivProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `languages` | `AkVoiceLanguage[]` | yes | 语种选项；不给就没有语种切换条。 |
| `texts` | `AkVoiceText[]` | yes | 文本语言选项；不给就没有文本切换条。 |
| `lang` | `string` | yes | 当前语种（受控）；不写则内部自管（默认第一个）。 |
| `onLangChange` | `(value: string) => void` | yes | 当前语种变化。 |
| `shownTexts` | `string[]` | yes | 选中的文本语言（受控，多选、可为空）；不写则内部自管。 |
| `onShownTextsChange` | `(value: string[]) => void` | yes | 选中的文本语言变化。 |
| `children` | `ReactNode` | yes | 若干 `AkVoice`。 |

## AkWatermark

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## Public hooks and utilities

Exported from the package root next to the components.

### isTactileSoundEnabled

检查当前触觉音效是否已开启。

```ts
function isTactileSoundEnabled(): boolean
```

### playTactileSound

合成并播放罗德岛战术风格纯前端 Web Audio 触觉微反馈音。 @param type 音效种类： - `'open'` / `'screen_in'`: 全息快门展开与液压下沉音（终端全屏入场） - `'close'` / `'screen_out'`: 气阀光圈闭锁音（终端全屏退场） - `'confirm'` / `'action'`: 罗德岛战术确认（高频撞击 + 双和弦 + 次低音） - `'elite'` / `'rarity_six'`: 6星黄金干员共鸣晶响（水晶层叠琶音） - `'select'` / `'equip'`: 战术锁定/装备短促微鸣（1200Hz -> 2400Hz 变频锁定） - `'tab'` / `'sweep'`: 伺服切页 / 分类扫频 - `'tick'` / `'dial'` / `'step'`: 微步棘轮点触（数字步进器、滑块滑动） - `'warn'` / `'denied'`: 工业告警 / 操作拒绝不协和颤音 - `'click'`: 机械轻脆快门卡扣音（用于标准按钮、卡片） - `'tap'`: 柔和指尖轻触音（用于轻交互、选项） - `'pip'`: 终端遥测脉冲提示音（用于槽位、状态选择） - `'toggle'`: 战术模式二段升调切换音（用于开关、段选器） @param volume 音量缩放比例（0 到 1，默认 0.15）

```ts
function playTactileSound(type: TactileSoundType, volume?: number): void
```

### setTactileSoundEnabled

开启或关闭全局触觉音效，并持久化到本地存储，同时通知所有已订阅的 Hook 实例。

```ts
function setTactileSoundEnabled(enabled: boolean): void
```

### useTactileSound

触觉音效便捷 Hook，提供当前开启状态、切换及播放函数，并在全局状态变更或多实例间保持自动同步。

```ts
function useTactileSound(): { enabled: boolean; toggle: () => void; setEnabled: (value: boolean) => void; play: (type: TactileSoundType, volume?: number) => void; }
```

### useToast

拿轻提示的接口。 必须在 `AkToastProvider` 里面用；不在里面时返回一个空实现（不抛错）。

```ts
function useToast(): AkToastApi
```

Returns `AkToastApi`:

| Member | Type | Optional | Description |
| --- | --- | --- | --- |
| `create` | `(content: ReactNode, options?: AkToastOptions) => AkToastHandle` | no | 弹一条提示。 |
| `info` | `(content: ReactNode, options?: AkToastOptions) => AkToastHandle` | no | 信息档提示。 |
| `success` | `(content: ReactNode, options?: AkToastOptions) => AkToastHandle` | no | 成功档提示。 |
| `warning` | `(content: ReactNode, options?: AkToastOptions) => AkToastHandle` | no | 警告档提示。 |
| `error` | `(content: ReactNode, options?: AkToastOptions) => AkToastHandle` | no | 错误档提示。 |
| `destroyAll` | `() => void` | no | 关掉全部提示。 |

### AkToastHandle

一条提示的句柄。

| Member | Type | Optional | Description |
| --- | --- | --- | --- |
| `destroy` | `() => void` | no | 立刻关掉这条提示。 |

### AkToastOptions

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes | 标题。 |
| `variant` | `AkToastVariant` | yes | 外观档位。 |
| `duration` | `number` | yes | 停留时长（ms），0 = 不自动消失；不给则用 provider 的默认值。 |
| `closable` | `boolean` | yes | 是否显示 ✕ 关闭按钮；不给则用 provider 的默认值。 |
| `onClose` | `() => void` | yes | 这条提示消失时回调。 |

## Shared types

Types shared by many components.

| Type | Definition | Description |
| --- | --- | --- |
| `AkAvatarSize` | `'xs' \| 'sm' \| 'default' \| 'lg' \| 'xl'` | 头像 / 缩略图 / 横滑区，以及面包屑。 ⚠️ **上游都没有这几样**（只有 `.ak-r-avatar`，那是稀有度色轨垫在头像下的那层， 被 `AkAvatar` 复用了）。所以这一组是本库补的，几何全部取自既有语汇。 ⚠️ `AkAvatar` **默认不做圆形**：本库的几何语言是直角 （decor 层注释原文：「不做圆角，不做辉光，也没有切角/斜切/斜带」）。 圆形头像是通用后台语汇，不属于这里 —— 所以要圆得显式开 `round` （对应上游的 `.ak-avatar--round`，上游也是显式选用，不是默认）。 默认不该是圆。 |
| `AkBackdropStrength` | `'light' \| 'heavy'` | 焦距与底图处理（文章原则二 / 三 / 五）。 这一组与 decor 其余部分的来源不同，**必须交代清楚**： `_ak-decor.scss` / `_ak-arknights.scss` 移植自 prts-design； 而这里是按《明日方舟 UI 拆解》那篇文章补的 —— 三个关键词 （vignette / noise / mosaic）在**上游 SCSS 里零命中**，毛玻璃全库也只有 1 处 （dialog 遮罩）。所以它是本库自己的增补，不是移植。 出处逐条对应文章： vignette —— 原则三「一圈内投影布于页面周围…突出页面中心的信息」（章节选择页） grain —— 原则五「噪点与漫画网点纸风格的底图处理方法…用在基础组件上可以使留白不显得单薄」 mosaic —— 原则五「局部不稳定马赛克化，营造出带梗的信息暗示」/「失去同步」 backdrop —— 原则二「背景模糊…色彩结合更加柔和」「覆盖特性…让玩家窥见之前的页面」 |
| `AkBackdropVariant` | `'grid' \| 'dots' \| 'diag' \| 'scanlines'` | — |
| `AkBackTopPosition` | `'fixed' \| 'absolute'` | — |
| `AkBadgeVariant` | `'default' \| 'accent' \| 'danger'` | — |
| `AkBracketsProps` | `DivProps` | — |
| `AkButtonVariant` | `'default' \| 'outline' \| 'action' \| 'advanced' \| 'light' \| 'danger' \| 'ghost'` | — |
| `AkCalcKind` | `'add' \| 'mul' \| 'fadd' \| 'fmul'` | 进公式的方式：直接加算 · 直接乘算 · 最终加算 · 最终乘算。 |
| `AkCampSize` | `'md' \| 'lg'` | — |
| `AkCampVariant` | `'default' \| 'box'` | — |
| `AkCardVariant` | `'default' \| 'outline' \| 'stripe' \| 'place' \| 'tactical' \| 'glass' \| 'chassis' \| 'flat' \| 'inset' \| 'accent-top'` | 外观档位。 `flat` 无框、换成下沉底，`inset` 是内凹面，`accent-top` 在顶边加一条信号色带； 其余是本库原有的档位。 |
| `AkCboxLevel` | `'tip' \| 'info' \| 'warning' \| 'danger' \| 'neutral'` | — |
| `AkCommandLayout` | `'default' \| 'wide' \| 'wide-mobile' \| 'vertical' \| 'operation' \| 'split'` | 布局。`operation` 是那张大字排版的操作卡（透明底、40cqh 大字、无边框底条）。 |
| `AkCommandTone` | `'default' \| 'paper' \| 'primary' \| 'muted' \| 'dark' \| 'cyan' \| 'accent'` | 色调。`default` 不加修饰符类（走 `.ak-command` 自己的默认值）。 |
| `AkControlSize` | `'sm' \| 'md' \| 'lg'` | 控件尺寸档。 三档刻意只映射到**控制高度令牌**，不映射字号/字距 —— 排版归 `tokens` 管， 档位只负责"占多大的位"。这样 `size` 与 `tokens` 互不打架： `size="sm"` 缩矮，`tokens={{ '--ak-fs-sm': '0.7rem' }}` 缩字，两者可以同时用。 |
| `AkCornerPosition` | `'tl' \| 'tr'` | — |
| `AkCornerTone` | `'info' \| 'yellow' \| 'red'` | — |
| `AkCountdownPrecision` | `'min' \| 'sec'` | — |
| `AkCutCorner` | `'tr' \| 'tl' \| 'br' \| 'bl' \| 'all'` | — |
| `AkCutSize` | `'sm' \| 'md' \| 'lg'` | — |
| `AkDepthVariant` | `'flat' \| 'stage' \| 'tilt'` | 景深（指针驱动的视差）。 **这不是新发明——是把上游已有的两半接起来：** · `core/dashboard-depth.mjs` 的 `createDashboardDepth` 给每个带 `[data-depth]` 的元素 写 `--ak-layer-x` / `--ak-layer-y`（指针偏移 × maxX/maxY × 该元素 depth 值） · `_ak-dashboard.scss:60` 早就有消费规则 `translate3d(var(--ak-layer-x), var(--ak-layer-y), 0)` 上游缺的只是「把它们接起来的东西」，以及一个可复用的类。本组件补的是这一根线。 所以这个控制器在下游此前是**孤儿**（零消费者），现在有宿主了。 ```tsx <AkDepth stage> <AkDepthLayer depth={2}>背景层，动得最多</AkDepthLayer> <AkDepthLayer depth={1}>中景</AkDepthLayer> <AkDepthLayer depth={0.4}>前景，几乎不动</AkDepthLayer> </AkDepth> ``` `depth` 越大位移越多。上游默认 `maxX: 130` / `maxY: 70`（px），对应 `depth = 1` 的满偏量。 |
| `AkDividerVariant` | `'default' \| 'accent' \| 'stripes' \| 'text' \| 'vertical'` | 分隔线形态档位。 `accent` 左段是信号色渐变，`stripes` 整条换成 45° 斜纹带，`text` 是带标签的 发丝分隔线，`vertical` 是一根竖线。缺省是本库原有的「两侧不等长横线 + 居中标签」。 |
| `AkEnemyRank` | `'normal' \| 'elite' \| 'boss'` | — |
| `AkEventStatus` | `'default' \| 'live' \| 'ended'` | — |
| `AkGaugeVariant` | `'default' \| 'warning' \| 'yellow' \| 'success'` | 外观档位。`warning` 与上游的 `yellow` 等价，`success` 是上游的成功绿档。 |
| `AkGlowTone` | `'default' \| 'action' \| 'info' \| 'danger'` | 上游特效层（`.ak-fx-*`）的 React 外壳。 这三样是 ak-ui 真正的动效语言，此前只有 CSS、**没有任何组件暴露它们**： .ak-fx--glow 1.5s ease-out infinite alternate 的 box-shadow 呼吸 .ak-fx--outline 0.7s ease-out infinite 的轮廓向外扩散淡出 .ak-fx--skew 静态倾斜 ±10°（不是动画，是形状语言） 它们跑的是 CSS animation（`infinite`），不是 transition——这是与通用网页过渡最本质的 区别，也是「方舟感」的来源：持续呼吸的辉光、周期性扩散的轮廓环。 相对定位要求：`--outline` 用 `outline-offset` 向外扩，元素本身不必是 relative； 但 `--glow` 的阴影要可见，元素不能是 `overflow: hidden` 的子级。 |
| `AkHalftoneVariant` | `'default' \| 'left' \| 'full'` | — |
| `AkHeadingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | — |
| `AkHeadingSize` | `'md' \| 'lg'` | — |
| `AkHeadingVariant` | `'bar' \| 'underline'` | — |
| `AkItemTier` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | — |
| `AkKvVariant` | `'default' \| 'boxed' \| 'inline'` | — |
| `AkLoadingScreenState` | `'loading' \| 'ready'` | 外观状态：`loading` 显示，`ready` 淡出（透明度 + 可见性 + 指针事件一起关）。 |
| `AkMessageVariant` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'neutral' \| 'accent'` | — |
| `AkModuleColor` | `'red' \| 'blue' \| 'green' \| 'yellow' \| 'purple'` | 模组型号色（游戏模组类型底色）。 |
| `AkMotionEffect` | `'fade' \| 'rise' \| 'color'` | — |
| `AkMotionPace` | `'quick' \| 'base' \| 'slow'` | — |
| `AkNoticeVariant` | `'info' \| 'warning' \| 'danger' \| 'success'` | — |
| `AkOpCardSize` | `'sm' \| 'md' \| 'lg'` | — |
| `AkOpCardVariant` | `'default' \| 'rail'` | — |
| `AkPanelTitleTag` | `'div' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | — |
| `AkProfessionName` | `'pioneer' \| 'warrior' \| 'tank' \| 'sniper' \| 'caster' \| 'medic' \| 'support' \| 'special'` | — |
| `AkProfessionSize` | `'sm' \| 'default' \| 'lg' \| 'xl'` | — |
| `AkProgressVariant` | `'default' \| 'warning' \| 'danger' \| 'yellow' \| 'success'` | 外观档位。 `warning` / `danger` 是本库原有的两档；`yellow` 是上游的黄色档（本库的警告色 就是上游那支黄，故两档等价），`success` 是上游的成功绿档。 |
| `AkRangeGrid` | `{ row: number` | 一格：相对自身的行 / 列（= 游戏 range_table 的 grids 项），或写成 `[row, col]`。 |
| `AkRangeSize` | `'sm' \| 'md' \| 'lg'` | — |
| `AkRarityLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | — |
| `AkRaritySize` | `'sm' \| 'default' \| 'lg'` | — |
| `AkRichTextNode` | `{ type: 'text'` | 富文本节点：呈现型，不解析任何标记。 |
| `AkRichTextTone` | `'buff' \| 'debuff' \| 'reminder' \| 'keyword' \| 'important' \| 'enemy' \| 'gild' \| 'level' \| 'potential' \| 'term'` | 富文本节点的语义色。 |
| `AkSanVariant` | `'compact' \| 'terminal'` | 容器外观：`compact` 是仪表盘用的浅色卡片，`terminal` 是自适应容器尺寸的大面板。 |
| `AkScopeTheme` | `'terminal' \| 'archive'` | — |
| `AkScreenTone` | `'dark' \| 'paper' \| 'muted' \| 'cyan'` | — |
| `AkScrollAxis` | `'y' \| 'x' \| 'both'` | — |
| `AkSkeletonShape` | `'default' \| 'text' \| 'rect' \| 'square' \| 'circle'` | 上游的单枚占位形状。 `text` 一行文字、`rect` 长块、`square` 方块、`circle` 圆片， 分别发出 `.ak-skeleton--text` / `--rect` / `--square` / `--circle`。 |
| `AkSkewDirection` | `'left' \| 'right'` | — |
| `AkSkillLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 'M1' \| 'M2' \| 'M3'` | — |
| `AkSlotRarity` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | — |
| `AkSlotRole` | `'vanguard' \| 'guard' \| 'defender' \| 'sniper' \| 'caster' \| 'medic' \| 'supporter' \| 'specialist'` | — |
| `AkSpinnerVariant` | `'default' \| 'ripple' \| 'bars'` | 加载指示器的形态档位。 `default` 是本库的方舟方框（`.ak-loading`），`ripple` 是上游的菱形涟漪 （`.ak-spinner`），`bars` 是上游的三根跳条（`.ak-loader`）。 |
| `AkSpTriggerType` | `'manual' \| 'auto'` | 触发方式：手动触发 / 自动触发。 |
| `AkSpType` | `'auto' \| 'attack' \| 'hit' \| 'passive-recovery' \| 'passive'` | 技力回复方式：自动回复 · 攻击回复 · 受击回复 · 被动回复 · 被动。 |
| `AkSpValueKind` | `'cost' \| 'init' \| 'duration'` | SP 数值芯片的种类：消耗 / 初始 / 持续。 |
| `AkStageCodeVariant` | `'default' \| 'hard'` | — |
| `AkStageVariant` | `'default' \| 'hard' \| 'ex' \| 'story'` | — |
| `AkStatTrend` | `'up' \| 'down'` | — |
| `AkStatusVariant` | `'default' \| 'warning' \| 'critical' \| 'offline'` | — |
| `AkStepStatus` | `'wait' \| 'active' \| 'done'` | 步骤与浮动作族组件 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki） https://github.com/MooncellWiki/prts-design 覆盖：步骤条（AkSteps / AkStep）与回到顶部（AkBackTop）。 |
| `AkStripesVariant` | `'default' \| 'strong' \| 'warning' \| 'danger' \| 'hazard'` | — |
| `AkTableSortDirection` | `'ascending' \| 'descending' \| 'none'` | 数据表。 ⚠️ **上游没有表格样式**（全库零 table 类），所以这一组是本库补的。 补的是排布而不是新语汇 —— 每条几何都取自既有规则，见 `_ak-table.scss` 顶部注释。 颜色全走令牌，所以亮/暗两套主题自动跟随。 ⚠️ 刻意**不做虚拟滚动、不做排序逻辑**：这个组件只管结构与样式， 排序/分页/筛选由宿主决定（`sort` 只用于把 `aria-sort` 反映到表头上）。 appica 的 DataTable 是「把组件接到 TanStack Table」的配方，不是组件本身 —— 同理。 |
| `AkTabsVariant` | `'default' \| 'pill' \| 'block' \| 'vertical'` | 形态档位。 `pill` 是一组浮起的药丸，`block` 是底边一条粗线 + 选中黑白反转， `vertical` 是列表在左、面板在右。缺省是本库原有的下划线式标签页。 |
| `AkTagVariant` | `'default' \| 'advanced' \| 'danger' \| 'neutral' \| 'outline' \| 'accent' \| 'accent-soft'` | 标签档位。 - `default` / `advanced` / `danger` / `neutral` 是本库原有的语义档； - `outline` / `accent` / `accent-soft` 是上游 tag.css 的三个色调档 （透明底+强边框 / 信号色实底 / 信号色淡底）。 |
| `AkTimelineStatus` | `'wait' \| 'active' \| 'done'` | — |
| `AkToastVariant` | `'info' \| 'success' \| 'warning' \| 'danger'` | — |
| `AkTokens` | `Record<`--${string}`, string \| number>` | 逐实例令牌覆盖。 键必须是组件样式里真实消费的 CSS 变量（`--ak-*`）。值原样写进 inline style， 所以既可以是任意合法 CSS 值，也可以引用别的令牌（`var(--ak-signal-danger)`）。 这枚 prop 是整套主题系统的**逃生口**：不改 SCSS、不写新 class，就能把任何一个 组件调成宿主需要的形状。组件自己的 `variant` / `size` 仍然优先于它 —— 后者是 语义档位，前者是具体数值。 ```tsx <AkButton tokens={{ '--ak-button-bg': '#ff5e19', '--ak-button-cut': '14px' }} /> ``` |
| `AkTooltipPlacement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | — |
| `AkTooltipTrigger` | `'hover' \| 'focus' \| 'click' \| 'manual'` | — |
| `TactileSoundType` | `'click' \| 'tap' \| 'pip' \| 'toggle' \| 'warn' \| 'denied' \| 'step' \| 'open' \| 'screen_in' \| 'close' \| 'screen_out' \| 'confirm' \| 'action' \| 'elite' \| 'rarity_six' \| 'select' \| 'equip' \| 'tab' \| 'sweep' \| 'tick' \| 'dial'` | — |

## Public data types

Structured values passed to components — item shapes, row shapes, option records.

### AkBreadcrumbItem

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | 显示文字。 |
| `href` | `string` | yes | 链接地址。最后一项（当前页）通常不给。 |
| `current` | `boolean` | yes | 显式标记为当前页（渲染成 `aria-current="page"`）。 一项都没标时，最后一项自动当当前页 —— 同上游的做法。 |

### AkCountUpHandle

| Member | Type | Optional | Description |
| --- | --- | --- | --- |
| `replay` | `() => void` | no | — |

### AkEntranceHandle

| Member | Type | Optional | Description |
| --- | --- | --- | --- |
| `replay` | `() => void` | no | — |

### AkMenuItem

A selectable entry for `AkDropdownMenu` or `AkContextMenu`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | Visible menu label. |
| `onSelect` | `() => void` | yes | Called after selection; the menu closes afterwards. |
| `disabled` | `boolean` | yes | Prevents selection and removes the entry from arrow-key navigation. |
| `destructive` | `boolean` | yes | Applies the library's danger signal to destructive actions. |
| `active` | `boolean` | yes | Marks the entry as the current one (`.ak-menu__item.is-active`). |
| `shortcut` | `ReactNode` | yes | Optional keyboard hint shown at the trailing edge. |

### AkMobileMenuHandle

| Member | Type | Optional | Description |
| --- | --- | --- | --- |
| `open` | `() => void` | no | — |
| `close` | `() => void` | no | — |

### AkNewsListItem

公告 / 新闻列表。 `_ak-news-list.scss` 是这库少数几套**规格完整**的样式表之一（列表容器 + 行链接 + 分类/标题/时间三个字段 + 空态 + 容器查询降级 + reduced-motion），却一直没有组件出口。 这里按样式表的结构原样接出来，几何全部沿用现有令牌，没有新样式。 ⚠️ 几个照样式表来的约束： · 行是三列网格，**列数由 `@container ak-news-list (min-width: 34rem)` 控制**， 容器窄时自动降为单列。所以这个组件自带 `container: ak-news-list / inline-size` （样式表写在根类上），把它放进任何宽度都能自适应。 · `__empty` 是**行级**样式（有 padding）。HTML 规则不允许 `<ul>` 直接放 `<p>`， 所以空态渲染成 `<li class="ak-news-list__empty">` —— 类名照样生效，且文档结构合法。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `category` | `ReactNode` | yes | 分类标签（如「公告」「活动」），走 `__category`。 |
| `title` | `ReactNode` | no | 标题，走 `__title`。 |
| `time` | `ReactNode` | yes | 时间显示文本，走 `__time`。 |
| `dateTime` | `string` | yes | 机器可读的时间（`<time datetime>`）。给了就按 `<time>` 渲染， 方便读屏与抓取；只给 `time` 而无 `dateTime` 时退化为普通文本。 |
| `href` | `string` | yes | 链接地址。给了就渲染 `<a>`。 |
| `onSelect` | `() => void` | yes | 点击回调。**不给 href 时**行仍可点（渲染为 `role="button"` 的 div），不会变成死的假链接。 |
| `external` | `boolean` | yes | `href` 是否新窗口打开；会自动补 `rel="noreferrer noopener"`。 |

### AkSectionNavigatorHandle

| Member | Type | Optional | Description |
| --- | --- | --- | --- |
| `navigate` | `(id: string) => void` | no | — |

### AkSegmentedOption

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | 显示内容。 |
| `value` | `string` | no | 选项值。 |
| `icon` | `ReactNode` | yes | 前置图标。 |
| `badge` | `ReactNode` | yes | 后置角标。 |
| `disabled` | `boolean` | yes | 是否禁用。 |

### AkSkillAlias

技能名后的别名：英文名（Bender 大写）+ 日文名。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `en` | `string` | yes | 英文名。 |
| `ja` | `string` | yes | 日文名。 |

### AkSkillMatrixRenderContext

描述渲染函数拿到的上下文。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `number` | yes | 当前预览 / 钉住的等级（1–10）；没有时 `undefined`。 |
| `value` | `(key: string) => string` | no | 取某一行的区间 / 当级取值。 |
| `Var` | `(key: string) => ReactNode` | no | 画一个变量位（`.ak-var`）：给 `key` 就能拿到此刻该显示的字。 |

### AkSkillMatrixRow

矩阵的一行：一个参数在各级的值。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `key` | `string` | yes | 描述模板里的占位符名（`{key}`）；写了这一行就对应描述里的一个变量位。 |
| `label` | `string` | no | 参数名（「伤害倍率」「晕眩（秒）」）。 |
| `sp` | `AkSpValueKind` | yes | 用 SP 芯片当参数名：初始 · 消耗 · 持续。 |
| `values` | `(number \| string)[]` | no | 各级的值（「200%」）：第 i 项 = 等级 i+1，第 8–10 项 = 专精 Ⅰ–Ⅲ。 |

### AkSkillSheetLevel

一个技能等级（第 i 项 = 等级 i+1，第 8–10 项 = 专精 Ⅰ–Ⅲ）。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `description` | `ReactNode` | no | 描述（宿主自己渲染的 React 节点）。 |
| `init` | `number \| string` | yes | 初始技力。 |
| `cost` | `number \| string` | yes | 技力消耗。 |
| `duration` | `number \| string` | yes | 持续时间（秒）；没有就空着（表里显示「—」）。 |

### AkTableColumn

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `key` | `string` | no | 列键，与行数据的 key 对应。 |
| `header` | `ReactNode` | no | 表头文字。 |
| `numeric` | `boolean` | yes | 数字列：等宽数位 + 右对齐（`.ak-table__cell--num` 与上游的 `.num` 同义）。 |
| `sort` | `AkTableSortDirection` | yes | 该列当前排序方向；给了就把表头变成可点的排序表头。 |
| `onSortChange` | `(key: string) => void` | yes | 点表头排序时回调（配合 `sort` 使用）。 |
| `width` | `string` | yes | 列宽。 |

### AkTableRow

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `id` | `string` | no | 行标识，作为 React key。 |
| `cells` | `Record<string, ReactNode>` | no | 每列内容，按 column.key 取。 |
| `selected` | `boolean` | yes | 选中态：左缘信号色 + 淡底。 |
| `muted` | `boolean` | yes | 失效/不可用：整行压淡。 |

### AkTabsItem

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `description` | `ReactNode` | yes | 描述文字。 |
| `eyebrow` | `ReactNode` | yes | 小标文字。 |
| `label` | `string` | no | 标签文本。 |
| `title` | `ReactNode` | no | 标题节点。 |
| `value` | `string` | no | 唯一值标识。 |
| `icon` | `ReactNode` | yes | 标签前置图标。 |
| `badge` | `ReactNode` | yes | 标签后置角标。 |
| `disabled` | `boolean` | yes | 是否禁用。 |

### AkTalentRequirement

一条解锁条件：图标 + 字。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | 图标（宿主自己的 `<img src=… />`）。 |
| `text` | `string` | no | 「精英二 · 1级」「潜能5」。 |

### AkTalentRow

天赋表的一行：一个条件下的效果。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `name` | `string` | no | 天赋名；相邻几行同名时合并成一格。 |
| `condition` | `ReactNode` | yes | 条件（「精英二 · Y模组 2级」）。 |
| `description` | `ReactNode` | no | 描述。 |
| `potential` | `ReactNode` | yes | 潜能加成后的描述；不写就没有潜能版。 |

### AkVoiceLanguage

语种选项（音频差分，单选，带 CV 名）。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `string` | no | 语种键。 |
| `label` | `string` | no | 语种名。 |
| `cv` | `string` | yes | CV 名。 |

### AkVoiceText

文本语言选项（台词的语言，多选）。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `value` | `string` | no | 文本键。 |
| `label` | `string` | no | 文本名。 |

