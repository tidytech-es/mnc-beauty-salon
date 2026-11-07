# MNC Beauty Salon · Landing page

React 18 + Vite + Tailwind CSS 4 + Lucide. Publicada en Netlify (se despliega sola con cada cambio en la rama `main`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```

## Editar contenido

Casi todo está en `src/data/site.js`:

- `PHONE_E164` / `PHONE_DISPLAY`: teléfono y WhatsApp.
- `hours`: horario (formato `HH:MM – HH:MM` o `Cerrado`); también alimenta el aviso "Abierto ahora".
- `links`: Instagram, Facebook (vacío = oculto) y Google Maps.
- `services`, `spa`, `reviews`, `gallery`: textos y fotos.
- Fotos en `public/images/`.

### Pendiente
- Precio del Hair Spa (`spa.price`) y confirmar duración (`spa.duration`).
- URL de Facebook.
- Aviso legal, privacidad y cookies (el mapa de Google Maps usa cookies).

## Estructura

```
src/
  data/site.js          datos del negocio
  lib/hours.js          cálculo de "Abierto ahora"
  hooks/                useReveal (fade-in), useNow (hora actual)
  components/           Header, Hero, Services, HairSpa, Team, Reviews,
                        Gallery, Contact, Footer, MobileBookingBar, ui
netlify.toml            configuración de build para Netlify
```
