'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = 'Pesquisar pacientes...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch?.(query.trim())
    }
  }

  return (
    <div className="flex-1 mx-6">
      <div className="relative flex items-center">
        <Search
          size={20}
          className="absolute left-3 text-slate-400 pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  )
}
