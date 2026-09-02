'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

// 7.39 — pantalla propia de tráfico para el reclutador (José confirmó
// que basta con un número agregado por periodo, y que sí necesita
// desglose por vacante individual — "esta vacante tiene 40 visitas").
// Mismo patrón de carga de agencias que ya usa el dashboard
// (4.12d/cargarAgenciasReclutador), y mismos tipo_evento que 7.43
// (ver_vacante / postularme), solo que agrupados por vacante en vez
// de sumados en un solo total.

interface AgenciaReclutador {
  id: string
  nombre: string
}

interface FilaVacante {
  vacanteId: string
  titulo: string
  empresa: string
  vistas: number
  postulaciones: number
}

type Periodo = 'mes_actual' | 'mes_anterior' | 'todo'

const NOMBRES_PERIODO: Record<Periodo, string> = {
  mes_actual: 'Este mes',
  mes_anterior: 'Mes anterior',
  todo: 'Todo el tiempo',
}

export default function TraficoReclutador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [agenciasReclutador, setAgenciasReclutador] = useState<AgenciaReclutador[]>([])
  const [agenciasCargadas, setAgenciasCargadas] = useState(false)
  const [agenciaFiltro, setAgenciaFiltro] = useState<string>('todas')
  const [periodo, setPeriodo] = useState<Periodo>('mes_actual')
  const [cargando, setCargando] = useState(true)
  const [totalVistas, setTotalVistas] = useState(0)
  const [totalPostulaciones, setTotalPostulaciones] = useState(0)
  const [filas, setFilas] = useState<FilaVacante[]>([])

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarAgenciasReclutador(s.id)
  }, [])

  useEffect(() => {
    if (!sesion || !agenciasCargadas) return
    if (agenciasReclutador.length === 0) {
      // Fix (2026-09-02): antes, si esta lista venía vacía por cualquier
      // motivo, la pantalla se quedaba en "Cargando..." para siempre —
      // nunca se llamaba a cargarTrafico(), así que `cargando` nunca
      // pasaba a false. Ahora se resuelve explícito, con mensaje claro.
      setCargando(false)
      return
    }
    cargarTrafico(sesion.id, agenciaFiltro, periodo)
  }, [sesion, agenciasReclutador, agenciasCargadas, agenciaFiltro, periodo])

  // Idéntico a cargarAgenciasReclutador() de dashboard/page.tsx (4.12d) —
  // mismo patrón, para no inventar uno nuevo
  async function cargarAgenciasReclutador(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('reclutador_agencia')
      .select('agencias(id, nombre)')
      .eq('reclutador_id', reclutadorId)
      .eq('activo', true)

    const lista = (data ?? []).map((r: any) => r.agencias).filter(Boolean) as AgenciaReclutador[]
    setAgenciasReclutador(lista)
    if (lista.length === 1) setAgenciaFiltro(lista[0].id)
    setAgenciasCargadas(true)
  }

  function rangoDelPeriodo(p: Periodo): { desde: string | null; hasta: string | null } {
    const hoy = new Date()
    if (p === 'todo') return { desde: null, hasta: null }
    if (p === 'mes_actual') {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      return { desde: inicio.toISOString(), hasta: null }
    }
    // mes_anterior
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
    const fin = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    return { desde: inicio.toISOString(), hasta: fin.toISOString() }
  }

  async function cargarTrafico(reclutadorId: string, agenciaId: string, p: Periodo) {
    setCargando(true)
    const supabase = createClient()
    const agenciaIds = agenciaId === 'todas' ? agenciasReclutador.map(a => a.id) : [agenciaId]
    const { desde, hasta } = rangoDelPeriodo(p)

    let traficoTotal: any[] = []
    for (const agId of agenciaIds) {
      let query = supabase
        .from('trafico_referidos')
        .select('tipo_evento, vacante_id')
        .eq('reclutador_id', reclutadorId)
        .eq('agencia_id', agId)
      if (desde) query = query.gte('created_at', desde)
      if (hasta) query = query.lt('created_at', hasta)
      const { data } = await query
      traficoTotal.push(...(data ?? []))
    }

    const vistas = traficoTotal.filter(t => t.tipo_evento === 'ver_vacante')
    const postulaciones = traficoTotal.filter(t => t.tipo_evento === 'postularme')
    setTotalVistas(vistas.length)
    setTotalPostulaciones(postulaciones.length)

    // Agrupa por vacante_id — solo tiene sentido para vistas/postulaciones
    // (tipo_evento='visita', las cargas generales de página, no traen
    // vacante_id porque no son de una vacante específica)
    const vacanteIds = [...new Set([...vistas, ...postulaciones].map(t => t.vacante_id).filter(Boolean))]

    if (vacanteIds.length === 0) {
      setFilas([])
      setCargando(false)
      return
    }

    const { data: vacantesData } = await supabase
      .from('vacantes')
      .select('id, titulo, negocios(nombre)')
      .in('id', vacanteIds)

    const nuevasFilas: FilaVacante[] = (vacantesData ?? []).map((v: any) => ({
      vacanteId: v.id,
      titulo: v.titulo,
      empresa: v.negocios?.nombre ?? 'Empresa',
      vistas: vistas.filter(t => t.vacante_id === v.id).length,
      postulaciones: postulaciones.filter(t => t.vacante_id === v.id).length,
    })).sort((a, b) => b.vistas - a.vistas)

    setFilas(nuevasFilas)
    setCargando(false)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="Tráfico de tus vacantes" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">📈 Tráfico</h2>
        <p className="text-sm text-gray-500 mb-6">Cuántas personas ven tus vacantes y cuántas inician su postulación.</p>

        {agenciasCargadas && agenciasReclutador.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500">No se encontró ninguna agencia activa para tu cuenta — no hay tráfico que mostrar.</p>
          </div>
        ) : (
        <>
        {/* Filtros — mismo patrón visual que el dashboard */}
        <div className="flex flex-wrap gap-3 mb-6">
          {agenciasReclutador.length > 1 && (
            <select
              value={agenciaFiltro}
              onChange={e => setAgenciaFiltro(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            >
              <option value="todas">Todas mis agencias</option>
              {agenciasReclutador.map(a => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          )}
          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value as Periodo)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            {(Object.keys(NOMBRES_PERIODO) as Periodo[]).map(p => (
              <option key={p} value={p}>{NOMBRES_PERIODO[p]}</option>
            ))}
          </select>
        </div>

        {/* 2 tarjetas de total, mismo patrón que ya usa el dashboard (7.43) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">👁️ Vistas de vacante</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalVistas}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">💬 Postulaciones iniciadas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalPostulaciones}</p>
          </div>
        </div>

        {/* Desglose por vacante */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Por vacante</p>
          </div>
          {cargando ? (
            <p className="text-sm text-gray-400 text-center py-10">Cargando...</p>
          ) : filas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Sin tráfico registrado en este periodo</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {filas.map(f => (
                <div key={f.vacanteId} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{f.titulo}</p>
                    <p className="text-xs text-gray-400">{f.empresa}</p>
                  </div>
                  <div className="flex gap-4 flex-shrink-0 text-right">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.vistas}</p>
                      <p className="text-[10px] text-gray-400">vistas</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.postulaciones}</p>
                      <p className="text-[10px] text-gray-400">postulaciones</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  )
}
