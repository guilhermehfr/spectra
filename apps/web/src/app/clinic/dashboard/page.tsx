import { getLocale, getTranslations } from 'next-intl/server'
import { DashboardContent } from '@/components/ui/clinic'
import { getDashboard, getSessions } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'
import { getGreeting } from '@/lib/utils/greetingUtils'
import { filterRecentSessions } from '@/lib/utils/statsUtils'
import { aggregateByDayOfWeek } from '@/lib/utils/dateRangeUtils'
import type { Session } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ClinicDashboard() {
  const user = await resolveUser()
  const td = await getTranslations('Dashboard')
  const tg = await getTranslations('Greeting')
  const locale = await getLocale()

  const [dashboard, allSessions] = await Promise.all([
    getDashboard().catch(() => undefined),
    getSessions().catch(() => [] as Session[]),
  ])

  const activePatients = dashboard?.active_patients ?? 0
  const todaySessions = dashboard?.today_sessions?.length ?? 0
  const pendingEvolutions = dashboard?.pending_evolutions ?? 0

  const recentSessions = filterRecentSessions(allSessions, 7)
  const weeklyData = aggregateByDayOfWeek(recentSessions, locale)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <DashboardContent
        greeting={getGreeting(user.first_name, tg)}
        subtitle={td('subtitle')}
        activePatients={activePatients}
        todaySessions={todaySessions}
        pendingEvolutions={pendingEvolutions}
        weeklyData={weeklyData}
      />
    </div>
  )
}
