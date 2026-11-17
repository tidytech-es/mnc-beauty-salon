/**
 * Lógica de reservas sin dependencias: fechas en hora de Madrid, horario del
 * salón y cálculo de huecos libres. La comparten la web y el servidor.
 */
import { site } from '../data/site.js'
import { bookingServices, staff, SLOT_STEP, MIN_LEAD_MINUTES, MAX_DAYS_AHEAD } from '../data/booking.js'

export const TZ = 'Europe/Madrid'

const dtf = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function madridParts(date) {
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]))
  return { y: +p.year, m: +p.month, d: +p.day, hh: +p.hour, mm: +p.minute, ss: +p.second }
}

/** Diferencia (min) entre la hora de Madrid y UTC en ese instante (60 o 120). */
function offsetMinutes(date) {
  const p = madridParts(date)
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm, p.ss)
  return Math.round((asUtc - date.getTime()) / 60000)
}

const pad = (n) => String(n).padStart(2, '0')

/** "2026-11-18" + 570 min (09:30 en Madrid) → instante UTC correcto (con cambio de hora). */
export function madridToUtc(ymd, minutes) {
  const [y, m, d] = ymd.split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d, 0, minutes)
  const off = offsetMinutes(new Date(guess))
  let t = guess - off * 60000
  const off2 = offsetMinutes(new Date(t))
  if (off2 !== off) t = guess - off2 * 60000
  return new Date(t)
}

export function todayYmd(now = new Date()) {
  const p = madridParts(now)
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`
}

export function addDaysYmd(ymd, n) {
  const [y, m, d] = ymd.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`
}

/** Lunes = 0 … Domingo = 6 */
export function weekdayIndex(ymd) {
  const [y, m, d] = ymd.split('-').map(Number)
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7
}

export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export const fmtMin = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`

/** Horario de apertura de ese día según site.hours, o null si cierra. */
export function openingFor(ymd) {
  const time = site.hours[weekdayIndex(ymd)]?.time ?? ''
  const m = time.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/)
  return m ? { open: toMin(m[1]), close: toMin(m[2]) } : null
}

export const isYmd = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)

/** ¿La fecha está dentro del rango reservable (hoy … +MAX_DAYS_AHEAD)? */
export function isBookableDate(ymd, now = new Date()) {
  if (!isYmd(ymd)) return false
  const today = todayYmd(now)
  return ymd >= today && ymd <= addDaysYmd(today, MAX_DAYS_AHEAD)
}

export const getService = (id) => bookingServices.find((s) => s.id === id)

/**
 * Profesionales que pueden hacer un servicio.
 * staffId = 'any' → todos los que lo hacen; si no, solo esa persona.
 * requireCalendar: en producción solo cuenta quien tiene calendario configurado.
 */
export function staffFor(serviceId, staffId = 'any', { requireCalendar = false } = {}) {
  return staff.filter(
    (p) =>
      p.services.includes(serviceId) &&
      (staffId === 'any' || p.id === staffId) &&
      (!requireCalendar || Boolean(p.calendarId)),
  )
}

/**
 * Huecos libres de un día.
 * busyByStaff: { [staffId]: [{ start: Date, end: Date }] }
 * Devuelve [{ time: 'HH:MM', start: Date, end: Date, free: [staffId] }]
 */
export function computeSlots({ ymd, duration, staffIds, busyByStaff, now = new Date() }) {
  const opening = openingFor(ymd)
  if (!opening) return []
  const earliest = now.getTime() + MIN_LEAD_MINUTES * 60000
  const slots = []
  for (let t = opening.open; t + duration <= opening.close; t += SLOT_STEP) {
    const start = madridToUtc(ymd, t)
    const end = new Date(start.getTime() + duration * 60000)
    if (start.getTime() < earliest) continue
    const free = staffIds.filter(
      (id) => !(busyByStaff[id] || []).some((b) => b.start < end && b.end > start),
    )
    if (free.length) slots.push({ time: fmtMin(t), start, end, free })
  }
  return slots
}

/** Minutos ocupados de una persona dentro del día (para elegir al menos saturado). */
export function busyMinutes(busy = [], dayStart, dayEnd) {
  return busy.reduce((sum, b) => {
    const s = Math.max(b.start.getTime(), dayStart.getTime())
    const e = Math.min(b.end.getTime(), dayEnd.getTime())
    return sum + Math.max(0, e - s) / 60000
  }, 0)
}
