import { ClinicLayout } from '@/components/layout/clinic'
import { ClinicPatientsContent } from '@/components/ui/clinic'
import { getPatients } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

export default async function ClinicPatientsPage() {
  const user = await resolveUser()

  const patients = await getPatients()
  const activePatients = patients.filter((p) => !p.is_deleted)

  return (
    <ClinicLayout user={user}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        <ClinicPatientsContent
          initialPatients={activePatients}
          totalCount={activePatients.length}
          isLoading={false}
        />
      </div>
    </ClinicLayout>
  )
}
