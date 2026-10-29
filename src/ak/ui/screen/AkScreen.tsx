import { useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { tokenStyle, type AkTokens } from '../../lib/tokens'
import { playTactileSound } from '../../lib/audio'

export type AkScreenTone = 'dark' | 'paper' | 'muted' | 'cyan'

export interface AkScreenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 终端色调修饰符，对应命令色彩方案：'dark' | 'paper' | 'muted' | 'cyan'。 */
  tone?: AkScreenTone
  /** 顶栏主标题。 */
  title: ReactNode
  /** 标题上方的小标/分类代码。 */
  eyebrow?: ReactNode
  /** 顶栏右侧的资源信息槽位（理智、龙门币、合成玉等读数）。 */
  meta?: ReactNode
  /** 顶栏状态指示槽位（如信号状态、连接状态、运行指标）。 */
  status?: ReactNode
  /** 返回按钮标签，默认为 'BACK'。 */
  backLabel?: ReactNode
  /** 点击返回按钮的回调。若不传则不渲染返回按钮。 */
  onBack?: () => void
  /** 是否监听 Escape 键自动触发 onBack。默认为 false。 */
  closeOnEsc?: boolean
  /** 右下角装饰水印。 */
  watermark?: ReactNode
  /** 正在退场状态（播放离场动画）。 */
  leaving?: boolean
  /** 逐实例令牌覆盖，例如 `{ '--ak-screen-signal': '#ff5e19' }`。 */
  tokens?: AkTokens
  /** 屏幕内部主体内容。 */
  children?: ReactNode
}

const escStack: (() => void)[] = []

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !event.defaultPrevented && escStack.length > 0) {
      event.preventDefault()
      const topHandler = escStack[escStack.length - 1]
      topHandler?.()
    }
  })
}

/**
 * 终端全屏功能面板（Command Screen）。
 *
 * 对应 `_ak-screen.scss`：具备色调继承顶栏、战术快门百叶窗入场动画、
 * 信号指示下划线以及大号水印。
 */
export function AkScreen({
  tone = 'dark',
  title,
  eyebrow,
  meta,
  status,
  backLabel = 'BACK',
  onBack,
  closeOnEsc = false,
  watermark,
  leaving = false,
  tokens,
  className,
  style,
  children,
  ...rest
}: AkScreenProps) {
  useEffect(() => {
    if (!closeOnEsc || !onBack || leaving) return
    const handler = () => {
      playTactileSound('click', 0.16)
      onBack()
    }
    escStack.push(handler)
    return () => {
      const idx = escStack.lastIndexOf(handler)
      if (idx !== -1) escStack.splice(idx, 1)
    }
  }, [closeOnEsc, onBack, leaving])

  return (
    <div
      {...rest}
      className={cx(
        'ak-screen',
        `ak-screen--${tone}`,
        leaving && 'is-leaving',
        className,
      )}
      style={tokenStyle(tokens, style)}
      data-slot="ak-screen"
      data-tone={tone}
    >
      <header className="ak-screen__bar">
        {onBack ? (
          <button
            type="button"
            className="ak-screen__back"
            onClick={() => {
              playTactileSound('click', 0.16)
              onBack()
            }}
            aria-label={typeof backLabel === 'string' ? backLabel : 'Back'}
          >
            <span aria-hidden="true">‹</span>
            <span>{backLabel}</span>
          </button>
        ) : null}

        <div className="ak-screen__heading">
          {eyebrow ? <span className="ak-screen__eyebrow">{eyebrow}</span> : null}
          <h1 className="ak-screen__title" tabIndex={-1}>
            {title}
          </h1>
        </div>

        {status ? <div className="ak-screen__status">{status}</div> : null}
        {meta ? <div className="ak-screen__meta">{meta}</div> : null}
      </header>

      <main className="ak-screen__body">
        {children}
      </main>

      {watermark ? (
        <span className="ak-screen__watermark" aria-hidden="true">
          {watermark}
        </span>
      ) : null}
    </div>
  )
}
