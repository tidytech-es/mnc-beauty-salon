import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { site, wa } from '../data/site.js'

/**
 * Barra fija inferior en móvil: la reserva siempre a un toque.
 * Aparece al salir de la portada y se esconde en Contacto, donde ya están los mismos botones.
 */
export default function MobileBookingBar() {
  const [pastHero, setPastHero] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const contact = document.getElementById('contacto')
    let io
    if (contact && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
      io.observe(contact)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const show = pastHero && !atContact

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream/95 px-4 pt-3 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] sm:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!show}
    >
      <div className="flex gap-3">
        <a
          href={site.links.phone}
          aria-label="Llamar al salón"
          tabIndex={show ? 0 : -1}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-espresso/25 text-espresso"
        >
          <Phone className="size-5" strokeWidth={1.5} />
        </a>
        <a
          href={wa()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-espresso text-[0.8rem] font-medium uppercase tracking-[0.16em] text-cream"
        >
          <MessageCircle className="size-4" strokeWidth={1.75} /> Reserva tu cita
        </a>
      </div>
    </div>
  )
}
