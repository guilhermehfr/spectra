import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSessionPage({ params }: PageProps) {
  const { id } = await params
  const sessionId = parseInt(id, 10)

  if (isNaN(sessionId)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#EEF3FB] p-4">
      <h1 className="font-manrope text-2xl font-bold text-slate-900">
        Editar Sessão {sessionId} - Em desenvolvimento
      </h1>
    </div>
  )
}