'use client'

import { Calendar } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface FamilyDashboardStatsProps {
  totalSessions: number
  lastSession: string
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ size: number; strokeWidth: number }>
  iconBgColor: string
}

function StatCard({ label, value, icon: Icon, iconBgColor }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 w-[200%] rounded-lg border border-[var(--color-slate-200)] bg-white p-8 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02),0px_1px_3px_0px_rgba(0,0,0,0.05)]">
      <div
        className={twMerge('flex h-12 w-12 items-center justify-center rounded-full', iconBgColor)}
      >
        <div className="text-blue-700">
          <Icon size={16} strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-manrope text-xs md:text-sm font-normal text-slate-500">{label}</p>
        <p className="font-manrope text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  )
}

export function FamilyDashboardStats({ totalSessions, lastSession }: FamilyDashboardStatsProps) {
  return (
    <div className="flex w-full gap-2">
      <StatCard
        label="Total de Evoluções"
        value={totalSessions}
        icon={Calendar}
        iconBgColor="bg-blue-100"
      />

      <StatCard
        label="Última Evolução"
        value={lastSession}
        icon={Calendar}
        iconBgColor="bg-purple-100"
      />
    </div>
  )
}
