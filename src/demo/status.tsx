import { useEffect, useRef, type RefObject } from 'react'

/**
 * 顶栏中段的系统读数。
 *
 * 顶栏中间原本是空的，现在放一行 PRTS 式的实时读数：UTC 时钟、视口尺寸。
 * 两者都直接写 DOM，不进 React 状态 —— 每秒一次的状态更新会把 17 棵示例树
 * 全部重渲染一遍，这里不允许发生。
 */
export function SystemStatus() {
  const clockRef = useRef<HTMLSpanElement>(null)
  const viewportRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const clock = clockRef.current
    const viewport = viewportRef.current
    const tick = () => {
      if (clock) clock.textContent = `${new Date().toISOString().slice(11, 19)} UTC`
    }
    const resize = () => {
      if (viewport) viewport.textContent = `${window.innerWidth}×${window.innerHeight}`
    }
    tick()
    resize()
    const timer = window.setInterval(tick, 1000)
    window.addEventListener('resize', resize)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="demo-status" aria-hidden="true">
      <span className="demo-status__item" ref={clockRef} />
      <span className="demo-status__item" ref={viewportRef} />
    </div>
  )
}

/**
 * 阅读进度发丝线。
 *
 * 固定在视口顶端的一条 2px 细线，填充比例是「当前分类读到了哪里」——
 * 不是整页比例，因为整页比例会被首屏横幅稀释掉。
 */
export function StageProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return
    let frame = 0
    const update = () => {
      frame = 0
      const stage = target.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const done = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable))
      fill.style.transform = `scaleX(${done.toFixed(4)})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [target])

  return (
    <div className="demo-progress" aria-hidden="true">
      <span className="demo-progress__fill" ref={fillRef} />
    </div>
  )
}
