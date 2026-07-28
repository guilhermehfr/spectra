import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Shared/InputField',
  component: InputField,
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof InputField>

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

export const WithValue: Story = {
  args: {
    label: 'Full name',
    value: 'John Doe',
    placeholder: 'Enter your full name',
  },
}