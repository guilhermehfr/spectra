import { SkeletonText } from '@/components/ui/shared'

export default function NewEvolutionLoading() {
  return (
    <div className="min-h-screen bg-[#EEF3FB] p-4">
      <SkeletonText className="h-8 w-48" />
    </div>
  )
}
