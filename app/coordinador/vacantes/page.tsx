'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'

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

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarVacantes(s.agencia_id)
  }, [])

  async function cargarVacantes(agenciaId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('vacantes')
      .select(`
        id, titulo, ciudad, estado, status, prioridad,
        cupo_requerido, cupo_cubierto, created_at,
        negocios(nombre)
      `)
      .eq('agencia_id', agenciaId)
      .order('created_at', { ascending: false })

    if (data) setVacantes(data as any)
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
          <p className="text-sm text-gray-400">{vacantesFiltradas.length} de {vacantes.length}</p>
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
                  <th className="px-4 py-3 font-medium">Ciudad</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Prioridad</th>
                  <th className="px-4 py-3 font-medium">Cupo</th>
                  <th className="px-4 py-3 font-medium">Creada</th>
                </tr>
              </thead>
              <tbody>
                {vacantesFiltradas.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{v.titulo}</p>
                      <p className="text-xs text-gray-400">{v.negocios?.nombre ?? '—'}</p>
                    </td>
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
                    <td className="px-4 py-3 text-gray-600">{v.cupo_cubierto ?? 0}/{v.cupo_requerido ?? 1}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(v.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
