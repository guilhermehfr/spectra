import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.06),0px_4px_8px_-2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  )
}
