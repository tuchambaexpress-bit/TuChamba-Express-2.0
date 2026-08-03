'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'

interface Candidato {
  id: string
  nombre: string
  telefono: string
}

interface Postulacion {
  id: string
  etapa_actual: string
  candidato_id: string
  vacante_id: string
  candidatos: Candidato
  vacantes: { titulo: string; etapas_personalizadas: string[]; dias_garantia: number; comision_base_mxn: number }
  chats: { id: string }[]
  created_at: string
}

export default function KanbanBoard() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) return
    const s = JSON.parse(data)
    setSesion(s)
    cargarPostulaciones(s.id)
  }, [])

  async function cargarPostulaciones(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('postulaciones')
      .select(`
        id, etapa_actual, candidato_id, vacante_id, agencia_id, created_at,
        candidatos(id, nombre, telefono),
        vacantes(titulo, etapas_personalizadas, dias_garantia, comision_base_mxn),
        chats(id)
      `)
      .eq('reclutador_id', reclutadorId)
      .not('etapa_actual', 'eq', 'Descartado')
      .order('created_at', { ascending: false })

    if (data) setPostulaciones(data as any)
    setLoading(false)
  }

  function actualizarEtapa(postulacionId: string, nuevaEtapa: string) {
    setPostulaciones(prev =>
      prev.map(p => p.id === postulacionId ? { ...p, etapa_actual: nuevaEtapa } : p)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <p>Cargando pipeline...</p>
      </div>
    )
  }

  if (postulaciones.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-gray-500 font-medium">No tienes candidatos activos</p>
        <p className="text-gray-400 text-sm mt-1">
          Comparte tu link de referido para empezar a recibir candidatos
        </p>
      </div>
    )
  }

  // Obtener etapas únicas de todas las vacantes
  const todasEtapas = ['Aplicado', 'Contactado', 'Entrevista', 'Oferta', 'Contratado']

  return (
    <>
    {/* Vista móvil — lista con filtro de etapa */}
    <div className="md:hidden">
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
        onChange={e => {
          const etapa = e.target.value
          const cards = document.querySelectorAll('[data-etapa]')
          cards.forEach((card: any) => {
            card.style.display = (!etapa || card.dataset.etapa === etapa) ? 'block' : 'none'
          })
        }}
      >
        <option value="">Todas las etapas</option>
        {todasEtapas.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
      <div className="space-y-3">
        {postulaciones.map(p => (
          <div key={p.id} data-etapa={p.etapa_actual}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">{p.etapa_actual}</span>
            </div>
            <KanbanCard
              postulacion={p}
              etapasDisponibles={['Aplicado','Contactado','Entrevista','Oferta','Contratado','Descartado']}
              onActualizarEtapa={actualizarEtapa}
              reclutadorId={sesion?.id}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Vista desktop — Kanban horizontal */}
    <div className="hidden md:block pb-4">
      <div className="flex gap-4 min-w-max">
        {todasEtapas.map(etapa => (
          <KanbanColumn
            key={etapa}
            etapa={etapa}
            postulaciones={postulaciones.filter(p => p.etapa_actual === etapa)}
            todasPostulaciones={postulaciones}
            onActualizarEtapa={actualizarEtapa}
            reclutadorId={sesion?.id}
          />
        ))}
      </div>
    </div>
    </>
  )
}