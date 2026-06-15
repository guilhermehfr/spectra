import { Skeleton, SkeletonText, SkeletonCard, SkeletonTitle } from '@/components/ui/shared'

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-1">
          <SkeletonText className="h-9 w-64" />
          <SkeletonText className="w-48" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i}>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <SkeletonText className="w-24" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
                <SkeletonText className="h-9 w-16" />
              </div>
            </SkeletonCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard>
            <div className="flex flex-col gap-4 p-4">
              <SkeletonTitle />
              <Skeleton className="h-[220px] w-full rounded-lg" />
            </div>
          </SkeletonCard>

          <SkeletonCard>
            <div className="flex flex-col gap-4 p-4">
              <SkeletonTitle />
              <div className="flex flex-col gap-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  )
}
