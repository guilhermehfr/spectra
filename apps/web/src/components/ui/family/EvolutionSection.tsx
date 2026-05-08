import { twMerge } from 'tailwind-merge'

interface SectionProps {
  icon: React.ReactNode
  title: string
  content: string
  variant?: 'default' | 'highlight'
}

export function Section({ icon, title, content, variant = 'default' }: SectionProps) {
  const isHighlight = variant === 'highlight'

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={twMerge(
            'flex h-8 w-8 items-center justify-center rounded-full',
            isHighlight
              ? 'bg-cyan-100 text-cyan-600'
              : 'bg-blue-100 text-blue-600'
          )}
        >
          {icon}
        </div>
        <h3
          className={twMerge(
            'font-manrope text-base font-semibold',
            isHighlight ? 'text-cyan-700' : 'text-slate-900'
          )}
        >
          {title}
        </h3>
      </div>
      <p
        className={twMerge(
          'font-manrope text-sm leading-relaxed',
          isHighlight ? 'text-cyan-800' : 'text-slate-600'
        )}
      >
        {content}
      </p>
    </div>
  )
}