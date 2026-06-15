import { notFound } from 'next/navigation'
import { PatientDetailContent } from '@/components/ui/clinic'
import { getPatient, getSessions, getEvolutions } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

export const revalidate = false

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClinicPatientDetailPage({ params }: PageProps) {
  const { id } = await params
  const patientId = parseInt(id, 10)

  if (isNaN(patientId)) {
    notFound()
  }

  const patient = await getPatient(patientId)
  if (!patient) {
    notFound()
  }

  const user = await resolveUser()

  const allSessions = await getSessions()
  const patientSessions = allSessions.filter((s) => s.patient === patientId)

  const allEvolutions = await getEvolutions()
  const sessionIds = new Set(patientSessions.map((s) => s.id))
  const patientEvolutions = allEvolutions.filter((e) => sessionIds.has(e.session))

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:pt-24">
      <PatientDetailContent
        patient={patient}
        sessions={patientSessions}
        evolutions={patientEvolutions}
        currentUser={user}
      />
    </div>
  )
}
