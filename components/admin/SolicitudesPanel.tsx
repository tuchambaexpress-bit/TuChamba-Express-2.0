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
        'Content-Type': 'application/json'
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
        'Content-Type': 'application/json'
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
      <div
        className="bg-[#12151C] border border-[#1E2330] p-10 text-center"
        style={{ clipPath: 'polygon(0 14px, 14px 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full bg-[#39FF88] mb-3"
          style={{ boxShadow: '0 0 8px #39FF88' }}
        />
        <p className="text-[#5B6478] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          No hay solicitudes pendientes
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {solicitudes.map(s => {
        const coord = s.coordinadores?.[0]
        const yaActuado = resultado[s.id]

        return (
          <div
            key={s.id}
            className="bg-[#12151C] border border-[#1E2330] p-5"
            style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            {/* Agencia */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="text-[#E8EDF4] text-lg uppercase tracking-wide"
                  style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                >
                  {s.nombre}
                </h3>
                <p className="text-[10px] text-[#5B6478] mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Registrada el {new Date(s.created_at).toLocaleDateString('es-MX', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <span
                className="text-[10px] text-amber-400 border border-amber-400/30 px-2 py-1 uppercase tracking-wide"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                ⏳ Pendiente
              </span>
            </div>

            {/* Coordinador */}
            {coord && (
              <div className="bg-[#0B0D12] border border-[#1E2330] p-3 mb-4">
                <p className="text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Coordinador
                </p>
                <p className="text-[#E8EDF4] font-medium">{coord.nombre}</p>
                <p className="text-sm text-[#8B94A8]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{coord.email}</p>
                {coord.telefono && (
                  <p className="text-sm text-[#8B94A8]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{coord.telefono}</p>
                )}
              </div>
            )}

            {/* Acciones */}
            {yaActuado ? (
              <div
                className={`p-3 text-center text-sm uppercase tracking-wide ${
                  yaActuado === 'aprobado' ? 'text-[#39FF88] border border-[#39FF88]/30' : 'text-red-400 border border-red-400/30'
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {yaActuado === 'aprobado' ? '✅ Aprobada' : '❌ Rechazada'}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => rechazar(s.id, coord?.id ?? '')}
                  disabled={loading === s.id}
                  className="flex-1 border border-red-400/40 text-red-400 hover:bg-red-400/10 disabled:opacity-50 py-2.5 text-sm uppercase tracking-wide transition-colors"
                  style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                >
                  {loading === s.id ? '...' : '✕ Rechazar'}
                </button>
                <button
                  onClick={() => aprobar(s.id, coord?.id ?? '', coord?.email ?? '')}
                  disabled={loading === s.id}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white py-2.5 text-sm uppercase tracking-wide transition-colors"
                  style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                >
                  {loading === s.id ? '...' : '✓ Aprobar'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
