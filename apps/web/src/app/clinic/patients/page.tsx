import { PatientsContent } from '@/components/ui/clinic'
import { getPatients } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ClinicPatientsPage({ searchParams }: PageProps) {
  const { search } = await searchParams

  const patients = await getPatients()
  const activePatients = patients.filter((p) => !p.is_deleted)
  const currentUser = await resolveUser()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <PatientsContent
        initialPatients={activePatients}
        totalCount={activePatients.length}
        isLoading={false}
        searchQuery={search}
        currentUser={currentUser}
      />
    </div>
  )
}
