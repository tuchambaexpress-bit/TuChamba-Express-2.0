'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAlertas } from '@/hooks/useAlertas'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'
import ModalQRReferido from '@/components/reclutador/ModalQRReferido'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const ETAPAS_FUNNEL = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado']

type FiltroCorte = 'corte_abierto' | 'corte_anterior' | 'mes_actual' | 'mes_anterior'

interface AgenciaReclutador {
  id: string
  nombre: string
}

interface CandidatoCorte {
  nombre: string
  vacante: string
  monto: number
}

export default function DashboardReclutador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [copiadoRef, setCopiadoRef] = useState(false)
  const [mostrarQR, setMostrarQR] = useState(false)
  useAlertas(sesion?.id ?? null)
  const [filtro, setFiltro] = useState<'semana' | 'mes' | 'todo'>('mes')
  const supabase = createClient()

  const [metricas, setMetricas] = useState({
    candidatosActivos: 0,
    colocadosMes: 0,
    comisionEstimada: 0,
    chatsNuevos: 0
  })

  // 4.12d — KPIs personales del reclutador, con su propio filtro (agencia +
  // periodo). "Mes actual/anterior" muestra el embudo (cohorte por fecha de
  // aplicación). "Corte abierto/anterior" muestra un resumen de DINERO real
  // (mismo criterio que corte-semanal/page.tsx) — un corte es un concepto de
  // pago, no de embudo, forzarlo a las 5 etapas generaba números que no
  // representaban nada real (decisión de José, 2026-08-23).
  const [agenciasReclutador, setAgenciasReclutador] = useState<AgenciaReclutador[]>([])
  const [agenciaFiltro, setAgenciaFiltro] = useState<string>('todas')
  const [filtroCorte, setFiltroCorte] = useState<FiltroCorte>('corte_abierto')
  const [cargandoNumeros, setCargandoNumeros] = useState(true)
  const [sinCorteAnterior, setSinCorteAnterior] = useState(false)

  const [datosFunnel, setDatosFunnel] = useState<{ etapa: string; candidatos: number }[]>([])
  const [datosTrafico, setDatosTrafico] = useState<{ name: string; value: number }[]>([])
  const [totalVistasVacante, setTotalVistasVacante] = useState(0)
  const [totalClicsPostularme, setTotalClicsPostularme] = useState(0)
  const [datosTiempo, setDatosTiempo] = useState<{ vacante: string; dias: number }[]>([])
  const [tasaInasistencia, setTasaInasistencia] = useState<{ inasistencias: number; entrevistas: number }>({ inasistencias: 0, entrevistas: 0 })
  const [resumenCorte, setResumenCorte] = useState<{ candidatos: CandidatoCorte[]; total: number } | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) {
      router.push('/reclutador/login')
      return
    }
    const s = JSON.parse(data)
    setSesion(s)
    cargarMetricas(s.id, filtro)
    cargarAgenciasReclutador(s.id)

    const canal = supabase
      .channel('dashboard-chats')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
        filter: `reclutador_id=eq.${s.id}`
      }, () => {
        cargarMetricas(s.id)
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [])

  useEffect(() => {
    if (sesion) cargarMetricas(sesion.id, filtro)
  }, [filtro, sesion])

  useEffect(() => {
    if (!sesion || agenciasReclutador.length === 0) return
    if (filtroCorte === 'corte_abierto' || filtroCorte === 'corte_anterior') {
      cargarResumenCorte(sesion.id, agenciaFiltro, filtroCorte)
    } else {
      cargarNumerosPersonales(sesion.id, agenciaFiltro, filtroCorte)
    }
  }, [sesion, agenciasReclutador, agenciaFiltro, filtroCorte])

  async function cargarAgenciasReclutador(reclutadorId: string) {
    const { data } = await supabase
      .from('reclutador_agencia')
      .select('agencias(id, nombre)')
      .eq('reclutador_id', reclutadorId)
      .eq('activo', true)

    const lista = (data ?? []).map((r: any) => r.agencias).filter(Boolean) as AgenciaReclutador[]
    setAgenciasReclutador(lista)
    if (lista.length === 1) setAgenciaFiltro(lista[0].id)
  }

  async function cargarMetricas(reclutadorId: string, periodo: 'semana' | 'mes' | 'todo' = 'mes') {
    const supabase = createClient()
    const ahora = new Date()
    let fechaInicio: string | null = null

    if (periodo === 'mes') {
      const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
      fechaInicio = inicio.toISOString().split('T')[0]
    } else if (periodo === 'semana') {
      const { data: agenciaData } = await supabase
        .from('reclutador_agencia')
        .select('agencias(dia_corte)')
        .eq('reclutador_id', reclutadorId)
        .eq('activo', true)
        .single()

      const diaCorte = (agenciaData?.agencias as any)?.dia_corte ?? 4
      const diaSemanaActual = ahora.getDay() === 0 ? 7 : ahora.getDay()
      const diasDesdeCorte = (diaSemanaActual - diaCorte + 7) % 7
      const inicio = new Date(ahora)
      inicio.setDate(ahora.getDate() - diasDesdeCorte)
      inicio.setHours(0, 0, 0, 0)
      fechaInicio = inicio.toISOString().split('T')[0]
    }

    const { count: activos } = await supabase
      .from('postulaciones')
      .select('*', { count: 'exact', head: true })
      .eq('reclutador_id', reclutadorId)
      .not('etapa_actual', 'in', '("Descartado","Contratado")')

    let colocadosQuery = supabase
      .from('postulaciones')
      .select('*', { count: 'exact', head: true })
      .eq('reclutador_id', reclutadorId)
      .eq('etapa_actual', 'Contratado')

    if (fechaInicio) colocadosQuery = colocadosQuery.gte('fecha_contratacion', fechaInicio)
    const { count: colocados } = await colocadosQuery

    // "Comisión estimada" — mismo criterio que "Pendiente de generar" en
    // corte-semanal/page.tsx. Nunca garantia_cumplida (campo muerto).
    const hoyStr = new Date().toISOString().split('T')[0]
    const { data: comisiones } = await supabase
      .from('postulaciones')
      .select('comision_aplicada_mxn')
      .eq('reclutador_id', reclutadorId)
      .eq('comision_aplicable', true)
      .eq('pagado', false)
      .lt('fecha_garantia_fin', hoyStr)

    const totalComision = comisiones?.reduce((sum, p) => sum + (p.comision_aplicada_mxn ?? 0), 0) ?? 0

    const { count: chatsNuevos } = await supabase
      .from('chats')
      .select('*', { count: 'exact', head: true })
      .eq('reclutador_id', reclutadorId)
      .eq('leido_reclutador', false)

    setMetricas({
      candidatosActivos: activos ?? 0,
      colocadosMes: colocados ?? 0,
      comisionEstimada: totalComision,
      chatsNuevos: chatsNuevos ?? 0
    })
  }

  function rangoDeMes(tipo: 'mes_actual' | 'mes_anterior'): { desde: string; hasta: string } {
    const ahora = new Date()
    if (tipo === 'mes_actual') {
      const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
      return { desde: inicio.toISOString(), hasta: ahora.toISOString() }
    }
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
    const fin = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59)
    return { desde: inicio.toISOString(), hasta: fin.toISOString() }
  }

  // Embudo/fuentes/tiempo/inasistencia — SOLO para Mes actual/anterior.
  // Cohorte por fecha de aplicación (postulaciones.created_at dentro del mes).
  async function cargarNumerosPersonales(reclutadorId: string, agenciaSel: string, tipo: 'mes_actual' | 'mes_anterior') {
    setCargandoNumeros(true)
    const rango = rangoDeMes(tipo)
    const agenciaIds = agenciaSel === 'todas' ? agenciasReclutador.map(a => a.id) : [agenciaSel]

    let postulacionesTotal: any[] = []
    let traficoTotal: any[] = []

    for (const agId of agenciaIds) {
      const { data: postData } = await supabase
        .from('postulaciones')
        .select('id, etapa_actual, created_at, fecha_contratacion, motivo_descarte, vacantes(titulo)')
        .eq('reclutador_id', reclutadorId)
        .eq('agencia_id', agId)
        .gte('created_at', rango.desde)
        .lte('created_at', rango.hasta)
      postulacionesTotal.push(...(postData ?? []))

      const { data: traficoData } = await supabase
        .from('trafico_referidos')
        .select('fuente, tipo_evento, created_at')
        .eq('reclutador_id', reclutadorId)
        .eq('agencia_id', agId)
        .gte('created_at', rango.desde)
        .lte('created_at', rango.hasta)
      traficoTotal.push(...(traficoData ?? []))
    }

    const idsPropias = postulacionesTotal.map((p: any) => p.id)
    let historialPropio: any[] = []
    if (idsPropias.length > 0) {
      const { data } = await supabase
        .from('historial_etapas')
        .select('postulacion_id, etapa_nueva, created_at')
        .in('postulacion_id', idsPropias)
      historialPropio = data ?? []
    }

    const funnel = ETAPAS_FUNNEL.map(etapa => {
      const idsQueLlegaron = new Set<string>()
      postulacionesTotal.forEach((p: any) => { if (p.etapa_actual === etapa) idsQueLlegaron.add(p.id) })
      historialPropio.forEach((h: any) => { if (h.etapa_nueva === etapa) idsQueLlegaron.add(h.postulacion_id) })
      return { etapa, candidatos: idsQueLlegaron.size }
    })
    setDatosFunnel(funnel)

    const entrevistasAlgunavez = new Set(historialPropio.filter((h: any) => h.etapa_nueva === 'Entrevista').map((h: any) => h.postulacion_id))
    const inasistencias = postulacionesTotal.filter((p: any) => entrevistasAlgunavez.has(p.id) && p.motivo_descarte === 'no_se_presento').length
    setTasaInasistencia({ inasistencias, entrevistas: entrevistasAlgunavez.size })

    // Fuentes de tráfico — filtra tipo_evento='visita' (7.43). Sin esto,
    // mezclaría los clics nuevos de "ver_vacante"/"postularme" con las
    // cargas de página reales, inflando la dona de proporciones.
    const conteoFuente: Record<string, number> = {}
    traficoTotal
      .filter((t: any) => (t.tipo_evento ?? 'visita') === 'visita')
      .forEach((t: any) => {
        const f = t.fuente ?? 'otro'
        conteoFuente[f] = (conteoFuente[f] ?? 0) + 1
      })
    setDatosTrafico(Object.entries(conteoFuente).map(([name, value]) => ({ name, value })))

    // Contador propio (7.43) — "ver detalle de vacante" y clic en
    // "Postularme", del mismo traficoTotal ya descargado (sin consultas
    // extra por agencia). Números totales agregados del periodo.
    setTotalVistasVacante(traficoTotal.filter((t: any) => t.tipo_evento === 'ver_vacante').length)
    setTotalClicsPostularme(traficoTotal.filter((t: any) => t.tipo_evento === 'postularme').length)

    const idsContratadosPropios = postulacionesTotal.filter((p: any) => p.etapa_actual === 'Contratado').map((p: any) => p.id)
    let historialContratadosPropio: any[] = []
    if (idsContratadosPropios.length > 0) {
      const { data } = await supabase
        .from('historial_etapas')
        .select('postulacion_id, created_at')
        .eq('etapa_nueva', 'Contratado')
        .in('postulacion_id', idsContratadosPropios)
      historialContratadosPropio = data ?? []
    }

    const tiemposPorVacantePropia: Record<string, number[]> = {}
    historialContratadosPropio.forEach((h: any) => {
      const postulacion = postulacionesTotal.find((p: any) => p.id === h.postulacion_id)
      if (!postulacion) return
      const dias = Math.round((new Date(h.created_at).getTime() - new Date(postulacion.created_at).getTime()) / (1000 * 60 * 60 * 24))
      const titulo = (postulacion.vacantes as any)?.titulo ?? 'Vacante'
      if (!tiemposPorVacantePropia[titulo]) tiemposPorVacantePropia[titulo] = []
      tiemposPorVacantePropia[titulo].push(dias)
    })
    setDatosTiempo(Object.entries(tiemposPorVacantePropia).map(([vacante, dias]) => ({
      vacante,
      dias: Math.round(dias.reduce((s, d) => s + d, 0) / dias.length)
    })))

    setCargandoNumeros(false)
  }

  // Resumen de DINERO real — SOLO para Corte abierto/anterior. Mismo
  // criterio exacto que corte-semanal/page.tsx, nada de fecha de aplicación.
  async function cargarResumenCorte(reclutadorId: string, agenciaSel: string, tipo: 'corte_abierto' | 'corte_anterior') {
    setCargandoNumeros(true)
    setSinCorteAnterior(false)

    const agenciaIds = agenciaSel === 'todas' ? agenciasReclutador.map(a => a.id) : [agenciaSel]
    const candidatos: CandidatoCorte[] = []
    let algunaAgenciaConCorte = false

    for (const agId of agenciaIds) {
      if (tipo === 'corte_abierto') {
        const hoyStr = new Date().toISOString().split('T')[0]
        const { data } = await supabase
          .from('postulaciones')
          .select('comision_aplicada_mxn, candidatos(nombre), vacantes(titulo)')
          .eq('reclutador_id', reclutadorId)
          .eq('agencia_id', agId)
          .eq('comision_aplicable', true)
          .eq('pagado', false)
          .lt('fecha_garantia_fin', hoyStr)

        ;(data ?? []).forEach((p: any) => {
          candidatos.push({
            nombre: p.candidatos?.nombre ?? 'Candidato',
            vacante: p.vacantes?.titulo ?? 'Vacante',
            monto: p.comision_aplicada_mxn ?? 0,
          })
        })
        algunaAgenciaConCorte = true // "corte abierto" siempre existe conceptualmente
      } else {
        const { data: corte } = await supabase
          .from('cortes_semana')
          .select('id')
          .eq('agencia_id', agId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (!corte) continue
        algunaAgenciaConCorte = true

        const { data } = await supabase
          .from('postulaciones')
          .select('comision_aplicada_mxn, candidatos(nombre), vacantes(titulo)')
          .eq('reclutador_id', reclutadorId)
          .eq('corte_id', corte.id)

        ;(data ?? []).forEach((p: any) => {
          candidatos.push({
            nombre: p.candidatos?.nombre ?? 'Candidato',
            vacante: p.vacantes?.titulo ?? 'Vacante',
            monto: p.comision_aplicada_mxn ?? 0,
          })
        })
      }
    }

    if (tipo === 'corte_anterior' && !algunaAgenciaConCorte) {
      setSinCorteAnterior(true)
      setResumenCorte(null)
      setCargandoNumeros(false)
      return
    }

    const total = candidatos.reduce((s, c) => s + c.monto, 0)
    setResumenCorte({ candidatos, total })
    setCargandoNumeros(false)
  }

  if (!sesion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReclutadorNav />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-center text-gray-400 text-sm py-10">Cargando...</p>
        </div>
      </div>
    )
  }

  const etiquetasFiltroCorte: Record<FiltroCorte, string> = {
    corte_abierto: 'Corte abierto',
    corte_anterior: 'Corte anterior',
    mes_actual: 'Mes actual',
    mes_anterior: 'Mes anterior',
  }

  const esVistaCorte = filtroCorte === 'corte_abierto' || filtroCorte === 'corte_anterior'

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo={`Hola, ${sesion.nombre}`} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtro de período — métricas básicas */}
        <div className="flex gap-2 mb-4">
          {(['semana', 'mes', 'todo'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFiltro(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filtro === p
                  ? 'bg-[#1A6B3C] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p === 'semana' ? 'Esta semana' : p === 'mes' ? 'Este mes' : 'Todo'}
            </button>
          ))}
        </div>

        {/* Link de referido */}
        <div className="bg-[#1A6B3C] rounded-2xl p-4 mb-6 text-white">
          <p className="text-sm font-semibold mb-1">🔗 Tu link de referido</p>
          <p className="text-xs text-green-200 mb-3">Comparte este link para que los candidatos queden vinculados a ti automáticamente</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/20 rounded-lg px-3 py-2 text-xs text-white truncate">
              tuchambaexpress.com?ref={sesion.token_referido}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://tu-chamba-express.vercel.app'}?ref=${sesion.token_referido}`)
                setCopiadoRef(true)
                setTimeout(() => setCopiadoRef(false), 2000)
              }}
              className="bg-white text-[#1A6B3C] font-semibold text-xs px-3 py-2 rounded-lg flex-shrink-0"
            >
              {copiadoRef ? '✓ Copiado' : 'Copiar'}
            </button>
            <button
              onClick={() => setMostrarQR(true)}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-3 py-2 rounded-lg flex-shrink-0 flex items-center gap-1.5"
            >
              <img src="/QR_logo.jpg" alt="" className="w-4 h-4 rounded-sm" />
              QR
            </button>
          </div>
        </div>

        {mostrarQR && (
          <ModalQRReferido
            url={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://tu-chamba-express.vercel.app'}?ref=${sesion.token_referido}`}
            onClose={() => setMostrarQR(false)}
          />
        )}

        {/* Métricas básicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Candidatos activos</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.candidatosActivos}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Colocados este mes</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.colocadosMes}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Comisión estimada</p>
            <p className="text-2xl font-bold text-[#1A6B3C]">${metricas.comisionEstimada.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Chats sin leer</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.chatsNuevos}</p>
          </div>
        </div>

        {/* 4.12d — Tus números */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="font-bold text-gray-900">📊 Tus números</h2>
          <div className="flex flex-wrap gap-2 items-center">
            {agenciasReclutador.length > 1 && (
              <select
                value={agenciaFiltro}
                onChange={e => setAgenciaFiltro(e.target.value)}
                className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              >
                <option value="todas">Todas mis agencias</option>
                {agenciasReclutador.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              {(Object.keys(etiquetasFiltroCorte) as FiltroCorte[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltroCorte(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filtroCorte === f
                      ? 'bg-[#1A6B3C] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {etiquetasFiltroCorte[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {esVistaCorte ? (
          sinCorteAnterior ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm mb-8">
              <p className="text-sm text-gray-400">
                {agenciaFiltro === 'todas' ? 'Ninguna de tus agencias' : 'Esta agencia'} ha generado un corte todavía.
              </p>
            </div>
          ) : cargandoNumeros ? (
            <div className="text-center py-10 text-gray-400 mb-8">Cargando...</div>
          ) : (
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">
                  {filtroCorte === 'corte_abierto' ? 'Pendiente de tu próximo corte' : 'Tu último corte pagado'}
                </h3>
                <p className="text-2xl font-bold text-[#1A6B3C]">${(resumenCorte?.total ?? 0).toLocaleString('es-MX')}</p>
              </div>
              {(!resumenCorte || resumenCorte.candidatos.length === 0) ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  {filtroCorte === 'corte_abierto' ? 'Sin comisiones pendientes en este momento.' : 'Sin candidatos en ese corte.'}
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {resumenCorte.candidatos.map((c, i) => (
                    <li key={i} className="text-sm text-gray-600 flex justify-between border-b border-gray-50 pb-1.5 last:border-0">
                      <span>{c.nombre} — {c.vacante}</span>
                      <span className="font-medium text-gray-900">${c.monto.toLocaleString('es-MX')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        ) : cargandoNumeros ? (
          <div className="text-center py-10 text-gray-400 mb-8">Cargando tus números...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Tu embudo de conversión</h3>
              {datosFunnel.every(f => f.candidatos === 0) ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin candidatos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
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

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Tus fuentes de tráfico</h3>
              <p className="text-xs text-gray-400 mb-2">De dónde llega la gente que usa tu link (?ref={sesion.token_referido})</p>
              {datosTrafico.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin datos en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={datosTrafico} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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

            {/* Contadores propios (7.43) — vistas de vacante y clics en
                Postularme, del tráfico que llegó por tu link. Celdas
                directas de esta misma rejilla, sin grid anidado. */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">👁️ Vistas de vacante</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalVistasVacante}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">💬 Postulaciones iniciadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalClicsPostularme}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Tu tiempo promedio de colocación</h3>
              {datosTiempo.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin colocaciones en este periodo</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
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

            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-center">
              <h3 className="font-bold text-gray-900 mb-3">Tasa de inasistencia a entrevista</h3>
              {tasaInasistencia.entrevistas === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Sin entrevistas agendadas en este periodo</p>
              ) : (
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-gray-900">
                    {Math.round((tasaInasistencia.inasistencias / tasaInasistencia.entrevistas) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {tasaInasistencia.inasistencias} de {tasaInasistencia.entrevistas} candidatos citados no se presentaron
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guía de inicio rápido para reclutadores nuevos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">🚀 Guía de inicio rápido</h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Revisa las vacantes activas</p>
                <p className="text-gray-500 text-xs">Ve al Pipeline para ver las vacantes que puedes trabajar</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Comparte tu link de referido</p>
                <p className="text-gray-500 text-xs">tuchambaexpress.com?ref={sesion.token_referido}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Da seguimiento a tus candidatos</p>
                <p className="text-gray-500 text-xs">Revisa los chats y mueve candidatos en el pipeline</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Cobra tu comisión</p>
                <p className="text-gray-500 text-xs">Los cortes son los jueves, pago los viernes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
