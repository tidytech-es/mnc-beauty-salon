import { ArrowUpRight } from 'lucide-react'
import { reviews, site } from '../data/site.js'
import { SectionHeading, Stars } from './ui.jsx'
import Reveal from './Reveal.jsx'

function GoogleG(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export default function Reviews() {
  return (
    <section id="resenas" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <SectionHeading title="Lo que dicen nuestras clientas" />
          <a
            href={site.links.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full border border-sand bg-white px-5 text-sm text-mocha transition-colors hover:border-gold"
          >
            <GoogleG className="size-5" />
            <strong className="font-medium text-espresso">{site.rating.score}</strong>
            <Stars className="size-3.5" label={`${site.rating.score} de 5`} />
            <span>· {site.rating.countShort} reseñas</span>
          </a>
        </Reveal>

        {/* Móvil: carrusel con scroll-snap (asoma la siguiente tarjeta). Escritorio: 3 columnas. */}
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {reviews.map((r, i) => (
            <Reveal as="li" key={i} delay={i * 90} className="w-[84%] shrink-0 snap-center md:w-auto">
              <figure className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_14px_34px_-24px_rgba(46,38,33,.4)] sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <Stars />
                  {r.tag && (
                    <span className="rounded-full bg-linen px-3 py-1 text-xs font-medium text-gold-deep">{r.tag}</span>
                  )}
                </div>
                <blockquote lang={r.lang} className="mt-5 flex-1 font-serif text-[1.35rem] leading-snug text-espresso">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-2 border-t border-linen pt-5 text-sm">
                  <GoogleG className="size-4 shrink-0" />
                  <span className="font-medium text-espresso">{r.author}</span>
                  <span className="text-taupe">· Google</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <a
            href={site.links.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-gold-deep hover:text-espresso"
          >
            Ver todas las reseñas en Google <ArrowUpRight className="size-4" strokeWidth={1.6} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
