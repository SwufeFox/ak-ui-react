import { AkFormStack, AkField, AkFieldLabel, AkInput, AkSelect, AkTextarea, AkChoice } from '../../ak'
import type { Dispatch, SetStateAction } from 'react'
import type { I18nValue } from '../i18n'
import type { Tune } from '../example-tune'


export type FormsModel = { t: I18nValue['t']; fieldName: string; setFieldName: Dispatch<SetStateAction<string>>; selectPick: string; setSelectPick: Dispatch<SetStateAction<string>>; noteText: string; setNoteText: Dispatch<SetStateAction<string>>; choiceA: boolean; setChoiceA: Dispatch<SetStateAction<boolean>>; choiceB: boolean; setChoiceB: Dispatch<SetStateAction<boolean>> }

export function renderForms({ t, fieldName, setFieldName, selectPick, setSelectPick, noteText, setNoteText, choiceA, setChoiceA, choiceB, setChoiceB }: FormsModel, tune: Tune) {
  return tune("form-stack-1", <AkFormStack>
          {tune("field-1", <AkField hint={t('common.fieldHint')}>
            {tune("field-label-1", <AkFieldLabel htmlFor="demo-field">{t('common.fieldName')}</AkFieldLabel>)}
          {/* 受控输入 + 回显：不接 value 的话，打字虽然能进去，但示例里
              看不出"这个组件真的在受控状态工作" */}
          {tune("input-1", <AkInput
            id="demo-field"
            placeholder="R001"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />)}
        </AkField>)}

        {tune("field-2", <AkField>
          {tune("select-1", <AkSelect
            aria-label={t('common.selectPlaceholder')}
            value={selectPick}
            onChange={(e) => setSelectPick(e.target.value)}
          >
            <option value="" disabled>
              {t('common.selectPlaceholder')}
            </option>
            <option value="a">Alpha</option>
            <option value="b">Bravo</option>
          </AkSelect>)}
        </AkField>)}

        {tune("field-3", <AkField>
          {tune("field-label-3", <AkFieldLabel htmlFor="demo-note">{t('common.noteLabel')}</AkFieldLabel>)}
          {tune("textarea-1", <AkTextarea
            id="demo-note"
            rows={3}
            placeholder={t('common.textareaPlaceholder')}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />)}
        </AkField>)}

        {tune("field-4", <AkField invalid hint={t('common.fieldHint')}>
          {tune("field-label-4", <AkFieldLabel htmlFor="demo-invalid">{t('common.invalidLabel')}</AkFieldLabel>)}
          {tune("input-2", <AkInput id="demo-invalid" defaultValue="bad!" aria-invalid="true" />)}
        </AkField>)}

        <div className="demo-row">
          {tune("choice-1", <AkChoice checked={choiceA} onChange={(e) => setChoiceA(e.target.checked)}>
            {t('common.choiceCheck')}
          </AkChoice>)}
          {tune("choice-2", <AkChoice variant="radio" name="demo-deck" defaultChecked>
            {t('common.choiceRadio')}
          </AkChoice>)}
          {tune("choice-3", <AkChoice variant="switch" checked={choiceB} onChange={(e) => setChoiceB(e.target.checked)}>
            {t('common.choiceSwitch')}
          </AkChoice>)}
        </div>

        <div className="demo-row" style={{ alignItems: 'center' }}>
          <span className="demo-note">{t('ref.inputs.sizeTiers')}</span>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            tune(`choice-4-${String(s)}`, <AkChoice key={s} size={s} variant="switch" defaultChecked>
              {s}
            </AkChoice>)
          ))}
        </div>

        {/* 实时回显：证明每个控件都真的在受控 */}
        <p className="demo-note" aria-live="polite">
          {t('ref.form.liveEcho', {
            name: fieldName || '—',
            pick: selectPick || '—',
            note: noteText || '—',
            check: choiceA ? 'on' : 'off',
            toggle: choiceB ? 'on' : 'off',
          })}
        </p>
      </AkFormStack>)
}
