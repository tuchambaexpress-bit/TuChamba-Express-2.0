'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  token: string
  invitacionId: string
}

export default function FormularioInvitacion({ token, invitacionId }: Props) {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Paso 1 — Datos de la agencia
  const [agenciaNombre, setAgenciaNombre] = useState('')
  const [agenciaRfc, setAgenciaRfc] = useState('')

  // Paso 2 — Datos del coordinador
  const [coordNombre, setCoordNombre] = useState('')
  const [coordEmail, setCoordEmail] = useState('')
  const [coordTelefono, setCoordTelefono] = useState('')

  async function handlePaso1() {
    if (!agenciaNombre.trim()) { setError('El nombre de la agencia es requerido'); return }
    setError('')
    setPaso(2)
  }

  async function handlePaso2() {
    if (!coordNombre.trim()) { setError('Tu nombre es requerido'); return }
    if (!coordEmail.trim()) { setError('Tu email es requerido'); return }
    setError('')
    setLoading(true)

    const res = await fetch('/api/registro-agencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        invitacionId,
        agencia: { nombre: agenciaNombre.trim(), rfc: agenciaRfc.trim() },
        coordinador: {
          nombre: coordNombre.trim(),
          email: coordEmail.trim(),
          telefono: coordTelefono.trim()
        }
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error al registrar')
      setLoading(false)
      return
    }

    setPaso(3)
    setLoading(false)
  }

  if (paso === 3) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Registro completado!</h2>
        <p className="text-gray-500 text-sm mb-4">
          Tu agencia y perfil han sido registrados. El administrador revisará tu solicitud y te notificará cuando tu cuenta esté activa.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-700 text-sm">
            ⏳ Tu cuenta está en revisión. Recibirás confirmación pronto.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${paso >= 1 ? 'bg-[#1A6B3C] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
        <div className="flex-1 h-0.5 bg-gray-200">
          <div className={`h-full bg-[#1A6B3C] transition-all ${paso >= 2 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${paso >= 2 ? 'bg-[#1A6B3C] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
      </div>

      {paso === 1 && (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Datos de la agencia</h2>
          <p className="text-gray-500 text-sm mb-5">Ingresa la información de tu agencia de reclutamiento.</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nombre de la agencia *</label>
              <input
                type="text"
                value={agenciaNombre}
                onChange={e => setAgenciaNombre(e.target.value)}
                placeholder="Ej. RH Connect"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">RFC (opcional)</label>
              <input
                type="text"
                value={agenciaRfc}
                onChange={e => setAgenciaRfc(e.target.value.toUpperCase())}
                placeholder="Ej. XAXX010101000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={handlePaso1}
              className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continuar →
            </button>
          </div>
        </>
      )}

      {paso === 2 && (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Tus datos de coordinador</h2>
          <p className="text-gray-500 text-sm mb-5">Serás el coordinador principal de <strong>{agenciaNombre}</strong>.</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nombre completo *</label>
              <input
                type="text"
                value={coordNombre}
                onChange={e => setCoordNombre(e.target.value)}
                placeholder="Ej. Ana González"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
              <input
                type="email"
                value={coordEmail}
                onChange={e => setCoordEmail(e.target.value)}
                placeholder="Ej. ana@rhconnect.mx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono (opcional)</label>
              <input
                type="tel"
                value={coordTelefono}
                onChange={e => setCoordTelefono(e.target.value)}
                placeholder="Ej. 8112345678"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setPaso(1); setError('') }}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={handlePaso2}
                disabled={loading}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Registrando...' : 'Completar registro'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}