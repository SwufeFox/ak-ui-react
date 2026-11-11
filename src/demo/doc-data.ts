import type { Locale } from './i18n'

export interface BlockPropDoc {
  name: string
  component?: string
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
      { component: 'AkOpCard', name: 'name', type: 'ReactNode', desc: localizedDescription('干员名（必填）。', 'Operator name (required).') },
      { component: 'AkOpCard', name: 'rarity', type: '1 | 2 | 3 | 4 | 5 | 6', desc: localizedDescription('干员稀有度（必填）：决定头像底色与星级。', 'Operator rarity (required); drives the portrait wash and star badge.') },
      { component: 'AkOpCard', name: 'avatar', type: 'string', desc: localizedDescription('头像图片地址；不传时显示主题化占位。', 'Portrait URL; omit it to show the themed placeholder.') },
      { component: 'AkOpCard', name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: localizedDescription('尺寸档：88 / 128 / 180 px 宽。', 'Size step: 88 / 128 / 180 px wide.') },
      { component: 'AkOpCard', name: 'variant', type: "'default' | 'rail'", default: "'default'", desc: localizedDescription('外观：默认样式或增加稀有度色条。', 'Default treatment or a rarity-coloured rail.') },
      { component: 'AkEnemy', name: 'name', type: 'ReactNode', desc: localizedDescription('敌人名（必填）。', 'Enemy name (required).') },
      { component: 'AkEnemy', name: 'code', type: 'ReactNode', desc: localizedDescription('敌人编号，如 B003。', 'Enemy code, for example B003.') },
      { component: 'AkEnemy', name: 'variant', type: "'normal' | 'elite' | 'boss'", default: "'normal'", desc: localizedDescription('敌人级别。', 'Enemy rank.') },
      { component: 'AkEnemy', name: 'level', type: 'number', desc: localizedDescription('威胁度：点亮的菱形数。', 'Threat level, shown as lit diamonds.') },
      { component: 'AkStage', name: 'code', type: 'ReactNode', desc: localizedDescription('关卡编号（必填），如 H6-4。', 'Stage code (required), for example H6-4.') },
      { component: 'AkStage', name: 'name', type: 'ReactNode', desc: localizedDescription('关卡名。', 'Stage name.') },
      { component: 'AkStage', name: 'variant', type: "'default' | 'hard' | 'ex' | 'story'", default: "'default'", desc: localizedDescription('关卡外观档位。', 'Stage treatment.') },
      { component: 'AkEvent', name: 'title', type: 'ReactNode', desc: localizedDescription('活动名（必填）。', 'Event title (required).') },
      { component: 'AkEvent', name: 'status', type: "'default' | 'live' | 'ended'", default: "'default'", desc: localizedDescription('活动状态。', 'Event status.') },
      { component: 'AkCountdown', name: 'remaining', type: 'number', desc: localizedDescription('剩余秒数；由调用方驱动。', 'Seconds remaining; the caller owns the clock.') },
      { component: 'AkHero', name: 'title', type: 'ReactNode', desc: localizedDescription('大标题（必填）。', 'Hero title (required).') },
      { component: 'AkCamp', name: 'variant', type: "'default' | 'box'", default: "'default'", desc: localizedDescription('势力徽标外观。', 'Faction mark treatment.') },
      { component: 'AkRange', name: 'grids', type: 'readonly AkRangeGrid[]', desc: localizedDescription('攻击范围格子（必填），相对自身的行列。', 'Attack range cells (required), relative to the unit.') },
    ],
  },

  'components-19': {
    api: [
      { component: 'AkSkill', name: 'name', type: 'string', desc: localizedDescription('技能名（必填）。', 'Skill name (required).') },
      { component: 'AkSkill', name: 'spType', type: "'auto' | 'attack' | 'hit' | 'passive-recovery' | 'passive'", default: "'auto'", desc: localizedDescription('技力回复方式。', 'How the skill recovers SP.') },
      { component: 'AkSkill', name: 'trigger', type: "'manual' | 'auto'", desc: localizedDescription('触发方式；不写时不显示。', 'Trigger mode; omitted for passive skills.') },
      { component: 'AkSkill', name: 'unlock', type: 'string', desc: localizedDescription('技能开放条件。', 'Skill unlock condition.') },
      { component: 'AkSkill', name: 'locked', type: 'boolean', default: 'false', desc: localizedDescription('未解锁时灰化技能图标并显示锁。', 'Greys out the skill icon and shows a lock.') },
      { component: 'AkSkillSheet', name: 'levels', type: 'AkSkillSheetLevel[]', desc: localizedDescription('技能各等级数据（必填）。', 'Per-level skill data (required).') },
      { component: 'AkSkillMatrix', name: 'rows', type: 'AkSkillMatrixRow[]', desc: localizedDescription('技能参数行（必填）。', 'Skill parameter rows (required).') },
      { component: 'AkRichText', name: 'tone', type: 'AkRichTextTone', desc: localizedDescription('整段富文本的语义色。', 'Semantic tone for the rich-text block.') },
      { component: 'AkDossier', name: 'title', type: 'string', desc: localizedDescription('档案标题（必填）。', 'Dossier title (required).') },
      { component: 'AkDossier', name: 'unlock', type: 'string', desc: localizedDescription('解锁条件；锁定时显示在遮罩上。', 'Unlock condition; shown on the mask while locked.') },
      { component: 'AkDossier', name: 'locked', type: 'boolean', default: 'false', desc: localizedDescription('锁定档案正文并显示解锁条件。', 'Masks the dossier body and shows its unlock condition.') },
    ],
  },

  'components-20': {
    api: [
      { component: 'AkPanel', name: 'title', type: 'ReactNode', desc: localizedDescription('面板标题。', 'Panel title.') },
      { component: 'AkPanel', name: 'en', type: 'ReactNode', desc: localizedDescription('标题后的拉丁小标。', 'Small Latin label after the title.') },
      { component: 'AkMessage', name: 'variant', type: "'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent'", default: "'info'", desc: localizedDescription('消息提示的外观档位。', 'Message treatment.') },
      { component: 'AkHeading', name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', desc: localizedDescription('标题元素层级（h1–h6）。', 'Heading element level (h1–h6).') },
      { component: 'AkCollapseItem', name: 'open', type: 'boolean', desc: localizedDescription('单独使用时的受控展开状态。', 'Controlled open state when used on its own.') },
      { component: 'AkCollapseItem', name: 'defaultOpen', type: 'boolean', default: 'false', desc: localizedDescription('单独使用时的初始展开状态。', 'Initial open state when used on its own.') },
      { component: 'AkTooltip', name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'", default: "'top'", desc: localizedDescription('提示气泡的弹出方向。', 'Tooltip placement.') },
      { component: 'AkSteps', name: 'current', type: 'number', desc: localizedDescription('当前步骤，从 1 开始。', 'Current step, starting at 1.') },
      { component: 'AkScope', name: 'theme', type: "'terminal' | 'archive'", desc: localizedDescription('局部强制套用的主题。', 'Theme forced onto this scope.') },
    ],
  },
}
