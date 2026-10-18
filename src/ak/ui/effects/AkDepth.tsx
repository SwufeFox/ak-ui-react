import { useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { createDashboardDepth, type DashboardDepthController, type DashboardDepthOptions } from '../../core/dashboard-depth.mjs'
import { cx } from '../../lib/utils'

/**
 * 景深（指针驱动的视差）。
 *
 * **这不是新发明——是把上游已有的两半接起来：**
 *   · `core/dashboard-depth.mjs` 的 `createDashboardDepth` 给每个带 `[data-depth]` 的元素
 *     写 `--ak-layer-x` / `--ak-layer-y`（指针偏移 × maxX/maxY × 该元素 depth 值）
 *   · `_ak-dashboard.scss:60` 早就有消费规则 `translate3d(var(--ak-layer-x), var(--ak-layer-y), 0)`
 * 上游缺的只是「把它们接起来的东西」，以及一个可复用的类。本组件补的是这一根线。
 *
 * 所以这个控制器在下游此前是**孤儿**（零消费者），现在有宿主了。
 *
 * ```tsx
 * <AkDepth stage>
 *   <AkDepthLayer depth={2}>背景层，动得最多</AkDepthLayer>
 *   <AkDepthLayer depth={1}>中景</AkDepthLayer>
 *   <AkDepthLayer depth={0.4}>前景，几乎不动</AkDepthLayer>
 * </AkDepth>
 * ```
 *
 * `depth` 越大位移越多。上游默认 `maxX: 130` / `maxY: 70`（px），对应 `depth = 1` 的满偏量。
 */

export type AkDepthVariant = 'flat' | 'stage' | 'tilt'

export interface AkDepthProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  as?: ElementType
  /**
   * 透视配方，三者都来自上游：
   * - `flat`（默认）不设透视，只做位移
   * - `stage` ← `_ak-object.scss` 的 `.perspective`（`perspective: 100rem`，origin `50% 125%`）
   * - `tilt` ← `_ak-panel.scss` 的 `.ak-panel-right`（`perspective(50rem) rotateY(-10deg)`）
   */
  variant?: AkDepthVariant
  /** 打开 3D 上下文（`transform-style: preserve-3d`），同上游 `.ak-dashboard`。 */
  threeD?: boolean
  /** 关掉指针监听（例如由外部时间轴驱动 `render()`）。透传给控制器。 */
  pointerEnabled?: boolean
  /** 横向最大位移（px）。上游默认 130。 */
  maxX?: number
  /** 纵向最大位移（px）。上游默认 70。 */
  maxY?: number
  /** 被驱动的层怎么选。默认 `[data-depth]`，与上游控制器一致。 */
  layerSelector?: string
  children?: ReactNode
}

export function AkDepth({
  as: Tag = 'div',
  variant = 'flat',
  threeD = false,
  pointerEnabled = true,
  maxX,
  maxY,
  layerSelector,
  className,
  children,
  ...rest
}: AkDepthProps) {
  const rootRef = useRef<HTMLElement>(null)
  const controllerRef = useRef<DashboardDepthController | null>(null)
  // 把选项放进 ref，这样改 maxX/maxY 不必重建控制器（重建会打断正在跑的位移）
  const optionsRef = useRef<DashboardDepthOptions>({})

  optionsRef.current = {
    ...(pointerEnabled === false ? { pointerEnabled: false } : {}),
    ...(typeof maxX === 'number' ? { maxX } : {}),
    ...(typeof maxY === 'number' ? { maxY } : {}),
    ...(layerSelector ? { layerSelector } : {}),
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = createDashboardDepth(root, optionsRef.current)
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // 选项改了就重建：控制器在构造时一次性收集层，层集合变化必须重建才生效
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointerEnabled, maxX, maxY, layerSelector])

  return (
    <Tag
      {...rest}
      ref={rootRef}
      className={cx('ak-depth', variant !== 'flat' && `ak-depth--${variant}`, threeD && 'ak-depth--3d', className)}
      data-slot="ak-depth"
      data-variant={variant}
    >
      {children}
    </Tag>
  )
}

export interface AkDepthLayerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /**
   * 该层的深度。控制器据此算位移：`offset × maxRaw × depth`。
   * 上游默认 `maxX: 130` / `maxY: 70`，所以 `depth: 1` 的满偏量就是那个数。
   */
  depth?: number
  children?: ReactNode
}

/** 视差层。必须放进 `AkDepth` 里，否则 `--ak-layer-x/y` 无人写入。 */
export function AkDepthLayer({ as: Tag = 'div', depth = 1, className, children, ...rest }: AkDepthLayerProps) {
  return (
    <Tag
      {...rest}
      className={cx('ak-depth__layer', className)}
      data-slot="ak-depth-layer"
      // 控制器按 [data-depth] 找层并读它的值
      data-depth={depth}
    >
      {children}
    </Tag>
  )
}
