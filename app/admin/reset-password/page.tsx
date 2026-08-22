'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validarPassword } from '@/lib/validarPassword'

export default function ResetPasswordAdmin() {
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)
  const [sesionValida, setSesionValida] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
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
    setTimeout(() => router.push('/admin/login'), 2500)
  }

  const fontLink = (
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
  )

  if (verificando) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
        {fontLink}
        <p className="text-[#5B6478] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Verificando...</p>
      </div>
    )
  }

  if (!sesionValida) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4">
        {fontLink}
        <div
          className="bg-[#12151C] border border-[#1E2330] p-8 max-w-sm w-full text-center"
          style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
        >
          <p className="text-[#E8EDF4] uppercase tracking-wide mb-2" style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}>
            Link inválido o expirado
          </p>
          <p className="text-[#5B6478] text-xs mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Solicita un nuevo correo desde la pantalla de inicio de sesión.
          </p>
          <a href="/admin/login" className="text-[#00D9FF] text-xs uppercase tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Volver al login
          </a>
        </div>
      </div>
    )
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4">
        {fontLink}
        <div
          className="bg-[#12151C] border border-[#39FF88]/30 p-8 max-w-sm w-full text-center"
          style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
        >
          <p className="text-[#39FF88] uppercase tracking-wide" style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}>
            Contraseña actualizada
          </p>
          <p className="text-[#5B6478] text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Te llevamos al login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center px-4 relative overflow-hidden">
      {fontLink}
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
        <p className="text-[#00D9FF] text-xs tracking-[0.3em] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          TUCHAMBA EXPRESS
        </p>
        <h1 className="text-[#E8EDF4] text-2xl mb-8 uppercase tracking-wide" style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}>
          Nueva contraseña
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-[#5B6478] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={12}
                className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#00D9FF] transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                placeholder="8-12 caracteres, letras, números y símbolos"
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
          <div>
            <label className="block text-[10px] text-[#5B6478] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Confirmar contraseña
            </label>
            <input
              type={mostrarPassword ? 'text' : 'password'}
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              maxLength={12}
              className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2.5 text-sm focus:outline-none focus:border-[#00D9FF] transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              placeholder="Repite la contraseña"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ⚠ {error}
            </p>
          )}

          <button
            onClick={guardar}
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white py-2.5 text-sm uppercase tracking-[0.15em] transition-colors mt-2"
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </div>
      </div>
    </div>
  )
}
