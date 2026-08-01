'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

export default function AlertasReclutador() {
  const router = useRouter()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [sesion, setSesion] = useState<any>(null)

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

  const ICONOS: Record<string, string> = {
    'sin_movimiento': '⏰',
    'garantia_proxima': '⚠️',
    'entrevista_proxima': '📅',
    'candidato_contratado': '🎉',
    'vacante_actualizada': '🔔',
    'mensaje_nuevo': '💬',
    'default': '📌'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
            <p className="text-green-200 text-sm">
              Alertas {noLeidas > 0 ? `· ${noLeidas} sin leer` : ''}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="text-green-200 hover:text-white text-xs border border-green-400 px-3 py-1 rounded-lg"
              >
                Marcar todas como leídas
              </button>
            )}
            <a href="/reclutador/dashboard" className="text-green-200 hover:text-white text-sm">← Dashboard</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : alertas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-gray-500 font-medium">Sin alertas pendientes</p>
            <p className="text-gray-400 text-sm mt-1">Estás al día con todo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alertas.map(a => (
              <div
                key={a.id}
                onClick={() => !a.leida && marcarLeida(a.id)}
                className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-colors ${
                  !a.leida ? 'border-l-4 border-l-[#1A6B3C] bg-green-50/30' : 'opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">
                    {ICONOS[a.tipo] ?? ICONOS.default}
                  </span>
                  <div className="flex-1 min-w-0">
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
                    <span className="w-2 h-2 bg-[#1A6B3C] rounded-full flex-shrink-0 mt-1.5"/>
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