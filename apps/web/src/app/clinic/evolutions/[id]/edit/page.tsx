import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEvolutionPage({ params }: PageProps) {
  const { id } = await params
  const evolutionId = parseInt(id, 10)

  if (isNaN(evolutionId)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#EEF3FB] p-4">
      <h1 className="font-manrope text-2xl font-bold text-slate-900">
        Editar Evolução {evolutionId} - Em desenvolvimento
      </h1>
    </div>
  )
}