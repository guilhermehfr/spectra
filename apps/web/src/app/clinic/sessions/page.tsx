import { Layout } from '@/components/layout/clinic'
import { SessionsContent } from '@/components/ui/clinic'
import { getSessions } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClinicSessionsPage() {
  const user = await resolveUser()

  const sessions = await getSessions()
  const activeSessions = sessions.filter((s) => !s.is_deleted)

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        <SessionsContent
          sessions={activeSessions}
          totalCount={activeSessions.length}
          isLoading={false}
        />
      </div>
    </Layout>
  )
}
