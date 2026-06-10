import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowLeft, Target, Activity, Brain, TrendingUp, Compass } from 'lucide-react'

import { authService } from '@/lib/authService'
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

  const t = await getTranslations('FamilyEvolutions')
  const tf = await getTranslations('Family')
  const tc = await getTranslations('Common')
  const tl = await getTranslations('LatestEvolutionCard')
  const locale = await getLocale()

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
          {tf('patientNotFound')}
        </h1>
        <p className="mt-2 font-manrope text-xs md:text-sm text-slate-600">
          {tf('patientNotFoundDesc')}
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
            <span className="font-manrope text-sm font-medium">{tc('back')}</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="font-manrope text-2xl md:text-3xl font-bold text-slate-900">
            {t('title')}
          </h1>
        </div>

        <div className="space-y-6">
          <TherapistCard
            therapistName={evolution.therapist_name}
            sessionDate={evolution.session_date}
            therapistPrefix={tl('therapistPrefix')}
            locale={locale}
          />

          <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5">
            <Section
              icon={<Target size={16} />}
              title={t('objective')}
              content={evolution.objective}
            />
            <Section
              icon={<Activity size={16} />}
              title={t('activities')}
              content={evolution.activities}
            />
          </div>

          <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5">
            <Section
              icon={<Brain size={16} />}
              title={t('behavior')}
              content={evolution.behavior}
            />
            <Section
              icon={<TrendingUp size={16} />}
              title={t('progress')}
              content={evolution.progress}
            />
          </div>

          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
            <Section
              icon={<Compass size={16} />}
              title={t('nextSteps')}
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
