'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const LIMITE_INACTIVIDAD_MS = 20 * 60 * 1000 // 20 minutos
const DURACION_AVISO_MS = 4000 // 4 segundos, sin opción de cancelar (decisión de José)

export default function InactivityGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mostrarAviso, setMostrarAviso] = useState(false)
  const timerInactividad = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerAviso = useRef<ReturnType<typeof setTimeout> | null>(null)
  const avisoActivo = useRef(false)

  // No aplica en /admin/login: ahí todavía no hay sesión que cerrar.
  const activo = pathname !== '/admin/login'

  useEffect(() => {
    if (!activo) {
      setMostrarAviso(false)
      avisoActivo.current = false
      return
    }

    async function cerrarSesion() {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    }

    function dispararAviso() {
      avisoActivo.current = true
      setMostrarAviso(true)
      timerAviso.current = setTimeout(cerrarSesion, DURACION_AVISO_MS)
    }

    function reiniciarTimer() {
      // Una vez que el aviso ya apareció, la actividad ya no lo cancela —
      // es informativo, no interactivo (decisión explícita, 2026-08-21).
      if (avisoActivo.current) return
      if (timerInactividad.current) clearTimeout(timerInactividad.current)
      timerInactividad.current = setTimeout(dispararAviso, LIMITE_INACTIVIDAD_MS)
    }

    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    eventos.forEach(e => window.addEventListener(e, reiniciarTimer))
    reiniciarTimer()

    return () => {
      eventos.forEach(e => window.removeEventListener(e, reiniciarTimer))
      if (timerInactividad.current) clearTimeout(timerInactividad.current)
      if (timerAviso.current) clearTimeout(timerAviso.current)
    }
  }, [activo, router])

  return (
    <>
      {children}
      {mostrarAviso && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-[#12151C] border border-[#00D9FF] px-5 py-4"
          style={{
            clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)',
            boxShadow: '0 0 24px rgba(0,217,255,0.25)',
          }}
        >
          <p className="text-[#E8EDF4] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ⚠ Cierre de sesión por inactividad
          </p>
        </div>
      )}
    </>
  )
}
