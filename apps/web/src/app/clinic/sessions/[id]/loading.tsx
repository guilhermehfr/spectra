import { Skeleton, SkeletonText, SkeletonCard, SkeletonButton } from '@/components/ui/shared'

export default function SessionDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <SkeletonText className="w-32" />
      </div>

      <SkeletonCard>
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <SkeletonText className="h-7 w-40 mb-1" />
              <SkeletonText className="w-36" />
            </div>
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <SkeletonText className="w-14 mb-1" />
              <SkeletonText className="w-48" />
            </div>
            <div>
              <SkeletonText className="w-16 mb-1" />
              <SkeletonText className="w-36" />
            </div>
            <div>
              <SkeletonText className="w-24 mb-1" />
              <SkeletonText className="w-full" />
              <SkeletonText className="w-3/4" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
            <SkeletonButton className="w-24" />
            <SkeletonButton className="w-36" />
          </div>
        </div>
      </SkeletonCard>
    </div>
  )
}
