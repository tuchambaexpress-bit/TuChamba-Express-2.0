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
  agencia_id: string
  candidatos: Candidato
  vacantes: {
    titulo: string
    horario?: string | null
    ruta_para_entrevista?: boolean
    punto_reunion?: string | null
    etapas_personalizadas: string[]
    dias_garantia: number
    comision_base_mxn: number
    tiene_promocion?: boolean
    promocion_fin?: string | null
    promocion_monto_mxn?: number | null
    dias_induccion?: number
    induccion_dentro_garantia?: boolean
    negocios: { nombre: string; dias_descanso: number[]; dias_entrevista: number[] } | null
  }
  chats: { id: string }[]
  created_at: string
  updated_at: string
  motivo_descarte: string | null
  motivo_descarte_detalle: string | null
  fecha_garantia_fin: string | null
  garantia_cumplida: boolean
  es_manual: boolean
}

export default function KanbanBoard() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [candidatosConHistorial, setCandidatosConHistorial] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) return
    const s = JSON.parse(data)
    setSesion(s)
    cargarPostulaciones(s.id)
  }, [])

  // Realtime: recarga sola cuando llega un candidato nuevo, o cualquier
  // postulación de este reclutador cambia (antes solo cargaba una vez al abrir).
  useEffect(() => {
    if (!sesion?.id) return
    const supabase = createClient()
    const canal = supabase
      .channel(`pipeline-reclutador-${sesion.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'postulaciones',
        filter: `reclutador_id=eq.${sesion.id}`
      }, () => cargarPostulaciones(sesion.id))
      .subscribe((status) => console.log('🔌 Canal Realtime pipeline:', status))
    return () => { supabase.removeChannel(canal) }
  }, [sesion?.id])

  async function cargarPostulaciones(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('postulaciones')
      .select(`
        id, etapa_actual, candidato_id, vacante_id, agencia_id, created_at, updated_at,
        motivo_descarte, motivo_descarte_detalle, fecha_garantia_fin, garantia_cumplida, precalificado, asistio_entrevista, fecha_entrevista, es_manual,
        candidatos(id, nombre, telefono, edad, escolaridad, residencia),
        vacantes(titulo, horario, ruta_para_entrevista, punto_reunion, etapas_personalizadas, dias_garantia, comision_base_mxn, tiene_promocion, promocion_fin, promocion_monto_mxn, dias_induccion, induccion_dentro_garantia, negocios(nombre, dias_descanso, dias_entrevista)),
        chats(id)
      `)
      .eq('reclutador_id', reclutadorId)
      .order('created_at', { ascending: false })

    if (data) {
      const ahora = Date.now()
      const DOS_DIAS = 2 * 24 * 60 * 60 * 1000
      const TRES_DIAS = 3 * 24 * 60 * 60 * 1000

      const visibles = data.filter((p: any) => {
        // CA-19.3b: "No efectivo" se oculta 2 días después de marcarse
        if (p.etapa_actual === 'Descartado' && p.motivo_descarte === 'no_concluyo_induccion') {
          return ahora - new Date(p.updated_at).getTime() < DOS_DIAS
        }
        // CA-19.3c: "Contratado" con garantía cumplida se oculta 3 días después
        // (calculado al vuelo comparando fecha, sin depender de garantia_cumplida guardado)
        if (p.etapa_actual === 'Contratado' && p.fecha_garantia_fin) {
          const yaSeVencio = ahora > new Date(p.fecha_garantia_fin + 'T00:00:00').getTime()
          if (yaSeVencio) {
            const diasDesdeVencio = ahora - new Date(p.fecha_garantia_fin + 'T00:00:00').getTime()
            return diasDesdeVencio < TRES_DIAS
          }
        }
        return true
      })

      setPostulaciones(visibles as any)
    }

    // CA-14.2: detectar candidatos con historial previo (postulaciones
    // descartadas anteriores del mismo candidato, con este reclutador).
    if (data && data.length > 0) {
      const candidatoIds = [...new Set(data.map((p: any) => p.candidato_id))]
      const { data: historial } = await supabase
        .from('postulaciones')
        .select('candidato_id')
        .eq('reclutador_id', reclutadorId)
        .eq('etapa_actual', 'Descartado')
        .in('candidato_id', candidatoIds)

      if (historial) {
        setCandidatosConHistorial(new Set(historial.map((h: any) => h.candidato_id)))
      }
    }

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

  // Obtener etapas únicas de todas las vacantes (CA-13.3: se agrega "Descartados" al final)
  const todasEtapas = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado', 'Descartado']

  return (
    <>
    {postulaciones.length === 0 ? (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-gray-500 font-medium">No tienes candidatos activos</p>
        <p className="text-gray-400 text-sm mt-1">
          Comparte tu link de referido, o agrégalo tú mismo con "+ Candidato" si te llegó por otro medio
        </p>
      </div>
    ) : (
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
        {todasEtapas.map(e => <option key={e} value={e}>{e === 'Descartado' ? 'Descartados' : e}</option>)}
      </select>
      <div className="space-y-3">
        {postulaciones.map(p => (
          <div key={p.id} data-etapa={p.etapa_actual}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">{p.etapa_actual}</span>
            </div>
            <KanbanCard
              postulacion={p}
              etapasDisponibles={['Aplicado','Contactado','Entrevista','Inducción','Contratado','Descartado']}
              onActualizarEtapa={actualizarEtapa}
              reclutadorId={sesion?.id}
              tieneHistorialPrevio={candidatosConHistorial.has(p.candidato_id)}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Vista desktop — Kanban horizontal, cada columna con su propio scroll */}
    <div className="hidden md:block h-full pb-4">
      <div className="flex gap-4 min-w-max h-full">
        {todasEtapas.map(etapa => (
          <KanbanColumn
            key={etapa}
            etapa={etapa}
            postulaciones={postulaciones.filter(p => p.etapa_actual === etapa)}
            todasPostulaciones={postulaciones}
            onActualizarEtapa={actualizarEtapa}
            reclutadorId={sesion?.id}
            candidatosConHistorial={candidatosConHistorial}
          />
        ))}
      </div>
    </div>
    </>
    )}
    </>
  )
}