import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Shared/Container',
  component: Container,
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {
  render: () => (
    <Container>
      <p className="text-slate-900">This is content inside a Container card.</p>
    </Container>
  ),
}
