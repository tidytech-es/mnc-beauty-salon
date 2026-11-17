/**
 * GET /api/availability?service=corte&staff=any&date=2026-11-18
 * → { date, closed, slots: [{ time: '09:30', staff: ['monica', …] }], demo }
 */
import { getService, isBookableDate, openingFor, computeSlots } from '../../src/lib/booking-core.js'
import { busyFor, teamFor, dayBounds, isConfigured, isDemo } from '../lib/calendar.js'
import { json, notConfigured } from '../lib/http.js'

export default async (req) => {
  if (!isConfigured()) return notConfigured()

  const url = new URL(req.url)
  const service = getService(url.searchParams.get('service'))
  const staffId = url.searchParams.get('staff') || 'any'
  const date = url.searchParams.get('date')

  if (!service) return json({ error: 'bad_service' }, 400)
  if (!isBookableDate(date)) return json({ error: 'bad_date' }, 400)

  const team = teamFor(service.id, staffId)
  if (!team.length) return json({ error: 'bad_staff' }, 400)

  if (!openingFor(date)) return json({ date, closed: true, slots: [], demo: isDemo() })

  try {
    const [dayStart, dayEnd] = dayBounds(date)
    const busyByStaff = await busyFor(team, dayStart, dayEnd)
    const slots = computeSlots({
      ymd: date,
      duration: service.duration,
      staffIds: team.map((p) => p.id),
      busyByStaff,
    })
    return json({
      date,
      closed: false,
      slots: slots.map((s) => ({ time: s.time, staff: s.free })),
      demo: isDemo(),
    })
  } catch (err) {
    console.error('[availability]', err)
    return json({ error: 'calendar_error' }, 502)
  }
}

export const config = { path: '/api/availability' }
