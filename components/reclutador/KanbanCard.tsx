'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  postulacion: any
  etapasDisponibles: string[]
  onActualizarEtapa: (postulacionId: string, nuevaEtapa: string) => void
  reclutadorId: string
}

export default function KanbanCard({ postulacion, etapasDisponibles, onActualizarEtapa, reclutadorId }: Props) {
  const [moviendo, setMoviendo] = useState(false)
  const [mostrarMenu, setMostrarMenu] = useState(false)

  const diasEnEtapa = Math.floor(
    (Date.now() - new Date(postulacion.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  async function cambiarEtapa(nuevaEtapa: string) {
    setMostrarMenu(false)
    setMoviendo(true)
    const supabase = createClient()

    await supabase
      .from('postulaciones')
      .update({ etapa_actual: nuevaEtapa, updated_at: new Date().toISOString() })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: nuevaEtapa,
      cambiado_por: reclutadorId
    })

    onActualizarEtapa(postulacion.id, nuevaEtapa)
    setMoviendo(false)
  }

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 ${moviendo ? 'opacity-50' : ''}`}>
      <p className="font-semibold text-gray-900 text-sm">
        {postulacion.candidatos?.nombre}
      </p>
      <p className="text-xs text-[#1A6B3C] mt-0.5">
        {postulacion.vacantes?.titulo}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {diasEnEtapa === 0 ? 'Hoy' : `Hace ${diasEnEtapa} día${diasEnEtapa !== 1 ? 's' : ''}`}
      </p>
      <div className="flex gap-2 mt-3">
        <a
          href={`/reclutador/chats?chat=${postulacion.chats?.[0]?.id}`}
          className="flex-1 text-center text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-1.5 rounded-lg border border-gray-200 transition-colors"
        >
          💬 Chat
        </a>
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="text-xs bg-[#1A6B3C] hover:bg-[#155c33] text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Mover ▾
          </button>
          {mostrarMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[140px]">
              {etapasDisponibles
                .filter(e => e !== postulacion.etapa_actual)
                .map(etapa => (
                  <button
                    key={etapa}
                    onClick={() => cambiarEtapa(etapa)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                      etapa === 'Descartado' ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    {etapa}
                  </button>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}