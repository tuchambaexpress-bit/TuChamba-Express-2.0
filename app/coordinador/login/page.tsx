'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginCoordinador() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verPassword, setVerPassword] = useState(false)

  async function handleLogin() {
    if (!email.trim()) { setError('Ingresa tu email'); return }
    if (!password.trim()) { setError('Ingresa tu contraseña'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    })

    if (authError || !data.user) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    // Verificar que es coordinador activo
    const { data: coordinador } = await supabase
      .from('coordinadores')
      .select('id, nombre, agencia_id, status')
      .eq('email', email.trim())
      .single()

    if (!coordinador || coordinador.status !== 'activo') {
      setError('Tu cuenta no está activa. Contacta al administrador.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    // Guardar sesión en localStorage
    localStorage.setItem('coordinador_sesion', JSON.stringify({
      id: coordinador.id,
      nombre: coordinador.nombre,
      agencia_id: coordinador.agencia_id,
      email: email.trim()
    }))

    router.push('/coordinador/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm">
        <div className="text-center mb-6">
          <img src="/Logo_Header_02.png" alt="Tu Chamba Express" className="h-10 object-contain mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Portal Coordinador</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] pr-10"
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <img 
                    src={verPassword ? '/ojo-cerrado.png' : '/ojo-abierto.png'} 
                    alt={verPassword ? 'Ocultar' : 'Ver'} 
                    className="w-5 h-5 object-contain"
                  />
              </button>
            </div>
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
          ¿Olvidaste tu contraseña? Contacta al administrador.
        </p>
      </div>
    </div>
  )
}