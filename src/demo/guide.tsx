import { useCallback, useState } from 'react'
import { GUIDE_CONTENT } from './guide-content'
import { useI18n } from './i18n'
import { playTactileSound } from '../ak'
import { pushReceipt, formatBytes } from './receipt'
import { tokenizeTsx } from './highlight'
import type { GuideSnippet } from './guide-content'

/** 可复制的代码片段。复制成功会走同一条回执通道，与代码页一致。 */
function Snippet({ snippet, copyLabel, copiedLabel }: { snippet: GuideSnippet; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      playTactileSound('confirm', 0.2)
      setCopied(true)
      pushReceipt({ label: copiedLabel, detail: formatBytes(snippet.code.length) })
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      playTactileSound('warn', 0.2)
    }
  }, [snippet.code, copiedLabel])

  const tokens = snippet.tsx ? tokenizeTsx(snippet.code) : null

  return (
    <figure className="demo-snippet">
      <figcaption className="demo-snippet__bar">
        <span className="demo-snippet__label">{snippet.label}</span>
        <button type="button" className="demo-snippet__copy" onClick={copy}>
          {copied ? copiedLabel : copyLabel}
        </button>
      </figcaption>
      <pre className="demo-snippet__code"><code>
        {tokens
          ? tokens.map((token, index) => token.kind === 'plain'
            ? token.text
            : <span key={index} className={`tok tok-${token.kind}`}>{token.text}</span>)
          : snippet.code}
      </code></pre>
    </figure>
  )
}

/**
 * 指南视图。
 *
 * 站点自己的说明书：安装、主题与密度、调参与导出、交互层、可达性、资源。
 * 正文与界面文案分开放（`guide-content.ts`），但两套语言必须齐全——由类型保证。
 */
export function GuideView({ onBack }: { onBack: () => void }) {
  const { locale } = useI18n()
  const content = GUIDE_CONTENT[locale]

  return (
    <article className="demo-guide">
      <header className="demo-guide__hero">
        <div className="demo-guide__intro">
          <span className="demo-eyebrow">{content.eyebrow}</span>
          <h1 className="demo-guide__title">{content.title}</h1>
          <p className="demo-guide__lead">{content.lead}</p>
        </div>
        <button type="button" className="demo-guide__back" onClick={onBack}>
          <span aria-hidden="true">←</span> {content.back}
        </button>
      </header>

      <div className="demo-guide__body">
        {content.sections.map((section) => (
          <section className="demo-guide__section" key={section.id} id={`guide-${section.id}`}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.items && (
              <dl className="demo-guide__list">
                {section.items.map((item) => (
                  <div className="demo-guide__row" key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.desc}</dd>
                  </div>
                ))}
              </dl>
            )}
            {section.snippets?.map((snippet) => (
              <Snippet key={snippet.label} snippet={snippet} copyLabel={content.copy} copiedLabel={content.copied} />
            ))}
          </section>
        ))}
      </div>
    </article>
  )
}
