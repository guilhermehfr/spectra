import { Skeleton, SkeletonText, SkeletonCard, SkeletonButton } from '@/components/ui/shared'

export default function SessionsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <SkeletonText className="h-8 w-32" />
            <SkeletonText className="w-44 mt-1" />
          </div>
          <SkeletonButton className="w-40" />
        </div>

        <SkeletonCard>
          <table className="hidden md:table w-full">
            <thead className="bg-slate-50">
              <tr>
                {['Data/Hora', 'Paciente', 'Terapeuta', 'Status', 'Observações', 'Ações'].map(
                  (h) => (
                    <th key={h} className="py-3 px-4">
                      <SkeletonText className="w-16" />
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="animate-pulse border-b border-slate-100">
                  {[0, 1, 2].map((cell) => (
                    <td key={cell} className="py-4 px-4">
                      <Skeleton className="h-4 w-24 rounded" />
                    </td>
                  ))}
                  <td className="py-4 px-4">
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-32 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16 rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="md:hidden p-4 space-y-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="rounded-lg border border-slate-200 p-4">
                <SkeletonText className="w-36 mb-2" />
                <SkeletonText className="w-24 mb-1" />
                <SkeletonText className="w-20 mb-3" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}
