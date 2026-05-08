import { PatientForm } from '@/components/ui/clinic'
import { Layout } from '@/components/layout/clinic'
import { createPatientAction } from '@/app/actions/patient'
import { resolveUser } from '@/lib/utils/userUtils'

export default async function NewPatientPage() {
  const user = await resolveUser()

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PatientForm formAction={createPatientAction} cancelHref="/clinic/patients" />
      </div>
    </Layout>
  )
}