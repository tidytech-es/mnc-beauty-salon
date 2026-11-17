import { MapPin, Clock, Phone, MessageCircle, Navigation, CalendarHeart } from 'lucide-react'
import { site, PHONE_DISPLAY } from '../data/site.js'
import { dayIndex, openStatus } from '../lib/hours.js'
import { useNow } from '../hooks/useNow.js'
import { bookingEnabled } from '../lib/booking-events.js'
import { SectionHeading, BookButton, BookOnlineButton, LinkButton } from './ui.jsx'
import Reveal from './Reveal.jsx'

export default function Contact() {
  const now = useNow()
  const todayIndex = dayIndex(now)
  const status = openStatus(now)

  return (
    <section id="contacto" className="bg-linen py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Te esperamos en Sant Celoni"
            intro={
              bookingEnabled
                ? 'Reserva online en un minuto, o escríbenos por WhatsApp o llámanos si lo prefieres.'
                : 'Escríbenos por WhatsApp o llámanos y te buscamos el mejor hueco.'
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-[1fr_1.3fr] lg:gap-6">
          <div className="grid gap-5">
            <Reveal className="grid gap-3">
              {bookingEnabled && (
                <BookOnlineButton variant="dark" icon={CalendarHeart}>Reservar online</BookOnlineButton>
              )}
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <BookButton variant={bookingEnabled ? 'outline' : 'dark'} icon={MessageCircle} className="flex-1">
                  {bookingEnabled ? 'WhatsApp' : 'Reservar por WhatsApp'}
                </BookButton>
                <LinkButton href={site.links.phone} variant="outline" className="flex-1">
                  <Phone className="size-4" strokeWidth={1.75} aria-hidden /> {PHONE_DISPLAY}
                </LinkButton>
              </div>
            </Reveal>

            <Reveal delay={80} className="rounded-2xl bg-white p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <Clock className="mt-1.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.5} aria-hidden />
                <div className="w-full">
                  <h3 className="text-2xl">Horario</h3>
                  <p className={`mt-1 text-sm font-medium ${status.open ? 'text-[#3F6B3D]' : 'text-taupe'}`}>{status.label}</p>
                  <ul className="mt-3 divide-y divide-linen text-[0.95rem] tabular-nums">
                    {site.hours.map((h, i) => {
                      const today = i === todayIndex
                      const closed = h.time === 'Cerrado'
                      return (
                        <li
                          key={h.day}
                          aria-current={today ? 'date' : undefined}
                          className={`flex justify-between py-2.5 ${today ? 'font-medium text-espresso' : 'text-mocha'}`}
                        >
                          <span className="flex items-center gap-2">
                            {h.day}
                            {today && (
                              <span className="rounded-full bg-linen px-2 py-0.5 text-xs font-medium text-gold-deep">Hoy</span>
                            )}
                          </span>
                          <span className={closed ? 'text-taupe' : ''}>{h.time}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="rounded-2xl bg-white p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.5} aria-hidden />
                <div>
                  <h3 className="text-2xl">Dirección</h3>
                  <address className="mt-2 not-italic leading-relaxed text-mocha">
                    {site.address.street}<br />{site.address.city}
                  </address>
                  <a
                    href={site.links.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mb-2 mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-gold-deep hover:text-espresso"
                  >
                    <Navigation className="size-3.5" strokeWidth={1.75} aria-hidden /> Cómo llegar
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} className="min-h-[20rem] overflow-hidden rounded-2xl bg-sand">
            <iframe
              title="Mapa de MNC Beauty Salon en Sant Celoni"
              src={site.links.mapsEmbed}
              className="size-full min-h-[20rem] border-0 grayscale-[40%] sepia-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
