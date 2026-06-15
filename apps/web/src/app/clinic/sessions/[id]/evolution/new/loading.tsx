import { Skeleton, SkeletonText, SkeletonCard, SkeletonButton } from '@/components/ui/shared'

export default function NewEvolutionLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <SkeletonCard className="p-6">
        <div className="flex flex-col gap-6">
          <div>
            <SkeletonText className="h-7 w-48 mb-1" />
            <SkeletonText className="w-56" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((field) => (
              <div key={field}>
                <SkeletonText className="w-28 mb-1" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <SkeletonText className="w-32" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <SkeletonButton className="w-24" />
            <SkeletonButton className="w-40" />
          </div>
        </div>
      </SkeletonCard>
    </div>
  )
}
