'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validarPassword } from '@/lib/validarPassword'

export default function ResetPasswordCoordinador() {
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)
  const [sesionValida, setSesionValida] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesionValida(!!session)
      setVerificando(false)
    })
  }, [])

  async function guardar() {
    setError('')
    const mensajeValidacion = validarPassword(password)
    if (mensajeValidacion) { setError(mensajeValidacion); return }
    if (password !== confirmar) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError('No se pudo actualizar la contraseña. Intenta de nuevo.')
      return
    }

    setExito(true)
    setTimeout(() => router.push('/coordinador/login'), 2500)
  }

  if (verificando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Verificando...</p>
      </div>
    )
  }

  if (!sesionValida) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm text-center">
          <p className="text-3xl mb-3">⚠️</p>
          <p className="text-gray-700 font-medium mb-1">Link inválido o expirado</p>
          <p className="text-gray-400 text-sm mb-6">Solicita un nuevo correo de recuperación desde la pantalla de inicio de sesión.</p>
          <a href="/coordinador/login" className="text-[#1A6B3C] text-sm font-medium hover:underline">
            Volver al login
          </a>
        </div>
      </div>
    )
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm text-center">
          <p className="text-3xl mb-3">✅</p>
          <p className="text-gray-700 font-medium">Contraseña actualizada</p>
          <p className="text-gray-400 text-sm mt-1">Te llevamos al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm">
        <div className="text-center mb-6">
          <img src="/Logo_Header_02.png" alt="Tu Chamba Express" className="h-10 object-contain mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Nueva contraseña</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={12}
                placeholder="8-12 caracteres, letras, números y símbolos"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] pr-10"
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img
                  src={verPassword ? '/ojo-cerrado.png' : '/ojo-abierto.png'}
                  alt={verPassword ? 'Ocultar' : 'Ver'}
                  className="w-5 h-5 object-contain"
                />
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Confirmar contraseña</label>
            <input
              type={verPassword ? 'text' : 'password'}
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              maxLength={12}
              placeholder="Repite la contraseña"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            onClick={guardar}
            disabled={loading}
            className="w-full bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </div>
      </div>
    </div>
  )
}
