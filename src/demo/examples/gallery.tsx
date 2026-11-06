import { AkMediaAlbum, AkMediaGallery, AkOverline } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { GalleryItem } from '../../ak'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type GalleryModel = {
  t: I18nValue['t']
  galleryIndex: number
  setGalleryIndex: Dispatch<SetStateAction<number>>
  items: GalleryItem[]
}

export function renderGallery({ t, galleryIndex, setGalleryIndex, items }: GalleryModel, tune: Tune) {
  const [albumFront, albumBack] = items
  return <>
    {tune('media-gallery', <AkMediaGallery
      items={items}
      value={galleryIndex}
      onValueChange={setGalleryIndex}
      label={t('media.gallery')}
      previousLabel={t('media.previous')}
      nextLabel={t('media.next')}
      expandLabel={t('media.expand')}
      closeLabel={t('media.close')}
      emptyLabel={t('media.empty')}
      roleDescription={t('media.carousel')}
    />)}
    <p className="demo-note" style={{ marginTop: 'var(--ak-space-4)', marginBottom: 0 }}>
      {t('ref.gallery.activeIndex', { n: galleryIndex })}
    </p>
    <div style={{ marginTop: 'var(--ak-space-5, 1.5rem)' }}>
      {tune('album-title', <AkOverline>{t('ref.album.title')}</AkOverline>)}
      {albumFront?.image ? (
        <div className="demo-row" style={{ marginTop: 'var(--ak-space-3, 0.75rem)', alignItems: 'flex-start' }}>
          <figure style={{ margin: 0 }}>
            {tune('album-front-legacy', <AkMediaAlbum src={albumFront.image} alt={albumFront.alt} style={{ width: '11rem' }} />)}
            <figcaption className="demo-note">{t('ref.album.legacy')}</figcaption>
          </figure>
          <figure style={{ margin: 0 }}>
            {tune('album-front-layered', <AkMediaAlbum
              src={albumFront.image}
              alt={albumFront.alt}
              backSrc={albumBack?.image}
              layered
              splitEnter
              style={{ width: '11rem' }}
            />)}
            <figcaption className="demo-note">{t('ref.album.layered')}</figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  </>
}
