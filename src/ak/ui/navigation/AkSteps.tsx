import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Children, isValidElement, useCallback, useEffect, useRef } from 'react'
import { cx } from '../../lib/utils'
import { useControllableState } from '../../lib/useControllableState'

/**
 * 步骤与浮动作族组件
 * 移植自 prts-design（MIT License, Copyright (c) 2026-present MooncellWiki）
 * https://github.com/MooncellWiki/prts-design
 *
 * 覆盖：步骤条（AkSteps / AkStep）与回到顶部（AkBackTop）。
 */

// ── Steps（步骤条） ────────────────────────────────────────────────────

export type AkStepStatus = 'wait' | 'active' | 'done'

export interface AkStepProps {
  /** 步骤名（也可以写在 children 里）。 */
  title?: ReactNode
  /** 状态：`wait` 未到 · `active` 当前 · `done` 已完成；不写时按 `AkSteps` 的 `current` 推算。 */
  status?: AkStepStatus
  /** 步骤名（代替 `title`）。 */
  children?: ReactNode
}

/**
 * 步骤条的一步，**只能直接放在 `AkSteps` 里**。
 *
 * `AkSteps` 读它的 `title` / `status` / children 自己画这一步（序号由 CSS
 * 计数器给），所以这个组件本身不会被挂载。
 */
export function AkStep(_props: AkStepProps): null {
  return null
}

export interface AkStepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  /** 当前步骤（从 1 数）：之前的已完成、这一步是当前、之后未到；超过步数 = 全部完成；不写则各步按自己的 status。 */
  current?: number
  /** 读屏用的列表名（如「精英化进度」）。 */
  label?: string
  /** 若干 `AkStep`。 */
  children?: ReactNode
}

/**
 * 步骤条：一排带序号的步骤 + 连线。
 *
 * 只是展示进度，不可点。序号由 CSS 计数器画，组件不写序号文本。
 */
export function AkSteps({ current, label, className, children, ...rest }: AkStepsProps) {
  const steps = Children.toArray(children)
    .filter(isValidElement)
    .map((child, index) => {
      const props = child.props as AkStepProps
      const derived: AkStepStatus =
        current === undefined ? 'wait' : index + 1 < current ? 'done' : index + 1 === current ? 'active' : 'wait'
      const status = props.status ?? derived
      const title = props.children !== undefined ? props.children : props.title
      return { key: child.key ?? index, status, title }
    })

  return (
    <ol {...rest} className={cx('ak-stepper', className)} data-slot="ak-steps" role="list" aria-label={label}>
      {steps.map((step) => (
        <li
          key={step.key}
          className={cx('ak-step', step.status !== 'wait' && `is-${step.status}`)}
          data-slot="ak-step"
          data-status={step.status}
          aria-current={step.status === 'active' ? 'step' : undefined}
        >
          {step.title}
          {step.status === 'done' ? <span className="ak-sr-only">（已完成）</span> : null}
        </li>
      ))}
    </ol>
  )
}

// ── BackTop（回到顶部） ────────────────────────────────────────────────

export type AkBackTopPosition = 'fixed' | 'absolute'

export interface AkBackTopProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  /** 受控显示状态：给了就是受控模式，此值恒胜。 */
  visible?: boolean
  /** 非受控模式下的初始显示状态。 */
  defaultVisible?: boolean
  /** 显示状态变化时回调（自接滚动时由组件自己更新）。 */
  onVisibleChange?: (visible: boolean) => void
  /** 点了按钮时回调（在滚动回顶之后触发）。 */
  onClick?: () => void
  /** 可访问名（`aria-label`，同时作 `title`）。 */
  label?: string
  /** 图标（不传则给一枚通用向上箭头）。 */
  icon?: ReactNode
  /** 监听、并滚回顶部的滚动容器（元素或选择器）；不写 = 整页。 */
  listenTo?: HTMLElement | string | null
  /** 滚动超过多少 px 出现；`false` = 不看滚动，显隐完全由 `visible` 定。 */
  visibilityHeight?: number | false
  /** 定位：`fixed` 贴视口右下（默认）· `absolute` 贴最近的定位祖先右下。 */
  position?: AkBackTopPosition
}

/**
 * 回到顶部：右下角 44px 反色方块，滚过阈值淡入，点了平滑滚回顶部。
 *
 * 两种用法：
 * - 受控：自己给 `visible` / `onVisibleChange`，显隐完全由调用方决定；
 * - 自接：不给 `visible`，组件自己监听 `listenTo` 指向的滚动容器（或整页）。
 *
 * 隐藏时 `inert`：不可点、不进 Tab 顺序、读屏也读不到。
 */
export function AkBackTop({
  visible,
  defaultVisible = false,
  onVisibleChange,
  onClick,
  label = '回到顶部',
  icon,
  listenTo,
  visibilityHeight = 600,
  position = 'fixed',
  className,
  ...rest
}: AkBackTopProps) {
  const [isVisible, setVisible] = useControllableState<boolean>(visible, defaultVisible, onVisibleChange)
  const isControlled = visible !== undefined
  const scroller = useRef<HTMLElement | Window | null>(null)
  const lastVisible = useRef(visible ?? defaultVisible)

  const resolveTarget = useCallback((): HTMLElement | Window | null => {
    if (listenTo === undefined) return typeof window === 'undefined' ? null : window
    if (typeof listenTo === 'string') {
      return typeof document === 'undefined' ? null : document.querySelector<HTMLElement>(listenTo)
    }
    return listenTo
  }, [listenTo])

  useEffect(() => {
    if (isControlled || visibilityHeight === false) return
    const target = resolveTarget()
    if (!target) return
    scroller.current = target

    function update() {
      const current = scroller.current
      if (!current) return
      const top = current instanceof HTMLElement ? current.scrollTop : current.scrollY
      const next = top > (visibilityHeight as number)
      if (next === lastVisible.current) return
      lastVisible.current = next
      setVisible(next)
    }

    target.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      target.removeEventListener('scroll', update)
      scroller.current = null
    }
  }, [isControlled, resolveTarget, setVisible, visibilityHeight])

  function toTop() {
    const target = resolveTarget()
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    target?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    onClick?.()
  }

  return (
    <button
      {...rest}
      type="button"
      className={cx('ak-fab', position === 'absolute' && 'ak-fab--absolute', isVisible && 'is-visible', className)}
      data-slot="ak-back-top"
      aria-label={label}
      title={label}
      inert={!isVisible}
      onClick={toTop}
    >
      {icon ?? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      )}
    </button>
  )
}
