import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonButton,
  SkeletonTitle,
} from '@/components/ui/shared'

export default function PatientDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:pt-24">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <SkeletonText className="h-8 w-48" />
          </div>
          <div className="flex items-center gap-2 ml-13 sm:ml-0">
            <SkeletonButton className="w-20" />
            <SkeletonButton className="w-24" />
          </div>
        </div>

        <SkeletonCard>
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <SkeletonAvatar />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SkeletonText className="w-16 mb-1" />
                  <SkeletonText className="w-28" />
                </div>
                <div>
                  <SkeletonText className="w-10 mb-1" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <div className="sm:col-span-2">
                  <SkeletonText className="w-16 mb-1" />
                  <SkeletonText className="w-40 mb-1" />
                  <SkeletonText className="w-52" />
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <SkeletonText className="w-64" />
                </div>
              </div>
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200">
            <SkeletonTitle />
            <SkeletonButton className="w-32" />
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="py-3 px-4">
                      <SkeletonText className="w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-4 px-4">
                        <SkeletonText className={j === 4 ? 'w-16 ml-auto' : 'w-24'} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <SkeletonText className="w-36 mb-2" />
                <SkeletonText className="w-24 mb-3" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200">
            <SkeletonTitle />
            <SkeletonButton className="w-28" />
          </div>
          <div className="p-4 md:p-6 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <SkeletonText className="w-32 mb-1" />
                    <SkeletonText className="w-24 mb-1" />
                    <SkeletonText className="w-20" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="space-y-4">
                  <div>
                    <SkeletonText className="w-20 mb-1" />
                    <SkeletonText className="w-full" />
                    <SkeletonText className="w-3/4" />
                  </div>
                  <div>
                    <SkeletonText className="w-24 mb-1" />
                    <SkeletonText className="w-full" />
                    <SkeletonText className="w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <SkeletonButton className="w-16" />
                  <SkeletonButton className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}
