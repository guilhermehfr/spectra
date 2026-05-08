'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { deleteSession } from '@/lib/api/clinic'

export async function deleteSessionAction(sessionId: number, patientId: number): Promise<void> {
  try {
    await deleteSession(sessionId)
    revalidatePath(`/clinic/patients/${patientId}`)
    revalidatePath('/clinic/sessions')
    redirect(`/clinic/patients/${patientId}`)
  } catch (error) {
    console.error('Failed to delete session:', error)
    throw error
  }
}
