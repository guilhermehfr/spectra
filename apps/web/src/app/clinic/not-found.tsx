'use client'

import { Layout } from '@/components/layout/clinic'
import Link from 'next/link'

export default function ClinicNotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="text-xl text-slate-600 mt-2 mb-2">Página não encontrada</p>
        <p className="text-sm text-slate-500 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/clinic/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          Ir para a dashboard
        </Link>
      </div>
    </Layout>
  )
}