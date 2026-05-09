import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Target, Activity, Brain, TrendingUp, Compass } from 'lucide-react'

import { resolveUserWithRole } from '@/lib/utils/userUtils'
import { getPatientByGuardianEmail } from '@/lib/api/clinic'
import { getFamilyEvolution } from '@/lib/api/family'
import type { FamilyEvolution } from '@/lib/types'
import { Section } from '@/components/ui/family/EvolutionSection'
import { TherapistCard } from '@/components/ui/family/TherapistCard'
import { Navbar } from '@/components/layout/family'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FamilyEvolutionPage({ params }: PageProps) {
  const { id } = await params
  const evolutionId = parseInt(id, 10)

  if (isNaN(evolutionId)) {
    notFound()
  }

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

  let evolution: FamilyEvolution | undefined
  try {
    evolution = await getFamilyEvolution(evolutionId)
  } catch {
    evolution = undefined
  }

  if (!evolution) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:pt-24">
        <div className="mb-6">
          <Link
            href="/family/evolutions"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            <span className="font-manrope text-sm font-medium">Voltar</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="font-manrope text-2xl md:text-3xl font-bold text-slate-900">Evolução</h1>
        </div>

        <div className="space-y-6">
          <TherapistCard
            therapistName={evolution.therapist_name}
            sessionDate={evolution.session_date}
          />

          <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5">
            <Section icon={<Target size={16} />} title="Objetivo" content={evolution.objective} />
            <Section
              icon={<Activity size={16} />}
              title="Atividades"
              content={evolution.activities}
            />
          </div>

          <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5">
            <Section
              icon={<Brain size={16} />}
              title="Comportamento"
              content={evolution.behavior}
            />
            <Section
              icon={<TrendingUp size={16} />}
              title="Progresso"
              content={evolution.progress}
            />
          </div>

          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
            <Section
              icon={<Compass size={16} />}
              title="Próximos Passos"
              content={evolution.next_steps}
              variant="highlight"
            />
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}
