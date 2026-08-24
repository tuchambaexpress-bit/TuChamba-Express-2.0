'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginReclutador() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!codigo.trim()) { setError('Ingresa tu código de acceso'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/reclutador/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: codigo.trim().toUpperCase() })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Código inválido')
      setLoading(false)
      return
    }

    // Guardar sesión en localStorage
    localStorage.setItem('reclutador_sesion', JSON.stringify({
      id: data.reclutador.id,
      nombre: data.reclutador.nombre,
      codigo: data.reclutador.codigo,
      token_referido: data.reclutador.token_referido,
      agencia_id: data.reclutador.agencia_id
    }))

    router.push('/reclutador/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1A6B3C]">Tu Chamba Express</h1>
          <p className="text-gray-500 text-sm mt-1">Portal Reclutador</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Código de acceso
            </label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Ej. LAURA01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] uppercase"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿No tienes código? Contacta a tu coordinador.
        </p>
      </div>
    </div>
  )
}