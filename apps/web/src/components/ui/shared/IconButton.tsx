import { type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const iconButtonStyle = tv({
  base: 'flex items-center justify-center rounded-lg',
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface IconButtonProps extends ComponentProps<'button'>, VariantProps<typeof iconButtonStyle> {
  icon: React.ReactNode
}

export function IconButton({ icon, size, className, ...props }: IconButtonProps) {
  return (
    <button type="button" className={iconButtonStyle({ size, className })} {...props}>
      {icon}
    </button>
  )
}
