import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { authResolver } from '@/lib/authResolver'
import { getPatientByGuardianEmail } from '@/lib/api/clinic'
import { getFamilyEvolutions } from '@/lib/api/family'
import { FamilyDashboardStats } from '@/components/ui/family/FamilyDashboardStats'
import { LatestEvolutionCard } from '@/components/ui/family/LatestEvolutionCard'
import { FamilyNavbar } from '@/components/layout/family/FamilyNavbar'
import type { FamilyEvolution } from '@/lib/types'

// Dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic'

/**
 * Extracts initials from a full name
 * @param name - Full name (e.g., "Leonardo Silva")
 * @returns Two-letter initials (e.g., "LS")
 */
function extractInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter((w) => w.length > 0)

  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()

  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export default async function FamilyDashboard() {
  // 1. Get authenticated user
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get('access_token')?.value
  const user = await authResolver.getUser(cookieValue)

  // 2. Verify family role
  if (!user || user.role !== 'family') {
    // During build time, user will be null - redirect to login
    // In production, middleware will catch this before it reaches here
    redirect('/login/family')
  }

  // 3. Get patient by matching guardian email
  let patient = null
  try {
    patient = await getPatientByGuardianEmail(user.email)
  } catch {
    // API might fail during build or due to network issues
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

  // 4. Fetch evolutions
  let evolutions: FamilyEvolution[] = []
  try {
    evolutions = await getFamilyEvolutions()
  } catch {
    // API might fail during build
    evolutions = []
  }

  // 5. Get latest evolution (most recent by created_at)
  const latestEvolution = evolutions.length > 0
    ? evolutions.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]
    : null

  // 6. Calculate stats
  const totalSessions = evolutions.length
  const guardianName = patient.guardian_name
  const patientName = patient.name
  const patientInitials = extractInitials(patientName)
  const lastSessionDate = latestEvolution?.session_date || null

  const getRelativeDate = (dateString: string | null): string => {
    if (!dateString) return 'Sem sessões'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays === 2) return 'Há 2 dias'
    if (diffDays === 3) return 'Há 3 dias'
    if (diffDays === 4) return 'Há 4 dias'
    if (diffDays === 5) return 'Há 5 dias'
    if (diffDays === 6) return 'Há 6 dias'
    if (diffDays === 7) return 'Há uma semana'
    if (diffDays < 14) return 'Há duas semanas'
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`
    return `Há ${Math.floor(diffDays / 30)} meses`
  }

  const lastSessionRelative = lastSessionDate ? getRelativeDate(lastSessionDate) : 'Sem sessões'

  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      {/* Main content container */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Header Profile Section */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8 flex items-center gap-4">
          {/* Avatar */}
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

          {/* Content */}
          <div className="flex flex-col gap-1">
            <p className="font-manrope text-xs md:text-sm font-normal text-slate-500">
              Olá, {guardianName}
            </p>
            <h1 className="font-manrope text-2xl md:text-3xl font-medium tracking-tight text-slate-900">
              Histórico de <span className="text-blue-600">{patientName}</span>
            </h1>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Stats Section */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          <FamilyDashboardStats
            totalSessions={totalSessions}
            lastSession={lastSessionRelative}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* Latest Evolution Section */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-manrope text-base md:text-lg font-semibold text-slate-900">
              Última Evolução
            </h2>
            <span className="font-manrope text-xs md:text-sm font-semibold tracking-wide text-cyan-600">
              NOTAS DOS TERAPEUTAS
            </span>
          </div>

          {/* Evolution Card or Empty State */}
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Navbar */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <FamilyNavbar />
    </div>
  )
}
