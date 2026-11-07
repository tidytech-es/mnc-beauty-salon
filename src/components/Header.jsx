import { useEffect, useState } from 'react'
import { Menu, X, CalendarHeart } from 'lucide-react'
import { navLinks } from '../data/site.js'
import { BookButton } from './ui.jsx'

export function Logo({ light = false }) {
  return (
    <a href="#inicio" className="flex min-h-11 flex-col justify-center leading-none" aria-label="MNC Beauty Salon, inicio">
      <span className={`font-serif text-[1.65rem] font-medium tracking-tight transition-colors ${light ? 'text-cream' : 'text-espresso'}`}>
        MNC <em className={`font-normal ${light ? 'text-gold-light' : 'text-gold-deep'}`}>Beauty</em>
      </span>
      <span className={`mt-1 text-[0.75rem] uppercase tracking-[0.24em] transition-colors ${light ? 'text-cream/80' : 'text-taupe'}`}>
        Salon · Sant Celoni
      </span>
    </a>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-cream/90 shadow-[0_1px_0_rgba(46,38,33,.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo light={!solid} />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative text-[0.78rem] uppercase tracking-[0.2em] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full ${
                    solid ? 'text-mocha hover:text-espresso' : 'text-cream hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <BookButton variant={solid ? 'dark' : 'light'} icon={CalendarHeart} className="!px-5 !py-3" />
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className={`grid size-11 place-items-center rounded-full lg:hidden ${solid ? 'text-espresso' : 'text-cream'}`}
          >
            {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </header>

      {/* Menú móvil: fuera del <header>, porque su backdrop-blur haría que
          "fixed" se calculara respecto al header y el menú quedara cortado. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto overscroll-contain bg-cream px-6 pb-10 pt-4 transition-all duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <ul className="flex flex-col divide-y divide-sand">
          {navLinks.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            >
              <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-serif text-3xl text-espresso">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <BookButton variant="dark" icon={CalendarHeart} className="mt-8 w-full" onClick={() => setOpen(false)} />
      </div>
    </>
  )
}
