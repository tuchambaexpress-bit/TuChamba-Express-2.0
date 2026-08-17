'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import { obtenerPeriodoCorte, periodoCorteAdyacente } from '@/lib/utils'

interface Efectivo {
  id: string
  reclutador_id: string
  comision_aplicada_mxn: number
  candidatos: { nombre: string } | null
  vacantes: { titulo: string } | null
}

interface NoEfectivo {
  id: string
  reclutador_id: string
  motivo_descarte: string | null
  candidatos: { nombre: string } | null
}

interface Reclutador {
  id: string
  nombre: string
}

const MOTIVOS: Record<string, string> = {
  no_concluyo_induccion: 'No concluyó inducción',
  no_se_presento: 'No se presentó',
  renuncia: 'Renuncia',
  despido_empresa: 'Despido por la empresa',
}

const NOMBRES_DIA: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

export default function CorteSemanal() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<{ inicio: string; fin: string } | null>(null)
  const [diaCorte, setDiaCorte] = useState(4)
  const [diaPago, setDiaPago] = useState(5)
  const [reclutadores, setReclutadores] = useState<Reclutador[]>([])
  const [efectivos, setEfectivos] = useState<Efectivo[]>([])
  const [noEfectivos, setNoEfectivos] = useState<NoEfectivo[]>([])

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarAgenciaYPeriodoInicial(s.agencia_id)
  }, [])

  useEffect(() => {
    if (sesion?.agencia_id && periodo) cargarCorte(sesion.agencia_id, periodo)
  }, [periodo])

  async function cargarAgenciaYPeriodoInicial(agenciaId: string) {
    const supabase = createClient()
    const { data: agencia } = await supabase
      .from('agencias')
      .select('dia_corte, dia_pago')
      .eq('id', agenciaId)
      .single()

    const dc = agencia?.dia_corte ?? 4
    const dp = agencia?.dia_pago ?? 5
    setDiaCorte(dc)
    setDiaPago(dp)
    setPeriodo(obtenerPeriodoCorte(dc))
  }

  async function cargarCorte(agenciaId: string, p: { inicio: string; fin: string }) {
    setLoading(true)
    const supabase = createClient()

    const { data: recData } = await supabase
      .from('reclutador_agencia')
      .select('reclutador_id, reclutadores(id, nombre)')
      .eq('agencia_id', agenciaId)
      .eq('activo', true)
    setReclutadores((recData ?? []).map((r: any) => r.reclutadores).filter(Boolean))

    // Efectivos: comisión aplicable, garantía cumplida DENTRO de este periodo,
    // aún sin pagar. Se usa fecha_garantia_fin (calculada al vuelo), no
    // semana_corte ni garantia_cumplida — ver nota en tasks.md 5.17.
    const { data: efData } = await supabase
      .from('postulaciones')
      .select('id, reclutador_id, comision_aplicada_mxn, candidatos(nombre), vacantes(titulo)')
      .eq('agencia_id', agenciaId)
      .eq('comision_aplicable', true)
      .eq('pagado', false)
      .gte('fecha_garantia_fin', p.inicio)
      .lte('fecha_garantia_fin', p.fin)
    setEfectivos((efData ?? []) as any)

    // No efectivos: cualquier descarte DESPUÉS de haber entrado a Inducción
    // (fecha_contratacion no nulo = sí llegó a esa etapa) — no solo un motivo
    // específico. Un descarte temprano (No cumple perfil, No contesta, etc.,
    // nunca llegó a Inducción) no es relevante para el corte de pago.
    const { data: noEfData } = await supabase
      .from('postulaciones')
      .select('id, reclutador_id, motivo_descarte, candidatos(nombre)')
      .eq('agencia_id', agenciaId)
      .eq('etapa_actual', 'Descartado')
      .not('fecha_contratacion', 'is', null)
      .gte('updated_at', `${p.inicio}T00:00:00`)
      .lte('updated_at', `${p.fin}T23:59:59`)
    setNoEfectivos((noEfData ?? []) as any)

    setLoading(false)
  }

  function cambiarPeriodo(direccion: 'anterior' | 'siguiente') {
    if (!periodo) return
    setPeriodo(periodoCorteAdyacente(periodo.inicio, direccion))
  }

  const esPeriodoActual = periodo?.fin === obtenerPeriodoCorte(diaCorte).fin
  const totalGeneral = efectivos.reduce((sum, e) => sum + (e.comision_aplicada_mxn ?? 0), 0)

  function formatearFecha(f: string) {
    return new Date(f + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Corte semanal" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => cambiarPeriodo('anterior')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm px-3 py-2 rounded-lg"
            >
              ← Anterior
            </button>
            <div className="text-center">
              <p className="font-bold text-gray-900">
                {periodo ? `${formatearFecha(periodo.inicio)} — ${formatearFecha(periodo.fin)}` : '...'}
              </p>
              <p className="text-xs text-gray-400">
                {esPeriodoActual ? 'Periodo actual' : 'Periodo anterior'}
              </p>
            </div>
            <button
              onClick={() => cambiarPeriodo('siguiente')}
              disabled={esPeriodoActual}
              className="bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-sm px-3 py-2 rounded-lg"
            >
              Siguiente →
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Corte: {NOMBRES_DIA[diaCorte] ?? diaCorte} · Pago: {NOMBRES_DIA[diaPago] ?? diaPago}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <p className="text-sm text-gray-500">Total a pagar este periodo</p>
              <p className="text-3xl font-bold text-[#1A6B3C]">${totalGeneral.toLocaleString('es-MX')} MXN</p>
            </div>

            <div className="space-y-4">
              {reclutadores.map(r => {
                const efectivosRec = efectivos.filter(e => e.reclutador_id === r.id)
                const noEfectivosRec = noEfectivos.filter(n => n.reclutador_id === r.id)
                const totalRec = efectivosRec.reduce((sum, e) => sum + (e.comision_aplicada_mxn ?? 0), 0)

                if (efectivosRec.length === 0 && noEfectivosRec.length === 0) return null

                return (
                  <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{r.nombre}</h3>
                      <p className="text-lg font-bold text-[#1A6B3C]">${totalRec.toLocaleString('es-MX')} MXN</p>
                    </div>

                    {efectivosRec.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-700 mb-1">✅ Efectivos ({efectivosRec.length})</p>
                        <ul className="space-y-1">
                          {efectivosRec.map(e => (
                            <li key={e.id} className="text-sm text-gray-700 flex justify-between">
                              <span>{e.candidatos?.nombre} — {e.vacantes?.titulo}</span>
                              <span className="font-medium">${e.comision_aplicada_mxn?.toLocaleString('es-MX')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {noEfectivosRec.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-red-600 mb-1">❌ No efectivos ({noEfectivosRec.length})</p>
                        <ul className="space-y-1">
                          {noEfectivosRec.map(n => (
                            <li key={n.id} className="text-sm text-gray-500">
                              {n.candidatos?.nombre} — {MOTIVOS[n.motivo_descarte ?? ''] ?? n.motivo_descarte}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}

              {efectivos.length === 0 && noEfectivos.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-gray-500 font-medium">Sin movimientos en este periodo</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
