import { useEffect } from 'react'

/**
 * Imperative-controller lifecycle hook — the React equivalent of creating a
 * framework-agnostic `alma` controller inside onMounted and destroying it in onScopeDispose.
 * The effect owns the controller; `deps` controls how often it is rebuilt.
 */
export function useController(effect: () => void | (() => void), deps: unknown[] = []): void {
  useEffect(effect, deps)
}
