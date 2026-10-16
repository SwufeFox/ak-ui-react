import type { ReactNode } from 'react'
import { useInstanceId } from '../../lib/useId'

export interface AkTabsItem {
  description?: ReactNode
  eyebrow?: ReactNode
  label: string
  title: ReactNode
  value: string
}

export interface AkTabsProps {
  ariaLabel?: string
  items: AkTabsItem[]
  /** Active tab value. Falls back to the first item when unmatched. */
  value?: string
  onValueChange?: (value: string) => void
  /** Per-panel content, keyed by tab value. */
  renderPanel?: (item: AkTabsItem) => ReactNode
  className?: string
}

export function AkTabs({ ariaLabel, items, value, onValueChange, renderPanel, className }: AkTabsProps) {
  const instanceId = useInstanceId('ak-tabs')
  const activeValue = items.some((item) => item.value === value) ? (value as string) : (items[0]?.value ?? '')

  const tabId = (v: string) => `${instanceId}-tab-${v}`
  const panelId = (v: string) => `${instanceId}-panel-${v}`

  function onKeydown(index: number, event: React.KeyboardEvent<HTMLButtonElement>) {
    const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (!offset && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const nextIndex =
      event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + offset + items.length) % items.length
    const nextItem = items[nextIndex]
    if (!nextItem) return
    onValueChange?.(nextItem.value)
    window.requestAnimationFrame(() => document.getElementById(tabId(nextItem.value))?.focus())
  }

  return (
    <section className={className ? `ak-tabs ${className}` : 'ak-tabs'} data-slot="ak-tabs">
      <div className="ak-tabs__list" role="tablist" aria-label={ariaLabel || 'Tabs'}>
        {items.map((item, index) => (
          <button
            key={item.value}
            id={tabId(item.value)}
            className="ak-tabs__tab"
            role="tab"
            type="button"
            aria-controls={panelId(item.value)}
            aria-selected={activeValue === item.value}
            tabIndex={activeValue === item.value ? 0 : -1}
            onClick={() => onValueChange?.(item.value)}
            onKeyDown={(event) => onKeydown(index, event)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={`${item.value}-panel`}
          id={panelId(item.value)}
          className="ak-tabs__panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={tabId(item.value)}
          hidden={activeValue !== item.value}
        >
          {item.eyebrow ? <span className="ak-tabs__eyebrow">{item.eyebrow}</span> : null}
          <h3 className="ak-tabs__title">{item.title}</h3>
          {item.description ? <p className="ak-tabs__description">{item.description}</p> : null}
          {renderPanel?.(item)}
        </div>
      ))}
    </section>
  )
}

export interface AkSegmentedOption {
  label: ReactNode
  value: string
}

export interface AkSegmentedProps {
  ariaLabel?: string
  options: AkSegmentedOption[]
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function AkSegmented({ ariaLabel, options, value, onValueChange, className }: AkSegmentedProps) {
  const activeValue = options.some((option) => option.value === value) ? value : options[0]?.value

  return (
    <div className={className ? `ak-segmented ${className}` : 'ak-segmented'} data-slot="ak-segmented" role="group" aria-label={ariaLabel || 'Options'}>
      {options.map((option) => (
        <button
          key={option.value}
          className="ak-segmented__item"
          type="button"
          aria-pressed={activeValue === option.value}
          onClick={() => onValueChange?.(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
