import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  Clock,
  Loader2,
  MessageCircle,
  Shuffle,
  X,
} from 'lucide-react'
import { bookingServices, serviceGroups, staff, MAX_DAYS_AHEAD } from '../data/booking.js'
import { site, wa, PHONE_DISPLAY } from '../data/site.js'
import { addDaysYmd, openingFor, todayYmd } from '../lib/booking-core.js'
import { BOOKING_EVENT } from '../lib/booking-events.js'

const STEPS = ['service', 'staff', 'time', 'details', 'done']
const STEP_TITLES = {
  service: '¿Qué te hacemos?',
  staff: '¿Con quién?',
  time: 'Elige día y hora',
  details: 'Tus datos',
  done: '¡Cita reservada!',
}

const dayLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: 'UTC' })
const dayNum = new Intl.DateTimeFormat('es-ES', { day: 'numeric', timeZone: 'UTC' })
const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: 'UTC' })
const longDate = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})
const asUtc = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
const fmtDuration = (min) =>
  min < 60 ? `${min} min` : `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}`

const gcalStamp = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const initialForm = { name: '', phone: '', notes: '', consent: false, company: '' }

export default function Booking() {
  const dialogRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('service')
  const [group, setGroup] = useState(null)
  const [serviceId, setServiceId] = useState(null)
  const [staffId, setStaffId] = useState('any')
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [slots, setSlots] = useState({ status: 'idle', list: [] })
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submit, setSubmit] = useState({ status: 'idle', message: '' })
  const [result, setResult] = useState(null)
  const [demo, setDemo] = useState(false)
  const [takenNotice, setTakenNotice] = useState(false)

  const service = bookingServices.find((s) => s.id === serviceId)
  const team = useMemo(() => staff.filter((p) => serviceId && p.services.includes(serviceId)), [serviceId])

  const days = useMemo(() => {
    const today = todayYmd()
    return Array.from({ length: MAX_DAYS_AHEAD + 1 }, (_, i) => {
      const ymd = addDaysYmd(today, i)
      return { ymd, closed: !openingFor(ymd) }
    })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Abrir / cerrar ──────────────────────────────────────────────────
  useEffect(() => {
    const onOpen = (e) => {
      const { group: g = null, service: s = null } = e.detail || {}
      setGroup(g)
      setServiceId(s)
      setStaffId('any')
      setDate(null)
      setTime(null)
      setSlots({ status: 'idle', list: [] })
      setForm(initialForm)
      setFieldErrors({})
      setSubmit({ status: 'idle', message: '' })
      setResult(null)
      setTakenNotice(false)
      setStep(s ? 'staff' : 'service')
      setOpen(true)
    }
    window.addEventListener(BOOKING_EVENT, onOpen)
    return () => window.removeEventListener(BOOKING_EVENT, onOpen)
  }, [])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  // ── Huecos del día elegido ──────────────────────────────────────────
  const reqId = useRef(0)
  const loadSlots = useCallback(async (ymd) => {
    const id = ++reqId.current // solo vale la respuesta de la última petición
    setSlots({ status: 'loading', list: [], date: ymd })
    try {
      const qs = new URLSearchParams({ service: serviceId, staff: staffId, date: ymd })
      const res = await fetch(`/api/availability?${qs}`)
      const data = await res.json().catch(() => ({}))
      if (id !== reqId.current) return
      if (!res.ok) {
        setSlots({ status: res.status === 503 ? 'offline' : 'error', list: [], date: ymd })
        return
      }
      setDemo(Boolean(data.demo))
      setSlots({ status: 'ready', list: data.slots || [], date: ymd })
    } catch {
      if (id === reqId.current) setSlots({ status: 'error', list: [], date: ymd })
    }
  }, [serviceId, staffId])

  useEffect(() => {
    if (step === 'time' && date) loadSlots(date)
  }, [step, date, loadSlots])

  // Al entrar en "día y hora", elegir el primer día abierto…
  const autoPick = useRef(0)
  useEffect(() => {
    if (step === 'time' && !date) {
      autoPick.current = 7 // …y si no tiene huecos, saltar solo hasta 7 días abiertos más
      setDate(days.find((d) => !d.closed)?.ymd ?? null)
    }
  }, [step, date, days])
  useEffect(() => {
    if (slots.status !== 'ready' || slots.date !== date) return
    if (slots.list.length || autoPick.current <= 0) {
      autoPick.current = 0
      return
    }
    autoPick.current -= 1
    const next = days.find((d) => d.ymd > date && !d.closed)
    if (next) setDate(next.ymd)
  }, [slots, date, days])

  const go = (s) => setStep(s)
  const back = () => {
    const i = STEPS.indexOf(step)
    if (step === 'staff' && !group && !serviceId) return go('service')
    if (i > 0) go(STEPS[i - 1])
  }

  // ── Enviar ──────────────────────────────────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (form.name.trim().length < 2) errs.name = 'Escribe tu nombre.'
    const digits = form.phone.replace(/[^\d]/g, '')
    if (digits.length < 9 || digits.length > 15) errs.phone = 'Escribe un teléfono válido.'
    if (!form.consent) errs.consent = 'Necesitamos tu permiso para guardar la cita.'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return

    setSubmit({ status: 'sending', message: '' })
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ service: serviceId, staff: staffId, date, time, ...form }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setResult(data.booking)
        setSubmit({ status: 'idle', message: '' })
        go('done')
        return
      }
      if (data.error === 'slot_taken') {
        setTime(null)
        setSubmit({ status: 'idle', message: '' })
        setTakenNotice(true)
        go('time') // al volver a "día y hora" se recargan los huecos
        return
      }
      if (data.error === 'validation') {
        setFieldErrors(data.fields || {})
        setSubmit({ status: 'idle', message: '' })
        return
      }
      setSubmit({
        status: 'error',
        message: 'No hemos podido guardar la cita. Inténtalo de nuevo o escríbenos por WhatsApp.',
      })
    } catch {
      setSubmit({ status: 'error', message: 'Sin conexión. Revisa internet e inténtalo de nuevo.' })
    }
  }

  const stepIndex = Math.min(STEPS.indexOf(step), 3)
  const services = group ? bookingServices.filter((s) => s.group === group) : bookingServices
  const groupedServices = Object.entries(serviceGroups)
    .map(([g, label]) => [label, services.filter((s) => s.group === g)])
    .filter(([, list]) => list.length)

  const staffName = (id) => staff.find((p) => p.id === id)?.name

  return (
    <dialog
      ref={dialogRef}
      id="reservar"
      aria-labelledby="booking-title"
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      onClick={(e) => e.target === dialogRef.current && setOpen(false)}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-cream p-0 text-espresso backdrop:bg-espresso/60 backdrop:backdrop-blur-sm sm:m-auto sm:h-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-2xl sm:shadow-[0_30px_80px_-30px_rgba(0,0,0,.6)]"
    >
      {open && (
        <div className="flex h-full flex-col sm:max-h-[90dvh]">
          {/* Cabecera */}
          <header className="flex items-center gap-2 border-b border-sand px-3 py-3 sm:px-5">
            {step !== 'service' && step !== 'done' ? (
              <button
                type="button"
                onClick={back}
                className="grid size-11 place-items-center rounded-full hover:bg-linen"
                aria-label="Paso anterior"
              >
                <ArrowLeft className="size-5" strokeWidth={1.5} />
              </button>
            ) : (
              <span className="size-11" aria-hidden />
            )}
            <div className="flex-1 text-center">
              <h2 id="booking-title" className="text-2xl leading-tight">{STEP_TITLES[step]}</h2>
              {step !== 'done' && (
                <p className="text-xs text-taupe">Paso {stepIndex + 1} de 4</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-11 place-items-center rounded-full hover:bg-linen"
              aria-label="Cerrar"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </header>

          {step !== 'done' && (
            <div className="flex gap-1 px-5 pt-3" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= stepIndex ? 'bg-gold-deep' : 'bg-sand'}`}
                />
              ))}
            </div>
          )}

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            {step === 'service' && (
              <div className="space-y-6">
                {groupedServices.map(([label, list]) => (
                  <section key={label}>
                    <h3 className="mb-2 text-lg text-mocha">{label}</h3>
                    <ul className="space-y-2">
                      {list.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setServiceId(s.id)
                              setStaffId('any')
                              setDate(null)
                              setTime(null)
                              go('staff')
                            }}
                            className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left transition-colors hover:bg-linen"
                          >
                            <span className="font-medium">{s.name}</span>
                            <span className="inline-flex shrink-0 items-center gap-1 text-sm text-taupe">
                              <Clock className="size-3.5" strokeWidth={1.5} aria-hidden />
                              {fmtDuration(s.duration)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                {group && (
                  <button
                    type="button"
                    onClick={() => setGroup(null)}
                    className="min-h-11 text-sm font-medium text-gold-deep underline underline-offset-4"
                  >
                    Ver todos los servicios
                  </button>
                )}
              </div>
            )}

            {step === 'staff' && service && (
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setStaffId('any')
                      setDate(null)
                      setTime(null)
                      go('time')
                    }}
                    className="flex min-h-16 w-full items-center gap-4 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-gold/40 transition-colors hover:bg-linen"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linen text-gold-deep">
                      <Shuffle className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span>
                      <span className="block font-medium">Sin preferencia</span>
                      <span className="block text-sm text-taupe">
                        Más horas disponibles. Te asignamos a quien tenga menos citas ese día.
                      </span>
                    </span>
                  </button>
                </li>
                {team.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffId(p.id)
                        setDate(null)
                        setTime(null)
                        go('time')
                      }}
                      className="flex min-h-16 w-full items-center gap-4 rounded-2xl bg-white px-4 py-3 text-left transition-colors hover:bg-linen"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-espresso font-serif text-lg text-cream">
                        {p.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block font-medium">{p.name}</span>
                        <span className="block text-sm text-taupe">{p.role}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {step === 'time' && (
              <div>
                <p className="mb-3 text-sm text-mocha">
                  {service?.name} · {fmtDuration(service?.duration ?? 0)} ·{' '}
                  {staffId === 'any' ? 'Sin preferencia' : staffName(staffId)}
                </p>

                <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:-mx-6 sm:px-6">
                  <ul className="flex gap-2" role="listbox" aria-label="Día">
                    {days.map((d) => {
                      const selected = d.ymd === date
                      return (
                        <li key={d.ymd}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            disabled={d.closed}
                            onClick={() => {
                              autoPick.current = 0
                              setDate(d.ymd)
                              setTime(null)
                            }}
                            className={`flex h-[4.75rem] w-16 flex-col items-center justify-center rounded-2xl text-sm transition-colors ${
                              selected
                                ? 'bg-espresso text-cream'
                                : d.closed
                                  ? 'cursor-not-allowed bg-transparent text-taupe/60 line-through'
                                  : 'bg-white hover:bg-linen'
                            }`}
                          >
                            <span className="capitalize">{dayLabel.format(asUtc(d.ymd)).replace('.', '')}</span>
                            <span className="font-serif text-2xl leading-none">{dayNum.format(asUtc(d.ymd))}</span>
                            <span className="text-xs capitalize opacity-80">{monthLabel.format(asUtc(d.ymd)).replace('.', '')}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="mt-5" aria-live="polite">
                  {takenNotice && slots.status !== 'loading' && (
                    <p className="mb-3 rounded-xl bg-linen px-4 py-3 text-sm text-espresso">
                      Vaya, esa hora se acaba de ocupar. Elige otra, por favor.
                    </p>
                  )}
                  {slots.status === 'loading' && (
                    <div className="grid grid-cols-4 gap-2" aria-label="Cargando horas">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="h-12 animate-pulse rounded-xl bg-sand/60" />
                      ))}
                    </div>
                  )}
                  {slots.status === 'ready' && slots.list.length === 0 && (
                    <div className="rounded-2xl bg-white p-5 text-center">
                      <p className="font-medium">No quedan horas libres este día.</p>
                      <button
                        type="button"
                        onClick={() => {
                          const next = days.find((d) => d.ymd > date && !d.closed)
                          if (next) setDate(next.ymd)
                        }}
                        className="mt-2 min-h-11 text-sm font-medium text-gold-deep underline underline-offset-4"
                      >
                        Ver el siguiente día
                      </button>
                    </div>
                  )}
                  {slots.status === 'ready' && slots.list.length > 0 && (
                    <>
                      {[
                        ['Mañana', slots.list.filter((s) => s.time < '14:00')],
                        ['Tarde', slots.list.filter((s) => s.time >= '14:00')],
                      ]
                        .filter(([, l]) => l.length)
                        .map(([label, list]) => (
                          <section key={label} className="mb-4">
                            <h3 className="mb-2 text-sm font-medium text-taupe">{label}</h3>
                            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                              {list.map((s) => (
                                <li key={s.time}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTime(s.time)
                                      setTakenNotice(false)
                                      go('details')
                                    }}
                                    className={`h-12 w-full rounded-xl text-[0.95rem] tabular-nums transition-colors ${
                                      time === s.time ? 'bg-espresso text-cream' : 'bg-white hover:bg-linen'
                                    }`}
                                  >
                                    {s.time}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                    </>
                  )}
                  {(slots.status === 'error' || slots.status === 'offline') && (
                    <div className="rounded-2xl bg-white p-5 text-center">
                      <p className="font-medium">
                        {slots.status === 'offline'
                          ? 'La reserva online no está disponible ahora mismo.'
                          : 'No hemos podido cargar las horas.'}
                      </p>
                      <a
                        href={wa('Hola, me gustaría reservar una cita.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gold-deep underline underline-offset-4"
                      >
                        <MessageCircle className="size-4" strokeWidth={1.6} aria-hidden /> Reservar por WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'details' && service && date && time && (
              <form id="booking-form" onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="font-medium text-espresso">{service.name}</p>
                  <p className="mt-1 text-mocha first-letter:uppercase">
                    {longDate.format(asUtc(date))} a las {time} · {fmtDuration(service.duration)}
                  </p>
                  <p className="text-mocha">
                    {staffId === 'any' ? 'Profesional: te lo asignamos al confirmar' : `Con ${staffName(staffId)}`}
                  </p>
                </div>

                <Field label="Nombre" error={fieldErrors.name}>
                  <input
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={60}
                    className="input"
                  />
                </Field>
                <Field label="Teléfono" hint="Por si necesitamos avisarte de algún cambio." error={fieldErrors.phone}>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    maxLength={20}
                    className="input"
                  />
                </Field>
                <Field label="Comentario (opcional)" hint="Por ejemplo: largo del pelo, color que buscas…">
                  <textarea
                    name="notes"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    maxLength={300}
                    className="input resize-none"
                  />
                </Field>

                {/* Trampa anti-bots: invisible para personas */}
                <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
                  <label>
                    Empresa
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </label>
                </div>

                <label className="flex gap-3 text-sm text-mocha">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-0.5 size-5 shrink-0"
                  />
                  <span>
                    Acepto que {site.name} guarde mi nombre y teléfono para gestionar esta cita.
                    {fieldErrors.consent && (
                      <span className="mt-1 block font-medium text-[#9A3B2E]">{fieldErrors.consent}</span>
                    )}
                  </span>
                </label>

                {submit.status === 'error' && (
                  <p role="alert" className="rounded-xl bg-[#F6E3DF] px-4 py-3 text-sm text-[#7A2E22]">
                    {submit.message}
                  </p>
                )}
              </form>
            )}

            {step === 'done' && result && (
              <div className="text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#E3EEDF] text-[#3F6B3D]">
                  <Check className="size-8" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="mt-4 text-mocha">Te esperamos, {result.name.split(' ')[0]}.</p>
                <div className="mt-5 rounded-2xl bg-white p-5 text-left">
                  <p className="font-serif text-2xl leading-tight">{result.service}</p>
                  <p className="mt-2 text-mocha first-letter:uppercase">
                    {longDate.format(asUtc(result.date))} a las {result.time}
                  </p>
                  <p className="text-mocha">
                    Con {result.staff}
                    {result.assigned && <span className="text-taupe"> (asignado automáticamente)</span>}
                  </p>
                  <p className="mt-2 text-sm text-taupe">
                    {site.address.street}, {site.address.city}
                  </p>
                </div>
                {demo && (
                  <p className="mt-3 text-xs text-taupe">Modo demo: esta cita no se ha guardado en ningún calendario.</p>
                )}
                <div className="mt-5 grid gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Mi cita en ${site.name}: ${result.service}, ${longDate.format(asUtc(result.date))} a las ${result.time}, con ${result.staff}. ${site.address.street}, Sant Celoni.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-espresso px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-cream hover:bg-mocha"
                  >
                    <MessageCircle className="size-4" strokeWidth={1.75} aria-hidden /> Guardar los detalles en WhatsApp
                  </a>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      `${result.service} · ${site.name}`,
                    )}&dates=${gcalStamp(result.start)}/${gcalStamp(result.end)}&location=${encodeURIComponent(
                      `${site.address.street}, ${site.address.city}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-espresso/30 px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] hover:bg-linen"
                  >
                    <CalendarPlus className="size-4" strokeWidth={1.75} aria-hidden /> Añadir a mi calendario
                  </a>
                </div>
                <p className="mt-5 text-sm text-mocha">
                  ¿Necesitas cambiarla o anularla?{' '}
                  <a
                    href={wa(
                      `Hola, tengo cita el ${longDate.format(asUtc(result.date))} a las ${result.time} (${result.service}) y necesito cambiarla.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gold-deep underline underline-offset-4"
                  >
                    Escríbenos por WhatsApp
                  </a>{' '}
                  o llama al {PHONE_DISPLAY}.
                </p>
              </div>
            )}
          </div>

          {/* Pie con botón principal (solo en el paso de datos) */}
          {step === 'details' && (
            <footer
              className="border-t border-sand px-4 pt-3 sm:px-6"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <button
                type="submit"
                form="booking-form"
                disabled={submit.status === 'sending'}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 text-[0.85rem] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-mocha disabled:opacity-70"
              >
                {submit.status === 'sending' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Reservando…
                  </>
                ) : (
                  'Confirmar cita'
                )}
              </button>
            </footer>
          )}
          {step === 'done' && (
            <footer className="px-4 pb-5 sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-12 w-full rounded-full text-sm font-medium text-mocha hover:bg-linen"
              >
                Cerrar
              </button>
            </footer>
          )}
        </div>
      )}
    </dialog>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-espresso">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm font-medium text-[#9A3B2E]">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-taupe">{hint}</span>
      )}
    </label>
  )
}
