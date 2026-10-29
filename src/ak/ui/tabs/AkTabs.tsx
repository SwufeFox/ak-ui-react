import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { useInstanceId } from '../../lib/useId'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

export interface AkTabsItem {
  /** 描述文字。 */
  description?: ReactNode
  /** 小标文字。 */
  eyebrow?: ReactNode
  /** 标签文本。 */
  label: string
  /** 标题节点。 */
  title: ReactNode
  /** 唯一值标识。 */
  value: string
  /** 标签前置图标。 */
  icon?: ReactNode
  /** 标签后置角标。 */
  badge?: ReactNode
  /** 是否禁用。 */
  disabled?: boolean
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
  const matchedItem = items.find((item) => item.value === value)
  const activeValue = matchedItem
    ? matchedItem.value
    : (items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? '')

  const tabId = (v: string) => `${instanceId}-tab-${v}`
  const panelId = (v: string) => `${instanceId}-panel-${v}`

  const enabledItems = items.filter((item) => !item.disabled)
  const isCurrentEnabled = items.some((item) => item.value === activeValue && !item.disabled)
  const focusableValue = isCurrentEnabled ? activeValue : enabledItems[0]?.value

  function onKeydown(index: number, event: React.KeyboardEvent<HTMLButtonElement>) {
    const offset =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? -1
        : event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : 0
    if (!offset && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()

    const enabledIndices = items
      .map((item, i) => (!item.disabled ? i : -1))
      .filter((i) => i !== -1)
    if (enabledIndices.length === 0) return

    let targetIndex: number
    if (event.key === 'Home') {
      targetIndex = enabledIndices[0]
    } else if (event.key === 'End') {
      targetIndex = enabledIndices[enabledIndices.length - 1]
    } else {
      const currPos = enabledIndices.indexOf(index)
      if (currPos === -1) {
        targetIndex = enabledIndices[0]
      } else {
        const nextPos = (currPos + offset + enabledIndices.length) % enabledIndices.length
        targetIndex = enabledIndices[nextPos]
      }
    }
    const nextItem = items[targetIndex]
    if (!nextItem) return
    playTactileSound('tab', 0.16)
    onValueChange?.(nextItem.value)
    window.requestAnimationFrame(() => document.getElementById(tabId(nextItem.value))?.focus())
  }

  return (
    <section
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-tabs', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-tabs"
    >
      <div className="ak-tabs__list" role="tablist" aria-label={ariaLabel || 'Tabs'}>
        {items.map((item, index) => (
          <button
            key={item.value}
            id={tabId(item.value)}
            className={cx('ak-tabs__tab', item.disabled && 'ak-tabs__tab--disabled')}
            role="tab"
            type="button"
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            aria-controls={panelId(item.value)}
            aria-selected={activeValue === item.value}
            tabIndex={focusableValue === item.value ? 0 : -1}
            onClick={() => {
              if (!item.disabled) {
                playTactileSound('tab', 0.16)
                onValueChange?.(item.value)
              }
            }}
            onKeyDown={(event) => onKeydown(index, event)}
          >
            {item.icon ? <span className="ak-tabs__tab-icon">{item.icon}</span> : null}
            <span className="ak-tabs__tab-label">{item.label}</span>
            {item.badge ? <span className="ak-tabs__tab-badge">{item.badge}</span> : null}
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
  /** 显示内容。 */
  label: ReactNode
  /** 选项值。 */
  value: string
  /** 前置图标。 */
  icon?: ReactNode
  /** 后置角标。 */
  badge?: ReactNode
  /** 是否禁用。 */
  disabled?: boolean
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
  const instanceId = useInstanceId('ak-seg')
  const matchedOption = options.find((option) => option.value === value)
  const activeValue = matchedOption
    ? matchedOption.value
    : (options.find((option) => !option.disabled)?.value ?? options[0]?.value)

  const itemId = (v: string) => `${instanceId}-item-${v}`

  const enabledOptions = options.filter((opt) => !opt.disabled)
  const isCurrentEnabled = options.some((opt) => opt.value === activeValue && !opt.disabled)
  const focusableValue = isCurrentEnabled ? activeValue : enabledOptions[0]?.value

  function onSegmentKeydown(index: number, event: React.KeyboardEvent<HTMLButtonElement>) {
    const offset =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? -1
        : event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : 0
    if (!offset && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()

    const enabledIndices = options
      .map((option, i) => (!option.disabled ? i : -1))
      .filter((i) => i !== -1)
    if (enabledIndices.length === 0) return

    let targetIndex: number
    if (event.key === 'Home') {
      targetIndex = enabledIndices[0]
    } else if (event.key === 'End') {
      targetIndex = enabledIndices[enabledIndices.length - 1]
    } else {
      const currPos = enabledIndices.indexOf(index)
      if (currPos === -1) {
        targetIndex = enabledIndices[0]
      } else {
        const nextPos = (currPos + offset + enabledIndices.length) % enabledIndices.length
        targetIndex = enabledIndices[nextPos]
      }
    }
    const nextOption = options[targetIndex]
    if (!nextOption) return
    playTactileSound('toggle')
    onValueChange?.(nextOption.value)
    window.requestAnimationFrame(() => document.getElementById(itemId(nextOption.value))?.focus())
  }

  return (
    <div
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-segmented', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-segmented"
      role="group"
      aria-label={ariaLabel || 'Options'}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          id={itemId(option.value)}
          className={cx('ak-segmented__item', option.disabled && 'ak-segmented__item--disabled')}
          type="button"
          disabled={option.disabled}
          aria-disabled={option.disabled || undefined}
          aria-pressed={activeValue === option.value}
          tabIndex={focusableValue === option.value ? 0 : -1}
          onClick={() => {
            if (!option.disabled) {
              playTactileSound('toggle')
              onValueChange?.(option.value)
            }
          }}
          onKeyDown={(event) => onSegmentKeydown(index, event)}
        >
          {option.icon ? <span className="ak-segmented__item-icon">{option.icon}</span> : null}
          <span className="ak-segmented__item-label">{option.label}</span>
          {option.badge ? <span className="ak-segmented__item-badge">{option.badge}</span> : null}
        </button>
      ))}
    </div>
  )
}
