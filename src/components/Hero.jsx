import { CalendarHeart, Phone } from 'lucide-react'
import { images, site, PHONE_DISPLAY } from '../data/site.js'
import { openStatus } from '../lib/hours.js'
import { useNow } from '../hooks/useNow.js'
import { BookButton, Stars } from './ui.jsx'
import Reveal from './Reveal.jsx'

export default function Hero() {
  const status = openStatus(useNow())

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-espresso pb-12 pt-32 sm:items-center sm:pb-20"
    >
      <img
        src={images.hero}
        alt="Interior de MNC Beauty Salon en Sant Celoni"
        className="hero-settle absolute inset-0 -z-20 size-full object-cover"
        fetchPriority="high"
      />
      {/* Velo cálido: deja respirar la foto y asegura contraste del texto */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/10 sm:bg-gradient-to-r sm:from-espresso/85 sm:via-espresso/45 sm:to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-espresso/75 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-espresso/55 px-3.5 py-1.5 text-sm text-cream backdrop-blur-sm">
              <span className={`size-2 rounded-full ${status.open ? 'bg-[#9CC79A]' : 'bg-cream/50'}`} aria-hidden />
              {status.label}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-[2.85rem] leading-[0.98] text-cream sm:text-6xl lg:text-[4.5rem]">
              Tu salón de belleza y <em className="font-normal text-gold-light">bienestar</em> en Sant&nbsp;Celoni
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg">
              Más de {site.years} años de oficio. Mónica y su equipo crean estilos a medida con técnica,
              calma y mimo, y ahora también te esperan en Renova Hair Spa.
            </p>
          </Reveal>
          <Reveal delay={300} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookButton variant="gold" icon={CalendarHeart}>Pide tu cita</BookButton>
            <a
              href={site.links.phone}
              className="inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm text-cream/90 underline-offset-4 hover:underline"
            >
              <Phone className="size-4" strokeWidth={1.5} aria-hidden /> o llama al {PHONE_DISPLAY}
            </a>
          </Reveal>
          <Reveal delay={400} className="mt-9 border-t border-cream/15 pt-5">
            <a
              href="#resenas"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-cream/80 hover:text-cream"
            >
              <Stars className="size-3.5" label={`${site.rating.score} de 5 estrellas`} />
              <strong className="font-medium text-cream">{site.rating.score}</strong>
              en Google · {site.rating.count} reseñas
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
