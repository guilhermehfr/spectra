import type { SessionStatus } from '@/lib/types'

const statusDisplayConfig: Record<SessionStatus, { label: string; className: string }> = {
  scheduled: {
    label: 'Agendada',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  canceled: {
    label: 'Cancelada',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
}

export function normalizeSessionStatus(status: string | undefined): SessionStatus {
  if (status === 'scheduled' || status === 'completed' || status === 'canceled') return status
  return 'scheduled'
}

export function getSessionStatusDisplay(rawStatus: string | undefined) {
  const normalized = normalizeSessionStatus(rawStatus)
  return statusDisplayConfig[normalized]
}

export function getStatusLabel(status: SessionStatus): string {
  return statusDisplayConfig[status]?.label ?? 'Indefinido'
}

export function getStatusClassName(status: SessionStatus): string {
  return statusDisplayConfig[status]?.className ?? 'bg-gray-50 text-gray-700 border-gray-200'
}