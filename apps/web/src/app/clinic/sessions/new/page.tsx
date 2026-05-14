import { SessionForm } from '@/components/ui/clinic'
import { createSessionAction } from '@/app/actions/session'
import { getPatients, getTherapists } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

interface PageProps {
  searchParams: Promise<{ patient?: string }>
}

export default async function NewSessionPage({ searchParams }: PageProps) {
  const { patient } = await searchParams
  const selectedPatientId = patient ? parseInt(patient, 10) : undefined

  const user = await resolveUser()
  const patients = await getPatients()

  const therapists = user.role === 'admin' ? await getTherapists() : undefined

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <SessionForm
        patients={patients}
        currentUser={user}
        therapists={therapists}
        selectedPatientId={selectedPatientId}
        formAction={createSessionAction}
        cancelHref="/clinic/sessions"
      />
    </div>
  )
}
