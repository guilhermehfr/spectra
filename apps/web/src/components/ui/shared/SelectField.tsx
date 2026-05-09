'use client'

import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

import type { SelectHTMLAttributes, ReactNode } from 'react'

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  error?: string
  placeholder?: string
  children: ReactNode
}

export function SelectField({
  label,
  hint,
  error,
  placeholder,
  className,
  id,
  children,
  ...props
}: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={twMerge('flex flex-col gap-2 w-full', className)}>
      <label htmlFor={selectId} className="font-manrope text-base font-semibold text-slate-900">
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          className={twMerge(
            'w-full appearance-none rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-900',
            'focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-150',
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15' : 'border-slate-200'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {hint && !error && <p className="px-1 text-xs text-slate-500">{hint}</p>}

      {error && <p className="px-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
