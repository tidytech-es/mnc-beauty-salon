/**
 * ScrollExpandMedia: adaptado de 21st.dev ("scroll-expansion-hero") a este proyecto.
 *
 * Cambios respecto al original:
 *  - Vite + React (JS): `next/image` → <img>, sin "use client" ni tipos TS.
 *  - Estado de los listeners en refs: se registran una sola vez y no hay carreras
 *    (el original re-registraba todo en cada pixel de scroll).
 *  - Accesibilidad: el teclado (↓, AvPág, espacio, Fin) también expande; antes
 *    quedaba bloqueado en la parte superior. Con "reducir movimiento" empieza expandido.
 *  - Los enlaces internos (#servicios, #contacto…) y las URLs con #hash expanden al
 *    instante para que la navegación siga funcionando.
 *  - Título como <h1> semántico, colores de la marca en vez de azul.
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const EXPAND_KEYS = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar'])
const clamp = (n) => Math.min(Math.max(n, 0), 1)

const shouldStartExpanded = () => {
  if (typeof window === 'undefined') return false
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const deepLink = window.location.hash && window.location.hash !== '#inicio'
  return Boolean(reduced || deepLink)
}

export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  mediaAlt,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  id,
  children,
}) {
  const [progress, setProgress] = useState(() => (shouldStartExpanded() ? 1 : 0))
  const [isMobile, setIsMobile] = useState(false)

  const progressRef = useRef(progress)
  const expandedRef = useRef(progress >= 1)
  const touchYRef = useRef(0)

  // ── Listeners (una sola vez) ──────────────────────────────────────────
  useEffect(() => {
    if ('scrollRestoration' in history && !expandedRef.current) history.scrollRestoration = 'manual'

    const setP = (p) => {
      const next = clamp(p)
      progressRef.current = next
      setProgress(next)
      if (next >= 1) expandedRef.current = true
    }
    const expandNow = () => setP(1)
    const atTop = () => window.scrollY <= 5
    // Con un diálogo abierto (p. ej. la reserva) no interceptamos nada
    const modalOpen = () => Boolean(document.querySelector('dialog[open]'))

    const onWheel = (e) => {
      if (modalOpen()) return
      if (expandedRef.current) {
        if (e.deltaY < 0 && atTop()) {
          expandedRef.current = false
          e.preventDefault()
          setP(progressRef.current - 0.05)
        }
        return
      }
      e.preventDefault()
      setP(progressRef.current + e.deltaY * 0.0009)
    }

    const onTouchStart = (e) => { touchYRef.current = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (modalOpen()) return
      if (!touchYRef.current) return
      const y = e.touches[0].clientY
      const delta = touchYRef.current - y
      if (expandedRef.current) {
        if (delta < -20 && atTop()) {
          expandedRef.current = false
          e.preventDefault()
        }
        return
      }
      e.preventDefault()
      setP(progressRef.current + delta * (delta < 0 ? 0.008 : 0.005))
      touchYRef.current = y
    }
    const onTouchEnd = () => { touchYRef.current = 0 }

    const onScroll = () => {
      if (!expandedRef.current) window.scrollTo(0, 0)
    }

    const onKeyDown = (e) => {
      if (expandedRef.current || modalOpen()) return
      const t = e.target
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (e.key === 'End') return expandNow()
      if (EXPAND_KEYS.has(e.key)) {
        e.preventDefault()
        setP(progressRef.current + 0.34)
      }
    }

    // Enlaces internos: expandir antes de que el navegador haga el scroll al ancla
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a || a.getAttribute('href') === '#inicio' || expandedRef.current) return
      expandNow()
    }
    const onHash = () => { if (location.hash && location.hash !== '#inicio') expandNow() }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('hashchange', onHash)
    document.addEventListener('click', onClick, true)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('hashchange', onHash)
      document.removeEventListener('click', onClick, true)
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Medidas derivadas ────────────────────────────────────────────────
  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250)
  const mediaHeight = 400 + progress * (isMobile ? 200 : 400)
  const textX = progress * (isMobile ? 180 : 150)
  const showContent = progress >= 0.95

  const words = title ? title.split(' ') : []
  const firstWord = words[0] ?? ''
  const restOfTitle = words.slice(1).join(' ')

  return (
    <div id={id} className="overflow-x-clip bg-espresso">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          {/* Fondo: se desvanece a medida que la foto crece */}
          <motion.div
            className="absolute inset-0 z-0 h-[100dvh] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - progress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt=""
              className="size-full scale-105 object-cover blur-[3px]"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-espresso/55" />
          </motion.div>

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              {/* Foto / vídeo que se expande */}
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85dvh',
                  boxShadow: '0 30px 80px -30px rgba(0,0,0,.65)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className="pointer-events-none relative size-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes('embed')
                            ? `${mediaSrc}${mediaSrc.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&rel=0&disablekb=1&modestbranding=1`
                            : `${mediaSrc.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&rel=0&disablekb=1&modestbranding=1&playlist=${mediaSrc.split('v=')[1]}`
                        }
                        title={mediaAlt || title || 'Vídeo'}
                        className="size-full rounded-2xl"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-espresso/40"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - progress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="pointer-events-none relative size-full">
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="size-full rounded-2xl object-cover"
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-espresso/40"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - progress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative size-full">
                    <img
                      src={mediaSrc}
                      alt={mediaAlt || title || ''}
                      className="size-full rounded-2xl object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-espresso/60"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - progress * 0.35 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="relative z-10 mt-4 flex flex-col items-center text-center" aria-hidden={progress >= 1}>
                  {date && (
                    <p className="text-lg text-cream sm:text-xl" style={{ transform: `translateX(-${textX}vw)` }}>
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-gold-light"
                      style={{ transform: `translateX(${textX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Título: se separa en dos al expandir */}
              <h1
                className={`relative z-10 flex w-full flex-col items-center justify-center gap-1 text-center font-serif text-cream ${
                  textBlend ? 'mix-blend-difference' : ''
                }`}
              >
                <span
                  className="block text-6xl leading-none md:text-7xl lg:text-8xl"
                  style={{ transform: `translateX(-${textX}vw)` }}
                >
                  {firstWord}
                </span>{' '}
                <span
                  className="block text-6xl italic leading-none text-gold-light md:text-7xl lg:text-8xl"
                  style={{ transform: `translateX(${textX}vw)` }}
                >
                  {restOfTitle}
                </span>
              </h1>
            </div>

            <motion.div
              className="w-full"
              initial={false}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 16 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ visibility: showContent ? 'visible' : 'hidden' }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
