'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// 8.18 — Historial de entrevistas agendadas, como vista de consulta.
// No agrega ningún campo nuevo a la base de datos — fecha_entrevista,
// asistio_entrevista, motivo_no_asistencia ya existían desde 5.24.
// Componente compartido entre reclutador y coordinador, con alcance
// (scope) distinto: el reclutador ve solo lo suyo (reclutador_id fijo),
// el coordinador ve toda la agencia (agencia_id, con filtro opcional
// por reclutador — solo tiene sentido en esa vista, no en la del
// reclutador, que ya sabe que es "lo suyo").

interface Scope {
  tipo: 'reclutador' | 'coordinador'
  reclutadorId?: string
  agenciaId?: string
  reclutadores?: { id: string; nombre: string }[]
}

interface Props {
  scope: Scope
  nombreCoordinador?: string
}

interface Fila {
  id: string
  candidato_id: string
  fecha_entrevista: string
  lugar_entrevista: string | null
  asistio_entrevista: boolean | null
  motivo_no_asistencia: string | null
  etapa_actual: string
  documentos_entrevista_checklist: { documento: string; estado?: 'pendiente' | 'entregado' | 'rechazado'; entregado?: boolean }[] | null
  candidatos: { nombre: string; telefono: string; edad: number | null; escolaridad: string | null; residencia: string | null } | null
  vacantes: { id: string; titulo: string; turno: string | null; negocios: { nombre: string } | null } | null
  reclutadores: { id: string; nombre: string } | null
  entrevista_activa: {
    destino: string | null
    medio_transporte: string | null
    rutas_reclutamiento: { nombre: string } | null
    puntos_reclutamiento: { nombre: string } | null
  } | null
}

const COLORES_ETAPA: Record<string, string> = {
  'Aplicado': 'bg-gray-100 text-gray-700',
  'Contactado': 'bg-blue-100 text-blue-700',
  'Entrevista': 'bg-yellow-100 text-yellow-700',
  'Inducción': 'bg-purple-100 text-purple-700',
  'Contratado': 'bg-green-100 text-green-700',
  'Descartado': 'bg-red-100 text-red-700',
}
const NOMBRES_DESTINO: Record<string, string> = { planta: 'Planta', punto_fijo: 'Punto fijo' }
const NOMBRES_MEDIO: Record<string, string> = {
  por_su_cuenta: 'Por su cuenta',
  transporte_especializado: 'Transporte especializado',
  transporte_laboral: 'Transporte laboral',
}
const NOMBRES_TURNO: Record<string, string> = {
  matutino: 'Matutino', vespertino: 'Vespertino', nocturno: 'Nocturno', rotativo: 'Rotativo',
}
const NOMBRES_TIPO_DOC: Record<string, string> = {
  cv: 'CV', identificacion: 'Identificación', comprobante_domicilio: 'Comprobante de domicilio',
  comprobante_estudios: 'Comprobante de estudios', rfc: 'RFC', nss: 'NSS', curp: 'CURP', otro: 'Otro',
}

function textoRutaOPunto(f: Fila) {
  const e = f.entrevista_activa
  if (!e || (!e.destino && !e.medio_transporte)) return f.lugar_entrevista ?? '—'
  return `${NOMBRES_DESTINO[e.destino ?? ''] ?? ''}${e.medio_transporte ? ` · ${NOMBRES_MEDIO[e.medio_transporte] ?? ''}` : ''}${e.rutas_reclutamiento?.nombre ? ` (${e.rutas_reclutamiento.nombre})` : ''}${e.puntos_reclutamiento?.nombre ? ` — ${e.puntos_reclutamiento.nombre}` : ''}`
}

export default function HistorialEntrevistas({ scope, nombreCoordinador }: Props) {
  const [filas, setFilas] = useState<Fila[]>([])
  const [vacantesDisponibles, setVacantesDisponibles] = useState<{ id: string; titulo: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [filaSeleccionada, setFilaSeleccionada] = useState<Fila | null>(null)
  const [documentosSubidos, setDocumentosSubidos] = useState<any[]>([])
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false)
  // 8.21b — el coordinador puede aprobar/rechazar documentos desde aquí,
  // así que el checklist necesita estado local editable, no solo lectura
  // directa de filaSeleccionada (que es una foto fija del momento en que
  // se abrió el modal)
  const [checklistEditable, setChecklistEditable] = useState<{ documento: string; estado: 'pendiente' | 'entregado' | 'rechazado' }[]>([])
  const [actualizandoDoc, setActualizandoDoc] = useState<string | null>(null)
  // 8.23c — historial completo de intentos de entrevista (fecha, si
  // asistió, motivo si no) — solo tiene más de 1 fila si el candidato se
  // reagendó alguna vez.
  const [historialIntentos, setHistorialIntentos] = useState<{ fecha_entrevista: string | null; asistio_entrevista: boolean | null; motivo_no_asistencia: string | null }[]>([])
  const [intentoExpandido, setIntentoExpandido] = useState<number | null>(null)

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [resultado, setResultado] = useState('') // '' | 'si' | 'no' | 'pendiente'
  const [vacanteId, setVacanteId] = useState('')
  const [nombreCandidato, setNombreCandidato] = useState('')
  const [reclutadorId, setReclutadorId] = useState('') // solo aplica en scope coordinador

  useEffect(() => {
    cargar()
  }, [scope.reclutadorId, scope.agenciaId])

  async function cargar() {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('postulaciones')
      .select(`
        id, candidato_id, fecha_entrevista, lugar_entrevista, asistio_entrevista, motivo_no_asistencia,
        etapa_actual, documentos_entrevista_checklist,
        candidatos(nombre, telefono, edad, escolaridad, residencia),
        vacantes(id, titulo, turno, negocios(nombre)),
        reclutadores(id, nombre),
        entrevista_activa:entrevistas!entrevista_activa_id(
          destino, medio_transporte,
          rutas_reclutamiento(nombre),
          puntos_reclutamiento(nombre)
        )
      `)
      .not('fecha_entrevista', 'is', null)
      .order('fecha_entrevista', { ascending: false })

    if (scope.tipo === 'reclutador' && scope.reclutadorId) {
      query = query.eq('reclutador_id', scope.reclutadorId)
    } else if (scope.tipo === 'coordinador' && scope.agenciaId) {
      query = query.eq('agencia_id', scope.agenciaId)
    }

    const { data } = await query
    setFilas((data ?? []) as any)

    // Vacantes para el filtro — se derivan de las filas ya cargadas,
    // sin otra consulta aparte
    const vacantesUnicas = new Map<string, string>()
    ;(data ?? []).forEach((f: any) => {
      if (f.vacantes) vacantesUnicas.set(f.vacantes.id, f.vacantes.titulo)
    })
    setVacantesDisponibles([...vacantesUnicas.entries()].map(([id, titulo]) => ({ id, titulo })))

    setLoading(false)
  }

  // Filtrado en el cliente (búsqueda de texto por nombre no es simple
  // de hacer vía Supabase sobre una tabla anidada) — volumen esperado
  // por reclutador/agencia es manejable sin paginar
  const filasFiltradas = filas.filter(f => {
    if (fechaDesde && f.fecha_entrevista < fechaDesde) return false
    if (fechaHasta && f.fecha_entrevista > `${fechaHasta}T23:59:59`) return false
    if (resultado === 'si' && f.asistio_entrevista !== true) return false
    if (resultado === 'no' && f.asistio_entrevista !== false) return false
    if (resultado === 'pendiente' && f.asistio_entrevista !== null) return false
    if (vacanteId && f.vacantes?.id !== vacanteId) return false
    if (nombreCandidato && !f.candidatos?.nombre?.toLowerCase().includes(nombreCandidato.toLowerCase())) return false
    if (scope.tipo === 'coordinador' && reclutadorId && f.reclutadores?.id !== reclutadorId) return false
    return true
  })

  // Cerrar el modal con la tecla Esc
  useEffect(() => {
    if (!filaSeleccionada) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setFilaSeleccionada(null)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [filaSeleccionada])

  // 8.21b — si el reclutador sube o marca un documento mientras el
  // coordinador ya tiene este modal abierto, el checklist se refresca
  // solo, sin tener que cerrar y volver a abrir.
  useEffect(() => {
    if (!filaSeleccionada) return
    const supabase = createClient()
    const canal = supabase
      .channel(`detalle-candidato-${filaSeleccionada.id}-${Math.random()}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'postulaciones',
        filter: `id=eq.${filaSeleccionada.id}`
      }, async () => {
        const { data } = await supabase
          .from('postulaciones')
          .select('documentos_entrevista_checklist')
          .eq('id', filaSeleccionada.id)
          .single()
        const checklist: any[] = data?.documentos_entrevista_checklist ?? []
        setChecklistEditable(checklist.map((c: any) => ({
          documento: c.documento,
          estado: c.estado ?? (c.entregado ? 'entregado' : 'pendiente'),
        })))
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [filaSeleccionada?.id])

  async function abrirDetalle(fila: Fila) {
    setFilaSeleccionada(fila)
    setIntentoExpandido(null)
    setCargandoDocumentos(true)

    // 8.21b — retrocompatibilidad: checklists guardados antes de hoy
    // usan `entregado: boolean`, no `estado` — se traduce al abrir.
    setChecklistEditable((fila.documentos_entrevista_checklist ?? []).map(c => {
      if (c.estado) return { documento: c.documento, estado: c.estado }
      return { documento: c.documento, estado: c.entregado ? 'entregado' : 'pendiente' }
    }))

    const res = await fetch(`/api/documentos?candidatoId=${fila.candidato_id}`)
    const data = await res.json()
    setDocumentosSubidos(data.documentos ?? [])
    setCargandoDocumentos(false)

    // 8.23c — historial completo de intentos, no solo el vigente
    const supabase = createClient()
    const { data: intentos } = await supabase
      .from('entrevistas')
      .select('fecha_entrevista, asistio_entrevista, motivo_no_asistencia')
      .eq('postulacion_id', fila.id)
      .order('created_at', { ascending: true })
    setHistorialIntentos(intentos ?? [])
  }

  // 8.21b — el coordinador aprueba o rechaza un documento. Se guarda al
  // instante (es una sola acción puntual por documento, no un formulario
  // grande — distinto del checklist del reclutador que sí espera botón).
  async function actualizarEstadoDoc(documento: string, nuevoEstado: 'entregado' | 'rechazado') {
    if (!filaSeleccionada) return
    setActualizandoDoc(documento)
    const nuevo = checklistEditable.map(c => c.documento === documento ? { ...c, estado: nuevoEstado } : c)
    const supabase = createClient()
    const { error } = await supabase
      .from('postulaciones')
      .update({ documentos_entrevista_checklist: nuevo })
      .eq('id', filaSeleccionada.id)
    if (error) {
      alert('No se pudo guardar: ' + error.message)
    } else {
      setChecklistEditable(nuevo)
    }
    setActualizandoDoc(null)
  }

  return (
    <div>
      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Resultado</label>
          <select
            value={resultado}
            onChange={e => setResultado(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            <option value="">Todos</option>
            <option value="si">✅ Sí se presentó</option>
            <option value="no">❌ No se presentó</option>
            <option value="pendiente">⏳ Pendiente de confirmar</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Vacante</label>
          <select
            value={vacanteId}
            onChange={e => setVacanteId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            <option value="">Todas</option>
            {vacantesDisponibles.map(v => (
              <option key={v.id} value={v.id}>{v.titulo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Candidato</label>
          <input
            type="text"
            value={nombreCandidato}
            onChange={e => setNombreCandidato(e.target.value)}
            placeholder="Buscar nombre..."
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          />
        </div>
        {scope.tipo === 'coordinador' && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">Reclutador</label>
            <select
              value={reclutadorId}
              onChange={e => setReclutadorId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            >
              <option value="">Todos</option>
              {(scope.reclutadores ?? []).map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Cargando...</div>
      ) : filasFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-gray-500 font-medium">Sin entrevistas que coincidan con estos filtros</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <div
            className="grid text-sm min-w-[820px]"
            style={{ gridTemplateColumns: 'minmax(180px,2fr) minmax(160px,1.5fr) minmax(130px,1fr) minmax(120px,auto) minmax(140px,1fr) minmax(110px,auto)' }}
          >
            {['Nombre', 'Título de vacante', 'Empresa', 'Celular', 'Reclutador', 'Estatus'].map(col => (
              <div key={col} className="bg-white border-b border-gray-100 px-4 py-3 text-xs font-medium text-gray-500">
                {col}
              </div>
            ))}

            {filasFiltradas.map(f => (
              <div key={f.id} className="contents group">
                <div className="px-4 py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors">
                  <button onClick={() => abrirDetalle(f)} className="font-medium text-gray-900 hover:text-[#1A6B3C] hover:underline text-left">
                    {f.candidatos?.nombre ?? 'Candidato'}
                  </button>
                </div>
                <div className="px-4 py-3 border-b border-gray-50 text-gray-600 group-hover:bg-gray-50 transition-colors">
                  {f.vacantes?.titulo ?? '—'}
                </div>
                <div className="px-4 py-3 border-b border-gray-50 text-gray-600 group-hover:bg-gray-50 transition-colors">
                  {f.vacantes?.negocios?.nombre ?? '—'}
                </div>
                <div className="px-4 py-3 border-b border-gray-50 text-gray-600 group-hover:bg-gray-50 transition-colors">
                  {f.candidatos?.telefono ?? '—'}
                </div>
                <div className="px-4 py-3 border-b border-gray-50 text-gray-600 group-hover:bg-gray-50 transition-colors">
                  {f.reclutadores?.nombre ?? '—'}
                </div>
                <div className="px-4 py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORES_ETAPA[f.etapa_actual] ?? 'bg-gray-100 text-gray-600'}`}>
                    {f.etapa_actual}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de ficha completa — solo consulta, con checklist de
          documentos (lo llena el reclutador) y archivos con descarga */}
      {filaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setFilaSeleccionada(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Ficha del candidato</h3>
                <button onClick={() => setFilaSeleccionada(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
              </div>

              <div className="space-y-1.5 text-sm text-gray-700">
                {filaSeleccionada.vacantes?.negocios?.nombre && <p>🏭 <strong>Empresa:</strong> {filaSeleccionada.vacantes.negocios.nombre}</p>}
                {filaSeleccionada.vacantes?.titulo && <p>✅ <strong>Vacante:</strong> {filaSeleccionada.vacantes.titulo}</p>}
                {filaSeleccionada.vacantes?.turno && <p>🕛 <strong>Horario Laboral:</strong> {NOMBRES_TURNO[filaSeleccionada.vacantes.turno] ?? filaSeleccionada.vacantes.turno}</p>}
                <p>📅 <strong>Fecha de entrevista:</strong> {new Date(filaSeleccionada.fecha_entrevista).toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                <p>🕛 <strong>Hora de entrevista:</strong> {new Date(filaSeleccionada.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>🔰 <strong>Nombre Candidato:</strong> {filaSeleccionada.candidatos?.nombre}</p>
                {filaSeleccionada.candidatos?.edad && <p>💠 <strong>Edad:</strong> {filaSeleccionada.candidatos.edad} años</p>}
                {filaSeleccionada.candidatos?.escolaridad && <p>🧑🏻‍🎓 <strong>Escolaridad:</strong> {filaSeleccionada.candidatos.escolaridad}</p>}
                {filaSeleccionada.candidatos?.residencia && <p>📌 <strong>Residencia:</strong> {filaSeleccionada.candidatos.residencia}</p>}
                <p>🚌 <strong>Ruta o Punto de Reclutamiento:</strong> {textoRutaOPunto(filaSeleccionada)}</p>
                {filaSeleccionada.reclutadores?.nombre && <p>⭕ <strong>Reclutador:</strong> {filaSeleccionada.reclutadores.nombre}</p>}
                {nombreCoordinador && <p>⭕ <strong>Coordinador:</strong> {nombreCoordinador}</p>}
                <p>📊 <strong>Estatus:</strong> <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${COLORES_ETAPA[filaSeleccionada.etapa_actual] ?? 'bg-gray-100 text-gray-600'}`}>{filaSeleccionada.etapa_actual}</span></p>
              </div>

              {/* 8.23c — solo aparece si hubo más de un intento, es decir,
                  si el candidato no se presentó y se reagendó */}
              {historialIntentos.length > 1 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">Historial de entrevistas (reagendada)</p>
                  <div className="space-y-1.5">
                    {historialIntentos.map((intento, i) => {
                      const tieneRazon = intento.asistio_entrevista === false && intento.motivo_no_asistencia
                      return (
                        <div
                          key={i}
                          onClick={() => tieneRazon && setIntentoExpandido(intentoExpandido === i ? null : i)}
                          className={`text-xs bg-gray-50 rounded-lg px-2 py-1.5 ${tieneRazon ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                        >
                          <p className="text-gray-700 font-medium">
                            Intento {i + 1}: {intento.fecha_entrevista
                              ? `${new Date(intento.fecha_entrevista).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })} · ${new Date(intento.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
                              : 'Sin fecha'}
                          </p>
                          {intento.asistio_entrevista === true && <p className="text-green-700 mt-0.5">✅ Se presentó</p>}
                          {intento.asistio_entrevista === false && (
                            <>
                              <p className="text-red-700 mt-0.5">
                                ❌ No se presentó{tieneRazon ? (intentoExpandido === i ? ' — ▲ ocultar razón' : ' — ▼ ver razón') : ''}
                              </p>
                              {intentoExpandido === i && intento.motivo_no_asistencia && (
                                <p className="text-gray-500 mt-0.5">Motivo: {intento.motivo_no_asistencia}</p>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {checklistEditable.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">Documentos</p>
                  <div className="space-y-1">
                    {checklistEditable.map((c, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 text-xs bg-gray-50 rounded-lg px-2 py-1.5">
                        <span className="text-gray-700 flex-1">{c.documento}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          c.estado === 'entregado' ? 'bg-green-100 text-green-700' : c.estado === 'rechazado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {c.estado === 'entregado' ? 'OK' : c.estado === 'rechazado' ? 'Solicitado de nuevo' : 'Pendiente'}
                        </span>
                        {actualizandoDoc === c.documento ? (
                          <span className="text-[10px] text-gray-400 flex-shrink-0">...</span>
                        ) : c.estado === 'entregado' && (
                          <button onClick={() => actualizarEstadoDoc(c.documento, 'rechazado')} className="text-[10px] text-red-700 hover:underline flex-shrink-0">🔄 Solicitar de nuevo</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-1.5">Archivos subidos</p>
                {cargandoDocumentos ? (
                  <p className="text-xs text-gray-400">Cargando...</p>
                ) : documentosSubidos.length === 0 ? (
                  <p className="text-xs text-gray-400">Sin archivos subidos todavía</p>
                ) : (
                  <div className="space-y-1">
                    {documentosSubidos.map((doc: any) => (
                      <a
                        key={doc.id}
                        href={doc.url_firmada ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
                      >
                        <span className="text-[#1A6B3C]">📄 {NOMBRES_TIPO_DOC[doc.tipo] ?? doc.tipo}</span>
                        <span className="text-gray-400">{new Date(doc.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
