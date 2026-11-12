import type { ReactNode } from 'react'
import type { Tune } from './example-tune'

/**
 * 示例渲染器的惰性代理。
 *
 * 20 个示例合计约 55KB(gzip)，但同一时刻只有被选中的那个分类需要它。
 * 渲染器是普通函数 `(model, tune) => ReactNode`，不是组件，所以没法直接用
 * `React.lazy` —— 这里用「首次调用触发加载 + 完成后通知订阅者」：
 *
 *   1. 包装函数先看缓存；命中就正常渲染，未命中就发起 import 并返回 null；
 *   2. 加载完成后 revision 自增，`Block` 订阅它并重新计算调参会话；
 *   3. 每个分类只加载一次，重复调用不会重复请求。
 *
 * 渲染器各自的 model 类型互不相同，统一存成 `(model: unknown, tune) => ReactNode`
 * 只在这一个边界上做断言；对外导出的包装函数是泛型的，调用处仍然按真实 model 检查。
 *
 * 源码导出走的是 `example-manifest` 的 `?raw` 通道，不经过这里。
 */
type StoredRenderer = (model: unknown, tune: Tune) => ReactNode

const modules: Record<string, { load: () => Promise<unknown>; pick: string }> = {
  actions: { load: () => import('./examples/actions'), pick: 'renderActions' },
  menus: { load: () => import('./examples/menus'), pick: 'renderMenus' },
  surfaces: { load: () => import('./examples/surfaces'), pick: 'renderSurfaces' },
  feedback: { load: () => import('./examples/feedback'), pick: 'renderFeedback' },
  inputs: { load: () => import('./examples/inputs'), pick: 'renderInputs' },
  navigation: { load: () => import('./examples/navigation'), pick: 'renderNavigation' },
  effects: { load: () => import('./examples/effects'), pick: 'renderEffects' },
  gallery: { load: () => import('./examples/gallery'), pick: 'renderGallery' },
  site: { load: () => import('./examples/site'), pick: 'renderSite' },
  shell: { load: () => import('./examples/shell'), pick: 'renderShell' },
  decor: { load: () => import('./examples/decor'), pick: 'renderDecor' },
  'game-data': { load: () => import('./examples/game-data'), pick: 'renderGameData' },
  controls: { load: () => import('./examples/controls'), pick: 'renderControls' },
  forms: { load: () => import('./examples/forms'), pick: 'renderForms' },
  readouts: { load: () => import('./examples/readouts'), pick: 'renderReadouts' },
  collections: { load: () => import('./examples/collections'), pick: 'renderCollections' },
  command: { load: () => import('./examples/command'), pick: 'renderCommand' },
  operators: { load: () => import('./examples/operators'), pick: 'renderOperators' },
  skills: { load: () => import('./examples/skills'), pick: 'renderSkills' },
  panels: { load: () => import('./examples/panels'), pick: 'renderPanels' },
}

const loaded = new Map<string, StoredRenderer>()
const inflight = new Set<string>()
const listeners = new Set<() => void>()
let revision = 0

function prime(key: string): void {
  if (loaded.has(key) || inflight.has(key)) return
  const entry = modules[key]
  if (!entry) return
  inflight.add(key)
  void entry.load().then(
    (module) => {
      const candidate = (module as Record<string, unknown>)[entry.pick]
      if (typeof candidate === 'function') {
        loaded.set(key, candidate as StoredRenderer)
        revision += 1
        for (const listener of listeners) listener()
      }
      inflight.delete(key)
    },
    () => { inflight.delete(key) },
  )
}

function renderer(key: string) {
  return <M,>(model: M, tune: Tune): ReactNode => {
    const render = loaded.get(key)
    if (!render) {
      prime(key)
      return null
    }
    return render(model, tune)
  }
}

/** 订阅「某个分类的渲染器已就绪」；`Block` 用它触发会话重算。 */
export function subscribeExamples(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** 快照：每加载完一个分类就自增一次。 */
export function examplesRevision(): number {
  return revision
}

export const renderActions = renderer('actions')
export const renderMenus = renderer('menus')
export const renderSurfaces = renderer('surfaces')
export const renderFeedback = renderer('feedback')
export const renderInputs = renderer('inputs')
export const renderNavigation = renderer('navigation')
export const renderEffects = renderer('effects')
export const renderGallery = renderer('gallery')
export const renderSite = renderer('site')
export const renderShell = renderer('shell')
export const renderDecor = renderer('decor')
export const renderGameData = renderer('game-data')
export const renderControls = renderer('controls')
export const renderForms = renderer('forms')
export const renderReadouts = renderer('readouts')
export const renderCollections = renderer('collections')
export const renderCommand = renderer('command')
export const renderOperators = renderer('operators')
export const renderSkills = renderer('skills')
export const renderPanels = renderer('panels')
