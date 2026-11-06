import { AkInputNumber, AkSegmented, AkSlider } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'

export type InputModel = {
  t: I18nValue['t']
  slider: number
  setSlider: Dispatch<SetStateAction<number>>
  segment: string
  setSegment: Dispatch<SetStateAction<string>>
}

export function renderInputs({ t, slider, setSlider, segment, setSegment }: InputModel, tune: Tune) {
  const segmentOptions = [
    { label: t('common.all'), value: 'all', icon: <span>◈</span>, badge: '12' },
    { label: t('ref.inputs.ground'), value: 'ground', icon: <span>▼</span>, badge: '8' },
    { label: t('ref.inputs.air'), value: 'air', icon: <span>▲</span>, badge: '4' },
  ]
  return <div className="demo-stack">
    {tune('slider-volume', <AkSlider label={t('ref.inputs.volume')} value={slider} onValueChange={(v) => setSlider(Number.isFinite(v) ? v : 0)} />)}
    <span className="ak-text">{t('ref.inputs.sliderValue', { n: slider })}</span>
    {tune('input-number-main', <AkInputNumber
      value={slider}
      max={100}
      label={t('common.numberField')}
      increaseLabel={t('common.increase')}
      decreaseLabel={t('common.decrease')}
      maxLabel={t('common.maxLabel')}
      minLabel={t('common.minLabel')}
      onValueChange={setSlider}
    />)}
    <div className="demo-stack">
      <span className="demo-note">{t('ref.inputs.sizeTiers')}</span>
      <div className="demo-row" style={{ alignItems: 'center' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          tune(`input-number-${size}`, <AkInputNumber
            key={size}
            size={size}
            value={slider}
            max={100}
            label={`${t('common.numberField')} ${size}`}
            increaseLabel={t('common.increase')}
            decreaseLabel={t('common.decrease')}
            maxLabel={t('common.maxLabel')}
            minLabel={t('common.minLabel')}
            onValueChange={setSlider}
          />)
        ))}
      </div>
    </div>
    {tune('segmented-roster-filter', <AkSegmented
      ariaLabel={t('console.roster.filter')}
      options={segmentOptions}
      value={segment}
      onValueChange={(value) => setSegment(value ?? 'all')}
    />)}
    <span className="ak-text">
      {t('ref.inputs.selected', { value: segmentOptions.find((option) => option.value === segment)?.label ?? segment })}
    </span>
    <div className="demo-row" style={{ alignItems: 'center' }}>
      <span className="demo-note">{t('ref.inputs.sizeTiers')}</span>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        tune(`slider-${size}`, <AkSlider
          key={size}
          size={size}
          label={`volume-${size}`}
          value={slider}
          onValueChange={(v) => setSlider(Number.isFinite(v) ? v : 0)}
        />)
      ))}
    </div>
  </div>
}
