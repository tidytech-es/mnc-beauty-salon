import { MessageCircle } from 'lucide-react'
import { images, services, wa } from '../data/site.js'
import { SectionHeading } from './ui.jsx'
import Reveal from './Reveal.jsx'

export default function Services() {
  return (
    <section id="servicios" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Belleza a tu medida, sin prisas"
            intro="Escuchamos lo que buscas y te asesoramos con honestidad. Productos profesionales y técnicas actuales para que salgas sintiéndote tú."
          />
        </Reveal>

        {/* Móvil: filas compactas (foto + texto). Tablet/escritorio: columnas con foto grande. */}
        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 80}>
              <article className="group grid h-full grid-cols-[6.5rem_1fr] overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_-24px_rgba(46,38,33,.45)] sm:flex sm:flex-col">
                <div className="overflow-hidden bg-linen sm:aspect-[4/5]">
                  <img
                    src={images[s.key]}
                    alt={s.imgAlt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  <h3 className="text-[1.45rem] leading-tight text-espresso sm:text-2xl">{s.title}</h3>
                  <p className="mt-1.5 flex-1 text-[0.92rem] leading-relaxed text-mocha sm:mt-3 sm:text-[0.95rem]">{s.text}</p>
                  <a
                    href={wa(`Hola, me gustaría información sobre ${s.title} en MNC Beauty Salon.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mb-2 mt-2 inline-flex min-h-11 items-center gap-2 self-start text-[0.78rem] font-medium uppercase tracking-[0.14em] text-gold-deep transition-colors hover:text-espresso sm:mt-4"
                  >
                    <MessageCircle className="size-4" strokeWidth={1.6} aria-hidden />
                    Consultar
                    <span className="sr-only"> {s.title} por WhatsApp</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
