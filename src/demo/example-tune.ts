import { cloneElement, type ReactElement, type ReactNode } from 'react'

export type TuneOverrides = Record<string, unknown>
export type TuneTarget = { id: string; label: string; props: Record<string, unknown> }
export type Tune = (id: string, element: ReactElement) => ReactElement

/** Collect original props and apply edits at the element's authored JSX site. */
export function createTuneSession(overrides: TuneOverrides) {
  const targets: TuneTarget[] = []
  const ids = new Set<string>()
  const counts = new Map<string, number>()
  const entries = Object.entries(overrides)
  const tune: Tune = (id, element) => {
    if (ids.has(id)) throw new Error(`Duplicate tune ID: ${id}`)
    ids.add(id)
    const type = element.type as { displayName?: string; name?: string; render?: { displayName?: string; name?: string }; type?: { displayName?: string; name?: string } }
    const name = typeof element.type === 'string' ? element.type : type.displayName ?? type.name ?? type.render?.displayName ?? type.render?.name ?? type.type?.displayName ?? type.type?.name ?? 'Component'
    const count = (counts.get(name) ?? 0) + 1
    counts.set(name, count)
    const original = element.props as Record<string, unknown>
    targets.push({ id, label: `${name} · ${count}`, props: original })
    const prefix = `${id}|`
    let changed: Record<string, unknown> | undefined
    for (const [key, value] of entries) {
      if (key.startsWith(prefix)) {
        const prop = key.slice(prefix.length)
        if (!Object.is(original[prop], value)) (changed ??= {})[prop] = value
      }
    }
    return changed ? cloneElement(element, changed) : element
  }
  return { tune, targets }
}

export type ExampleFactory = (tune: Tune) => ReactNode
