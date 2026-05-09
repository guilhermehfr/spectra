import { notFound } from 'next/navigation'
import { PatientForm } from '@/components/ui/clinic'
import { Layout } from '@/components/layout/clinic'
import { getPatient } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'
import { updatePatientAction } from '@/app/actions/patient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPatientPage({ params }: PageProps) {
  const { id } = await params
  const patientId = parseInt(id, 10)

  if (isNaN(patientId)) {
    notFound()
  }

  const user = await resolveUser()
  const patient = await getPatient(patientId)

  if (!patient) {
    notFound()
  }

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:pt-24">
        <PatientForm
          patient={patient}
          formAction={updatePatientAction}
          cancelHref={`/clinic/patients/${id}`}
        />
      </div>
    </Layout>
  )
}
