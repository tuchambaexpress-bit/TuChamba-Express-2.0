'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Coordinador {
  id: string
  nombre: string
  email: string
  telefono: string | null
  status: string
}

interface Agencia {
  id: string
  nombre: string
  status: string
  created_at: string
  coordinadores: Coordinador[]
}

interface Props {
  agenciasIniciales: Agencia[]
}

const mono = { fontFamily: "'JetBrains Mono', monospace" }
const display = { fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }

export default function AgenciasPanel({ agenciasIniciales }: Props) {
  const router = useRouter()

  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [nombreAgencia, setNombreAgencia] = useState('')
  const [nombreCoordinador, setNombreCoordinador] = useState('')
  const [emailCoordinador, setEmailCoordinador] = useState('')
  const [telefonoCoordinador, setTelefonoCoordinador] = useState('')
  const [passwordCoordinador, setPasswordCoordinador] = useState('')
  const [verPasswordCoordinador, setVerPasswordCoordinador] = useState(false)
  const [creando, setCreando] = useState(false)
  const [errorCrear, setErrorCrear] = useState('')

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombreAgencia, setEditNombreAgencia] = useState('')
  const [editNombreCoordinador, setEditNombreCoordinador] = useState('')
  const [editTelefonoCoordinador, setEditTelefonoCoordinador] = useState('')

  const [loadingAccion, setLoadingAccion] = useState<string | null>(null)
  const [resetEnviado, setResetEnviado] = useState<Record<string, boolean>>({})

  async function crearAgencia() {
    if (!nombreAgencia.trim() || !nombreCoordinador.trim() || !emailCoordinador.trim()) {
      setErrorCrear('Nombre de agencia, nombre y email del coordinador son obligatorios.')
      return
    }
    if (!passwordCoordinador.trim()) {
      setErrorCrear('La contraseña temporal es obligatoria.')
      return
    }
    setCreando(true)
    setErrorCrear('')

    const res = await fetch('/api/admin/crear-agencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreAgencia: nombreAgencia.trim(),
        nombreCoordinador: nombreCoordinador.trim(),
        emailCoordinador: emailCoordinador.trim(),
        telefonoCoordinador: telefonoCoordinador.trim(),
        password: passwordCoordinador,
      }),
    })
    const data = await res.json()
    setCreando(false)

    if (!res.ok) {
      setErrorCrear(data.error ?? 'No se pudo crear la agencia.')
      return
    }

    setMostrarNuevo(false)
    setNombreAgencia('')
    setNombreCoordinador('')
    setEmailCoordinador('')
    setTelefonoCoordinador('')
    setPasswordCoordinador('')
    router.refresh()
  }

  function abrirEdicion(a: Agencia) {
    const coord = a.coordinadores?.[0]
    setEditandoId(a.id)
    setEditNombreAgencia(a.nombre)
    setEditNombreCoordinador(coord?.nombre ?? '')
    setEditTelefonoCoordinador(coord?.telefono ?? '')
  }

  async function guardarEdicion(a: Agencia) {
    const coord = a.coordinadores?.[0]
    setLoadingAccion(a.id)

    await fetch('/api/admin/actualizar-agencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agenciaId: a.id,
        coordinadorId: coord?.id ?? null,
        nombreAgencia: editNombreAgencia.trim(),
        nombreCoordinador: editNombreCoordinador.trim(),
        telefonoCoordinador: editTelefonoCoordinador.trim(),
      }),
    })

    setLoadingAccion(null)
    setEditandoId(null)
    router.refresh()
  }

  async function toggleActivo(a: Agencia) {
    const coord = a.coordinadores?.[0]
    const activar = a.status !== 'activa'
    setLoadingAccion(a.id)

    await fetch('/api/admin/actualizar-agencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agenciaId: a.id, coordinadorId: coord?.id ?? null, activar }),
    })

    setLoadingAccion(null)
    router.refresh()
  }

  async function resetearPassword(email: string, agenciaId: string) {
    setLoadingAccion(agenciaId)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/coordinador/reset-password`,
    })
    setLoadingAccion(null)

    if (error) {
      alert(`No se pudo enviar el correo: ${error.message}`)
      return
    }

    setResetEnviado(prev => ({ ...prev, [agenciaId]: true }))
    setTimeout(() => setResetEnviado(prev => ({ ...prev, [agenciaId]: false })), 4000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em]" style={mono}>
          {agenciasIniciales.length} agencia{agenciasIniciales.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setMostrarNuevo(v => !v)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wide px-4 py-2"
          style={{ ...display, clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          {mostrarNuevo ? 'Cancelar' : '+ Nueva agencia'}
        </button>
      </div>

      {mostrarNuevo && (
        <div
          className="bg-[#12151C] border border-[#00D9FF]/30 p-5 mb-6"
          style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[#E8EDF4] uppercase tracking-wide mb-4" style={display}>Nueva agencia</p>
          <div
            className="grid md:grid-cols-2 gap-3 mb-3"
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); crearAgencia() }
              if (e.key === 'Escape') { e.preventDefault(); setMostrarNuevo(false) }
            }}
          >
            <div>
              <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                Nombre de la agencia
              </label>
              <input
                value={nombreAgencia}
                onChange={e => setNombreAgencia(e.target.value)}
                className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                style={mono}
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                Nombre del coordinador
              </label>
              <input
                value={nombreCoordinador}
                onChange={e => setNombreCoordinador(e.target.value)}
                className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                style={mono}
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                Email del coordinador
              </label>
              <input
                type="email"
                value={emailCoordinador}
                onChange={e => setEmailCoordinador(e.target.value)}
                className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                style={mono}
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                Teléfono (opcional)
              </label>
              <input
                value={telefonoCoordinador}
                onChange={e => setTelefonoCoordinador(e.target.value)}
                className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                style={mono}
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                Contraseña temporal *
              </label>
              <div className="relative">
                <input
                  type={verPasswordCoordinador ? 'text' : 'password'}
                  value={passwordCoordinador}
                  onChange={e => setPasswordCoordinador(e.target.value)}
                  maxLength={12}
                  placeholder="8-12 caracteres, letras, números y símbolos"
                  className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[#00D9FF]"
                  style={mono}
                />
                <button
                  type="button"
                  onClick={() => setVerPasswordCoordinador(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <img
                    src={verPasswordCoordinador ? '/ojo-abierto.png' : '/ojo-cerrado.png'}
                    alt=""
                    className="w-4 h-4"
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }}
                  />
                </button>
              </div>
              <p className="text-[10px] text-[#5B6478] mt-1" style={mono}>
                Compártesela tú al coordinador — él puede cambiarla cuando quiera con "¿Olvidaste tu contraseña?".
              </p>
            </div>
          </div>
          {errorCrear && <p className="text-red-400 text-xs mb-3" style={mono}>⚠ {errorCrear}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarNuevo(false)}
              className="border border-[#1E2330] text-[#5B6478] hover:border-[#00D9FF] hover:text-[#00D9FF] text-xs uppercase tracking-wide px-4 py-2 transition-colors"
              style={mono}
            >
              Cancelar
            </button>
            <button
              onClick={crearAgencia}
              disabled={creando}
              className="bg-[#39FF88] hover:bg-[#2ee073] disabled:opacity-50 text-[#0B0D12] text-xs uppercase tracking-wide px-4 py-2 font-semibold"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              {creando ? 'Creando...' : 'Crear agencia + coordinador'}
            </button>
          </div>
          <p className="text-[10px] text-[#5B6478] mt-2" style={mono}>
            El coordinador recibirá un correo para establecer su propia contraseña.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {agenciasIniciales.map(a => {
          const coord = a.coordinadores?.[0]
          const editando = editandoId === a.id
          const activa = a.status === 'activa'

          return (
            <div
              key={a.id}
              className="bg-[#12151C] border border-[#1E2330] p-5"
              style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              {editando ? (
                <div
                  className="space-y-3"
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); guardarEdicion(a) }
                    if (e.key === 'Escape') { e.preventDefault(); setEditandoId(null) }
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                        Nombre de la agencia
                      </label>
                      <input
                        value={editNombreAgencia}
                        onChange={e => setEditNombreAgencia(e.target.value)}
                        className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                        style={mono}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                        Nombre del coordinador
                      </label>
                      <input
                        value={editNombreCoordinador}
                        onChange={e => setEditNombreCoordinador(e.target.value)}
                        className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                        style={mono}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                        Teléfono del coordinador
                      </label>
                      <input
                        value={editTelefonoCoordinador}
                        onChange={e => setEditTelefonoCoordinador(e.target.value)}
                        className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                        style={mono}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>
                        Email (fijo)
                      </label>
                      <input
                        value={coord?.email ?? ''}
                        disabled
                        className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#5B6478] px-3 py-2 text-sm opacity-60 cursor-not-allowed"
                        style={mono}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditandoId(null)}
                      className="border border-[#1E2330] text-[#5B6478] hover:border-[#00D9FF] hover:text-[#00D9FF] text-xs uppercase tracking-wide px-4 py-2 transition-colors"
                      style={mono}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => guardarEdicion(a)}
                      disabled={loadingAccion === a.id}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs uppercase tracking-wide px-4 py-2"
                      style={display}
                    >
                      {loadingAccion === a.id ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[#E8EDF4] uppercase tracking-wide" style={display}>{a.nombre}</h3>
                      <p className="text-[10px] text-[#5B6478] mt-1" style={mono}>
                        Desde {new Date(a.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 uppercase tracking-wide ${activa ? 'text-[#39FF88] border border-[#39FF88]/30' : 'text-red-400 border border-red-400/30'}`}
                      style={mono}
                    >
                      {activa ? '● Activa' : '○ Inactiva'}
                    </span>
                  </div>

                  {coord && (
                    <div className="bg-[#0B0D12] border border-[#1E2330] p-3 mb-4">
                      <p className="text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>Coordinador</p>
                      <p className="text-[#E8EDF4]">{coord.nombre}</p>
                      <p className="text-sm text-[#8B94A8]" style={mono}>{coord.email}</p>
                      {coord.telefono && <p className="text-sm text-[#8B94A8]" style={mono}>{coord.telefono}</p>}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => abrirEdicion(a)}
                      className="border border-[#1E2330] text-[#8B94A8] hover:border-[#00D9FF] hover:text-[#00D9FF] text-[10px] uppercase tracking-wide px-3 py-1.5 transition-colors"
                      style={mono}
                    >
                      Editar
                    </button>
                    {coord && (
                      <button
                        onClick={() => resetearPassword(coord.email, a.id)}
                        disabled={loadingAccion === a.id}
                        className="border border-[#1E2330] text-[#8B94A8] hover:border-[#00D9FF] hover:text-[#00D9FF] disabled:opacity-50 text-[10px] uppercase tracking-wide px-3 py-1.5 transition-colors"
                        style={mono}
                      >
                        {resetEnviado[a.id] ? '✓ Correo enviado' : 'Resetear contraseña'}
                      </button>
                    )}
                    <button
                      onClick={() => toggleActivo(a)}
                      disabled={loadingAccion === a.id}
                      className={`text-[10px] uppercase tracking-wide px-3 py-1.5 transition-colors disabled:opacity-50 ${
                        activa
                          ? 'border border-red-400/40 text-red-400 hover:bg-red-400/10'
                          : 'border border-[#39FF88]/40 text-[#39FF88] hover:bg-[#39FF88]/10'
                      }`}
                      style={mono}
                    >
                      {loadingAccion === a.id ? '...' : activa ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}

        {agenciasIniciales.length === 0 && (
          <div
            className="bg-[#12151C] border border-[#1E2330] p-10 text-center"
            style={{ clipPath: 'polygon(0 14px, 14px 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            <p className="text-[#5B6478] text-sm" style={mono}>No hay agencias activas todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}
