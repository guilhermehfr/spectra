import Image from 'next/image'
import { Brain } from 'lucide-react'

interface ClinicSidebarHeaderProps {
  logoSrc?: string
  brandName?: string
  subtitle?: string
  logoBackgroundColor?: string
}

export function ClinicSidebarHeader({
  logoSrc,
  brandName = 'Spectra',
  subtitle = 'Gerenciamento de Clínica',
  logoBackgroundColor = 'bg-blue-100',
}: ClinicSidebarHeaderProps) {
  return (
    <div className="px-4 py-4 pb-8 border-b border-slate-200">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${logoBackgroundColor}`}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="Spectra Logo"
              width={32}
              height={32}
              className="w-full h-full"
            />
          ) : (
            <Brain size={20} className="text-blue-600" strokeWidth={1.5} />
          )}
        </div>

        {/* Branding */}
        <div className="flex flex-col gap-0.5">
          <p className="text-slate-900 font-manrope font-semibold text-base leading-tight">
            {brandName}
          </p>
          <p className="text-slate-500 font-manrope font-normal text-xs leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
