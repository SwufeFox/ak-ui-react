import { createContext, useContext, useId, useMemo, type InputHTMLAttributes, type LabelHTMLAttributes, type HTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx, variantClass } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

/**
 * 表单控件。
 *
 * 这一组同样是「上游 SCSS 早已写好、但没有 React 组件」：
 * `.ak-field` / `.ak-label` / `.ak-input` / `.ak-textarea` / `.ak-select` / `.ak-choice`
 * 在 `_ak-form.scss` 里是完整的（含 focus 环、invalid 态、disabled 态、勾选框的
 * 对勾绘制、开关滑块），只是从没被暴露出来。本文件只做包装，不加新样式。
 *
 * `ak-choice` 的三种外观由样式表的 `&--radio` / `&--switch` 决定，
 * 所以这里也照搬那三个类名，而不是另起一套。
 */

// ── 字段容器 ────────────────────────────────────────────────────────

/**
 * 字段级状态（必填 / 出错）在字段与其子控件之间传递。
 *
 * 子控件不必逐个重复 `required` / `invalid`：放在 `AkField` 里的控件会自动继承。
 * 显式传在控件上的值优先于字段上的值。
 */
interface AkFieldContextValue {
  required?: boolean
  invalid?: boolean
}

const AkFieldContext = createContext<AkFieldContextValue>({})

export interface AkFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 字段内的控件。 */
  children: ReactNode
  /** 字段下方的提示或错误文字。 */
  hint?: ReactNode
  /**
   * 控件下方的说明文字（上游写法 `.ak-help`）。出错时追加 `.ak-help--error`（红字）。
   * 与 `hint` 各占一格：`hint` 走本库的 `.ak-field__hint`，`help` 走上游的 `.ak-help`。
   */
  help?: ReactNode
  /** 给出错误时把提示标成错误态，并把信号色接到字段上。 */
  invalid?: boolean
  /**
   * 字段是否必填。字段本身记 `data-required`；其中的标签自动加 `.ak-label--required`
   * （自带一颗红星），其中的控件自动带上原生 `required`。
   */
  required?: boolean
  /** 尺寸档：字段内控件的统一高度档（同时下发到子控件）。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-field-signal': '#e33b3b' }`。 */
  tokens?: AkTokens
}

/**
 * 字段容器：把控件与其标签、提示绑成一组，并统一信号色。
 * 其余原生 `<div>` 属性（`id` / `role` / `data-*` / 事件等）会透传到根节点。
 */
export function AkField({ children, hint, help, invalid = false, required = false, className, size = 'md', tokens, style, ...rest }: AkFieldProps) {
  const fieldState = useMemo(() => ({ required, invalid }), [required, invalid])
  return (
    <AkFieldContext.Provider value={fieldState}>
      <div
        {...rest}
        {...sizeAttrs(size)}
        className={cx('ak-field', invalid && 'is-invalid', className)}
        style={tokenStyle(tokens, style)}
        data-slot="ak-field"
        data-invalid={invalid || undefined}
        data-required={required || undefined}
      >
        {children}
        {hint ? (
          <span className="ak-field__hint" role={invalid ? 'alert' : undefined}>
            {hint}
          </span>
        ) : null}
        {help ? (
          <span className={cx('ak-help', invalid && 'ak-help--error')} role={invalid ? 'alert' : undefined}>
            {help}
          </span>
        ) : null}
      </div>
    </AkFieldContext.Provider>
  )
}

export interface AkFieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode
  /**
   * 是否必填。为真时加上 `.ak-label--required`（标签后自带一颗红星）。
   * 放在 `AkField` 内时继承字段的 `required`。
   */
  required?: boolean
}

/** 字段标签（大写、加宽字距的等宽小字）。 */
export function AkFieldLabel({ className, children, required, ...rest }: AkFieldLabelProps) {
  const field = useContext(AkFieldContext)
  const isRequired = required ?? field.required ?? false
  return (
    <label
      {...rest}
      className={cx('ak-label', isRequired && 'ak-label--required', className)}
      data-slot="ak-label"
      data-required={isRequired || undefined}
    >
      {children}
    </label>
  )
}

// ── 输入 ────────────────────────────────────────────────────────────

// ⚠️ 原生 <input>/<select> 也有 `size`，但那是**字符数**（number）。
// 我们这枚 `size` 是外观档位（string），必须先把原生那枚 Omit 掉才能重声明，
// 否则 TS2430：'number' is not assignable to 'AkControlSize'。
// 代价：这几个组件不再能把原生 size 传进 DOM —— 视觉档位更重要。
export interface AkInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 无障碍名；未给 `id` 与外部标签时用它。 */
  label?: string
  /**
   * 是否校验失败。为真时加 `.is-invalid`（红边）并置 `aria-invalid`。
   * 放在 `AkField` 内时继承字段的 `invalid`。
   */
  invalid?: boolean
  /**
   * 是否校验通过。为真时加 `.is-valid`（绿边）。与 `invalid` 同时给出时以 `invalid` 为准。
   */
  valid?: boolean
  /**
   * 是否必填。为真时带上原生 `required`。
   * 放在 `AkField` 内时继承字段的 `required`。
   */
  required?: boolean
  /** 尺寸档：高度、内距与字号。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkInput({ className, label, size = 'md', tokens, style, invalid, valid, required, ...rest }: AkInputProps) {
  const field = useContext(AkFieldContext)
  const isInvalid = invalid ?? field.invalid ?? false
  const isValid = !isInvalid && (valid ?? false)
  const isRequired = required ?? field.required ?? false
  return (
    <input
      {...rest}
      {...sizeAttrs(size)}
      required={isRequired || undefined}
      aria-label={rest['aria-label'] ?? label}
      aria-invalid={isInvalid || undefined}
      className={cx('ak-input', isInvalid && 'is-invalid', isValid && 'is-valid', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-input"
    />
  )
}

export interface AkTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  /**
   * 是否校验失败。为真时加 `.is-invalid`（红边）并置 `aria-invalid`。
   * 放在 `AkField` 内时继承字段的 `invalid`。
   */
  invalid?: boolean
  /**
   * 是否校验通过。为真时加 `.is-valid`（绿边）。与 `invalid` 同时给出时以 `invalid` 为准。
   */
  valid?: boolean
  /**
   * 是否必填。为真时带上原生 `required`。
   * 放在 `AkField` 内时继承字段的 `required`。
   */
  required?: boolean
  /** 尺寸档：内距与字号（高度由 `rows` 决定）。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkTextarea({ className, label, size = 'md', tokens, style, invalid, valid, required, ...rest }: AkTextareaProps) {
  const field = useContext(AkFieldContext)
  const isInvalid = invalid ?? field.invalid ?? false
  const isValid = !isInvalid && (valid ?? false)
  const isRequired = required ?? field.required ?? false
  return (
    <textarea
      {...rest}
      {...sizeAttrs(size)}
      required={isRequired || undefined}
      aria-label={rest['aria-label'] ?? label}
      aria-invalid={isInvalid || undefined}
      className={cx('ak-textarea', isInvalid && 'is-invalid', isValid && 'is-valid', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-textarea"
    />
  )
}

export interface AkSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  children?: ReactNode
  /**
   * 是否校验失败。为真时加 `.is-invalid`（红边）并置 `aria-invalid`。
   * 放在 `AkField` 内时继承字段的 `invalid`。
   */
  invalid?: boolean
  /**
   * 是否校验通过。为真时加 `.is-valid`（绿边）。与 `invalid` 同时给出时以 `invalid` 为准。
   */
  valid?: boolean
  /**
   * 是否必填。为真时带上原生 `required`。
   * 放在 `AkField` 内时继承字段的 `required`。
   */
  required?: boolean
  /** 尺寸档：高度、内距与字号。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖。 */
  tokens?: AkTokens
}

export function AkSelect({ className, label, children, size = 'md', tokens, style, invalid, valid, required, ...rest }: AkSelectProps) {
  const field = useContext(AkFieldContext)
  const isInvalid = invalid ?? field.invalid ?? false
  const isValid = !isInvalid && (valid ?? false)
  const isRequired = required ?? field.required ?? false
  return (
    <select
      {...rest}
      {...sizeAttrs(size)}
      required={isRequired || undefined}
      aria-label={rest['aria-label'] ?? label}
      aria-invalid={isInvalid || undefined}
      className={cx('ak-select', isInvalid && 'is-invalid', isValid && 'is-valid', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-select"
    >
      {children}
    </select>
  )
}

// ── 勾选 / 单选 / 开关 ──────────────────────────────────────────────

export type AkChoiceVariant = 'checkbox' | 'radio' | 'switch'

export interface AkChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 外观：勾选框 / 单选圆点 / 开关滑块。样式表里对应 `.ak-choice--radio` / `--switch`。 */
  variant?: AkChoiceVariant
  /** 控件右侧的文字。 */
  children?: ReactNode
  /** 输入控件的 `name`（单选组需要）。 */
  name?: string
  /** 尺寸档：图标尺寸、开关宽度、间距与字号。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-choice-fill': '#ff5e19' }`。 */
  tokens?: AkTokens
}

/**
 * 勾选 / 单选 / 开关三合一。
 *
 * 上游样式表把三者做成同一个 `.ak-choice` 的变体（对勾是 `::after` 画的、
 * 开关滑块也是 `::after`），所以这里也是一个组件 + `variant`，不拆三个。
 */
export function AkChoice({
  variant = 'checkbox',
  className,
  children,
  size = 'md',
  tokens,
  style,
  ...rest
}: AkChoiceProps) {
  const isRadio = variant === 'radio'
  return (
    <label
      {...sizeAttrs(size)}
      className={cx(
        'ak-choice',
        variantClass('ak-choice', variant, 'checkbox'),
        rest.disabled && 'ak-choice--disabled',
        className,
      )}
      style={tokenStyle(tokens, style)}
      data-slot="ak-choice"
      data-disabled={rest.disabled || undefined}
    >
      <input
        {...rest}
        type={isRadio ? 'radio' : 'checkbox'}
        role={variant === 'switch' ? 'switch' : undefined}
        className="ak-choice__input"
        onChange={(e) => {
          playTactileSound('toggle')
          rest.onChange?.(e)
        }}
      />
      {children ? <span className="ak-choice__label">{children}</span> : null}
    </label>
  )
}

// ── 表单容器 ────────────────────────────────────────────────────────

export interface AkFormStackProps {
  children: ReactNode
  className?: string
}

/** 表单纵向堆叠容器（固定 `min(100%, 32rem)` 宽）。 */
export function AkFormStack({ children, className }: AkFormStackProps) {
  return (
    <div className={cx('ak-form-stack', className)} data-slot="ak-form-stack">
      {children}
    </div>
  )
}

/** 生成一个可用的字段 id，方便把 label 与控件绑起来。 */
export function useFieldId(prefix = 'ak-field') {
  return useId().replace(/:/g, '') || prefix
}
