/** Abre el diálogo de reserva desde cualquier botón de la web. */
export const BOOKING_EVENT = 'mnc:open-booking'

/**
 * Reserva online activa: siempre en local (`npm run dev`) y, en la web publicada,
 * solo cuando en Netlify existe la variable VITE_BOOKING_ENABLED=true.
 * Mientras no lo esté, los botones de reserva abren WhatsApp como antes.
 */
export const bookingEnabled =
  import.meta.env.DEV || import.meta.env.VITE_BOOKING_ENABLED === 'true'

/** detail: { group?: 'pelu' | 'spa' | 'barber', service?: id } */
export const openBooking = (detail = {}) =>
  window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail }))
