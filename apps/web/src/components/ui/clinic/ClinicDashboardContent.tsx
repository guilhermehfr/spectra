'use client'

import { useRouter } from 'next/navigation'
import { Container, Button } from '@/components/ui/shared'
import { ClinicWeeklyChart } from './ClinicWeeklyChart'
import { ClinicDashboardStats } from './ClinicDashboardStats'
import { UserPlus, Calendar } from 'lucide-react'

interface WeeklyChartData {
  day: string
  sessions: number
}

interface ClinicDashboardContentProps {
  greeting: string
  subtitle: string
  activePatients: number
  todaySessions: number
  pendingEvolutions: number
  weeklyData: WeeklyChartData[]
  onAddPatient?: () => void
  onScheduleSession?: () => void
}

export function ClinicDashboardContent({
  greeting,
  subtitle,
  activePatients,
  todaySessions,
  pendingEvolutions,
  weeklyData,
  onAddPatient,
  onScheduleSession,
}: ClinicDashboardContentProps) {
  const router = useRouter()

  const handleAddPatient = () => {
    if (onAddPatient) {
      onAddPatient()
    } else {
      router.push('/clinic/patients/new')
    }
  }

  const handleScheduleSession = () => {
    if (onScheduleSession) {
      onScheduleSession()
    } else {
      router.push('/clinic/sessions/new')
    }
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Section */}
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 font-manrope">{greeting}</h1>
        <p className="text-slate-500 font-manrope">{subtitle}</p>
      </section>

      {/* Stats Cards Section */}
      <section>
        <ClinicDashboardStats
          activePatients={activePatients}
          todaySessions={todaySessions}
          pendingEvolutions={pendingEvolutions}
        />
      </section>

      {/* Chart & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <Container className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 font-manrope">Visão semanal</h2>
          </div>
          <ClinicWeeklyChart data={weeklyData} />
        </Container>

        {/* Quick Actions */}
        <Container className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900 font-manrope">Ações rápidas</h2>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAddPatient}
              startIcon={<UserPlus className="w-5 h-5" />}
              className="justify-start px-4 py-3"
            >
              Adicionar Paciente
            </Button>
            <Button
              variant="secondary"
              onClick={handleScheduleSession}
              startIcon={<Calendar className="w-5 h-5" />}
              className="justify-start px-4 py-3"
            >
              Agendar sessão
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
