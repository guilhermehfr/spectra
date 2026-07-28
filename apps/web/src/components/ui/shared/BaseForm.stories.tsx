import type { Meta, StoryObj } from '@storybook/react'
import { NextIntlClientProvider } from 'next-intl'
import { BaseForm } from './BaseForm'
import { InputField } from './InputField'
import { SelectField } from './SelectField'

const messages = {
  Common: {
    cancel: 'Cancel',
    save: 'Save',
  },
}

const meta: Meta<typeof BaseForm> = {
  title: 'Shared/BaseForm',
  component: BaseForm,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BaseForm>

export const Default: Story = {
  args: {
    title: 'Create Patient',
    description: 'Fill in the patient details below.',
    children: (
      <div className="space-y-4">
        <InputField label="Full name" placeholder="Enter full name" />
        <InputField label="Email" placeholder="email@example.com" type="email" />
        <SelectField label="Gender" placeholder="Select">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </SelectField>
      </div>
    ),
  },
}

export const WithoutDescription: Story = {
  args: {
    title: 'Edit Patient',
    children: (
      <div className="space-y-4">
        <InputField label="Full name" value="John Doe" />
        <InputField label="Email" value="john@example.com" type="email" />
      </div>
    ),
  },
}
