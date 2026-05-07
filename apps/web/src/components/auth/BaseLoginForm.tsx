'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'

import { Input, Button, Container, IconButton } from '@/components/ui/shared'
import { loginAction } from '@/app/actions/auth'

import type { ReactNode } from 'react'

interface BaseLoginFormProps {
  subtitle: string
  startIcon?: ReactNode
}

const initialState = {
  email: '',
  error: '',
}

export function BaseLoginForm({ subtitle, startIcon }: BaseLoginFormProps) {
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
          {startIcon && (
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-blue-indigo-100">
              {startIcon}
            </div>
          )}

          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold font-dm-sans text-gradient-blue-indigo-500">
              Spectra
            </h1>

            <span className="text-sm text-slate-500 font-normal">{subtitle}</span>
          </div>
        </div>

        <form action={action}>
          <div className="space-y-4 pb-8">
            <Input
              label="Email"
              name="email"
              placeholder="email@email.com"
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
              <Link
                href="https://forms.gle/3iQoz6KmgkfuERKj9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
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
          <p className="text-xs text-slate-500">
            Ainda não possui uma conta?
            <Link
              href="https://forms.gle/3iQoz6KmgkfuERKj9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Contate um administrador
            </Link>
          </p>
        </div>
      </Container>
    </div>
  )
}
