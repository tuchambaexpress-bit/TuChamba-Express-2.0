'use client'

import { useState } from 'react'

interface Props {
  vacanteId: string
  vacanteTitulo: string
  reclutadorId?: string | null
  onClose: () => void
}

export default function ChatModal({ vacanteId, vacanteTitulo, reclutadorId, onClose }: Props) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit() {
    if (!nombre.trim()) { setError('Ingresa tu nombre'); return }
    if (telefono.trim().length < 10) { setError('Ingresa un teléfono válido de 10 dígitos'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/postular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          vacanteId,
          reclutadorId: reclutadorId ?? null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error, intenta de nuevo')
      } else {
        setEnviado(true)
      }
    } catch {
      setError('Error de conexión, intenta de nuevo')
    }

    setLoading(false)
  }

  if (enviado) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <p className="text-4xl mb-4">🎉</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">¡Postulación enviada!</h3>
          <p className="text-gray-500 text-sm mb-6">
            Un reclutador se pondrá en contacto contigo pronto para la vacante de <strong>{vacanteTitulo}</strong>.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#1A6B3C] text-white py-3 rounded-xl font-semibold hover:bg-[#155c33] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Postularme</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Vacante: <strong className="text-gray-700">{vacanteTitulo}</strong>
        </p>

        {/* Formulario */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez García"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Teléfono (10 dígitos)
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Ej. 8112345678"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Enviando...' : '💬 Enviar postulación'}
          </button>
        </div>
      </div>
    </div>
  )
}