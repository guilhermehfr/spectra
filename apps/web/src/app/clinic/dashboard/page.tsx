import { Layout } from '@/components/layout/clinic'
import { DashboardContent } from '@/components/ui/clinic'
import { getPatients, getSessions, getEvolutions } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'
import { getGreeting } from '@/lib/utils/greetingUtils'
import { calculateClinicStats, filterRecentSessions } from '@/lib/utils/statsUtils'
import { aggregateByDayOfWeek } from '@/lib/utils/dateRangeUtils'

export default async function ClinicDashboard() {
  const user = await resolveUser()

  const [allPatients, allSessions, allEvolutions] = await Promise.all([
    getPatients(),
    getSessions(),
    getEvolutions(),
  ])

  const stats = calculateClinicStats(allPatients, allSessions, allEvolutions)
  const recentSessions = filterRecentSessions(allSessions, 7)
  const weeklyData = aggregateByDayOfWeek(recentSessions)

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        <DashboardContent
          greeting={getGreeting(user.first_name)}
          subtitle="Aqui está sua visão geral da clínica para hoje"
          activePatients={stats.activePatients}
          todaySessions={stats.todaySessions}
          pendingEvolutions={stats.pendingEvolutions}
          weeklyData={weeklyData}
        />
      </div>
    </Layout>
  )
}
