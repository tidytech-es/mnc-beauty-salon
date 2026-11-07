import { useEffect, useState } from 'react'

/** Fecha actual que se refresca cada minuto (horario y estado "abierto ahora"). */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
