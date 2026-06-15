import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/shared'

export default function FamilyDashboardLoading() {
  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        <div className="mb-8 pt-5 flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-col gap-1">
            <SkeletonText className="w-36" />
            <SkeletonText className="h-8 w-64" />
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 w-full">
            {[1, 2].map((i) => (
              <SkeletonCard key={i}>
                <div className="flex flex-col gap-2 p-4 sm:p-8">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <SkeletonText className="w-20" />
                    <SkeletonText className="h-7 w-12" />
                  </div>
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <SkeletonText className="h-5 w-36" />
            <SkeletonText className="w-24" />
          </div>
          <SkeletonCard className="w-full space-y-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <SkeletonText className="w-32" />
              </div>
              <SkeletonText className="w-16" />
            </div>
            <Skeleton className="h-28 w-full rounded-lg" />
            <div className="flex justify-center">
              <Skeleton className="h-10 w-44 rounded-lg" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  )
}
