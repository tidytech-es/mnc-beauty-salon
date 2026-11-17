import { Gift, Sparkles, Clock, Tag } from 'lucide-react'
import { images, spa } from '../data/site.js'
import { BookButton, BookOnlineButton, Stars } from './ui.jsx'
import Reveal from './Reveal.jsx'

/** Flor de loto en línea, eco del logotipo de Renova (geometría simple, no ilustración). */
function Lotus({ className }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="0.6" className={className} aria-hidden>
      <path d="M32 4c5 6 7 13 7 19s-3 11-7 13c-4-2-7-7-7-13s2-13 7-19z" />
      <path d="M32 36c-6-1-12-5-15-11-2-5-2-10 0-14 6 2 11 7 13 13" />
      <path d="M32 36c6-1 12-5 15-11 2-5 2-10 0-14-6 2-11 7-13 13" />
      <path d="M32 37c-9 1-18-2-24-8 3-3 7-5 11-5" />
      <path d="M32 37c9 1 18-2 24-8-3-3-7-5-11-5" />
    </svg>
  )
}

export default function HairSpa() {
  return (
    <section id="hair-spa" className="relative overflow-hidden bg-espresso py-20 text-cream sm:py-32">
      <Lotus className="pointer-events-none absolute -right-20 top-8 w-[26rem] text-gold/20 sm:w-[36rem]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:gap-20 lg:px-8">
        {/* La foto va primero también en móvil: es el gancho de la sección */}
        {/* La foto es vertical (765×1020): se mantiene vertical y con un ancho
            máximo para no ampliarla ni recortar el logo de Renova. */}
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-2xl rounded-t-[10rem] lg:rounded-t-[14rem]">
            <img
              src={images.spa}
              alt="Camilla de Renova Hair Spa preparada con bandeja de ritual y productos"
              loading="lazy"
              width="765"
              height="1020"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <figure className="absolute -bottom-5 right-4 max-w-[15rem] sm:right-[-1.5rem] rounded-2xl bg-cream px-5 py-4 text-espresso shadow-[0_18px_40px_-20px_rgba(0,0,0,.6)] lg:right-[-1.5rem]">
            <Stars className="size-3.5" />
            <blockquote lang={spa.quote.lang} className="mt-2 font-serif text-2xl leading-none">
              “{spa.quote.text}”
            </blockquote>
            <figcaption className="mt-2 text-sm text-taupe">{spa.quote.author} · Google</figcaption>
          </figure>
        </Reveal>

        <div className="pt-4 lg:pt-0">
          <Reveal>
            <h2 className="text-[3rem] leading-[0.98] sm:text-6xl">
              Renova <em className="font-normal text-gold-light">Hair Spa</em>
            </h2>
            <p className="mt-5 font-serif text-[1.6rem] italic leading-snug text-cream/90">
              Un plus de servicio, un extra de diez.
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/75 sm:text-lg">
              Una experiencia para regalar o autorregalarte. {spa.care} Tu rincón de relax absoluto.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-9 divide-y divide-cream/15 border-y border-cream/15">
              {spa.rituals.map((r) => (
                <li key={r.name} className="py-5">
                  <h3 className="text-2xl leading-tight text-gold-light">{r.name}</h3>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed text-cream/75">{r.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/75">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-gold-light" strokeWidth={1.5} aria-hidden />
                {spa.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-4 text-gold-light" strokeWidth={1.5} aria-hidden />
                {spa.price ?? 'Precio a consultar'}
              </span>
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BookOnlineButton variant="gold" icon={Sparkles} group="spa">
              Reserva tu Hair Spa
            </BookOnlineButton>
            <BookButton
              variant="ghostLight"
              icon={Gift}
              message="Hola, me gustaría regalar una experiencia Renova Hair Spa. ¿Cómo funciona?"
            >
              Regalar Hair Spa
            </BookButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
