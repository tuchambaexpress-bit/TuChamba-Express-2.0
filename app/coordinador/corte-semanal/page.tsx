'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import * as XLSX from 'xlsx'

interface Pendiente {
  id: string
  reclutador_id: string
  comision_aplicada_mxn: number
  fecha_contratacion: string | null
  fecha_garantia_fin: string | null
  candidatos: { nombre: string } | null
  vacantes: { titulo: string; negocios: { nombre: string } | null } | null
}

interface Reclutador {
  id: string
  nombre: string
}

interface CorteHistorico {
  id: string
  semana: string
  fecha_corte: string
  fecha_pago: string | null
  total_mxn: number
  periodo_inicio: string | null
  periodo_fin: string | null
}

const NOMBRES_DIA: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

export default function CorteSemanal() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [diaCorte, setDiaCorte] = useState(4)
  const [diaPago, setDiaPago] = useState(5)
  const [ultimoCorteAt, setUltimoCorteAt] = useState<string | null>(null)
  const [horaCorte, setHoraCorte] = useState('12:00')
  const [reclutadores, setReclutadores] = useState<Reclutador[]>([])
  const [pendientes, setPendientes] = useState<Pendiente[]>([])
  const [historial, setHistorial] = useState<CorteHistorico[]>([])
  const [generandoCorte, setGenerandoCorte] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarDatos(s.agencia_id)
  }, [])

  async function cargarDatos(agenciaId: string) {
    setLoading(true)
    const supabase = createClient()

    const { data: agencia } = await supabase
      .from('agencias')
      .select('dia_corte, dia_pago, ultimo_corte_at, hora_corte')
      .eq('id', agenciaId)
      .single()
    setDiaCorte(agencia?.dia_corte ?? 4)
    setDiaPago(agencia?.dia_pago ?? 5)
    setUltimoCorteAt(agencia?.ultimo_corte_at ?? null)
    setHoraCorte((agencia?.hora_corte ?? '12:00:00').slice(0, 5))

    const { data: recData } = await supabase
      .from('reclutador_agencia')
      .select('reclutadores(id, nombre)')
      .eq('agencia_id', agenciaId)
    setReclutadores((recData ?? []).map((r: any) => r.reclutadores).filter(Boolean))

    // Pendientes: comisión aplicable, aún sin pagar, garantía cumplida ANTES
    // de hoy (nunca el mismo día — el candidato debe terminar su jornada).
    // No depende de "en qué periodo caiga" — lo pendiente siempre se muestra
    // hasta que se pague, sin importar cambios de día de corte.
    const hoy = hoyLocal()
    const { data: pendData } = await supabase
      .from('postulaciones')
      .select('id, reclutador_id, comision_aplicada_mxn, fecha_contratacion, fecha_garantia_fin, candidatos(nombre), vacantes(titulo, negocios(nombre))')
      .eq('agencia_id', agenciaId)
      .eq('comision_aplicable', true)
      .eq('pagado', false)
      .lt('fecha_garantia_fin', hoy)
    setPendientes((pendData ?? []) as any)

    const { data: historialData } = await supabase
      .from('cortes_semana')
      .select('id, semana, fecha_corte, fecha_pago, total_mxn, periodo_inicio, periodo_fin')
      .eq('agencia_id', agenciaId)
      .order('created_at', { ascending: false })
      .limit(20)
    setHistorial((historialData ?? []) as any)

    setLoading(false)
  }

  function nombreReclutador(id: string) {
    return reclutadores.find(r => r.id === id)?.nombre ?? '—'
  }

  function fechaLocal(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dia}`
  }

  function hoyLocal(): string {
    return fechaLocal(new Date())
  }

  function formatearFecha(f: string | null) {
    if (!f) return '—'
    return new Date(f + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function formatearHora(f: string | null) {
    if (!f) return null
    return new Date(f).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' h'
  }

  // Próxima ocurrencia de un día de la semana (1=Lunes...7=Domingo) desde hoy,
  // solo para mostrar una fecha de pago estimada — informativo.
  function proximaFecha(diaSemana: number, desde: Date): string {
    const diaJS = diaSemana % 7
    const dias = (diaJS - desde.getDay() + 7) % 7
    const fecha = new Date(desde)
    fecha.setDate(desde.getDate() + dias)
    return fechaLocal(fecha)
  }

  function descargarResumen(usados: Pendiente[], total: number, semanaLabel: string) {
    const libro = XLSX.utils.book_new()

    const filasResumen: any[][] = [
      ['Corte — Tu Chamba Express'],
      ['Generado', semanaLabel],
      ['Total', total],
      [],
      ['Reclutador', 'Candidatos', 'Total comisión (MXN)'],
    ]
    reclutadores.forEach(r => {
      const propios = usados.filter(p => p.reclutador_id === r.id)
      if (propios.length === 0) return
      const totalRec = propios.reduce((s, p) => s + (p.comision_aplicada_mxn ?? 0), 0)
      filasResumen.push([r.nombre, propios.length, totalRec])
    })
    filasResumen.push([])
    filasResumen.push(['TOTAL', usados.length, total])
    XLSX.utils.book_append_sheet(libro, XLSX.utils.aoa_to_sheet(filasResumen), 'Resumen')

    const filasDetalle = usados.map(p => ({
      Reclutador: nombreReclutador(p.reclutador_id),
      Candidato: p.candidatos?.nombre ?? '',
      Empresa: p.vacantes?.negocios?.nombre ?? '',
      Vacante: p.vacantes?.titulo ?? '',
      'Fecha de inducción': formatearFecha(p.fecha_contratacion),
      'Garantía cumplida': formatearFecha(p.fecha_garantia_fin),
      'Comisión (MXN)': p.comision_aplicada_mxn ?? 0,
    }))
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(filasDetalle), 'Pagados')

    XLSX.writeFile(libro, `corte_${hoyLocal()}.xlsx`)
  }

  async function descargarCorteHistorico(corte: CorteHistorico) {
    const supabase = createClient()
    const { data } = await supabase
      .from('postulaciones')
      .select('reclutador_id, comision_aplicada_mxn, fecha_contratacion, fecha_garantia_fin, candidatos(nombre), vacantes(titulo, negocios(nombre))')
      .eq('corte_id', corte.id)

    const usados = (data ?? []) as any as Pendiente[]
    if (usados.length === 0) {
      alert('No se encontró el detalle de este corte (probablemente generado antes de esta función).')
      return
    }
    descargarResumen(usados, corte.total_mxn, corte.semana)
  }

  async function descargarTodoHistorico() {
    const supabase = createClient()
    const { data } = await supabase
      .from('postulaciones')
      .select('corte_id, reclutador_id, comision_aplicada_mxn, fecha_contratacion, fecha_garantia_fin, candidatos(nombre), vacantes(titulo, negocios(nombre))')
      .eq('agencia_id', sesion.agencia_id)
      .not('corte_id', 'is', null)

    if (!data || data.length === 0) {
      alert('No hay cortes con detalle disponible para descargar.')
      return
    }

    const filas = data.map((p: any) => ({
      Corte: historial.find(h => h.id === p.corte_id)?.semana ?? p.corte_id,
      Reclutador: nombreReclutador(p.reclutador_id),
      Candidato: p.candidatos?.nombre ?? '',
      Empresa: p.vacantes?.negocios?.nombre ?? '',
      Vacante: p.vacantes?.titulo ?? '',
      'Fecha de inducción': formatearFecha(p.fecha_contratacion),
      'Garantía cumplida': formatearFecha(p.fecha_garantia_fin),
      'Comisión (MXN)': p.comision_aplicada_mxn ?? 0,
    }))
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(filas), 'Histórico completo')
    XLSX.writeFile(libro, `historico_cortes_${hoyLocal()}.xlsx`)
  }

  async function generarCorte() {
    if (!sesion) return
    const supabase = createClient()

    // Vuelve a consultar justo antes de generar, para no usar datos viejos
    const hoy = hoyLocal()
    const { data: pendFrescos } = await supabase
      .from('postulaciones')
      .select('id, reclutador_id, comision_aplicada_mxn, fecha_contratacion, fecha_garantia_fin, candidatos(nombre), vacantes(titulo, negocios(nombre))')
      .eq('agencia_id', sesion.agencia_id)
      .eq('comision_aplicable', true)
      .eq('pagado', false)
      .lt('fecha_garantia_fin', hoy)

    const usados = (pendFrescos ?? []) as any as Pendiente[]
    if (usados.length === 0) {
      alert('No hay comisiones pendientes de pagar en este momento.')
      return
    }

    const total = usados.reduce((s, p) => s + (p.comision_aplicada_mxn ?? 0), 0)
    const confirmado = window.confirm(
      `¿Generar corte? ${usados.length} comisión(es), total $${total.toLocaleString('es-MX')} MXN. Se marcarán como pagadas.`
    )
    if (!confirmado) return

    setGenerandoCorte(true)

    const desde = ultimoCorteAt ? new Date(ultimoCorteAt) : new Date(usados[usados.length - 1]?.fecha_garantia_fin ?? hoy)
    const semanaLabel = `${formatearFecha(fechaLocal(desde))} — ${formatearFecha(hoy)}`
    const fechaPagoEstimada = proximaFecha(diaPago, new Date())

    const { data: corteCreado } = await supabase
      .from('cortes_semana')
      .insert({
        agencia_id: sesion.agencia_id,
        semana: semanaLabel,
        fecha_corte: hoy,
        fecha_pago: fechaPagoEstimada,
        total_mxn: total,
        pagado: true,
        generado_por: sesion.id,
        periodo_inicio: desde.toISOString(),
        periodo_fin: new Date().toISOString(),
      })
      .select('id')
      .single()

    await supabase
      .from('postulaciones')
      .update({ pagado: true, corte_id: corteCreado?.id ?? null })
      .in('id', usados.map(p => p.id))

    await supabase
      .from('agencias')
      .update({ ultimo_corte_at: new Date().toISOString() })
      .eq('id', sesion.agencia_id)

    descargarResumen(usados, total, semanaLabel)
    setGenerandoCorte(false)
    cargarDatos(sesion.agencia_id)
  }

  const hoyEsDiaCorte = new Date().getDay() === (diaCorte % 7)
  const mostrarAviso = hoyEsDiaCorte && pendientes.length > 0
  const totalPendiente = pendientes.reduce((s, p) => s + (p.comision_aplicada_mxn ?? 0), 0)

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Corte semanal" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Corte semanal</h2>
          <p className="text-xs text-gray-400">
            Corte: {NOMBRES_DIA[diaCorte] ?? diaCorte} {horaCorte} · Pago: {NOMBRES_DIA[diaPago] ?? diaPago} <span className="text-gray-300">(solo recordatorio)</span>
          </p>
        </div>

        {mostrarAviso && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <p className="text-sm text-amber-800">
              📅 Hoy es tu día de corte configurado ({NOMBRES_DIA[diaCorte]}). Tienes {pendientes.length} comisión(es) pendientes de generar.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-500">Pendiente de generar</p>
                  <p className="text-3xl font-bold text-[#1A6B3C]">${totalPendiente.toLocaleString('es-MX')} MXN</p>
                  <p className="text-xs text-gray-400 mt-1">{pendientes.length} comisión(es) — desde {ultimoCorteAt ? formatearFecha(ultimoCorteAt.split('T')[0]) : 'siempre'}</p>
                </div>
                <button
                  onClick={generarCorte}
                  disabled={generandoCorte || pendientes.length === 0}
                  className="bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white text-sm px-5 py-2.5 rounded-lg font-medium"
                >
                  {generandoCorte ? 'Generando...' : '✅ Generar Corte'}
                </button>
              </div>
            </div>

            {pendientes.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Detalle de lo pendiente</h3>
                <div className="space-y-3">
                  {reclutadores.map(r => {
                    const propios = pendientes.filter(p => p.reclutador_id === r.id)
                    if (propios.length === 0) return null
                    const totalRec = propios.reduce((s, p) => s + (p.comision_aplicada_mxn ?? 0), 0)
                    return (
                      <div key={r.id}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900">{r.nombre}</p>
                          <p className="text-sm font-medium text-[#1A6B3C]">${totalRec.toLocaleString('es-MX')}</p>
                        </div>
                        <ul className="space-y-0.5">
                          {propios.map(p => (
                            <li key={p.id} className="text-xs text-gray-600 flex justify-between">
                              <span>{p.candidatos?.nombre} — {p.vacantes?.titulo}</span>
                              <span>${p.comision_aplicada_mxn?.toLocaleString('es-MX')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-gray-900">Historial de cortes</h3>
                {historial.length > 0 && (
                  <button
                    onClick={descargarTodoHistorico}
                    className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    📥 Descargar todo
                  </button>
                )}
              </div>
              {historial.length === 0 ? (
                <p className="text-sm text-gray-400 p-5">Aún no se ha generado ningún corte.</p>
              ) : (
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                      <th className="px-5 py-2 font-medium">Periodo</th>
                      <th className="px-5 py-2 font-medium">Fecha de pago (estimada)</th>
                      <th className="px-5 py-2 font-medium">Total</th>
                      <th className="px-5 py-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map(c => {
                      const horaInicio = formatearHora(c.periodo_inicio)
                      const horaFin = formatearHora(c.periodo_fin)
                      return (
                        <tr key={c.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-5 py-3 text-gray-700">
                            <p>{c.semana}</p>
                            {(horaInicio || horaFin) && (
                              <p className="text-xs text-gray-500 mt-0.5">🕐 {horaInicio ?? '—'}&nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp;{horaFin ?? '—'}</p>
                            )}
                          </td>
                          <td className="px-5 py-3 text-gray-500">{formatearFecha(c.fecha_pago)}</td>
                          <td className="px-5 py-3 font-medium text-gray-900">${c.total_mxn?.toLocaleString('es-MX')}</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => descargarCorteHistorico(c)}
                              className="text-xs text-gray-500 hover:text-[#1A6B3C]"
                            >
                              📥
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
