import { CalendarHeart, Phone } from 'lucide-react'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import { images, site, PHONE_DISPLAY } from '../data/site.js'
import { openStatus } from '../lib/hours.js'
import { useNow } from '../hooks/useNow.js'
import { BookOnlineButton, Stars } from './ui.jsx'

/**
 * Portada: la foto del salón crece al hacer scroll (ScrollExpandMedia) y al
 * terminar aparece el texto de bienvenida con los botones de reserva.
 */
export default function Hero() {
  const status = openStatus(useNow())

  return (
    <ScrollExpandMedia
      id="inicio"
      mediaType="image"
      mediaSrc={images.hero}
      mediaAlt="Interior de MNC Beauty Salon en Sant Celoni"
      bgImageSrc={images.heroBg}
      title="MNC Beauty Salon"
      date={`Sant Celoni · más de ${site.years} años`}
      scrollToExpand="Desliza para entrar"
    >
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 text-center sm:px-6 sm:pb-28">
        <p className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3.5 py-1.5 text-sm text-cream">
          <span className={`size-2 rounded-full ${status.open ? 'bg-[#9CC79A]' : 'bg-cream/50'}`} aria-hidden />
          {status.label}
        </p>
        <p className="mt-6 font-serif text-3xl leading-tight text-cream sm:text-4xl">
          Tu salón de belleza y <em className="text-gold-light">bienestar</em> en Sant&nbsp;Celoni
        </p>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-cream/80 sm:text-lg">
          Más de {site.years} años de oficio. Mónica y su equipo crean estilos a medida con técnica,
          calma y mimo, y ahora también te esperan en Renova Hair Spa.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BookOnlineButton variant="gold" icon={CalendarHeart}>Pide tu cita</BookOnlineButton>
          <a
            href={site.links.phone}
            className="inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm text-cream/90 underline-offset-4 hover:underline"
          >
            <Phone className="size-4" strokeWidth={1.5} aria-hidden /> o llama al {PHONE_DISPLAY}
          </a>
        </div>
        <a href="#resenas" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-cream/80 hover:text-cream">
          <Stars className="size-3.5" label={`${site.rating.score} de 5 estrellas`} />
          <strong className="font-medium text-cream">{site.rating.score}</strong>
          en Google · {site.rating.count} reseñas
        </a>
      </div>
    </ScrollExpandMedia>
  )
}
