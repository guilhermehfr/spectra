'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { BaseForm, TextareaField } from '@/components/ui/shared'
import type { EvolutionFormState } from '@/app/actions/evolution'
import type { Evolution } from '@/lib/types'

interface EvolutionFormProps {
  evolution?: Evolution
  sessionId?: number
  formAction: (state: EvolutionFormState, formData: FormData) => Promise<EvolutionFormState>
  cancelHref: string
}

const initialState: EvolutionFormState = {
  success: false,
  error: undefined,
  errors: undefined,
}

export function EvolutionForm({
  evolution,
  sessionId,
  formAction,
  cancelHref,
}: EvolutionFormProps) {
  const router = useRouter()
  const t = useTranslations('EvolutionForm')
  const tc = useTranslations('Common')
  const [state, action, isPending] = useActionState(formAction, initialState)

  useEffect(() => {
    toast.dismiss()
    if (state.error) {
      toast.error(state.error)
    }
    if (state.success) {
      router.refresh()
      router.push(cancelHref)
    }
  }, [state, router, cancelHref])

  const isEdit = !!evolution

  return (
    <BaseForm
      title={isEdit ? t('editTitle') : t('newTitle')}
      description={isEdit ? t('editDescription') : t('newDescription')}
      action={action}
      cancelHref={cancelHref}
      cancelLabel={tc('cancel')}
      submitLabel={isEdit ? tc('save') : t('submitCreate')}
      isSubmitting={isPending}
    >
      {isEdit && <input type="hidden" name="id" value={evolution.id} />}
      {!isEdit && sessionId && <input type="hidden" name="session" value={sessionId} />}

      <div className="space-y-6">
        <TextareaField
          label={t('objectiveLabel')}
          name="objective"
          placeholder={t('objectivePlaceholder')}
          rows={3}
          required
          defaultValue={evolution?.objective}
          error={state.errors?.objective}
        />

        <TextareaField
          label={t('activitiesLabel')}
          name="activities"
          placeholder={t('activitiesPlaceholder')}
          rows={3}
          required
          defaultValue={evolution?.activities}
          error={state.errors?.activities}
        />

        <TextareaField
          label={t('behaviorLabel')}
          name="behavior"
          placeholder={t('behaviorPlaceholder')}
          rows={3}
          required
          defaultValue={evolution?.behavior}
          error={state.errors?.behavior}
        />

        <TextareaField
          label={t('progressLabel')}
          name="progress"
          placeholder={t('progressPlaceholder')}
          rows={3}
          required
          defaultValue={evolution?.progress}
          error={state.errors?.progress}
        />

        <TextareaField
          label={t('nextStepsLabel')}
          name="next_steps"
          placeholder={t('nextStepsPlaceholder')}
          rows={3}
          required
          defaultValue={evolution?.next_steps}
          error={state.errors?.next_steps}
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="released_to_family"
            name="released_to_family"
            defaultChecked={evolution?.released_to_family}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="released_to_family" className="font-manrope text-sm text-slate-700">
            {t('releaseToFamilyLabel')}
          </label>
        </div>
      </div>
    </BaseForm>
  )
}
