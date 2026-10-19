# API reference

> **Generated file — do not edit by hand.** Run `npm run build:api` (or `npm run build`,
> which calls it) to regenerate from the JSDoc in `dist/ui/**/*.d.ts`.

Every component and its props. `?` marks an optional prop. Props inherited from
React's `HTMLAttributes` are not repeated here — they pass through unchanged.

## Index

- [`AkAssetLoader`](#akassetloader) · [`AkAttr`](#akattr) · [`AkAttrs`](#akattrs) · [`AkBackdrop`](#akbackdrop)
- [`AkBilingual`](#akbilingual) · [`AkBlueBand`](#akblueband) · [`AkBrackets`](#akbrackets) · [`AkButton`](#akbutton)
- [`AkCard`](#akcard) · [`AkCardContent`](#akcardcontent) · [`AkCardDescription`](#akcarddescription) · [`AkCardFooter`](#akcardfooter)
- [`AkCardHeader`](#akcardheader) · [`AkCardTitle`](#akcardtitle) · [`AkChevrons`](#akchevrons) · [`AkCodeId`](#akcodeid)
- [`AkCorner`](#akcorner) · [`AkCut`](#akcut) · [`AkDepth`](#akdepth) · [`AkDepthLayer`](#akdepthlayer)
- [`AkDisplay`](#akdisplay) · [`AkElite`](#akelite) · [`AkEn`](#aken) · [`AkGauge`](#akgauge)
- [`AkGlow`](#akglow) · [`AkGlyph`](#akglyph) · [`AkGlyphBox`](#akglyphbox) · [`AkGrain`](#akgrain)
- [`AkGridBackdrop`](#akgridbackdrop) · [`AkHalftone`](#akhalftone) · [`AkInputNumber`](#akinputnumber) · [`AkInverse`](#akinverse)
- [`AkKv`](#akkv) · [`AkKvItem`](#akkvitem) · [`AkMediaGallery`](#akmediagallery) · [`AkMosaic`](#akmosaic)
- [`AkMotion`](#akmotion) · [`AkNotice`](#aknotice) · [`AkNum`](#aknum) · [`AkOutline`](#akoutline)
- [`AkOverline`](#akoverline) · [`AkParticleField`](#akparticlefield) · [`AkPot`](#akpot) · [`AkPotList`](#akpotlist)
- [`AkPotential`](#akpotential) · [`AkProfession`](#akprofession) · [`AkProfessionLabel`](#akprofessionlabel) · [`AkProgress`](#akprogress)
- [`AkRarity`](#akrarity) · [`AkRarityBar`](#akraritybar) · [`AkRarityChip`](#akraritychip) · [`AkRarityScope`](#akrarityscope)
- [`AkSegmented`](#aksegmented) · [`AkSkew`](#akskew) · [`AkSkillLevels`](#akskilllevels) · [`AkSlider`](#akslider)
- [`AkSpec`](#akspec) · [`AkStatus`](#akstatus) · [`AkStripes`](#akstripes) · [`AkTabs`](#aktabs)
- [`AkTag`](#aktag) · [`AkTrust`](#aktrust) · [`AkVignette`](#akvignette) · [`AkWatermark`](#akwatermark)

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
| `as` | `ElementType` | yes | — |

## AkBrackets

_(no props of its own)_

## AkButton

Extends `ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | Renders a leading inline-start icon slot. |
| `block` | `boolean` | yes | Stretches the button to the full width of its container. |
| `variant` | `AkButtonVariant` | yes | 外观档位：default / outline / action / advanced / light。 |

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
| `as` | `ElementType` | yes | — |
| `href` | `string` | yes | 传 href 时渲染成链接，悬停箭头右移。 |

## AkCodeId

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | — |

## AkCorner

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `large` | `boolean` | yes | 大号角标（18px 直角边）。 |
| `position` | `AkCornerPosition` | yes | 角标在哪个角：`tl`（默认）或 `tr`。 |
| `tone` | `AkCornerTone` | yes | 角标色调：`info`（默认）/ `yellow` / `red`。 |

## AkCut

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | — |
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

## AkDisplay

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | 渲染成什么标签，例如 `div` / `span` / `section`。默认见组件签名。 |
| `xl` | `boolean` | yes | 最大号展示字（落地页 / 区块主标题）。 |

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
| `as` | `ElementType` | yes | — |

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
| `as` | `ElementType` | yes | — |

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
| `as` | `ElementType` | yes | — |
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
| `as` | `ElementType` | yes | — |

## AkOutline

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | — |
| `color` | `string` | yes | 轮廓色。默认灰色。 |

## AkOverline

Extends `SlotProps<HTMLSpanElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | — |

## AkParticleField

Extends `ParticleOptions`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `className` | `string` | yes | — |

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

## AkSegmented

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | yes | 读屏标签，默认 `Options`。 |
| `options` | `AkSegmentedOption[]` | no | 选项列表，每项 `label` + `value`。 |
| `value` | `string` | yes | 当前选中值；不匹配时回退第一项。 |
| `onValueChange` | `(value: string) => void` | yes | 选中变化时回调。 |
| `className` | `string` | yes | 附加类名，会拼到组件的 BEM 根类之后。 |

## AkSkew

Extends `HTMLAttributes<HTMLElement>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | yes | — |
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

## AkStatus

Extends `Omit<HTMLAttributes<HTMLSpanElement>, 'children'>`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `detail` | `ReactNode` | yes | Secondary text shown after the signal label. |
| `label` | `ReactNode` | yes | Primary label. Falls back to `Online`, matching the original registry component. |
| `variant` | `AkStatusVariant` | yes | 语义档位。 |

## AkStripes

Extends `DivProps`.

| Prop | Type | Optional | Description |
| --- | --- | --- | --- |
| `bar` | `boolean` | yes | 条纹高度，默认 6px（等同上游 .ak-stripe-bar）。 |
| `variant` | `AkStripesVariant` | yes | 斜纹类型：default / strong / warning / danger / hazard。 |

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
| `as` | `ElementType` | yes | — |

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

