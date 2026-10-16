export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ')
}

/** Mirrors the Vue registry convention: `default` renders the bare class, others add a BEM modifier. */
export function variantClass(base: string, variant: string, fallback = 'default'): string {
  return variant !== fallback ? `${base}--${variant}` : ''
}

export function finite(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/** Clamps a value into [lower, upper], tolerating non-finite input the way the Vue originals do. */
export function clampRange(value: unknown, lower: number, upper: number): number {
  const low = finite(lower, 0)
  const high = Math.max(low, finite(upper, low))
  return Math.min(high, Math.max(low, finite(value, low)))
}

export function toPercent(value: number, lower: number, upper: number): number {
  const range = upper - lower
  return range > 0 ? ((value - lower) / range) * 100 : 0
}
