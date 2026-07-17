import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25',
  secondary: 'bg-white/10 text-white border border-white/10 hover:bg-white/15 backdrop-blur-sm',
  accent: 'bg-accent text-white hover:bg-emerald-600 shadow-lg shadow-accent/25',
  ghost: 'text-zinc-300 hover:text-white hover:bg-white/10',
  glass: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export default function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
