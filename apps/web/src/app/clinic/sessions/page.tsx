import { SessionsContent } from '@/components/ui/clinic'
import { getSessions } from '@/lib/api/clinic'

export const dynamic = 'force-dynamic'

export default async function ClinicSessionsPage() {
  const activeSessions = await getSessions()

  const sortedSessions = [...activeSessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <SessionsContent
        sessions={sortedSessions}
        totalCount={sortedSessions.length}
        isLoading={false}
      />
    </div>
  )
}
