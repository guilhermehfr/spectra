import { Layout } from '@/components/layout/clinic'
import { SessionForm } from '@/components/ui/clinic'
import { createSessionAction } from '@/app/actions/session'
import { getPatients } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

export default async function NewSessionPage() {
  const user = await resolveUser()
  const patients = await getPatients()

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <SessionForm
          patients={patients}
          currentUser={user}
          formAction={createSessionAction}
          cancelHref="/clinic/sessions"
        />
      </div>
    </Layout>
  )
}
