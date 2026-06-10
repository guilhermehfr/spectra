import type { Metadata } from 'next'
import { Manrope, DM_Sans } from 'next/font/google'
import { Bounce, ToastContainer } from 'react-toastify'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { LanguageToggle } from '@/components/ui/shared'
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

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages()
  return {
    title: 'Spectra',
    description:
      (messages as Record<string, Record<string, string>>).Metadata?.description || 'Spectra',
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${manrope.variable} ${dmSans.variable} font-manrope antialiased bg-surface-soft`}
      >
        <MSWProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="fixed top-4 right-4 z-[60]">
              <LanguageToggle />
            </div>
            {children}
          </NextIntlClientProvider>
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
