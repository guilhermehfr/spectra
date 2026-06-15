'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/shared'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ClinicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-12 text-center">
        <h2 className="font-dm-sans text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="font-manrope text-slate-600">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="font-manrope text-xs text-slate-400">Error ID: {error.digest}</p>
        )}
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
