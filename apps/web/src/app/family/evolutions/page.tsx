import { authService } from '@/lib/authService'
import { getPatientByGuardianEmail } from '@/lib/api/clinic'
import { getFamilyEvolutions } from '@/lib/api/family'
import type { FamilyEvolution } from '@/lib/types'

import { EvolutionCard } from '@/components/ui/family/EvolutionCard'
import { Navbar } from '@/components/layout/family'

export const revalidate = false

export default async function FamilyEvolutionsPage() {
  const user = await authService.me()

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

  const sortedEvolutions = [...evolutions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:pt-24">
        <div className="mb-8">
          <h1 className="font-manrope text-2xl md:text-3xl font-bold text-slate-900">Evoluções</h1>
          <p className="mt-1 font-manrope text-sm text-slate-500">
            Atualizações recentes da equipe de terapia do {patient.name}.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {sortedEvolutions.length > 0 ? (
            sortedEvolutions.map((evolution) => (
              <EvolutionCard key={evolution.id} evolution={evolution} />
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-manrope text-sm text-slate-500">Nenhuma evolução disponível.</p>
            </div>
          )}
        </div>

        {sortedEvolutions.length > 0 && (
          <div className="mt-8 text-center">
            <p className="font-manrope text-xs text-slate-400">
              Não há mais evoluções para carregar
            </p>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  )
}
