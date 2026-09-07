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
  solicitudArrastre?: { postulacionId: string; etapa: string } | null
  onSolicitudProcesada?: () => void
  // Arrastrar y soltar, rediseño (2026-09-06): ya no usamos el `isOver`
  // de dnd-kit (ese fue la causa del bug de "solo funciona una vez") —
  // el padre calcula a mano, con posiciones reales, cuál columna es el
  // destino del imán, y nos lo pasa aquí directo.
  esDestinoImán?: boolean
}

const COLORES_ETAPA: Record<string, string> = {
  'Aplicado': 'bg-gray-100 text-gray-700',
  'Contactado': 'bg-blue-100 text-blue-700',
  'Entrevista': 'bg-yellow-100 text-yellow-700',
  'Inducción': 'bg-purple-100 text-purple-700',
  'Contratado': 'bg-green-100 text-green-700',
  'Descartado': 'bg-red-100 text-red-700',
}

export default function KanbanColumn({ etapa, postulaciones, todasPostulaciones, onActualizarEtapa, reclutadorId, candidatosConHistorial, solicitudArrastre, onSolicitudProcesada, esDestinoImán }: Props) {
  return (
    <div className="w-72 flex-shrink-0 h-full flex flex-col">
      {/* Header de columna — ya vive fuera del área con scroll por
          estructura (hermano de la lista, no dentro de ella), así que
          no necesita sticky — mismo hallazgo que ya se hizo en
          PipelineCoordinador (7.44/limpieza posterior) */}
      <div className="flex items-center gap-2 mb-3 bg-gray-50 py-2 flex-shrink-0">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${COLORES_ETAPA[etapa] ?? 'bg-gray-100 text-gray-700'}`}>
          {etapa === 'Descartado' ? 'Descartados' : etapa}
        </span>
        <span className="text-xs text-gray-400">{postulaciones.length}</span>
      </div>

      {/* Cards — scroll propio, independiente de las demás columnas.
          ref+isOver del useDroppable, para detectar el drop y resaltar
          la columna mientras se arrastra algo encima (2026-09-06) */}
      <div
        id={`kanban-col-${etapa}`}
        className={`space-y-3 min-h-[100px] flex-1 overflow-y-auto pr-1 rounded-lg transition-colors ${
          esDestinoImán ? 'bg-[#1A6B3C]/5 ring-0 ring-[#1A6B3C]/30' : ''
        }`}
      >
        {postulaciones.map(p => (
          <KanbanCard
            key={p.id}
            postulacion={p}
            etapasDisponibles={['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado', 'Descartado']}
            onActualizarEtapa={onActualizarEtapa}
            reclutadorId={reclutadorId}
            tieneHistorialPrevio={candidatosConHistorial?.has(p.candidato_id) ?? false}
            solicitudEtapa={solicitudArrastre && solicitudArrastre.postulacionId === p.id ? solicitudArrastre.etapa : null}
            onSolicitudProcesada={onSolicitudProcesada}
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