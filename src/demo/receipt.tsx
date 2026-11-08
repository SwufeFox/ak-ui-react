import { useEffect, useState } from 'react'

/**
 * 终端回执。
 *
 * 复制这类动作原来只把按钮文案改一下，很容易错过。这里给一条 PRTS 式回执：
 * 「做了什么 + 多大 + 什么时候」，滑入、倒计时、自动消失。
 *
 * 状态由组件自己持有 —— 复制是低频事件，但仍然不允许把状态提到 App：
 * 一次 App 状态更新会重渲染 17 个已挂载的 Block。
 */

export interface ReceiptInput {
  /** 动作名，例如 `CODE COPIED`。调用方给已本地化的文案。 */
  label: string
  /** 附加信息：体积、文件名之类。 */
  detail?: string
}

interface Receipt extends ReceiptInput {
  id: number
  /** UTC 时间，组件自己补，调用方不用操心。 */
  time: string
}

type Listener = (receipt: Receipt) => void

const listeners = new Set<Listener>()
let nextId = 1

export function pushReceipt(input: ReceiptInput): void {
  const receipt = { ...input, id: nextId++, time: new Date().toISOString().slice(11, 19) }
  listeners.forEach((listener) => listener(receipt))
}

const LIFETIME = 2600
const LIMIT = 3

/** 字节数的人话格式：小于 1KB 就别显示成 0.0 KB。 */
export function formatBytes(length: number): string {
  return length < 1024 ? `${length} B` : `${(length / 1024).toFixed(1)} KB`
}

export function Receipts() {
  const [items, setItems] = useState<Receipt[]>([])

  useEffect(() => {
    const listener: Listener = (receipt) => {
      setItems((prev) => [...prev.slice(-(LIMIT - 1)), receipt])
      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== receipt.id))
      }, LIFETIME)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="demo-receipts" role="status" aria-live="polite">
      {items.map((item) => (
        <div className="demo-receipt" key={item.id}>
          <span className="demo-receipt__mark" aria-hidden="true">●</span>
          <span className="demo-receipt__body">
            <span className="demo-receipt__label">{item.label}</span>
            <span className="demo-receipt__detail">
              {item.detail ? `${item.detail} · ` : ''}
              {item.time} UTC
            </span>
          </span>
          <span className="demo-receipt__timer" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
