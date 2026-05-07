'use client'

import { useId, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
}

export function Input({
  label,
  hint,
  error,
  startIcon: StartIcon,
  endIcon: EndIcon,
  fullWidth = true,
  disabled,
  className,
  id,
  value,
  defaultValue,
  onChange,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)

  const [internalValue, setInternalValue] = useState(() => {
    if (defaultValue !== undefined) return String(defaultValue)
    return ''
  })

  const isControlled = value !== undefined
  const currentValue = isControlled ? String(value) : internalValue
  const hasContent = currentValue.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  return (
    <div className={twMerge('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="px-1 text-md font-semibold text-slate-900">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {StartIcon && <div className="absolute left-3.5 text-slate-250">{StartIcon}</div>}

        <input
          id={inputId}
          ref={inputRef}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={handleChange}
          className={twMerge(
            'w-full rounded-lg border border-slate-250 bg-surface-soft px-4 py-3 text-sm text-slate-900',
            'placeholder:text-slate-250 placeholder:text-sm',
            'focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-150',
            hasContent ? 'border-slate-400' : 'border-slate-200',
            StartIcon && 'pl-10',
            EndIcon && 'pr-10',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/15',
            className
          )}
          {...props}
        />

        {EndIcon && <div className="absolute right-3.5 text-slate-250">{EndIcon}</div>}
      </div>

      {hint && !error && <p className="px-1 text-xs text-slate-500">{hint}</p>}

      {error && <p className="px-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
