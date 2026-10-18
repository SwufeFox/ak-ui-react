import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createMediaGallery, type GalleryController } from '../../core/site.mjs'
import { useInstanceId } from '../../lib/useId'

export interface GalleryItem {
  /** Unique stable key within this gallery. */
  id: string
  title: string
  description?: string
  image?: string
  alt?: string
}

export interface AkMediaGalleryProps {
  items: GalleryItem[]
  label?: string
  loop?: boolean
  previousLabel?: string
  nextLabel?: string
  expandLabel?: string
  closeLabel?: string
  emptyLabel?: string
  /** 轮播角色的读屏描述。默认 `carousel`。 */
  roleDescription?: string
  /** Controlled active index. Omit for uncontrolled. */
  value?: number
  onValueChange?: (index: number) => void
  /** Custom slide media, replacing the default <img>. */
  renderMedia?: (item: GalleryItem, index: number) => ReactNode
  className?: string
}

export function AkMediaGallery({
  items,
  label = 'Media gallery',
  loop = true,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  expandLabel = 'Expand image',
  closeLabel = 'Close image',
  emptyLabel = 'No items',
  roleDescription = 'carousel',
  value,
  onValueChange,
  renderMedia,
  className,
}: AkMediaGalleryProps) {
  const id = useInstanceId('ak-gallery')
  const rootRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<GalleryController | null>(null)
  const committedRef = useRef(value ?? 0)
  const skipSyncRef = useRef<number | null>(null)
  const onValueChangeRef = useRef(onValueChange)
  const [state, setState] = useState(value ?? 0)

  const index = value ?? state
  onValueChangeRef.current = onValueChange

  // The controller owns selection, aria wiring, motion and the expanded dialog;
  // React only mirrors the reported index back into state.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = createMediaGallery(root, {
      initialIndex: committedRef.current,
      loop,
      onChange: (next) => {
        committedRef.current = next
        skipSyncRef.current = next
        setState(next)
        onValueChangeRef.current?.(next)
      },
    })
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-read the DOM after items change, preserving the previously selected slide id.
  useEffect(() => {
    controllerRef.current?.refresh()
  }, [items, id])

  // Accept external index changes without re-entering the controller callback.
  useEffect(() => {
    if (value === undefined) return
    if (skipSyncRef.current === value) {
      skipSyncRef.current = null
      return
    }
    const controller = controllerRef.current
    if (controller && controller.index !== value) {
      committedRef.current = value
      controller.select(value)
    }
  }, [value])

  return (
    <div
      ref={rootRef}
      className={className ? `ak-gallery ${className}` : 'ak-gallery'}
      role="region"
      aria-label={label}
      aria-roledescription={roleDescription}
    >
      <div className="ak-gallery__stage" data-ak-gallery-stage>
        {items.map((item, i) => (
          <article
            key={item.id}
            id={`${id}-${item.id}`}
            className="ak-gallery__item"
            data-ak-gallery-item
            hidden={i !== index}
          >
            {renderMedia ? (
              renderMedia(item, i)
            ) : item.image ? (
              <img className="ak-gallery__image" src={item.image} alt={item.alt ?? ''} width={960} height={720} loading="lazy" />
            ) : null}
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
        {!items.length ? <p>{emptyLabel}</p> : null}
      </div>
      <div className="ak-gallery__controls">
        <button className="ak-site-control" type="button" data-ak-gallery-prev aria-label={previousLabel}>
          ←
        </button>
        <div className="ak-gallery__selectors" role="group" aria-label={label}>
          {items.map((item, i) => (
            <button
              key={item.id}
              className="ak-site-control"
              type="button"
              data-ak-gallery-select
              aria-label={item.title}
              aria-pressed={index === i}
              tabIndex={index === i ? 0 : -1}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
        <button className="ak-site-control" type="button" data-ak-gallery-next aria-label={nextLabel}>
          →
        </button>
        <span data-ak-gallery-current aria-live="polite" aria-atomic="true">
          {items.length ? index + 1 : 0} / {items.length}
        </span>
        <button className="ak-site-control" type="button" data-ak-gallery-open>
          {expandLabel}
        </button>
      </div>
      <dialog className="ak-gallery__dialog" data-ak-gallery-dialog aria-label={expandLabel}>
        <button className="ak-site-control" type="button" data-ak-gallery-close autoFocus>
          {closeLabel}
        </button>
        <img alt="" />
      </dialog>
    </div>
  )
}
