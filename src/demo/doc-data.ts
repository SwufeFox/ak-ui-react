import type { Locale } from './i18n'

export interface BlockPropDoc {
  name: string
  type: string
  default?: string
  desc: Record<Locale, string>
}

export interface BlockDoc {
  api: BlockPropDoc[]
}

const localizedDescription = (zhCN: string, en: string): Record<Locale, string> => ({
  'zh-CN': zhCN,
  en,
})

export const DOC_REGISTRY: Record<string, BlockDoc> = {
  'components-1': {
    api: [
      { name: 'variant', type: "'default' | 'outline' | 'action' | 'advanced' | 'light' | 'danger' | 'ghost'", default: "'default'", desc: localizedDescription('外观样式档位，决定底色与强调信号（danger 为紧急撤退红，ghost 为高透 HUD 按钮）', 'Visual style that sets the surface and signal treatment (danger uses retreat red; ghost is a translucent HUD button).') },
      { name: 'chamfer', type: 'boolean', default: 'false', desc: localizedDescription('是否开启右上角 10px 战术斜切角', 'Whether to cut a 10px tactical chamfer from the top-right corner.') },
      { name: 'subtitle', type: 'ReactNode', desc: localizedDescription('副标题 / 战术代号（大写等宽小字，常用于双语排版如「部署 // DEPLOY」）', 'Secondary label or call sign, usually set in small uppercase monospace text (for example, “DEPLOY”).') },
      { name: 'icon', type: 'ReactNode', desc: localizedDescription('前置图标节点插槽', 'Content slot for a leading icon.') },
      { name: 'block', type: 'boolean', default: 'false', desc: localizedDescription('是否撑满父容器 100% 宽度', 'Whether the button fills its container width.') },
      { name: 'disabled', type: 'boolean', default: 'false', desc: localizedDescription('原生禁用状态，带置灰与禁止光标', 'Uses the native disabled state with muted styling and a disabled cursor.') },
      { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", desc: localizedDescription('原生按钮类型', 'Native button type.') },
    ],
  },

  'components-2': {
    api: [
      { name: 'label', type: 'ReactNode', desc: localizedDescription('下拉菜单触发器按钮的显示内容', 'Content displayed by the dropdown trigger button.') },
      { name: 'items', type: 'readonly AkMenuItem[]', desc: localizedDescription('菜单条目数组（含 label, onSelect, disabled, destructive, shortcut）', 'Menu items with label, onSelect, disabled, destructive, and shortcut fields.') },
      { name: 'className', type: 'string', desc: localizedDescription('触发器与菜单容器的附加类名', 'Additional class name for the trigger and menu container.') },
    ],
  },

  'components-3': {
    api: [
      { name: 'as', type: 'ElementType', default: "'div'", desc: localizedDescription('底层渲染的 HTML 标签（如 article, section）', 'HTML element used to render the card (for example, article or section).') },
      { name: 'variant', type: "'default' | 'outline' | 'stripe' | 'place' | 'tactical' | 'glass' | 'chassis'", default: "'default'", desc: localizedDescription('卡片外观风格：默认复合面板、线框、斑马纹、放置槽、4角准星终端、亚克力毛玻璃或重型装甲机匣', 'Card treatment: standard panel, outline, stripe, placement slot, four-corner tactical, acrylic glass, or armored chassis.') },
      { name: 'chamfer', type: 'boolean', default: 'false', desc: localizedDescription('是否开启右上角 45° 战术斜切角', 'Whether to cut a 45° tactical chamfer from the top-right corner.') },
      { name: 'hoverable', type: 'boolean', default: 'false', desc: localizedDescription('是否开启悬停微浮与辉光动效', 'Whether the card lifts slightly and glows on hover.') },
      { name: 'interactive', type: 'boolean', default: 'false', desc: localizedDescription('是否为可交互卡片（带点击反馈与焦点管理）', 'Whether the card is interactive, with click feedback and focus handling.') },
      { name: 'children', type: 'ReactNode', desc: localizedDescription('卡片主体或槽位组件', 'Card content or slot components.') },
    ],
  },

  'components-4': {
    api: [
      { name: 'title', type: 'ReactNode', desc: localizedDescription('公告或通知卡片的主标题', 'Main heading for the notice card.') },
      { name: 'code', type: 'ReactNode', desc: localizedDescription('左侧等宽技术状态代码（如 SEC.04）', 'Monospace status code shown on the left (for example, SEC.04).') },
      { name: 'variant', type: "'info' | 'warning' | 'danger' | 'success'", default: "'info'", desc: localizedDescription('状态信号颜色档位', 'Status signal color variant.') },
      { name: 'value', type: 'number', desc: localizedDescription('进度或计量当前数值', 'Current progress or meter value.') },
      { name: 'max', type: 'number', default: '100', desc: localizedDescription('进度或计量上限值', 'Maximum progress or meter value.') },
    ],
  },

  'components-5': {
    api: [
      { name: 'value', type: 'number | string', desc: localizedDescription('受控当前值：AkSlider / AkInputNumber 为 number，AkSegmented 为 string；省略时进入非受控模式', 'Controlled value: number for AkSlider / AkInputNumber, string for AkSegmented; omit for uncontrolled mode.') },
      { name: 'defaultValue', type: 'number | string', desc: localizedDescription('非受控模式下的初始值，value 存在时忽略', 'Initial value in uncontrolled mode; ignored when value is defined.') },
      { name: 'onValueChange', type: '(value: number) => void / (value: string) => void', desc: localizedDescription('值变化回调（AkSlider / AkInputNumber 回传 number，AkSegmented 回传 string）；受控与非受控模式都会触发', 'Called with the next value in both modes: number for AkSlider / AkInputNumber, string for AkSegmented.') },
      { name: 'min / max', type: 'number', desc: localizedDescription('滑动条或数字步进器的范围极值', 'Lower and upper bounds for the slider or number stepper.') },
      { name: 'options', type: 'AkSegmentedOption[]', desc: localizedDescription('分段控制器的选项清单，每项含 label 与 value', 'Segmented-control options; each item carries a label and a value.') },
    ],
  },

  'components-6': {
    api: [
      { name: 'items', type: 'readonly AkTabsItem[]', desc: localizedDescription('标签项数组；每项必需包含 value、label、title，可选 description', 'Tab items; each requires value, label, and title, with an optional description.') },
      { name: 'value', type: 'string', desc: localizedDescription('当前激活标签页的受控 value 值', 'Value of the currently active tab.') },
      { name: 'onValueChange', type: '(value: string) => void', desc: localizedDescription('切换标签页时以新 value 调用', 'Called with the new value when the active tab changes.') },
      { name: 'ariaLabel', type: 'string', desc: localizedDescription('标签栏无障碍名称', 'Accessible name for the tab list.') },
    ],
  },

  'components-7': {
    api: [
      { name: 'ref', type: 'Ref<AkEntranceHandle>', desc: localizedDescription('进场动画句柄，通过 replay() 可重新播放入场动效', 'Entrance animation handle; call replay() to play the entrance again.') },
      { name: 'value', type: 'number', desc: localizedDescription('AkCountUp 目标数值', 'Target value displayed by AkCountUp.') },
      { name: 'duration', type: 'number', default: '600', desc: localizedDescription('数字滚动动画持续毫秒数', 'Duration of the count-up animation, in milliseconds.') },
      { name: 'threeD', type: 'boolean', default: 'false', desc: localizedDescription('AkDepth 是否启用倾斜透视立体位移', 'Whether AkDepth applies perspective tilt and 3D displacement.') },
    ],
  },

  'components-8': {
    api: [
      { name: 'items', type: 'GalleryItem[]', desc: localizedDescription('画廊条目数组；每项必须含 id，可选 title / description / image / alt', 'Gallery items; each requires an id and accepts title, description, image, and alt.') },
      { name: 'value', type: 'number', desc: localizedDescription('受控当前焦点索引；省略时为非受控', 'Controlled active image index; omit for uncontrolled use.') },
      { name: 'onValueChange', type: '(index: number) => void', desc: localizedDescription('切换画廊相片时的回调', 'Called with the new image index when the gallery selection changes.') },
      { name: 'src', type: 'string', desc: localizedDescription('拍立得倾斜相册图片的地址', 'Image URL displayed by the tilted polaroid album.') },
    ],
  },

  'components-9': {
    api: [
      { name: 'tasks', type: 'readonly AssetTask[]', desc: localizedDescription('资源预加载异步任务集合', 'Asynchronous tasks used to preload assets.') },
      { name: 'label', type: 'string', default: "'Resources'", desc: localizedDescription('加载状态行前缀名称', 'Prefix shown beside the loading status.') },
      { name: 'retryLabel', type: 'string', default: "'Retry'", desc: localizedDescription('失败时重试按钮文字', 'Text for the retry button shown after a failure.') },
      { name: 'onChange', type: '(state: AssetState) => void', desc: localizedDescription('加载状态流转回调', 'Called when the loading state changes.') },
    ],
  },

  'components-10': {
    api: [
      { name: 'children', type: 'React.ReactNode', desc: localizedDescription('视口内容；必须包含 [data-ak-section-viewport] 视口元素及带唯一 id 的区块（可选，但缺失视口时控制器会抛错）', 'Viewport content; must include a [data-ak-section-viewport] element and sections with unique IDs (optional, but the controller throws without a viewport).') },
      { name: 'syncHash', type: 'boolean', default: 'true', desc: localizedDescription('是否将当前区块写入 URL hash', 'Whether to write the current section to the URL hash.') },
      { name: 'duration', type: 'number', default: '650', desc: localizedDescription('区块切换动画时长，单位毫秒', 'Section transition duration, in milliseconds.') },
      { name: 'onChange', type: '(id: string, index: number) => void', desc: localizedDescription('区块切换时以区块 id 和序号调用', 'Called with the section ID and index when the active section changes.') },
      { name: 'className', type: 'string', desc: localizedDescription('附加类名，拼到 .ak-site 根类之后', 'Additional class name appended to the .ak-site root class.') },
      { name: 'ref', type: 'Ref<AkSectionNavigatorHandle>', desc: localizedDescription('命令式句柄，调用 navigate(id) 跳转到指定区块', 'Imperative handle; call navigate(id) to jump to a section.') },
    ],
  },

  'components-11': {
    api: [
      { name: 'variant', type: 'string', desc: localizedDescription('装饰类型（条纹: default|strong|warning|danger|hazard；网格: grid|dots|diag|scanlines）', 'Decoration style (stripes: default|strong|warning|danger|hazard; backdrops: grid|dots|diag|scanlines).') },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: localizedDescription('AkCut 裁角四档尺寸', 'AkCut chamfer size.') },
      { name: 'corner', type: "'tr' | 'tl' | 'br' | 'bl' | 'all'", default: "'tr'", desc: localizedDescription('裁切角方位', 'Corner or corners to cut.') },
      { name: 'tone', type: "'info' | 'yellow' | 'red'", default: "'info'", desc: localizedDescription('AkCorner 战术三角提示色调', 'AkCorner tactical corner marker tone.') },
    ],
  },

  'components-12': {
    api: [
      { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', desc: localizedDescription('稀有度星级（1 至 6 星）', 'Rarity in stars (1 to 6).') },
      { name: 'prof', type: 'AkProfessionName', desc: localizedDescription('八大职业标识（pioneer, warrior, tank, sniper, caster, medic, support, special）', 'One of the eight profession identifiers: pioneer, warrior, tank, sniper, caster, medic, support, or special.') },
      { name: 'value', type: 'AkSkillLevel', desc: localizedDescription('技能专精等级（1..7, M1, M2, M3）', 'Skill level (1–7 or mastery M1, M2, M3).') },
      { name: 'label', type: 'ReactNode', desc: localizedDescription('属性拉丁代码（如 ATK, DEF, RST）', 'Latin stat code (for example, ATK, DEF, or RST).') },
    ],
  },

  'components-13': {
    api: [
      { name: 'open', type: 'boolean', desc: localizedDescription('浮层受控显示状态', 'Controlled open state of the overlay.') },
      { name: 'onOpenChange', type: '(open: boolean) => void', desc: localizedDescription('浮层展开/关闭回调', 'Called when the overlay opens or closes.') },
      { name: 'title', type: 'ReactNode', desc: localizedDescription('对话框或气泡的标题', 'Dialog or popover title.') },
      { name: 'trigger', type: 'ReactNode', desc: localizedDescription('AkPopover 触发器节点', 'Trigger element rendered by AkPopover.') },
      { name: 'kind', type: "'popover' | 'tooltip'", default: "'popover'", desc: localizedDescription('气泡卡片外观变体', 'Popover appearance variant.') },
    ],
  },

  'components-14': {
    api: [
      { name: 'hint', type: 'ReactNode', desc: localizedDescription('表单字段底部的技术说明文字', 'Helper text displayed below the form field.') },
      { name: 'invalid', type: 'boolean', default: 'false', desc: localizedDescription('输入框校验失败告警状态（红框指示）', 'Validation error state, shown with a red field outline.') },
      { name: 'htmlFor', type: 'string', desc: localizedDescription('标签关联的 input 元素 id', 'ID of the input associated with this label.') },
      { name: 'variant', type: "'checkbox' | 'radio' | 'switch'", default: "'checkbox'", desc: localizedDescription('选择控件的形态', 'Choice control style.') },
    ],
  },

  'components-15': {
    api: [
      { name: 'current', type: 'number | string', desc: localizedDescription('当前理智值或度量读数', 'Current sanity value or meter reading.') },
      { name: 'total', type: 'number | string', desc: localizedDescription('理智上限', 'Maximum sanity value.') },
      { name: 'onAdd', type: '() => void', desc: localizedDescription('点击加号动作回调', 'Called when the add button is clicked.') },
      { name: 'variant', type: "'compact' | 'terminal'", default: "'compact'", desc: localizedDescription('理智面板容器外观', 'Sanity panel container style.') },
      { name: 'color', type: 'string', desc: localizedDescription('AkSpinner 加载菱形主色', 'Primary color of the AkSpinner loading diamond.') },
    ],
  },

  'components-16': {
    api: [
      { name: 'columns', type: 'readonly AkTableColumn[]', desc: localizedDescription('表格列定义（key, header, numeric, sort 等）', 'Table column definitions with fields such as key, header, numeric, and sort.') },
      { name: 'rows', type: 'readonly AkTableRow[]', desc: localizedDescription('表格行数据', 'Table row data.') },
      { name: 'tactical', type: 'boolean', default: 'false', desc: localizedDescription('是否开启战术沉浸式深色指挥台外观', 'Whether to use the immersive dark tactical console style.') },
      { name: 'fallback', type: 'ReactNode', desc: localizedDescription('头像无图时的缩写首字母', 'Initials shown when an avatar image is unavailable.') },
      { name: 'cut', type: 'boolean', default: 'false', desc: localizedDescription('头像右上切角机能风', 'Whether to add a functional chamfer to the avatar’s top-right corner.') },
      { name: 'items', type: 'readonly AkNewsListItem[]', desc: localizedDescription('公告条目列表', 'List of news items.') },
    ],
  },

  'components-17': {
    api: [
      { name: 'tone', type: "'paper' | 'dark' | 'cyan' | 'accent' | 'muted'", desc: localizedDescription('指令牌或屏幕的色调主题', 'Tone theme for the command tile or screen.') },
      { name: 'rarity', type: '1 | 2 | 3 | 4 | 5 | 6', desc: localizedDescription('AkSlot 干员槽位星级', 'Operator rarity shown in AkSlot.') },
      { name: 'role', type: 'AkSlotRole', desc: localizedDescription('AkSlot 职业类别，决定底部特征色条', 'AkSlot profession, which determines the bottom signal bar color.') },
      { name: 'tier', type: '1 | 2 | 3 | 4 | 5 | 6', desc: localizedDescription('AkItem 材料方块品质阶层', 'Quality tier of the material tile in AkItem.') },
      { name: 'onBack', type: '() => void', desc: localizedDescription('AkScreen 顶栏返回按钮动作', 'Action called by the AkScreen header back button.') },
    ],
  },

  'components-18': {
    api: [
      { name: 'name', type: 'ReactNode', desc: localizedDescription('干员 / 敌人 / 关卡名', 'Operator, enemy, or stage name.') },
      { name: 'rarity', type: '1 | 2 | 3 | 4 | 5 | 6', desc: localizedDescription('干员稀有度：决定头像底色、星级角标与 rail 边条', 'Operator rarity: drives the portrait wash, the star badge, and the rail edge.') },
      { name: 'avatar', type: 'string', desc: localizedDescription('立绘地址；不传时留主题化的缺图位（不带游戏素材）', 'Portrait URL. Without one, a themed placeholder is drawn — the package ships no game art.') },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: localizedDescription('尺寸档：88 / 128 / 180 px 宽', 'Size step: 88 / 128 / 180 px wide.') },
      { name: 'variant', type: "'default' | 'rail' | 'hard' | 'ex' | 'boss' | 'elite' | 'box'", desc: localizedDescription('外观：干员卡默认 / 稀有度色条，关卡 hard / ex，敌人 boss / elite，势力徽标 box', 'Treatment: plain or rarity-railed operator card, hard/ex stage, boss/elite enemy, boxed faction mark.') },
      { name: 'code', type: 'string', desc: localizedDescription('敌人编号或关卡号（B003 / H6-4）', 'Enemy or stage code, for example B003 or H6-4.') },
      { name: 'remaining', type: 'number', desc: localizedDescription('倒计时剩余秒数（由调用方驱动）', 'Seconds left on the countdown; the caller owns the clock.') },
      { name: 'grids', type: 'readonly AkRangeGrid[]', desc: localizedDescription('攻击范围格子（相对自身的行列）', 'Attack range cells, relative to the unit itself.') },
    ],
  },

  'components-19': {
    api: [
      { name: 'name', type: 'string', desc: localizedDescription('技能 / 天赋名', 'Skill or talent name.') },
      { name: 'spType', type: "'auto' | 'attack' | 'hit' | 'passive-recovery' | 'passive'", desc: localizedDescription('技力回复方式：决定芯片底色与描边', 'How the skill recovers SP; decides the chip colour and outline.') },
      { name: 'trigger', type: "'manual' | 'auto'", desc: localizedDescription('触发方式；不写表示被动技能', 'Trigger mode; omit for passive skills.') },
      { name: 'levels', type: 'readonly AkSkillSheetLevel[]', desc: localizedDescription('技能各等级数据（描述 / 初始 / 消耗 / 持续）', 'Per-level skill data: description, initial SP, cost, and duration.') },
      { name: 'rows', type: 'readonly AkSkillMatrixRow[]', desc: localizedDescription('技能参数表行（名称 / 各等级数值）', 'Skill matrix rows: a label and one value per level.') },
      { name: 'unlock', type: 'string', desc: localizedDescription('开放条件（显示在右侧槽）', 'Unlock condition shown in the right-hand slot.') },
      { name: 'locked', type: 'boolean', default: 'false', desc: localizedDescription('未解锁：图标灰化并加锁', 'Locked state: the icon greys out and a lock appears.') },
      { name: 'tone', type: "'buff' | 'debuff' | 'keyword' | 'important' | 'enemy' | 'gild' | 'level' | 'potential'", desc: localizedDescription('富文本节点的语义色', 'Semantic colour for a rich-text node.') },
      { name: 'locked', type: 'boolean', default: 'false', desc: localizedDescription('档案未解锁：正文遮罩但仍可检索', 'Dossier locked: content is masked yet stays searchable.') },
    ],
  },

  'components-20': {
    api: [
      { name: 'title', type: 'ReactNode', desc: localizedDescription('面板 / 消息 / 标题组件的主标题', 'Main title of a panel, message, or heading.') },
      { name: 'en', type: 'string', desc: localizedDescription('标题旁的英文小标', 'Small English label beside the title.') },
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent'", desc: localizedDescription('消息 / 徽标信号色档位', 'Signal colour for the message or badge.') },
      { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', desc: localizedDescription('折叠面板的标题层级', 'Heading level for the collapsible panel.') },
      { name: 'open', type: 'boolean', desc: localizedDescription('受控展开状态；省略时进入非受控模式', 'Controlled open state; omit for uncontrolled mode.') },
      { name: 'defaultOpen', type: 'boolean', default: 'false', desc: localizedDescription('非受控模式的初始展开状态', 'Initial open state in uncontrolled mode.') },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'", default: "'top'", desc: localizedDescription('提示气泡的弹出方向', 'Placement of the tooltip bubble.') },
      { name: 'current', type: 'number', desc: localizedDescription('步骤条当前步序', 'Current step index of the stepper.') },
      { name: 'theme', type: "'terminal' | 'archive'", desc: localizedDescription('AkScope 强制套用的主题', 'Theme forced onto the scoped subtree.') },
    ],
  },
}
