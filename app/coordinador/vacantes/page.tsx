'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import VacanteModal from '@/components/coordinador/VacanteModal'

interface Vacante {
  id: string
  titulo: string
  ciudad: string
  estado: string
  status: string
  prioridad: string
  cupo_requerido: number
  cupo_cubierto: number
  created_at: string
  negocios: { nombre: string } | null
  horario: string | null
  salario_min: number | null
  requisitos: string[] | null
  beneficios: string[] | null
  documentos_requeridos: string[] | null
}

// CA-09.3: misma lista de OBLIGATORIOS que bloquea guardar en el VacanteModal
function esVacanteCompleta(v: Vacante) {
  return !!v.titulo?.trim()
    && !!v.ciudad?.trim() && !!v.estado?.trim()
    && !!v.horario?.trim()
    && !!v.salario_min
    && !!(v.requisitos && v.requisitos.length > 0)
    && !!(v.beneficios && v.beneficios.length > 0)
    && !!(v.documentos_requeridos && v.documentos_requeridos.length > 0)
}

const COLORES_STATUS: Record<string, string> = {
  vigente: 'bg-green-100 text-green-700',
  pausada: 'bg-amber-100 text-amber-700',
  cerrada: 'bg-gray-100 text-gray-600',
}

const COLORES_PRIORIDAD: Record<string, string> = {
  normal: 'bg-gray-100 text-gray-600',
  alta: 'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700',
}

export default function VacantesCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [vacantes, setVacantes] = useState<Vacante[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroPrioridad, setFiltroPrioridad] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [vacanteEditar, setVacanteEditar] = useState<string | null>(null)
  const [vacanteDuplicar, setVacanteDuplicar] = useState<any | null>(null)
  const [importando, setImportando] = useState(false)
  const [reporteImportacion, setReporteImportacion] = useState<any | null>(null)
  const [cupoReal, setCupoReal] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarVacantes(s.agencia_id)
  }, [])

  useEffect(() => {
    if (!sesion?.agencia_id) return
    const supabase = createClient()
    const canal = supabase
      .channel(`vacantes-coordinador-${sesion.agencia_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vacantes',
        filter: `agencia_id=eq.${sesion.agencia_id}`
      }, () => cargarVacantes(sesion.agencia_id))
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [sesion])

  async function importarExcel(archivo: File) {
    setImportando(true)
    setReporteImportacion(null)

    const formData = new FormData()
    formData.append('file', archivo)
    formData.append('agenciaId', sesion.agencia_id)

    const res = await fetch('/api/importar-vacantes', { method: 'POST', body: formData })
    const data = await res.json()

    setImportando(false)
    if (!res.ok) {
      setReporteImportacion({ error: data.error ?? 'Error al importar' })
    } else {
      setReporteImportacion(data)
      cargarVacantes(sesion.agencia_id)
    }
  }

  async function cargarVacantes(agenciaId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('vacantes')
      .select(`
        id, titulo, ciudad, estado, status, prioridad,
        cupo_requerido, cupo_cubierto, created_at,
        horario, salario_min, requisitos, beneficios, documentos_requeridos,
        negocios(nombre)
      `)
      .eq('agencia_id', agenciaId)
      .order('created_at', { ascending: false })

    if (data) setVacantes(data as any)

    // HU-16 (6.8b): cupo_cubierto (columna) nunca se actualiza — se calcula en
    // vivo igual que en VacanteModal (comision_aplicable=true, sin importar si
    // sigue en Inducción o ya llegó a Contratado).
    // HU-16 (6.8b) "por rondas": solo cuenta lo que entró a Inducción DESPUÉS
    // de cupo_desde de CADA vacante — necesita ambos datasets para comparar
    // fila por fila, no se puede hacer en un solo filtro plano.
    const { data: vacantesCupoDesde } = await supabase
      .from('vacantes')
      .select('id, cupo_desde')
      .eq('agencia_id', agenciaId)
    const mapaCupoDesde = new Map((vacantesCupoDesde ?? []).map((v: any) => [v.id, (v.cupo_desde ?? '1970-01-01').split('T')[0]]))

    const { data: postulacionesData } = await supabase
      .from('postulaciones')
      .select('vacante_id, fecha_contratacion')
      .eq('agencia_id', agenciaId)
      .eq('comision_aplicable', true)

    const conteo = new Map<string, number>()
    ;(postulacionesData ?? []).forEach((p: any) => {
      const cupoDesde = mapaCupoDesde.get(p.vacante_id)
      if (p.fecha_contratacion && cupoDesde && p.fecha_contratacion >= cupoDesde) {
        conteo.set(p.vacante_id, (conteo.get(p.vacante_id) ?? 0) + 1)
      }
    })
    setCupoReal(conteo)

    setLoading(false)
  }

  const vacantesFiltradas = vacantes.filter(v => {
    if (filtroStatus && v.status !== filtroStatus) return false
    if (filtroPrioridad && v.prioridad !== filtroPrioridad) return false
    return true
  })

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Vacantes" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vacantes</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400">{vacantesFiltradas.length} de {vacantes.length}</p>
            <a href={`/api/exportar-vacantes?agenciaId=${sesion.agencia_id}`}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium"
            >
              📥 Exportar
            </a>
            <label className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium cursor-pointer">
              {importando ? 'Importando...' : '📤 Importar'}
              <input
                type="file"
                accept=".xlsx"
                disabled={importando}
                onChange={e => e.target.files?.[0] && importarExcel(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => { setVacanteEditar(null); setVacanteDuplicar(null); setModalAbierto(true) }}
              className="bg-[#1A6B3C] hover:bg-[#155c33] text-white text-sm px-4 py-2 rounded-lg font-medium"
            >
              + Nueva vacante
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            <option value="">Todos los status</option>
            <option value="vigente">Vigente</option>
            <option value="pausada">Pausada</option>
            <option value="cerrada">Cerrada</option>
          </select>
          <select
            value={filtroPrioridad}
            onChange={e => setFiltroPrioridad(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            <option value="">Toda prioridad</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : vacantesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">💼</p>
            <p className="text-gray-500 font-medium">
              {vacantes.length === 0 ? 'Aún no hay vacantes registradas' : 'Ninguna vacante coincide con estos filtros'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="px-4 py-3 font-medium">Vacante</th>
                  <th className="px-4 py-3 font-medium">Empresa</th>
                  <th className="px-4 py-3 font-medium">Ciudad</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Prioridad</th>
                  <th className="px-4 py-3 font-medium">Cupo</th>
                  <th className="px-4 py-3 font-medium">Creada</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {vacantesFiltradas.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setVacanteEditar(v.id); setVacanteDuplicar(null); setModalAbierto(true) }}
                        className="font-medium text-gray-900 hover:text-[#1A6B3C] hover:underline text-left flex items-center gap-1.5"
                      >
                        {v.titulo}
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${esVacanteCompleta(v) ? 'bg-green-500' : 'bg-amber-400'}`}
                          title={esVacanteCompleta(v) ? 'Ficha completa' : 'Faltan campos recomendados (contacto RRHH, punto de reunión o documentos)'}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{v.negocios?.nombre ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{v.ciudad}, {v.estado}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORES_STATUS[v.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORES_PRIORIDAD[v.prioridad] ?? 'bg-gray-100 text-gray-600'}`}>
                        {v.prioridad}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{cupoReal.get(v.id) ?? 0}/{v.cupo_requerido ?? 1}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(v.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setVacanteEditar(null); setVacanteDuplicar(v); setModalAbierto(true) }}
                        className="text-xs text-gray-500 hover:text-[#1A6B3C] border border-gray-200 rounded-lg px-2 py-1"
                      >
                        📋 Duplicar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reporteImportacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Resultado de la importación</h3>
              <button onClick={() => setReporteImportacion(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>

            {reporteImportacion.error ? (
              <p className="text-red-500 text-sm">{reporteImportacion.error}</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">{reporteImportacion.creadas}</p>
                    <p className="text-xs text-green-600">Creadas</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{reporteImportacion.actualizadas}</p>
                    <p className="text-xs text-blue-600">Actualizadas</p>
                  </div>
                </div>

                {reporteImportacion.errores?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">
                      {reporteImportacion.errores.length} fila(s) con error:
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {reporteImportacion.errores.map((e: any, i: number) => (
                        <p key={i} className="text-xs text-gray-600 bg-red-50 rounded px-2 py-1">
                          Fila {e.fila}: {e.motivo}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={() => setReporteImportacion(null)}
              className="w-full mt-4 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2 rounded-xl text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <VacanteModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        agenciaId={sesion.agencia_id}
        vacanteId={vacanteEditar}
        vacanteDuplicar={vacanteDuplicar}
        onGuardado={() => cargarVacantes(sesion.agencia_id)}
      />
    </div>
  )
}
