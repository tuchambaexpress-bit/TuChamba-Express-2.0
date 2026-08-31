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
}

interface Fila {
  id: string
  fecha_entrevista: string
  lugar_entrevista: string | null
  asistio_entrevista: boolean | null
  motivo_no_asistencia: string | null
  candidatos: { nombre: string; telefono: string } | null
  vacantes: { id: string; titulo: string; negocios: { nombre: string } | null } | null
  reclutadores: { id: string; nombre: string } | null
}

export default function HistorialEntrevistas({ scope }: Props) {
  const [filas, setFilas] = useState<Fila[]>([])
  const [vacantesDisponibles, setVacantesDisponibles] = useState<{ id: string; titulo: string }[]>([])
  const [loading, setLoading] = useState(true)

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
        id, fecha_entrevista, lugar_entrevista, asistio_entrevista, motivo_no_asistencia,
        candidatos(nombre, telefono),
        vacantes(id, titulo, negocios(nombre)),
        reclutadores(id, nombre)
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
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filasFiltradas.map(f => (
              <div key={f.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{f.candidatos?.nombre ?? 'Candidato'}</p>
                    <p className="text-xs text-gray-400">{f.candidatos?.telefono}</p>
                    <p className="text-sm text-[#1A6B3C] mt-1">
                      {f.vacantes?.titulo}{f.vacantes?.negocios?.nombre ? ` — ${f.vacantes.negocios.nombre}` : ''}
                    </p>
                    {scope.tipo === 'coordinador' && f.reclutadores?.nombre && (
                      <p className="text-xs text-gray-400 mt-0.5">👤 {f.reclutadores.nombre}</p>
                    )}
                    {f.lugar_entrevista && (
                      <p className="text-xs text-gray-500 mt-0.5">📍 {f.lugar_entrevista}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(f.fecha_entrevista).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(f.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="mt-1.5">
                      {f.asistio_entrevista === true && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✅ Sí se presentó</span>
                      )}
                      {f.asistio_entrevista === false && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">❌ No se presentó</span>
                      )}
                      {f.asistio_entrevista === null && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">⏳ Pendiente</span>
                      )}
                    </div>
                  </div>
                </div>
                {f.motivo_no_asistencia && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1 mt-2">
                    Motivo: {f.motivo_no_asistencia}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
