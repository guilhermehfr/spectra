import { notFound, redirect } from 'next/navigation'

import { Layout } from '@/components/layout/clinic'
import { EvolutionForm } from '@/components/ui/clinic'
import { createEvolutionAction, getEvolutionBySession } from '@/app/actions/evolution'
import { getSession } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewEvolutionPage({ params }: PageProps) {
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

  const existingEvolution = await getEvolutionBySession(sessionId)

  if (existingEvolution) {
    redirect(`/clinic/evolutions/${existingEvolution.id}/edit`)
  }

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EvolutionForm
          sessionId={sessionId}
          formAction={createEvolutionAction}
          cancelHref={`/clinic/sessions/${sessionId}`}
        />
      </div>
    </Layout>
  )
}
