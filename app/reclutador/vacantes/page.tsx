'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

interface Vacante {
  id: string
  titulo: string
  ciudad: string
  estado: string
  status: string
  prioridad: string
  comision_base_mxn: number
  dias_garantia: number
  tiene_promocion: boolean
  promocion_fin: string | null
  negocios: { nombre: string; dias_entrevista: number[] } | null
}

const NOMBRES_DIA_CORTO: Record<number, string> = {
  0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
}

export default function VacantesReclutador() {
  const router = useRouter()
  const [vacantes, setVacantes] = useState<Vacante[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [reclutadorId, setReclutadorId] = useState<string | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setReclutadorId(s.id)
    cargarVacantes(s.id)
  }, [])

  // 5.21 — Realtime sin filtro por agencia: el reclutador puede estar activo
  // en varias agencias (reclutador_agencia), y postgres_changes solo soporta
  // filtro simple de igualdad (no "IN" sobre una lista). Se escucha cualquier
  // cambio en `vacantes` y se recarga la lista ya filtrada por sus agencias
  // (cargarVacantes ya hace ese filtro). Decisión B1: sin filtro en el canal
  // — volumen bajo hoy, más simple que abrir un canal por cada agencia.
  useEffect(() => {
    if (!reclutadorId) return
    const supabase = createClient()
    const canal = supabase
      .channel(`vacantes-reclutador-${reclutadorId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vacantes' }, () => cargarVacantes(reclutadorId))
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [reclutadorId])

  async function cargarVacantes(reclutadorId: string) {
    const supabase = createClient()

    // El reclutador puede estar activo en más de una agencia
    const { data: agencias } = await supabase
      .from('reclutador_agencia')
      .select('agencia_id')
      .eq('reclutador_id', reclutadorId)
      .eq('activo', true)

    const agenciaIds = (agencias ?? []).map((a: any) => a.agencia_id)
    if (agenciaIds.length === 0) { setLoading(false); return }

    const { data } = await supabase
      .from('vacantes')
      .select('id, titulo, ciudad, estado, status, prioridad, comision_base_mxn, dias_garantia, tiene_promocion, promocion_fin, negocios(nombre, dias_entrevista)')
      .in('agencia_id', agenciaIds)
      .order('status', { ascending: true }) // 'pausada' < 'vigente' alfabéticamente — se reordena abajo
      .order('created_at', { ascending: false })

    if (data) {
      // Vigentes primero, pausadas después — sin ocultar ninguna
      const ordenadas = [...data].sort((a: any, b: any) => {
        if (a.status === b.status) return 0
        return a.status === 'vigente' ? -1 : 1
      })
      setVacantes(ordenadas as any)
    }
    setLoading(false)
  }

  const hoy = new Date().toISOString().split('T')[0]
  const vacantesFiltradas = vacantes.filter(v => {
    const texto = `${v.titulo} ${(v.negocios as any)?.nombre ?? ''} ${v.ciudad}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="Vacantes de tu agencia" />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por puesto, empresa o ciudad..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
        />

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : vacantesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-gray-500 font-medium">Sin vacantes que coincidan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {vacantesFiltradas.map(v => {
              const promoActiva = v.tiene_promocion && v.promocion_fin && hoy <= v.promocion_fin
              return (
                <Link
                  key={v.id}
                  href={`/reclutador/detalle/${v.id}?from=vacantes`}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{v.titulo}</p>
                      <p className="text-xs text-[#1A6B3C] mt-0.5">{(v.negocios as any)?.nombre ?? 'Empresa'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">📍 {v.ciudad}, {v.estado}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                        v.status === 'vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {v.status}
                      </span>
                      {v.prioridad && v.prioridad !== 'normal' && (
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          v.prioridad === 'urgente' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {v.prioridad === 'urgente' ? '🔴 Urgente' : '🟠 Alta'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>💰 ${v.comision_base_mxn?.toLocaleString('es-MX')} MXN</span>
                    <span>🛡️ {v.dias_garantia} días</span>
                    {promoActiva && <span className="text-amber-600 font-medium">🔥 Bono activo</span>}
                  </div>
                  {(v.negocios as any)?.dias_entrevista?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      📅 Entrevistas: {(v.negocios as any).dias_entrevista.sort().map((d: number) => NOMBRES_DIA_CORTO[d]).join(', ')}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
