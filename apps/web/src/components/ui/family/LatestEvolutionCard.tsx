'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import { Button, Container } from '@/components/ui/shared'
import type { FamilyEvolution } from '@/lib/types'
import { extractInitials } from '@/lib/utils/stringUtils'
import { formatDateShort } from '@/lib/utils/dateUtils'

interface LatestEvolutionCardProps {
  evolution: FamilyEvolution
  onViewFullEvolution?: (evolutionId: number) => void
}

export function LatestEvolutionCard({ evolution, onViewFullEvolution }: LatestEvolutionCardProps) {
  const router = useRouter()
  const t = useTranslations('LatestEvolutionCard')
  const locale = useLocale()
  const therapistName =
    evolution.therapist_name ||
    (evolution as unknown as { session_details?: { therapist_name?: string } }).session_details
      ?.therapist_name ||
    ''
  const initials = extractInitials(therapistName)

  const handleViewFullEvolution = () => {
    if (onViewFullEvolution) {
      onViewFullEvolution(evolution.id)
    } else {
      router.push(`/family/evolutions/${evolution.id}`)
    }
  }

  return (
    <Container className="w-full space-y-4">
      {/* Header Section - Therapist Info */}
      <div className="flex items-center justify-between gap-2">
        {/* Left side - Avatar and Therapist Name */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div
            className={twMerge(
              'flex h-10 w-10 items-center justify-center rounded-full',
              'border border-[var(--color-slate-200)] bg-gradient-to-br from-blue-100 to-indigo-100',
              'font-manrope text-sm md:text-base font-bold text-[var(--color-slate-900)]'
            )}
          >
            {initials}
          </div>

          {/* Therapist Name */}
          <h3 className="font-manrope text-sm md:text-base font-semibold text-[var(--color-slate-900)]">
            {t('therapistPrefix')}
            {evolution.therapist_name}
          </h3>
        </div>

        {/* Right side - Date */}
        <span className="font-manrope text-xs md:text-sm text-slate-500">
          {formatDateShort(evolution.session_date, locale)}
        </span>
      </div>

      {/* Behavior Section - Content Box */}
      <div className="relative">
        {/* Top Gradient Accent */}
        <div
          className="absolute left-0 right-0 top-0 h-1 rounded-t-lg"
          style={{
            background:
              'linear-gradient(90deg, rgba(219, 234, 254, 1) 0%, rgba(0, 88, 190, 1) 50%, rgba(219, 234, 254, 1) 100%)',
          }}
        />

        {/* Behavior Content */}
        <div className="rounded-lg border border-[var(--color-slate-200)] bg-[var(--color-white-0)] px-4 py-4 pt-5">
          <p className="line-clamp-5 font-manrope text-sm md:text-base font-normal leading-relaxed text-[var(--color-slate-900)]">
            {evolution.behavior}
          </p>
        </div>
      </div>

      {/* Button Section */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="md"
          endIcon={<ArrowRight size={16} strokeWidth={2} />}
          onClick={handleViewFullEvolution}
        >
          {t('viewFullEvolution')}
        </Button>
      </div>
    </Container>
  )
}
