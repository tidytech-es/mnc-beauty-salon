# Reservas online · Puesta en marcha

Las citas reservadas en la web se guardan en **Google Calendar**, un calendario por profesional.
Todo es gratuito: Google Calendar API + funciones de Netlify.

```
Web (botón "Reserva tu cita")
  → /api/availability   consulta los huecos libres en los calendarios
  → /api/book           comprueba otra vez el hueco y crea el evento
        ↓
Google Calendar (Mónica, Meritxell, Meri, Sergi…)
```

- **Bloquear horas** (vacaciones, médico, descanso): crear un evento en el calendario de esa persona. El hueco deja de ofrecerse.
- **Cancelar o mover una cita**: borrar o mover el evento en Google Calendar.
- **"Sin preferencia"**: la cita se asigna a quien tenga menos minutos ocupados ese día.
- Las clientas que quieran cambiar la cita escriben por WhatsApp (el botón está en la confirmación).

---

## 1. Crear la cuenta de servicio de Google (una sola vez, ~10 min)

Es un "usuario robot" que la web usa para leer y escribir en los calendarios.

1. Entra en **console.cloud.google.com** con la cuenta de Google del salón.
2. Arriba, **Seleccionar proyecto → Proyecto nuevo** → nombre `mnc-reservas` → Crear.
3. Menú **APIs y servicios → Biblioteca** → busca **Google Calendar API** → **Habilitar**.
4. Menú **IAM y administración → Cuentas de servicio → Crear cuenta de servicio**
   - Nombre: `reservas-web` → Crear y continuar → (sin roles) → Listo.
5. Entra en la cuenta creada → pestaña **Claves → Agregar clave → Crear clave nueva → JSON**.
   Se descarga un archivo `.json`. **Guárdalo en un sitio seguro y no lo subas a GitHub.**
6. Apunta el email de la cuenta, del tipo `reservas-web@mnc-reservas.iam.gserviceaccount.com`.

## 2. Un calendario por profesional

Para cada persona (desde **calendar.google.com** con la cuenta del salón):

1. A la izquierda, **Otros calendarios → + → Crear calendario** → nombre, por ejemplo `MNC · Mónica`.
2. En la configuración de ese calendario → **Compartir con determinadas personas → Añadir personas**:
   pega el email de la cuenta de servicio y elige **"Hacer cambios en eventos"**.
3. Más abajo, en **Integrar el calendario**, copia el **ID del calendario**
   (algo como `abc123…@group.calendar.google.com`).
4. Comparte también el calendario con el móvil de esa persona si quiere ver sus citas.

## 3. Configurar la web

En `src/data/booking.js`:

- En `staff`, pega cada `calendarId` y revisa quién hace qué servicio (`services`).
- En `bookingServices`, ajusta nombres y duraciones reales (en minutos).
- Opcional: `MIN_LEAD_MINUTES` (antelación mínima, ahora 2 h) y `MAX_DAYS_AHEAD` (ahora 45 días).

El horario del salón se toma de `site.hours` en `src/data/site.js`.

## 4. Variables en Netlify

**Netlify → tu sitio → Site configuration → Environment variables → Add a variable**:

| Variable | Valor |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | el email de la cuenta de servicio |
| `GOOGLE_PRIVATE_KEY` | el valor de `"private_key"` del JSON, tal cual (empieza por `-----BEGIN PRIVATE KEY-----`) |
| `VITE_BOOKING_ENABLED` | `true` (activa los botones de reserva online; sin esto abren WhatsApp) |

Después, **Deploys → Trigger deploy → Deploy site** para que se apliquen.

## 5. Probar

1. Abre la web publicada → **Reserva tu cita** → reserva una cita de prueba.
2. Comprueba que aparece en el calendario de esa persona.
3. Bórrala del calendario.

Si algo falla, en Netlify → **Logs → Functions** aparece el error
(por ejemplo, "No se puede leer el calendario de …" = falta compartirlo con la cuenta de servicio).

## Probar en local

```bash
npm run dev
```

Sin credenciales funciona en **modo demo** (huecos ocupados de ejemplo, nada se guarda).
Para usar los calendarios reales en local, crea un archivo `.env` (ya está en `.gitignore`)
con las dos variables `GOOGLE_…` (ver `.env.example`).

## Límites a tener en cuenta

- Si dos personas reservan el mismo hueco en el mismo segundo, puede colarse una doble cita
  (la web comprueba el hueco justo antes de guardar, así que es muy improbable en un salón).
- Cancelar o cambiar la cita lo hace el salón en Google Calendar; la clienta no tiene un enlace para hacerlo sola.
- No se envían emails ni recordatorios automáticos a las clientas.
