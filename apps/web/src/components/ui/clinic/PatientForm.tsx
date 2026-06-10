'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { BaseForm, InputField, TextareaField } from '@/components/ui/shared'
import type { Patient } from '@/lib/types'
import type { PatientFormState } from '@/app/actions/patient'

interface PatientFormProps {
  patient?: Patient
  formAction: (state: PatientFormState, formData: FormData) => Promise<PatientFormState>
  cancelHref: string
}

const initialState: PatientFormState = {
  success: false,
  error: undefined,
  errors: undefined,
}

export function PatientForm({ patient, formAction, cancelHref }: PatientFormProps) {
  const router = useRouter()
  const t = useTranslations('Patients')
  const tc = useTranslations('Common')
  const [state, action, isPending] = useActionState(formAction, initialState)

  useEffect(() => {
    toast.dismiss()
    if (state.error) {
      toast.error(state.error)
    }
    if (state.success) {
      router.refresh()
      router.push('/clinic/patients')
    }
  }, [state, router])

  const isEdit = !!patient

  return (
    <BaseForm
      title={isEdit ? t('editTitle') : t('newPatient')}
      description={isEdit ? t('editDescription') : t('newDescription')}
      action={action}
      cancelHref={cancelHref}
      cancelLabel={tc('cancel')}
      submitLabel={isEdit ? tc('save') : t('register')}
      isSubmitting={isPending}
    >
      {isEdit && <input type="hidden" name="id" value={patient.id} />}

      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label={t('formName')}
          name="name"
          placeholder={t('formNamePlaceholder')}
          required
          defaultValue={patient?.name}
          error={state.errors?.name}
        />

        <InputField
          label={t('formBirthDate')}
          name="birth_date"
          type="date"
          required
          defaultValue={patient?.birth_date}
          error={state.errors?.birth_date}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label={t('formGuardian')}
          name="guardian_name"
          placeholder={t('formGuardianPlaceholder')}
          required
          defaultValue={patient?.guardian_name}
          error={state.errors?.guardian_name}
        />

        <InputField
          label={t('formGuardianEmail')}
          name="guardian_email"
          type="email"
          placeholder={t('formGuardianEmailPlaceholder')}
          required
          defaultValue={patient?.guardian_email}
          error={state.errors?.guardian_email}
        />
      </div>

      <TextareaField
        label={t('formNotes')}
        name="notes"
        placeholder={t('formNotesPlaceholder')}
        rows={4}
        defaultValue={patient?.notes}
      />
    </BaseForm>
  )
}
