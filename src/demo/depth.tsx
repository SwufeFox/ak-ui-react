import { useEffect, type RefObject } from 'react'

/**
 * 英雄区的指针景深。
 *
 * 只往元素上写四个自定义属性（位移两个、光斑中心两个），几何全部交给 CSS：
 * 各层用 `translate` 读取归一化偏移，因此与入场动画的 `transform` 互不覆盖。
 *
 * 约束：仅 `pointer: fine`、仅未开启降级动效、rAF 节流。
 */
export function useHeroDepth(target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let nx = 0
    let ny = 0

    const apply = () => {
      frame = 0
      el.style.setProperty('--hero-dx', nx.toFixed(3))
      el.style.setProperty('--hero-dy', ny.toFixed(3))
      el.style.setProperty('--hero-mx', `${((nx + 1) * 50).toFixed(1)}%`)
      el.style.setProperty('--hero-my', `${((ny + 1) * 50).toFixed(1)}%`)
    }
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
      ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const reset = () => {
      nx = 0
      ny = 0
      if (!frame) frame = requestAnimationFrame(apply)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', reset)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
    }
  }, [target])
}
