'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales inválidas.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center px-4 relative overflow-hidden">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />

      {/* Grid de fondo, textura sutil tipo radar */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00D9FF 1px, transparent 1px), linear-gradient(90deg, #00D9FF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div
        className="relative w-full max-w-sm bg-[#12151C] border border-[#1E2330] p-8"
        style={{
          clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
          boxShadow: '0 0 0 1px rgba(0,217,255,0.15), 0 0 40px rgba(0,217,255,0.08)',
        }}
      >
        <p
          className="text-[#00D9FF] text-xs tracking-[0.3em] mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          TUCHAMBA EXPRESS // ACCESO RESTRINGIDO
        </p>
        <h1
          className="text-[#E8EDF4] text-2xl mb-8 uppercase tracking-wide"
          style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
        >
          Panel Admin
        </h1>

        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label
              className="block text-[10px] text-[#5B6478] tracking-[0.2em] uppercase mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2.5 text-sm focus:outline-none focus:border-[#00D9FF] transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              placeholder="admin@tuchamba.com"
            />
          </div>
          <div>
            <label
              className="block text-[10px] text-[#5B6478] tracking-[0.2em] uppercase mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#00D9FF] transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <img
                  src={mostrarPassword ? '/ojo-abierto.png' : '/ojo-cerrado.png'}
                  alt=""
                  className="w-4 h-4"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }}
                />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ⚠ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white py-2.5 text-sm uppercase tracking-[0.15em] transition-colors mt-2"
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#1E2330]">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#39FF88] animate-pulse"
            style={{ boxShadow: '0 0 6px #39FF88' }}
          />
          <p className="text-[10px] text-[#5B6478] tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            SISTEMA OPERATIVO
          </p>
        </div>
      </div>
    </div>
  )
}
