'use client'

export default function ClinicLoading() {
  return (
    <div className="fixed top-0 left-0 z-[100] h-1 w-full overflow-hidden">
      <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />
    </div>
  )
}
