import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function ClinicNotFound() {
  const t = await getTranslations('NotFound')

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-8xl font-bold text-slate-900">404</h1>
      <p className="text-lg text-slate-600 mt-4">{t('title')}</p>
      <Link
        href="/clinic/dashboard"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('backToDashboard')}
      </Link>
    </div>
  )
}
