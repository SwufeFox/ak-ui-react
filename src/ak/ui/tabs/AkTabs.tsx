import type { HTMLAttributes, ReactNode } from 'react'
import { useInstanceId } from '../../lib/useId'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

export interface AkTabsItem {
  description?: ReactNode
  eyebrow?: ReactNode
  label: string
  title: ReactNode
  value: string
}

// Tabs 与 Segmented 的 props 以前是**封闭**的：不继承 HTML 属性，所以
// className 之外连 `id`、`data-*`、`style` 都传不进去。这里补上继承，
// 并把与组件语义冲突的键（`children` / `onChange`）显式摘掉。
export interface AkTabsProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  /** 读屏标签，默认 `Tabs`。 */
  ariaLabel?: string
  /** 标签列表；每项含 `value` / `label` / `title`。 */
  items: AkTabsItem[]
  /** Active tab value. Falls back to the first item when unmatched. */
  value?: string
  /** 切换时回调。 */
  onValueChange?: (value: string) => void
  /** Per-panel content, keyed by tab value. */
  renderPanel?: (item: AkTabsItem) => ReactNode
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
  /** 尺寸档：标签高度、内边距、字号与面板内距一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-tabs-width': '100%' }`。 */
  tokens?: AkTokens
}

export function AkTabs({ ariaLabel, items, value, onValueChange, renderPanel, className, size = 'md', tokens, style, ...rest }: AkTabsProps) {
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
    <section
      {...rest}
      {...sizeAttrs(size)}
      className={className ? `ak-tabs ${className}` : 'ak-tabs'}
      style={tokenStyle(tokens, style)}
      data-slot="ak-tabs"
    >
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

export interface AkSegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** 读屏标签，默认 `Options`。 */
  ariaLabel?: string
  /** 选项列表，每项 `label` + `value`。 */
  options: AkSegmentedOption[]
  /** 当前选中值；不匹配时回退第一项。 */
  value?: string
  /** 选中变化时回调。 */
  onValueChange?: (value: string) => void
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
  /** 尺寸档：每项的最小宽高、内边距与字号一起缩。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-segmented-inset': '0' }`。 */
  tokens?: AkTokens
}

export function AkSegmented({ ariaLabel, options, value, onValueChange, className, size = 'md', tokens, style, ...rest }: AkSegmentedProps) {
  const activeValue = options.some((option) => option.value === value) ? value : options[0]?.value

  return (
    <div
      {...rest}
      {...sizeAttrs(size)}
      className={className ? `ak-segmented ${className}` : 'ak-segmented'}
      style={tokenStyle(tokens, style)}
      data-slot="ak-segmented"
      role="group"
      aria-label={ariaLabel || 'Options'}
    >
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
