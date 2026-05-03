'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { UserRound, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'

import { Input } from '@/components/ui/shared/Input'
import { Button } from '@/components/ui/shared/Button'
import { Container } from '@/components/ui/shared/Container'
import { IconButton } from '@/components/ui/shared/IconButton'
import { loginAction } from '@/app/actions/auth'

export function ClinicLoginForm() {
  const initialState = {
    email: '',
    error: '',
  }

  const [state, action, isPending] = useActionState(loginAction, initialState)

  useEffect(() => {
    toast.dismiss()
    if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Container className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold font-dm-sans text-gradient-blue-indigo-500">
              Spectra
            </h1>

            <span className="text-sm text-slate-500 font-normal">
              Portal de gerenciamento clínico
            </span>
          </div>
        </div>

        <form action={action}>
          <div className="space-y-4 pb-8">
            <Input
              label="Email"
              name="email"
              startIcon={<UserRound size={18} strokeWidth={1.5} />}
              placeholder="admin@email.com"
              type="text"
              autoComplete="current-email"
              defaultValue={state.email}
            />

            <Input
              label="Senha"
              name="password"
              startIcon={<Lock size={18} strokeWidth={1.5} />}
              endIcon={
                <IconButton
                  icon={
                    showPassword ? (
                      <EyeOff size={20} strokeWidth={1.5} />
                    ) : (
                      <Eye size={20} strokeWidth={1.5} />
                    )
                  }
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-slate-500"
                />
              }
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
            />

            <div className="flex justify-end -mt-2">
              {/* TODO: Replace this HREF to a valid google form */}
              <Link href="#" className="text-xs text-blue-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            endIcon={<ArrowRight size={16} />}
            fullWidth={true}
            loading={isPending}
          >
            Entrar
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center">
          {/* TODO: Replace this HREF to a valid google form */}
          <p className="text-xs text-slate-500">
            Ainda não possui uma conta?
            <Link href="#" className="text-blue-600 hover:underline ml-1">
              Contate um administrador
            </Link>
          </p>
        </div>
      </Container>
    </div>
  )
}
