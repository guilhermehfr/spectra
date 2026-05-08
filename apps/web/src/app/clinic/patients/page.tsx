import { Layout } from '@/components/layout/clinic'
import { PatientsContent } from '@/components/ui/clinic'
import { getPatients } from '@/lib/api/clinic'
import { resolveUser } from '@/lib/utils/userUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClinicPatientsPage() {
  const user = await resolveUser()

  const patients = await getPatients()
  const activePatients = patients.filter((p) => !p.is_deleted)

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
        <PatientsContent
          initialPatients={activePatients}
          totalCount={activePatients.length}
          isLoading={false}
        />
      </div>
    </Layout>
  )
}
