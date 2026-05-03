import type { Metadata } from 'next'
import { Manrope, DM_Sans } from 'next/font/google'
import { Bounce, ToastContainer } from 'react-toastify'

import { MSWProvider } from '@/components/MSWProvider'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-manrope',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Spectra',
  description: 'Sistema de gestão para clínicas TEA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${dmSans.variable} font-manrope antialiased bg-surface-soft`}
      >
        <MSWProvider>
          {children}
          <ToastContainer
            position="top-center"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </MSWProvider>
      </body>
    </html>
  )
}
