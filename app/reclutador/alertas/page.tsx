'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

interface Alerta {
  id: string
  tipo: string
  mensaje: string
  leida: boolean
  created_at: string
  vacante_id: string | null
  candidato_id: string | null
  postulacion_id: string | null
}

type OrdenPor = 'reciente' | 'antigua' | 'no_leidas' | 'leidas' | 'todas'

export default function AlertasReclutador() {
  const router = useRouter()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)
  const [ordenPor, setOrdenPor] = useState<OrdenPor>('reciente')

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarAlertas(s.id)
  }, [])

  async function cargarAlertas(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('alertas')
      .select('*')
      .eq('reclutador_id', reclutadorId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setAlertas(data)
    setLoading(false)
  }

  async function marcarLeida(id: string) {
    const supabase = createClient()
    await supabase.from('alertas').update({ leida: true }).eq('id', id)
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a))
  }

  async function marcarTodasLeidas() {
    if (!sesion) return
    const supabase = createClient()
    await supabase.from('alertas').update({ leida: true }).eq('reclutador_id', sesion.id)
    setAlertas(prev => prev.map(a => ({ ...a, leida: true })))
  }

  const noLeidas = alertas.filter(a => !a.leida).length

  // "Ordenar por" — reordena únicamente, ninguna alerta se oculta nunca
  // (mismo principio ya usado en el chat coordinador↔reclutador, CA-22.4).
  function ordenarAlertas(lista: Alerta[]): Alerta[] {
    const porRecencia = [...lista].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    switch (ordenPor) {
      case 'antigua':
        return [...porRecencia].reverse()
      case 'no_leidas':
        // no leídas primero, sin ocultar las leídas; recencia como orden secundario
        return [...porRecencia].sort((a, b) => Number(a.leida) - Number(b.leida))
      case 'leidas':
        return [...porRecencia].sort((a, b) => Number(b.leida) - Number(a.leida))
      case 'reciente':
      case 'todas':
      default:
        return porRecencia
    }
  }

  const alertasOrdenadas = ordenarAlertas(alertas)

  const ICONOS: Record<string, string> = {
    'sin_movimiento': '⏰',
    'garantia_proxima': '⚠️',
    'entrevista_proxima': '📅',
    'candidato_contratado': '🎉',
    'vacante_actualizada': '🔔',
    'mensaje_nuevo': '💬',
    'promocion_nueva': '🔥', // tarea 5.14 / CA-07.7
    'default': '📌'
  }

  // CA-07.7: la alerta de bono/promoción nueva se pinta destacada,
  // distinta visualmente de las alertas normales.
  function claseCard(a: Alerta) {
    if (a.tipo === 'promocion_nueva') {
      return `bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 shadow-sm ${
        a.leida ? 'opacity-60' : 'ring-1 ring-amber-300'
      }`
    }
    return `bg-white shadow-sm ${
      !a.leida ? 'border-l-4 border-l-[#1A6B3C] bg-green-50/30' : 'opacity-60'
    }`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo={noLeidas > 0 ? `Alertas · ${noLeidas} sin leer` : 'Alertas'} />

      <div className="max-w-4xl mx-auto px-4 pt-4 flex flex-wrap items-center justify-between gap-2">
        {noLeidas > 0 ? (
          <button
            onClick={marcarTodasLeidas}
            className="text-[#1A6B3C] hover:underline text-xs border border-[#1A6B3C] px-3 py-1 rounded-lg bg-white"
          >
            Marcar todas como leídas
          </button>
        ) : <span />}

        <label className="text-xs text-gray-500 flex items-center gap-2">
          Ordenar por:
          <select
            value={ordenPor}
            onChange={(e) => setOrdenPor(e.target.value as OrdenPor)}
            className="border border-gray-300 rounded-lg text-xs px-2 py-1 bg-white text-gray-700"
          >
            <option value="reciente">Más reciente</option>
            <option value="antigua">Más antigua</option>
            <option value="no_leidas">No leídas</option>
            <option value="leidas">Leídas</option>
            <option value="todas">Todas</option>
          </select>
        </label>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : alertasOrdenadas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-gray-500 font-medium">Sin alertas pendientes</p>
            <p className="text-gray-400 text-sm mt-1">Estás al día con todo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alertasOrdenadas.map(a => (
              <div
                key={a.id}
                onClick={() => !a.leida && marcarLeida(a.id)}
                className={`rounded-xl p-4 cursor-pointer transition-colors ${claseCard(a)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">
                    {ICONOS[a.tipo] ?? ICONOS.default}
                  </span>
                  <div className="flex-1 min-w-0">
                    {a.tipo === 'promocion_nueva' && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mb-1">
                        Bono especial
                      </span>
                    )}
                    <p className={`text-sm ${!a.leida ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {a.mensaje}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(a.created_at).toLocaleDateString('es-MX', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!a.leida && (
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                      a.tipo === 'promocion_nueva' ? 'bg-amber-500' : 'bg-[#1A6B3C]'
                    }`}/>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
