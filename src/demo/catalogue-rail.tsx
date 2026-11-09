import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { playTactileSound } from '../ak'
import { useI18n } from './i18n'
import { CATEGORIES, CATEGORY_COMPONENTS, CATEGORY_KEYWORDS } from './catalogue-data'

export function CatalogueRail({ active, selectCategory }: { active: string; selectCategory: (id: string, focus?: boolean) => void }) {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const categoryListRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLSpanElement>(null)
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return CATEGORIES
    return CATEGORIES.filter((category, index) => {
      const num = String(index + 1).padStart(2, '0')
      const title = t(category.title).toLowerCase()
      const keywords = CATEGORY_KEYWORDS[category.id] ?? []
      return (
        num.includes(query) ||
        category.id.includes(query) ||
        title.includes(query) ||
        CATEGORY_COMPONENTS[category.id].some((name) => name.toLowerCase().includes(query)) ||
        keywords.some((kw) => kw.toLowerCase().includes(query))
      )
    })
  }, [searchQuery, t])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === '/' && !document.querySelector('dialog[open]') && !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useLayoutEffect(() => {
    const list = categoryListRef.current
    if (!list) return
    // Only the horizontal rail (≤900px) needs the active item scrolled into view. On desktop
    // these geometry reads would force layout of the category block that just mounted.
    const horizontalRail = window.matchMedia('(max-width: 900px)')
    const revealActive = () => {
      if (!horizontalRail.matches) return
      if (list.scrollWidth <= list.clientWidth) return
      const item = list.querySelector<HTMLElement>('[aria-current]')
      if (!item) return
      const rail = list.getBoundingClientRect()
      const selected = item.getBoundingClientRect()
      if (selected.left < rail.left || selected.width > list.clientWidth) {
        list.scrollLeft += selected.left - rail.left
      } else if (selected.right > rail.right) {
        list.scrollLeft += selected.right - rail.right
      }
    }
    // Run after the browser has laid out the new block instead of inside the commit.
    const frame = requestAnimationFrame(revealActive)
    window.addEventListener('resize', revealActive)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', revealActive)
    }
  }, [active, filteredCategories])

  // 选中标记滑到当前分类：桌面纵向轨道用滑动竖线，横向轨道用下边线。
  useLayoutEffect(() => {
    const list = categoryListRef.current
    const marker = markerRef.current
    if (!list || !marker) return
    const place = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        marker.dataset.visible = 'false'
        return
      }
      const item = list.querySelector<HTMLElement>('[aria-current]')
      if (!item) {
        marker.dataset.visible = 'false'
        return
      }
      marker.dataset.visible = 'true'
      marker.style.transform = `translate3d(0, ${item.offsetTop}px, 0)`
      marker.style.height = `${item.offsetHeight}px`
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active, filteredCategories])

  return (
    <nav className="demo-rail" aria-label={t('ref.catalogue.rail')}>
      <div className="demo-rail__head">
        <span className="demo-rail__eyebrow">{t('ref.catalogue.rail')}</span>
        <span className="demo-rail__count" aria-live="polite">{t('ref.catalogue.count', { n: filteredCategories.length })}</span>
      </div>
      <div className="demo-rail__search-box">
        <span className="demo-rail__search-icon" aria-hidden="true">⌕</span>
        <input
          ref={searchInputRef}
          type="text"
          name="catalogue-search"
          autoComplete="off"
          spellCheck={false}
          className="demo-rail__search-input"
          aria-label={t('ref.catalogue.search')}
          placeholder={t('ref.catalogue.searchPlaceholder')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return
            if (event.key === 'Escape') setSearchQuery('')
            if (event.key === 'ArrowDown' && filteredCategories.length > 0) {
              event.preventDefault()
              categoryListRef.current?.querySelector<HTMLElement>('.demo-rail__item')?.focus()
              return
            }
            if (event.key === 'ArrowUp' && filteredCategories.length > 0) {
              event.preventDefault()
              const results = categoryListRef.current?.querySelectorAll<HTMLElement>('.demo-rail__item')
              results?.item(filteredCategories.length - 1)?.focus()
              return
            }
            if (event.key === 'Enter' && filteredCategories.length === 1) {
              event.preventDefault()
              selectCategory(filteredCategories[0]!.id, true)
            }
          }}
        />
        {searchQuery && (
          <button type="button" className="demo-rail__search-clear" aria-label={t('ref.catalogue.clearSearch')} onClick={() => {
            setSearchQuery('')
            searchInputRef.current?.focus()
          }}>
            ✕
          </button>
        )}
      </div>
      <div ref={categoryListRef} className="demo-rail__list">
        <span className="demo-rail__marker" ref={markerRef} data-visible="false" aria-hidden="true" />
        {filteredCategories.length === 0 ? (
          <div className="demo-rail__empty">
            <span className="demo-rail__empty-title">{t('ref.catalogue.empty')}</span>
            <button type="button" className="demo-rail__empty-reset" onClick={() => {
              setSearchQuery('')
              searchInputRef.current?.focus()
            }}>
              {t('ref.catalogue.reset')}
            </button>
          </div>
        ) : filteredCategories.map((category) => {
          const originalIndex = CATEGORIES.findIndex((item) => item.id === category.id)
          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="demo-rail__item"
              aria-current={active === category.id ? 'location' : undefined}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                playTactileSound('tab', 0.16)
                // Keyboard activation moves focus to the new section; mouse clicks keep focus on the rail.
                selectCategory(category.id, event.detail === 0)
              }}
            >
              <span className="demo-rail__index">{String(originalIndex + 1).padStart(2, '0')}</span>
              <span className="demo-rail__label">{t(category.title)}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
