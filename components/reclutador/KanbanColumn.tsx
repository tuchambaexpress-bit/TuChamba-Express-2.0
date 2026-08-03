'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import KanbanCard from './KanbanCard'

interface Props {
  etapa: string
  postulaciones: any[]
  todasPostulaciones: any[]
  onActualizarEtapa: (postulacionId: string, nuevaEtapa: string) => void
  reclutadorId: string
  candidatosConHistorial?: Set<string>
}

const COLORES_ETAPA: Record<string, string> = {
  'Aplicado': 'bg-gray-100 text-gray-700',
  'Contactado': 'bg-blue-100 text-blue-700',
  'Entrevista': 'bg-yellow-100 text-yellow-700',
  'Oferta': 'bg-purple-100 text-purple-700',
  'Contratado': 'bg-green-100 text-green-700',
}

export default function KanbanColumn({ etapa, postulaciones, todasPostulaciones, onActualizarEtapa, reclutadorId, candidatosConHistorial }: Props) {
  return (
    <div className="w-72 flex-shrink-0">
      {/* Header de columna — sticky */}
      <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${COLORES_ETAPA[etapa] ?? 'bg-gray-100 text-gray-700'}`}>
          {etapa}
        </span>
        <span className="text-xs text-gray-400">{postulaciones.length}</span>
      </div>

      {/* Cards */}
      <div className="space-y-3 min-h-[100px]">
        {postulaciones.map(p => (
          <KanbanCard
            key={p.id}
            postulacion={p}
            etapasDisponibles={['Aplicado', 'Contactado', 'Entrevista', 'Oferta', 'Contratado', 'Descartado']}
            onActualizarEtapa={onActualizarEtapa}
            reclutadorId={reclutadorId}
            tieneHistorialPrevio={candidatosConHistorial?.has(p.candidato_id) ?? false}
          />
        ))}
        {postulaciones.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl h-20 flex items-center justify-center">
            <p className="text-xs text-gray-300">Sin candidatos</p>
          </div>
        )}
      </div>
    </div>
  )
}