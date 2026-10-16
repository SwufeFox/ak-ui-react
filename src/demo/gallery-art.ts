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

export const galleryItems = [
  { id: 'op-01', title: 'OPERATION 01 · 破晓', description: '前线作战记录 / DAYBREAK', image: tile('OBS-01', '#1b2a4a', '#0d1626'), alt: 'Operations record 01' },
  { id: 'op-02', title: 'OPERATION 02 · 静默', description: '夜间行动影像 / SILENCE', image: tile('OBS-02', '#3a1f2b', '#160d14'), alt: 'Operations record 02' },
  { id: 'op-03', title: 'OPERATION 03 · 升变', description: '源石技艺档案 / ASCENSION', image: tile('OBS-03', '#123a35', '#081a17'), alt: 'Operations record 03' },
]
