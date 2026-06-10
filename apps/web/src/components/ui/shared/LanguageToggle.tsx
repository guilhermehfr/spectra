'use client'

import { useCallback, useState } from 'react'

export function LanguageToggle({ initialLocale = 'en' }: { initialLocale?: string }) {
  const [locale, setLocale] = useState(initialLocale)

  const isPtBr = locale === 'pt-BR'

  const toggle = useCallback(() => {
    const newLocale = isPtBr ? 'en' : 'pt-BR'
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    setLocale(newLocale)
    window.location.reload()
  }, [isPtBr])

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 h-8 px-3 rounded-lg border border-slate-200 text-sm font-manrope hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
    >
      <span className={isPtBr ? 'font-semibold text-blue-600' : 'text-slate-400'}>PT</span>
      <span className="text-slate-300">|</span>
      <span className={!isPtBr ? 'font-semibold text-blue-600' : 'text-slate-400'}>EN</span>
    </button>
  )
}
