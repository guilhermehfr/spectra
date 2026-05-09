'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
      title={isEdit ? 'Editar Paciente' : 'Novo Paciente'}
      description={
        isEdit
          ? 'Atualize as informações do paciente.'
          : 'Preencha as informações do novo paciente.'
      }
      action={action}
      cancelHref={cancelHref}
      cancelLabel="Cancelar"
      submitLabel={isEdit ? 'Salvar' : 'Cadastrar'}
      isSubmitting={isPending}
    >
      {isEdit && <input type="hidden" name="id" value={patient.id} />}

      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Nome"
          name="name"
          placeholder="Nome completo do paciente"
          required
          defaultValue={patient?.name}
          error={state.errors?.name}
        />

        <InputField
          label="Data de Nascimento"
          name="birth_date"
          type="date"
          required
          defaultValue={patient?.birth_date}
          error={state.errors?.birth_date}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Responsável"
          name="guardian_name"
          placeholder="Nome do responsável"
          required
          defaultValue={patient?.guardian_name}
          error={state.errors?.guardian_name}
        />

        <InputField
          label="Email do Responsável"
          name="guardian_email"
          type="email"
          placeholder="email@exemplo.com"
          required
          defaultValue={patient?.guardian_email}
          error={state.errors?.guardian_email}
        />
      </div>

      <TextareaField
        label="Observações"
        name="notes"
        placeholder="Informações adicionais sobre o paciente..."
        rows={4}
        defaultValue={patient?.notes}
      />
    </BaseForm>
  )
}
