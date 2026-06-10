'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'

import { Button } from './Button'
import { Container } from './Container'

interface BaseFormProps {
  title: string
  description?: string
  children: React.ReactNode
  action?: (formData: FormData) => void | Promise<void>
  onCancel?: () => void
  cancelHref?: string
  cancelLabel?: string
  submitLabel?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
  className?: string
}

export function BaseForm({
  title,
  description,
  children,
  action,
  onCancel,
  cancelHref,
  cancelLabel: cancelLabelProp,
  submitLabel: submitLabelProp,
  isSubmitting = false,
  submitDisabled = false,
  className,
}: BaseFormProps) {
  const t = useTranslations('Common')
  const cancelLabel = cancelLabelProp ?? t('cancel')
  const submitLabel = submitLabelProp ?? t('save')
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleCancel = () => {
    if (cancelHref) {
      router.push(cancelHref)
    } else if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  return (
    <div className={twMerge('flex items-center justify-center p-4', className)}>
      <Container className="w-full max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="font-manrope text-[28px] font-bold text-slate-900">{title}</h1>
            {description && <p className="font-manrope text-sm text-slate-500">{description}</p>}
          </div>

          <form ref={formRef} action={action} className="space-y-6">
            {children}

            <div className="h-px w-full bg-slate-200" />

            <div className="flex justify-end gap-3 pt-2">
              {cancelHref ? (
                <Link
                  href={cancelHref}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  {cancelLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </button>
              )}

              <Button type="submit" loading={isSubmitting} disabled={submitDisabled}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}
