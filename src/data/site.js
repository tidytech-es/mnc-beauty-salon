// ─────────────────────────────────────────────────────────────
//  Datos del negocio. Edita aquí teléfono, horario, textos y fotos.
// ─────────────────────────────────────────────────────────────

// Teléfono / WhatsApp (formato internacional sin +)
export const PHONE_E164 = '34660539016'
export const PHONE_DISPLAY = '660 53 90 16'

/** Enlace de WhatsApp con un mensaje ya escrito. Cada botón manda el suyo. */
export const wa = (text = '¡Hola! Me gustaría reservar una cita en MNC Beauty Salon.') =>
  `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(text)}`

export const site = {
  name: 'MNC Beauty Salon',
  altName: 'MNC Perruquers',
  address: {
    street: 'Ctra. Vella, 121',
    city: '08470 Sant Celoni, Barcelona',
  },
  rating: { score: '4,7', count: 'casi 250', countShort: '250' },
  years: 30,
  links: {
    phone: `tel:+${PHONE_E164}`,
    maps: 'https://www.google.com/maps/search/?api=1&query=MNC+Perruquers+Ctra.+Vella+121+Sant+Celoni',
    mapsEmbed: 'https://www.google.com/maps?q=MFRV%2B6W%20Sant%20Celoni&z=16&output=embed',
    instagram: 'https://www.instagram.com/mnc.beautysalon/',
    // ⚠️ PENDIENTE: añade la URL de Facebook; vacío = el icono no se muestra
    facebook: '',
  },
  // Formato "HH:MM – HH:MM" o "Cerrado" (se usa también para "Abierto ahora")
  hours: [
    { day: 'Lunes', time: 'Cerrado' },
    { day: 'Martes', time: '09:30 – 19:00' },
    { day: 'Miércoles', time: '09:30 – 19:00' },
    { day: 'Jueves', time: '09:30 – 19:00' },
    { day: 'Viernes', time: '09:00 – 19:00' },
    { day: 'Sábado', time: '08:00 – 15:00' },
    { day: 'Domingo', time: 'Cerrado' },
  ],
}

export const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#hair-spa', label: 'Hair Spa' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#resenas', label: 'Reseñas' },
  { href: '#contacto', label: 'Contacto' },
]

// Fotos reales del salón (public/images)
const img = (name) => `/images/${name}.webp`

export const images = {
  hero: img('salon-interior'),
  spa: img('renova-ritual'),
  team: img('fachada'),
  cut: img('color-cereza'),
  color: img('balayage'),
  straight: img('alisado'),
  curls: img('ondas'),
}

export const gallery = [
  { src: img('renova-hair-spa'), alt: 'Pared de Renova Hair Spa con la línea de productos de tratamiento' },
  { src: img('lavacabezas-flores'), alt: 'Zona de lavacabezas del salón' },
  { src: img('barber-chair'), alt: 'Sillón clásico de MNC Barbershop junto al escaparate' },
  { src: img('sala-espera'), alt: 'Zona de espera junto al escaparate' },
]

export const services = [
  {
    key: 'cut',
    title: 'Cortes y Estilismo',
    text: 'Cortes pensados para tu rostro y tu día a día. Recogidos y maquillaje para bodas y eventos.',
    imgAlt: 'Melena larga en tono cereza con ondas suaves',
  },
  {
    key: 'color',
    title: 'Coloración y Balayage',
    text: 'Color con luz y profundidad: balayage, mechas y matices que cuidan la fibra capilar.',
    imgAlt: 'Melena con balayage rubio y ondas',
  },
  {
    key: 'straight',
    title: 'Alisados de Keratina',
    text: 'Cabello liso, brillante y sin encrespamiento durante meses, respetando tu pelo.',
    imgAlt: 'Melena castaña larga y lisa tras un alisado',
  },
  {
    key: 'curls',
    title: 'Moldeados y Permanentes',
    text: 'Volumen, onda y movimiento natural, con técnicas actuales para rizos duraderos.',
    imgAlt: 'Melena castaña con ondas marcadas y puntas iluminadas',
  },
]

// Datos del Hair Spa extraídos de reseñas reales de Google (Nara, Mariona, Arlet).
// ⚠️ PENDIENTE: confirma duración y añade precio cuando lo tengas.
export const spa = {
  rituals: [
    { name: 'Renova Cotton', text: 'Un spa capilar completo, pensado como regalo: unas 2 horas de relax, cuidado y mimo.' },
    { name: 'Ritual Seda', text: 'Un momento único y renovador para el cabello, en camilla y con luz tenue.' },
  ],
  care: 'Te asesoramos, te relajamos y cuidamos tu cabello y tu piel.',
  duration: 'Hasta 2 h de ritual',
  price: null, // por ejemplo: 'desde 45 €'
  quote: { text: '10/10. Superrecomanable!', author: 'Arlet D.', lang: 'ca' },
}

// Reseñas reales de Google (texto literal, en su idioma original).
export const reviews = [
  {
    text: 'Encantada y muy agradecida con Mónica y su equipo. Todo ha quedado genial, mejor de lo que esperaba.',
    author: 'Míriam M.',
    lang: 'es',
  },
  {
    text: "Vaig anar a fer-me l'SPA capil·lar Renova Cotton i va ser espectacular, trobo que és un regal perfecte per a qui busca 2h de relax, cura i amor.",
    author: 'Nara P.',
    lang: 'ca',
    tag: 'Hair Spa',
  },
  {
    text: 'Fa més de 12 anys que en sóc clienta, i sempre marxo contenta. La Mònica i el seu equip són molt professionals i tracten amb amabilitat i cordialitat.',
    author: 'Conxita B.',
    lang: 'ca',
  },
  {
    text: 'Cuando a tu peluquería de hace más de 15 años le añaden un plus de servicio… sabes que será tu rincón de relax.',
    author: 'Laura T.',
    lang: 'es',
    tag: 'Hair Spa',
  },
  {
    text: 'Increïble com la seva propietària aconsegueix conjugar una pelu actual, de tendència, amb clientela de tota la vida. Pelu, barberia, estètica.',
    author: 'Laura G.',
    lang: 'ca',
  },
  {
    text: 'Tracte professional, equip atent i respectuós… et sents com a casa. I la Mònica és un 10.',
    author: 'Montserrat I.',
    lang: 'ca',
  },
]
