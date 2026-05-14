import { notFound } from 'next/navigation'

import { SessionForm } from '@/components/ui/clinic'
import { updateSessionAction } from '@/app/actions/session'
import { getSession, getPatients, getTherapists } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSessionPage({ params }: PageProps) {
  const { id } = await params
  const sessionId = parseInt(id, 10)

  if (isNaN(sessionId)) {
    notFound()
  }

  const user = await resolveUser()
  const session = await getSession(sessionId)

  if (!session) {
    notFound()
  }

  const patients = await getPatients()
  const therapists = user.role === 'admin' ? await getTherapists() : undefined

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <SessionForm
        session={{
          id: session.id,
          patient: session.patient,
          therapist: session.therapist,
          date_time: session.date_time,
          notes: session.notes,
          status: session.status,
        }}
        patients={patients}
        currentUser={user}
        therapists={therapists}
        formAction={updateSessionAction}
        cancelHref="/clinic/sessions"
      />
    </div>
  )
}
