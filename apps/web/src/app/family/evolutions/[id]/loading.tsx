import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/shared'

export default function FamilyEvolutionDetailLoading() {
  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:pt-24">
        <div className="mb-6">
          <SkeletonText className="w-16" />
        </div>

        <div className="mb-6">
          <SkeletonText className="h-8 w-48" />
        </div>

        <div className="space-y-6">
          <SkeletonCard className="p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div>
                <SkeletonText className="w-36 mb-1" />
                <SkeletonText className="w-24" />
              </div>
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-5">
            <div className="flex flex-col gap-6">
              {[1, 2].map((section) => (
                <div key={section}>
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="size-4 rounded" />
                    <SkeletonText className="w-20" />
                  </div>
                  <SkeletonText className="w-full" />
                  <SkeletonText className="w-3/4" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-5">
            <div className="flex flex-col gap-6">
              {[1, 2].map((section) => (
                <div key={section}>
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="size-4 rounded" />
                    <SkeletonText className="w-20" />
                  </div>
                  <SkeletonText className="w-full" />
                  <SkeletonText className="w-2/3" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="size-4 rounded" />
              <SkeletonText className="w-20" />
            </div>
            <SkeletonText className="w-full" />
            <SkeletonText className="w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}
