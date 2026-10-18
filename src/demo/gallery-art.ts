import type { GalleryItem } from '../ak'
import type { MessageKey } from './i18n'

/** 取词函数的形状 —— 与 `useI18n().t` 兼容，但不依赖 React。 */
export type GalleryTranslator = (key: MessageKey, vars?: Record<string, string | number>) => string

/** Inline SVG art so the gallery demo needs no network access. */
function tile(label: string, from: string, to: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
      <pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0v48" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="960" height="720" fill="url(#g)"/>
    <rect width="960" height="720" fill="url(#p)"/>
    <g fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="3">
      <path d="M120 560 L480 180 L840 560 Z"/>
      <circle cx="480" cy="440" r="86"/>
    </g>
    <text x="48" y="96" fill="#fff" font-family="monospace" font-size="34" letter-spacing="6">${label}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * 素材是内联 SVG，没有可读文案；需要本地化的是 title / description / alt，
 * 所以这里只存 key，真正的字符串在渲染时按当前语言取。
 */
const gallerySpec = [
  {
    id: 'op-01',
    label: 'OBS-01',
    from: '#1b2a4a',
    to: '#0d1626',
    title: 'gallery.op01.title',
    description: 'gallery.op01.desc',
    alt: 'gallery.op01.alt',
  },
  {
    id: 'op-02',
    label: 'OBS-02',
    from: '#3a1f2b',
    to: '#160d14',
    title: 'gallery.op02.title',
    description: 'gallery.op02.desc',
    alt: 'gallery.op02.alt',
  },
  {
    id: 'op-03',
    label: 'OBS-03',
    from: '#123a35',
    to: '#081a17',
    title: 'gallery.op03.title',
    description: 'gallery.op03.desc',
    alt: 'gallery.op03.alt',
  },
] as const satisfies readonly {
  id: string
  label: string
  from: string
  to: string
  title: MessageKey
  description: MessageKey
  alt: MessageKey
}[]

/** 按当前语言产出画廊数据。 */
export function galleryItems(t: GalleryTranslator): GalleryItem[] {
  return gallerySpec.map((item) => ({
    id: item.id,
    title: t(item.title),
    description: t(item.description),
    image: tile(item.label, item.from, item.to),
    alt: t(item.alt),
  }))
}
