import { twMerge } from 'tailwind-merge'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  fullWidth = false,
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 rounded-lg cursor-pointer'

  const variantStyles = {
    primary:
      'bg-[linear-gradient(90deg,#2563EB,#4648D4)] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:opacity-90',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  }

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="size-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  )
}
