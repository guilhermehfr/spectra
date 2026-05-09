'use client'

import { Check, Lock, Pencil, Plus, Share2 } from 'lucide-react'
import type { Evolution } from '@/lib/types'
import { formatDate } from '@/lib/utils/dateUtils'

interface EvolutionFieldProps {
  label: string
  value: string
}

function EvolutionField({ label, value }: EvolutionFieldProps) {
  if (!value) return null
  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">{label}</label>
      <p className="text-sm text-slate-700 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

interface EvolutionCardProps {
  evolution: Evolution
  onEdit: (evolution: Evolution) => void
  onRelease: (evolution: Evolution) => void
  isReleasing?: boolean
}

function EvolutionCard({ evolution, onEdit, onRelease, isReleasing }: EvolutionCardProps) {
  const isReleased = evolution.released_to_family

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {evolution.session_date
              ? formatDate(evolution.session_date)
              : formatDate(evolution.created_at)}
          </p>
          <p className="text-sm text-slate-600">Terapeuta: {evolution.therapist_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              isReleased
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isReleased ? (
              <>
                <Check className="w-3 h-3" />
                Compartilhado
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                Não compartilhado
              </>
            )}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <EvolutionField label="Objetivos" value={evolution.objective} />
        <EvolutionField label="Atividades Realizadas" value={evolution.activities} />
        <EvolutionField label="Comportamento Observado" value={evolution.behavior} />
        <EvolutionField label="Progresso" value={evolution.progress} />
        <EvolutionField label="Próximos Passos" value={evolution.next_steps} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => onEdit(evolution)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        {!isReleased && (
          <button
            onClick={() => onRelease(evolution)}
            disabled={isReleasing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar com Família
          </button>
        )}
      </div>
    </div>
  )
}

interface PatientEvolutionsSectionProps {
  evolutions: Evolution[]
  onEdit: (evolution: Evolution) => void
  onRelease: (evolution: Evolution) => void
  onAdd: () => void
  isReleasing?: boolean
}

export function PatientEvolutionsSection({
  evolutions,
  onEdit,
  onRelease,
  onAdd,
  isReleasing = false,
}: PatientEvolutionsSectionProps) {
  const sortedEvolutions = [...evolutions].sort(
    (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
  )

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">Evoluções</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Evolução
        </button>
      </div>

      {evolutions.length === 0 ? (
        <div className="px-4 md:px-6 py-12 text-center">
          <p className="text-sm text-slate-500">Nenhuma evolução registrada para este paciente.</p>
        </div>
      ) : (
        <div className="p-4 md:p-6 space-y-4">
          {sortedEvolutions.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              onEdit={onEdit}
              onRelease={onRelease}
              isReleasing={isReleasing}
            />
          ))}
        </div>
      )}
    </div>
  )
}
