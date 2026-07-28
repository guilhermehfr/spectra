import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonButton, SkeletonTitle } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Shared/Skeleton',
  component: Skeleton,
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="size-20" />,
}

export const Text: Story = {
  render: () => <SkeletonText className="w-full max-w-xs" />,
}

export const Avatar: Story = {
  render: () => <SkeletonAvatar />,
}

export const Card: Story = {
  render: () => (
    <SkeletonCard className="w-80">
      <div className="p-4 space-y-3">
        <SkeletonAvatar />
        <SkeletonTitle />
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/2" />
      </div>
    </SkeletonCard>
  ),
}

export const Button: Story = {
  render: () => <SkeletonButton className="w-24" />,
}

export const Title: Story = {
  render: () => <SkeletonTitle />,
}
