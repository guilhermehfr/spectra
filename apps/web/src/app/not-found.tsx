import { authService } from '@/lib/authService'
import { redirect } from 'next/navigation'
import { ClinicNotFound } from '@/components/ui/clinic'
import { FamilyNotFound } from '@/components/ui/family'

export default async function NotFound() {
  let userRole: string | null = null

  try {
    const user = await authService.me()
    userRole = user.role
  } catch {
    redirect('/')
  }

  if (userRole === 'family') {
    return <FamilyNotFound />
  }

  return <ClinicNotFound />
}