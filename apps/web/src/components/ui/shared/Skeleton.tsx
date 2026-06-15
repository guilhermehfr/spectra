import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/classUtils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200', className)} {...props} />
}

export function SkeletonText({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('h-4', className)} {...props} />
}

export function SkeletonAvatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('size-16 rounded-full', className)} {...props} />
}

export function SkeletonCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-slate-200 bg-white overflow-hidden', className)}
      {...props}
    />
  )
}

export function SkeletonButton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('h-9 rounded-lg', className)} {...props} />
}

export function SkeletonTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <SkeletonText className={cn('h-8 w-48', className)} {...props} />
}
