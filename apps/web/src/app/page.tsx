'use client'

import Link from 'next/link'
import { Building2, Users, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/shared'

export default function Home() {
  const t = useTranslations('Home')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EEF3FB] p-4 relative">
      <Container className="w-full max-w-2xl space-y-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700">
            <Building2 size={32} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-dm-sans text-4xl font-bold tracking-tight text-slate-900">
              Spectra
            </h1>
            <p className="font-manrope text-lg text-slate-600">{t('subtitle')}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Building2 size={24} className="text-blue-700" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-manrope text-xl font-semibold text-slate-900">
                {t('clinicPortal.title')}
              </h2>
              <p className="font-manrope text-sm text-slate-600">{t('clinicPortal.description')}</p>
            </div>
            <Link
              href="/login/clinic"
              className="mt-2 inline-flex items-center gap-2 font-manrope text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {t('clinicPortal.cta')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Users size={24} className="text-purple-700" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-manrope text-xl font-semibold text-slate-900">
                {t('familyPortal.title')}
              </h2>
              <p className="font-manrope text-sm text-slate-600">{t('familyPortal.description')}</p>
            </div>
            <Link
              href="/login/family"
              className="mt-2 inline-flex items-center gap-2 font-manrope text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              {t('familyPortal.cta')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <p className="text-center font-manrope text-xs text-slate-500">{t('footer')}</p>
      </Container>
    </div>
  )
}
