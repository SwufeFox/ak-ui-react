/** 示例块的四个视图。 */
export type DemoView = 'preview' | 'tune' | 'code' | 'api'

/** 当前视图写在地址栏的 ?view= 上，这样代码页与属性页可以直接分享。 */
export function readViewParam(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('view')
}

export function writeViewParam(view: DemoView) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (view === 'preview') url.searchParams.delete('view')
  else url.searchParams.set('view', view)
  const next = `${url.pathname}${url.search}${url.hash}`
  if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(null, '', next)
  }
}
