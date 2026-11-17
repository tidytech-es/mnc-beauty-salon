// ─────────────────────────────────────────────────────────────
//  Configuración de reservas online.
//  La usan tanto la web como las funciones del servidor (netlify/functions).
// ─────────────────────────────────────────────────────────────

/** Cada cuántos minutos empieza un hueco (09:30, 09:45, 10:00…) */
export const SLOT_STEP = 15
/** Antelación mínima para reservar (minutos). */
export const MIN_LEAD_MINUTES = 120
/** Hasta cuántos días vista se puede reservar. */
export const MAX_DAYS_AHEAD = 45

// ⚠️ PENDIENTE: confirmar con Mónica nombres, duraciones reales y precios.
// `duration` en minutos: es lo que se bloquea en el calendario.
export const bookingServices = [
  { id: 'corte', group: 'pelu', name: 'Corte y peinado', duration: 45 },
  { id: 'color', group: 'pelu', name: 'Coloración', duration: 90 },
  { id: 'balayage', group: 'pelu', name: 'Balayage o mechas', duration: 180 },
  { id: 'alisado', group: 'pelu', name: 'Alisado de keratina', duration: 150 },
  { id: 'moldeado', group: 'pelu', name: 'Moldeado o permanente', duration: 120 },
  { id: 'recogido', group: 'pelu', name: 'Recogido o peinado de evento', duration: 60 },
  { id: 'spa-cotton', group: 'spa', name: 'Renova Cotton · Hair Spa', duration: 120 },
  { id: 'spa-seda', group: 'spa', name: 'Ritual Seda · Hair Spa', duration: 90 },
  { id: 'barberia', group: 'barber', name: 'Corte de caballero o barba', duration: 30 },
]

export const serviceGroups = {
  pelu: 'Peluquería',
  spa: 'Renova Hair Spa',
  barber: 'Barbería',
}

// ⚠️ PENDIENTE: equipo real, qué servicios hace cada persona y su calendario.
// `calendarId`: el ID del calendario de Google de esa persona (ver SETUP-RESERVAS.md).
// Una persona sin calendarId no aparece en la web en producción (sí en modo demo).
export const staff = [
  {
    id: 'monica',
    name: 'Mónica',
    role: 'Peluquería',
    calendarId: '',
    services: ['corte', 'color', 'balayage', 'alisado', 'moldeado', 'recogido'],
  },
  {
    id: 'meritxell',
    name: 'Meritxell',
    role: 'Peluquería',
    calendarId: '',
    services: ['corte', 'color', 'balayage', 'moldeado', 'recogido'],
  },
  {
    id: 'meri',
    name: 'Meri',
    role: 'Estética y Hair Spa',
    calendarId: '',
    services: ['spa-cotton', 'spa-seda'],
  },
  {
    id: 'sergi',
    name: 'Sergi',
    role: 'Barbería',
    calendarId: '',
    services: ['barberia', 'corte'],
  },
]
