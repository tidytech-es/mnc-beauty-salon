import { Award, HeartHandshake, Scissors } from 'lucide-react'
import { images, site } from '../data/site.js'
import { SectionHeading } from './ui.jsx'
import Reveal from './Reveal.jsx'

const values = [
  { icon: Scissors, text: 'Formación continua en técnicas de corte y color.' },
  { icon: HeartHandshake, text: 'Trato cercano: aquí te conocemos por tu nombre.' },
  { icon: Award, text: 'Productos profesionales que cuidan tu cabello.' },
]

export default function Team() {
  return (
    <section id="equipo" className="bg-linen py-20 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-8">
        <div>
          <Reveal>
            <SectionHeading
              align="left"
              title="Mónica y su equipo, tres décadas a tu lado"
              intro={`Más de ${site.years} años de oficio nos han convertido en un salón de confianza en Sant Celoni. Con Mónica trabaja un equipo que nuestras clientas nombran en sus reseñas: Meri en estética y Hair Spa, Sara en maquillaje, Meritxell, Sergi… Hay clientas que llevan con nosotros más de 12 y 15 años.`}
            />
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-10 divide-y divide-sand border-y border-sand">
              {values.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 py-4">
                  <Icon className="size-5 shrink-0 text-gold-deep" strokeWidth={1.4} aria-hidden />
                  <p className="text-mocha">{text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="relative pb-10 lg:pb-0">
          <img
            src={images.team}
            alt="Fachada de MNC Perruquers y MNC Barbershop en la Ctra. Vella, Sant Celoni"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[4/5]"
          />
          <div className="absolute bottom-0 left-4 right-4 rounded-2xl bg-cream p-5 shadow-[0_18px_40px_-22px_rgba(46,38,33,.55)] sm:left-auto sm:right-[-1.5rem] sm:max-w-xs lg:-bottom-8">
            <p className="font-serif text-xl leading-snug text-espresso">Peluquería, barbería, estética y hair spa en un mismo local.</p>
            <p className="mt-2 text-sm text-taupe">MNC Perruquers · MNC Barbershop · {site.address.street}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
