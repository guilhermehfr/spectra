import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/shared'

export default function FamilyEvolutionsLoading() {
  return (
    <div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:pt-24">
        <div className="mb-8">
          <SkeletonText className="h-8 w-48 mb-1" />
          <SkeletonText className="w-64" />
        </div>

        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i}>
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <SkeletonText className="w-28" />
                  </div>
                  <SkeletonText className="w-20" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="flex justify-center">
                  <SkeletonText className="w-36" />
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  )
}
