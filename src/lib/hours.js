import { site } from '../data/site.js'

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Lunes = 0 … Domingo = 6 */
export const dayIndex = (date = new Date()) => (date.getDay() + 6) % 7

const parse = (time) => {
  const m = time.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/)
  return m ? { open: m[1], close: m[2] } : null
}

/**
 * Estado actual del salón según site.hours.
 * { open: boolean, label: string }
 */
export function openStatus(date = new Date()) {
  const today = dayIndex(date)
  const now = date.getHours() * 60 + date.getMinutes()
  const slot = parse(site.hours[today].time)

  if (slot && now >= toMin(slot.open) && now < toMin(slot.close)) {
    return { open: true, label: `Abierto ahora · hasta las ${slot.close}` }
  }
  // Próxima apertura (hoy más tarde o en los próximos días)
  for (let i = 0; i < 7; i++) {
    const idx = (today + i) % 7
    const s = parse(site.hours[idx].time)
    if (!s) continue
    if (i === 0 && now >= toMin(s.open)) continue
    const when = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${site.hours[idx].day.toLowerCase()}`
    return { open: false, label: `Cerrado · abrimos ${when} a las ${s.open}` }
  }
  return { open: false, label: 'Cerrado' }
}
