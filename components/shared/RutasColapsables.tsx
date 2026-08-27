'use client'

import { useState } from 'react'

interface Ruta {
  nombre: string
  paradas: string[]
}

interface Props {
  rutas: Ruta[]
  // Cuántas rutas mostrar antes de colapsar. Default 4.
  limiteInicial?: number
}

// Compartido entre VacanteDetalle.tsx (candidato) y la ficha operativa del
// reclutador (app/reclutador/detalle/[id]/page.tsx) — mismo problema en
// ambos lados: empresas con muchas rutas (ej. TOPBAND, 20 rutas) inundaban
// la tarjeta completa. José prefirió colapsado por defecto (2026-08-27).
export default function RutasColapsables({ rutas, limiteInicial = 2 }: Props) {
  const [expandido, setExpandido] = useState(false)

  if (!rutas || rutas.length === 0) return null

  const rutasAMostrar = expandido ? rutas : rutas.slice(0, limiteInicial)
  const faltan = rutas.length - limiteInicial

  return (
    <div className="mt-0.5 space-y-1">
      {rutasAMostrar.map((ruta, i) => (
        <p key={i} className="text-xs text-green-600">
          <span className="font-medium">{ruta.nombre}</span>
          {ruta.paradas?.length > 0 ? `: ${ruta.paradas.join(', ')}` : ''}
        </p>
      ))}
      {!expandido && faltan > 0 && (
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="text-xs text-green-700 underline hover:text-green-800"
        >
          Ver las {rutas.length} rutas
        </button>
      )}
      {expandido && rutas.length > limiteInicial && (
        <button
          type="button"
          onClick={() => setExpandido(false)}
          className="text-xs text-green-700 underline hover:text-green-800"
        >
          Ver menos
        </button>
      )}
    </div>
  )
}
