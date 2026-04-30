import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spectra',
  description: 'Sistema de gestão para clínicas de estética',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
