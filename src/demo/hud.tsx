import { useEffect, useRef } from 'react'

/**
 * PRTS 战术准星。
 *
 * 两层：
 * 1. 准星本体——跟着指针的拖尾 HUD，四枚发丝直角 + 十字 + 一行读数；
 * 2. 锁定框——指针落在可交互件上时，罩住那个件的四角靶标。
 *
 * 它是**叠加层**，不是替代品：系统光标始终保留，文本选择与复制不受影响。
 *
 * 性能约定：
 * - 只在 `pointer: fine` 且未开启降级动效时启用；
 * - 指针静止后 rAF 循环自行停摆（不空转）；
 * - 每帧只写 transform，锁定框的尺寸只在目标变化时写。
 */

const FOLLOW = 0.24
const SETTLE = 0.6

/** 可被锁定的目标：交互件本身。 */
const LOCKABLE = 'button, a, [role="tab"], [role="button"], input, select, textarea, summary'

/** 读数：从元素自己的类名或可访问名里取，不维护额外映射表。 */
function describe(target: Element | null): string | null {
  if (!target) return null
  // 优先报交互件本身（按钮的变体名比它内部的文字节点更有信息量）。
  const holder = target.closest(LOCKABLE) ?? target
  const className = typeof holder.className === 'string' ? holder.className : ''
  const tokens = className.split(/\s+/).filter((token) => /^(ak|demo)-[a-z0-9-]+/.test(token))
  const named = tokens.find((token) => token.includes('--'))
  const source = named ?? tokens[0]
  if (source) {
    const [block, modifier] = source.replace(/^(ak|demo)-/, '').split('--')
    const name = block.split('__')[0].toUpperCase()
    return modifier ? `${name} / ${modifier.toUpperCase()}` : name
  }
  const aria = holder.getAttribute('aria-label') ?? holder.closest('[aria-label]')?.getAttribute('aria-label')
  return aria ? aria.trim().slice(0, 26).toUpperCase() : null
}

export function HudReticle() {
  const rootRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const lockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const readout = readoutRef.current
    const lock = lockRef.current
    if (!root || !readout || !lock) return
    const fine = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) {
      root.remove()
      lock.remove()
      return
    }

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let posX = targetX
    let posY = targetY
    let frame = 0
    let lastLabel = ''
    let hovered: Element | null = null

    /** 锁定框：罩住目标件的四角靶标。 */
    const paintLock = () => {
      if (!hovered || !hovered.isConnected) {
        lock.dataset.visible = 'false'
        return
      }
      const rect = hovered.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        lock.dataset.visible = 'false'
        return
      }
      lock.dataset.visible = 'true'
      lock.style.transform = `translate3d(${rect.left.toFixed(1)}px, ${rect.top.toFixed(1)}px, 0)`
      lock.style.width = `${rect.width.toFixed(1)}px`
      lock.style.height = `${rect.height.toFixed(1)}px`
    }

    const paint = () => {
      posX += (targetX - posX) * FOLLOW
      posY += (targetY - posY) * FOLLOW
      root.style.transform = `translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, 0)`
      paintLock()
      // 追上目标就停：静止时不该有 rAF 在空转。
      if (Math.abs(targetX - posX) < SETTLE && Math.abs(targetY - posY) < SETTLE) {
        frame = 0
        return
      }
      frame = requestAnimationFrame(paint)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      root.dataset.visible = 'true'
      wake()
      const under = document.elementFromPoint(targetX, targetY)
      const lockable = under?.closest(LOCKABLE) ?? null
      hovered = lockable
      root.dataset.locked = lockable ? 'true' : 'false'
      root.dataset.editing = under?.closest('input, textarea, [contenteditable="true"]') ? 'true' : 'false'
      const label = describe(under)
      if (label !== lastLabel) {
        lastLabel = label ?? ''
        readout.textContent = lastLabel
        root.dataset.hasLabel = lastLabel ? 'true' : 'false'
      }
    }
    const onLeave = () => {
      root.dataset.visible = 'false'
      lock.dataset.visible = 'false'
      hovered = null
    }
    const onBlur = () => { onLeave() }
    // 页面滚动时目标件会移动，锁定框要跟上。
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(paint)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onBlur)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return (
    <>
      <div className="demo-hud" ref={rootRef} data-visible="false" aria-hidden="true">
        <span className="demo-hud__corner demo-hud__corner--tl" />
        <span className="demo-hud__corner demo-hud__corner--tr" />
        <span className="demo-hud__corner demo-hud__corner--bl" />
        <span className="demo-hud__corner demo-hud__corner--br" />
        <span className="demo-hud__dot" />
        <span className="demo-hud__readout" ref={readoutRef} />
      </div>
      <div className="demo-hud__lock" ref={lockRef} data-visible="false" aria-hidden="true">
        <span className="demo-hud__lock-corner demo-hud__lock-corner--tl" />
        <span className="demo-hud__lock-corner demo-hud__lock-corner--tr" />
        <span className="demo-hud__lock-corner demo-hud__lock-corner--bl" />
        <span className="demo-hud__lock-corner demo-hud__lock-corner--br" />
      </div>
    </>
  )
}
