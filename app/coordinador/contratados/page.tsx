'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import * as XLSX from 'xlsx'

interface Contratado {
  id: string
  reclutador_id: string
  fecha_contratacion: string | null
  fecha_garantia_fin: string | null
  comision_aplicada_mxn: number | null
  pagado: boolean
  candidatos: { nombre: string; telefono: string } | null
  vacantes: { titulo: string; negocios: { nombre: string } | null } | null
}

interface Reclutador {
  id: string
  nombre: string
}

export default function ContratadosHistorico() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contratados, setContratados] = useState<Contratado[]>([])
  const [reclutadores, setReclutadores] = useState<Reclutador[]>([])
  const [filtroReclutador, setFiltroReclutador] = useState('')
  const [filtroDesde, setFiltroDesde] = useState('')
  const [filtroHasta, setFiltroHasta] = useState('')

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarReclutadores(s.agencia_id)
    cargarContratados(s.agencia_id)
  }, [])

  async function cargarReclutadores(agenciaId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('reclutador_agencia')
      .select('reclutadores(id, nombre)')
      .eq('agencia_id', agenciaId)
    setReclutadores((data ?? []).map((r: any) => r.reclutadores).filter(Boolean))
  }

  async function cargarContratados(agenciaId: string) {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('postulaciones')
      .select(`
        id, reclutador_id, fecha_contratacion, fecha_garantia_fin, comision_aplicada_mxn, pagado,
        candidatos(nombre, telefono),
        vacantes(titulo, negocios(nombre))
      `)
      .eq('agencia_id', agenciaId)
      .eq('etapa_actual', 'Contratado')
      .order('fecha_contratacion', { ascending: false })
    setContratados((data ?? []) as any)
    setLoading(false)
  }

  const filtrados = contratados.filter(c => {
    if (filtroReclutador && c.reclutador_id !== filtroReclutador) return false
    if (filtroDesde && c.fecha_contratacion && c.fecha_contratacion < filtroDesde) return false
    if (filtroHasta && c.fecha_contratacion && c.fecha_contratacion > filtroHasta) return false
    return true
  })

  function nombreReclutador(id: string) {
    return reclutadores.find(r => r.id === id)?.nombre ?? '—'
  }

  function formatearFecha(f: string | null) {
    if (!f) return '—'
    return new Date(f + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function exportarExcel() {
    const filas = filtrados.map(c => ({
      Candidato: c.candidatos?.nombre ?? '',
      Reclutador: nombreReclutador(c.reclutador_id),
      Empresa: c.vacantes?.negocios?.nombre ?? '',
      Vacante: c.vacantes?.titulo ?? '',
      'Fecha de inducción': formatearFecha(c.fecha_contratacion),
      'Garantía cumplida': formatearFecha(c.fecha_garantia_fin),
      'Comisión (MXN)': c.comision_aplicada_mxn ?? 0,
      Pagado: c.pagado ? 'Sí' : 'No',
    }))
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(filas), 'Contratados')
    XLSX.writeFile(libro, `historico_contratados_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Histórico de contratados" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Contratados ({filtrados.length})</h2>
          <button
            onClick={exportarExcel}
            disabled={filtrados.length === 0}
            className="bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium"
          >
            📥 Exportar
          </button>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={filtroReclutador}
            onChange={e => setFiltroReclutador(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            <option value="">Todos los reclutadores</option>
            {reclutadores.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Desde</label>
            <input
              type="date"
              value={filtroDesde}
              onChange={e => setFiltroDesde(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Hasta</label>
            <input
              type="date"
              value={filtroHasta}
              onChange={e => setFiltroHasta(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>
          {(filtroReclutador || filtroDesde || filtroHasta) && (
            <button
              onClick={() => { setFiltroReclutador(''); setFiltroDesde(''); setFiltroHasta('') }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-gray-500 font-medium">
              {contratados.length === 0 ? 'Aún no hay candidatos contratados' : 'Ninguno coincide con estos filtros'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="px-4 py-3 font-medium">Candidato</th>
                  <th className="px-4 py-3 font-medium">Reclutador</th>
                  <th className="px-4 py-3 font-medium">Empresa / Vacante</th>
                  <th className="px-4 py-3 font-medium">F. inducción</th>
                  <th className="px-4 py-3 font-medium">Garantía cumplida</th>
                  <th className="px-4 py-3 font-medium">Comisión</th>
                  <th className="px-4 py-3 font-medium">Pagado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.candidatos?.nombre}</p>
                      <p className="text-xs text-gray-400">{c.candidatos?.telefono}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{nombreReclutador(c.reclutador_id)}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{c.vacantes?.negocios?.nombre ?? '—'}</p>
                      <p className="text-xs text-[#1A6B3C]">{c.vacantes?.titulo}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatearFecha(c.fecha_contratacion)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatearFecha(c.fecha_garantia_fin)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${c.comision_aplicada_mxn?.toLocaleString('es-MX') ?? '0'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.pagado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.pagado ? 'Sí' : 'No'}
                      </span>
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
