'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORES_STATUS: Record<string, string> = {
  vigente: '#1A6B3C',
  pausada: '#D97706',
  cerrada: '#9CA3AF',
}

const ETAPAS_FUNNEL = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado']
const COLORES_COMISION = { pagadas: '#1A6B3C', pendientes: '#D97706', perdidas: '#DC2626' }

export default function DashboardCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const [datosStatus, setDatosStatus] = useState<{ name: string; value: number }[]>([])
  const [datosFunnel, setDatosFunnel] = useState<{ etapa: string; candidatos: number }[]>([])
  const [datosEfectividad, setDatosEfectividad] = useState<{ reclutador: string; colocados: number; noEfectivos: number }[]>([])
  const [datosComisiones, setDatosComisiones] = useState<{ reclutador: string; pagadas: number; pendientes: number; perdidas: number }[]>([])
  const [datosTrafico, setDatosTrafico] = useState<{ name: string; value: number }[]>([])
  const [datosTiempo, setDatosTiempo] = useState<{ vacante: string; dias: number }[]>([])

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
  }, [])

  useEffect(() => {
    if (sesion?.agencia_id) cargarGraficas(sesion.agencia_id)
  }, [sesion, fechaDesde, fechaHasta])

  async function cargarGraficas(agenciaId: string) {
    setLoading(true)
    const supabase = createClient()

    // Gráfica 1 — Vacantes por status
    let queryVacantes = supabase.from('vacantes').select('status, created_at').eq('agencia_id', agenciaId)
    if (fechaDesde) queryVacantes = queryVacantes.gte('created_at', fechaDesde)
    if (fechaHasta) queryVacantes = queryVacantes.lte('created_at', `${fechaHasta}T23:59:59`)
    const { data: vacantesData } = await queryVacantes

    const conteoStatus: Record<string, number> = {}
    ;(vacantesData ?? []).forEach((v: any) => {
      conteoStatus[v.status] = (conteoStatus[v.status] ?? 0) + 1
    })
    setDatosStatus(Object.entries(conteoStatus).map(([name, value]) => ({ name, value })))

    // Gráfica 2 — Embudo de conversión (acumulado: cuántos candidatos LLEGARON
    // a cada etapa alguna vez, no solo los que están ahí hoy — usa historial_etapas)
    let queryPost = supabase.from('postulaciones').select('id, etapa_actual, created_at, reclutador_id, vacante_id, fecha_contratacion, pagado, comision_aplicable, comision_aplicada_mxn, vacantes(titulo)').eq('agencia_id', agenciaId)
    if (fechaDesde) queryPost = queryPost.gte('created_at', fechaDesde)
    if (fechaHasta) queryPost = queryPost.lte('created_at', `${fechaHasta}T23:59:59`)
    const { data: postData } = await queryPost

    const postulacionIds = (postData ?? []).map((p: any) => p.id)
    let historialData: any[] = []
    if (postulacionIds.length > 0) {
      const { data } = await supabase
        .from('historial_etapas')
        .select('postulacion_id, etapa_nueva')
        .in('postulacion_id', postulacionIds)
      historialData = data ?? []
    }

    const funnel = ETAPAS_FUNNEL.map(etapa => {
      const idsQueLlegaron = new Set<string>()
      ;(postData ?? []).forEach((p: any) => {
        if (p.etapa_actual === etapa) idsQueLlegaron.add(p.id)
      })
      historialData.forEach((h: any) => {
        if (h.etapa_nueva === etapa) idsQueLlegaron.add(h.postulacion_id)
      })
      return { etapa, candidatos: idsQueLlegaron.size }
    })
    setDatosFunnel(funnel)

    // Reclutadores de la agencia, para nombrar las barras de las gráficas 3 y 4
    const { data: recData } = await supabase
      .from('reclutador_agencia')
      .select('reclutadores(id, nombre)')
      .eq('agencia_id', agenciaId)
    const reclutadoresLista = (recData ?? []).map((r: any) => r.reclutadores).filter(Boolean)

    // Gráfica 3 — Efectividad por reclutador (mismo criterio de "no efectivo"
    // ya usado en 5.17/5.22: descartado DESPUÉS de haber entrado a Inducción)
    const efectividad = reclutadoresLista.map((r: any) => {
      const propias = (postData ?? []).filter((p: any) => p.reclutador_id === r.id)
      return {
        reclutador: r.nombre,
        colocados: propias.filter((p: any) => p.etapa_actual === 'Contratado').length,
        noEfectivos: propias.filter((p: any) => p.etapa_actual === 'Descartado' && p.fecha_contratacion).length,
      }
    }).filter(r => r.colocados > 0 || r.noEfectivos > 0)
    setDatosEfectividad(efectividad)

    // Gráfica 4 — Comisiones pagadas vs pendientes vs perdidas, por reclutador
    const comisiones = reclutadoresLista.map((r: any) => {
      const propias = (postData ?? []).filter((p: any) => p.reclutador_id === r.id && p.comision_aplicada_mxn)
      const pagadas = propias.filter((p: any) => p.pagado).reduce((s: number, p: any) => s + p.comision_aplicada_mxn, 0)
      const pendientes = propias.filter((p: any) => !p.pagado && p.comision_aplicable).reduce((s: number, p: any) => s + p.comision_aplicada_mxn, 0)
      const perdidas = propias.filter((p: any) => !p.comision_aplicable && p.fecha_contratacion).reduce((s: number, p: any) => s + p.comision_aplicada_mxn, 0)
      return { reclutador: r.nombre, pagadas, pendientes, perdidas }
    }).filter(r => r.pagadas > 0 || r.pendientes > 0 || r.perdidas > 0)
    setDatosComisiones(comisiones)

    // Gráfica 5 — Fuentes de tráfico
    let queryTrafico = supabase.from('trafico_referidos').select('fuente, created_at').eq('agencia_id', agenciaId)
    if (fechaDesde) queryTrafico = queryTrafico.gte('created_at', fechaDesde)
    if (fechaHasta) queryTrafico = queryTrafico.lte('created_at', `${fechaHasta}T23:59:59`)
    const { data: traficoData } = await queryTrafico

    const conteoFuente: Record<string, number> = {}
    ;(traficoData ?? []).forEach((t: any) => {
      const f = t.fuente ?? 'otro'
      conteoFuente[f] = (conteoFuente[f] ?? 0) + 1
    })
    setDatosTrafico(Object.entries(conteoFuente).map(([name, value]) => ({ name, value })))

    // Gráfica 6 — Tiempo promedio de colocación por vacante (desde historial_etapas:
    // días entre que la postulación se creó y el momento en que llegó a "Contratado")
    const idsContratados = (postData ?? []).filter((p: any) => p.etapa_actual === 'Contratado').map((p: any) => p.id)
    let historialContratados: any[] = []
    if (idsContratados.length > 0) {
      const { data } = await supabase
        .from('historial_etapas')
        .select('postulacion_id, created_at')
        .eq('etapa_nueva', 'Contratado')
        .in('postulacion_id', idsContratados)
      historialContratados = data ?? []
    }

    const tiemposPorVacante: Record<string, number[]> = {}
    historialContratados.forEach((h: any) => {
      const postulacion = (postData ?? []).find((p: any) => p.id === h.postulacion_id)
      if (!postulacion) return
      const dias = (new Date(h.created_at).getTime() - new Date(postulacion.created_at).getTime()) / (1000 * 60 * 60 * 24)
      const tituloVacante = (postulacion.vacantes as any)?.titulo ?? 'Sin nombre'
      if (!tiemposPorVacante[tituloVacante]) tiemposPorVacante[tituloVacante] = []
      tiemposPorVacante[tituloVacante].push(dias)
    })
    setDatosTiempo(Object.entries(tiemposPorVacante).map(([vacante, dias]) => ({
      vacante,
      dias: Math.round((dias.reduce((s, d) => s + d, 0) / dias.length) * 10) / 10,
    })))

    setLoading(false)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Desde</label>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]" />
            <label className="text-xs text-gray-500">Hasta</label>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]" />
            {(fechaDesde || fechaHasta) && (
              <button onClick={() => { setFechaDesde(''); setFechaHasta('') }} className="text-xs text-gray-400 hover:text-gray-600">
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/coordinador/vacantes" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">💼</p>
            <p className="font-semibold text-gray-900 text-sm">Vacantes</p>
          </a>
          <a href="/coordinador/reclutadores" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">👥</p>
            <p className="font-semibold text-gray-900 text-sm">Reclutadores</p>
          </a>
          <a href="/coordinador/pipeline" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">📋</p>
            <p className="font-semibold text-gray-900 text-sm">Pipeline</p>
          </a>
          <a href="/coordinador/corte-semanal" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">💰</p>
            <p className="font-semibold text-gray-900 text-sm">Corte semanal</p>
          </a>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando gráficas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gráfica 1 — Vacantes por status */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Vacantes por status</h3>
              {datosStatus.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin vacantes en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={datosStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {datosStatus.map((d, i) => (
                        <Cell key={i} fill={COLORES_STATUS[d.name] ?? '#9CA3AF'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Gráfica 2 — Embudo de conversión */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Embudo de conversión</h3>
              {datosFunnel.every(f => f.candidatos === 0) ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin candidatos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={datosFunnel} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="etapa" width={90} />
                    <Tooltip />
                    <Bar dataKey="candidatos" fill="#1A6B3C" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          {/* Gráfica 3 — Efectividad por reclutador */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Efectividad por reclutador</h3>
              {datosEfectividad.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin datos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={datosEfectividad}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="reclutador" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="colocados" name="Colocados" fill="#1A6B3C" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="noEfectivos" name="No efectivos" fill="#DC2626" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Gráfica 4 — Comisiones pagadas vs pendientes vs perdidas */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Comisiones por reclutador</h3>
              {datosComisiones.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin datos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={datosComisiones}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="reclutador" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString('es-MX')}`} />
                    <Legend />
                    <Bar dataKey="pagadas" name="Pagadas" stackId="a" fill={COLORES_COMISION.pagadas} />
                    <Bar dataKey="pendientes" name="Pendientes" stackId="a" fill={COLORES_COMISION.pendientes} />
                    <Bar dataKey="perdidas" name="Perdidas" stackId="a" fill={COLORES_COMISION.perdidas} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          {/* Gráfica 5 — Fuentes de tráfico */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Fuentes de tráfico</h3>
              {datosTrafico.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin datos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={datosTrafico} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {datosTrafico.map((_, i) => (
                        <Cell key={i} fill={['#1A6B3C', '#D97706', '#2563EB', '#9333EA', '#DC2626', '#6B7280'][i % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Gráfica 6 — Tiempo promedio de colocación por vacante */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Días promedio para colocar (por vacante)</h3>
              {datosTiempo.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin colocaciones registradas en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={datosTiempo} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="vacante" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => `${v} días`} />
                    <Bar dataKey="dias" fill="#1A6B3C" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
