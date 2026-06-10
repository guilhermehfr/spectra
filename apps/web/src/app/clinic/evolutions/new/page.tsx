import { getTranslations } from 'next-intl/server'

export default async function NewEvolutionPage() {
  const t = await getTranslations('Evolutions')

  return (
    <div className="min-h-screen bg-[#EEF3FB] p-4">
      <h1 className="font-manrope text-2xl font-bold text-slate-900">{t('development')}</h1>
    </div>
  )
}
