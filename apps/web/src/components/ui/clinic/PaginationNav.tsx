'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface PaginationNavProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange?: (page: number) => void
}

export function PaginationNav({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationNavProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const showPagination = totalPages > 1

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 px-4 py-3 bg-white border-t border-slate-100">
      <span className="text-sm text-slate-500">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </span>

      {showPagination && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className={twMerge(
              'p-2 rounded-lg transition-colors',
              currentPage === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={twMerge(
                'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-[linear-gradient(90deg,#2563EB,#4648D4)] text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={twMerge(
              'p-2 rounded-lg transition-colors',
              currentPage === totalPages
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
