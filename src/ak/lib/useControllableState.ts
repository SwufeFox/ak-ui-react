import { useCallback, useState } from 'react'

/**
 * One state value that works in both controlled and uncontrolled modes.
 *
 * `value === undefined` means uncontrolled: the hook owns the value, seeded once
 * from `defaultValue`. Any defined `value` (including `0`, `''` or `false`) makes
 * the component controlled and the prop always wins.
 *
 * The setter updates internal state only in uncontrolled mode, but always calls
 * `onChange`, so a caller can mirror an uncontrolled value or drive a controlled
 * one. This keeps the "value wins" precedence explicit in a single place.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(() => defaultValue)
  const isControlled = value !== undefined
  const current = value !== undefined ? value : internal

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [current, setValue]
}
