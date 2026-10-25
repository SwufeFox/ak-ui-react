export interface BlockPropDoc {
  name: string
  type: string
  default?: string
  desc: string
}

export interface BlockDoc {
  api: BlockPropDoc[]
}

export const DOC_REGISTRY: Record<string, BlockDoc> = {
  'components-1': {
    api: [
      { name: 'variant', type: "'default' | 'outline' | 'action' | 'advanced' | 'light'", default: "'default'", desc: '外观样式档位，决定底色与强调信号' },
      { name: 'icon', type: 'ReactNode', desc: '前置图标节点插槽' },
      { name: 'block', type: 'boolean', default: 'false', desc: '是否撑满父容器 100% 宽度' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '原生禁用状态，带置灰与禁止光标' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", desc: '原生按钮类型' },
    ],
  },

  'components-2': {
    api: [
      { name: 'label', type: 'ReactNode', desc: '下拉菜单触发器按钮的显示内容' },
      { name: 'items', type: 'readonly AkMenuItem[]', desc: '菜单条目数组（含 label, onSelect, disabled, destructive, shortcut）' },
      { name: 'className', type: 'string', desc: '触发器与菜单容器的附加类名' },
    ],
  },

  'components-3': {
    api: [
      { name: 'as', type: 'ElementType', default: "'div'", desc: '底层渲染的 HTML 标签（如 article, section）' },
      { name: 'variant', type: "'default' | 'outline' | 'stripe' | 'place'", default: "'default'", desc: '卡片外观风格：默认、线框、斑马纹或放置槽' },
      { name: 'children', type: 'ReactNode', desc: '卡片主体或槽位组件' },
    ],
  },

  'components-4': {
    api: [
      { name: 'title', type: 'ReactNode', desc: '公告或通知卡片的主标题' },
      { name: 'code', type: 'ReactNode', desc: '左侧等宽技术状态代码（如 SEC.04）' },
      { name: 'variant', type: "'info' | 'warning' | 'danger' | 'success'", default: "'info'", desc: '状态信号颜色档位' },
      { name: 'value', type: 'number', desc: '进度或计量当前数值' },
      { name: 'max', type: 'number', default: '100', desc: '进度或计量上限值' },
    ],
  },

  'components-5': {
    api: [
      { name: 'value', type: 'number | string', desc: '受控当前选定值' },
      { name: 'onValueChange', type: '(value: any) => void', desc: '数值变化时的受控回调' },
      { name: 'min / max', type: 'number', desc: '滑动条或数字步进器的范围极值' },
      { name: 'options', type: 'readonly (string | AkSegmentedOption)[]', desc: '分段控制器的选项清单' },
    ],
  },

  'components-6': {
    api: [
      { name: 'items', type: 'readonly AkTabsItem[]', desc: '标签页定义数组（包含 id, label, eyebrow, content）' },
      { name: 'value', type: 'string', desc: '当前激活的标签页 id' },
      { name: 'onValueChange', type: '(value: string) => void', desc: '切换标签页时的回调' },
      { name: 'ariaLabel', type: 'string', desc: '标签栏无障碍名称' },
    ],
  },

  'components-7': {
    api: [
      { name: 'ref', type: 'Ref<AkEntranceHandle>', desc: '进场动画句柄，通过 replay() 可重新播放入场动效' },
      { name: 'value', type: 'number', desc: 'AkCountUp 目标数值' },
      { name: 'duration', type: 'number', default: '600', desc: '数字滚动动画持续毫秒数' },
      { name: 'threeD', type: 'boolean', default: 'false', desc: 'AkDepth 是否启用倾斜透视立体位移' },
    ],
  },

  'components-8': {
    api: [
      { name: 'items', type: 'readonly GalleryItem[]', desc: '画廊多媒体条目数组（含 title, src, alt, thumb 等）' },
      { name: 'value', type: 'number', desc: '当前焦点大图的索引' },
      { name: 'onValueChange', type: '(index: number) => void', desc: '切换画廊相片时的回调' },
      { name: 'src', type: 'string', desc: '拍立得倾斜相册图片的地址' },
    ],
  },

  'components-9': {
    api: [
      { name: 'tasks', type: 'readonly AssetTask[]', desc: '资源预加载异步任务集合' },
      { name: 'label', type: 'string', default: "'Resources'", desc: '加载状态行前缀名称' },
      { name: 'retryLabel', type: 'string', default: "'Retry'", desc: '失败时重试按钮文字' },
      { name: 'onChange', type: '(state: AssetState) => void', desc: '加载状态流转回调' },
    ],
  },

  'components-10': {
    api: [
      { name: 'sections', type: 'readonly SectionSpec[]', desc: '整页全屏吸附导航分节定义（id 对应锚点容器）' },
      { name: 'viewportSelector', type: 'string', desc: '吸附滚动视口容器的选择器' },
    ],
  },

  'components-11': {
    api: [
      { name: 'variant', type: 'string', desc: '装饰类型（条纹: default|strong|warning|danger|hazard；网格: grid|dots|diag|scanlines）' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'AkCut 裁角四档尺寸' },
      { name: 'corner', type: "'tr' | 'tl' | 'br' | 'bl' | 'all'", default: "'tr'", desc: '裁切角方位' },
      { name: 'tone', type: "'info' | 'yellow' | 'red'", default: "'info'", desc: 'AkCorner 战术三角提示色调' },
    ],
  },

  'components-12': {
    api: [
      { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', desc: '稀有度星级（1 至 6 星）' },
      { name: 'prof', type: 'AkProfessionName', desc: '八大职业标识（pioneer, warrior, tank, sniper, caster, medic, support, special）' },
      { name: 'value', type: 'AkSkillLevel', desc: '技能专精等级（1..7, M1, M2, M3）' },
      { name: 'label', type: 'ReactNode', desc: '属性拉丁代码（如 ATK, DEF, RST）' },
    ],
  },

  'components-13': {
    api: [
      { name: 'open', type: 'boolean', desc: '浮层受控显示状态' },
      { name: 'onOpenChange', type: '(open: boolean) => void', desc: '浮层展开/关闭回调' },
      { name: 'title', type: 'ReactNode', desc: '对话框或气泡的标题' },
      { name: 'trigger', type: 'ReactNode', desc: 'AkPopover 触发器节点' },
      { name: 'kind', type: "'popover' | 'tooltip'", default: "'popover'", desc: '气泡卡片外观变体' },
    ],
  },

  'components-14': {
    api: [
      { name: 'hint', type: 'ReactNode', desc: '表单字段底部的技术说明文字' },
      { name: 'invalid', type: 'boolean', default: 'false', desc: '输入框校验失败告警状态（红框指示）' },
      { name: 'htmlFor', type: 'string', desc: '标签关联的 input 元素 id' },
      { name: 'variant', type: "'checkbox' | 'radio' | 'switch'", default: "'checkbox'", desc: '选择控件的形态' },
    ],
  },

  'components-15': {
    api: [
      { name: 'current', type: 'number | string', desc: '当前理智值或度量读数' },
      { name: 'total', type: 'number | string', desc: '理智上限' },
      { name: 'onAdd', type: '() => void', desc: '点击加号动作回调' },
      { name: 'variant', type: "'compact' | 'terminal'", default: "'compact'", desc: '理智面板容器外观' },
      { name: 'color', type: 'string', desc: 'AkSpinner 加载菱形主色' },
    ],
  },

  'components-16': {
    api: [
      { name: 'columns', type: 'readonly AkTableColumn[]', desc: '表格列定义（key, header, numeric, sort 等）' },
      { name: 'rows', type: 'readonly AkTableRow[]', desc: '表格行数据' },
      { name: 'fallback', type: 'ReactNode', desc: '头像无图时的缩写首字母' },
      { name: 'cut', type: 'boolean', default: 'false', desc: '头像右上切角机能风' },
      { name: 'items', type: 'readonly AkNewsListItem[]', desc: '公告条目列表' },
    ],
  },

  'components-17': {
    api: [
      { name: 'tone', type: "'paper' | 'dark' | 'cyan' | 'accent' | 'muted'", desc: '指令牌或屏幕的色调主题' },
      { name: 'rarity', type: '1 | 2 | 3 | 4 | 5 | 6', desc: 'AkSlot 干员槽位星级' },
      { name: 'role', type: 'AkSlotRole', desc: 'AkSlot 职业类别，决定底部特征色条' },
      { name: 'tier', type: '1 | 2 | 3 | 4 | 5 | 6', desc: 'AkItem 材料方块品质阶层' },
      { name: 'onBack', type: '() => void', desc: 'AkScreen 顶栏返回按钮动作' },
    ],
  },
}
