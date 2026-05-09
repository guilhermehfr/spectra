import { notFound } from 'next/navigation'

import { Layout } from '@/components/layout/clinic'
import { EvolutionForm } from '@/components/ui/clinic'
import { getEvolution, getSession } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'
import { updateEvolutionAction } from '@/app/actions/evolution'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEvolutionPage({ params }: PageProps) {
  const { id } = await params
  const evolutionId = parseInt(id, 10)

  if (isNaN(evolutionId)) {
    notFound()
  }

  const user = await resolveUser()
  const evolution = await getEvolution(evolutionId)

  if (!evolution) {
    notFound()
  }

  const session = await getSession(evolution.session)

  if (!session) {
    notFound()
  }

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EvolutionForm
          evolution={evolution}
          formAction={updateEvolutionAction}
          cancelHref={`/clinic/sessions/${session.id}`}
        />
      </div>
    </Layout>
  )
}
