import type { HTMLAttributes, ReactNode } from 'react'
import { cx, variantClass } from '../../lib/utils'

/**
 * 分组与分隔组件。
 *
 * 这三样**上游 SCSS 早已写好**（`.ak-divider` / `.ak-button-group` / `.ak-tag-group` /
 * `.ak-status-group`），但一直没有 React 组件暴露它们 —— 属于「有实现、没出口」。
 * 本文件只做包装，不新增任何样式。
 */

// ── 分隔线 ──────────────────────────────────────────────────────────

export interface AkDividerProps extends HTMLAttributes<HTMLDivElement> {
  /** 居中的标签或图标。不传则只有两条不同宽度的横线。 */
  children?: ReactNode
}

/**
 * 分隔线：两侧横线宽度不等（15% / 50%），中间是标签位 —— 上游刻意的非对称比例。
 */
export function AkDivider({ className, children, ...rest }: AkDividerProps) {
  return (
    <div {...rest} className={cx('ak-divider', className)} data-slot="ak-divider" role="separator">
      {children ? <span>{children}</span> : null}
    </div>
  )
}

// ── 按钮组 ──────────────────────────────────────────────────────────

export type AkButtonGroupVariant = 'default' | 'action'

export interface AkButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AkButtonGroupVariant
  children?: ReactNode
}

/**
 * 按钮组：把若干 `AkButton` 收成一条。上游给它固定 300px 宽。
 *
 * `action` 变体额外给组一层底色，用于「主操作 + 若干次操作」的排布。
 */
export function AkButtonGroup({ variant = 'default', className, children, ...rest }: AkButtonGroupProps) {
  return (
    <div
      {...rest}
      className={cx('ak-button-group', variantClass('ak-button-group', variant), className)}
      data-slot="ak-button-group"
      data-variant={variant}
      role="group"
    >
      {children}
    </div>
  )
}

// ── 标签组 / 状态组 ─────────────────────────────────────────────────

export interface AkTagGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/** 标签组：若干 `AkTag` 自动换行，间距统一。 */
export function AkTagGroup({ className, children, ...rest }: AkTagGroupProps) {
  return (
    <div {...rest} className={cx('ak-tag-group', className)} data-slot="ak-tag-group" role="group">
      {children}
    </div>
  )
}

export interface AkStatusGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/** 状态组：若干 `AkStatus` 并排，用于看板式的系统读数条。 */
export function AkStatusGroup({ className, children, ...rest }: AkStatusGroupProps) {
  return (
    <div {...rest} className={cx('ak-status-group', className)} data-slot="ak-status-group" role="group">
      {children}
    </div>
  )
}
