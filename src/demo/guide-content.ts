/**
 * 指南正文的两种语言。
 *
 * 单独成文件而不是塞进 `i18n.tsx`：这里放的是成段文档，不是界面文案，
 * 混进字典会把那份 authority 表撑成两倍。完整性仍由类型保证 ——
 * `en` 与 `zh` 必须是同一个 `GuideContent`，少一段就编译不过。
 */

export interface GuideItem {
  /** 术语 / 命令名，等宽显示。 */
  term: string
  /** 一句话说明。 */
  desc: string
}

export interface GuideSnippet {
  /** 片段标题，如 `INSTALL`。 */
  label: string
  code: string
  /** true 表示按 TSX 着色。 */
  tsx?: boolean
}

/** 指南小节的 id：两份语言必须逐节对应，多写一个少写一个都会在这里露出来。 */
export type GuideSectionId = 'start' | 'theme' | 'tune' | 'interaction' | 'a11y' | 'v2' | 'resources'

export interface GuideSection {
  id: GuideSectionId
  title: string
  paragraphs?: string[]
  items?: GuideItem[]
  snippets?: GuideSnippet[]
}

export interface GuideContent {
  eyebrow: string
  title: string
  lead: string
  back: string
  copy: string
  copied: string
  sections: GuideSection[]
}

const INSTALL = 'npm install @swufefox/ak-ui-react'
const STYLESHEET = "import '@swufefox/ak-ui-react/style.css'"

const en: GuideContent = {
  eyebrow: 'DOCUMENTATION // 说明书',
  title: 'Using ak-ui-react',
  lead: 'Everything the showcase does not fit on one screen: how to install the package, how theming and density work, what the Tune and Code tabs give you, and the interaction layer this site runs on.',
  back: 'Back to catalogue',
  copy: 'COPY',
  copied: 'COPIED',
  sections: [
    {
      id: 'start',
      title: 'Quick start',
      paragraphs: [
        'The package ships ESM only, with React and React DOM as its only peer dependencies. Import the stylesheet once, at your app entry — every component is styled from the same tokens.',
        'There is no runtime dependency beyond React and React DOM: the motion language is CSS, the DOM controllers are plain `.mjs` modules, and the only file you need is one stylesheet.',
      ],
      snippets: [
        { label: 'INSTALL', code: INSTALL },
        { label: 'STYLESHEET', code: STYLESHEET },
        {
          label: 'FIRST COMPONENT',
          tsx: true,
          code: `import { AkButton, AkCard, AkCardContent, AkCardTitle } from '@swufefox/ak-ui-react'

export function Deploy() {
  return (
    <AkCard>
      <AkCardTitle>Operation</AkCardTitle>
      <AkCardContent>Squad ready.</AkCardContent>
      <AkButton variant="action">Deploy</AkButton>
    </AkCard>
  )
}`,
        },
      ],
    },
    {
      id: 'theme',
      title: 'Theme and density',
      paragraphs: [
        'Both axes are attributes on the root element, so they cascade into every subtree — including the examples on this site.',
        'Switch theme and density from Settings in the top bar and watch the page react: the change is the same one a host application makes.',
      ],
      snippets: [
        {
          label: 'THEME',
          code: `<html data-ak-theme="terminal">   <!-- or "archive" -->`,
        },
        {
          label: 'DENSITY',
          code: `<html data-ak-density="cozy">      <!-- compact · cozy · spacious -->`,
        },
      ],
      items: [
        { term: '--ak-*', desc: 'Every tunable is a custom property in the token layer. Override any of them on an ancestor to re-theme a subtree.' },
        { term: '--ak-cut-md', desc: 'The cut-corner size used by AkCut (sm / md / lg). Dialogs, notices and popovers read their own radius from --ak-cut.' },
      ],
    },
    {
      id: 'tune',
      title: 'Tune and export',
      paragraphs: [
        'Every category has four views. Preview renders the components, Tune exposes the props of the instance you selected, Code produces a standalone TSX file, and API lists the accepted props.',
        'The exported file is not a screenshot of the page: it carries the real handlers, the selected language, your Tune edits and the scoped CSS rules the example needs — so it compiles and runs on its own.',
      ],
      snippets: [
        { label: 'DEEP LINK', code: 'https://ak-ui-react.pages.dev/?view=code#components-1' },
        { label: 'EXPORTED FILE', tsx: true, code: `import { useState } from 'react'
import { AkButton } from '@swufefox/ak-ui-react'
import '@swufefox/ak-ui-react/style.css'` },
      ],
    },
    {
      id: 'interaction',
      title: 'Interaction layer',
      paragraphs: [
        'The showcase is a terminal before it is a document. These are the parts that make it behave like one — all of them are opt-out, and none of them get in the way of reading or copying.',
      ],
      items: [
        { term: 'BOOT', desc: 'The page opens like a CRT warming up: a bright line expands into the screen, then the terminal prints its self-check. Press any key or click to skip it.' },
        { term: 'RETICLE', desc: 'On pointer-fine devices a HUD reticle trails the cursor and reads out the component underneath. It is an overlay — the native cursor, text selection and copy all keep working, and it hides itself over text fields.' },
        { term: 'LOCK', desc: 'While the reticle is locked, a corner-ticked frame brackets the target and the readout reports its live size and background colour.' },
        { term: 'INSPECT', desc: 'The INSPECT control in every category lifts the preview panel into a full-screen frame. The browser performs the morph (View Transitions), and Esc returns focus to the button that opened it.' },
        { term: 'RECEIPT', desc: 'Copy actions answer with a receipt: what was copied, how large it was, and when.' },
        { term: 'PROGRESS', desc: 'A hairline pinned to the top of the viewport fills with the progress through the current category.' },
        { term: 'DIRECTION', desc: 'Switching categories slides the incoming block in from the side you came from.' },
        { term: 'SEARCH', desc: 'Press / to focus the category search. Enter opens a single match; the list is searchable by component name, category id and keyword.' },
      ],
    },
    {
      id: 'a11y',
      title: 'Accessibility',
      paragraphs: [
        'These are contracts, not aspirations. They hold for the package and for this site.',
      ],
      items: [
        { term: 'FOCUS', desc: 'Every interactive element shows a visible :focus-visible ring. Keyboard activation moves focus to the destination heading.' },
        { term: 'TARGETS', desc: 'Interactive targets are at least 24×24 CSS pixels, including breadcrumb links and checkbox rows.' },
        { term: 'KEYBOARD', desc: 'Tab lists use roving tabIndex with arrow, Home and End. Dialogs are native <dialog> and return focus on close.' },
        { term: 'MOTION', desc: 'prefers-reduced-motion: reduce removes the boot sequence, the reticle, the depth field and every transition that is not carrying information.' },
        { term: 'CURSOR', desc: 'The custom pointer layer never replaces the system cursor, and the page never hijacks scrolling.' },
      ],
    },
    {
      id: 'v2',
      title: 'What 2.0 changed',
      paragraphs: [
        'Version 2.0 finished the port of prts-design: the operator, stage, skill and record families now ship with the package, together with the panel, feedback and stepper primitives.',
        'Two contracts moved with it. The package entry is a client boundary, so a Next.js server component can import any component without tripping over React context. And theming is a single attribute — data-ak-theme="terminal" or "archive"; the old data-theme="light" alias is gone.',
      ],
      items: [
        { term: 'PORTED FAMILIES', desc: 'Operator dossiers (AkOpCard, AkOpRow, AkEnemy), stage and event cards (AkStage, AkEvent, AkCountdown, AkHero), skills and records (AkSkill, AkSkillSheet, AkSkillMatrix, AkModule, AkDossier, AkVoice), and panels with feedback (AkPanel, AkCollapse, AkMessage, AkToastProvider, AkSteps).' },
        { term: 'CLIENT BOUNDARY', desc: 'The published bundle starts with "use client": components render on the client, while the DOM controllers under /core carry no React dependency and stay usable from server code.' },
        { term: 'FONTS', desc: 'Chakra Petch and Oswald (both OFL-1.1) ship with the package. The original game fonts are not redistributed — they stay first in the stacks, so a machine that has them installed keeps the original look.' },
        { term: 'FORCED COLORS', desc: 'Windows high-contrast mode is supported: selected states, self-drawn controls and clipped shapes switch to system colours instead of vanishing.' },
        { term: 'DUAL-MODE STATE', desc: 'Every value control works controlled (value + onValueChange) or uncontrolled (defaultValue); a defined value always wins.' },
      ],
    },
    {
      id: 'resources',
      title: 'Resources',
      paragraphs: ['The package, the generated reference and the source.'],
      items: [
        { term: 'llms.txt', desc: 'The machine-readable index: the ak-ui design contract (style intensity, principles, token and motion rules) plus the component catalogue. It points at docs/api.md for the prop tables. Open it from the top bar, or fetch /llms.txt.' },
        { term: 'docs/api.md', desc: 'The authoritative API reference, generated from the emitted declarations — every component, hook and shared type, with each prop, variant and method documented.' },
        { term: 'AGENTS.md', desc: 'The contributor guide: architecture, build stages, and the conventions a change has to follow.' },
        { term: 'GitHub', desc: 'The full source, including the port notes that document every local deviation from upstream.' },
        { term: 'npm', desc: 'Published from the master branch through trusted publishing; the tag must match the package version.' },
      ],
    },
  ],
}

const zh: GuideContent = {
  eyebrow: 'DOCUMENTATION // 说明书',
  title: '使用 ak-ui-react',
  lead: '展示页放不下的内容都在这里：怎么安装、主题与密度怎么工作、调参与代码导出给了什么，以及这个站点自己跑的那层交互。',
  back: '返回目录',
  copy: '复制',
  copied: '已复制',
  sections: [
    {
      id: 'start',
      title: '快速开始',
      paragraphs: [
        '包体只有 ESM，peer 依赖只有 React 与 React DOM 两项。样式表在应用入口引入一次即可——所有组件都从同一套令牌取样式。',
        '除 React 与 React DOM 外没有任何运行时依赖：动效语言是 CSS，DOM 控制器是纯 `.mjs` 模块，你需要拿到的只有一份样式表。',
      ],
      snippets: [
        { label: '安装', code: INSTALL },
        { label: '样式表', code: STYLESHEET },
        {
          label: '第一个组件',
          tsx: true,
          code: `import { AkButton, AkCard, AkCardContent, AkCardTitle } from '@swufefox/ak-ui-react'

export function Deploy() {
  return (
    <AkCard>
      <AkCardTitle>作战开始</AkCardTitle>
      <AkCardContent>小队已就位。</AkCardContent>
      <AkButton variant="action">部署</AkButton>
    </AkCard>
  )
}`,
        },
      ],
    },
    {
      id: 'theme',
      title: '主题与密度',
      paragraphs: [
        '两个维度都是挂在根元素上的属性，因此会一路级联进每一棵子树——本站的示例也一样。',
        '在顶栏的「设置」里切换主题与密度，整页会跟着变：这正是宿主应用要做的那一次改动。',
      ],
      snippets: [
        {
          label: '主题',
          code: `<html data-ak-theme="terminal">   <!-- 或 "archive" -->`,
        },
        {
          label: '密度',
          code: `<html data-ak-density="cozy">      <!-- compact · cozy · spacious -->`,
        },
      ],
      items: [
        { term: '--ak-*', desc: '所有可调项都是令牌层里的自定义属性。在任意祖先上覆盖，就能给一棵子树换主题。' },
        { term: '--ak-cut-md', desc: 'AkCut 用的切角尺寸（sm / md / lg）。弹窗、公告与浮层各有自己的半径，读的是 --ak-cut。' },
      ],
    },
    {
      id: 'tune',
      title: '调参与导出',
      paragraphs: [
        '每个分类有四个视图：预览渲染组件，调参列出你选中实例的属性，代码产出独立可运行的 TSX，属性文档列出可用参数。',
        '导出的文件不是页面截图：它带着真实的处理函数、所选语言、你的调参结果，以及这个示例所需的局部 CSS 规则——拿到手就能编译、能跑。',
      ],
      snippets: [
        { label: '深链', code: 'https://ak-ui-react.pages.dev/?view=code#components-1' },
        { label: '导出文件', tsx: true, code: `import { useState } from 'react'
import { AkButton } from '@swufefox/ak-ui-react'
import '@swufefox/ak-ui-react/style.css'` },
      ],
    },
    {
      id: 'interaction',
      title: '交互层',
      paragraphs: [
        '在成为文档之前，这个站点先是一台终端。下面这些就是让它像终端的部分——都可以关掉，而且都不会妨碍阅读与复制。',
      ],
      items: [
        { term: '开机', desc: '页面像显像管预热一样打开：一条亮线展开成整屏，然后终端打出自检信息。按任意键或点击即可跳过。' },
        { term: '准星', desc: '在精确指针设备上，一枚 HUD 准星拖尾跟随并读出指针下的组件。它是叠加层——系统光标、选词与复制照常工作，进入输入框时自动隐身。' },
        { term: '锁定', desc: '准星锁定时，四角靶标框住目标，读数给出它的实时尺寸与底色。' },
        { term: '检视', desc: '每个分类的「检视」键把预览面板升成整屏，由浏览器做形变补间（View Transitions），Esc 会把焦点还给触发它的按钮。' },
        { term: '回执', desc: '复制动作会回一条回执：复制了什么、多大、什么时候。' },
        { term: '进度', desc: '贴在视口顶端的细线，填充的是当前分类的阅读进度。' },
        { term: '方向', desc: '切换分类时，新块从来路方向滑入。' },
        { term: '搜索', desc: '按 / 聚焦分类搜索；只有一条匹配时回车直接打开。可按组件名、分类 id 与关键词搜。' },
      ],
    },
    {
      id: 'a11y',
      title: '可达性',
      paragraphs: ['这些是契约，不是愿望。包与本站都成立。'],
      items: [
        { term: '焦点', desc: '每个可交互元素都有可见的 :focus-visible 焦点环。键盘激活会把焦点送到目标标题。' },
        { term: '目标', desc: '可点目标至少 24×24 CSS 像素，面包屑链接与勾选行都算在内。' },
        { term: '键盘', desc: '标签列表用 roving tabIndex 配方向键、Home、End；弹窗是原生 <dialog>，关闭后归还焦点。' },
        { term: '动效', desc: 'prefers-reduced-motion: reduce 会去掉开机序列、准星、景深，以及所有不承载信息的过渡。' },
        { term: '光标', desc: '自定义指针层从不替换系统光标，页面也从不劫持滚动。' },
      ],
    },
    {
      id: 'v2',
      title: '2.0 改了什么',
      paragraphs: [
        '2.0 把 prts-design 的移植补完：干员、关卡、技能、档案四族连同面板、反馈、步骤族一起随包发布。',
        '随之改了两条契约。包的入口是客户端边界——Next.js 的服务端组件可以直接 import 任何组件，不会被 React context 绊倒。主题也只剩一个入口：`data-ak-theme="terminal"` 或 `"archive"`，旧的 `data-theme="light"` 别名已经移除。',
      ],
      items: [
        { term: '移植进来的族', desc: '干员档案（AkOpCard、AkOpRow、AkEnemy）、关卡与活动卡（AkStage、AkEvent、AkCountdown、AkHero）、技能与档案（AkSkill、AkSkillSheet、AkSkillMatrix、AkModule、AkDossier、AkVoice），以及面板与反馈（AkPanel、AkCollapse、AkMessage、AkToastProvider、AkSteps）。' },
        { term: '客户端边界', desc: '发布产物开头就是 "use client"：组件在客户端渲染；/core 下的 DOM 控制器不依赖 React，服务端照常可用。' },
        { term: '字体', desc: 'Chakra Petch 与 Oswald（均为 OFL-1.1）随包分发。游戏原字体不再二次分发，但仍排在字体栈最前——装过的机器保留原版观感。' },
        { term: '强制色', desc: '支持 Windows 高对比度：选中态、自绘控件与剪裁图形改用系统色，而不是直接消失。' },
        { term: '双模状态', desc: '所有取值控件都支持受控（value + onValueChange）与非受控（defaultValue）；只要给了 value 就以它为准。' },
      ],
    },
    {
      id: 'resources',
      title: '资源',
      paragraphs: ['包体、生成的参考与源码。'],
      items: [
        { term: 'llms.txt', desc: '给机器读的索引：ak-ui 设计契约（风格强度、设计原则、令牌与动效规则）加组件目录；它指向 docs/api.md 查参数表。顶栏可以直接打开，也可以取 /llms.txt。' },
        { term: 'docs/api.md', desc: '权威的 API 参考，由产物声明生成——每个组件、Hook 与共享类型都带参数、变体与方法说明。' },
        { term: 'AGENTS.md', desc: '贡献者指南：架构、构建阶段，以及一次改动必须遵守的约定。' },
        { term: 'GitHub', desc: '完整源码，含记录每一处本地偏离的移植说明。' },
        { term: 'npm', desc: '从 master 经可信发布上线；tag 必须与包版本一致。' },
      ],
    },
  ],
}

export const GUIDE_CONTENT: Record<'en' | 'zh-CN', GuideContent> = { en, 'zh-CN': zh }

// 两份指南的小节必须一一对应：类型只保证形状，这里再保证 id 集合相同，
// 免得某天只给一种语言加了小节，另一种语言安静地少一段。
const enIds = en.sections.map((section) => section.id).join('|')
const zhIds = zh.sections.map((section) => section.id).join('|')
if (enIds !== zhIds) {
  throw new Error(`guide sections drifted between locales: ${enIds} vs ${zhIds}`)
}
