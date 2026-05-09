import { resolveUserWithRole } from '@/lib/utils/userUtils'
import { getPatientByGuardianEmail } from '@/lib/api/clinic'
import { getFamilyEvolutions } from '@/lib/api/family'
import type { FamilyEvolution } from '@/lib/types'

import { DashboardStats } from '@/components/ui/family/DashboardStats'
import { LatestEvolutionCard } from '@/components/ui/family/LatestEvolutionCard'
import { Navbar } from '@/components/layout/family'

import { getRelativeDate } from '@/lib/utils/dateUtils'
import { extractInitials } from '@/lib/utils/stringUtils'

export default async function FamilyDashboard() {
  const user = await resolveUserWithRole('family')

  let patient = null
  try {
    patient = await getPatientByGuardianEmail(user.email)
  } catch {
    patient = null
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#EEF3FB] px-4">
        <h1 className="font-manrope text-2xl md:text-3xl font-bold text-slate-900">
          Paciente Não Encontrado
        </h1>
        <p className="mt-2 font-manrope text-xs md:text-sm text-slate-600">
          Não foi possível encontrar informações do paciente associadas à sua conta.
        </p>
      </div>
    )
  }

  let evolutions: FamilyEvolution[] = []
  try {
    evolutions = await getFamilyEvolutions()
  } catch {
    evolutions = []
  }

  const latestEvolution =
    evolutions.length > 0
      ? evolutions.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
      : null

  const totalSessions = evolutions.length
  const patientInitials = extractInitials(patient.name)
  const lastSessionDate = latestEvolution?.session_date || null
  const lastSessionRelative = lastSessionDate ? getRelativeDate(lastSessionDate) : 'Sem sessões'

  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        <div className="mb-8 flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white"
            style={{
              background:
                'linear-gradient(45deg, rgba(0, 88, 190, 1) 0%, rgba(219, 234, 254, 1) 100%)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span className="font-manrope text-2xl md:text-3xl font-bold text-white">
              {patientInitials}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-manrope text-xs md:text-sm font-normal text-slate-500">
              Olá, {patient.guardian_name}
            </p>
            <h1 className="font-manrope text-2xl md:text-3xl font-medium tracking-tight text-slate-900">
              Histórico de <span className="text-blue-600">{patient.name}</span>
            </h1>
          </div>
        </div>
        <div className="mb-8">
          <DashboardStats totalSessions={totalSessions} lastSession={lastSessionRelative} />
        </div>
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-manrope text-base md:text-lg font-semibold text-slate-900">
              Última Evolução
            </h2>
            <span className="font-manrope text-xs md:text-sm font-semibold tracking-wide text-cyan-600">
              NOTAS DOS TERAPEUTAS
            </span>
          </div>
          {latestEvolution ? (
            <LatestEvolutionCard evolution={latestEvolution} />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="font-manrope text-sm md:text-base text-slate-500">
                Nenhum registro de evolução ainda. Volte em breve!
              </p>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  )
}
