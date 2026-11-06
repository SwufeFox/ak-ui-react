import { AkBarcode, AkButton, AkCard, AkCardContent, AkCardDescription, AkCardFooter, AkCardHeader, AkCardTitle, AkDialog, playTactileSound } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type SurfacesModel = {
  t: I18nValue['t']
  groupPick: 'A' | 'B' | 'C'
  setGroupPick: Dispatch<SetStateAction<'A' | 'B' | 'C'>>
  cardDialog: boolean
  setCardDialog: Dispatch<SetStateAction<boolean>>
}

export function renderSurfaces({ t, groupPick, setGroupPick, cardDialog, setCardDialog }: SurfacesModel, tune: Tune) {
  return <>
    <div className="demo-grid">
      {tune('card-default', <AkCard as="article" hoverable>
        {tune('card-header-default', <AkCardHeader>
          {tune('card-title-default', <AkCardTitle>{t('card.default.title')}</AkCardTitle>)}
          {tune('card-description-default', <AkCardDescription>{t('card.default.desc')}</AkCardDescription>)}
        </AkCardHeader>)}
        {tune('card-content-default', <AkCardContent className="ak-text">{t('card.default.body')}</AkCardContent>)}
        {tune('card-footer-default', <AkCardFooter>
          {tune('card-inspect-default', <AkButton variant="outline" onClick={() => setCardDialog(true)}>{t('common.inspect')}</AkButton>)}
        </AkCardFooter>)}
      </AkCard>)}
      {tune('card-outline', <AkCard
        as="article"
        variant="outline"
        hoverable
        interactive
        selected={groupPick === 'A'}
        onClick={() => {
          playTactileSound('click')
          setGroupPick('A')
        }}
      >
        {tune('card-header-outline', <AkCardHeader>
          {tune('card-title-outline', <AkCardTitle>{t('card.outline.title')}</AkCardTitle>)}
          {tune('card-description-outline', <AkCardDescription>interactive + selected</AkCardDescription>)}
        </AkCardHeader>)}
        {tune('card-content-outline', <AkCardContent className="ak-text">
          {groupPick === 'A' ? 'SELECTED // 选中' : 'CLICK TO SELECT // 点击选中'}
        </AkCardContent>)}
      </AkCard>)}
      {tune('card-stripe', <AkCard as="article" variant="stripe">
        {tune('card-header-stripe', <AkCardHeader>
          {tune('card-title-stripe', <AkCardTitle>{t('card.stripe.title')}</AkCardTitle>)}
          {tune('card-description-stripe', <AkCardDescription>{t('card.stripe.desc')}</AkCardDescription>)}
        </AkCardHeader>)}
        {tune('card-content-stripe', <AkCardContent className="ak-text">variant="stripe"</AkCardContent>)}
      </AkCard>)}
      {tune('card-glass', <AkCard as="article" variant="glass" chamfer hoverable>
        {tune('card-header-glass', <AkCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {tune('card-title-glass', <AkCardTitle>HUD GLASS // 亚克力面板</AkCardTitle>)}
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ak-font-mono)', color: 'var(--ak-signal-info)' }}>PRTS.HUD</span>
          </div>
          {tune('card-description-glass', <AkCardDescription>variant="glass" · 战术斜切 + 磨砂毛玻璃</AkCardDescription>)}
        </AkCardHeader>)}
        {tune('card-content-glass', <AkCardContent className="ak-text">
          半透明战术亚克力材质，融合 backdrop-filter 模糊与辉光边界。
        </AkCardContent>)}
        {tune('card-footer-glass', <AkCardFooter>
          {tune('card-inspect-glass', <AkButton chamfer variant="ghost" size="sm" onClick={() => setCardDialog(true)}>INSPECT</AkButton>)}
        </AkCardFooter>)}
      </AkCard>)}
      {tune('card-tactical', <AkCard as="article" variant="tactical" chamfer hoverable>
        {tune('card-header-tactical', <AkCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {tune('card-title-tactical', <AkCardTitle>TACTICAL // 战术终端</AkCardTitle>)}
            {tune('barcode-tactical', <AkBarcode />)}
          </div>
          {tune('card-description-tactical', <AkCardDescription>variant="tactical" + chamfer · 4角发丝准星 + 战术光轨</AkCardDescription>)}
        </AkCardHeader>)}
        {tune('card-content-tactical', <AkCardContent className="ak-text">
          搭载四角发丝级 L-Reticles、右上角切角、顶部全息信号条与深邃复合材质阴影。
        </AkCardContent>)}
        {tune('card-footer-tactical', <AkCardFooter>
          {tune('card-inspect-tactical', <AkButton chamfer variant="action" size="sm" onClick={() => setCardDialog(true)}>TACTICAL VIEW</AkButton>)}
        </AkCardFooter>)}
      </AkCard>)}
      {tune('card-chassis', <AkCard as="article" variant="chassis" hoverable>
        {tune('card-header-chassis', <AkCardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {tune('card-title-chassis', <AkCardTitle>CHASSIS // 军工装甲板</AkCardTitle>)}
            {tune('barcode-chassis', <AkBarcode />)}
          </div>
          {tune('card-description-chassis', <AkCardDescription>variant="chassis" · 边缘警戒斜纹 + 双轨金属轮廓</AkCardDescription>)}
        </AkCardHeader>)}
        {tune('card-content-chassis', <AkCardContent className="ak-text">
          军工重装机甲外壳，左侧警戒斜纹与凹刻双重金属框，专为重度工业与防暴系统设计。
        </AkCardContent>)}
        {tune('card-footer-chassis', <AkCardFooter>
          {tune('card-inspect-chassis', <AkButton chamfer variant="action" size="sm" onClick={() => setCardDialog(true)}>ARMOR ENGAGE</AkButton>)}
        </AkCardFooter>)}
      </AkCard>)}
    </div>
    {tune('card-dialog', <AkDialog
      open={cardDialog}
      onOpenChange={setCardDialog}
      eyebrow={t('card.default.title')}
      title={t('card.default.title')}
      footer={
        <>
          <AkButton variant="outline" size="sm" onClick={() => setCardDialog(false)}>
            {t('common.cancel')}
          </AkButton>
          <AkButton variant="action" size="sm" onClick={() => setCardDialog(false)}>
            {t('common.confirm')}
          </AkButton>
        </>
      }
    >
      {t('card.default.body')}
    </AkDialog>)}
  </>
}
