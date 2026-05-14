'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
      title={isEdit ? 'Editar Sessão' : 'Nova Sessão'}
      description={
        isEdit ? 'Atualize as informações da sessão.' : 'Agende uma nova sessão terapêutica.'
      }
      action={action}
      cancelHref={cancelHref}
      cancelLabel="Cancelar"
      submitLabel={isEdit ? 'Salvar' : 'Agendar'}
      isSubmitting={isPending}
    >
      {isEdit && <input type="hidden" name="id" value={session.id} />}

      <div className="space-y-6">
        <SelectField
          label="Paciente"
          name="patient"
          required
          defaultValue={session?.patient?.toString() || selectedPatientId?.toString() || ''}
          error={state.errors?.patient}
        >
          <option value="" disabled>
            Selecione um paciente
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
            label="Terapeuta"
            name="therapist"
            required
            defaultValue=""
            error={state.errors?.therapist}
          >
            <option value="" disabled>
              Selecione um terapeuta
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
          label="Data e Horário"
          name="date_time"
          type="datetime-local"
          required
          min={minDateTime}
          defaultValue={formattedDateTime}
          error={state.errors?.date_time}
          suppressHydrationWarning
        />

        <TextareaField
          label="Observações"
          name="notes"
          placeholder="Informações adicionais sobre a sessão..."
          rows={3}
          defaultValue={session?.notes || ''}
        />

        {isEdit && (
          <SelectField
            label="Status"
            name="status"
            required
            defaultValue={session?.status || 'scheduled'}
            error={state.errors?.status}
          >
            <option value="scheduled">Agendada</option>
            <option value="completed">Concluída</option>
            <option value="canceled">Cancelada</option>
          </SelectField>
        )}
      </div>
    </BaseForm>
  )
}
