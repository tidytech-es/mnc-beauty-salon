import { Star } from 'lucide-react'
import { wa } from '../data/site.js'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.16em] transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.97]'

const variants = {
  dark: 'bg-espresso text-cream hover:bg-mocha',
  // Texto espresso sobre dorado claro: 6.6:1
  gold: 'bg-gold-light text-espresso hover:bg-cream',
  light: 'bg-cream text-espresso hover:bg-white',
  outline: 'border border-espresso/30 text-espresso hover:border-espresso hover:bg-espresso hover:text-cream',
  ghostLight: 'border border-cream/50 text-cream hover:bg-cream hover:text-espresso',
}

/** Botón de reserva: abre WhatsApp con el mensaje indicado. */
export function BookButton({ variant = 'dark', className = '', children = 'Reserva tu cita', icon: Icon, message, ...rest }) {
  return (
    <a
      href={wa(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="size-4" strokeWidth={1.75} aria-hidden />}
      {children}
    </a>
  )
}

export function LinkButton({ href, variant = 'outline', className = '', children, ...rest }) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}

export function Stars({ className = 'size-4', label = '5 de 5 estrellas' }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={className} fill="currentColor" strokeWidth={0} aria-hidden />
      ))}
    </span>
  )
}

/** Título de sección: sin etiqueta encima; el título habla solo. */
export function SectionHeading({ title, intro, align = 'center', dark = false, className = '' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={`max-w-2xl ${alignCls} ${className}`}>
      <h2 className={`text-[2.5rem] leading-[1.04] sm:text-[3.25rem] ${dark ? 'text-cream' : 'text-espresso'}`}>{title}</h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? 'text-cream/75' : 'text-mocha'}`}>{intro}</p>
      )}
    </div>
  )
}
