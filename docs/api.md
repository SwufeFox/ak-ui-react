# API reference

> **Generated file — do not edit by hand.** Run `npm run build:api` (or `npm run build`,
> which calls it) to regenerate from the JSDoc in `dist/ui/**/*.d.ts`.

Every component and its props. `?` marks an optional prop. Props inherited from
React's `HTMLAttributes` are not repeated here — they pass through unchanged.

## Index

- [`AkAssetLoader`](#akassetloader) · [`AkAttr`](#akattr) · [`AkAttrs`](#akattrs) · [`AkAvatar`](#akavatar)
- [`AkAvatarGroup`](#akavatargroup) · [`AkBackdrop`](#akbackdrop) · [`AkBilingual`](#akbilingual) · [`AkBlueBand`](#akblueband)
- [`AkBrackets`](#akbrackets) · [`AkBreadcrumb`](#akbreadcrumb) · [`AkButton`](#akbutton) · [`AkButtonGroup`](#akbuttongroup)
- [`AkCard`](#akcard) · [`AkCardContent`](#akcardcontent) · [`AkCardDescription`](#akcarddescription) · [`AkCardFooter`](#akcardfooter)
- [`AkCardHeader`](#akcardheader) · [`AkCardTitle`](#akcardtitle) · [`AkChevrons`](#akchevrons) · [`AkChoice`](#akchoice)
- [`AkCodeId`](#akcodeid) · [`AkCollapsible`](#akcollapsible) · [`AkCommand`](#akcommand) · [`AkCommandGrid`](#akcommandgrid)
- [`AkCommandGroup`](#akcommandgroup) · [`AkContextMenu`](#akcontextmenu) · [`AkCorner`](#akcorner) · [`AkCounter`](#akcounter)
- [`AkCut`](#akcut) · [`AkDepth`](#akdepth) · [`AkDepthLayer`](#akdepthlayer) · [`AkDialog`](#akdialog)
- [`AkDisplay`](#akdisplay) · [`AkDivider`](#akdivider) · [`AkDropdownMenu`](#akdropdownmenu) · [`AkElite`](#akelite)
- [`AkEn`](#aken) · [`AkField`](#akfield) · [`AkFieldLabel`](#akfieldlabel) · [`AkFormStack`](#akformstack)
- [`AkGauge`](#akgauge) · [`AkGlow`](#akglow) · [`AkGlyph`](#akglyph) · [`AkGlyphBox`](#akglyphbox)
- [`AkGrain`](#akgrain) · [`AkGridBackdrop`](#akgridbackdrop) · [`AkHalftone`](#akhalftone) · [`AkInput`](#akinput)
- [`AkInputNumber`](#akinputnumber) · [`AkInverse`](#akinverse) · [`AkKv`](#akkv) · [`AkKvItem`](#akkvitem)
- [`AkLevel`](#aklevel) · [`AkMediaGallery`](#akmediagallery) · [`AkMenuGroup`](#akmenugroup) · [`AkMenuSeparator`](#akmenuseparator)
- [`AkMenubar`](#akmenubar) · [`AkMosaic`](#akmosaic) · [`AkMotion`](#akmotion) · [`AkNotice`](#aknotice)
- [`AkNum`](#aknum) · [`AkOutline`](#akoutline) · [`AkOverline`](#akoverline) · [`AkPagination`](#akpagination)
- [`AkParticleField`](#akparticlefield) · [`AkPopover`](#akpopover) · [`AkPot`](#akpot) · [`AkPotList`](#akpotlist)
- [`AkPotential`](#akpotential) · [`AkProfession`](#akprofession) · [`AkProfessionLabel`](#akprofessionlabel) · [`AkProgress`](#akprogress)
- [`AkRarity`](#akrarity) · [`AkRarityBar`](#akraritybar) · [`AkRarityChip`](#akraritychip) · [`AkRarityScope`](#akrarityscope)
- [`AkSan`](#aksan) · [`AkSanContainer`](#aksancontainer) · [`AkScrollArea`](#akscrollarea) · [`AkSegmented`](#aksegmented)
- [`AkSelect`](#akselect) · [`AkSkeleton`](#akskeleton) · [`AkSkew`](#akskew) · [`AkSkillLevels`](#akskilllevels)
- [`AkSlider`](#akslider) · [`AkSpec`](#akspec) · [`AkSpinner`](#akspinner) · [`AkStatus`](#akstatus)
- [`AkStatusGroup`](#akstatusgroup) · [`AkStripes`](#akstripes) · [`AkTable`](#aktable) · [`AkTabs`](#aktabs)
- [`AkTag`](#aktag) · [`AkTagGroup`](#aktaggroup) · [`AkTextarea`](#aktextarea) · [`AkThumbnail`](#akthumbnail)
- [`AkToolbar`](#aktoolbar) · [`AkTrust`](#aktrust) · [`AkVignette`](#akvignette) · [`AkWatermark`](#akwatermark)

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
| `size` | `AkAvatarSize` | yes | — |
| `cut` | `boolean` | yes | 右上角切角（复用全局 `--ak-cut`）。 |
| `accent` | `boolean` | yes | 信号色描边（在线/告警那种）。 |
| `muted` | `boolean` | yes | 压淡（离线/失效）。 |

## AkAvatarGroup

Extends `HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

## AkBackdrop

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `strength` | `AkBackdropStrength` | yes | `light` 对齐上游 dialog 的 3px；`heavy` 12px，用于整层覆盖。 |
| `blur` | `number` | yes | 直接给模糊半径，覆盖 `strength`。 |
| `surface` | `string` | yes | 玻璃底色。默认取 `--ak-surface-raised`。 |
| `children` | `ReactNode` | yes | 子内容。 |

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

## AkButton

Extends `ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | Renders a leading inline-start icon slot. |
| `block` | `boolean` | yes | Stretches the button to the full width of its container. |
| `variant` | `AkButtonVariant` | yes | 外观档位：default / outline / action / advanced / light。 |

## AkButtonGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkButtonGroupVariant` | yes | — |
| `children` | `ReactNode` | yes | — |

## AkCard

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | Element to render as, e.g. 'div' \| 'article' \| 'section' \| 'li'. |
| `variant` | `AkCardVariant` | yes | 外观档位：default / outline / stripe / place。 |

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

## AkChevrons

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `href` | `string` | yes | 传 href 时渲染成链接，悬停箭头右移。 |

## AkChoice

Extends `InputHTMLAttributes<HTMLInputElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkChoiceVariant` | yes | 外观：勾选框 / 单选圆点 / 开关滑块。样式表里对应 `.ak-choice--radio` / `--switch`。 |
| `children` | `ReactNode` | yes | 控件右侧的文字。 |
| `name` | `string` | yes | 输入控件的 `name`（单选组需要）。 |

## AkCodeId

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

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
| `badge` | `ReactNode` | yes | 右上角角标（`.ak-command__badge`，橙底深字）。 |
| `current` | `ReactNode` | yes | 右上/中部当前值徽标（`.ak-command__current`）。 |
| `watermark` | `ReactNode` | yes | 背景水印（`.ak-command__watermark`，旋转 -5°、透明度 .17）。 |
| `tone` | `AkCommandTone` | yes | 色调。 |
| `layout` | `AkCommandLayout` | yes | 布局。 |
| `pressed` | `boolean` | yes | 选中态。**注意样式表认的是 `aria-pressed="true"` 而不是类** （`.ak-command[aria-pressed="true"]::before`）→ 底部的信号色条由它驱动。 |
| `as` | `ElementType` | yes | 渲染成什么标签。默认 `button`（样式表自带 cursor:pointer 与 focus-visible 态）。 |
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

## AkCorner

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `large` | `boolean` | yes | 大号角标（18px 直角边）。 |
| `position` | `AkCornerPosition` | yes | 角标在哪个角：`tl`（默认）或 `tr`。 |
| `tone` | `AkCornerTone` | yes | 角标色调：`info`（默认）/ `yellow` / `red`。 |

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
| `open` | `boolean` | no | 受控开合。 |
| `onOpenChange` | `(open: boolean) => void` | yes | 开合变化回调。Esc 与点击遮罩关闭时也会触发（原生 dialog 的 cancel/close 事件）。 |
| `eyebrow` | `ReactNode` | yes | 顶部小标与标题，对应样式表的 `__eyebrow` / `__title`。 |
| `title` | `ReactNode` | yes | — |
| `footer` | `ReactNode` | yes | 底部操作区。 |
| `closeOnBackdrop` | `boolean` | yes | 点遮罩是否关闭。默认 true。 |
| `disableEscape` | `boolean` | yes | 是否禁用 Esc 关闭。默认 false。 |
| `children` | `ReactNode` | yes | — |

## AkDisplay

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `xl` | `boolean` | yes | 最大号展示字（落地页 / 区块主标题）。 |

## AkDivider

分组与分隔组件。 这三样**上游 SCSS 早已写好**（`.ak-divider` / `.ak-button-group` / `.ak-tag-group` / `.ak-status-group`），但一直没有 React 组件暴露它们 —— 属于「有实现、没出口」。 本文件只做包装，不新增任何样式。

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | 居中的标签或图标。不传则只有两条不同宽度的横线。 |

## AkDropdownMenu

Props for the native-popover dropdown menu.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | no | Trigger label. |
| `items` | `readonly AkMenuItem[]` | no | Menu entries, rendered in order. |
| `className` | `string` | yes | Extra class for the trigger-and-menu wrapper. |

## AkElite

Extends `Omit<SpanProps, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `level` | `0 \| 1 \| 2` | no | 精英阶段 0 / 1 / 2。 |
| `icon` | `ReactNode` | yes | 精英图标，通常是宿主传入的图片。 |
| `large` | `boolean` | yes | 大号。 |

## AkEn

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## AkField

表单控件。 这一组同样是「上游 SCSS 早已写好、但没有 React 组件」： `.ak-field` / `.ak-label` / `.ak-input` / `.ak-textarea` / `.ak-select` / `.ak-choice` 在 `_ak-form.scss` 里是完整的（含 focus 环、invalid 态、disabled 态、勾选框的 对勾绘制、开关滑块），只是从没被暴露出来。本文件只做包装，不加新样式。 `ak-choice` 的三种外观由样式表的 `&--radio` / `&--switch` 决定， 所以这里也照搬那三个类名，而不是另起一套。

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | 字段内的控件。 |
| `hint` | `ReactNode` | yes | 字段下方的提示或错误文字。 |
| `invalid` | `boolean` | yes | 给出错误时把提示标成错误态，并把信号色接到字段上。 |
| `className` | `string` | yes | — |

## AkFieldLabel

Extends `LabelHTMLAttributes<HTMLLabelElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

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
| `variant` | `AkGaugeVariant` | yes | 外观档位。 |

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

## AkInput

Extends `InputHTMLAttributes<HTMLInputElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | 无障碍名；未给 `id` 与外部标签时用它。 |

## AkInputNumber

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max' | 'step'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | 无障碍名，读屏会念。默认「数值」。 |
| `increaseLabel` | `string` | yes | 增加按钮的无障碍名。默认「增加」。 |
| `decreaseLabel` | `string` | yes | 减少按钮的无障碍名。默认「减少」。 |
| `max` | `number` | yes | 允许的最大值。 |
| `maxLabel` | `string` | yes | 「最大」按钮文字。 |
| `min` | `number` | yes | 允许的最小值。 |
| `minLabel` | `string` | yes | 「最小」按钮文字。 |
| `step` | `number` | yes | 每次增减的步长。 |
| `value` | `number` | yes | 当前值；越界会立刻写回夹紧值。 |
| `onValueChange` | `(value: number) => void` | yes | 值变化时回调。 |

## AkInverse

Extends `SlotProps<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

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

## AkLevel

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes | 上方的标签文字（`.ak-level__label`，样式表默认值是 `OPERATION`）。 |
| `children` | `ReactNode` | yes | 主内容，通常是等级数字或关卡代号。 |
| `prefixIcon` | `ReactNode` | yes | 内容前的图标位（`.ak-level__prefix-icon`）。 |

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

## AkMenuSeparator

_(no props of its own)_

## AkMenubar

Props for the ARIA menubar container. Its child controls should use role="menuitem".

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Menu item controls. |

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

## AkNotice

Extends `Omit<HTMLAttributes<HTMLElement>, 'title'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `code` | `ReactNode` | yes | Registry-style routing code shown in the left gutter. |
| `role` | `'alert' \| 'status'` | yes | Overrides the semantic role derived from `variant`. |
| `title` | `ReactNode` | yes | 通知标题。 |
| `variant` | `AkNoticeVariant` | yes | 语义档位，决定左侧色条与路由码颜色。 |

## AkNum

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

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

## AkParticleField

Extends `ParticleOptions`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

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
| `variant` | `AkProgressVariant` | yes | 外观档位。 |

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

## AkScrollArea

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `axis` | `AkScrollAxis` | yes | 哪个方向可滚。默认 `y`。 |
| `maxHeight` | `string` | yes | `y` / `both` 时的最大高度，默认 20rem（令牌 `--ak-scroll-max`）。 |
| `children` | `ReactNode` | yes | — |

## AkSegmented

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | yes | 读屏标签，默认 `Options`。 |
| `options` | `AkSegmentedOption[]` | no | 选项列表，每项 `label` + `value`。 |
| `value` | `string` | yes | 当前选中值；不匹配时回退第一项。 |
| `onValueChange` | `(value: string) => void` | yes | 选中变化时回调。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkSelect

Extends `SelectHTMLAttributes<HTMLSelectElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | — |
| `children` | `ReactNode` | yes | — |

## AkSkeleton

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'block' \| 'track'` | yes | 占位形状。`text` 一行高，`block` 一个方块，`track` 用上游的进度轨占位。 |
| `lines` | `number` | yes | 行数（仅 `text`）。 |
| `width` | `string` | yes | — |
| `height` | `string` | yes | — |

## AkSkew

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `direction` | `AkSkewDirection` | yes | 倾斜方向：left = -10deg，right = +10deg。 |

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

## AkSlider

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | no | Accessible name for the range input. |
| `min` | `number` | yes | 区间下限。 |
| `max` | `number` | yes | 区间上限。 |
| `step` | `number` | yes | 步长。 |
| `value` | `number` | no | 当前值。 |
| `onValueChange` | `(value: number) => void` | yes | 拖动时回调。 |

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

## AkStatus

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `detail` | `ReactNode` | yes | Secondary text shown after the signal label. |
| `label` | `ReactNode` | yes | Primary label. Falls back to `Online`, matching the original registry component. |
| `variant` | `AkStatusVariant` | yes | 语义档位。 |

## AkStatusGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

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
| `columns` | `AkTableColumn[]` | no | — |
| `rows` | `AkTableRow[]` | no | — |
| `footer` | `Record<string, ReactNode>` | yes | 表尾汇总行（与 columns 对齐）。 |
| `emptyLabel` | `ReactNode` | yes | 无数据时的占位文字。 |
| `scrollable` | `boolean` | yes | 外层是否套一层横滑容器（列多时建议开）。 |

## AkTabs

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | yes | 读屏标签，默认 `Tabs`。 |
| `items` | `AkTabsItem[]` | no | 标签列表；每项含 `value` / `label` / `title`。 |
| `value` | `string` | yes | Active tab value. Falls back to the first item when unmatched. |
| `onValueChange` | `(value: string) => void` | yes | 切换时回调。 |
| `renderPanel` | `(item: AkTabsItem) => ReactNode` | yes | Per-panel content, keyed by tab value. |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkTag

Extends `HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `variant` | `AkTagVariant` | yes | 语义档位。 |

## AkTagGroup

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — |

## AkTextarea

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | — |

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

## AkToolbar

Props for the ARIA toolbar.

Extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | no | Accessible name required for the toolbar landmark. |
| `children` | `ReactNode` | no | Toolbar controls. |

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

## AkWatermark

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |

## Additional prop types

Interfaces not bound to a single exported function (slot components, variants).

## AkCountUpProps

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

## AkEntranceProps

Extends `EntranceOptions`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `autoplay` | `boolean` | yes | 挂载后自动播放。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `children` | `React.ReactNode` | yes | 子内容。 |

## AkMobileMenuProps

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | 触发按钮与对话框的读屏名，默认 `Menu`。 |
| `closeLabel` | `string` | yes | 关闭按钮文字，默认 `Close menu`。 |
| `children` | `React.ReactNode` | yes | 子内容。 |

## AkSectionNavigatorProps

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `syncHash` | `boolean` | yes | 是否把当前区块写进地址栏 hash。 |
| `duration` | `number` | yes | 切换动画时长（毫秒）。 |
| `onChange` | `(id: string, index: number) => void` | yes | 切换时回调，给出区块 id 与序号。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |
| `children` | `React.ReactNode` | yes | 视口内容；必须含 `[data-ak-section-viewport]` 与带唯一 id 的区块。 |

