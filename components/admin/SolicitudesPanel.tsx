'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Coordinador {
  id: string
  nombre: string
  email: string
  telefono: string | null
  status: string
}

interface Solicitud {
  id: string
  nombre: string
  status: string
  created_at: string
  coordinadores: Coordinador[]
}

interface Props {
  solicitudes: Solicitud[]
}

export default function SolicitudesPanel({ solicitudes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Record<string, 'aprobado' | 'rechazado'>>({})

  async function aprobar(agenciaId: string, coordinadorId: string, email: string) {
    setLoading(agenciaId)
    const res = await fetch('/api/admin/aprobar-agencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY ?? ''
      },
      body: JSON.stringify({ agenciaId, coordinadorId, email })
    })

    if (res.ok) {
      setResultado(prev => ({ ...prev, [agenciaId]: 'aprobado' }))
    }
    setLoading(null)
    router.refresh()
  }

  async function rechazar(agenciaId: string, coordinadorId: string) {
    setLoading(agenciaId)
    const res = await fetch('/api/admin/rechazar-agencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY ?? ''
      },
      body: JSON.stringify({ agenciaId, coordinadorId })
    })

    if (res.ok) {
      setResultado(prev => ({ ...prev, [agenciaId]: 'rechazado' }))
    }
    setLoading(null)
    router.refresh()
  }

  if (solicitudes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-gray-500">No hay solicitudes pendientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {solicitudes.map(s => {
        const coord = s.coordinadores?.[0]
        const yaActuado = resultado[s.id]

        return (
          <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Agencia */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{s.nombre}</h3>
                <p className="text-xs text-gray-400">
                  Registrada el {new Date(s.created_at).toLocaleDateString('es-MX', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                ⏳ Pendiente
              </span>
            </div>

            {/* Coordinador */}
            {coord && (
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Coordinador</p>
                <p className="font-semibold text-gray-800">{coord.nombre}</p>
                <p className="text-sm text-gray-600">{coord.email}</p>
                {coord.telefono && (
                  <p className="text-sm text-gray-600">{coord.telefono}</p>
                )}
              </div>
            )}

            {/* Acciones */}
            {yaActuado ? (
              <div className={`rounded-xl p-3 text-center text-sm font-medium ${
                yaActuado === 'aprobado'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {yaActuado === 'aprobado' ? '✅ Aprobada' : '❌ Rechazada'}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => rechazar(s.id, coord?.id ?? '')}
                  disabled={loading === s.id}
                  className="flex-1 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 text-sm"
                >
                  {loading === s.id ? '...' : '❌ Rechazar'}
                </button>
                <button
                  onClick={() => aprobar(s.id, coord?.id ?? '', coord?.email ?? '')}
                  disabled={loading === s.id}
                  className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
                >
                  {loading === s.id ? '...' : '✅ Aprobar'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}