/**
 * Acceso a Google Calendar con una cuenta de servicio (gratis).
 * Variables de entorno (Netlify → Site configuration → Environment variables):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY            (la "private_key" del JSON, con sus \n)
 * Sin credenciales y con BOOKING_DEMO=1 (solo en local) funciona en modo demo,
 * con huecos ocupados de ejemplo y reservas guardadas en memoria.
 */
import { JWT } from 'google-auth-library'
import { staffFor, madridToUtc, addDaysYmd, todayYmd, TZ } from '../../src/lib/booking-core.js'

const API = 'https://www.googleapis.com/calendar/v3'

const hasCreds = () => Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
export const isDemo = () => !hasCreds() && process.env.BOOKING_DEMO === '1'
export const isConfigured = () => hasCreds() || isDemo()

let client
function auth() {
  client ??= new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  return client
}

/** Equipo que puede hacer el servicio (en producción, solo quien tiene calendario). */
export const teamFor = (serviceId, staffId) =>
  staffFor(serviceId, staffId, { requireCalendar: !isDemo() })

const keyOf = (person) => (isDemo() ? `demo:${person.id}` : person.calendarId)

// ── Modo demo ──────────────────────────────────────────────────────────
const demoEvents = [] // { key, start: Date, end: Date }

function demoBusy(person, dayStart) {
  // Bloques ocupados deterministas según persona y día, para que la demo sea realista
  // dayStart es la medianoche de Madrid en UTC; +12 h cae siempre en ese mismo día
  const ymd = todayYmd(new Date(dayStart.getTime() + 12 * 3600000))
  const seed = [...(person.id + ymd)].reduce((a, c) => a + c.charCodeAt(0), 0)
  const blocks = []
  const starts = [600 + (seed % 4) * 30, 750 + (seed % 3) * 45, 960 + (seed % 2) * 30]
  starts.slice(0, 1 + (seed % 3)).forEach((min, i) => {
    const s = madridToUtc(ymd, min)
    blocks.push({ start: s, end: new Date(s.getTime() + (60 + i * 30) * 60000) })
  })
  return blocks
}

// ── API ────────────────────────────────────────────────────────────────

/** Ocupación de cada persona entre dos instantes: { [staffId]: [{start, end}] } */
export async function busyFor(team, timeMin, timeMax) {
  if (isDemo()) {
    return Object.fromEntries(
      team.map((p) => [
        p.id,
        [
          ...demoBusy(p, timeMin),
          ...demoEvents.filter((e) => e.key === keyOf(p) && e.start < timeMax && e.end > timeMin),
        ],
      ]),
    )
  }

  const res = await auth().request({
    url: `${API}/freeBusy`,
    method: 'POST',
    data: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TZ,
      items: team.map((p) => ({ id: p.calendarId })),
    },
  })
  const out = {}
  for (const p of team) {
    const cal = res.data.calendars?.[p.calendarId]
    if (!cal || cal.errors?.length) {
      throw new Error(`No se puede leer el calendario de ${p.name}: ${JSON.stringify(cal?.errors ?? 'sin datos')}`)
    }
    out[p.id] = (cal.busy || []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }))
  }
  return out
}

/** Crea la cita en el calendario de la persona. */
export async function createEvent(person, event) {
  if (isDemo()) {
    demoEvents.push({
      key: keyOf(person),
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    })
    return { id: `demo-${demoEvents.length}` }
  }
  const res = await auth().request({
    url: `${API}/calendars/${encodeURIComponent(person.calendarId)}/events`,
    method: 'POST',
    data: event,
  })
  return res.data
}

/** Inicio y fin (UTC) del día completo en Madrid. */
export const dayBounds = (ymd) => [madridToUtc(ymd, 0), madridToUtc(addDaysYmd(ymd, 1), 0)]
