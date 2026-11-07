import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * PRTS 终端开机序列。
 *
 * 站点第一屏就是「终端在自检」，不是空白页也不是通用转圈：
 * 逐行打出真实的库信息（版本、分类数），然后横向收拢把内容交还给人。
 *
 * 三条硬规则：
 * - 降级动效时直接跳过（内容已经在后面渲染好了）；
 * - 任何键或指针按下都能跳过；
 * - 纯 transform/opacity/clip-path，不触发重排。
 */

interface BootSequenceProps {
  /** 逐行打出的内容，调用方给真实数据，不要写死文案。 */
  lines: readonly string[]
  onDone: () => void
}

const LINE_MS = 120
const TYPE_MS = 260
const OUT_MS = 480

export function BootSequence({ lines, onDone }: BootSequenceProps) {
  const [phase, setPhase] = useState<'typing' | 'out'>('typing')
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) {
      doneRef.current()
      return
    }
    const total = LINE_MS * lines.length + TYPE_MS + 140
    const outTimer = window.setTimeout(() => setPhase('out'), total)
    const doneTimer = window.setTimeout(() => doneRef.current(), total + OUT_MS)
    // 任何输入都能跳过：把跳过动作交给外层去收尾，这里只负责切到收拢态。
    const skip = () => setPhase('out')
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.clearTimeout(outTimer)
      window.clearTimeout(doneTimer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [lines.length])

  return (
    <div className="demo-boot" data-phase={phase} aria-hidden="true">
      <div className="demo-boot__scan" />
      <div className="demo-boot__panel">
        <span className="demo-boot__brand">AK-UI</span>
        <ul className="demo-boot__lines">
          {lines.map((line, index) => (
            <li
              key={line}
              className="demo-boot__line"
              style={{ '--boot-chars': line.length, animationDelay: `${index * LINE_MS}ms` } as CSSProperties}
            >
              <span className="demo-boot__caret" aria-hidden="true">▸</span>
              {line}
            </li>
          ))}
        </ul>
        <div className="demo-boot__bar">
          <span className="demo-boot__bar-fill" />
        </div>
      </div>
    </div>
  )
}
