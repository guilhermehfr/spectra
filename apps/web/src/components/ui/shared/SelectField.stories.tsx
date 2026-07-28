import type { Meta, StoryObj } from '@storybook/react'
import { SelectField } from './SelectField'

const meta: Meta<typeof SelectField> = {
  title: 'Shared/SelectField',
  component: SelectField,
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SelectField>

export const Default: Story = {
  args: {
    label: 'Gender',
    placeholder: 'Select an option',
    children: (
      <>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </>
    ),
  },
}

export const WithHint: Story = {
  args: {
    label: 'Gender',
    placeholder: 'Select an option',
    hint: 'Choose the gender identity',
    children: (
      <>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </>
    ),
  },
}

export const WithError: Story = {
  args: {
    label: 'Gender',
    placeholder: 'Select an option',
    error: 'This field is required',
    children: (
      <>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </>
    ),
  },
}

export const WithValue: Story = {
  args: {
    label: 'Gender',
    value: 'female',
    children: (
      <>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </>
    ),
  },
}
