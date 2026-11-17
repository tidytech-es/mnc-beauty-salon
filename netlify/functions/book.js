/**
 * POST /api/book
 * { service, staff ('any' | id), date, time, name, phone, notes?, consent, company (trampa anti-bots) }
 * Vuelve a comprobar el hueco justo antes de guardar y, con "sin preferencia",
 * asigna a la persona con menos minutos ocupados ese día.
 */
import { staff as allStaff } from '../../src/data/booking.js'
import {
  getService,
  isBookableDate,
  computeSlots,
  busyMinutes,
  TZ,
} from '../../src/lib/booking-core.js'
import { busyFor, teamFor, dayBounds, createEvent, isConfigured, isDemo } from '../lib/calendar.js'
import { json, notConfigured } from '../lib/http.js'

const clean = (s, max) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405)
  if (!isConfigured()) return notConfigured()

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'bad_json' }, 400)
  }

  // Trampa para bots: un campo oculto que una persona nunca rellena
  if (body.company) return json({ error: 'rejected' }, 400)

  const service = getService(body.service)
  const staffId = body.staff || 'any'
  const date = body.date
  const time = String(body.time || '')
  const name = clean(body.name, 60)
  const phone = clean(body.phone, 20)
  const notes = clean(body.notes, 300)
  const phoneDigits = phone.replace(/[^\d]/g, '')

  const errors = {}
  if (!service) errors.service = 'Elige un servicio.'
  if (!isBookableDate(date)) errors.date = 'Elige un día válido.'
  if (!/^\d{2}:\d{2}$/.test(time)) errors.time = 'Elige una hora.'
  if (name.length < 2) errors.name = 'Escribe tu nombre.'
  if (phoneDigits.length < 9 || phoneDigits.length > 15) errors.phone = 'Escribe un teléfono válido.'
  if (body.consent !== true) errors.consent = 'Necesitamos tu permiso para guardar la cita.'
  if (Object.keys(errors).length) return json({ error: 'validation', fields: errors }, 400)

  const team = teamFor(service.id, staffId)
  if (!team.length) return json({ error: 'bad_staff' }, 400)

  try {
    const [dayStart, dayEnd] = dayBounds(date)
    const busyByStaff = await busyFor(team, dayStart, dayEnd)
    const slot = computeSlots({
      ymd: date,
      duration: service.duration,
      staffIds: team.map((p) => p.id),
      busyByStaff,
    }).find((s) => s.time === time)

    if (!slot) return json({ error: 'slot_taken' }, 409)

    // Persona asignada: la elegida, o la menos ocupada ese día entre las libres
    const chosenId =
      staffId !== 'any'
        ? staffId
        : [...slot.free].sort(
            (a, b) =>
              busyMinutes(busyByStaff[a], dayStart, dayEnd) -
              busyMinutes(busyByStaff[b], dayStart, dayEnd),
          )[0]
    const person = allStaff.find((p) => p.id === chosenId)

    const event = {
      summary: `${service.name} · ${name}`,
      description: [
        `Clienta/e: ${name}`,
        `Teléfono: ${phone}`,
        notes ? `Notas: ${notes}` : null,
        '',
        `Reservado desde la web${staffId === 'any' ? ' (sin preferencia de profesional)' : ''}.`,
      ]
        .filter((l) => l !== null)
        .join('\n'),
      start: { dateTime: slot.start.toISOString(), timeZone: TZ },
      end: { dateTime: slot.end.toISOString(), timeZone: TZ },
      extendedProperties: { private: { source: 'web', service: service.id } },
    }
    await createEvent(person, event)

    return json({
      ok: true,
      demo: isDemo(),
      booking: {
        service: service.name,
        duration: service.duration,
        staff: person.name,
        assigned: staffId === 'any',
        date,
        time,
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        name,
      },
    })
  } catch (err) {
    console.error('[book]', err)
    return json({ error: 'calendar_error' }, 502)
  }
}

export const config = { path: '/api/book' }
