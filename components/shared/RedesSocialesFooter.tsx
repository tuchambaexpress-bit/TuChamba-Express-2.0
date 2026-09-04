'use client'

import { useEffect, useState } from 'react'
import { getCodigoReferido } from '@/hooks/useReferido'
import { iconoPlataforma, nombrePlataforma, RedSocial } from '@/lib/redes-sociales'

// Reemplaza el link fijo de Facebook que vivía duplicado en HomePortada.tsx
// y VacantesPortal.tsx (HU-26, 7.52). Corregido 2026-09-05: vuelve a mostrar
// Facebook de inmediato por default (sin esperar nada) — la versión de ayer
// ("no mostrar nada mientras se resuelve") eliminaba el parpadeo para
// visitantes con ref, pero a cambio dejaba a TODOS los visitantes (con o sin
// ref) viendo un hueco vacío una fracción de segundo en cada carga. Trade-off
// aceptado con José: mejor un parpadeo chico solo para quien llega por un
// link de referido, que un hueco vacío para el 100% de las visitas.
export default function RedesSocialesFooter() {
  const [redes, setRedes] = useState<RedSocial[]>([])

  useEffect(() => {
    const token = getCodigoReferido()
    if (!token) return // sin token, Facebook se queda como está — nada que resolver
    fetch(`/api/reclutador/perfil?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => setRedes(data?.redes_sociales?.length ? data.redes_sociales : []))
      .catch(() => {})
  }, [])

  if (redes.length === 0) {
    return (
      <a
        href="https://www.facebook.com/tuchambaexpressoficial"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-[#1A6B3C] text-sm flex items-center gap-1.5"
      >
        <img src={iconoPlataforma('facebook')} alt="" className="h-[22px] w-[26px] object-contain" />
        Facebook
      </a>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {redes.map((r, i) => (
        <a
          key={i}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-[#1A6B3C] text-sm flex items-center gap-1.5"
        >
          <img src={iconoPlataforma(r.plataforma)} alt="" className="h-[22px] w-[26px] object-contain" />
          {nombrePlataforma(r.plataforma)}
        </a>
      ))}
    </div>
  )
}