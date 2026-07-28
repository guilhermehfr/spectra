import type { Meta, StoryObj } from '@storybook/react'
import { LanguageToggle } from './LanguageToggle'

const meta: Meta<typeof LanguageToggle> = {
  title: 'Shared/LanguageToggle',
  component: LanguageToggle,
  argTypes: {
    initialLocale: { control: 'select', options: ['en', 'pt-BR'] },
  },
}

export default meta
type Story = StoryObj<typeof LanguageToggle>

export const EnglishActive: Story = {
  args: {
    initialLocale: 'en',
  },
}

export const PortugueseActive: Story = {
  args: {
    initialLocale: 'pt-BR',
  },
}
