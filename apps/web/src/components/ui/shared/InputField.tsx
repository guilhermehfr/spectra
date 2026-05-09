'use client'

import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

import type { InputHTMLAttributes } from 'react'

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export function InputField({ label, hint, error, className, id, ...props }: InputFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={twMerge('flex flex-col gap-2 w-full', className)}>
      <label htmlFor={inputId} className="font-manrope text-base font-semibold text-slate-900">
        {label}
      </label>

      <input
        id={inputId}
        className={twMerge(
          'w-full rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-900',
          'placeholder:text-slate-400 placeholder:text-sm',
          'focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-150',
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15' : 'border-slate-200'
        )}
        {...props}
      />

      {hint && !error && <p className="px-1 text-xs text-slate-500">{hint}</p>}

      {error && <p className="px-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
