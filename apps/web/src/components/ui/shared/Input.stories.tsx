import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    fullWidth: { control: 'boolean' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter your full name',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Email',
    placeholder: 'email@example.com',
    hint: 'We will only use this for contact',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'email@example.com',
    error: 'Invalid email address',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Full name',
    value: 'John Doe',
    disabled: true,
  },
}

export const WithStartIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
  },
  render: (args) => (
    <Input
      {...args}
      startIcon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      }
    />
  ),
}
