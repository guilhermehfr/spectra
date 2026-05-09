import { extractInitials } from '@/lib/utils/stringUtils'
import { formatDateTime } from '@/lib/utils/dateUtils'

interface TherapistCardProps {
  therapistName: string
  sessionDate: string
}

export function TherapistCard({ therapistName, sessionDate }: TherapistCardProps) {
  const initials = extractInitials(therapistName)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-manrope text-xs text-slate-500 md:hidden">
            {formatDateTime(sessionDate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-br from-blue-100 to-indigo-100 font-manrope text-sm font-bold text-slate-900">
              {initials}
            </div>
            <p className="font-manrope text-sm font-semibold text-slate-900">
              Terapeuta. {therapistName}
            </p>
          </div>
          <span className="hidden md:block font-manrope text-xs text-slate-500">
            {formatDateTime(sessionDate)}
          </span>
        </div>
      </div>
    </div>
  )
}
