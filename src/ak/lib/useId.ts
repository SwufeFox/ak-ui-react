import { useRef } from 'react'

/**
 * Stable instance id for wiring aria-controls/aria-labelledby.
 * React's own useId() emits colons, which are invalid in `id` attributes and break
 * `document.getElementById`, so the components use this counter-based scheme instead.
 */
export function useInstanceId(prefix = 'ak'): string {
  const ref = useRef<string | null>(null)
  if (ref.current === null) {
    instanceCounter += 1
    ref.current = `${prefix}-${instanceCounter}`
  }
  return ref.current
}

let instanceCounter = 0
