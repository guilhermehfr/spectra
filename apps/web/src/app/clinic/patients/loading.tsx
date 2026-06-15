import { Skeleton, SkeletonText, SkeletonCard, SkeletonButton } from '@/components/ui/shared'

export default function PatientsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <SkeletonText className="h-8 w-40" />
          <SkeletonButton className="w-44" />
        </div>

        <SkeletonCard>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50">
                {['Paciente', 'Responsável', 'Data de Nasc.', 'Ações'].map((h) => (
                  <th key={h} className="py-4 px-4">
                    <SkeletonText className="w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="animate-pulse border-b border-slate-100">
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-32 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-24 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-20 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16 rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SkeletonCard>
      </div>
    </div>
  )
}
