import { useEffect, useRef, useState } from 'react'

/** Devuelve [ref, visible]: se activa una vez cuando el elemento entra en pantalla. */
export function useReveal(options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect() }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, visible]
}
