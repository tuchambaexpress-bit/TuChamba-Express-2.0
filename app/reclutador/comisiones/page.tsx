'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getSemanaISO } from '@/lib/utils'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

interface Comision {
  id: string
  etapa_actual: string
  fecha_contratacion: string
  fecha_garantia_fin: string
  comision_aplicada_mxn: number
  garantia_cumplida: boolean
  pagado: boolean
  semana_corte: string
  candidatos: { nombre: string; telefono: string }
  vacantes: { titulo: string }
}

export default function ComisionesReclutador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'pendientes' | 'cobradas' | 'todas'>('pendientes')

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarComisiones(s.id)
  }, [])

  async function cargarComisiones(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('postulaciones')
      .select(`
        id, etapa_actual, fecha_contratacion, fecha_garantia_fin,
        comision_aplicada_mxn, garantia_cumplida, pagado, semana_corte,
        candidatos(nombre, telefono),
        vacantes(titulo)
      `)
      .eq('reclutador_id', reclutadorId)
      .eq('comision_aplicable', true)
      .order('fecha_contratacion', { ascending: false })

    if (data) setComisiones(data as any)

    // Obtener día de pago de la agencia
    const { data: agenciaData } = await supabase
      .from('reclutador_agencia')
      .select('agencias(dia_pago)')
      .eq('reclutador_id', reclutadorId)
      .eq('activo', true)
      .single()

    const dp = (agenciaData?.agencias as any)?.dia_pago ?? 5
    setDiaPago(DIAS[dp] ?? 'viernes')

    setLoading(false)
  }

  const comisionesFiltradas = comisiones.filter(c => {
    if (filtro === 'pendientes') return !c.pagado
    if (filtro === 'cobradas') return c.pagado
    return true
  })

  const totalPendiente = comisiones
    .filter(c => !c.pagado && garantiaYaCumplida(c.fecha_garantia_fin))
    .reduce((sum, c) => sum + (c.comision_aplicada_mxn ?? 0), 0)

  const totalEnGarantia = comisiones
    .filter(c => !c.pagado && !garantiaYaCumplida(c.fecha_garantia_fin))
    .reduce((sum, c) => sum + (c.comision_aplicada_mxn ?? 0), 0)

  const totalCobrado = comisiones
    .filter(c => c.pagado)
    .reduce((sum, c) => sum + (c.comision_aplicada_mxn ?? 0), 0)

  const semanaActual = getSemanaISO()
  const [diaPago, setDiaPago] = useState<string>('viernes')

  // garantia_cumplida y semana_corte nunca se actualizan automáticamente
  // (mismo hueco detectado en 5.1c y confirmado de nuevo en 5.17) — se
  // calcula en vivo comparando fecha_garantia_fin contra hoy.
  function garantiaYaCumplida(fechaGarantiaFin: string | null): boolean {
    if (!fechaGarantiaFin) return false
    return new Date(fechaGarantiaFin + 'T00:00:00') <= new Date()
  }

  const DIAS: Record<number, string> = {
    1: 'lunes', 2: 'martes', 3: 'miércoles', 
    4: 'jueves', 5: 'viernes', 6: 'sábado', 7: 'domingo'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="Mis comisiones" />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Por cobrar</p>
            <p className="text-xl font-bold text-[#1A6B3C]">${totalPendiente.toLocaleString('es-MX')}</p>
            <p className="text-xs text-gray-400">garantía cumplida · pago cada {diaPago}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">En garantía</p>
            <p className="text-xl font-bold text-amber-600">${totalEnGarantia.toLocaleString('es-MX')}</p>
            <p className="text-xs text-gray-400">pendiente de cumplir</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Total cobrado</p>
            <p className="text-xl font-bold text-gray-900">${totalCobrado.toLocaleString('es-MX')}</p>
            <p className="text-xs text-gray-400">histórico</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          {(['pendientes', 'cobradas', 'todas'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filtro === f
                  ? 'bg-[#1A6B3C] text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f === 'pendientes' ? 'Pendientes' : f === 'cobradas' ? 'Cobradas' : 'Todas'}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : comisionesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">💰</p>
            <p className="text-gray-500">No hay comisiones en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comisionesFiltradas.map(c => {
              const diasRestantes = c.fecha_garantia_fin
                ? Math.ceil((new Date(c.fecha_garantia_fin).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null
              const cumplida = garantiaYaCumplida(c.fecha_garantia_fin)
              // "Esta semana" = la semana calendario donde cae fecha_garantia_fin,
              // no el semana_corte guardado (ese se graba al INICIO de inducción)
              const esEstaSemana = c.fecha_garantia_fin ? getSemanaISO(new Date(c.fecha_garantia_fin + 'T00:00:00')) === semanaActual : false

              return (
                <div key={c.id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                  c.pagado ? 'border-l-gray-300' :
                  cumplida ? 'border-l-[#1A6B3C]' :
                  'border-l-amber-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{(c.candidatos as any)?.nombre}</p>
                      <p className="text-xs text-[#1A6B3C]">{(c.vacantes as any)?.titulo}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Contratado: {c.fecha_contratacion ? new Date(c.fecha_contratacion).toLocaleDateString('es-MX') : '—'}
                      </p>
                      {!cumplida && diasRestantes !== null && (
                        <p className={`text-xs mt-1 font-medium ${diasRestantes <= 3 ? 'text-red-500' : 'text-amber-600'}`}>
                          ⏳ {diasRestantes > 0 ? `${diasRestantes} días para cumplir garantía` : 'Garantía vencida'}
                        </p>
                      )}
                      {esEstaSemana && !c.pagado && cumplida && (
                        <p className="text-xs text-[#1A6B3C] font-medium mt-1">✅ Se paga este {diaPago}</p>
                      )}
                    </div>
                    <div className="text-right ml-3">
                      <p className="font-bold text-lg text-gray-900">
                        ${c.comision_aplicada_mxn?.toLocaleString('es-MX')}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.pagado ? 'bg-gray-100 text-gray-500' :
                        cumplida ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {c.pagado ? 'Cobrada' : cumplida ? 'Por cobrar' : 'En garantía'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}