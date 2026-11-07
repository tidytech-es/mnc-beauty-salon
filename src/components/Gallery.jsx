import { gallery } from '../data/site.js'
import Reveal from './Reveal.jsx'

/** Tira de fotos reales del local. */
export default function Gallery() {
  return (
    <section aria-labelledby="galeria-titulo" className="pb-20 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 id="galeria-titulo" className="text-[2rem] leading-tight sm:text-[2.5rem]">Así es el salón por dentro</h2>
        </Reveal>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal as="li" key={g.src} delay={i * 70} className={i % 2 ? 'lg:mt-10' : ''}>
              <div className="overflow-hidden rounded-2xl bg-linen">
                <img src={g.src} alt={g.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
