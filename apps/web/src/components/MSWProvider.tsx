'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswError, setMswError] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !mswError) {
      import('@/mocks/browser')
        .then(({ worker }) => {
          return worker.start({ onUnhandledRequest: 'bypass' })
        })
        .catch((err) => {
          console.error('[MSWProvider] Failed to start MSW:', err)
          setMswError(true) // Allow app to continue without MSW
        })
    }
  }, [mswError])

  // Always render children - don't block rendering
  return <>{children}</>
}
