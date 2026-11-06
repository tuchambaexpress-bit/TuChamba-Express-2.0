'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Invitacion {
  token: string
  expira_at: string
  created_at: string
  telefono_esperado: string | null
}

interface Props {
  invitacionesIniciales: Invitacion[]
}

const mono = { fontFamily: "'JetBrains Mono', monospace" }
const display = { fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tu-chamba-express.vercel.app'

export default function InvitacionesPanel({ invitacionesIniciales }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [copiadoToken, setCopiadoToken] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [telefonoEsperado, setTelefonoEsperado] = useState('')

  async function generarInvitacion() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/invitaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ telefonoEsperado: telefonoEsperado.trim() || null })
    })
    const data = await res.json()

    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'No se pudo generar la invitación.')
      return
    }
    setTelefonoEsperado('')
    router.refresh()
  }

  async function copiarLink(token: string) {
    await navigator.clipboard.writeText(`${APP_URL}/invitacion/${token}`)
    setCopiadoToken(token)
    setTimeout(() => setCopiadoToken(null), 2000)
  }

  return (
    <div>
      <p className="text-[#8B94A8] text-sm mb-6" style={mono}>
        Genera un link único para que una nueva agencia se registre en la plataforma.
        El link expira en 7 días. Los links activos se quedan listados abajo hasta que expiren, para poder reenviarlos.
      </p>

      <div className="mb-4 max-w-xs">
        <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
          Teléfono esperado (opcional)
        </label>
        <input
          value={telefonoEsperado}
          onChange={e => setTelefonoEsperado(e.target.value)}
          placeholder="Ej. 8112345678"
          className="w-full bg-[#12151C] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
          style={mono}
        />
        <p className="text-[10px] text-[#5B6478] mt-1" style={mono}>
          Si lo especificas, el link solo se completa si el teléfono que registre el coordinador coincide.
        </p>
      </div>

      <button
        onClick={generarInvitacion}
        disabled={loading}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white py-3 px-6 text-sm uppercase tracking-wide transition-colors mb-6"
        style={{ ...display, clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
      >
        {loading ? 'Generando...' : '+ Generar link de invitación'}
      </button>

      {error && <p className="text-red-400 text-xs mb-4" style={mono}>⚠ {error}</p>}

      <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-3" style={mono}>
        Links activos ({invitacionesIniciales.length})
      </p>

      {invitacionesIniciales.length === 0 ? (
        <div
          className="bg-[#12151C] border border-[#1E2330] p-8 text-center"
          style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[#5B6478] text-sm" style={mono}>No hay links activos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invitacionesIniciales.map((inv, i) => (
            <div
              key={inv.token}
              className="bg-[#12151C] border border-[#1E2330] p-4"
              style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <p className="text-[10px] text-[#5B6478] mb-2" style={mono}>
                <span className="text-[#00D9FF]">#{i + 1}{i === 0 ? ' · MÁS RECIENTE' : ''}</span>
                {' · '}Generado el {new Date(inv.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}Expira el {new Date(inv.expira_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                {inv.telefono_esperado && <> {' · '}Dirigido a: {inv.telefono_esperado}</>}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${APP_URL}/invitacion/${inv.token}`}
                  className="flex-1 bg-[#0B0D12] border border-[#1E2330] text-[#8B94A8] px-3 py-2 text-xs"
                  style={mono}
                />
                <button
                  onClick={() => copiarLink(inv.token)}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-xs uppercase tracking-wide transition-colors"
                  style={display}
                >
                  {copiadoToken === inv.token ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
