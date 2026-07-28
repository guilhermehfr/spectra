import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Shared/Avatar',
  component: Avatar,
}

export default meta

type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/40?img=3',
    alt: 'User profile picture',
  },
}

export const WithTwoInitials: Story = {
  args: {
    text: 'GC',
  },
}

export const WithSingleInitial: Story = {
  args: {
    text: 'A',
  },
}

export const WithThreeInitials: Story = {
  args: {
    text: 'JRS',
  },
}