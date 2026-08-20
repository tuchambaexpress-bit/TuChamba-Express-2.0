'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'

const NOMBRES_DIA: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

export default function PerfilAgencia() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [nombreAgencia, setNombreAgencia] = useState('')
  const [diaCorte, setDiaCorte] = useState(4)
  const [diaPago, setDiaPago] = useState(5)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarAgencia(s.agencia_id)
  }, [])

  async function cargarAgencia(agenciaId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('agencias')
      .select('nombre, dia_corte, dia_pago')
      .eq('id', agenciaId)
      .single()
    if (data) {
      setNombreAgencia(data.nombre)
      setDiaCorte(data.dia_corte ?? 4)
      setDiaPago(data.dia_pago ?? 5)
    }
    setLoading(false)
  }

  async function guardar() {
    setGuardando(true)
    setGuardado(false)
    const supabase = createClient()
    await supabase
      .from('agencias')
      .update({ dia_corte: diaCorte, dia_pago: diaPago })
      .eq('id', sesion.agencia_id)
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Perfil de agencia" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil de agencia</h2>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs text-gray-500">Agencia</p>
              <p className="text-lg font-bold text-gray-900">{nombreAgencia}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Día de corte</label>
                <select
                  value={diaCorte}
                  onChange={e => setDiaCorte(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                >
                  {Object.entries(NOMBRES_DIA).map(([num, nombre]) => (
                    <option key={num} value={num}>{nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Día de pago</label>
                <select
                  value={diaPago}
                  onChange={e => setDiaPago(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                >
                  {Object.entries(NOMBRES_DIA).map(([num, nombre]) => (
                    <option key={num} value={num}>{nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Estos días se usan en "Corte semanal" (el periodo siempre es la semana completa, de lunes a domingo) y en "Mis comisiones" del reclutador — solo indican cuándo dentro de la semana se procesa el pago.
            </p>

            <button
              onClick={guardar}
              disabled={guardando}
              className="bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-medium"
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {guardado && <span className="ml-3 text-sm text-green-600">✅ Guardado</span>}
          </div>
        )}
      </div>
    </div>
  )
}
