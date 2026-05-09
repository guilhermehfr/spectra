'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import type { FamilyEvolution } from '@/lib/types'
import { extractInitials } from '@/lib/utils/stringUtils'
import { formatDate } from '@/lib/utils/dateUtils'

interface EvolutionCardProps {
  evolution: FamilyEvolution
}

export function EvolutionCard({ evolution }: EvolutionCardProps) {
  const initials = extractInitials(evolution.therapist_name || '')

  return (
    <article className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={twMerge(
                'flex h-10 w-10 items-center justify-center rounded-full',
                'border border-slate-200 bg-gradient-to-br from-blue-100 to-indigo-100',
                'font-manrope text-sm font-bold text-slate-900'
              )}
            >
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-manrope text-sm font-semibold text-slate-900">
                {evolution.therapist_name}
              </span>
            </div>
          </div>
          <span className="font-manrope text-xs text-slate-500">
            {formatDate(evolution.session_date)}
          </span>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
          <p className="line-clamp-3 font-manrope text-sm text-slate-600">{evolution.behavior}</p>
        </div>

        <Link
          href={`/family/evolutions/${evolution.id}`}
          className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <span className="font-manrope text-sm font-medium">Ver evolução completa</span>
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </article>
  )
}
