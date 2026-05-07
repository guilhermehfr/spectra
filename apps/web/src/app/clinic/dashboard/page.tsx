import { headers } from 'next/headers'
import { ClinicLayout } from '@/components/layout/clinic'
import type { User } from '@/lib/types'

// TODO: Review caching strategy - consider applying React cache() to clinic queries
// (similar to family dashboard approach with getUser, getPatient, etc.)

export default async function ClinicDashboard() {
  const requestHeaders = await headers()
  const user = JSON.parse(requestHeaders.get('x-user') ?? '{}') as User

  return (
    <ClinicLayout user={user}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        <h1 className="font-manrope text-3xl font-bold text-slate-900">Clinic Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome to the clinic dashboard</p>
      </div>
    </ClinicLayout>
  )
}
