'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InvitacionesPage() {
  const [loading, setLoading] = useState(false)
  const [invitacion, setInvitacion] = useState<{
    url: string
    token: string
    expira: string
  } | null>(null)
  const [copiado, setCopiado] = useState(false)

  async function generarInvitacion() {
    setLoading(true)
    setInvitacion(null)

    const res = await fetch('/api/invitaciones', {
      method: 'POST',
      headers: { 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY ?? '' }
    })
    const data = await res.json()

    if (res.ok) {
      setInvitacion(data)
    }
    setLoading(false)
  }

  async function copiarLink() {
    if (!invitacion) return
    await navigator.clipboard.writeText(invitacion.url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] relative">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />

      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00D9FF 1px, transparent 1px), linear-gradient(90deg, #00D9FF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <header className="relative border-b border-[#1E2330] bg-[#0F1116]/80 backdrop-blur px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/admin"
            className="text-xs text-[#5B6478] hover:text-[#00D9FF] uppercase tracking-[0.15em] transition-colors font-medium"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ← Panel de Control
          </Link>
          <h1
            className="text-[#E8EDF4] text-lg uppercase tracking-wide mt-1"
            style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
          >
            Invitaciones
          </h1>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-6 py-8">
        <p className="text-[#8B94A8] text-sm mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Genera un link único para que una nueva agencia se registre en la plataforma.
          El link expira en 7 días.
        </p>

        <button
          onClick={generarInvitacion}
          disabled={loading}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white py-3 px-6 text-sm uppercase tracking-wide transition-colors"
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 600,
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}
        >
          {loading ? 'Generando...' : '+ Generar link de invitación'}
        </button>

        {invitacion && (
          <div
            className="mt-6 bg-[#12151C] border border-[#1E2330] p-5"
            style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            <p className="text-sm text-[#39FF88] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ✅ Link generado — válido hasta {new Date(invitacion.expira).toLocaleDateString('es-MX', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={invitacion.url}
                className="flex-1 bg-[#0B0D12] border border-[#1E2330] text-[#8B94A8] px-3 py-2 text-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              <button
                onClick={copiarLink}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-sm uppercase tracking-wide transition-colors"
                style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
              >
                {copiado ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-[10px] text-[#5B6478] mt-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Comparte este link con el coordinador de la nueva agencia.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
