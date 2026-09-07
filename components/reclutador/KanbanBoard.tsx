'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, type DragMoveEvent, type Modifier } from '@dnd-kit/core'
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
  fecha_contratacion: string | null
  fecha_firma_contrato: string | null
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

  // Arrastrar y soltar (2026-09-06). `distance: 4` evita que un clic
  // normal (abrir la ficha del candidato, dar "Mover ▾", etc.) se
  // confunda con el inicio de un arrastre — mismo umbral que ya usa
  // EditableList.tsx en este proyecto.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const [solicitudArrastre, setSolicitudArrastre] = useState<{ postulacionId: string; etapa: string } | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  // Rediseño completo (2026-09-06): ya no usamos `over`/colisión de
  // dnd-kit para decidir el imán — esa decisión y la posición ya
  // modificada por el imán se retroalimentaban entre sí, y solo
  // funcionaba en la primera columna. Ahora `snapEtapa` es NUESTRO
  // propio cálculo, con posiciones reales del DOM, y es la ÚNICA fuente
  // de verdad — tanto para mover visualmente la tarjeta como para
  // decidir dónde se suelta al final. dnd-kit ya no decide nada de esto.
  const [snapEtapa, setSnapEtapa] = useState<string | null>(null)

  // Misma regla exacta que CA-02.9 en KanbanCard.tsx (ORDEN_ETAPAS/
  // opcionesMenu) — un paso a la vez, adelante o atrás, "Descartado"
  // siempre disponible desde cualquier etapa activa, "Contratado" y
  // "Descartado" son terminales sin ningún movimiento posible.
  function esMovimientoValido(etapaActual: string, etapaDestino: string): boolean {
    if (etapaActual === etapaDestino) return false
    if (etapaActual === 'Descartado' || etapaActual === 'Contratado') return false
    const ORDEN_ETAPAS = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado']
    const idx = ORDEN_ETAPAS.indexOf(etapaActual)
    const siguiente = idx >= 0 && idx < ORDEN_ETAPAS.length - 1 ? ORDEN_ETAPAS[idx + 1] : null
    const anterior = idx > 0 ? ORDEN_ETAPAS[idx - 1] : null
    return etapaDestino === siguiente || etapaDestino === anterior || etapaDestino === 'Descartado'
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
    setSnapEtapa(null)
  }

  // Cancelar con Escape — refuerza la intención de "no quiero moverlo",
  // mismo patrón que ya usan los demás modales del proyecto.
  useEffect(() => {
    if (!activeId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveId(null)
        setSnapEtapa(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  // Se dispara en cada milisegundo mientras arrastras. Calcula, con las
  // posiciones REALES del DOM (document.getElementById, no nada de
  // dnd-kit), qué tanto porcentaje del ancho de la tarjeta ya se mete en
  // cada columna válida — el colchón del tercio vive aquí, una sola vez,
  // aplicado igual a TODAS las columnas (antes solo funcionaba en la
  // primera, por el problema de retroalimentación ya explicado).
  function handleDragMove(event: DragMoveEvent) {
    const { active, delta } = event
    const postulacion = postulaciones.find(p => p.id === String(active.id))
    const rectInicial = active.rect.current.initial
    if (!postulacion || !rectInicial) { setSnapEtapa(null); return }

    const cardIzq = rectInicial.left + delta.x
    const cardDer = cardIzq + rectInicial.width

    let mejorEtapa: string | null = null
    let mejorFraccion = 0
    for (const etapa of ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado', 'Descartado']) {
      if (!esMovimientoValido(postulacion.etapa_actual, etapa)) continue
      const el = document.getElementById(`kanban-col-${etapa}`)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const izq = Math.max(cardIzq, rect.left)
      const der = Math.min(cardDer, rect.right)
      const ancho = Math.max(0, der - izq)
      const fraccion = ancho / rectInicial.width
      if (fraccion > mejorFraccion) { mejorFraccion = fraccion; mejorEtapa = etapa }
    }
    setSnapEtapa(mejorFraccion >= 1 / 3 ? mejorEtapa : null)
  }

  // El imán en sí — antes REEMPLAZABA la posición X por completo, lo
  // cual peleaba contra el mouse y no dejaba cancelar (tenías que
  // "ganarle" al imán a la fuerza). Ahora solo JALA un 40% hacia el
  // centro de la columna, dejando que tu mouse siga mandando el 60% —
  // se siente "atraído" en vez de "atrapado", y basta con mover un poco
  // hacia afuera para que se rompa el umbral del tercio y te suelte.
  const modificadorImanColumna: Modifier = ({ transform, active }) => {
    if (!snapEtapa || !active) return transform
    const rectOriginal = active.rect.current.initial
    if (!rectOriginal) return transform
    const el = document.getElementById(`kanban-col-${snapEtapa}`)
    if (!el) return transform
    const rectColumna = el.getBoundingClientRect()
    const centroColumna = rectColumna.left + rectColumna.width / 2
    const centroTarjetaOriginal = rectOriginal.left + rectOriginal.width / 2
    const targetX = centroColumna - centroTarjetaOriginal
    const factor = 0.4
    return { ...transform, x: transform.x + (targetX - transform.x) * factor }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    // Se suelta exactamente donde el imán ya estaba mostrando — nunca
    // le preguntamos a dnd-kit "over" para esta decisión, así nunca hay
    // desacuerdo entre lo que ves (la tarjeta ya imantada) y lo que pasa
    // al soltar. Si snapEtapa es null (nunca llegaste a un tercio de
    // ninguna columna válida), no pasa nada — se queda donde estaba.
    if (snapEtapa) {
      const postulacionId = String(event.active.id)
      setSolicitudArrastre({ postulacionId, etapa: snapEtapa })
    }
    setSnapEtapa(null)
  }

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
        motivo_descarte, motivo_descarte_detalle, fecha_garantia_fin, garantia_cumplida, precalificado, asistio_entrevista, fecha_entrevista, fecha_contratacion, fecha_firma_contrato, es_manual,
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

    {/* Vista desktop — Kanban horizontal, cada columna con su propio scroll.
        Arrastrar y soltar solo aquí (2026-09-06) — la vista móvil se
        queda con el botón "Mover ▾" únicamente, arrastrar con el dedo
        en una lista vertical de una sola columna no aporta nada real. */}
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} modifiers={[modificadorImanColumna]}>
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
              solicitudArrastre={solicitudArrastre}
              onSolicitudProcesada={() => setSolicitudArrastre(null)}
              esDestinoImán={snapEtapa === etapa}
            />
          ))}
        </div>
      </div>

      {/* Copia flotante — vive fuera de cualquier contenedor con scroll
          (dnd-kit la renderiza en un portal aparte), así que se mueve
          libre por toda la pantalla sin que el overflow-y-auto de cada
          columna la recorte. Solo una vista simplificada, no la tarjeta
          interactiva completa. */}
      <DragOverlay dropAnimation={null}>
        {activeId && (() => {
          const p = postulaciones.find(post => post.id === activeId)
          if (!p) return null
          return (
            <div
              className={`rounded-xl p-3 shadow-2xl bg-white w-72 cursor-grabbing outline-none transition-all duration-150 border border-gray-200 ring-1 ${
                snapEtapa ? 'rotate-0 scale-105 ring-[#1A6B3C]/50' : 'rotate-2 ring-[#1A6B3C]/35'
              }`}
            >
              <p className="font-semibold text-gray-900 text-base">{p.candidatos?.nombre}</p>
              <p className="text-sm text-[#1A6B3C] mt-0.5">
                {p.vacantes?.titulo}{p.vacantes?.negocios?.nombre ? ` — ${p.vacantes.negocios.nombre}` : ''}
              </p>
            </div>
          )
        })()}
      </DragOverlay>
    </DndContext>
    </>
    )}
    </>
  )
}