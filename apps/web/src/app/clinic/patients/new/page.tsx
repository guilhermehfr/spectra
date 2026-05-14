import { PatientForm } from '@/components/ui/clinic'
import { createPatientAction } from '@/app/actions/patient'

export default async function NewPatientPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PatientForm formAction={createPatientAction} cancelHref="/clinic/patients" />
    </div>
  )
}
