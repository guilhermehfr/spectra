'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import type { Session } from '@/lib/types'
import { deleteSessionAction } from '@/app/actions/session'
import { SessionsTable } from './SessionsTable'

interface SessionsContentProps {
  sessions: Session[]
  totalCount: number
  isLoading?: boolean
}

export function SessionsContent({ sessions, totalCount, isLoading = false }: SessionsContentProps) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)

  const handleAddSession = () => {
    router.push('/clinic/sessions/new')
  }

  const handleEditSession = (session: Session) => {
    router.push(`/clinic/sessions/${session.id}/edit`)
  }

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return

    try {
      await deleteSessionAction(sessionToDelete.id, sessionToDelete.patient)
    } catch (error) {
      console.error('Failed to delete session:', error)
    } finally {
      setShowDeleteConfirm(false)
      setSessionToDelete(null)
      router.refresh()
    }
  }

  const handleViewSession = (session: Session) => {
    router.push(`/clinic/sessions/${session.id}`)
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope text-2xl md:text-3xl font-bold text-slate-900">Sessões</h1>
          <p className="mt-1 font-manrope text-sm text-slate-500">
            {totalCount} {totalCount === 1 ? 'sessão encontrada' : 'sessões encontradas'}
          </p>
        </div>
        <button
          onClick={handleAddSession}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Nova Sessão
        </button>
      </div>

      <SessionsTable
        sessions={sessions}
        isLoading={isLoading}
        onView={handleViewSession}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Deletar sessão?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta ação não pode ser desfeita. A sessão será removida.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSessionToDelete(null)
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
