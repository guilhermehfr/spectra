'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/shared'
import { Users, Calendar, FileText } from 'lucide-react'

interface DashboardStatsProps {
  activePatients: number
  todaySessions: number
  pendingEvolutions: number
}

export function DashboardStats({
  activePatients,
  todaySessions,
  pendingEvolutions,
}: DashboardStatsProps) {
  const t = useTranslations('Dashboard')

  const stats = [
    {
      label: t('activePatients'),
      value: activePatients,
      icon: Users,
      iconBg: 'bg-blue-50',
    },
    {
      label: t('todaySessions'),
      value: todaySessions,
      icon: Calendar,
      iconBg: 'bg-blue-50',
    },
    {
      label: t('pendingEvolutions'),
      value: pendingEvolutions,
      icon: FileText,
      iconBg: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Container key={index} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            <div className={`p-2 rounded-full ${stat.iconBg}`}>
              <stat.icon className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-900">
            {stat.value.toString().padStart(2, '0')}
          </span>
        </Container>
      ))}
    </div>
  )
}
