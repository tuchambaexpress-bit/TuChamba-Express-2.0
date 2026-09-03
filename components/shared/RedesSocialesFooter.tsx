'use client'

import { useEffect, useState } from 'react'
import { getCodigoReferido } from '@/hooks/useReferido'
import { iconoPlataforma, nombrePlataforma, RedSocial } from '@/lib/redes-sociales'

type Estado = 'sin-token' | 'cargando' | 'listo'

// Reemplaza el link fijo de Facebook que vivía duplicado en HomePortada.tsx
// y VacantesPortal.tsx (HU-26, 7.52). Corregido 2026-09-04: si no hay
// token guardado, muestra Facebook de inmediato sin esperar ningún fetch
// — evita el parpadeo Facebook→red-del-reclutador que José reportó.
export default function RedesSocialesFooter() {
  const [estado, setEstado] = useState<Estado>('cargando')
  const [redes, setRedes] = useState<RedSocial[]>([])

  useEffect(() => {
    const token = getCodigoReferido()
    if (!token) {
      setEstado('sin-token')
      return
    }
    fetch(`/api/reclutador/perfil?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        setRedes(data?.redes_sociales?.length ? data.redes_sociales : [])
        setEstado('listo')
      })
      .catch(() => setEstado('listo'))
  }, [])

  // Solo hay espera real cuando SÍ hay token que resolver — brevísima,
  // no se muestra nada todavía para no comprometerse con el dato erróneo.
  if (estado === 'cargando') return null

  if (estado === 'sin-token' || redes.length === 0) {
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