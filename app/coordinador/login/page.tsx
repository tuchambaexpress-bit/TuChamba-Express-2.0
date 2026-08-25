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
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false)
  const [emailRecuperar, setEmailRecuperar] = useState('')
  const [recuperarEnviado, setRecuperarEnviado] = useState(false)
  const [recuperarError, setRecuperarError] = useState('')
  const [recuperarLoading, setRecuperarLoading] = useState(false)

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
      setError('Usuario o contraseña incorrectos')
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

  async function enviarReset() {
    if (!emailRecuperar.trim()) { setRecuperarError('Ingresa tu email'); return }
    setRecuperarLoading(true)
    setRecuperarError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailRecuperar.trim(), {
      redirectTo: `${window.location.origin}/coordinador/reset-password`,
    })

    setRecuperarLoading(false)
    if (resetError) {
      setRecuperarError('No se pudo enviar el correo. Intenta de nuevo.')
      return
    }
    setRecuperarEnviado(true)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
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

        {!mostrarRecuperar ? (
          <button
            type="button"
            onClick={() => { setMostrarRecuperar(true); setEmailRecuperar(email) }}
            className="w-full text-center text-xs text-gray-400 hover:text-[#1A6B3C] mt-6 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        ) : recuperarEnviado ? (
          <div className="mt-6 bg-green-50 rounded-xl p-3 text-center">
            <p className="text-sm text-green-700 font-medium">✅ Revisa tu correo</p>
            <p className="text-xs text-green-600 mt-1">Te enviamos instrucciones para restablecer tu contraseña.</p>
          </div>
        ) : (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <label className="text-xs font-medium text-gray-700 block mb-1">Recuperar contraseña</label>
            <input
              type="email"
              value={emailRecuperar}
              onChange={e => setEmailRecuperar(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
            {recuperarError && <p className="text-red-500 text-xs mb-2">{recuperarError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMostrarRecuperar(false)}
                className="flex-1 border border-gray-300 text-gray-600 text-xs font-medium py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={enviarReset}
                disabled={recuperarLoading}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg"
              >
                {recuperarLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}