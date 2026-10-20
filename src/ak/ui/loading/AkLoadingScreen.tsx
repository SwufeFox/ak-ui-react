import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'

/**
 * 全屏加载 / 入场画面。
 *
 * `_ak-loading.scss` 里 `.ak-loading-screen` 那 170 行一直没有组件出口
 * （同文件的 `.ak-loading` 是 `AkSpinner`、`.ak-loading-track` 是 `AkSkeleton` 的 track 变体，
 *  都已有出口；只有这个整屏 overlay 没有）。
 *
 * ⚠️ 两个必须照样式表来的约束：
 *   1. **必须挂在有定位的祖先下**：它是 `position: absolute; inset: 0; z-index: 30`，
 *      祖先不设 `position: relative` 就会铺满视口。
 *   2. **祖先必须给出确定高度**：它是 `container-type: size`，内部几何（`cqh`/`cqw`、
 *      进度条宽度 `min(38.333cqw, 33rem)`、游标 4.167cqw）全部按容器算，
 *      高度不确定时这些值会一起塌成 0。
 */

/** 外观状态：`loading` 显示，`ready` 淡出（透明度 + 可见性 + 指针事件一起关）。 */
export type AkLoadingScreenState = 'loading' | 'ready'

export interface AkLoadingScreenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 当前状态，写入 `data-state`（样式表认的就是这个属性）。 */
  state?: AkLoadingScreenState
  /** 背景图 URL，走 `.ak-loading-screen__backdrop`（会自动模糊 + 压暗 + 放大 1.015）。 */
  backdrop?: string
  /** 左上角提示语（`.ak-loading-screen__tip`）。 */
  tip?: ReactNode
  /** 主标题，渲染成 `strong`（样式表的元素选择器认标签）。 */
  brand: ReactNode
  /** 主标题后缀，渲染成 `small`。 */
  brandSuffix?: ReactNode
  /** 标记图形（`.ak-loading-screen__mark`），需自行带 `.ak-icon` 类。 */
  mark?: ReactNode
  /** 标记下方小字。 */
  markLabel?: ReactNode
  /** 进度条右侧标签。 */
  progressLabel?: ReactNode
  /** 无障碍名；加载中会以 `role="status"` 播报。 */
  label?: string
}

/** 全屏加载画面。`state="ready"` 时按样式表淡出并停止拦截指针。 */
export function AkLoadingScreen({
  state = 'loading',
  backdrop,
  tip,
  brand,
  brandSuffix,
  mark,
  markLabel,
  progressLabel,
  label = '加载中',
  className,
  children,
  ...rest
}: AkLoadingScreenProps) {
  const busy = state === 'loading'

  return (
    <div
      {...rest}
      className={cx('ak-loading-screen', className)}
      data-slot="ak-loading-screen"
      data-state={state}
      // 就绪后整块被 visibility:hidden，已不在无障碍树里；加载中才播报
      {...(busy
        ? { role: 'status' as const, 'aria-live': 'polite' as const, 'aria-label': label, 'aria-busy': true }
        : {})}
    >
      {backdrop ? <img className="ak-loading-screen__backdrop" src={backdrop} alt="" /> : null}

      {tip ? <p className="ak-loading-screen__tip">{tip}</p> : null}

      <div className="ak-loading-screen__identity">
        <div className="ak-loading-screen__brand">
          <strong>{brand}</strong>
          {brandSuffix ? <small>{brandSuffix}</small> : null}
        </div>
        {mark ? (
          <div className="ak-loading-screen__mark">
            {mark}
            {markLabel ? <small>{markLabel}</small> : null}
          </div>
        ) : null}
      </div>

      <div className="ak-loading-screen__progress">
        {/* 复用样式表里现成的进度条：游标走 ak-loading-track-move，标签贴右侧 */}
        <div className="ak-loading-track">
          <span className="ak-loading-track__runner" aria-hidden="true" />
          {progressLabel ? <span className="ak-loading-track__label">{progressLabel}</span> : null}
        </div>
      </div>

      {children}
    </div>
  )
}
