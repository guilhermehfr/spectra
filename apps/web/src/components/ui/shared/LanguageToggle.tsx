'use client'

import { useCallback, useState } from 'react'

function getInitialLocale(): string {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  return match?.[1] || 'en'
}

export function LanguageToggle() {
  const [locale, setLocale] = useState(getInitialLocale)

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
