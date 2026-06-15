import { SkeletonText, SkeletonCard, SkeletonButton } from '@/components/ui/shared'

export default function EditPatientLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:pt-24">
      <SkeletonCard className="p-6">
        <div className="flex flex-col gap-6">
          <div>
            <SkeletonText className="h-7 w-48 mb-1" />
            <SkeletonText className="w-56" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((col) => (
              <div key={col}>
                <SkeletonText className="w-20 mb-1" />
                <div className="h-10 bg-slate-200 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((col) => (
              <div key={col}>
                <SkeletonText className="w-28 mb-1" />
                <div className="h-10 bg-slate-200 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>

          <div>
            <SkeletonText className="w-16 mb-1" />
            <div className="h-24 bg-slate-200 animate-pulse rounded-lg" />
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
