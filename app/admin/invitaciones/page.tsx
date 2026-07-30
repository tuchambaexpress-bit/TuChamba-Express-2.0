'use client'

import { useState } from 'react'

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
          <span className="text-green-200 text-sm">Panel Admin</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invitaciones de Agencia
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Genera un link único para que una nueva agencia se registre en la plataforma.
          El link expira en 7 días.
        </p>

        <button
          onClick={generarInvitacion}
          disabled={loading}
          className="bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? 'Generando...' : '+ Generar link de invitación'}
        </button>

        {invitacion && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">
              ✅ Link generado — válido hasta {new Date(invitacion.expira).toLocaleDateString('es-MX', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={invitacion.url}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50"
              />
              <button
                onClick={copiarLink}
                className="bg-[#1A6B3C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155c33] transition-colors"
              >
                {copiado ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Comparte este link con el coordinador de la nueva agencia.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}