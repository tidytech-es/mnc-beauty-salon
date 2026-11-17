import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * En `npm run dev`, sirve las funciones de netlify/functions en /api/* sin
 * necesitar la CLI de Netlify. Sin credenciales de Google activa el modo demo.
 */
function netlifyFunctionsDev() {
  const routes = {
    '/api/availability': '/netlify/functions/availability.js',
    '/api/book': '/netlify/functions/book.js',
  }
  return {
    name: 'netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) process.env[k] ??= v
      if (!process.env.GOOGLE_PRIVATE_KEY) process.env.BOOKING_DEMO ??= '1'

      server.middlewares.use(async (req, res, next) => {
        const path = req.url.split('?')[0]
        const file = routes[path]
        if (!file) return next()
        try {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
          })
          const mod = await server.ssrLoadModule(file)
          const response = await mod.default(request)
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end('Function error')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), netlifyFunctionsDev()],
  resolve: {
    // "@/..." apunta a src/ (misma convención que los proyectos shadcn)
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
