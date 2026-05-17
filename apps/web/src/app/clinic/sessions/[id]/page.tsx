import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, FileText } from 'lucide-react'

import { getSession, getEvolutions } from '@/lib/api/clinic'
import { formatDateLong, normalizeSessionStatus, getSessionStatusDisplay } from '@/lib/utils'

export const revalidate = false

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params
  const sessionId = parseInt(id, 10)

  if (isNaN(sessionId)) {
    notFound()
  }

  const session = await getSession(sessionId)

  if (!session) {
    notFound()
  }

  const evolutions = await getEvolutions()
  const sessionEvolution = evolutions.find((e) => e.session === sessionId)
  const normalizedStatus = normalizeSessionStatus(session.status)
  const statusDisplay = getSessionStatusDisplay(session.status)
  const canCreateEvolution = normalizedStatus === 'completed' && !sessionEvolution

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/clinic/sessions"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Voltar para sessões
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-manrope text-2xl font-bold text-slate-900">Sessão #{session.id}</h1>
            <p className="text-sm text-slate-500 mt-1">{formatDateLong(session.date_time)}</p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${statusDisplay.className}`}
          >
            {statusDisplay.label}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Paciente</p>
            <p className="text-base text-slate-900">{session.patient_name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Terapeuta</p>
            <p className="text-base text-slate-900">{session.therapist_name}</p>
          </div>
          {session.notes && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Observações</p>
              <p className="text-base text-slate-900">{session.notes}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
          <Link
            href={`/clinic/sessions/${session.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Pencil size={16} />
            Editar Sessão
          </Link>

          {sessionEvolution ? (
            <Link
              href={`/clinic/evolutions/${sessionEvolution.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FileText size={16} />
              Ver Evolução
            </Link>
          ) : canCreateEvolution ? (
            <Link
              href={`/clinic/sessions/${session.id}/evolution/new`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity"
            >
              <FileText size={16} />
              Criar Evolução
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
