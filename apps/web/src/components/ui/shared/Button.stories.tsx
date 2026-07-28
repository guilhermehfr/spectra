import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Save', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'View more', variant: 'ghost' },
}

export const Loading: Story = {
  args: { children: 'Saving...', loading: true },
}

export const Disabled: Story = {
  args: { children: 'Submit', disabled: true },
}

export const Small: Story = {
  args: { children: 'Edit', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Create patient', size: 'lg' },
}