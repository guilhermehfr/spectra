import type { Meta, StoryObj } from '@storybook/react'
import { TextareaField } from './TextareaField'

const meta: Meta<typeof TextareaField> = {
  title: 'Shared/TextareaField',
  component: TextareaField,
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof TextareaField>

export const Default: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Type your notes here...',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Notes',
    value: 'Patient showed significant improvement in social interaction during today\'s session.',
    placeholder: 'Type your notes here...',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Type your notes here...',
    hint: 'Describe the session observations in detail',
  },
}

export const WithError: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Type your notes here...',
    error: 'This field is required',
  },
}
