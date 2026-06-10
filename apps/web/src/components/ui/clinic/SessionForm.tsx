'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { BaseForm, InputField, TextareaField, SelectField } from '@/components/ui/shared'
import type { SessionFormState } from '@/app/actions/session'
import type { Patient, User } from '@/lib/types'

interface SessionFormProps {
  session?: {
    id: number
    patient: number
    therapist: number
    date_time: string
    notes: string
    status: 'scheduled' | 'completed' | 'canceled'
  }
  patients: Patient[]
  currentUser: User
  therapists?: User[]
  selectedPatientId?: number
  formAction: (state: SessionFormState, formData: FormData) => Promise<SessionFormState>
  cancelHref: string
}

const initialState: SessionFormState = {
  success: false,
  error: undefined,
  errors: undefined,
}

export function SessionForm({
  session,
  patients,
  currentUser,
  therapists,
  selectedPatientId,
  formAction,
  cancelHref,
}: SessionFormProps) {
  const router = useRouter()
  const t = useTranslations('SessionForm')
  const tc = useTranslations('Common')
  const [state, action, isPending] = useActionState(formAction, initialState)

  useEffect(() => {
    toast.dismiss()
    if (state.error) {
      toast.error(state.error)
    }
    if (state.success) {
      router.refresh()
      router.push('/clinic/sessions')
    }
  }, [state, router])

  const isEdit = !!session
  const isAdmin = currentUser.role === 'admin'
  const showTherapistSelect = isAdmin && therapists && therapists.length > 0
  const formattedDateTime = session?.date_time ? session.date_time.slice(0, 16) : ''
  const minDateTime = new Date().toISOString().slice(0, 16)

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
      {isEdit && <input type="hidden" name="id" value={session.id} />}

      <div className="space-y-6">
        <SelectField
          label={t('patientLabel')}
          name="patient"
          required
          defaultValue={session?.patient?.toString() || selectedPatientId?.toString() || ''}
          error={state.errors?.patient}
        >
          <option value="" disabled>
            {t('patientPlaceholder')}
          </option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </SelectField>

        {isEdit ? (
          <input type="hidden" name="therapist" value={session.therapist} />
        ) : showTherapistSelect ? (
          <SelectField
            label={t('therapistLabel')}
            name="therapist"
            required
            defaultValue=""
            error={state.errors?.therapist}
          >
            <option value="" disabled>
              {t('therapistPlaceholder')}
            </option>
            {therapists!.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.first_name} {therapist.last_name}
              </option>
            ))}
          </SelectField>
        ) : (
          <input type="hidden" name="therapist" value={currentUser.id} />
        )}

        <InputField
          label={t('dateTimeLabel')}
          name="date_time"
          type="datetime-local"
          required
          min={minDateTime}
          defaultValue={formattedDateTime}
          error={state.errors?.date_time}
          suppressHydrationWarning
        />

        <TextareaField
          label={t('notesLabel')}
          name="notes"
          placeholder={t('notesPlaceholder')}
          rows={3}
          defaultValue={session?.notes || ''}
        />

        {isEdit && (
          <SelectField
            label={t('statusLabel')}
            name="status"
            required
            defaultValue={session?.status || 'scheduled'}
            error={state.errors?.status}
          >
            <option value="scheduled">{t('statusScheduled')}</option>
            <option value="completed">{t('statusCompleted')}</option>
            <option value="canceled">{t('statusCanceled')}</option>
          </SelectField>
        )}
      </div>
    </BaseForm>
  )
}
