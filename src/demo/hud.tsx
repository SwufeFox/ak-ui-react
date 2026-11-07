import { useEffect, useRef } from 'react'

/**
 * PRTS 战术准星。
 *
 * 指针位置上的 HUD：四枚发丝直角 + 中心点 + 一行读数（当前指向的组件）。
 * 它是**叠加层**，不是替代品：系统光标始终保留，文本选择与复制不受影响。
 *
 * 性能约定：
 * - 只在 `pointer: fine` 且未开启降级动效时启用；
 * - 指针静止后 rAF 循环自行停摆（不空转）；
 * - 每帧只写 transform，读数用 elementFromPoint 且只在文字变化时写 DOM。
 */

const FOLLOW = 0.24
const SETTLE = 0.6

/** 读数：从元素自己的类名或可访问名里取，不维护额外映射表。 */
function describe(target: Element | null): string | null {
  if (!target) return null
  // 优先报交互件本身（按钮的变体名比它内部的文字节点更有信息量）。
  const holder = target.closest('button, a, [role="tab"], [role="button"], input, select, textarea') ?? target
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

  useEffect(() => {
    const root = rootRef.current
    const readout = readoutRef.current
    if (!root || !readout) return
    const fine = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) {
      root.remove()
      return
    }

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let posX = targetX
    let posY = targetY
    let frame = 0
    let lastLabel = ''

    const paint = () => {
      posX += (targetX - posX) * FOLLOW
      posY += (targetY - posY) * FOLLOW
      root.style.transform = `translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, 0)`
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
      const label = describe(under)
      root.dataset.locked = under?.closest('button, a, input, select, textarea, [role="tab"], [role="button"]') ? 'true' : 'false'
      root.dataset.editing = under?.closest('input, textarea, [contenteditable="true"]') ? 'true' : 'false'
      if (label !== lastLabel) {
        lastLabel = label ?? ''
        readout.textContent = lastLabel
        root.dataset.hasLabel = lastLabel ? 'true' : 'false'
      }
    }
    const onLeave = () => { root.dataset.visible = 'false' }
    const onBlur = () => { root.dataset.visible = 'false' }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onBlur)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return (
    <div className="demo-hud" ref={rootRef} data-visible="false" aria-hidden="true">
      <span className="demo-hud__corner demo-hud__corner--tl" />
      <span className="demo-hud__corner demo-hud__corner--tr" />
      <span className="demo-hud__corner demo-hud__corner--bl" />
      <span className="demo-hud__corner demo-hud__corner--br" />
      <span className="demo-hud__dot" />
      <span className="demo-hud__readout" ref={readoutRef} />
    </div>
  )
}
